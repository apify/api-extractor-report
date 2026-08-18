# api-extractor-report

Generates a per-package map of the public type-level interface of every publishable package in a TypeScript monorepo, committed to `docs/public-api/<package>.api.md`. Those reports are where a project promises backwards compatibility, so any change to them shows up in review. Run without arguments to regenerate the reports, or with `--verify` to fail (and print the surface diff) when a committed report is out of date.

It wraps [API Extractor](https://api-extractor.com/) and fixes up the places where its output does not describe exactly the surface it maps: unused imports left behind by the `@public` trim are pruned, symbols the public API references but the entry point never exports are emitted as non-exported declarations with a banner, and a `@public` signature referencing an `@internal` type fails the run as a genuine tagging bug. See the comment at the top of `src/run.ts` for the full rationale.

The entry point is TypeScript, run directly by Node's built-in type stripping — there is no build step, but Node 22.18 or newer is required.

## Usage

Run it from the root of the repository you want to map:

```bash
npx github:apify/api-extractor-report            # regenerate the reports
npx github:apify/api-extractor-report --verify   # fail if they are out of date
```

It expects each package to be built (`dist/index.d.ts` present) before it runs.

## Arguments

`--verify` checks the committed reports instead of rewriting them, `--packages=<dir>` points at the workspace directory holding the packages (default `packages`), `--reports=<dir>` sets where the reports are committed (default `docs/public-api`), `--exclude=<a,b>` skips packages by name, and `--extract-command=<cmd>` sets the command named in "report out of date" messages when the project wraps this tool in a package script. Private packages are always skipped.

Failures are additionally emitted as GitHub Actions workflow commands when running in CI, so they appear as inline annotations; force this on or off with `--github` / `--no-github`.
