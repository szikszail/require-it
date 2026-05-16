# AGENTS.md

## Project overview

`require-it` is a small CommonJS TypeScript library that extends Node's module loading behavior so callers can:

- require nested local dependencies with `requireIt`
- require globally installed packages with `requireGlobal`
- resolve packages from an explicit root with `requireFrom`

The public API lives in `src/index.ts`. Files in `src/utils.ts` are supporting filesystem helpers. Tests are in `tests/index.test.ts`, with fixture packages under `tests/test-module/node_modules`.

## Repository map

- `src/index.ts` — public API, resolution logic, exported types
- `src/utils.ts` — filesystem and package-discovery helpers
- `tests/index.test.ts` — Jest coverage for direct, nested, scoped, dotted, and global packages
- `tests/test-module/` — checked-in fixture tree used by the resolver tests
- `package.json` — authoritative source for scripts, Jest config, coverage thresholds, and package metadata
- `tsconfig.json` — TypeScript build settings
- `eslint.config.mjs` — flat ESLint configuration for TypeScript and stylistic rules

## Development workflow

Use the scripts already defined in `package.json`:

```bash
npm test
npm run compile
npm run build
```

- `npm run compile` runs `tsc` and then ESLint.
- `npm test` runs Jest and writes reports under `dist/reports`.
- `npm run build` cleans `dist`, compiles, copies package files, runs tests with coverage, and generates TypeDoc output.

When changing behavior, prefer the smallest verification that proves the edit, then run the broader command if the change is non-trivial.

## Important project conventions

- Keep the library CommonJS-compatible. `tsconfig.json` uses Node16 module settings, and `package.json` exposes generated root-level JS and declaration files from `dist`.
- Preserve the current public surface unless the task explicitly calls for an API change:
  - `requireIt`
  - `requireGlobal`
  - `requireFrom`
  - their `.resolve()` and `.directory()` helpers
- Use Node built-in imports with the `node:` prefix, matching the existing source.
- Keep TypeScript strictness intact. The project enables `noImplicitAny`, `noUnusedLocals`, and `noUnusedParameters`.
- Match existing formatting and lint behavior rather than introducing parallel tooling. ESLint flat config is the configured linter here.
- Do not remove or casually regenerate the checked-in fixture packages under `tests/test-module/node_modules`; they are intentional test data, not install artifacts.

## Testing notes

- Jest test files are matched with `**/tests/**/*.test.ts`.
- Global coverage thresholds are set to 85% for branches, functions, lines, and statements.
- Global-resolution tests mock `npm root -g` and reuse the checked-in fixture tree, so the suite should not need to mutate the machine's global npm state.
- If you change package discovery or path handling, cover at least:
  - direct dependencies
  - nested dependencies
  - scoped packages
  - dotted package names
  - packages whose main file name matches the package name
  - missing packages / missing `main`

## Implementation guidance

- Resolver behavior is intentionally filesystem-driven. Before replacing it with Node's default resolution, confirm that nested dependency lookup remains intact; that behavior is the point of the package.
- Be careful around `directory()`: it reconstructs package directories from resolved paths and must keep working across both `/` and `\` path separators.
- `getGlobalRoot()` shells out to `npm root -g` and caches the result. Changes there can affect all `requireGlobal` calls in-process.
- `readPackageJSON()` uses `require()` intentionally so package metadata is loaded the same way as the rest of the CommonJS codebase.

## CI and release context

GitHub Actions delegates most workflows to shared reusable workflows:

- pull requests and CI run the package build workflow
- docs publish from the generated TypeDoc folder
- releases are handled from GitHub releases and `beta/**` branches

If you change output locations, coverage paths, or documentation paths, update the workflow expectations too.

## Before handing work back

For source changes:

1. Run the narrowest relevant test first.
2. Run `npm run compile`.
3. Run `npm test` when behavior changed or when touching resolver logic.
4. Mention any verification you could not run.
