# Dead Code Audit Report
Generated: 2026-05-05 (A3 recon)
Branch: `chore/dead-code-audit-recon`
Off main SHA: `03efeeee` (post-PR-#297 audio cleanup landed on main)

## Executive Summary

Repository is structurally healthy at the `src/` core but carries a heavy backlog of **non-source clutter** that accumulated outside the audio pipeline A1+A2 just cleaned up. The findings split into three buckets:

- **High-confidence orphans (recommend prioritized cleanup):**
  - **200 tracked files at repo ROOT** that should not be there (TSX/TS source files escaped from `src/`, one-time scripts, 70+ stale .md reports, 20 empty 0-byte files, 3 root-level SQL files that diverge from their twin in `supabase/migrations/`, and typo'd directories `upabase/` and `http:/127.0.0.1:54324/`).
  - **157 orphan React components** in `src/components/`, `src/screens/`, `src/pages/` — zero importers across `src/` (~21,638 LOC).
  - **96 orphan hooks/lib utilities** (~11,718 LOC).
  - **35 edge functions** with zero invocation references repo-wide; **78 edge functions** not registered in `supabase/config.toml`.
  - **3 unused virtualization libs** in `package.json` (`react-window`, `react-virtualized`, `react-virtuoso`).
  - **5 of 6 standalone CSS files** have zero importers.
  - **3 stranded config files**: `tsconfig.core.json`, `vite.config.bundle-analysis.ts`, `vite.config.performance.ts` (no script/CI references).
  - **2 stale compile-time feature flags** (`MERCY_HOST_ENABLED`, `FOCUS_AREAS_CARD_ENABLED`) — both default `false` since their respective ship dates, never flipped.
  - **README.md still describes `keywordResponder.ts` and `cross_topic_recommendations.json`** as active — both are zero-importer dead code per CLAUDE.md.

- **Uncertain — needs human eyes:**
  - 41 RPC functions with no app-code refs (most are likely DB triggers / cron jobs — Supabase dashboard would confirm).
  - 35 zero-grep edge functions where some are webhooks (Apple/Google/RevenueCat) invoked by external URL — no code reference is normal there.
  - 3 stray root SQL migration files diverge from same-name files in `supabase/migrations/` — which is canonical?

- **Largest single cluster:**
  Root-level clutter (~200 tracked files, ~4.6 MB; ~8,679 LOC just in TS/TSX/JS/mjs at root). This is the equivalent of half the audio cleanup A2 just shipped, and it's structurally easier to clean because nothing in `src/` should depend on it.

- **Estimated cleanup envelope (if everything flagged here is confirmed dead and removed):**
  - ~33,000 LOC across `src/` orphans
  - ~8,700 LOC of root-level escaped source
  - ~80 edge function folders pruned
  - ~4 NPM deps removed
  - ~70 stale .md docs evaluated
  - On the order of **40,000+ LOC** if Chau confirms all categories — comparable to PR #297's scope but split across many domains.

- **Counts at a glance:**
  | Category | Items flagged | Confidence |
  |---|---|---|
  | 1 — Versioned/iterated systems | 6 | High |
  | 2 — Investigation/draft work | 70+ | Mixed |
  | 3 — Orphan edge functions | 35 high-confidence + 78 unregistered | Mixed |
  | 4 — DB tables + RPCs | 5 tables + 41 RPCs | Uncertain |
  | 5 — Storage references | 0 new since PR #297 | High |
  | 6 — Orphan components | 157 | High |
  | 7 — Orphan hooks/utils | 96 | High |
  | 8 — Tests for deleted code | 0 broken-import; 0 tests target orphans (sample) | High |
  | 9 — Configuration files | 3 stranded | High |
  | 10 — Documentation drift | README + 70+ stale .md | High (drift) |
  | 11 — Feature flags | 2 stale + 1 hidden table flag | High |
  | 12 — NPM dependencies | 4 likely orphan (3 virtualization + monaco editor) | High |
  | 13 — Public/static assets | 26 stray root MP3s + 1 dup `guide.png ` (trailing space) | Mixed |
  | 14 — CSS | 5 of 6 unused | High |
  | 15 — Observability | None new since PR #297 | High |

---

## Category 1 — Versioned/iterated systems

| File / folder | Evidence |
|---|---|
| `supabase/functions/stripe-webhook-v2/` | `stripe-webhook` (no v2) is the registered function in `supabase/config.toml`; `stripe-webhook-v2` has zero refs anywhere. Likely abandoned migration attempt. |
| `upabase/functions/stripe-webhook.ts` | Typo'd directory name `upabase/` (missing `s`) at repo root; one ancient `import Stripe from "stripe"` file — only place in repo where the npm `stripe` package is imported as a bare module. The real `supabase/functions/stripe-webhook/` uses esm.sh. |
| `supabase/functions/weekly_snapshots/` + `weekly_mercy_snapshots/` + `weekly-snapshots/` + `weekly-digest-email/` | Four near-name variants. `weekly_snapshots`, `weekly_mercy_snapshots` have 0 refs; `weekly-snapshots` has 1 ref; `weekly-digest-email` has 2 refs. Three iterations co-existing. |
| `mercy_weekly_snapshot_job` | Empty 0-byte file at repo root. Tracked. |
| `scripts/audit-v4-safe-shield.ts` + `src/lib/audit-v4-types.ts` | "v4" version suffix — no v3, no v5. Possibly current generation but uncertain. |
| `scripts/fix-react-compiler-useCommunityChatInline.v2.mjs` | One-shot fix script, name suggests there was a v1. |

---

## Category 2 — Investigation/draft work that was partially merged

**Root-level escaped source files (200 tracked files at repo root that shouldn't be there).** Sample:

- TSX/TS source files at root, NOT in src/:
  - `Billing.tsx`, `MercyAIHost.tsx`, `MatchmakingHub.tsx`, `RoomTile.tsx`, `RecommendedPaths.tsx`, `TopicSection.tsx`, `ContinueJourneyCard.tsx`, `AdminVIPRooms.tsx` (0 bytes), `DebugRooms.tsx`
  - `keywordResponder.ts` — CLAUDE.md explicitly flags this as zero-callers dead code
  - `roomData.ts`, `roomManifest.ts`, `useRoomProgress.ts`, `adaptiveTeachingIntelligence.ts`, `types.ts`, `index.ts`
- Duplicate-named files: `index 2.ts`, `index 5.ts` (macOS Finder duplicate suffix pattern)
- One-time probe scripts: `probe-cert-schema.mjs`, `probe-cert-schema-2.mjs`, `probe-cert-sources.mjs`, `probe-cert-sources-2.mjs`, `probe-cert-sources-3.mjs`, `probe-cert-types.mjs`
- One-time fix scripts at root: `fix-all-json.js`, `fix-room-audio.js`, `fix-names.sh`, `check-missing-audio.js`, `check-rooms-empty-entries.js`, `check_integrity.py`
- Audio scripts: `generate-elevenlabs-audio.js`, `generate-listening-audio.js`, `generate_audio.py`, `generate-room-registry.js`, `regenerate_audio.sh`, `standardize-audio-names.js`
- Misnamed binary-looking files: `code` (actually MercyGuide.tsx pasted), `python3` (actually a fix_speaktab.py script), `delete-account` (actually DeleteAccount.tsx)
- Ephemeral text artifacts: `tmp_audio_missing.txt`, `tmp_audio_present.txt`, `tmp_audio_referenced.txt`, `tmp_audio_unused.txt`, `tmp_entries_empty.txt`, `tmp_entries_has.txt`, `still-missing-audio-free-vip1-5.txt`, `still-missing-audio-vip6-vip9.txt`, `vip9_audio.txt`, `vip9_rooms.txt`, `missing_audio_report.txt`, `app_structure.txt`, `guide-map.txt`, `mercy_core_logic.txt`, `tsc-pass1.txt`, `room-audio-failures.json`, `room-audio-fix-manifest.jsonl`, `room_scan_report.json`, `clips-for-audio.json`
- 70+ stale `*_REPORT.md` / `*_SUMMARY.md` / `*_PROMPT.md` / `*_GUIDE.md` files at root (`AUDIO_*`, `LAUNCH_*`, `SECURITY_*` x7, `PHASE_3_*`, `PRODUCTION_READINESS_*`, `UI_UX_POLISH_*`, etc.).
- **20 zero-byte tracked files** at root: `+`, `cat`, `set`, `match`, `open`, `serve`, `to`, `code` (wait, `code` has content; updated count below), `ask-back`, `create-checkout-session`, `deploy`, `eslint`, `honesty`, `include`, `mercy_weekly_snapshot_job`, `schema.sql`, `serve`, `systemPromptBase`, `test`, `useUserAccess.snapshot`, `vite_react_shadcn_ts@0.0.0`, `“intent`, `rules”` (smart-quote names — almost certainly accidental shell paste)
- **3 stray SQL migration files at root** (`20251020102436_*.sql`, `20251021090532_*.sql`, `20251021211018_*.sql`) — same names exist in `supabase/migrations/` but the file CONTENTS DIFFER (root copy 149 lines vs migration copy 67 lines for the first one). Source-of-truth ambiguous.

**Typo'd directories tracked in git:**
- `upabase/` — missing `s`. Contains a single old `stripe-webhook.ts`.
- `http:/127.0.0.1:54324/` — accidental directory created by a broken `mkdir -p` (likely from running a Supabase URL through `mkdir -p` instead of `curl`). Contains a 0-byte file.
- `MercyB/` (a `MercyB/` directory inside the `MercyB` repo) — contains 4 Swift files: `ContentView.swift`, `MercyB.storekit`, `PremiumDashboardView.swift`, `SubscriptionManager.swift`. The actual iOS app lives in `ios/`; this is likely a parallel/abandoned StoreKit experiment.
- `ios_partial_storekit/MercyBlade/Services/` — looks like another StoreKit experiment fragment.
- `room-audio-fixed/` — 296 MP3 files at the repo root, looks like a one-time backup of fixed audio that should be in Supabase Storage, not git.

**`graveyard/`** is literally named graveyard:
- `graveyard/billing/BillingSuccessPage.tsx.bak`
- `graveyard/billing/verify-checkout-session.index.ts.bak`
Self-described dead code, never cleaned up.

**`scripts/_scratch/`** — 4 files, scratch directory tracked.

**`reports/`** — 33 sample files (`audio_counts.txt`, `audio_missing_sample.txt`, etc.), output of one-time analysis runs.

**`audit/`** — empty directory tracked but no files inside. Empty dir-only entry.

**`tools/_quarantine/`** — explicitly named quarantine.

---

## Category 3 — Orphan edge functions

**78 edge function folders are NOT registered in `supabase/config.toml`** (config registers only 37, leaving 78 with no [functions.X] block). Some of these are deployed independently and that's expected, but the gap suggests config drift.

**35 edge functions have ZERO references in any file across `src/`, `scripts/`, `supabase/functions/{others}/`, `*.yml`, `*.toml`, `*.sql`, `*.json` (excluding their own folder):**

Likely orphan (no obvious external invocation pattern):
- `account-conversion-welcome`, `admin-billing-metrics`, `admin-hide-room`, `admin-list-rooms`, `admin-publish-room`, `admin-set-tier`, `apply-room-specification`, `content-quality-audit`, `export-missing-json`, `export-room`, `generate-english-plan`, `get-profile`, `get-source-file`, `get-subscription-status`, `mercy-ai-builder-email`, `regenerate-room-registry`, `room-cache`, `save-room-json`, `scan-design-violations`, `search-entries`, `stripe-webhook-v2`, `sync-rooms-from-json`, `system-metrics`, `update-profile`, `usdt-payment`, `weekly_mercy_snapshots`, `weekly-snapshots`

Likely-fine but ZERO grep refs (verify these are external webhook targets before deleting):
- `apple-iap-sync`, `apple-server-notifications`, `apple-webhook` — Apple webhook receivers
- `billing-apple-attach-transaction`, `billing-google-attach-purchase`, `billing-restore`, `billing-stripe-cancel-subscription` — billing flow webhooks (some may be invoked by mobile native code, not JS)
- `latency-alert-cron` — likely a pg_cron job, no code ref expected
- `revenuecat-webhook` — webhook URL invocation only

Among the 78 unregistered: only 35 are zero-grep. The other 43 (e.g., `paypal-payment`, `redeem-access-code`, `room-chat`) have refs in code so they are presumed live.

The single anchor of false-positive risk: webhooks invoked by external URL pattern (e.g. `https://{project}.supabase.co/functions/v1/apple-webhook`) leave no code trace. **Verify against Supabase dashboard's "Function Invocations" log before deleting any webhook-named function.**

`api/` Vercel serverless functions (separate from `supabase/functions/`):
- `api/mercy/grammar.ts` — used (live) ✓
- `api/tts.ts` — used (live) ✓
- `api/mercy-feedback.ts` — used (live, in `src/lib/send-feedback.ts`) ✓
- `api/mercy-ai.ts` — **zero grep references in code or vercel.json** — likely orphan
- `api/mercy-guide.ts` — **zero grep references** — likely orphan

---

## Category 4 — Database tables / RPCs (recon only — no DB queries)

**Tables (139 created in migrations, 5 with zero code references):**
- `anonymous_user_cleanup_log` — likely written-to by a cleanup RPC
- `developer_accounts` — possible developer-API leftover
- `ip_rate_limit_hits` — likely written to by trigger
- `latency_aggregates` — possibly read by Grafana / external
- `lifetime_intent_signups` — referenced in NORTH_STAR / pricing as legacy "Lifetime tier"; PR #288 just removed Lifetime tier UI. Table may now be stranded. (See "Items NOT flagged" — this one IS flagged because the UI is provably gone.)

**RPC functions (112 total, 41 with no app-code refs):**

The 41 break into roughly:
- **Trigger functions (likely safe):** `handle_admin_signup`, `handle_room_updated_at`, `handle_updated_at`, `update_admin_users_updated_at`, `update_app_settings_updated_at`, `update_kids_updated_at_column`, `update_private_chat_request_timestamp`, `leaderboard_weekly_touch_updated_at`, `teacher_memory_set_updated_at`, `study_groups_set_invite_code`, `family_plans_seed_owner_membership`, `study_groups_seed_owner_membership`, `corporate_seats_enforce_cap`, `family_plan_members_enforce_cap`, `notify_admins_on_new_feedback`, `profiles_set_unsubscribe_token`, `mark_family_invite_converted`, `referral_owner_grants_in_year`, `mfa_active_lockout`, `user_has_verified_mfa`, `record_vocabulary_review`, `touch_streak_on_challenge`, `weekly_leaderboard_apply_attempt`, `check_room_lock`, `get_user_tier_level`, `get_room_tier_level` — these are wired up via SQL (table triggers, security definers), not invoked from app code. **Don't delete without DB-side verification.**
- **Scheduled cleanup jobs (uncertain):** `cleanup_anonymous_users`, `cleanup_old_sessions`, `delete_old_ip_rate_limit`, `delete_old_latency_events`, `delete_old_slo_data`, `delete_old_web_vitals` — likely pg_cron schedules. Verify via dashboard.
- **Aggregation jobs:** `aggregate_web_vitals_daily`, `latency_aggregate_daily`, `analytics_user_cohorts`, `snapshot_app_crash_rate`, `lifetime_intent_count`, `refresh_referral_leaderboards`, `refresh_roadmap_vote_count`, `refresh_study_group_member_count`, `trigger_registry_regeneration` — same caveat.

**This whole RPC list is "uncertain — needs human eyes."** Recommend grepping `supabase/migrations/*.sql` for `CREATE TRIGGER` / `pg_cron` / `cron.schedule` references rather than treating zero-grep as orphan.

---

## Category 5 — Supabase Storage references in code

Buckets currently referenced via `storage.from(...)`:
- `room-audio` ✓ (Phase 2 architecture, confirmed live)
- `room-audio-uploads` — admin upload path, presumed live
- `avatars` ✓
- `payment-proofs` ✓

**No new orphan buckets surfaced post-PR-#297.** A2's earlier audit already cleared the audio bucket landscape.

---

## Category 6 — Orphan components (157 zero-importer files)

Sampled and verified — list saved at `/tmp/audit/component_orphans.txt`. High-priority highlights:

- **`src/screens/PlacementScreen.tsx`** — uses React Native `{ route, navigation }: Props` syntax in a web-only project. Pre-React-Router-v6 era leftover.
- **`src/screens/DrillResultScreen.tsx`, `OnboardingScreen.tsx`, `TrainHomeScreen.tsx`** — entire `src/screens/` is mostly orphan. Real route handlers are in `src/pages/`.
- **`src/pages/LandingPage.tsx`** — file header tags it `v2025-12-21-87.2-AUDIO-AVATAR`. Actual home is `src/pages/Home.tsx` per `AppRouter.tsx`. Old landing kept around.
- **`src/pages/AdminLogin.tsx`, `TierMapPage.tsx`** — presumed-live admin/tier pages, but neither imported.
- **`src/components/AudioBar.tsx`, `AudioPlayer.tsx`, `MercyChat.tsx`, `MercyGuide.tsx`** — major-looking components with zero importers. AudioBar is suspicious post-audio-cleanup; AudioPlayer overlaps with `AudioPlayer.tsx` at root.
- **`src/components/admin/AuditSafeShield.tsx`, `AuditCodeViewer.tsx`, `RoomLinkHealth.tsx`, `SyncHealthSummary.tsx`** — admin tool components, possibly disconnected from current admin layout.
- **`src/components/MatchmakingButton.tsx`, `MatchmakingHub.tsx` (root)** — Matchmaking feature appears UI-orphaned.
- **`src/components/MercyDebugPanel.tsx`, `OnboardingIntro.tsx`, `MercyAvatar.tsx`, `MercyAvatarMinimalist.tsx`** — multiple Mercy character UI variants suggest a redesign that left old versions behind.

Orphan components total **~21,638 LOC**.

**Caveat:** my grep matches by basename only. A component imported by string-eval (rare) would be missed by my grep AND by webpack/vite tree-shaking. So 157 is also the upper-bound bundle savings.

---

## Category 7 — Orphan hooks and utilities (96 files, ~11,718 LOC)

Sampled — list saved at `/tmp/audit/hooks_libs_orphans.txt`. Concerning patterns:

- **`src/hooks/useMatchmaking.ts`, `useRoomCompanion.ts`, `useCompanionLines.ts`** — Matchmaking + Companion features look fully unwired.
- **`src/hooks/useDemoMode.ts`, `useFavoriteTracks.tsx`, `useFavoriteRooms.tsx`, `useRecentRooms.tsx`** — Favorites/Recents/Demo-mode features appear orphan in code (their counterparts may be in storage but the React hooks are unused).
- **`src/hooks/useMercyRoomIntro.ts`, `useRoomIntroAudio.ts`, `useOptimizedAudio.ts`, `useSpeechPlayback.ts`** — audio-related hooks possibly missed by PR #297 cleanup. Worth a second look.
- **`src/hooks/useRoles.ts`, `useAdminLevel.ts`** — admin/role hooks; if admin pages were refactored, these may be the old hook tier.
- **`src/lib/security/*` (5 files)** — `inputValidator.ts`, `session-hardening.ts`, `inputSanitizer.ts`, `content-filter.ts`, `storageEncryption.ts` — all 5 zero-importers. Either pre-built defense layer never wired up, or moved to edge functions. Decide before deleting (security code is risky to remove if anyone *should* be using it).
- **`src/lib/teacher-mercy/applyAdaptiveAdjustments.ts`, `workedExampleGenerator.ts`, `conceptMasteryStore.ts`, `personalityLines.ts`, `sessionTeachingArc.ts`, `pedagogicalResponseEvaluator.ts`** — teaching engine modules orphan'd; suggests a teaching-engine simplification happened.
- **`src/lib/performance/*` (7 files)** — `supabase-optimizer.ts`, `audio-cache.ts`, `supabase-query-cache.ts`, `supabase-logger.ts`, `memoization-helpers.tsx`, `retry-with-backoff.ts`, `react-profiler.tsx` — entire performance kit unused. Either replaced by react-query defaults or never integrated.
- **`src/lib/speech/compareTranscript.ts`, `mapSpeechIntent.ts`, `speechCompare.ts`, `buildSpeechFeedback.ts`** — 4 of 5 speech utility modules unused. Speech feature may be using direct provider calls instead.
- **`src/lib/roomMaster/*` (4 files)**, **`src/lib/teacher-mercy/host/*` (subdir)** — orphan room/teacher infrastructure.

---

## Category 8 — Test files for deleted code

**Sampled 232 test files. After fixing my heuristic:**
- 0 tests with broken `..` relative imports.
- 0 tests whose target component appears in our orphan list (sampled via basename match).

**Note:** my heuristic only matches tests-by-basename to orphan-by-basename. If a test imports from a renamed file, my check misses it. **Confidence: medium for negative result.** Consider running `vitest --run` after any orphan deletion to surface broken imports.

---

## Category 9 — Configuration files

| File | Status |
|---|---|
| `tsconfig.json` | Used (editor) |
| `tsconfig.typecheck.json` | Used (`npm run typecheck:app`) |
| `tsconfig.scripts.json` | Used (`npm run typecheck:scripts`) |
| `tsconfig.core.json` | **No references** in package.json scripts, CI workflows, or any other config. Likely stranded. |
| `eslint.config.js` | Used (default ESLint resolve) |
| `.eslintrc.accessibility.json` | **No references** in any script/CI. Stranded. |
| `vite.config.ts` | Used |
| `vite.config.bundle-analysis.ts` | **No references** in package.json/CI/scripts. Stranded. |
| `vite.config.performance.ts` | **No references**. Stranded. |
| `vitest.config.ts` | Used |
| `playwright.config.ts` + `playwright.smoke.config.ts` | Used |
| `stryker.config.json` + `stryker.roomloader.config.json` | Used by mutation-testing workflow ✓ |
| `tailwind.config.js` (1 line — `module.exports = { plugins: ['./tailwind.config.ts'] }` proxy) AND `tailwind.config.ts` | Both present; the `.js` is essentially a stub wrapper. Worth verifying the `.js` is needed or just legacy. |
| `netlify.toml` | Repo deploys via Vercel (`vercel.json` is canonical). `netlify.toml` only 320 bytes — leftover from earlier hosting? |
| `deno.json` + `deno.lock` (root) | Root `deno.json` is 30 bytes; the real Deno config is per-edge-function. Root file may be vestigial. |

---

## Category 10 — Documentation drift

**`README.md` is structurally outdated:**
- Headline section is "Generate Cross-Topic Recommendations" — references `keywordResponder.ts`, which CLAUDE.md explicitly flags as zero-callers dead code.
- README claims `cross_topic_recommendations.json` is "Used by `keywordResponder.ts`" — neither file is wired in src/.
- README has no top-level "What is MercyBlade" or routing/architecture section. NORTH_STAR.md and CLAUDE.md handle that, but README itself is misleading first-impression.

**70+ stale `.md` reports at repo root** — see Category 2. Examples that look out-of-date:
- `LAUNCH_BLOCKERS_REPORT.md`, `LAUNCH_QA_EXECUTION_REPORT.md`, `LAUNCH_QA_SUMMARY.md`, `FINAL_LAUNCH_SAFETY_REPORT.md`, `LAUNCH_HUMAN_CHECKLIST.md` — launch was earlier; "final" + "safety" doublings suggest layered drafts.
- `PHASE_3_POLISH_REPORT.md`, `UI_UX_POLISH_SUMMARY.md`, `UI_COHERENCE_SUMMARY.md`, `UX_POLISH_IMPLEMENTATION.md` — many overlapping polish docs.
- `SECURITY_AUDIT_REPORT.md`, `SECURITY_FIX_VALIDATION_REPORT.md`, `SECURITY_FIXES_SUMMARY.md`, `SECURITY_HARDENING_SUMMARY.md`, `SECURITY_INFRASTRUCTURE.md`, `SECURITY_MONITORING_SETUP.md`, `SECURITY_NOTES.md` — **7 security docs, likely heavy overlap**.
- `AUDIO_STORAGE_MISMATCH_REPORT.md`, `AUDIO_SYSTEM_ARCHITECTURE.md`, `AUDIO_VALIDATION_REPORT.md` — A1 just shipped audio cleanup; some of these may be stale post-PR-#297.

**`docs/` (45 files):** mixed live + stale. Apple-billing planning files (`apple-backend-ingestion-plan.md`, `apple-canonical-mapping.md`, `apple-client-integration-plan.md`, `apple-notification-lifecycle-plan.md`, `apple-risks-blockers-implementation-order.md`, `apple-verification-and-ios-wiring.md`) — 6 plan docs from one effort, likely all stale post-Apple-ship.

---

## Category 11 — Feature flags

**Compile-time flags in `src/lib/featureFlags.ts`:**

| Flag | Default | Status |
|---|---|---|
| `MERCY_HOST_ENABLED` | `false` (hardcoded, no env override) | **Stale.** "Mercy Host" terminology is legacy per CLAUDE.md ("Teacher Mercy, not host"). Flag is only referenced as a `false` constant in tests + comment "flip to true when ready" — never flipped. |
| `FOCUS_AREAS_CARD_ENABLED` | `false` (hardcoded) | **Stale.** Used by `src/components/home/FocusAreasCard.tsx` only — early-returns null when flag is false. Component effectively dead. |
| `SERVER_STREAKS_ENABLED` | `readEnvBool("VITE_SERVER_STREAKS_ENABLED", false)` | Active flag (env-controlled). |
| `SPEECH_PERSISTENCE_ENABLED` | `readEnvBool("VITE_SPEECH_PERSISTENCE_ENABLED", false)` | Active flag. |

**DB-backed flags** (`public.feature_flags` table, see `src/hooks/useFeatureFlag.ts`): 1 currently referenced — `certificates_enabled` (gating Progress Certificates). Recommend a separate "currently-on flags" audit via Supabase dashboard since the DB table isn't visible from code.

---

## Category 12 — NPM dependencies

74 dependencies, 14 with no `from '<dep>'` import in any TS/JS file across `src/`, `scripts/`, `supabase/`, `server/`, or build configs. Of those 14:

**Confirmed needed (false positives in my scan):**
- `@capacitor/android`, `@capacitor/ios` — required by Capacitor build (no JS import)
- `@capacitor/cli` — used as binary via npx
- `@revenuecat/purchases-capacitor`, `@sentry/capacitor` — Capacitor plugins, may be loaded by native shell
- `concurrently` — used in `package.json#scripts.dev`
- `cors`, `express`, `elevenlabs` — used by `server/*` (live)

**Likely orphan:**
- **`react-virtualized`** — zero imports
- **`react-virtuoso`** — zero imports
- **`react-window`** — zero imports
- **`@monaco-editor/react`** — zero imports (only appears in package.json + lockfile)
- **`stripe`** (npm package) — only imported by `upabase/functions/stripe-webhook.ts` (the typo'd-dir orphan). Real edge functions use esm.sh / deno.land URLs.

Three virtualization libraries shipped together is a strong sign of "tried each, kept none." Removing all three saves bundle weight.

---

## Category 13 — Public/static assets

- **26 stray `.mp3` files at `public/` root** (`vip1_habits_*.mp3` x8, `corporate_execution_systems_*_en.mp3` x8, `bedtime_words_v1_*.mp3` x5, `science_for_kids_v1_*.mp3` x5). Some are referenced from `public/data/*.json`, others (e.g. `vip1_habits_02.mp3`) have **0 references**. These contradict CLAUDE.md's "Bundled adult-room audio was removed from `public/audio/*.mp3`" rule — the audio is at `public/` root, not `public/audio/`, so the rule didn't catch them.
- **`public/audio/` directory exists but is empty** — kids/ + music/ subdirs were "kept" per CLAUDE.md, but neither is present here. Either gitignored re-population or the rule needs updating.
- **`public/guide.png` AND `public/guide.png ` (with trailing space)** — duplicate file with whitespace name.
- **`public/frederick_bismarck_comparison_vip9.json`** — single room JSON at public/ root, should be in `public/data/` (where the other 476 rooms live).
- **`public/system-health.json`, `public/keyword-scan-report.txt`, `public/rooms-without-keywords.txt`** — diagnostic artifacts being shipped to clients.
- **`public/internal/mercy_reply_library.json`** — name says "internal" but it's in `public/` (browser-accessible). Verify intent.

**Public assets sampled, not exhaustive (2,022 image/font/svg files in `public/`).**

---

## Category 14 — CSS

| File | Importers |
|---|---|
| `src/index.css` | 3 (loaded via `src/main.tsx`) ✓ |
| `src/App.css` | **0** |
| `src/styles/theme.css` | **0** |
| `src/styles/scrollbar.css` | **0** |
| `src/styles/mb-frame.css` | **0** |
| `src/components/a11y/FocusRing.css` | **0** |

5 of 6 standalone CSS files are not imported anywhere (Tailwind config is separate and active). Likely all orphan.

---

## Category 15 — Error monitoring / observability

**`src/lib/monitoring/`** (post-PR-#297 state):
- `sentryInit.ts`, `captureException.ts`, `sentryContext.ts`, `breadcrumbs.ts` — all referenced from `src/main.tsx`, `src/components/ErrorBoundary.tsx`, etc. **Healthy.**
- `src/components/monitoring/SentryUserBinding.tsx` — referenced in main flow. Healthy.

**No LogRocket / Hotjar / Amplitude / Datadog instrumentation found** — only Sentry. Clean.

**`@sentry/capacitor`** is installed but never imported in JS code (see Category 12). May be loaded only by native iOS/Android shell — verify it's actually wired into the Capacitor build chain. If not, candidate for removal.

---

## Items NOT flagged but worth noting

- **Stripe webhook duality:** `stripe-webhook` is registered in config.toml and uses esm.sh imports; `upabase/functions/stripe-webhook.ts` (typo'd dir) uses `import Stripe from "stripe"` (the npm package). The npm `stripe` dep only exists for that orphan file. If you remove the typo'd dir, you can also remove the npm `stripe` dep.

- **Three "weekly snapshot" edge functions (`weekly_snapshots`, `weekly_mercy_snapshots`, `weekly-snapshots`) and `weekly-digest-email`** all coexist. The kebab vs. snake_case alone tells you they're from different generations. Decide which is the canonical and prune the rest.

- **`src/data/system/cross_topic_recommendations.json`** exists but is consumed by zero TS files. Generated by `scripts/generate-cross-topic-recommendations.ts` for a `keywordResponder.ts` system that's officially dead. README still references this pipeline as live.

- **`AGENT_MEMORY.md` at repo root** — looks like it was meant to be in `~/.claude/projects/...` per CLAUDE.md's user-memory pattern, but ended up in the project root instead. If it's project-wide agent memory, OK; if it's accidental, cleanup target.

- **`+` (literal plus-sign filename, 0 bytes)** — almost certainly the result of `> +` from a typo (e.g. `command > + file.txt`). Tracked in git.

- **`schema.sql` (0 bytes at root)** — empty placeholder. If meaningful, populate; else remove.

- **`.c10-sentry-handler.md` and `.c10-webhook.js`** at repo root — dotfile-prefixed but live in working tree. These look like stashed C10-agent artifacts.

---

## Honest uncertainty

**Things I could not verify by grep alone — needs human eyes:**

1. **DB-side wiring of RPCs.** 41 RPCs have no app-code references but most are likely table triggers or pg_cron jobs. I did not parse `CREATE TRIGGER` / `cron.schedule(...)` statements to disambiguate. **Action:** before deleting any RPC, search `supabase/migrations/*.sql` for `EXECUTE FUNCTION <name>` or `cron.schedule(...<name>...)`. If found in a migration, KEEP.

2. **Webhook edge functions invoked by external URL.** `apple-webhook`, `revenuecat-webhook`, `google-webhook`, `apple-server-notifications`, `latency-alert-cron` show 0 grep refs because they're called by external services or pg_cron. **Action:** Supabase dashboard → Functions → Invocation logs, sort by recent invocation. Anything with 0 invocations in 30 days is a real candidate.

3. **Conflict between root-level SQL files and `supabase/migrations/` files of the same name** (3 files diverge in content). **Action:** confirm which copy was actually applied to production. Likely the migration folder is canonical and the root copies are pre-cleanup drafts that should be deleted, but I cannot confirm without DB state inspection.

4. **`react-virtualized` / `react-virtuoso` / `react-window` may be used dynamically.** I only grepped for `from 'X'` imports. If any is loaded via `await import('react-window')` with a string variable, my grep misses it. **Action:** quick build-time check via webpack-bundle-analyzer or `npm run build:bundle-analysis` (which uses one of the orphan vite configs!).

5. **`netlify.toml` and root `deno.json`** — neither is referenced by any active script. Could be vestigial from earlier hosting decisions, or could be required by a Netlify/Deno-specific tool I'm not aware of. **Action:** confirm with Chau whether Netlify deploy is fully retired.

6. **CSS files** — 5 of 6 unused per grep. But CSS imports can use `import "./X.css"` syntax that my regex captured fine, OR can be referenced via `<link>` tag in `index.html` (also checked). **High confidence**, but worth a `vite build` run after removing each to be safe.

7. **`src/components/AudioBar.tsx` and similar audio-named orphans.** Given PR #297 just landed audio cleanup, some of these might be intentional remnants A1 deferred. Cross-check with PR #297's diff before removing.

8. **`src/lib/security/*` 5 unused files.** Security code is dangerous to remove because the question is "should something be using this?" rather than "is something using this?". Recommend a security review before any deletion in this directory.

9. **`MercyB/` subdirectory and `ios_partial_storekit/`.** Both contain Swift/StoreKit fragments. Could be parallel iOS experiments OR could be required references for an in-progress IAP wiring. **Action:** confirm with iOS build status before deletion.

10. **Component orphan list (157) at face value.** My grep matches by basename, which is correct for typical TypeScript/React import patterns but misses (a) string-eval imports and (b) dynamic feature-flag-gated lazy loads where the component name is stitched at runtime. Confidence: high for typical components, lower for anything in `lazy()` / `Suspense` flows. Recommend `vite build` after batch deletions to surface any miss.

---

End of report.
