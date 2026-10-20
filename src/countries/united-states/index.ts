// Auto-generated: pnpm build:country US united-states 8%
// Source: Natural Earth (public domain) — do not edit manually, re-run the script instead
import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const unitedStates = defineCountry({
  id: "US",
  name: "United States of America",
  viewBox: { left: -1, top: 0, width: 1049, height: 555 },
  regions,
});

export default unitedStates;
