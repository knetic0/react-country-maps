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
  // Mexico: Alacranes Reef has no name or code. It is part of Yucatán.
  "MEX+99?": { id: "MX-YUC" },
  // Peru: Lima Province reuses the code of Lima Region (PE-LIM)
  "PER-587": { id: "PE-LMA" },
  // Philippines: PH-MNL is not an ISO 3166-2 code. Metro Manila is PH-00.
  "PH-MNL": { id: "PH-00" },
};

/**
 * Names for regions that are merged from several features (for example a
 * county split into councils). Other merged regions keep the name of their
 * largest feature.
 */
export const MERGED_NAMES: Record<string, string> = {
  "IE-D": "Dublin",
  "IE-TA": "Tipperary",
  "PH-00": "Metro Manila",
};
