# react-country-maps

Interactive, accessible SVG maps of countries and their first-level administrative regions (states, provinces, prefectures, counties) for React.

- **36 countries** out of the box, with ready-to-render region geometry
- **Zero runtime dependencies** besides React
- **Fully typed** with TypeScript
- **Hover, click and keyboard** interaction on every region
- **Built-in tooltip** with smart placement and CSS-variable theming
- **Responsive** SVG that scales to its container
- **SSR-safe**, so it works with Next.js, Remix and other server renderers
- **Bring your own data**: render any country that follows the `Country` shape

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Available Countries](#available-countries)
- [Usage Examples](#usage-examples)
  - [Handling Events](#handling-events)
  - [Custom Colors](#custom-colors)
  - [Tooltips](#tooltips)
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

| Country       | Import path                                | ISO code | Regions |
| ------------- | ------------------------------------------ | -------- | ------: |
| Austria       | `react-country-maps/countries/austria`      | `AT`     |       9 |
| Belgium       | `react-country-maps/countries/belgium`      | `BE`     |      11 |
| Brazil        | `react-country-maps/countries/brazil`       | `BR`     |      27 |
| Bulgaria      | `react-country-maps/countries/bulgaria`     | `BG`     |      28 |
| Croatia       | `react-country-maps/countries/croatia`      | `HR`     |      21 |
| Czechia       | `react-country-maps/countries/czechia`      | `CZ`     |      14 |
| Denmark       | `react-country-maps/countries/denmark`      | `DK`     |       5 |
| Egypt         | `react-country-maps/countries/egypt`        | `EG`     |      27 |
| Estonia       | `react-country-maps/countries/estonia`      | `EE`     |      15 |
| Finland       | `react-country-maps/countries/finland`      | `FI`     |      18 |
| Germany       | `react-country-maps/countries/germany`      | `DE`     |      16 |
| Greece        | `react-country-maps/countries/greece`       | `GR`     |      14 |
| Hungary       | `react-country-maps/countries/hungary`      | `HU`     |      43 |
| Indonesia     | `react-country-maps/countries/indonesia`    | `ID`     |      33 |
| Iran          | `react-country-maps/countries/iran`         | `IR`     |      31 |
| Ireland       | `react-country-maps/countries/ireland`      | `IE`     |      34 |
| Japan         | `react-country-maps/countries/japan`        | `JP`     |      47 |
| Kazakhstan    | `react-country-maps/countries/kazakhstan`   | `KZ`     |      16 |
| Kenya         | `react-country-maps/countries/kenya`        | `KE`     |       8 |
| Latvia        | `react-country-maps/countries/latvia`       | `LV`     |     119 |
| Lithuania     | `react-country-maps/countries/lithuania`    | `LT`     |      10 |
| Mexico        | `react-country-maps/countries/mexico`       | `MX`     |      33 |
| Nigeria       | `react-country-maps/countries/nigeria`      | `NG`     |      37 |
| Peru          | `react-country-maps/countries/peru`         | `PE`     |      26 |
| Philippines   | `react-country-maps/countries/philippines`  | `PH`     |     118 |
| Poland        | `react-country-maps/countries/poland`       | `PL`     |      16 |
| Romania       | `react-country-maps/countries/romania`      | `RO`     |      42 |
| Saudi Arabia  | `react-country-maps/countries/saudi-arabia` | `SA`     |      13 |
| Slovakia      | `react-country-maps/countries/slovakia`     | `SK`     |       8 |
| Slovenia      | `react-country-maps/countries/slovenia`     | `SI`     |     193 |
| South Korea   | `react-country-maps/countries/south-korea`  | `KR`     |      17 |
| Sweden        | `react-country-maps/countries/sweden`       | `SE`     |      21 |
| Switzerland   | `react-country-maps/countries/switzerland`  | `CH`     |      26 |
| Thailand      | `react-country-maps/countries/thailand`     | `TH`     |      77 |
| Turkey        | `react-country-maps/countries/turkey`       | `TR`     |      81 |
| Uzbekistan    | `react-country-maps/countries/uzbekistan`   | `UZ`     |      14 |

### Region IDs

Region IDs follow the [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) standard, for example `DE-BY` for Bavaria or `JP-13` for Tokyo. You can use them as stable keys to join the map with your own data.

**Exception:** Turkey uses lowercase, ASCII-only province slugs (for example `istanbul`, `canakkale`, `bursa`) instead of ISO 3166-2 codes.

To see the exact IDs of a country, read them from the data:

```ts
import japan from "react-country-maps/countries/japan";

console.table(japan.regions.map(({ id, name }) => ({ id, name })));
```

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

Example: add region borders.

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

---

## Accessibility

- The map is an SVG with `role="group"` and an `aria-label` set to the country name.
- Each region has an `aria-label` set to its name.
- When you pass `onClick`, regions get `role="button"` and `tabIndex={0}`. Users can then move between regions with <kbd>Tab</kbd> and activate them with <kbd>Enter</kbd> or <kbd>Space</kbd>.
- Keyboard focus triggers the same hover state, tooltip and `onHover` callback as the pointer.

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

Contributions are welcome, especially new countries. Most countries can be added with a single command:

```bash
pnpm build:country FR france 8%
```

Read the [Contributing Guide](./CONTRIBUTING.md) for the development setup, the country generation workflow, coding guidelines and the pull request process.

---

## Data Source & Attribution

Map geometry is derived from [Natural Earth](https://www.naturalearthdata.com/) (Admin 1 – States, Provinces, version 5.1.1), which is in the public domain. No attribution is legally required, but we thank the Natural Earth project for this resource.

Borders and names in this library come from the source dataset. They do not represent a political position of the authors.

---

## License

[MIT](./LICENSE)
