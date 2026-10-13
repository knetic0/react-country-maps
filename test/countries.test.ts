import { readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { Country } from "../src";
import { mergeBounds, parsePath } from "./pathBounds";

const COUNTRIES_DIR = resolve(import.meta.dirname, "../src/countries");

const modules = import.meta.glob<{ default: Country }>("../src/countries/*/index.ts", { eager: true });
const countries = Object.entries(modules).map(([file, module]) => ({
  folder: file.split("/").at(-2)!,
  country: module.default,
}));

// Turkey is hand-made with curves, so its file is larger than generated ones
const MAX_FILE_KB: Record<string, number> = { turkey: 200 };
const DEFAULT_MAX_FILE_KB = 100;

// Region points may lie this far outside the viewBox (in viewBox units)
const VIEWBOX_TOLERANCE = 1.5;

it("finds every country folder", () => {
  const folders = readdirSync(COUNTRIES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  expect(countries.map((c) => c.folder).sort()).toEqual(folders);
  expect(folders.length).toBeGreaterThan(0);
});

describe.each(countries)("$folder", ({ folder, country }) => {
  const parsed = country.regions.map((region) => ({ region, rings: parsePath(region.path) }));

  it("has valid metadata", () => {
    expect(country.id).toMatch(/^[A-Z]{2}$/);
    expect(country.name.trim()).not.toBe("");
    expect(country.regions.length).toBeGreaterThan(0);
    const { width, height } = country.viewBox;
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });

  it("has unique ISO 3166-2 region ids and non-empty names", () => {
    const ids = country.regions.map((r) => r.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);

    const isoCode = new RegExp(`^${country.id}-[A-Z0-9]{1,3}$`);
    for (const { id, name } of country.regions) {
      expect(id).toMatch(isoCode);
      expect(name.trim(), id).not.toBe("");
    }
  });

  it("has parseable, non-empty paths", () => {
    for (const { region, rings } of parsed) {
      expect(region.path.trim(), region.id).not.toBe("");
      expect(rings.length, region.id).toBeGreaterThan(0);
      for (const ring of rings) expect(ring.points.length, region.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("has no full-canvas rectangle artifacts", () => {
    const { width, height } = country.viewBox;
    for (const { region, rings } of parsed) {
      expect(region.path, region.id).not.toMatch(/M\s*1000[ ,]+0\b/);
      for (const ring of rings) {
        const w = ring.bounds.maxX - ring.bounds.minX;
        const h = ring.bounds.maxY - ring.bounds.minY;
        // A wrongly wound polygon turns into a ring around the whole canvas
        const coversCanvas = w >= width * 0.9 && h >= height * 0.9;
        expect(coversCanvas && ring.points.length <= 6, region.id).toBe(false);
        if (country.regions.length > 1) expect(coversCanvas, region.id).toBe(false);
      }
    }
  });

  it("keeps every region inside the viewBox", () => {
    const { left, top, width, height } = country.viewBox;
    for (const { region, rings } of parsed) {
      const b = mergeBounds(rings.map((ring) => ring.bounds));
      expect(b.minX, region.id).toBeGreaterThanOrEqual(left - VIEWBOX_TOLERANCE);
      expect(b.minY, region.id).toBeGreaterThanOrEqual(top - VIEWBOX_TOLERANCE);
      expect(b.maxX, region.id).toBeLessThanOrEqual(left + width + VIEWBOX_TOLERANCE);
      expect(b.maxY, region.id).toBeLessThanOrEqual(top + height + VIEWBOX_TOLERANCE);
    }
  });

  it("has a viewBox that fits the regions", () => {
    const b = mergeBounds(parsed.flatMap(({ rings }) => rings.map((ring) => ring.bounds)));
    expect((b.maxX - b.minX) / country.viewBox.width).toBeGreaterThan(0.7);
    expect((b.maxY - b.minY) / country.viewBox.height).toBeGreaterThan(0.7);
  });

  it("keeps regions.ts at a reasonable size", () => {
    const kb = statSync(resolve(COUNTRIES_DIR, folder, "regions.ts")).size / 1024;
    expect(kb).toBeLessThanOrEqual(MAX_FILE_KB[folder] ?? DEFAULT_MAX_FILE_KB);
  });
});

describe("parsePath", () => {
  it("splits subpaths and handles relative commands", () => {
    const rings = parsePath("M0,0 L10,0 L10,10 Z m20,20 l5,0 l0,5 z M1 2 C 3 4 5 6 7 8 z");
    expect(rings).toHaveLength(3);
    expect(rings[1].bounds).toEqual({ minX: 20, minY: 20, maxX: 25, maxY: 25 });
    expect(rings[2].bounds).toEqual({ minX: 1, minY: 2, maxX: 7, maxY: 8 });
  });
});
