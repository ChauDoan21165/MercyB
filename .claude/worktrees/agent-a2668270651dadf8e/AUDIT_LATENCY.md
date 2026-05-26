# MercyBlade Latency Audit

> **STATUS 2026-05-17 (audit-latency-fixes recon):** The three highest-impact
> findings — §1 (mercy-guide chunk), §2 (precache), §4 (feature-flag per-mount),
> plus the §5 French/German sub-case — were **RESOLVED** by PRs that merged after
> this audit was written. Verified with a measured `MB_BUNDLE_VIZ=1` build on
> `origin/main` @ f66eefc5. Per-finding notes inline below; full evidence in
> `reports/RECON-audit-latency.md`. §3/§6/§7 were out of this recon's scope and
> are unchanged.

## Executive Summary
The biggest latency cost is the `mercy-guide` feature cluster: the latest build emits a 2.49 MB chunk (`gzip: 767.24 kB`), and the code path behind it eagerly pulls a large subgraph into the first visit to Home. The second largest user-perceived cost is offline precaching: the build generated 285 precache entries totaling 10,797.38 KiB, so installs and updates re-download a lot of code even when the user never opens those routes. The next tier is repeated access/flag hydration on the critical path: Home waits on a profile query plus an entitlement lookup, and the feature-flag hook repeats an auth lookup plus a flag query on every mount.

## Findings

### 1. Mercy Guide is one giant hot chunk
> **✅ RESOLVED — PR #317 (`a3c34fbb perf(mercy-guide): split into lazy chunks per tab`).**
> Measured 2026-05-17 on f66eefc5: eager `mercy-guide` chunk went
> **2,493.12 kB / gz 767.24 kB → 114.36 kB / gz 36.57 kB (−95%)**. The six heavy
> tabs are now `lazyWithRetry` imports (`MercyGuidePanel.tsx:32-43`), `MercyGuide`
> itself is lazy (`Home.tsx:27`), and tab chunks are filtered out of the homepage
> modulepreload (`vite.config.ts:443-455`). Residual: the 36.57 kB gz *shell*
> chunk is still on the homepage critical path due to Rollup co-locating shared
> utilities — a known/deferred item with measured evidence in
> `reports/a7-bundle-audit.md` (2026-05-13); both obvious fixes were tried there
> and regressed. Estimated remaining upside ~13–18 kB gz / ~30–45 ms Slow 4G —
> deliberately not chased (high-risk central config, low reward).

**Severity**: HIGH  
**Category**: INITIAL PAGE LOAD  
**Location**: `dist/assets/mercy-guide-CLjCU_6T.js`; `src/pages/Home.tsx:10-25`; `src/components/MercyGuide.tsx:14,38,40`; `src/components/mercy-guide/MercyGuidePanel.tsx:26-30`; `src/components/mercy-guide/MercyTeacherTab.tsx:20-40`; `src/components/mercy-guide/tabs/LanguageLessonsTab.tsx:21-27`  
**Impact**: First visit to Home and first open of Teacher Mercy carry a multi-megabyte JS payload before the panel is useful. On slower devices, this is the main contributor to delayed first interaction and route-to-panel latency.  
**Evidence**: The production build emitted `dist/assets/mercy-guide-CLjCU_6T.js 2,493.12 kB | gzip: 767.24 kB`. `Home.tsx` imports `MercyGuide` directly. `MercyGuide.tsx` imports `MercyGuidePanel`. `MercyGuidePanel.tsx` imports `MercyTeacherTab`, `MercySpeakTab`, `GrammarWritingTab`, `EnglishLogicTab`, and `LanguageLessonsTab`. `MercyTeacherTab.tsx` eagerly imports `KID_PAGE_14_ITEMS` through `KID_PAGE_34_ITEMS`. `LanguageLessonsTab.tsx` eagerly imports full French and German lesson/vocabulary modules.  
**Recommendation**: Split the guide shell from the heavy content tabs, and lazy-load the kids, language, and notebook subtrees only when the user opens those tabs.  
**Effort**: large

### 2. Workbox precaches too much app code
> **✅ RESOLVED — PR #392 (`128678ff perf(pwa): exclude rarely-visited route chunks from precache`) + #434 (`72fcfaed fix(sw): network-first HTML`).**
> Measured 2026-05-17 on f66eefc5: precache went
> **285 entries / 10,797.38 KiB → 54 entries / 3,678.42 KiB (−81% entries, −66% / −7.1 MiB)**.
> `vite.config.ts:165` `globIgnores: ['**/lessons-*.js', 'index.html']` moves the
> 36 lesson chunks (~9.5 MB) to runtime CacheFirst; `vite.config.ts:197-223`
> allowlists JS precache to 8 shell stems. The remaining 54 entries are the
> intended small shell (CSS, icons, 35 core room JSONs, 8 JS stems).

**Severity**: HIGH  
**Category**: SERVICE WORKER / PWA  
**Location**: `vite.config.ts:130-165`; `src/lib/offline/precacheManifest.ts:18-74`  
**Impact**: First install and every app update must download a very large precache set, which increases update latency and burns bandwidth even on users who only want the shell.  
**Evidence**: The build reported `precache 285 entries (10797.38 KiB)`. The PWA config explicitly precaches lesson JSON files via `additionalManifestEntries` and allows chunks up to 5 MiB, with comments noting the mercy-guide chunk is already ~2.12 MB and growing. `src/lib/offline/precacheManifest.ts` is a 35-item shortlist today, but the SW still precaches the emitted JS/CSS bundle set, which is where the 10.8 MiB comes from.  
**Recommendation**: Keep the shell precache small and move non-critical route chunks and lesson payloads to runtime caching or on-demand fetches.  
**Effort**: large

### 3. Access hydration is serialized
**Severity**: MEDIUM  
**Category**: DATA FETCHING  
**Location**: `src/hooks/useUserAccess.ts:312-346`  
**Impact**: Home and any other consumer of `useUserAccess` wait on a profile lookup and then a separate entitlement lookup before the access state settles. That adds avoidable round-trips to the critical path for gated UI.  
**Evidence**: The hook first starts `supabase.from("profiles").select("id, is_admin, admin_level").eq("id", userId).maybeSingle()` and awaits it, then performs `fetchCurrentEntitlement(supabase)` in a second step. The Home page uses this hook immediately at `src/pages/Home.tsx:69`.  
**Recommendation**: Resolve profile and entitlement in parallel where possible, or cache the combined result in a shared access store so repeated mounts do not refetch both.  
**Effort**: small / medium

### 4. Feature flags are fetched on every mount
> **✅ RESOLVED — `d9154cdc perf(queries): migrate feature flags + auth.user to React Query`** (+ `1f6a4ddf` profiles).
> `src/hooks/useFeatureFlag.ts` is now a one-line re-export of
> `useFeatureFlagQuery` (`src/lib/queries/useFeatureFlagQuery.ts`). The per-mount
> `Promise.all([auth.getUser(), feature_flags query])` is gone: flag query is
> React Query (`staleTime: 5 min`, `gcTime: 10 min`, `refetchOnWindowFocus: false`,
> key `qk.featureFlag(key, userId)`), `auth.getUser()` shared via
> `useAuthUserQuery()`. Every component reading the same `flag_key` on a page
> now shares one cached fetch; route transitions within 5 min hit cache.

**Severity**: MEDIUM  
**Category**: DATA FETCHING  
**Location**: `src/hooks/useFeatureFlag.ts:22-34`; `src/pages/Home.tsx:71-72`  
**Impact**: Any screen that uses the hook pays an auth lookup plus a `feature_flags` query on mount, which delays the availability of feature-gated branches and repeats the same work across route transitions.  
**Evidence**: The hook always runs `Promise.all([supabase.auth.getUser(), supabase.from("feature_flags").select("is_enabled, enabled_user_ids").eq("flag_key", key).maybeSingle()])` inside an effect. Home uses `useFeatureFlag("mercyblade_leaderboard_enabled", false)` on its critical path.  
**Recommendation**: Cache the resolved flag per key and user, or hydrate it from a broader app-level access bootstrap instead of repeating the request per component.  
**Effort**: medium

### 5. Mercy Guide’s language tab drags in full French and German curricula
> **✅ RESOLVED — folded into PR #317 (§1).** Measured 2026-05-17 on f66eefc5:
> French/German are now isolated `mercy-french-tab` (13.25 kB) / `mercy-german-tab`
> (11.85 kB) chunks plus per-level `lessons-french-{a1..c2}` / `lessons-german-*`
> splits (`vite.config.ts:565-597`), lazy-loaded only when the tab opens. No
> longer eager in the guide chunk.

**Severity**: MEDIUM  
**Category**: INITIAL PAGE LOAD  
**Location**: `src/components/mercy-guide/MercyGuidePanel.tsx:26-30`; `src/components/mercy-guide/tabs/LanguageLessonsTab.tsx:21-27`  
**Impact**: Users who only open MercyGuide still carry the entire French and German lesson/vocabulary modules because the shared tab imports both language packs eagerly. That makes the guide chunk heavier than the active tab needs.  
**Evidence**: `MercyGuidePanel.tsx` imports `LanguageLessonsTab` directly. `LanguageLessonsTab.tsx` statically imports `FRENCH_LESSONS`, `FRENCH_VOCABULARY`, `GERMAN_LESSONS`, and `GERMAN_VOCABULARY` at module scope.  
**Recommendation**: Split each language pack into its own lazy chunk, or load only the selected language module inside the tab after the user opens it.  
**Effort**: large

### 6. Home does synchronous storage and DOM reads during render setup
**Severity**: LOW  
**Category**: RENDER COST  
**Location**: `src/pages/Home.tsx:40-50`; `src/pages/Home.tsx:59-79`  
**Impact**: The first render path does synchronous `localStorage` reads, `getComputedStyle`, and DOM queries to seed state. On slower devices, that adds extra main-thread work before the page settles.  
**Evidence**: `readZoomPct()` reads `localStorage` and `getComputedStyle(document.documentElement)` synchronously. `hasOpenTeacherMercyPanel()` runs `document.querySelector(...)`. Both are used immediately in `useState` initializers at mount.  
**Recommendation**: Hydrate these values after mount or move them into a small client store so the first paint does less synchronous work.  
**Effort**: trivial / small

### 7. Bottom music bar eagerly creates and preloads audio on Home
**Severity**: LOW  
**Category**: AUDIO PLAYBACK  
**Location**: `src/components/audio/BottomMusicBar.tsx:60-97`  
**Impact**: The Home shell constructs a singleton `Audio` element and sets `preload = "auto"` before the user asks for music playback. That can compete with the first content and adds unnecessary work on entry.  
**Evidence**: `getSingletonAudio()` creates `new Audio()` and sets `a.preload = "auto"`. The component also synchronously reads `LS_TAB`, `LS_FAV`, `LS_TRACK`, `LS_VOL`, and `LS_ZOOM` during initial state setup.  
**Recommendation**: Defer singleton creation and preloading until the bar is visible or until the user explicitly starts playback.  
**Effort**: small

## Out of scope / not investigated
- I did not profile CPU time in browser DevTools or run a user-flow benchmark.
- I did not deep-audit every route page or every Supabase query in the repo after the main hotspots were identified.
- I did not inspect server-side latency behavior, websocket flows, or Edge Function cold-start behavior beyond the PWA and route-loading angles above.
- I did not rewrite or verify any code paths; this was reconnaissance only.

## Notes for follow-up PRs
- Split the Mercy Guide chunk first; it has the biggest user-visible payoff.
- Trim the precache after that so updates stop shipping 10.8 MiB of cached assets.
- Add caching/shared hydration for access and feature-flag lookups.
- Then split the large language lesson tabs out of the Mercy Guide graph and defer music preloading until interaction.
