// Auto-generated: pnpm build:country CA canada 8%
// Source: Natural Earth (public domain) — do not edit manually, re-run the script instead
import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const canada = defineCountry({
  id: "CA",
  name: "Canada",
  viewBox: { left: 0, top: 0, width: 1001, height: 1303 },
  regions,
});

export default canada;
