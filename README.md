# react-country-maps

Interactive, accessible SVG maps of countries and their first-level administrative regions (states, provinces, prefectures, counties) for React.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/knetic0/react-country-maps/main/.github/assets/react-country-maps.gif"
    alt="react-country-maps playground demo with an interactive map of Turkey"
    width="800"
  />
</p>

- **199 countries** out of the box, with ready-to-render region geometry
- **Zero runtime dependencies** besides React
- **Fully typed** with TypeScript
- **Hover, click and keyboard** interaction on every region
- **Built-in tooltip** with smart placement and CSS-variable theming
- **Zoom and pan** with buttons, <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + wheel, trackpad pinch, touch pinch and drag
- **Responsive** SVG that scales to its container
- **SSR-safe**, so it works with Next.js, Remix and other server renderers
- **Bring your own data**: render any country that follows the `Country` shape

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Available Countries](#available-countries)
  - [Region IDs](#region-ids)
  - [Data Notes](#data-notes)
- [Usage Examples](#usage-examples)
  - [Handling Events](#handling-events)
  - [Custom Colors](#custom-colors)
  - [Tooltips](#tooltips)
  - [Zooming](#zooming)
  - [Highlighting a Selected Region](#highlighting-a-selected-region)
  - [Choropleth (Data-Driven) Maps](#choropleth-data-driven-maps)
  - [Wrapping Regions](#wrapping-regions)
- [API Reference](#api-reference)
  - [`<CountryMap />`](#countrymap-)
  - [Types](#types)
- [Styling](#styling)
- [Accessibility](#accessibility)
- [Using Your Own Map Data](#using-your-own-map-data)
- [Contributing](#contributing)
- [Data Source & Attribution](#data-source--attribution)
- [License](#license)

---

## Installation

```bash
npm install react-country-maps
```

```bash
yarn add react-country-maps
```

```bash
pnpm add react-country-maps
```

`react` and `react-dom` (version 18 or newer) are required as peer dependencies.

---

## Quick Start

```tsx
import { CountryMap } from "react-country-maps";
import germany from "react-country-maps/countries/germany";

export default function App() {
  return (
    <CountryMap
      data={germany}
      showTooltip
      onClick={(region) => console.log(region.id, region.name)}
    />
  );
}
```

The map fills the width of its parent and keeps its aspect ratio. To control the size, wrap it in a container or pass `style` / `className`.

> Each country is a separate module. Your bundle only contains the countries you import.

---

## Available Countries

Import a country from `react-country-maps/countries/<name>`.

| Country                          | Import path                                                     | ISO code | Regions |
| -------------------------------- | --------------------------------------------------------------- | -------- | ------: |
| Afghanistan                      | `react-country-maps/countries/afghanistan`                      | `AF`     |      32 |
| Albania                          | `react-country-maps/countries/albania`                          | `AL`     |      12 |
| Algeria                          | `react-country-maps/countries/algeria`                          | `DZ`     |      48 |
| Andorra                          | `react-country-maps/countries/andorra`                          | `AD`     |       7 |
| Angola                           | `react-country-maps/countries/angola`                           | `AO`     |      18 |
| Antigua and Barbuda              | `react-country-maps/countries/antigua-and-barbuda`              | `AG`     |       8 |
| Argentina                        | `react-country-maps/countries/argentina`                        | `AR`     |      24 |
| Armenia                          | `react-country-maps/countries/armenia`                          | `AM`     |      11 |
| Australia                        | `react-country-maps/countries/australia`                        | `AU`     |       8 |
| Austria                          | `react-country-maps/countries/austria`                          | `AT`     |       9 |
| Azerbaijan                       | `react-country-maps/countries/azerbaijan`                       | `AZ`     |      74 |
| Bahamas                          | `react-country-maps/countries/bahamas`                          | `BS`     |      30 |
| Bahrain                          | `react-country-maps/countries/bahrain`                          | `BH`     |       5 |
| Bangladesh                       | `react-country-maps/countries/bangladesh`                       | `BD`     |       7 |
| Barbados                         | `react-country-maps/countries/barbados`                         | `BB`     |      11 |
| Belarus                          | `react-country-maps/countries/belarus`                          | `BY`     |       7 |
| Belgium                          | `react-country-maps/countries/belgium`                          | `BE`     |      11 |
| Belize                           | `react-country-maps/countries/belize`                           | `BZ`     |       6 |
| Benin                            | `react-country-maps/countries/benin`                            | `BJ`     |      12 |
| Bermuda                          | `react-country-maps/countries/bermuda`                          | `BM`     |      11 |
| Bhutan                           | `react-country-maps/countries/bhutan`                           | `BT`     |      20 |
| Bolivia                          | `react-country-maps/countries/bolivia`                          | `BO`     |       9 |
| Bosnia and Herzegovina           | `react-country-maps/countries/bosnia-and-herzegovina`           | `BA`     |       3 |
| Botswana                         | `react-country-maps/countries/botswana`                         | `BW`     |      15 |
| Brazil                           | `react-country-maps/countries/brazil`                           | `BR`     |      27 |
| Brunei                           | `react-country-maps/countries/brunei`                           | `BN`     |       4 |
| Bulgaria                         | `react-country-maps/countries/bulgaria`                         | `BG`     |      28 |
| Burkina Faso                     | `react-country-maps/countries/burkina-faso`                     | `BF`     |      45 |
| Burundi                          | `react-country-maps/countries/burundi`                          | `BI`     |      17 |
| Cambodia                         | `react-country-maps/countries/cambodia`                         | `KH`     |      24 |
| Cameroon                         | `react-country-maps/countries/cameroon`                         | `CM`     |      10 |
| Canada                           | `react-country-maps/countries/canada`                           | `CA`     |      13 |
| Cape Verde                       | `react-country-maps/countries/cape-verde`                       | `CV`     |      22 |
| Central African Republic         | `react-country-maps/countries/central-african-republic`         | `CF`     |      17 |
| Chad                             | `react-country-maps/countries/chad`                             | `TD`     |      22 |
| Chile                            | `react-country-maps/countries/chile`                            | `CL`     |      16 |
| China                            | `react-country-maps/countries/china`                            | `CN`     |      31 |
| Colombia                         | `react-country-maps/countries/colombia`                         | `CO`     |      33 |
| Comoros                          | `react-country-maps/countries/comoros`                          | `KM`     |       3 |
| Costa Rica                       | `react-country-maps/countries/costa-rica`                       | `CR`     |       7 |
| Croatia                          | `react-country-maps/countries/croatia`                          | `HR`     |      20 |
| Cuba                             | `react-country-maps/countries/cuba`                             | `CU`     |      16 |
| Cyprus                           | `react-country-maps/countries/cyprus`                           | `CY`     |       5 |
| Czechia                          | `react-country-maps/countries/czechia`                          | `CZ`     |      14 |
| Denmark                          | `react-country-maps/countries/denmark`                          | `DK`     |       5 |
| Djibouti                         | `react-country-maps/countries/djibouti`                         | `DJ`     |       6 |
| Dominica                         | `react-country-maps/countries/dominica`                         | `DM`     |      10 |
| Dominican Republic               | `react-country-maps/countries/dominican-republic`               | `DO`     |      32 |
| DR Congo                         | `react-country-maps/countries/dr-congo`                         | `CD`     |      11 |
| East Timor                       | `react-country-maps/countries/east-timor`                       | `TL`     |      13 |
| Ecuador                          | `react-country-maps/countries/ecuador`                          | `EC`     |      24 |
| Egypt                            | `react-country-maps/countries/egypt`                            | `EG`     |      27 |
| El Salvador                      | `react-country-maps/countries/el-salvador`                      | `SV`     |      14 |
| Equatorial Guinea                | `react-country-maps/countries/equatorial-guinea`                | `GQ`     |       7 |
| Eritrea                          | `react-country-maps/countries/eritrea`                          | `ER`     |       6 |
| Estonia                          | `react-country-maps/countries/estonia`                          | `EE`     |      15 |
| Eswatini                         | `react-country-maps/countries/eswatini`                         | `SZ`     |       4 |
| Ethiopia                         | `react-country-maps/countries/ethiopia`                         | `ET`     |      11 |
| Fiji                             | `react-country-maps/countries/fiji`                             | `FJ`     |       5 |
| Finland                          | `react-country-maps/countries/finland`                          | `FI`     |      18 |
| France                           | `react-country-maps/countries/france`                           | `FR`     |     101 |
| Gabon                            | `react-country-maps/countries/gabon`                            | `GA`     |       9 |
| Gambia                           | `react-country-maps/countries/gambia`                           | `GM`     |       6 |
| Georgia                          | `react-country-maps/countries/georgia`                          | `GE`     |      12 |
| Germany                          | `react-country-maps/countries/germany`                          | `DE`     |      16 |
| Ghana                            | `react-country-maps/countries/ghana`                            | `GH`     |      10 |
| Greece                           | `react-country-maps/countries/greece`                           | `GR`     |      14 |
| Greenland                        | `react-country-maps/countries/greenland`                        | `GL`     |       5 |
| Grenada                          | `react-country-maps/countries/grenada`                          | `GD`     |       7 |
| Guatemala                        | `react-country-maps/countries/guatemala`                        | `GT`     |      22 |
| Guinea                           | `react-country-maps/countries/guinea`                           | `GN`     |      34 |
| Guinea-Bissau                    | `react-country-maps/countries/guinea-bissau`                    | `GW`     |       9 |
| Guyana                           | `react-country-maps/countries/guyana`                           | `GY`     |      10 |
| Haiti                            | `react-country-maps/countries/haiti`                            | `HT`     |      10 |
| Honduras                         | `react-country-maps/countries/honduras`                         | `HN`     |      18 |
| Hungary                          | `react-country-maps/countries/hungary`                          | `HU`     |      43 |
| Iceland                          | `react-country-maps/countries/iceland`                          | `IS`     |       9 |
| India                            | `react-country-maps/countries/india`                            | `IN`     |      36 |
| Indonesia                        | `react-country-maps/countries/indonesia`                        | `ID`     |      33 |
| Iran                             | `react-country-maps/countries/iran`                             | `IR`     |      31 |
| Iraq                             | `react-country-maps/countries/iraq`                             | `IQ`     |      18 |
| Ireland                          | `react-country-maps/countries/ireland`                          | `IE`     |      26 |
| Italy                            | `react-country-maps/countries/italy`                            | `IT`     |     110 |
| Ivory Coast                      | `react-country-maps/countries/ivory-coast`                      | `CI`     |      19 |
| Jamaica                          | `react-country-maps/countries/jamaica`                          | `JM`     |      14 |
| Japan                            | `react-country-maps/countries/japan`                            | `JP`     |      47 |
| Jordan                           | `react-country-maps/countries/jordan`                           | `JO`     |      12 |
| Kazakhstan                       | `react-country-maps/countries/kazakhstan`                       | `KZ`     |      16 |
| Kenya                            | `react-country-maps/countries/kenya`                            | `KE`     |       8 |
| Kosovo                           | `react-country-maps/countries/kosovo`                           | `XK`     |      30 |
| Kuwait                           | `react-country-maps/countries/kuwait`                           | `KW`     |       6 |
| Kyrgyzstan                       | `react-country-maps/countries/kyrgyzstan`                       | `KG`     |       8 |
| Laos                             | `react-country-maps/countries/laos`                             | `LA`     |      16 |
| Latvia                           | `react-country-maps/countries/latvia`                           | `LV`     |     119 |
| Lebanon                          | `react-country-maps/countries/lebanon`                          | `LB`     |       6 |
| Lesotho                          | `react-country-maps/countries/lesotho`                          | `LS`     |      10 |
| Liberia                          | `react-country-maps/countries/liberia`                          | `LR`     |      15 |
| Libya                            | `react-country-maps/countries/libya`                            | `LY`     |      22 |
| Liechtenstein                    | `react-country-maps/countries/liechtenstein`                    | `LI`     |      11 |
| Lithuania                        | `react-country-maps/countries/lithuania`                        | `LT`     |      10 |
| Luxembourg                       | `react-country-maps/countries/luxembourg`                       | `LU`     |       3 |
| Madagascar                       | `react-country-maps/countries/madagascar`                       | `MG`     |       6 |
| Malawi                           | `react-country-maps/countries/malawi`                           | `MW`     |      27 |
| Malaysia                         | `react-country-maps/countries/malaysia`                         | `MY`     |      16 |
| Maldives                         | `react-country-maps/countries/maldives`                         | `MV`     |      20 |
| Mali                             | `react-country-maps/countries/mali`                             | `ML`     |       9 |
| Malta                            | `react-country-maps/countries/malta`                            | `MT`     |      68 |
| Marshall Islands                 | `react-country-maps/countries/marshall-islands`                 | `MH`     |       2 |
| Mauritania                       | `react-country-maps/countries/mauritania`                       | `MR`     |      13 |
| Mauritius                        | `react-country-maps/countries/mauritius`                        | `MU`     |      16 |
| Mexico                           | `react-country-maps/countries/mexico`                           | `MX`     |      32 |
| Micronesia                       | `react-country-maps/countries/micronesia`                       | `FM`     |       4 |
| Moldova                          | `react-country-maps/countries/moldova`                          | `MD`     |      38 |
| Monaco                           | `react-country-maps/countries/monaco`                           | `MC`     |       1 |
| Mongolia                         | `react-country-maps/countries/mongolia`                         | `MN`     |      22 |
| Montenegro                       | `react-country-maps/countries/montenegro`                       | `ME`     |      21 |
| Montserrat                       | `react-country-maps/countries/montserrat`                       | `MS`     |       3 |
| Morocco                          | `react-country-maps/countries/morocco`                          | `MA`     |      16 |
| Mozambique                       | `react-country-maps/countries/mozambique`                       | `MZ`     |      10 |
| Myanmar                          | `react-country-maps/countries/myanmar`                          | `MM`     |      14 |
| Namibia                          | `react-country-maps/countries/namibia`                          | `NA`     |      13 |
| Nauru                            | `react-country-maps/countries/nauru`                            | `NR`     |      14 |
| Nepal                            | `react-country-maps/countries/nepal`                            | `NP`     |      14 |
| Netherlands                      | `react-country-maps/countries/netherlands`                      | `NL`     |      15 |
| New Caledonia                    | `react-country-maps/countries/new-caledonia`                    | `NC`     |       3 |
| New Zealand                      | `react-country-maps/countries/new-zealand`                      | `NZ`     |      17 |
| Nicaragua                        | `react-country-maps/countries/nicaragua`                        | `NI`     |      17 |
| Niger                            | `react-country-maps/countries/niger`                            | `NE`     |       8 |
| Nigeria                          | `react-country-maps/countries/nigeria`                          | `NG`     |      37 |
| North Korea                      | `react-country-maps/countries/north-korea`                      | `KP`     |      11 |
| North Macedonia                  | `react-country-maps/countries/north-macedonia`                  | `MK`     |      84 |
| Norway                           | `react-country-maps/countries/norway`                           | `NO`     |      20 |
| Oman                             | `react-country-maps/countries/oman`                             | `OM`     |      11 |
| Pakistan                         | `react-country-maps/countries/pakistan`                         | `PK`     |       8 |
| Palau                            | `react-country-maps/countries/palau`                            | `PW`     |      16 |
| Palestine                        | `react-country-maps/countries/palestine`                        | `PS`     |       2 |
| Panama                           | `react-country-maps/countries/panama`                           | `PA`     |      12 |
| Papua New Guinea                 | `react-country-maps/countries/papua-new-guinea`                 | `PG`     |      20 |
| Paraguay                         | `react-country-maps/countries/paraguay`                         | `PY`     |      18 |
| Peru                             | `react-country-maps/countries/peru`                             | `PE`     |      26 |
| Philippines                      | `react-country-maps/countries/philippines`                      | `PH`     |      83 |
| Poland                           | `react-country-maps/countries/poland`                           | `PL`     |      16 |
| Portugal                         | `react-country-maps/countries/portugal`                         | `PT`     |      20 |
| Qatar                            | `react-country-maps/countries/qatar`                            | `QA`     |       7 |
| Republic of the Congo            | `react-country-maps/countries/republic-of-the-congo`            | `CG`     |      12 |
| Romania                          | `react-country-maps/countries/romania`                          | `RO`     |      42 |
| Russia                           | `react-country-maps/countries/russia`                           | `RU`     |      83 |
| Rwanda                           | `react-country-maps/countries/rwanda`                           | `RW`     |       5 |
| Saint Kitts and Nevis            | `react-country-maps/countries/saint-kitts-and-nevis`            | `KN`     |      14 |
| Saint Lucia                      | `react-country-maps/countries/saint-lucia`                      | `LC`     |      11 |
| Saint Pierre and Miquelon        | `react-country-maps/countries/saint-pierre-and-miquelon`        | `PM`     |       2 |
| Saint Vincent and the Grenadines | `react-country-maps/countries/saint-vincent-and-the-grenadines` | `VC`     |       6 |
| Samoa                            | `react-country-maps/countries/samoa`                            | `WS`     |      11 |
| San Marino                       | `react-country-maps/countries/san-marino`                       | `SM`     |       9 |
| São Tomé and Príncipe            | `react-country-maps/countries/sao-tome-and-principe`            | `ST`     |       2 |
| Saudi Arabia                     | `react-country-maps/countries/saudi-arabia`                     | `SA`     |      13 |
| Senegal                          | `react-country-maps/countries/senegal`                          | `SN`     |      14 |
| Serbia                           | `react-country-maps/countries/serbia`                           | `RS`     |      25 |
| Seychelles                       | `react-country-maps/countries/seychelles`                       | `SC`     |      25 |
| Sierra Leone                     | `react-country-maps/countries/sierra-leone`                     | `SL`     |       4 |
| Singapore                        | `react-country-maps/countries/singapore`                        | `SG`     |       5 |
| Slovakia                         | `react-country-maps/countries/slovakia`                         | `SK`     |       8 |
| Slovenia                         | `react-country-maps/countries/slovenia`                         | `SI`     |     192 |
| Solomon Islands                  | `react-country-maps/countries/solomon-islands`                  | `SB`     |       9 |
| Somalia                          | `react-country-maps/countries/somalia`                          | `SO`     |      13 |
| South Africa                     | `react-country-maps/countries/south-africa`                     | `ZA`     |       9 |
| South Korea                      | `react-country-maps/countries/south-korea`                      | `KR`     |      17 |
| South Sudan                      | `react-country-maps/countries/south-sudan`                      | `SS`     |      10 |
| Spain                            | `react-country-maps/countries/spain`                            | `ES`     |      52 |
| Sri Lanka                        | `react-country-maps/countries/sri-lanka`                        | `LK`     |      25 |
| Sudan                            | `react-country-maps/countries/sudan`                            | `SD`     |      16 |
| Suriname                         | `react-country-maps/countries/suriname`                         | `SR`     |      10 |
| Sweden                           | `react-country-maps/countries/sweden`                           | `SE`     |      21 |
| Switzerland                      | `react-country-maps/countries/switzerland`                      | `CH`     |      26 |
| Syria                            | `react-country-maps/countries/syria`                            | `SY`     |      14 |
| Taiwan                           | `react-country-maps/countries/taiwan`                           | `TW`     |      21 |
| Tajikistan                       | `react-country-maps/countries/tajikistan`                       | `TJ`     |       5 |
| Tanzania                         | `react-country-maps/countries/tanzania`                         | `TZ`     |      30 |
| Thailand                         | `react-country-maps/countries/thailand`                         | `TH`     |      77 |
| Togo                             | `react-country-maps/countries/togo`                             | `TG`     |       5 |
| Tonga                            | `react-country-maps/countries/tonga`                            | `TO`     |       5 |
| Trinidad and Tobago              | `react-country-maps/countries/trinidad-and-tobago`              | `TT`     |      16 |
| Tunisia                          | `react-country-maps/countries/tunisia`                          | `TN`     |      23 |
| Turkey                           | `react-country-maps/countries/turkey`                           | `TR`     |      81 |
| Turkmenistan                     | `react-country-maps/countries/turkmenistan`                     | `TM`     |       5 |
| Uganda                           | `react-country-maps/countries/uganda`                           | `UG`     |     111 |
| Ukraine                          | `react-country-maps/countries/ukraine`                          | `UA`     |      27 |
| United Arab Emirates             | `react-country-maps/countries/united-arab-emirates`             | `AE`     |       7 |
| United Kingdom                   | `react-country-maps/countries/united-kingdom`                   | `GB`     |     232 |
| United States                    | `react-country-maps/countries/united-states`                    | `US`     |      51 |
| Uruguay                          | `react-country-maps/countries/uruguay`                          | `UY`     |      19 |
| Uzbekistan                       | `react-country-maps/countries/uzbekistan`                       | `UZ`     |      14 |
| Vanuatu                          | `react-country-maps/countries/vanuatu`                          | `VU`     |       6 |
| Venezuela                        | `react-country-maps/countries/venezuela`                        | `VE`     |      25 |
| Vietnam                          | `react-country-maps/countries/vietnam`                          | `VN`     |      63 |
| Wallis and Futuna                | `react-country-maps/countries/wallis-and-futuna`                | `WF`     |       3 |
| Yemen                            | `react-country-maps/countries/yemen`                            | `YE`     |      21 |
| Zambia                           | `react-country-maps/countries/zambia`                           | `ZM`     |      10 |
| Zimbabwe                         | `react-country-maps/countries/zimbabwe`                         | `ZW`     |      10 |

Some maps leave out remote or disputed areas. See [Data Notes](#data-notes).

### Region IDs

Region IDs follow the [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) standard, for example `DE-BY` for Bavaria or `JP-13` for Tokyo. You can use them as stable keys to join the map with your own data.

Every country uses this format, including Turkey (for example `TR-34` for İstanbul and `TR-16` for Bursa, the same numbers as the license plate codes). Each ID belongs to exactly one region. Some countries use older codes, and a few have no ISO codes at all. See [Data Notes](#data-notes).

To see the exact IDs of a country, read them from the data:

```ts
import japan from "react-country-maps/countries/japan";

console.table(japan.regions.map(({ id, name }) => ({ id, name })));
```

### Data Notes

The maps are generated from Natural Earth 5.1.1. Some countries changed their regions or codes after that data was published, and some maps leave out areas on purpose.

**Areas left out of a map**

| Country              | Left out                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| Australia            | Ashmore and Cartier Islands, an external territory with no code                                            |
| China                | The Paracel Islands                                                                                        |
| New Zealand          | The outlying islands outside every region: Kermadec, Three Kings, Antipodes, Campbell, Auckland and Snares |
| Norway               | Bouvet Island, a dependency in the South Atlantic                                                          |
| Russia               | Crimea and Sevastopol. They are on the Ukraine map as `UA-43` and `UA-40`.                                 |
| Seychelles           | The Outer Islands, which are outside every district                                                        |
| Syria                | The UNDOF buffer zone in the Golan Heights                                                                 |
| United Arab Emirates | Two jointly controlled zones that have no code                                                             |

**Insets**

Some countries have regions far from the mainland. At their real position, they would make the mainland small. These parts are scaled and moved next to the mainland, as in an atlas. Their region IDs do not change, but their position on the map is not geographic.

| Country           | Moved parts                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| Australia         | Macquarie Island (part of `AU-TAS`)                                                                  |
| Chile             | Easter Island (part of `CL-VS`)                                                                      |
| Colombia          | San Andrés y Providencia (`CO-SAP`) and Malpelo Island (part of `CO-VAC`)                            |
| Ecuador           | Galápagos (`EC-W`)                                                                                   |
| Equatorial Guinea | Annobón (`GQ-AN`)                                                                                    |
| Fiji              | Rotuma (`FJ-R`)                                                                                      |
| France            | The overseas regions: `FR-GF`, `FR-GP`, `FR-MQ`, `FR-RE` and `FR-YT`                                 |
| Mauritius         | Rodrigues (`MU-RO`) and Agaléga (`MU-AG`)                                                            |
| Netherlands       | The Caribbean Netherlands: `NL-BQ1`, `NL-BQ2` and `NL-BQ3`                                           |
| New Zealand       | The Chatham Islands (`NZ-CIT`)                                                                       |
| Norway            | Svalbard (`NO-21`) and Jan Mayen (part of `NO-18`)                                                   |
| Portugal          | The Azores (`PT-20`) and Madeira (`PT-30`)                                                           |
| South Africa      | The Prince Edward Islands (part of `ZA-WC`)                                                          |
| Spain             | The Canary Islands (`ES-GC` and `ES-TF`)                                                             |
| United States     | Alaska (`US-AK`) and Hawaii (`US-HI`)                                                                |
| Venezuela         | Isla de Aves (part of `VE-W`)                                                                        |

The maps of Fiji and Russia cross the 180th meridian. They are centered on the country, so each map stays in one piece.

**Merged regions**

- Bosnia and Herzegovina has the three ISO 3166-2 entities: `BA-BIH`, `BA-SRP` and `BA-BRC`. ISO deleted the canton codes in 2015.
- Chad has one Ennedi region with the code `TD-EO`. ISO splits it into Ennedi-Est (`TD-EE`) and Ennedi-Ouest (`TD-EO`), but the source data has only one shape.
- Small areas with no code in the source data are part of the region they belong to: Jervis Bay Territory (`AU-ACT`), Malpelo Island (`CO-VAC`), Isla de Aves (`VE-W`) and an island in Baydaratskaya Bay (`RU-YAN`).

**Regions from before a reform**

These maps show the regions that existed when the source data was made. Their IDs can differ from the current ISO 3166-2 list:

Bahrain, DR Congo, Ghana, Greenland, Ivory Coast, Kazakhstan, Kenya, Latvia, Libya, Luxembourg, Mauritania, Morocco, Namibia, Nepal, Norway, Pakistan and São Tomé and Príncipe. Parts of Italy (Sardinia), the Philippines (Maguindanao) and the United Kingdom (Northern Ireland and Bournemouth) are also affected.

**IDs that differ from current ISO codes**

The regions of these maps are current, but some IDs use an older ISO code or a wrong code from the source data:

Czechia, Estonia, Greece, Guatemala, Hungary, Iceland, Iraq, Italy, Mexico, Moldova, North Macedonia, Oman, the Philippines, Poland, Saint Kitts and Nevis, Saint Lucia, Serbia, Slovenia, Solomon Islands, South Africa, Taiwan, Trinidad and Tobago, Uganda and the United Kingdom.

Bermuda, Montserrat and Palestine have no ISO 3166-2 subdivisions, so their IDs come from the source data.

Kosovo, Monaco, New Caledonia and Saint Pierre and Miquelon have no ISO 3166-2 codes in the source data either. Their IDs are the source data placeholders, for example `XK-X01` for Đakovica. These IDs are not ISO codes. The Monaco map is one region.

Two codes are fixed by hand: Bogotá is `CO-DC` (the source data gives it the code of Cundinamarca), and Port Louis city is `MU-PU` (the source data gives it the code of Port Louis District).

**Region names**

Names come from the source data, so some are old. For example, Namibia's Zambezi region is still called Caprivi. In Madagascar, each region is one of the six provinces, but it is named after the largest region inside it.

If you join the map with your own data, check the IDs of your country with the `console.table` example above.

---

## Usage Examples

### Handling Events

```tsx
import { useState } from "react";
import { CountryMap, type Region } from "react-country-maps";
import japan from "react-country-maps/countries/japan";

export function JapanMap() {
  const [hovered, setHovered] = useState<Region | null>(null);

  return (
    <>
      <p>Hovered: {hovered?.name ?? "none"}</p>
      <CountryMap
        data={japan}
        onHover={(region) => setHovered(region)}
        onLeave={() => setHovered(null)}
        onClick={(region) => alert(`You clicked ${region.name}`)}
      />
    </>
  );
}
```

Callbacks always receive the full `Region` object (`id`, `name`, `path`). You can pass inline functions safely. The map does not re-render all regions when callback identities change.

### Custom Colors

```tsx
<CountryMap
  data={brazil}
  customStyle={{ idleColor: "#cbd5e1", hoverColor: "#0ea5e9" }}
/>
```

| Key          | Default   | Description                        |
| ------------ | --------- | ---------------------------------- |
| `idleColor`  | `#444`    | Fill color of a region at rest     |
| `hoverColor` | `#dc3522` | Fill color of the hovered region   |

Both keys are optional. Any key you leave out uses its default value.

### Tooltips

Tooltips are off by default. Set `showTooltip` to show the region name on hover:

```tsx
<CountryMap data={mexico} showTooltip />
```

Pass `tooltipText` to customize the content. It accepts a static `ReactNode` or a function that receives the hovered region:

```tsx
<CountryMap
  data={mexico}
  showTooltip
  tooltipText={(region) => (
    <div>
      <strong>{region.name}</strong>
      <div style={{ opacity: 0.7, fontSize: 12 }}>{region.id}</div>
    </div>
  )}
/>
```

The tooltip follows the cursor. Near the top edge of the map, it flips below the cursor automatically. See [Styling](#styling) to change its appearance.

### Zooming

Zoom is on by default. Users can zoom in these ways:

- Press the zoom buttons in the bottom-right corner. The map zooms around its center.
- Hold <kbd>Ctrl</kbd> (or <kbd>⌘</kbd> on macOS) and turn the mouse wheel, or pinch on a trackpad. The map zooms around the pointer. A plain wheel still scrolls the page.
- Pinch with two fingers on a touch screen.

When the map is zoomed in, drag it to pan. A drag never selects a region, so `onClick` fires only for real clicks. Zoom goes from 1× to 8×. Borders keep the same pixel width at every zoom level.

```tsx
<CountryMap data={germany} showZoomControls={false} />  // gestures only, no buttons
<CountryMap data={germany} zoomable={false} />          // no zoom at all
```

The zoom resets when `data` or `viewBox` changes.

### Highlighting a Selected Region

Use `regionStyle` to return per-region inline styles. The function receives the region and its current hover state:

```tsx
import { useCallback, useState } from "react";
import { CountryMap, type Region } from "react-country-maps";
import poland from "react-country-maps/countries/poland";

export function SelectableMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const regionStyle = useCallback(
    (region: Region, { hovered }: { hovered: boolean }) =>
      !hovered && region.id === selectedId ? { fill: "#2563eb" } : undefined,
    [selectedId],
  );

  return (
    <CountryMap
      data={poland}
      regionStyle={regionStyle}
      onClick={(region) => setSelectedId(region.id)}
    />
  );
}
```

### Choropleth (Data-Driven) Maps

Combine `regionStyle` with your own data, keyed by region ID:

```tsx
const population: Record<string, number> = {
  "DE-BY": 13.1,
  "DE-NW": 17.9,
  "DE-BW": 11.1,
  // ...
};

function colorFor(value = 0) {
  if (value > 15) return "#1e3a8a";
  if (value > 10) return "#3b82f6";
  if (value > 5) return "#93c5fd";
  return "#dbeafe";
}

<CountryMap
  data={germany}
  showTooltip
  tooltipText={(region) =>
    `${region.name}: ${population[region.id] ?? "n/a"}M`
  }
  regionStyle={(region, { hovered }) =>
    hovered ? undefined : { fill: colorFor(population[region.id]) }
  }
/>;
```

### Wrapping Regions

`regionWrapper` lets you wrap each region's `<path>` element in your own SVG markup. Use it for links, third-party tooltip libraries or custom attributes:

```tsx
<CountryMap
  data={sweden}
  regionWrapper={(element, region) => (
    <a href={`/regions/${region.id}`} aria-label={region.name}>
      {element}
    </a>
  )}
/>
```

The returned element is rendered inside an `<svg>`, so it must be valid SVG content.

---

## API Reference

### `<CountryMap />`

| Prop               | Type                                                               | Default        | Description                                                                                                 |
| ------------------ | ------------------------------------------------------------------ | -------------- | ----------------------------------------------------------------------------------------------------------- |
| `data`             | `Country`                                                          | **required**   | The country to render. Import one from `react-country-maps/countries/*` or provide your own.                |
| `viewBox`          | `ViewBox`                                                          | `data.viewBox` | Overrides the SVG viewBox. Use it to crop or zoom into part of the country.                                 |
| `visible`          | `boolean`                                                          | `true`         | Hides the map (with the `hidden` attribute) without unmounting it.                                          |
| `hoverable`        | `boolean`                                                          | `true`         | Enables hover highlighting, the tooltip and `onHover`. Set to `false` for a static map.                     |
| `showTooltip`      | `boolean`                                                          | `false`        | Shows a tooltip for the hovered or focused region.                                                          |
| `tooltipText`      | `ReactNode \| (region: Region) => ReactNode`                       | `region.name`  | Tooltip content. Static content, or a function that returns content for each region.                        |
| `tooltipClassName` | `string`                                                           | —              | Extra class name added to the tooltip root element.                                                         |
| `tooltipStyle`     | `CSSProperties`                                                    | —              | Inline styles for the tooltip content box.                                                                  |
| `customStyle`      | `Partial<CustomStyleType>`                                         | —              | Idle and hover fill colors. See [Custom Colors](#custom-colors).                                            |
| `borderWidth`      | `number`                                                           | `1.25`         | Gap between neighboring regions, in CSS pixels. The gap shows the page background. Set `0` to remove it. See [Region Borders](#region-borders). |
| `zoomable`         | `boolean`                                                          | `true`         | Enables zoom and pan. Set to `false` for a fixed map. This also hides the zoom buttons. See [Zooming](#zooming). |
| `showZoomControls` | `boolean`                                                          | `true`         | Shows the zoom in and zoom out buttons. Set to `false` to keep zoom gestures without the buttons.           |
| `regionStyle`      | `(region: Region, state: { hovered: boolean }) => CSSProperties \| undefined` | —   | Per-region inline styles. Use it for selection, choropleths and other data-driven styling.                  |
| `regionWrapper`    | `(element: ReactElement, region: Region) => ReactElement`          | —              | Wraps each region's `<path>` element in custom SVG markup.                                                  |
| `onHover`          | `(region: Region) => void`                                         | —              | Called when the pointer enters a region, or when a region gets keyboard focus.                              |
| `onLeave`          | `(region: Region) => void`                                         | —              | Called when the pointer leaves a region, or when a region loses keyboard focus.                             |
| `onClick`          | `(region: Region) => void`                                         | —              | Called when a region is clicked, or activated with <kbd>Enter</kbd> / <kbd>Space</kbd>. Also makes regions focusable. |
| `className`        | `string`                                                           | —              | Class name for the outer container `<div>`.                                                                 |
| `style`            | `CSSProperties`                                                    | —              | Inline styles for the outer container `<div>`.                                                              |

### Types

All types are exported from the package root:

```ts
import type {
  Country,
  Region,
  ViewBox,
  CustomStyleType,
  CountryMapProps,
} from "react-country-maps";
```

```ts
interface Country {
  id: string;        // ISO 3166-1 alpha-2 code, e.g. "DE"
  name: string;      // Display name, e.g. "Germany"
  viewBox: ViewBox;  // Default SVG viewBox for the map
  regions: Region[];
}

interface Region {
  id: string;        // Stable region ID, e.g. "DE-BY"
  name: string;      // Display name, e.g. "Bavaria"
  path: string;      // SVG path data (the "d" attribute)
}

interface ViewBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface CustomStyleType {
  idleColor: string;
  hoverColor: string;
}
```

---

## Styling

### Class Names and Data Attributes

The component renders stable class names and data attributes. You can target them from your own CSS:

| Selector                     | Element                                     |
| ---------------------------- | ------------------------------------------- |
| `.rcm-region`                | Every region `<path>`                       |
| `.rcm-region[data-region-id="DE-BY"]` | One specific region                |
| `.rcm-region[data-hovered]`  | The region under the pointer                |
| `.rcm-tooltip`               | Tooltip root (positioned by the component)  |
| `.rcm-tooltip__content`      | Tooltip content box                         |
| `.rcm-zoom`                  | Zoom button group                           |
| `.rcm-zoom__button`          | Zoom in and zoom out buttons                |

### Region Borders

Neighboring regions are separated by a thin gap. The gap is transparent, so it always shows the background behind the map, on light and dark pages. The width is set in CSS pixels, so it stays the same at every map size. The default is `1.25`. Change it with the `borderWidth` prop:

```tsx
<CountryMap data={germany} borderWidth={3} />  // wider gap
<CountryMap data={germany} borderWidth={0} />  // no gap
```

Example: add a colored stroke to each region.

```css
.rcm-region {
  stroke: #ffffff;
  stroke-width: 0.5;
}
```

> Region fill colors are set as inline styles. To change them, use `customStyle` or `regionStyle` instead of CSS.

### Tooltip Theme

The tooltip styles are injected automatically, so you do not need to import a stylesheet. Override these CSS custom properties on any ancestor element to theme the tooltip:

| Variable                 | Default                         |
| ------------------------ | ------------------------------- |
| `--rcm-tooltip-bg`       | `rgba(24, 24, 27, 0.86)`        |
| `--rcm-tooltip-color`    | `#fafafa`                       |
| `--rcm-tooltip-border`   | `rgba(255, 255, 255, 0.08)`     |
| `--rcm-tooltip-radius`   | `8px`                           |
| `--rcm-tooltip-font`     | `ui-sans-serif, system-ui, ...` |

```css
.light-theme {
  --rcm-tooltip-bg: #ffffff;
  --rcm-tooltip-color: #18181b;
  --rcm-tooltip-border: #e4e4e7;
  --rcm-tooltip-radius: 6px;
}
```

The tooltip respects `prefers-reduced-motion`.

### Zoom Controls Theme

The zoom buttons use the tooltip variables by default, so one theme covers both. Set these variables to style the buttons on their own:

| Variable              | Default                                  |
| --------------------- | ---------------------------------------- |
| `--rcm-zoom-bg`       | `--rcm-tooltip-bg`                       |
| `--rcm-zoom-color`    | `--rcm-tooltip-color`                    |
| `--rcm-zoom-border`   | `--rcm-tooltip-border`                   |
| `--rcm-zoom-radius`   | `12px`                                   |
| `--rcm-zoom-focus`    | `#3b82f6` (keyboard focus ring)          |

To move the buttons, override the position of `.rcm-zoom`:

```css
.rcm-zoom {
  top: 12px;
  bottom: auto;
}
```

Zoom button animations respect `prefers-reduced-motion`.

---

## Accessibility

- The map is an SVG with `role="group"` and an `aria-label` set to the country name.
- Each region has an `aria-label` set to its name.
- When you pass `onClick`, regions get `role="button"` and `tabIndex={0}`. Users can then move between regions with <kbd>Tab</kbd> and activate them with <kbd>Enter</kbd> or <kbd>Space</kbd>.
- Keyboard focus triggers the same hover state, tooltip and `onHover` callback as the pointer.
- The zoom buttons are native `<button>` elements with the labels "Zoom in" and "Zoom out". A button is disabled when the map cannot zoom further in that direction.

---

## Using Your Own Map Data

`CountryMap` accepts any object that matches the `Country` type. You can render custom maps, such as sales territories or city districts:

```tsx
import { CountryMap, type Country } from "react-country-maps";

const myMap: Country = {
  id: "XX",
  name: "My Custom Map",
  viewBox: { left: 0, top: 0, width: 200, height: 100 },
  regions: [
    { id: "west", name: "West", path: "M0,0 H100 V100 H0 Z" },
    { id: "east", name: "East", path: "M100,0 H200 V100 H100 Z" },
  ],
};

<CountryMap data={myMap} showTooltip />;
```

Path coordinates must use the same coordinate system as the `viewBox`.

---

## Contributing

Contributions are welcome, especially new countries and fixes for the regions listed in [Data Notes](#data-notes). Most countries can be added with a single command:

```bash
pnpm build:country FR france 8%
```

When the source data has a wrong code, an area to leave out, regions to merge or a far-away region to show as an inset, add an entry to [`scripts/region-overrides.ts`](./scripts/region-overrides.ts) and run the command again.

Read the [Contributing Guide](./CONTRIBUTING.md) for the development setup, the country generation workflow, coding guidelines and the pull request process.

To report a security vulnerability, follow the [Security Policy](./SECURITY.md). Do not open a public issue.

---

## Data Source & Attribution

Map geometry is derived from [Natural Earth](https://www.naturalearthdata.com/) (Admin 1 – States, Provinces, version 5.1.1), which is in the public domain. No attribution is legally required, but we thank the Natural Earth project for this resource.

The Turkey map is derived from [svg-turkiye-haritasi](https://github.com/dnomak/svg-turkiye-haritasi) by Doğukan Güven Nomak, used under the MIT License. Its copyright notice is included in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

Borders and names in this library come from the source dataset. They do not represent a political position of the authors.

---

## License

[MIT](./LICENSE)

Map data attribution and third-party licenses are listed in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
