// Auto-generated: pnpm build:country CZ czechia 8%
// Source: Natural Earth (public domain) — do not edit manually, re-run the script instead
import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const czechia = defineCountry({
  id: "CZ",
  name: "Czech Republic",
  viewBox: { left: 0, top: 0, width: 1000, height: 571 },
  regions,
});

export default czechia;
