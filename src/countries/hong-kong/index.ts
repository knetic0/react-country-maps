// Auto-generated: pnpm build:country HK hong-kong 8%
// Source: Natural Earth (public domain) — do not edit manually, re-run the script instead
import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const hongKong = defineCountry({
  id: "HK",
  name: "Hong Kong S.A.R.",
  viewBox: { left: 0, top: 0, width: 1000, height: 786 },
  regions,
});

export default hongKong;
