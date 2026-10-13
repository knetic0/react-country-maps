// Auto-generated: pnpm build:country DE germany 8%
// Source: Natural Earth (public domain) — do not edit manually, re-run the script instead
import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const germany = defineCountry({
  id: "DE",
  name: "Germany",
  viewBox: { left: -1, top: -1, width: 1001, height: 1342 },
  regions,
});

export default germany;
