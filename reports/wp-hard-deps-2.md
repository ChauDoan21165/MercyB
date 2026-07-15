# WP-HARD-DEPS-2 Dependency Vulnerability Pass

## PREMISE FIRST

- `git fetch origin` completed, then local `main` was reset to current `origin/main`.
- Clean tracked sync confirmed before branching: `HEAD=97c5dbb1`, `origin/main=97c5dbb1`, `git status -sb --untracked-files=no` clean.
- Intake report `reports/hardening-scan-2026-07-12T21-33-26-845Z.md` was produced against older `origin/main @ 2438a14c` and recorded check D = 60.

## Triage

### Shipped-path candidates

- `dompurify`: shipped. Direct dependency imported by `src/lib/security/inputSanitizer.ts`; used for learner-visible HTML sanitization. Lock-only bump applied from `3.4.11` to latest published `3.4.12`.
- `ws`: no direct source import found under app/function/script source. Transitive tooling/runtime dependency; lock-only bump applied from `8.20.0` to `8.21.0`.
- `qs`: no package import found; source hits were local `URLSearchParams` variables, not the npm package. Transitive only; lock-only bump applied from `6.15.1` to `6.15.3`.
- `monaco-editor`: no source import of `monaco-editor` or `@monaco-editor/react` found. Present through the direct `@monaco-editor/react` dependency; nested `dompurify@3.2.7` remains pinned by `monaco-editor@0.55.1`.

### Dev/build-only findings

- Vercel CLI tree: `vercel`, `@vercel/*`, `undici`, `path-to-regexp`, `smol-toml`, `srvx`, `ajv`, `tar`.
- Storybook tree: `@storybook/addon-essentials`, `@storybook/addon-actions`, nested `uuid`.
- Vitest/Vite/Babel/workbox tree: lock-only bumps applied where non-major and available.
- Capacitor/native tooling tree: `@capacitor/assets`, `@capacitor/cli`, `@trapezedev/project`, `replace`, `xcode`.
- Other dev/tooling transitive findings: `@tootallnate/once`, `basic-ftp`, `brace-expansion`, `js-yaml`, `minimatch`.

## Changes Applied

- `package-lock.json` only; no `package.json` dependency range changes.
- Applied non-major lock-safe updates with `fixAvailable=true`, including:
  - `dompurify 3.4.12`
  - `vite 6.4.3`
  - `vitest`, `@vitest/ui`, `@vitest/coverage-v8 3.2.7`
  - `ws 8.21.0`
  - `concurrently 9.2.4` and `shell-quote 1.9.0`
  - `qs 6.15.3`
  - `@xmldom/xmldom 0.9.10`
  - `basic-ftp 5.3.1`
  - `brace-expansion 5.0.7`
  - `ip-address 10.2.0`
- Updated `scripts/factory/hardening-scan-baseline.json`: check D `60 -> 41`, total `73 -> 54`.

## ACCEPTED-RISKS

- Vercel CLI tree: accepted for this WP because npm audit recommends `vercel@55.0.0` or `@vercel/node@4.0.0` as semver-major changes; brief forbids major upgrades.
- Storybook tree: accepted for this WP because npm audit recommends the major `@storybook/addon-essentials@7.0.6` path; brief forbids Storybook major work here.
- `@capacitor/assets` / `@capacitor/cli`: accepted for this WP because current audit reports `fixAvailable=false`; native asset tooling is not imported by shipped learner runtime.
- `monaco-editor` nested `dompurify`: accepted for this WP because there is no source import of Monaco and latest lock-resolvable `monaco-editor@0.55.1` still pins `dompurify@3.2.7`.
- Root `dompurify`: accepted as residual scanner finding after bump because latest published npm version is `3.4.12` and audit still reports advisories; the shipped sanitizer is at the newest available package.
- Remaining dev/tooling transitives with only major or unavailable remediation: accepted for this WP until their owning toolchains can move in a separate dependency-upgrade lane.

## Observed Done-Condition

- `NODE_OPTIONS=--max-old-space-size=6144 HARDENING_SCAN_CHECKS=D HARDENING_SCAN_REF=HEAD node scripts/hardening-scan.mjs`
- Result: check D `41` findings, down from intake `60`; npm audit metadata `{"info":0,"low":2,"moderate":13,"high":26,"critical":0,"total":41}`.
