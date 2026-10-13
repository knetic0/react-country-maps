import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, Geometry, Position } from "geojson";

const [iso, folder, simplify = "8%"] = process.argv.slice(2);

if (!iso || !folder) {
  console.error("Using: pnpm build:country <ISO_A2> <folder> [simplify]");
  console.error("Example:    pnpm build:country DE germany 8%");
  process.exit(1);
}

const SOURCE = resolve("raw/ne_10m_admin_1_states_provinces.shp");
const TMP_DIR = resolve("raw/tmp");
const TMP_FILE = resolve(TMP_DIR, `${iso}.geojson`);
const OUT_DIR = resolve("src/countries", folder);
const WIDTH = 1000;

const varName = folder.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

mkdirSync(TMP_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

execFileSync(
  resolve("node_modules/.bin/mapshaper"),
  [
    SOURCE,
    "-filter", `iso_a2 == "${iso}"`,
    "-filter-fields", "iso_3166_2,name,admin",
    "-simplify", simplify, "keep-shapes",
    "-o", "format=geojson", TMP_FILE,
  ],
  { stdio: "inherit" }
);

type Props = { iso_3166_2: string; name: string; admin: string };
const fc = JSON.parse(readFileSync(TMP_FILE, "utf8")) as FeatureCollection<Geometry, Props>;

if (fc.features.length === 0) {
  console.error(`"${iso}" not found in ${SOURCE}`);
  process.exit(1);
}

const countryName = fc.features[0].properties.admin;

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
  width: Math.ceil(x1 - x0),
  height: Math.ceil(y1 - y0),
};

const regions = fc.features
  .map((f) => ({
    id: f.properties.iso_3166_2,
    name: f.properties.name,
    path: path(f) ?? "",
  }))
  .filter((r) => r.path.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

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

writeFileSync(resolve(OUT_DIR, "regions.ts"), regionsContent);
writeFileSync(resolve(OUT_DIR, "index.ts"), indexContent);

const sizeKb = (Buffer.byteLength(regionsContent) / 1024).toFixed(1);
console.log(`✓ ${countryName}: ${regions.length} bölge → src/countries/${folder}/ (${sizeKb} KB)`);