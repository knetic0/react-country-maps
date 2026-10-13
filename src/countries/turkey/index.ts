import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const turkey = defineCountry({
    id: "TR",
    name: "Turkey",
    viewBox: { left: 0, top: 80, width: 1050, height: 585 },
    regions,
    // The Turkey paths already have gaps between provinces
    borderWidth: 0,
})

export default turkey;