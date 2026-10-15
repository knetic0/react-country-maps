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
  // Azerbaijan: Şuşa city has no code. It lies inside Şuşa District (AZ-SUS).
  "AZ-X01~": { id: "AZ-SUS" },
  // Bahamas: New Providence has no code in Natural Earth
  "BS-X01~": { id: "BS-NP" },
  // Bosnia and Herzegovina: every Federation canton has the entity code BA-BIH,
  // and Posavina Canton has the code of Republika Srpska
  "BIH-2225": { id: "BA-01" },
  "BIH-3153": { id: "BA-02" },
  "BIH-2887": { id: "BA-03" },
  "BIH-2889": { id: "BA-04" },
  "BIH-2891": { id: "BA-05" },
  "BIH-2226": { id: "BA-06" },
  "BIH-2228": { id: "BA-07" },
  "BIH-2227": { id: "BA-08" },
  "BIH-2890": { id: "BA-09" },
  "BIH-2224": { id: "BA-10" },
  // Bosnia and Herzegovina: the regions of Republika Srpska have no codes
  "BA-X01~": { id: "BA-SRP" },
  "BA-X02~": { id: "BA-SRP" },
  "BA-X03~": { id: "BA-SRP" },
  "BA-X04~": { id: "BA-SRP" },
  "BA-X05~": { id: "BA-SRP" },
  "BA-X06~": { id: "BA-SRP" },
  "BA-X07~": { id: "BA-SRP" },
  // Chad: Natural Earth has one Ennedi region. ISO splits it into Ennedi-Est
  // (TD-EE) and Ennedi-Ouest (TD-EO), so it gets the code of the larger part.
  "TD-X01~": { id: "TD-EE" },
  // Iran: Natural Earth gives Alborz the code of Tehran (IR-07)
  "IRN-5490": { id: "IR-32" },
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
 * ISO 3166-2 codes of regions to leave out of a map. The script removes them
 * before it simplifies the shapes.
 */
export const EXCLUDED_REGIONS: string[] = [
  // United States: Alaska and Hawaii lie far from the other states and
  // stretch the viewBox. Alaska also crosses the antimeridian.
  "US-AK",
  "US-HI",
  // China: the Paracel Islands are disputed and have no code
  "CN-X01~",
  // Syria: the UN buffer zone in the Golan Heights is not a governorate
  "SY-X01~",
  // United Arab Emirates: shared zones between emirates have no code
  "AE-X01~",
  "AE-X02~",
];

/**
 * Names for regions that are merged from several features (for example a
 * county split into councils). Other merged regions keep the name of their
 * largest feature.
 */
export const MERGED_NAMES: Record<string, string> = {
  "BA-SRP": "Republika Srpska",
  "IE-D": "Dublin",
  "IE-TA": "Tipperary",
  "PH-00": "Metro Manila",
};
