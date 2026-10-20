import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import {
  EXCLUDED_REGIONS,
  FEATURE_FIXES,
  INSETS,
  MERGED_NAMES,
  PLACEHOLDER_COUNTRIES,
  PROJECTION_CENTERS,
} from "./region-overrides.ts";

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

// Filter before simplifying, so excluded regions do not use up the vertex budget.
// Every code applies, because some regions carry the code of another country.
const filter = [
  `iso_a2 == "${iso}"`,
  ...EXCLUDED_REGIONS.map((code) => `iso_3166_2 != "${code}"`),
].join(" && ");

mkdirSync(TMP_DIR, { recursive: true });

try {
  execFileSync(
    MAPSHAPER,
    [
      SOURCE,
      "-filter", filter,
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

if (PLACEHOLDER_COUNTRIES.includes(iso)) {
  for (const { properties } of fc.features) properties.iso_3166_2 = properties.iso_3166_2.replace(/~$/, "");
}

type RegionFeature = Feature<Geometry, Props>;
type Bounds = [[number, number], [number, number]];

const polygonsOf = (geometry: Geometry): Position[][][] =>
  geometry.type === "Polygon" ? [geometry.coordinates] : geometry.type === "MultiPolygon" ? geometry.coordinates : [];

// A polygon is inside the bounds when its first point is
const isInBounds = ([[[lon, lat]]]: Position[][], [[west, south], [east, north]]: Bounds) =>
  lon >= west && lon <= east && lat >= south && lat <= north;

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

// Split a region into the polygons that stay on the main map and the
// polygons that move to its inset (see INSETS in region-overrides.ts)
const splitInset = (f: RegionFeature): { main: RegionFeature | null; inset: RegionFeature | null } => {
  const inset = INSETS[f.properties.iso_3166_2];
  if (!inset) return { main: f, inset: null };
  const { bounds } = inset;
  if (!bounds) return { main: null, inset: f };

  const polygons = polygonsOf(f.geometry);
  const part = (coordinates: Position[][][]): RegionFeature | null =>
    coordinates.length > 0 ? { ...f, geometry: { type: "MultiPolygon", coordinates } } : null;
  return {
    main: part(polygons.filter((p) => !isInBounds(p, bounds))),
    inset: part(polygons.filter((p) => isInBounds(p, bounds))),
  };
};

const parts = fc.features.map((feature) => ({ feature, ...splitInset(feature) }));

// Fit the projection to the main map only. Insets get their own projection
// and move next to it.
const mainFc: FeatureCollection<Geometry, Props> = {
  ...fc,
  features: parts.flatMap(({ main }) => (main ? [main] : [])),
};
const projection = geoMercator();
if (iso in PROJECTION_CENTERS) projection.rotate([-PROJECTION_CENTERS[iso], 0]);
projection.fitWidth(WIDTH, mainFc);
const mainPath = geoPath(projection).digits(1);
const [[mainX0, mainY0], [mainX1, mainY1]] = mainPath.bounds(mainFc);

const insetParts = parts.flatMap(({ inset }) => (inset ? [inset] : []));

const insetPath = (f: RegionFeature) => {
  const inset = INSETS[f.properties.iso_3166_2];
  const insetProjection = geoMercator()
    .rotate([-inset.center, 0])
    .scale(projection.scale() * inset.scale)
    .translate([0, 0]);
  // Regions that share one inset object move as a group, so they keep their
  // places relative to each other
  const group: FeatureCollection<Geometry, Props> = {
    type: "FeatureCollection",
    features: insetParts.filter((part) => INSETS[part.properties.iso_3166_2] === inset),
  };
  const [[ix0, iy0]] = geoPath(insetProjection).bounds(group);
  const [px, py] = inset.position;
  insetProjection.translate([
    mainX0 + px * (mainX1 - mainX0) - ix0,
    mainY0 + py * (mainY1 - mainY0) - iy0,
  ]);
  return geoPath(insetProjection).digits(1);
};

const drawn = parts.map(({ feature, main, inset }) => ({
  feature,
  pieces: [
    ...(main ? [{ path: mainPath, part: main }] : []),
    ...(inset ? [{ path: insetPath(inset), part: inset }] : []),
  ],
}));

let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
for (const { path, part } of drawn.flatMap(({ pieces }) => pieces)) {
  const [[fx0, fy0], [fx1, fy1]] = path.bounds(part);
  [x0, y0, x1, y1] = [Math.min(x0, fx0), Math.min(y0, fy0), Math.max(x1, fx1), Math.max(y1, fy1)];
}

const viewBox = {
  left: Math.floor(x0),
  top: Math.floor(y0),
  // Round the far edge up on its own, so the viewBox contains every point
  width: Math.ceil(x1) - Math.floor(x0),
  height: Math.ceil(y1) - Math.floor(y0),
};

const regions = drawn
  .map(({ feature, pieces }) => ({
    id: feature.properties.iso_3166_2,
    name: feature.properties.name,
    path: pieces.map(({ path, part }) => path(part) ?? "").join(""),
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