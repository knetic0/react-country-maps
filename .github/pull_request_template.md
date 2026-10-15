<!--
Thank you for your contribution!
Read the Contributing Guide before you open a pull request:
https://github.com/knetic0/react-country-maps/blob/main/CONTRIBUTING.md

Do not report security vulnerabilities in a pull request. See SECURITY.md.
-->

## Summary

<!-- What does this pull request change, and why? -->

## Related Issue

<!-- For example: Closes #12. Open an issue first for large changes. -->

## Type of Change

- [ ] New country
- [ ] Map data fix (existing country)
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring, performance or tooling

## Country Changes

<!-- Complete this section only if you add or update a country. Delete it otherwise. -->

- **Command:** <!-- for example: pnpm build:country FR france 8% -->
- **Number of regions:**
- **Size of `regions.ts`:**
- **Known data problems:** <!-- for example a recent administrative reform that Natural Earth does not include yet -->

- [ ] I generated the data with `pnpm build:country` and did not edit `regions.ts` by hand.
- [ ] I checked the country in the playground: all regions render, and hover, click and tooltip work.
- [ ] I added or updated the country in the **Available Countries** table in `README.md`.
- [ ] This change renames or removes one or more region IDs (**breaking change**). <!-- List them below. -->

## Screenshots

<!-- Required for new countries and visual changes. Delete this section otherwise. -->

## Checklist

- [ ] `pnpm lint` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` completes without type errors.
- [ ] I updated the documentation in `README.md` for any changed or new prop.
- [ ] The change adds no new runtime dependencies.
- [ ] The change does not rename or remove public props or exported types, or I discussed it in an issue first.
- [ ] My commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) format.
