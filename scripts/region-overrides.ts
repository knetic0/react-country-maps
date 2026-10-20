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
  // Colombia: Bogotá reuses the code of Cundinamarca (CO-CUN), the department
  // around it. Malpelo Island has no name or code. It is part of Valle del Cauca.
  "COL-1399": { id: "CO-DC", name: "Bogotá" },
  "CO-X01~": { id: "CO-VAC" },
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
  // Mauritius: Port Louis city reuses the code of Port Louis District (MU-PL).
  // MU-PU is the code of the city, and the other cities keep their codes too.
  "MUS-5190": { id: "MU-PU" },
  // Mexico: Alacranes Reef has no name or code. It is part of Yucatán.
  "MEX+99?": { id: "MX-YUC" },
  // Peru: Lima Province reuses the code of Lima Region (PE-LIM)
  "PER-587": { id: "PE-LMA" },
  // Philippines: PH-MNL is not an ISO 3166-2 code. Metro Manila is PH-00.
  "PH-MNL": { id: "PH-00" },
  // Russia: an island in Baydaratskaya Bay has no name or code. It lies off
  // the coast of Yamalo-Nenets.
  "RU-X01~": { id: "RU-YAN" },
  // Tajikistan: the districts under republic subordination have no code
  "TJ-X01~": { id: "TJ-RA", name: "Districts of Republican Subordination" },
  // Venezuela: Isla de Aves has no name or code. It is one of the Federal
  // Dependencies (VE-W).
  "VE-X01~": { id: "VE-W" },
};

/**
 * Codes of regions to leave out of a map: ISO 3166-2 codes, or the Natural
 * Earth placeholders (ending in "~") of regions that have no ISO code. The
 * script removes them before it simplifies the shapes. A code applies to every
 * country, because Natural Earth puts some regions under another country.
 */
export const EXCLUDED_REGIONS: string[] = [
  // Australia: Ashmore and Cartier Islands is an external territory, not a
  // state, and has no code
  "AU-X04~",
  // China: the Paracel Islands are disputed and have no code
  "CN-X01~",
  // New Zealand: the outlying islands are outside every region and have no
  // code. The subantarctic and Kermadec Islands also lie far from the mainland.
  "NZ-X01~", // Kermadec Islands
  "NZ-X03~", // Three Kings Islands
  "NZ-X04~", // Antipodes Islands
  "NZ-X05~", // Campbell Islands
  "NZ-X06~", // Auckland Islands
  "NZ-X07~", // The Snares
  // Norway: Bouvet Island is a dependency in the South Atlantic, not a county
  "NO-X01~",
  // Russia: Natural Earth puts Crimea and Sevastopol under Russia with their
  // Ukrainian codes. They are part of Ukraine under international law.
  "UA-43",
  "UA-40",
  // Seychelles: the Outer Islands are outside every district, have no code,
  // and spread over 1,000 km of ocean
  "SC-X02~",
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

// Insets shared by several regions. They move as one group.
const CANARY_ISLANDS: Inset = { center: -15.8, scale: 0.7, position: [0, 0.8] };
const SABA_AND_ST_EUSTATIUS: Inset = { center: -63.1, scale: 6, position: [0, 0.2] };

/**
 * Regions that lie far from the rest of their country. The script draws each
 * one with its own projection and moves it next to the main map, so it does
 * not stretch the viewBox. Regions that share one inset object move together.
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
  // Colombia: San Andrés y Providencia lies 700 km north-west of the mainland,
  // and Malpelo Island (Valle del Cauca) 500 km off the Pacific coast
  "CO-SAP": { center: -81.7, scale: 8, position: [0.03, 0.03] },
  "CO-VAC": { center: -81.6, scale: 10, position: [0.02, 0.45], bounds: [[-82, 3.5], [-81, 4.5]] },
  // Ecuador: the Galápagos Islands lie 1,000 km off the coast
  "EC-W": { center: -90.6, scale: 0.6, position: [-0.32, 0.35] },
  // Equatorial Guinea: Annobón lies 350 km south-west of São Tomé
  "GQ-AN": { center: 5.6, scale: 4, position: [0.02, 0.85] },
  // Fiji: Rotuma lies 500 km north of the main islands
  "FJ-R": { center: 177.1, scale: 2, position: [0.05, 0.05] },
  // France: the overseas regions
  "FR-GF": { center: -53.1, scale: 0.35, position: [0, 0.55] },
  "FR-GP": { center: -61.4, scale: 1, position: [0, 0.68] },
  "FR-MQ": { center: -61, scale: 1.2, position: [0.1, 0.68] },
  "FR-RE": { center: 55.5, scale: 1.2, position: [0, 0.82] },
  "FR-YT": { center: 45.1, scale: 1.5, position: [0.1, 0.82] },
  // Mauritius: Rodrigues lies 600 km east and Agaléga 1,000 km north of the
  // main island
  "MU-RO": { center: 63.4, scale: 1, position: [0.75, 0.85] },
  "MU-AG": { center: 56.5, scale: 2, position: [0.02, 0.02] },
  // Netherlands: the Caribbean Netherlands
  "NL-BQ1": { center: -68.3, scale: 2.5, position: [0, 0] },
  "NL-BQ2": SABA_AND_ST_EUSTATIUS,
  "NL-BQ3": SABA_AND_ST_EUSTATIUS,
  // New Zealand: the Chatham Islands lie 800 km east of the mainland, across
  // the antimeridian
  "NZ-CIT": { center: -176.5, scale: 1.5, position: [0.8, 0.75] },
  // Norway: Svalbard lies 650 km north of the mainland, and Jan Mayen
  // (Nordland) 1,000 km west
  "NO-21": { center: 20, scale: 0.35, position: [0.55, 0.62] },
  "NO-18": { center: -8.5, scale: 1, position: [0.5, 0.95], bounds: [[-10, 70.5], [-7, 71.5]] },
  // Portugal: the Azores and Madeira lie 1,400 km and 1,000 km off the coast
  "PT-20": { center: -28, scale: 0.45, position: [-0.95, 0.03] },
  "PT-30": { center: -16.6, scale: 1, position: [-0.45, 0.62] },
  // Spain: the Canary Islands lie 1,000 km south-west of the mainland
  "ES-GC": CANARY_ISLANDS,
  "ES-TF": CANARY_ISLANDS,
  // Venezuela: Isla de Aves (Federal Dependencies) lies 550 km north of the coast
  "VE-W": { center: -63.6, scale: 10, position: [0.75, 0.02], bounds: [[-64, 15.5], [-63.3, 16]] },
};

/**
 * Longitude to center the main map on, for countries that cross the
 * antimeridian. The key is the ISO 3166-1 alpha-2 code of the country.
 */
export const PROJECTION_CENTERS: Record<string, number> = {
  FJ: 179,
  RU: 100,
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
