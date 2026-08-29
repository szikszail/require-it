# Personal package audit

Date: 2026-05-16

Scope:
- Public repositories under `szikszail`
- Open-source package repos only
- Private repos were not fully audited because the local `gh` auth token was invalid in this environment

## Summary

- I found no TSLint usage in the checked npm package repos.
- Most npm repos already use ESLint; two repos use legacy `.eslintrc` ESLint config, which is still ESLint and not TSLint.
- Two npm repos appear to have no lint config at all: `aws-github-pages` and `diffter`.
- GitHub security advisories were `0` for the checked public repos.
- Dependabot open alerts do exist in several npm repos and should be treated as the active security follow-up list.

## Package freshness

### Public npm packages

| Repo | Published version | Latest publish | Status |
|---|---:|---:|---|
| `require-it` | `2.3.0` | 2026-05-16 | Current |
| `aws-github-pages` | `0.1.0` | not published to npm | Not published |
| `npm-package` | `0.0.1` | 2022-05-11 | Stale |
| `with-aws-creds` | `1.3.0` | 2022-07-05 | Stale |
| `object-set-type` | `2.3.0` | 2026-02-07 | Current |
| `date-x` | `2.0.0` | 2026-02-08 | Current |
| `assert-logic` | `1.2.0` | 2026-02-08 | Current |
| `normalized-map` | `1.2.0` | 2026-02-08 | Current |
| `dotenv-ng` | `1.4.1` | 2025-12-05 | Current enough |
| `lines-builder` | `1.6.0` | 2026-02-07 | Current |
| `cross-process-lock` | `2.2.0` | 2026-02-07 | Current |
| `diffter` | `1.3.1` | 2023-07-27 | Stale |

### Public Python packages

| Repo | Version | Latest upload | Status |
|---|---:|---:|---|
| `yamltopy` | `1.0.0` | 2021-03-12 | Stale |
| `nested-json` | `1.0.1` | 2022-02-07 | Stale |

## ESLint / TSLint check

### ESLint detected

- `require-it` uses ESLint with flat config.
- `aws-github-pages` has no lint config found.
- `npm-package` uses ESLint with legacy `.eslintrc`.
- `with-aws-creds` uses ESLint with legacy `.eslintrc`.
- `object-set-type` uses ESLint with flat config.
- `date-x` uses ESLint with flat config.
- `assert-logic` uses ESLint with flat config.
- `normalized-map` uses ESLint with flat config.
- `dotenv-ng` uses ESLint with flat config.
- `lines-builder` uses ESLint with flat config.
- `cross-process-lock` uses ESLint with flat config.
- `diffter` has no lint config found.

### TSLint

- No `tslint.json` or `tslint` usage was found in the checked npm repos.
- No npm repo in this set appears to need a TSLint-to-ESLint migration.

## GitHub security signal

### Security advisories

- Public repository security advisories returned `0` for every checked package repo.

### Open Dependabot alerts

| Repo | Open alerts |
|---|---:|
| `require-it` | `0` |
| `aws-github-pages` | `2` |
| `npm-package` | `2` |
| `with-aws-creds` | `2` |
| `object-set-type` | `9` |
| `date-x` | `9` |
| `assert-logic` | `11` |
| `normalized-map` | `10` |
| `dotenv-ng` | `0` |
| `lines-builder` | `10` |
| `cross-process-lock` | `0` |
| `diffter` | `1` |
| `yamltopy` | `0` |
| `nested-json` | `0` |

Total open Dependabot alerts across the checked public npm packages: `56`.

## Recommended follow-up

1. Triage the open Dependabot alerts first, starting with the repos that have the highest counts.
2. If you want modernization work, migrate the legacy ESLint configs in `npm-package` and `with-aws-creds` to flat config.
3. If you want, I can turn this into a repo-by-repo dependency upgrade plan next.
