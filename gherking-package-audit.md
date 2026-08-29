# Gherking package audit

Date: 2026-05-16

Scope:
- Public, non-fork repositories under `gherking`
- Package-bearing repos only
- Private repos were not audited in full

## Summary

- No TSLint usage was found in the checked public package repos.
- Almost all checked npm packages already use ESLint.
- Two repos have no lint config found: `gherking-docs` and `gherkin-assembler`.
- Public repository security advisories returned `0` across the checked package repos.
- Open Dependabot alerts exist in many of the published npm packages and are the main active security follow-up item.

## Package freshness

| Repo | Package name | Published version | Latest publish | Status |
|---|---|---:|---|---|
| `gpc-macro` | `gpc-macro` | `1.0.0` | 2022-05-04 | Stale |
| `gpc-remove-duplicates` | `gpc-remove-duplicates` | `1.0.0` | 2022-05-04 | Stale |
| `gpc-remove-comments` | `gpc-remove-comments` | `1.0.0` | 2022-05-04 | Stale |
| `gpc-scenario-outline-numbering` | `gpc-scenario-outline-numbering` | `1.0.0` | 2022-05-04 | Stale |
| `gpc-license` | `gpc-license` | `1.0.0` | 2022-04-10 | Stale |
| `gpc-test-data` | `gpc-test-data` | `1.2.0` | 2023-11-28 | Stale-ish |
| `gherkin-formatter` | `gherkin-formatter` | `1.2.2` | 2024-01-22 | Stale-ish |
| `gherkin-io` | `gherkin-io` | `1.3.0` | 2023-11-12 | Stale-ish |
| `gpc-scenario-numbering` | `gpc-scenario-numbering` | `1.0.1` | 2022-05-04 | Stale |
| `gherkin-ast` | `gherkin-ast` | `3.4.2` | 2024-01-22 | Stale-ish |
| `gpc-filter` | `gpc-filter` | `1.0.1` | 2022-05-04 | Stale |
| `gpc-scenario-outline-expander` | `gpc-scenario-outline-expander` | `1.0.0` | 2022-05-04 | Stale |
| `gpc-step-groups` | `gpc-step-groups` | `1.0.0` | 2022-05-04 | Stale |
| `gpc-template` | `gpc-template` | not published | not published | Not published |
| `gpc-replacer` | `gpc-replacer` | `1.0.1` | 2022-05-04 | Stale |
| `gpc-for-loop` | `gpc-for-loop` | `1.1.1` | 2024-10-09 | Current enough |
| `gherking` | `gherking` | `2.4.0` | 2023-11-14 | Stale-ish |
| `gherking-docs` | `gerking-docs` | not published | not published | Not published |
| `gherkin-assembler` | `gherkin-assembler` | `2.0.1` | 2022-06-18 | Stale |

## ESLint / TSLint check

### ESLint detected

- `gpc-macro`
- `gpc-remove-duplicates`
- `gpc-remove-comments`
- `gpc-scenario-outline-numbering`
- `gpc-license`
- `gpc-test-data`
- `gherkin-formatter`
- `gherkin-io`
- `gpc-scenario-numbering`
- `gherkin-ast`
- `gpc-filter`
- `gpc-scenario-outline-expander`
- `gpc-step-groups`
- `gpc-template`
- `gpc-replacer`
- `gpc-for-loop`
- `gherking`

### No lint config found

- `gherking-docs`
- `gherkin-assembler`

### TSLint

- No `tslint.json` or `tslint` usage was found in the checked public package repos.
- No checked gherking npm package appears to need a TSLint-to-ESLint migration.

## GitHub security signal

### Security advisories

- Public repository security advisories returned `0` for every checked package repo.

### Open Dependabot alerts

| Repo | Open alerts |
|---|---:|
| `gpc-macro` | `0` |
| `gpc-remove-duplicates` | `0` |
| `gpc-remove-comments` | `0` |
| `gpc-scenario-outline-numbering` | `0` |
| `gpc-license` | `0` |
| `gpc-test-data` | `2` |
| `gherkin-formatter` | `2` |
| `gherkin-io` | `0` |
| `gpc-scenario-numbering` | `0` |
| `gherkin-ast` | `1` |
| `gpc-filter` | `2` |
| `gpc-scenario-outline-expander` | `10` |
| `gpc-step-groups` | `17` |
| `gpc-template` | `18` |
| `gpc-replacer` | `14` |
| `gpc-for-loop` | `18` |
| `gherking` | `11` |
| `gherking-docs` | `0` |
| `gherkin-assembler` | `0` |

Total open Dependabot alerts across the checked public npm package repos: `95`.

## Recommended follow-up

1. Triage open Dependabot alerts first, starting with `gpc-for-loop`, `gpc-template`, `gpc-step-groups`, and `gpc-replacer`.
2. If you want modernization work, the lint setup is already ESLint-based, so this is mostly dependency and release freshness work rather than a TSLint migration.
3. If you want, I can turn this into a repo-by-repo upgrade checklist next.
