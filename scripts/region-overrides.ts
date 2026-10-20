// Corrections for Natural Earth admin-1 data. build-country.ts applies them
// before it writes a country, so every region gets one unique ISO 3166-2 id.

interface Fix {
  id?: string;
  name?: string;
}

/**
 * Features with a wrong or reused ISO 3166-2 code. The key is the Natural Earth
 * `adm1_code` of one feature, or an `iso_3166_2` value to fix every feature
 * that has it.
 */
export const FEATURE_FIXES: Record<string, Fix> = {
  // Australia: Jervis Bay Territory has no code. The laws of the Australian
  // Capital Territory (AU-ACT) apply there.
  "AU-X02~": { id: "AU-ACT" },
  // Australia: Macquarie Island has no code. It is part of Tasmania (AU-TAS).
  "AU-X03~": { id: "AU-TAS" },
  // Azerbaijan: Şuşa city has no code. It lies inside Şuşa District (AZ-SUS).
  "AZ-X01~": { id: "AZ-SUS" },
  // Bahamas: New Providence has no code in Natural Earth
  "BS-X01~": { id: "BS-NP" },
  // Bosnia and Herzegovina: ISO deleted the canton codes in 2015 and keeps only
  // the entities. Posavina Canton has the code of Republika Srpska, but it is
  // part of the Federation (BA-BIH). The regions of Republika Srpska have no codes.
  "BIH-3153": { id: "BA-BIH" },
  "BA-X01~": { id: "BA-SRP" },
  "BA-X02~": { id: "BA-SRP" },
  "BA-X03~": { id: "BA-SRP" },
  "BA-X04~": { id: "BA-SRP" },
  "BA-X05~": { id: "BA-SRP" },
  "BA-X06~": { id: "BA-SRP" },
  "BA-X07~": { id: "BA-SRP" },
  // Chad: Natural Earth has one Ennedi region. ISO splits it into Ennedi-Est
  // (TD-EE) and Ennedi-Ouest (TD-EO), so it gets the code of the larger part.
  "TD-X01~": { id: "TD-EO" },
  // Iran: Natural Earth uses the codes from before ISO renumbered every
  // province in 2020, and gives Alborz the old code of Tehran (IR-07)
  "IRN-3231": { id: "IR-00" }, // Markazi
  "IRN-3240": { id: "IR-01" }, // Gilan
  "IRN-3214": { id: "IR-02" }, // Mazandaran
  "IRN-3238": { id: "IR-03" }, // East Azarbaijan
  "IRN-3237": { id: "IR-04" }, // West Azarbaijan
  "IRN-3239": { id: "IR-05" }, // Kermanshah
  "IRN-3219": { id: "IR-06" }, // Khuzestan
  "IRN-3212": { id: "IR-07" }, // Fars
  "IRN-3248": { id: "IR-08" }, // Kerman
  "IRN-3245": { id: "IR-09" }, // Razavi Khorasan
  "IRN-3211": { id: "IR-10" }, // Esfahan
  "IRN-3247": { id: "IR-11" }, // Sistan and Baluchestan
  "IRN-3241": { id: "IR-12" }, // Kordestan
  "IRN-3233": { id: "IR-13" }, // Hamadan
  "IRN-3218": { id: "IR-14" }, // Chahar Mahall and Bakhtiari
  "IRN-3220": { id: "IR-15" }, // Lorestan
  "IRN-3221": { id: "IR-16" }, // Ilam
  "IRN-3209": { id: "IR-17" }, // Kohgiluyeh and Buyer Ahmad
  "IRN-3210": { id: "IR-18" }, // Bushehr
  "IRN-3234": { id: "IR-19" }, // Zanjan
  "IRN-3215": { id: "IR-20" }, // Semnan
  "IRN-3217": { id: "IR-21" }, // Yazd
  "IRN-3228": { id: "IR-22" }, // Hormozgan
  "IRN-3216": { id: "IR-23" }, // Tehran
  "IRN-3230": { id: "IR-24" }, // Ardebil
  "IRN-3232": { id: "IR-25" }, // Qom
  "IRN-3235": { id: "IR-26" }, // Qazvin
  "IRN-3213": { id: "IR-27" }, // Golestan
  "IRN-3246": { id: "IR-28" }, // North Khorasan
  "IRN-3244": { id: "IR-29" }, // South Khorasan
  "IRN-5490": { id: "IR-30" }, // Alborz
  // Kazakhstan: Almaty Region reuses the code of Almaty City (KZ-ALA)
  "KAZ-3207": { id: "KZ-ALM" },
  // Latvia: municipalities reuse the codes of the cities they surround
  "LVA-1081": { id: "LV-025", name: "Daugavpils Municipality" },
  "LVA-1084": { id: "LV-041", name: "Jelgava Municipality" },
  "LVA-5725": { id: "LV-042", name: "Jekabpils Municipality" },
  "LVA-1066": { id: "LV-077", name: "Rezekne Municipality" },
  "LVA-934": { id: "LV-106", name: "Ventspils Municipality" },
  // Liberia: the two newest counties have no codes
  "LR-X1~": { id: "LR-GP", name: "Gbarpolu" },
  "LR-X2~": { id: "LR-RG" },
  // Mexico: Alacranes Reef has no name or code. It is part of Yucatán.
  "MEX+99?": { id: "MX-YUC" },
  // Peru: Lima Province reuses the code of Lima Region (PE-LIM)
  "PER-587": { id: "PE-LMA" },
  // Philippines: PH-MNL is not an ISO 3166-2 code. Metro Manila is PH-00.
  "PH-MNL": { id: "PH-00" },
  // Tajikistan: the districts under republic subordination have no code
  "TJ-X01~": { id: "TJ-RA", name: "Districts of Republican Subordination" },
};

/**
 * Codes of regions to leave out of a map: ISO 3166-2 codes, or the Natural
 * Earth placeholders (ending in "~") of regions that have no ISO code. The
 * script removes them before it simplifies the shapes.
 */
export const EXCLUDED_REGIONS: string[] = [
  // Australia: Ashmore and Cartier Islands is an external territory, not a
  // state, and has no code
  "AU-X04~",
  // China: the Paracel Islands are disputed and have no code
  "CN-X01~",
  // Syria: the UN buffer zone in the Golan Heights is not a governorate
  "SY-X01~",
  // United Arab Emirates: jointly controlled zones (Fujairah and Sharjah,
  // Ajman and Oman) have no code
  "AE-X01~",
  "AE-X02~",
];

interface Inset {
  /** Longitude to center the projection on, so a region that crosses the antimeridian stays in one piece */
  center: number;
  /** Size, relative to the scale of the main map */
  scale: number;
  /**
   * Position of the inset's top-left corner, as a fraction of the main map's
   * width and height. [1, 1] is the bottom-right corner of the main map.
   */
  position: [number, number];
  /**
   * Only the polygons inside these [[west, south], [east, north]] bounds move
   * to the inset, and the rest of the region stays on the main map. Without
   * bounds, the whole region moves.
   */
  bounds?: [[number, number], [number, number]];
}

/**
 * Regions that lie far from the rest of their country. The script draws each
 * one with its own projection and moves it next to the main map, so it does
 * not stretch the viewBox.
 */
export const INSETS: Record<string, Inset> = {
  // United States: Alaska and Hawaii lie far from the other states, and
  // Alaska crosses the antimeridian
  "US-AK": { center: -152, scale: 0.3, position: [0.75, 0.62] },
  "US-HI": { center: -157, scale: 0.8, position: [0.2, 0.84] },
  // Chile: Easter Island (Valparaíso) lies 3,500 km off the coast
  "CL-VS": { center: -109, scale: 5, position: [0.65, 0.76], bounds: [[-110, -28], [-105, -26]] },
  // South Africa: the Prince Edward Islands (Western Cape) lie 1,800 km
  // south-east of the mainland
  "ZA-WC": { center: 38, scale: 2, position: [0.85, 0.85], bounds: [[37, -47.5], [38.5, -46.5]] },
  // Australia: Macquarie Island (Tasmania) lies 1,500 km south-east of Tasmania
  "AU-TAS": { center: 159, scale: 6, position: [0.06, 0.8], bounds: [[158, -55.5], [160, -54]] },
};

/**
 * Names for regions that are merged from several features (for example a
 * county split into councils). Other merged regions keep the name of their
 * largest feature.
 */
export const MERGED_NAMES: Record<string, string> = {
  "BA-BIH": "Federation of Bosnia and Herzegovina",
  "BA-SRP": "Republika Srpska",
  "IE-D": "Dublin",
  "IE-TA": "Tipperary",
  "PH-00": "Metro Manila",
};
