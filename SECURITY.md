# Security Policy

## Supported Versions

`react-country-maps` is in the `0.x` phase. Only the latest minor release receives security fixes.

| Version | Supported |
| ------- | --------- |
| 0.2.x   | Yes       |
| < 0.2   | No        |

If you use an older version, upgrade to the latest release before you report a problem.

## Reporting a Vulnerability

**Do not report security vulnerabilities in public issues, discussions or pull requests.**

Report them privately through GitHub:

1. Go to the [Security Advisories](https://github.com/knetic0/react-country-maps/security/advisories/new) page of this repository.
2. Click **Report a vulnerability** and fill in the form.

Include as much of this information as you can:

- The affected version of `react-country-maps`
- The type of problem (for example cross-site scripting or prototype pollution)
- The affected file, component or prop
- The steps to reproduce the problem, or a proof of concept
- The impact: what an attacker can do and under which conditions

## What to Expect

This project is maintained by one person in their free time. The targets below are a best effort, not a guarantee.

- **Acknowledgement:** within 7 days of your report
- **First assessment:** within 14 days, including whether the report is accepted
- **Fix:** depends on the severity and complexity. You get updates on the progress in the advisory.

When a fix is ready, we publish a new release and a GitHub Security Advisory. We credit you in the advisory, unless you ask to stay anonymous.

Please give us a reasonable amount of time to release a fix before you disclose the problem publicly.

## Scope

The published npm package contains the React components in `src/core/` and the generated country data in `src/countries/`. It has no runtime dependencies besides React.

**In scope:**

- Cross-site scripting (XSS) or HTML injection through props, region names, region IDs or custom `Country` data
- CSS injection through the injected tooltip or zoom control styles
- Problems in the published package itself, for example malicious or unexpected code in `dist/`
- Vulnerabilities in the build output that affect applications that install the package

**Out of scope:**

- Wrong borders, region names or region IDs. Use the **Map data problem** issue template for these.
- Vulnerabilities in development dependencies (`devDependencies`) that do not affect the published package
- Vulnerabilities in the development tools (`scripts/`, `playground/`) that need a malicious local file to run
- Problems that only occur when an application passes unsanitized, untrusted input to its own code, outside this library

If you are not sure whether a problem is in scope, report it privately anyway.
