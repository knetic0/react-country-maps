import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, Geometry, Position } from "geojson";
import { FEATURE_FIXES, MERGED_NAMES } from "./region-overrides.ts";

// "pnpm build:country -- DE germany" forwards the "--", so drop it
const [iso, folder, simplify = "8%"] = process.argv.slice(2).filter((arg) => arg !== "--");

const usage = () => {
  console.error("Usage:   pnpm build:country <ISO_A2> <folder> [simplify]");
  console.error("Example: pnpm build:country DE germany 8%");
  process.exit(1);
};

if (!iso || !folder) usage();
if (!/^[A-Z]{2}$/.test(iso)) {
  console.error(`Invalid ISO code "${iso}". Use two uppercase letters, for example DE.`);
  usage();
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(folder)) {
  console.error(`Invalid folder "${folder}". Use lowercase kebab-case, for example south-korea.`);
  usage();
}
if (!/^\d+(\.\d+)?%$/.test(simplify)) {
  console.error(`Invalid simplify value "${simplify}". Use a percentage, for example 8%.`);
  usage();
}

const SOURCE = resolve("raw/ne_10m_admin_1_states_provinces.shp");
const TMP_DIR = resolve("raw/tmp");
const TMP_FILE = resolve(TMP_DIR, `${iso}.geojson`);
const FIXED_FILE = resolve(TMP_DIR, `${iso}.fixed.geojson`);
const MERGED_FILE = resolve(TMP_DIR, `${iso}.merged.geojson`);
const MAPSHAPER = resolve("node_modules/.bin/mapshaper");
const OUT_DIR = resolve("src/countries", folder);
const WIDTH = 1000;

const varName = folder.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

mkdirSync(TMP_DIR, { recursive: true });

try {
  execFileSync(
    MAPSHAPER,
    [
      SOURCE,
      "-filter", `iso_a2 == "${iso}"`,
      "-filter-fields", "iso_3166_2,adm1_code,name,admin",
      "-simplify", simplify, "keep-shapes",
      "-o", "format=geojson", TMP_FILE,
    ],
    { stdio: "inherit" }
  );
} catch {
  // mapshaper fails on an empty selection, so an unknown ISO code ends up here
  console.error(`mapshaper failed. Check that "${iso}" exists in ${SOURCE}.`);
  process.exit(1);
}

type Props = { iso_3166_2: string; adm1_code: string; name: string; admin: string };
const readCollection = (file: string) =>
  JSON.parse(readFileSync(file, "utf8")) as FeatureCollection<Geometry, Props>;
let fc = readCollection(TMP_FILE);

if (fc.features.length === 0) {
  console.error(`"${iso}" not found in ${SOURCE}`);
  process.exit(1);
}

const countryName = fc.features[0].properties.admin;

// Fix the ISO codes that Natural Earth gets wrong (see region-overrides.ts)
for (const { properties } of fc.features) {
  const fix = FEATURE_FIXES[properties.adm1_code] ?? FEATURE_FIXES[properties.iso_3166_2];
  if (!fix) continue;
  properties.iso_3166_2 = fix.id ?? properties.iso_3166_2;
  properties.name = fix.name ?? properties.name;
}

// Features that still share a code are parts of one subdivision, for example
// a county split into councils. Merge them, so every id is a single region.
const ids = fc.features.map((f) => f.properties.iso_3166_2);
if (new Set(ids).size < ids.length) {
  writeFileSync(FIXED_FILE, JSON.stringify(fc));
  execFileSync(
    MAPSHAPER,
    [
      FIXED_FILE,
      // Sort by area, so a merged region gets the name of its largest part
      "-each", "area_m2 = this.area",
      "-sort", "area_m2", "descending",
      "-dissolve", "iso_3166_2", "copy-fields=name,admin",
      "-o", "format=geojson", MERGED_FILE,
    ],
    { stdio: "inherit" }
  );
  fc = readCollection(MERGED_FILE);
  for (const { properties } of fc.features) {
    properties.name = MERGED_NAMES[properties.iso_3166_2] ?? properties.name;
  }
}

const ringArea = (ring: Position[]) => {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    sum += x1 * y2 - x2 * y1;
  }
  return sum / 2;
};

const rewindPolygon = (rings: Position[][]) =>
  rings.map((ring, i) => {
    const area = ringArea(ring);
    const isExterior = i === 0;
    const needsReverse = isExterior ? area > 0 : area < 0;
    return needsReverse ? [...ring].reverse() : ring;
  });

for (const feature of fc.features) {
  const geometry = feature.geometry;
  if (geometry.type === "Polygon") {
    geometry.coordinates = rewindPolygon(geometry.coordinates);
  } else if (geometry.type === "MultiPolygon") {
    geometry.coordinates = geometry.coordinates.map(rewindPolygon);
  }
}

const projection = geoMercator().fitWidth(WIDTH, fc);
const path = geoPath(projection).digits(1);
const [[x0, y0], [x1, y1]] = path.bounds(fc);

const viewBox = {
  left: Math.floor(x0),
  top: Math.floor(y0),
  // Round the far edge up on its own, so the viewBox contains every point
  width: Math.ceil(x1) - Math.floor(x0),
  height: Math.ceil(y1) - Math.floor(y0),
};

const regions = fc.features
  .map((f) => ({
    id: f.properties.iso_3166_2,
    name: f.properties.name,
    path: path(f) ?? "",
  }))
  .filter((r) => r.path.length > 0)
  // Fixed locale, so the order does not depend on the machine running the script
  .sort((a, b) => a.name.localeCompare(b.name, "en") || a.id.localeCompare(b.id, "en"));

// Natural Earth reuses some ISO 3166-2 codes (for example a city and the
// province around it). Warn, so the problem is visible before a release.
const seenIds = new Set<string>();
for (const region of regions) {
  if (!region.id || !region.name) {
    console.warn(`! Region with empty id or name: ${JSON.stringify({ id: region.id, name: region.name })}`);
  }
  if (seenIds.has(region.id)) console.warn(`! Duplicate region id: ${region.id} (${region.name})`);
  seenIds.add(region.id);
}

const header = `// Auto-generated: pnpm build:country ${iso} ${folder} ${simplify}
// Source: Natural Earth (public domain) — do not edit manually, re-run the script instead`;

const regionsContent = `${header}
import type { Region } from "../../core/types";

export default ${JSON.stringify(regions, null, 2)} satisfies Region[];
`;

const indexContent = `${header}
import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const ${varName} = defineCountry({
  id: "${iso}",
  name: "${countryName}",
  viewBox: { left: ${viewBox.left}, top: ${viewBox.top}, width: ${viewBox.width}, height: ${viewBox.height} },
  regions,
});

export default ${varName};
`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(resolve(OUT_DIR, "regions.ts"), regionsContent);
writeFileSync(resolve(OUT_DIR, "index.ts"), indexContent);

const sizeKb = (Buffer.byteLength(regionsContent) / 1024).toFixed(1);
console.log(`✓ ${countryName}: ${regions.length} regions → src/countries/${folder}/ (${sizeKb} KB)`);