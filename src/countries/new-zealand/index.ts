// Auto-generated: pnpm build:country NZ new-zealand 8%
// Source: Natural Earth (public domain) — do not edit manually, re-run the script instead
import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const newZealand = defineCountry({
  id: "NZ",
  name: "New Zealand",
  viewBox: { left: -1, top: 0, width: 1001, height: 1404 },
  regions,
});

export default newZealand;
