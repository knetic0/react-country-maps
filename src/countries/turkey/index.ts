import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const turkey = defineCountry({
    id: "TR",
    name: "Turkey",
    viewBox: { left: 0, top: 80, width: 1050, height: 585 },
    regions,
})

export default turkey;