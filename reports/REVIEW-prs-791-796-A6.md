# Review — PRs #791 + #796 (A6, batch 3 / cleanup + native set)

**Reviewer:** A6
**Worktree:** `/private/tmp/A6-review-cleanup-prs` (off `origin/main` @ `6b7d07490`)
**Mode:** read-only; both PR branches inspected via `gh pr view` / `gh pr diff` / fetched as `pr-796` for source-level checks. PR branches not touched.

---

## PR #791 — `cleanup/agent-id-tierc-archive`

> _archive 7 zero-reference legacy `a<N>-*` files (Tier-C per A23)_

### What the PR does

Pure `git mv` of 7 markdown files from `reports/` → `reports/archive/agent-runs-2026-04/`:

| File | PR (per body) |
|---|---|
| `a3-c2-feedback-reply-fix.md` | #124 |
| `a4-recommendation-design.md` | #78 |
| `a5-c1-r3-audio-run.md` | #331 |
| `a5-mercy-memory-wired.md` | #97 |
| `a5-offline-strategy.md` | #93 |
| `a6-sentry-runbook.md` | #94 |
| `a9-chau-report.md` | — |

`gh pr diff` confirmed: **7 RENAMED, 0 additions, 0 deletions** (similarity index 100% on every move).

### Zero-reference verification (independent)

Re-ran the grep from the review worktree, excluding `.git` and the archive folder itself, across the entire repo:

```
rg -uu -g '!.git' -g '!reports/archive/**' -l "<filename>" .
```

| File | Hits outside archive |
|---|---|
| `a3-c2-feedback-reply-fix.md` | 0 |
| `a4-recommendation-design.md` | 0 |
| `a5-c1-r3-audio-run.md` | 0 |
| `a5-mercy-memory-wired.md` | 0 |
| `a5-offline-strategy.md` | 0 |
| `a6-sentry-runbook.md` | 0 |
| `a9-chau-report.md` | 0 |

Targeted spot-check of the canonical living docs and the agent primer:

```
grep -rl "<filename>" STRATEGY.md PRINCIPLES.md CLAUDE.md docs/agent-briefs/
```

→ **zero hits across all 7 × 4 = 28 lookups.** None of these files is referenced by `STRATEGY.md`, `PRINCIPLES.md`, `CLAUDE.md`, or anything under `docs/agent-briefs/`. PR body's claim that "the only occurrence is inside A23's own recon inventory (uncommitted)" is correct.

### Risk

- Markdown-only moves, zero source/text deltas → no runtime risk.
- All A23 Tier-A (live src refs) and Tier-B (cross-cited) files explicitly excluded per PR body; spot-check via grep confirms none of the 7 here are in either list.
- Archive folder name (`reports/archive/agent-runs-2026-04/`) matches existing dated-archive convention.

### Gates (per PR body)

`typecheck:ci` ✅ · `lint` ✅ · `test` 359 files / 6495 tests ✅ · `build` ✅. Expected for a pure rename.

### Verdict — **APPROVE**

Pure `git mv` of 7 files that are independently confirmed zero-reference across `src/`, `public/`, `docs/`, the agent primer (`docs/agent-briefs/`), and the canonical living docs (`STRATEGY.md` / `PRINCIPLES.md` / `CLAUDE.md`). Lowest-risk archival possible — ship it.

---

## PR #796 — `fix/native-marketing-tracker-guard`

> _guard marketing trackers against native execution (per A41)_

### What the PR does

One early-return at the top of `initMarketingTracking()` in `src/services/behaviorTrackingFlag.ts` — **before** the consent read and **before** the lazy `import()` of any tracker module:

```ts
if (isNativePlatform()) {
  return { consent: false, utmCaptured: false,
           pixelLoaded: false, ga4Loaded: false, clarityLoaded: false };
}
```

Plus 3 new tests in `src/lib/tracking/__tests__/initMarketingTracking.test.ts`:
1. native + consent ON + all three env vars set → all-false status, no `fbq`/`gtag`/`clarity` globals, no injected `<script>` tags.
2. native → UTM not captured even with `?utm_source=...` in the URL.
3. web (`isNativePlatform()===false`) → trackers still load (regression guard for the web path).

Existing 7 tests run unmodified — the platform mock defaults to `false`/web, preserving the web path.

### Surface coverage check — does the guard cover every tracker on the surface?

Marketing trackers on the surface (per A41 / `src/services/behaviorTrackingFlag.ts` / `src/lib/tracking/`):

| Tracker | Init function | Other callers? | Killed by guard? |
|---|---|---|---|
| Meta Pixel | `initPixel` | none (`rg -n "initPixel" src/` shows only `behaviorTrackingFlag.ts` + own tests) | ✅ |
| GA4 | `initGa4` | none (same, only `behaviorTrackingFlag.ts` + own tests) | ✅ |
| Microsoft Clarity | `initClarity` | none (same) | ✅ |
| UTM | `captureUtmFromCurrentUrl` | only called from `initMarketingTracking` itself + own tests | ✅ |

PR's "single chokepoint" claim is verified end-to-end. The four `init*` calls are reached **only** through the dynamic `Promise.all` import inside `initMarketingTracking`, and that block is downstream of the new early return.

**Secondary tracker globals (`window.plausible`, `window.analytics`) referenced in `src/lib/analytics.ts:131,139`:** these are conditional, type-guarded calls (`if (typeof window.plausible === "function")`). Nothing in the repo seeds them, so they silently no-op on every platform — not a concern, and outside A41's scope.

**`src/lib/analytics.ts:124` direct `window.clarity("event", ...)`:** also type-guarded (`if (typeof window.clarity === "function")`). Since `initClarity` no longer runs on native, `window.clarity` is undefined, and the conditional skips cleanly. The guard remains intact downstream.

### Fail-closed check

The early return sits **before** the `await Promise.all([import("@/lib/tracking/utm"), import("@/lib/tracking/pixel"), import("@/lib/tracking/ga4"), import("@/lib/tracking/clarity")])` block. On native:

- No `localStorage` consent read.
- No dynamic `import()` of any tracker module → no script-injection code ever pulled into the bundle/runtime.
- No `window.fbq` / `window.gtag` / `window.clarity` global seeded.
- No UTM capture from the URL.
- Return value is the all-false status object, which is what status-checking callers expect for "disabled".

**This is fail-CLOSED**, not fail-open. Native = nothing initialised, nothing imported, nothing leaked.

### Idiom check

PR uses `isNativePlatform()` from `@/lib/platform` instead of A41's suggested raw `Capacitor.isNativePlatform()`. Repo-wide grep shows `@/lib/platform`'s `isNativePlatform` is the established idiom — used by `AuthProvider`, `NativeBootstrap`, `apiBase`, `iap`. `platform.ts` is a thin `Capacitor.isNativePlatform()` wrapper specifically so this centralises. Same runtime behaviour, matches surrounding code. ✅

### Privacy-policy alignment

The shipped policy (`src/pages/Privacy.tsx`) contains the exact line A41 quoted:

> _"Clarity chỉ chạy trên web — ứng dụng iOS và Android không dùng Clarity / Clarity runs only on the web — the iOS and Android apps do not use Clarity."_

This PR is what makes that claim **true in code**. Without it, any Capacitor build with `VITE_CLARITY_PROJECT_ID` set would run Clarity inside the iOS/Android WebView and put the user-facing policy in direct conflict with shipped behaviour — App Store Guideline 5.1.2 / Google Data Safety mismatch risk per A41.

### Tests

Mock pattern (`vi.mock("@/lib/platform", () => ({ isNativePlatform: () => isNative() }))`) mirrors the proven `NativeBootstrap.test.tsx` pattern (verified via `rg -n "isNativePlatform" src/components/native/__tests__/`). 7 pre-existing tests unmodified.

### Gates (per PR body)

`typecheck:ci` ✅ · `lint` ✅ (0 errors) · `vitest` 360 files / 6522 tests ✅ · `build` ✅.

### Note for Chau (per dispatch §k Blocker #2)

> **Real-device verification is required after merge:** cut a native iOS or Android build with `VITE_FB_PIXEL_ID`, `VITE_GA4_MEASUREMENT_ID`, and `VITE_CLARITY_PROJECT_ID` set, run it on a physical device or simulator, and confirm **zero GA4 / Clarity / Pixel network calls** in the Capacitor WebView (Safari Web Inspector for iOS, Chrome DevTools for Android). The unit tests cover the JS layer; this final check covers "no actual outbound packets" — required before A41 Blocker 2 (App Privacy / Data Safety paperwork) can be re-derived honestly.

### Verdict — **APPROVE**

Surgical, fail-closed, single-chokepoint guard. Surface coverage (Pixel + GA4 + Clarity + UTM) independently verified against the codebase. Idiom matches repo convention. Web path byte-identical. Aligns shipped privacy-policy promise with actual runtime behaviour. Merge — then Chau real-device verifies before A41 Blocker 2.

---

## Combined verdict

| PR | Verdict |
|---|---|
| #791 | **APPROVE** — pure git mv, zero-reference confirmed across src/public/docs/primer/STRATEGY/PRINCIPLES/CLAUDE |
| #796 | **APPROVE** — fail-closed native guard at the single chokepoint; covers Pixel + GA4 + Clarity + UTM; real-device verify required post-merge per A41 |
