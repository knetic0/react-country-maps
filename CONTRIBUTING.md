# Contributing to react-country-maps

Thank you for your interest in contributing! This project is open source, and contributions of all sizes are welcome: bug reports, documentation fixes, new features and, most of all, **new countries**.

This guide explains how to set up the project, how the code is organized and what we expect from a pull request.

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features or Countries](#requesting-features-or-countries)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Adding a New Country](#adding-a-new-country)
- [Updating an Existing Country](#updating-an-existing-country)
- [Changing the Component](#changing-the-component)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [License](#license)

---

## Ways to Contribute

- **Add a country.** This is the most valuable contribution. A script does most of the work. See [Adding a New Country](#adding-a-new-country).
- **Report a bug.** Wrong borders, wrong region names and broken interactions all count.
- **Improve the documentation.** Fix typos, clarify examples or add missing details.
- **Improve the component.** Fix bugs, improve performance or accessibility, or propose new features.

If you plan a large change, open an issue first. This lets us agree on the approach before you spend time on it.

---

## Reporting Bugs

Before you open an issue, search the existing issues to check whether someone has already reported the problem.

A good bug report includes:

- The version of `react-country-maps`, React and your bundler or framework (for example Vite, Next.js)
- The browser and operating system, if the problem is visual or interactive
- The steps to reproduce the problem
- What you expected to happen, and what happened instead
- A minimal code example, or a link to a reproduction (CodeSandbox, StackBlitz or a small repository)

For **map data problems** (wrong border, missing region, wrong name), include the country, the region ID and, if possible, a link to a reliable source for the correct data.

---

## Requesting Features or Countries

Open an issue and describe:

- **For a feature:** the problem you want to solve and how you would use the feature. Explain the use case, not only the solution.
- **For a country:** the country name and its ISO 3166-1 alpha-2 code. If you can, open a pull request instead. Adding a country usually takes a few minutes.

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+
- [pnpm](https://pnpm.io/) (this project uses a `pnpm-lock.yaml`, so do not use npm or yarn to install dependencies)
- Git

### Install and Run

1. Fork the repository on GitHub, then clone your fork:

   ```bash
   git clone https://github.com/<your-username>/react-country-maps.git
   cd react-country-maps
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the playground:

   ```bash
   pnpm dev
   ```

   Open `http://localhost:5173`. The playground loads every country in `src/countries/` automatically. Use it to test countries, colors, tooltips, hover and click events.

### Available Scripts

| Script               | Description                                    |
| -------------------- | ---------------------------------------------- |
| `pnpm dev`           | Start the playground with hot reload           |
| `pnpm build`         | Type-check the project and build the library   |
| `pnpm test`          | Run the tests (Vitest), including data checks  |
| `pnpm typecheck`     | Type-check without building                    |
| `pnpm lint`          | Run ESLint                                     |
| `pnpm preview`       | Preview the production build                   |
| `pnpm build:country` | Generate country data from Natural Earth       |

---

## Project Structure

```
react-country-maps/
├── src/
│   ├── index.ts              # Public API of the library
│   ├── core/
│   │   ├── CountryMap.tsx    # Main map component
│   │   ├── Tooltip.tsx       # Tooltip component and its injected CSS
│   │   └── types.ts          # Country, Region, ViewBox, CustomStyleType
│   ├── countries/
│   │   └── <country>/
│   │       ├── index.ts      # Country metadata (ID, name, viewBox)
│   │       └── regions.ts    # Region geometry (generated)
│   └── utils/
│       └── defineCountry.ts  # Typed helper for country definitions
├── scripts/
│   ├── build-country.ts      # Country data generator
│   └── region-overrides.ts   # Fixes for wrong ISO codes in Natural Earth
├── test/                     # Vitest tests, including country data checks
├── playground/               # Local development app (not published)
└── raw/                      # Source shapefiles (not committed)
```

---

## Adding a New Country

Country data is generated from the [Natural Earth Admin 1 – States, Provinces](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/) dataset at 1:10m scale. Do not draw or edit region paths by hand.

### 1. Download the Source Data

This step is only necessary once. The `raw/` directory is in `.gitignore`, so you must download the data yourself.

1. Download **Admin 1 – States, Provinces** from the [Natural Earth download page](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/).
2. Extract the archive into `raw/`.
3. Make sure this file exists: `raw/ne_10m_admin_1_states_provinces.shp`.

### 2. Run the Generator

```bash
pnpm build:country <ISO_A2> <folder> [simplify]
```

| Argument   | Description                                                                 | Example   |
| ---------- | --------------------------------------------------------------------------- | --------- |
| `ISO_A2`   | ISO 3166-1 alpha-2 code of the country, in uppercase                        | `FR`      |
| `folder`   | Folder name in `src/countries/`. Use lowercase kebab-case English names.    | `france`  |
| `simplify` | Optional. Percentage of points to keep. Lower values give smaller files.    | `8%`      |

Example:

```bash
pnpm build:country FR france 8%
```

The script:

1. Filters the dataset to the given country
2. Simplifies the shapes with [mapshaper](https://github.com/mbloch/mapshaper)
3. Projects them to SVG paths with a Mercator projection, 1000 units wide
4. Writes `src/countries/<folder>/index.ts` and `src/countries/<folder>/regions.ts`

Every region ID must be a unique ISO 3166-2 code, and `pnpm test` checks this. Natural Earth sometimes gives two features the same code. The script then does two things:

- It applies the fixes in [`scripts/region-overrides.ts`](./scripts/region-overrides.ts). Add a fix there, keyed by the Natural Earth `adm1_code`, when a feature has a wrong code (for example a province that reuses the code of its capital city).
- It merges features that still share a code into one region, for example a county that Natural Earth splits into councils. The merged region gets the name of its largest part, unless `MERGED_NAMES` sets one.

The script prints a warning for each duplicate ID or empty name that is left.

### 3. Check the Result

Run `pnpm dev`, select the new country in the playground and check:

- [ ] All regions render, and there are no gaps or overlapping shapes.
- [ ] Small islands and exclaves are visible, if they are part of the country.
- [ ] The number of regions matches the country's first-level administrative divisions.
- [ ] Region names are correct and use their common English or official romanized form.
- [ ] Hover, click and tooltip work for every region.
- [ ] The size of `regions.ts` is reasonable. Most countries are under 100 KB. If the file is much larger, try a lower `simplify` value. If shapes look too rough, try a higher value.

### 4. Update the Documentation

Add the country to the **Available Countries** table in [README.md](./README.md). Keep the table in alphabetical order and include the import path, the ISO code and the number of regions.

### 5. Open a Pull Request

Include in the pull request description:

- The command you ran, including the `simplify` value
- A screenshot of the country in the playground
- Any known data problems (for example, a recent administrative reform that the dataset does not include yet)

---

## Updating an Existing Country

Generated files start with a comment that shows the exact command used to create them:

```ts
// Auto-generated: pnpm build:country DE germany 8%
```

To update a country, re-run the script with a changed argument (for example a different `simplify` value). **Do not edit `regions.ts` by hand.** Manual changes are lost the next time someone runs the script.

**Changing region IDs is a breaking change.** Users store region IDs and join them with their own data. If a change renames or removes any region ID, say so clearly in the pull request.

---

## Changing the Component

The component code is in `src/core/`. When you change it, keep these principles in mind:

- **No new runtime dependencies.** The library depends only on React. Development tools (in `devDependencies`) are fine.
- **Keep the public API stable.** Do not rename or remove props or exported types without discussing it in an issue first. New props must be optional and have a sensible default.
- **Keep it SSR-safe.** Do not access `window` or `document` during render.
- **Keep it accessible.** Regions must stay usable with the keyboard and screen readers.
- **Keep it fast.** Some countries have more than 100 regions. Avoid changes that re-render every region on each hover.
- **Update the documentation.** If you add or change a prop, update the API reference in [README.md](./README.md).

Test your change in the playground with a small country (for example Denmark) and a large one (for example Slovenia or the Philippines).

---

## Coding Guidelines

- Write all code in **TypeScript**. Avoid `any`.
- Write all code, comments, identifiers, UI text and documentation in **English**.
- Follow the existing code style. Run `pnpm lint` and fix all errors before you commit.
- Make sure `pnpm test` passes and `pnpm build` completes without type errors.
- Keep pull requests focused. One pull request should do one thing. Do not mix a new country with unrelated refactoring.

---

## Commit Messages

We use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <short description>
```

Common types:

| Type       | Use for                                          | Example                                      |
| ---------- | ------------------------------------------------ | -------------------------------------------- |
| `feat`     | A new feature or a new country                   | `feat: add France`                           |
| `fix`      | A bug fix or a data correction                   | `fix: correct region name for Bavaria`       |
| `docs`     | Documentation only                               | `docs: add choropleth example`               |
| `refactor` | Code change that does not change behavior        | `refactor: extract tooltip positioning`      |
| `perf`     | Performance improvement                          | `perf: memoize region styles`                |
| `chore`    | Tooling, dependencies, configuration             | `chore: update vite`                         |

Write the description in the imperative mood ("add", not "added" or "adds").

---

## Pull Request Process

1. Create a branch from `main` with a descriptive name, for example `feat/add-france` or `fix/tooltip-position`.
2. Make your changes and commit them.
3. Before you push, run:

   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```

4. Push the branch to your fork and open a pull request against `main`.
5. Describe **what** you changed and **why**. Link any related issue (for example `Closes #12`). Add screenshots for visual changes.
6. A maintainer will review your pull request. Please respond to feedback and push updates to the same branch.

Pull requests are merged when they pass review and all checks succeed.

---

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE), the same license as the project.

Map data comes from [Natural Earth](https://www.naturalearthdata.com/), which is in the public domain. Do not add map data from sources with a restrictive license (for example, data that requires attribution under CC BY-SA or data with commercial restrictions) without discussing it in an issue first.
