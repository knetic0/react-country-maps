import { defineCountry } from "../../utils/defineCountry";
import regions from "./regions";

const turkey = defineCountry({
    id: "TR",
    name: "Turkey",
    viewBox: "0 0 512 512",
    regions
})

export default turkey;