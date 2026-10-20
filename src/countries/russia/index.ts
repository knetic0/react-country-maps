// Auto-generated: pnpm build:country RU russia 5%
// Source: Natural Earth (public domain) — do not edit manually, re-run the script instead
import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const russia = defineCountry({
  id: "RU",
  name: "Russia",
  viewBox: { left: -1, top: -1, width: 1002, height: 605 },
  regions,
});

export default russia;
