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

// Natural Earth gives some regions the same ISO 3166-2 code, for example a
// city and the province around it. Fixing this changes region IDs, so it waits
// for a maintainer decision. The list must match the data exactly, so new
// duplicates fail and fixed ones must be removed from here.
const KNOWN_DUPLICATE_IDS: Record<string, string[]> = {
  croatia: ["HR-12"],
  iran: ["IR-07"],
  ireland: ["IE-CO", "IE-D", "IE-G", "IE-LK", "IE-TA", "IE-WD"],
  kazakhstan: ["KZ-ALA"],
  latvia: ["LV-DGV", "LV-JEL", "LV-JKB", "LV-REZ", "LV-VEN"],
  peru: ["PE-LIM"],
  philippines: [
    "PH-AGN", "PH-BEN", "PH-CAS", "PH-CEB", "PH-DAV", "PH-ILI", "PH-ISA", "PH-LAN", "PH-LEY",
    "PH-MNL", "PH-MSR", "PH-NCO", "PH-PAM", "PH-PAN", "PH-PLW", "PH-QUE", "PH-SCO", "PH-ZAN", "PH-ZMB",
  ],
  slovenia: ["SI-054"],
};

// Natural Earth feature without a name. Same decision as above.
const KNOWN_UNNAMED_IDS: Record<string, string[]> = {
  mexico: ["MX-X01~"],
};

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

  it("has non-empty, unique region ids and non-empty names", () => {
    const counts = new Map<string, number>();
    for (const { id } of country.regions) counts.set(id, (counts.get(id) ?? 0) + 1);
    const duplicates = [...counts].filter(([, n]) => n > 1).map(([id]) => id).sort();
    expect(duplicates).toEqual(KNOWN_DUPLICATE_IDS[folder] ?? []);

    const unnamed = country.regions.filter((r) => !r.name.trim()).map((r) => r.id);
    expect(unnamed).toEqual(KNOWN_UNNAMED_IDS[folder] ?? []);

    for (const { id } of country.regions) expect(id.trim()).not.toBe("");
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
