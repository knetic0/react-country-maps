// Auto-generated: pnpm build:country FR france 8%
// Source: Natural Earth (public domain) — do not edit manually, re-run the script instead
import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const france = defineCountry({
  id: "FR",
  name: "France",
  viewBox: { left: 0, top: 0, width: 1000, height: 977 },
  regions,
});

export default france;
