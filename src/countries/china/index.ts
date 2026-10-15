// Auto-generated: pnpm build:country CN china 8%
// Source: Natural Earth (public domain) — do not edit manually, re-run the script instead
import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const china = defineCountry({
  id: "CN",
  name: "China",
  viewBox: { left: 0, top: 0, width: 1000, height: 780 },
  regions,
});

export default china;
