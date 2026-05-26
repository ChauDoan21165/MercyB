# RECON — AUDIT_LATENCY backlog (findings #1, #3, #5)

**Agent:** audit-latency-agent
**Branch:** `audit-latency-fixes` (off `origin/main` @ f66eefc5)
**Date:** 2026-05-17
**Phase:** 1 (recon only — no code changed)
**Method:** read current HEAD source + `MB_BUNDLE_VIZ=1 npm run build` measured against AUDIT_LATENCY.md (2026-05-06, #310) baseline numbers.

---

## Bottom line up front

**All three findings the brief assigned are already CLOSED on current `origin/main`.** They were fixed by PRs that merged *after* the 2026-05-06 audit was written, before this task was created. Measured before/after below. **Recommendation: ship NO code PR.** The only honest deliverable is a small docs PR marking these resolved so the backlog stops re-triggering the work. Doing the proposed code-splits now would be theater (locked principle #5: diagnose before patching; skip non-problems).

### Numbering note (important — the brief renumbered)

The brief's "#1 / #3 / #5" are a renumbering of *open* items and do **not** match AUDIT_LATENCY.md's own section numbers. Mapping used here:

| Brief label | AUDIT_LATENCY.md § | Topic |
|---|---|---|
| #1 | §1 (+ §5 is a sub-case) | mercy-guide hot chunk / French+German eager |
| #3 | §2 | 10.8 MiB workbox precache |
| #5 | §4 | per-mount feature-flag fetch |

(AUDIT_LATENCY §3 — `useUserAccess` serialized hydration — is **not** in this task's scope and was not touched. §6/§7 likewise out of scope.)

---

## Finding #1 — mercy-guide hot chunk  ·  STATUS: 95% CLOSED, residual is a known-deferred non-problem

### Current state (measured)

| metric | AUDIT baseline 2026-05-06 | current HEAD f66eefc5 | Δ |
|---|---|---|---|
| eager `mercy-guide` chunk | **2,493.12 kB / gz 767.24 kB** | **114.36 kB / gz 36.57 kB** | **−95% raw, −95% gz** |
| heavy tab content | inside the 2.49 MB monolith | split to 6 lazy chunks (speak 108 / grammar 68 / teacher 61 / logic 44 / french 13 / german 12 KB raw) | extracted, lazy-loaded per tab |
| French/German curricula (§5) | eager in the monolith | `mercy-french-tab` / `mercy-german-tab` + per-level `lessons-french-{a1..c2}` splits | extracted |
| homepage modulepreload | pulled the 2.49 MB chunk | tab chunks **filtered out** via `vite.config.ts:443-455` `modulePreload.resolveDependencies` | tab payload off critical path |

**Fixed by:** `a3c34fbb perf(mercy-guide): split into lazy chunks per tab (#317)`. Confirmed in `src/components/mercy-guide/MercyGuidePanel.tsx:32-43` (all 6 heavy tabs `lazyWithRetry(() => import(...))` + `Suspense`), `src/pages/Home.tsx:27` (`MercyGuide` is itself `lazyWithRetry`), and `vite.config.ts:466-602` (per-tab `manualChunks` + `modulePreload` filter at 443-455).

### Residual (honest)

The 114 KB / **36.57 KB gz** `mercy-guide` *shell* chunk is still in the homepage `index.html` modulepreload. Root cause is **not** an eager component import — it's that the entry chunk static-imports shared utilities (sentryInit, AuthProvider, supabaseClient, authService, featureFlags, chunkLoadError, …) that Rollup co-located into the `mercy-guide` bucket because `manualChunks` returns `undefined` for app code.

This is **already documented and deferred with evidence** in `reports/a7-bundle-audit.md` (2026-05-13 §"The mercy-guide chunk problem"). That round **empirically tried both obvious fixes**:
1. lazy-import `MercyGuide` from the shell → identical chunk hashes, still in modulepreload, **zero bytes moved. Reverted.**
2. `manualChunks` `app-shared` bucket → `Circular chunk: app-shared -> vendor -> app-shared` + net **+11 KB gz worse. Reverted.**

My build on current HEAD **still emits** `Circular chunk: mercy-grammar-tab -> mercy-guide -> mercy-grammar-tab` — the chunking is fragile exactly where a7 said it was.

### Fix plan & estimated impact

**Do not fix.** The proposed brief fix ("code-split into its own async chunk via React.lazy + Suspense") is already shipped for the 95% win. The remaining 36 KB gz shell needs a structural `manualChunks` refactor that a7 proved regresses (circular-chunk class, net worse). Estimated upside if it *could* be done cleanly: ~13–18 KB gz / **~30–45 ms on Slow 4G** — small, against high risk to a load-bearing central config (`vite.config.ts`). Per "central files are dangerous" + "don't solve uncertainty with more code" → leave deferred where a7 already put it.

---

## Finding #3 — 10.8 MiB workbox precache  ·  STATUS: CLOSED

### Current state (measured)

| metric | AUDIT baseline 2026-05-06 | current HEAD f66eefc5 | Δ |
|---|---|---|---|
| precache entries | **285** | **54** | **−81%** |
| precache size | **10,797.38 KiB** | **3,678.42 KiB** | **−66% (−7.1 MiB)** |

**Fixed by:** `128678ff perf(pwa): exclude rarely-visited route chunks from precache (#392)` + the SW-HTML work in `72fcfaed (#434)`. The code carries explicit "Perf fix #3" comments:
- `vite.config.ts:165` `globIgnores: ['**/lessons-*.js', 'index.html']` — 36 `lessons-*.js` chunks (~9.5 MB) moved to runtime `CacheFirst` (`vite.config.ts:344-356`).
- `vite.config.ts:197-223` `manifestTransforms` — JS precache allowlisted to 8 stems only (`index, react, ui, vendor, supabase, sentry, Home, LoginPage`).

The remaining 54 entries are non-JS (CSS, icons, the 35 core room JSONs via `additionalManifestEntries` from `OFFLINE_PRECACHE_LESSONS`) + the 8 allowlisted JS stems — i.e. exactly the intended small shell. No action.

---

## Finding #5 — per-mount feature-flag fetch  ·  STATUS: CLOSED

### Current state

`src/hooks/useFeatureFlag.ts` is now a one-line re-export of `useFeatureFlagQuery` (`src/lib/queries/useFeatureFlagQuery.ts`). The per-mount `Promise.all([auth.getUser(), feature_flags query])` the audit flagged is gone:
- flag query: React Query, `queryKey: qk.featureFlag(key, userId)`, `staleTime: 5 min`, `gcTime: 10 min`, `refetchOnWindowFocus: false` (`useFeatureFlagQuery.ts:33-55`).
- `auth.getUser()`: shared via `useAuthUserQuery()` (`useFeatureFlagQuery.ts:30`).

Net: every component reading the same `flag_key` on a page shares **one** network round-trip; route transitions within 5 min hit cache. **Fixed by:** `d9154cdc perf(queries): migrate feature flags + auth.user to React Query` (+ `1f6a4ddf` for profiles).

### Estimated impact (already realized)

Request-count fix, not a bundle metric — verified by reading the implementation, not measurable from a build. Home critical path previously paid `getUser` + a `feature_flags` SELECT *per mount of every flagged component*; now collapsed to one shared, cached fetch. No action.

---

## Order of operations / PR structure

**No code PR.** Order is moot — there is nothing to ship for #1/#3/#5. Three independent PRs already closed them (#317, #392, #434, + the React Query migration).

Recommended single deliverable (optional, Chau's call):

- **One docs-only PR** on `audit-latency-fixes`: annotate `AUDIT_LATENCY.md` §1/§2/§4 (+ §5) as **RESOLVED** with the PR refs and the measured before/after table above, and point the residual #1 shell-chunk item at `reports/a7-bundle-audit.md`'s existing deferred entry. This stops the backlog doc from re-triggering this exact recon again. Low risk, no runtime change. (`AUDIT_LATENCY.md` is intentionally retained as backlog per docs-consolidate Q2.)

## Incidental observation (not in scope — flagging only)

Current `origin/main` build emits `Circular chunk: mercy-grammar-tab -> mercy-guide -> mercy-grammar-tab` (non-fatal, build exits 0). Same fragility class a7 documented. Not part of #1/#3/#5; recommend leaving it with a7's deferred-medium bucket rather than expanding scope here.

## Verification artifacts

- Build log: `/tmp/audit-latency-build.log` (exit 0)
- Treemap: `dist/bundle-stats.html` (MB_BUNDLE_VIZ=1)
- node_modules symlinked from main repo into worktree for the measured build (no install).
