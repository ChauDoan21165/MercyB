# Sentry release + sourcemap pipeline audit (A14b)

**Reviewer:** A14b (read-only)
**Worktree:** `/private/tmp/A14b-sentry-release` off `origin/main` @ `10f0b1533`
**Date:** 2026-05-19 / late session
**Trigger:** A14 follow-up to verify the web Sentry sourcemap + release pipeline end-to-end after PRs #714 / #723 / #816 / #821.

---

## TL;DR

```
╔══════════════════════════════════════════════════════════════╗
║ 📋  PIPELINE MOSTLY ✅  ·  1 LATENT GAP                      ║
║      Release tag is implicit (auto-detect), not explicit.   ║
║      Works today by Vercel/git default coincidence.         ║
║      Small follow-up PR makes it deterministic.             ║
╚══════════════════════════════════════════════════════════════╝
```

**Per-step status:**

| Step | Status |
|---|---|
| `SENTRY_AUTH_TOKEN` GitHub secret wired | ✅ |
| `SENTRY_ORG` + `SENTRY_PROJECT` set in workflow env | ✅ |
| `@sentry/vite-plugin` configured in `vite.config.ts` | ✅ |
| Sourcemaps generated as `"hidden"` (not shipped to client) | ✅ |
| `.map` files deleted from `dist/` after upload | ✅ |
| Sourcemap upload step runs on production deploys | ✅ |
| Missing token: warn + continue (correct per "core path survives optional failures") | ✅ |
| Wrong token: fail loud (plugin throws on auth error) | ✅ |
| Runtime `release` tag in `Sentry.init` (sentryInit.ts) | ✅ but implicit |
| Runtime `environment` tag in `Sentry.init` | ✅ but defaults via `MODE` |
| Plugin upload `release.name` ↔ runtime `release` ↔ Vercel deploy SHA pinned | ⚠️ **all three rely on auto-detection coincidence — see Gap 1** |
| Sentry-dashboard verification of an actual production error | ⏳ **A14 cannot do this — Chau-operator step** |

---

## 1. CI workflow — `.github/workflows/production-deploy.yml`

### What's wired

- **Env block (lines 41-43):**
  ```yaml
  SENTRY_ORG: chau-doan
  SENTRY_PROJECT: mercyblade-web
  SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
  ```
  ORG and PROJECT are hardcoded canonical values (not secret). Only the token is a GitHub secret.

- **Token-presence guard (lines 70-86):** prints a visible CI warning if `SENTRY_AUTH_TOKEN` is missing but does **not** `exit 1` — explicitly upholds "core path survives optional failures" (CLAUDE.md operating discipline). Wrong token fails loud later inside `@sentry/vite-plugin`'s upload step. ✅

- **Build step (line 95):** `npx vercel build --prod --token=…` — runs Vite via Vercel CLI, which inherits the three Sentry env vars from the job env block.

### What's missing

- **The workflow does NOT explicitly export `VERCEL_GIT_COMMIT_SHA` to the build step.** It relies on `vercel build` to detect git context and inject the variable itself. Vercel CLI does this in practice (it reads `git rev-parse HEAD`), but the workflow has no fallback if that detection ever changes.

  **Severity: medium-low.** Works today. The clean fix is one line in the env block:
  ```yaml
  VERCEL_GIT_COMMIT_SHA: ${{ github.sha }}
  ```

---

## 2. Vite config — `vite.config.ts`

### What's wired

- **`@sentry/vite-plugin` activation (lines 100-124):**
  ```ts
  ...(process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
    ? [sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        telemetry: false,
        sourcemaps: { filesToDeleteAfterUpload: ['**/*.map'] },
      })]
    : []),
  ```
  Triple-env-var guard. Local laptop builds without the token are silent no-ops (won't reach Sentry at all). ✅

- **`build.sourcemap` (lines 507-509):**
  ```ts
  sourcemap:
    process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
      ? ('hidden' as const)
      : false,
  ```
  Maps are emitted to `dist/` only when upload is wired; mode `"hidden"` strips the `//# sourceMappingURL=` comment so the client JS never points at them. Combined with the plugin's `filesToDeleteAfterUpload`, the maps reach Sentry and then disappear from the deploy artifact. ✅

- **Vercel SHA inline (lines 447-455):**
  ```ts
  define: {
    'import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA': JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA ?? '',
    ),
  },
  ```
  Bakes the build-time git SHA into the client bundle so `sentryInit.ts` can tag runtime events with `release`. Empty in laptop builds. ✅

### What's missing

- **The plugin config does NOT set `release.name`.** `@sentry/vite-plugin` v4.x defaults to detecting the release from `VERCEL_GIT_COMMIT_SHA` (or `git rev-parse HEAD`, or other CI vars in order). In Vercel CI this auto-detect typically returns the same SHA that `define` inlines into the runtime. **Both sides land on the same value by coincidence-of-defaults.** Any environment where the plugin's auto-detect picks a different SHA than the `define` substitution → uploaded sourcemaps won't be associated with the runtime release tag → minified stack traces in Sentry events.

  This is **Gap 1**, the only real finding of this audit.

  **Fix sketch** (one block added to the plugin call):
  ```ts
  sentryVitePlugin({
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    telemetry: false,
    release: {
      name: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || undefined,
    },
    sourcemaps: { filesToDeleteAfterUpload: ['**/*.map'] },
  }),
  ```
  Combined with the workflow change in §1, the runtime `release` and the plugin's upload `release` are guaranteed to match.

---

## 3. Runtime Sentry init — `src/lib/monitoring/sentryInit.ts`

### What's wired

- **`release` (lines 148-153):**
  ```ts
  const release =
    String(import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA ?? "").trim() ||
    undefined;
  ```
  Picks up the SHA `vite.config.ts` inlined. Falls back to Sentry's own auto-detect (which returns nothing in the browser) when empty. ✅

- **`environment` (lines 144-146):**
  ```ts
  const env = String(
    import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE ?? "development",
  ).trim();
  ```
  Prefers explicit `VITE_APP_ENV`, falls back to Vite's `MODE` (which is `"production"` in `vite build`, `"development"` in `vite dev`). ✅

- **`current_release` tag (lines 825-832):** Every event is cross-checked against the build-time SHA and tagged `current_release="yes"` if it matches, `"unknown"` otherwise. This is the in-app equivalent of Sentry's "stale-build" filter — useful for triaging "did this user reload after the deploy?" ✅

### What's missing

- **`VITE_APP_ENV` is not in `.env.example`.** Production environments work because `MODE === "production"` is the Vite default. If anyone ever pulls a fresh Vercel `.env.production.local` and finds `VITE_APP_ENV` missing, the fallback kicks in correctly — but the canonical value isn't documented.

  **Severity: cosmetic.** A two-line addition to `.env.example` is the cleanest fix; alternatively, add `VITE_APP_ENV=production` to the Vercel project env table.

---

## 4. End-to-end verification on real production data

The dispatch's Phase 1 step 4 asks:

> Open Sentry dashboard. Find the most recent production error event. Check: does it have a release tag? Does the stack trace show source code or minified? Is the release tag the same as what version.json says on production?

**A14 cannot perform this step.** Reaching the Sentry dashboard requires the `mb-sentry-auth-token` keychain entry per memory `project_sentry_infra_access`; only Chau has interactive credentials. The agent does not have a Sentry MCP / API path wired for read-only queries in this session.

**This is the high-value verification.** If gap 1 (implicit release tag) is biting today, it would be visible right here as `release: null` or `release: <unexpected-string>` on a recent production event. Recommended Chau-operator workflow:

1. Sentry → Projects → mercyblade-web → Issues.
2. Open the most recent error event from the production environment.
3. Inspect the event JSON's `release` field.
4. Compare against the SHA visible at `https://mercyblade.com/version.json` (short SHA only — Sentry stores the full SHA, but the first 7 chars should match).
5. Look at the stack trace: are frames showing source files (`AccountPage.tsx:42`) or webpack-minified blobs (`v.something@/_next/static/...:1:2345`)?

If frames are minified → gap 1 is real today. If frames are resolved → the auto-detect coincidence is holding and the fix is precautionary, not urgent.

---

## 5. Gap list

| # | Gap | Severity | Fix scope |
|---|---|---|---|
| **1** | Plugin's `release.name` not explicitly pinned; relies on auto-detect coincidence with `vite.config.ts` `define` | **Medium-low** (works today by default-alignment; fragile) | One-PR: add `release.name` to plugin config + export `VERCEL_GIT_COMMIT_SHA: ${{ github.sha }}` in the workflow env. ~10 lines. |
| **2** | `VITE_APP_ENV` not in `.env.example` (works via `MODE` fallback) | Cosmetic | One-PR or tag onto Gap 1: add to `.env.example` |
| **3** | No automated CI step verifies a test event resolves end-to-end in Sentry post-deploy | Low | Not worth a code PR. Use PR #808's smoke-test route manually after the next prod deploy. |
| **4** | A14 cannot inspect Sentry dashboard to verify real production events | **Pending Chau** | Manual: §4 above |

---

## 6. Phase-2 recommendation

**One follow-up PR**, titled `feat(sentry): pin plugin + runtime release.name to VERCEL_GIT_COMMIT_SHA explicitly (A14b-fix-1)`:

1. `vite.config.ts` — add `release.name` to the plugin config (closes Gap 1's plugin half).
2. `.github/workflows/production-deploy.yml` — add `VERCEL_GIT_COMMIT_SHA: ${{ github.sha }}` to the job env block (closes Gap 1's workflow half).
3. `.env.example` — document `VITE_APP_ENV=production` for prod parity (closes Gap 2).

**Gates:** typecheck:ci, lint, build (with `SENTRY_AUTH_TOKEN` empty so the plugin stays a no-op; verify build still passes). No runtime behavior change unless the auto-detect coincidence ever broke — same observable behavior in the green-path case.

**Not blocking.** The current pipeline works in production today by virtue of how Vercel CLI + git + the plugin's defaults happen to land on the same SHA. The fix exists because explicit-is-better-than-implicit, and the cost of the fix is ~10 lines.

---

## 7. What this audit explicitly does NOT cover

- **Native Sentry release tagging:** native crashes flow through `@sentry/capacitor`, which gets `release` from the JS init it delegates to. So fixing gap 1 on the web side automatically fixes native release tags too. No separate native pipeline. (Per A14's prior PR #889.)
- **dSYM upload for iOS:** covered by PR #821 + A5h/A5i. Out of scope.
- **Sentry quota / data retention / alert rules:** dashboard-side config; not a code audit's surface.
- **Performance / tracing / replay configs:** runtime config in `sentryInit.ts`. The audit verified `tracesSampleRate` is set (0.1 in prod, 1.0 in dev); a follow-up could deep-dive cost. Not in this dispatch's scope.

---

## References

- A7c canonical native audit: `reports/NATIVE-sentry-init-audit-A7c.md` (PR #816)
- A14 follow-up native audit: `reports/NATIVE-sentry-init-followup-A14.md` (PR #889)
- A14 slow-query observability: PR #885
- iOS dSYM upload: PR #821 + `docs/IOS-DSYM-UPLOAD.md`
- Sourcemap smoke-test route: PR #808 (`/__sentry-smoke-test?confirm=throw`)
- Web Sentry route-gate: PR #720
- `vite.config.ts` lines 100-124 (plugin), 447-455 (define), 507-509 (sourcemap mode)
- `.github/workflows/production-deploy.yml` lines 41-43 (env), 70-86 (token guard), 88-95 (build/deploy)
- `src/lib/monitoring/sentryInit.ts` lines 144-158 (release + environment), 825-832 (current_release tag)
