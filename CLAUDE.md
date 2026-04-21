# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mission (from NORTH_STAR.md)

Make MercyBlade the #1 English-learning app for Vietnamese learners — the one Vietnamese students publicly credit for their IELTS score, their job abroad, their life change. Outcomes, not engagement. Vietnamese-first in every feature, word, and button. Read `NORTH_STAR.md` in full before any big decision; it is the authoritative context document.

## The five non-negotiables — a feature that violates any of these is rejected

1. **Vietnamese-first, always.** Never generic English features that happen to be translated. If non-Vietnamese users feel slightly out of place, that's correct.
2. **Kids mode is sacred.** Offline-first, no login friction, no monetization CTAs, age-appropriate. Parents trust us.
3. **Mobile-first.** Every feature must work at 375–414 px. Install size matters.
4. **Outcomes over engagement.** No dark gamification, no streak-shaming. If a feature boosts retention but hurts learning, reject it.
5. **No VIP tier.** Users are at `profiles.tier = 0..N` (level 0 = free, higher = paid). Any code that references `'vip'` / `'all_vip'` as an audience/cohort is **legacy** — skip it. Room-name prefixes like `vip6_…` in content files are fine (historical filename pattern, not a tier).

## Operating discipline (condensed from `docs/mercy-ai-company-lessons-log.md`)

These are the rules that stop AI-run companies from drifting. Follow them when fixing bugs or adding features.

- **Restore before redesign.** When something breaks, recover the last known good behavior before adding new ideas.
- **One owner per function.** Each feature has one primary home. No duplicate surfaces.
- **Core path survives optional failures.** Nice features must fail softly — room, audio, chat, admin must keep working.
- **Small diffs over smart diffs.** When a system is unstable, prefer the smallest safe change over broad "clever" ones.
- **Checkpoint every risky step.** Commit before rollback work, large edits, or experiments.
- **Don't solve uncertainty with more code.** If the cause is unclear, added fallbacks multiply confusion. Get evidence first.
- **Central files are dangerous.** Loaders, render orchestrators, access gates, shared helpers — changes there affect the whole product. Touch with care.
- **Separate layers before fixing.** Identify whether the failure is loading, rendering, permissions, data shape, ownership, or external.
- **Permissions are product logic.** RLS, auth, access checks — the feature isn't "working" if the UI renders but permissions fail.
- **Stop digging when drift increases.** If each fix makes the product stranger, switch to rollback analysis.
- **Debug by narrowing, not expanding.** Find the smallest set of files that explain the failure.
- **Source-of-truth hierarchy.** Prefer: (1) last known good behavior → (2) current production reality → (3) minimal safe diff → (4) new design ideas.

## Commands

```bash
# Dev (Vite + grammar server together on 127.0.0.1:3107 + :3001; strictPort)
npm run dev
npm run dev:frontend   # just Vite, without the grammar server

# Production build — runs rooms:check (registry + validation) as prebuild hook, then vite build
npm run build
npm run preview

# Verification gates — run BOTH before committing non-trivial changes
npm run typecheck      # uses tsconfig.typecheck.json (NOT tsconfig.json)
npm run lint

# Tests
npm test                                     # vitest run
npx vitest run path/to/file.test.ts          # single file
npx vitest run -t 'partial test name'        # single test
npx playwright test                          # e2e

# Room data integrity (prebuild hook runs rooms:check automatically)
npm run rooms:check
npm run validate-rooms       # full validation across all rooms
npm run check:empty-rooms
npm run check:kw-coverage

# iOS / Capacitor
npx cap sync ios             # copies dist/ → ios/App/App/public and reinstalls pods
npx cap open ios             # opens ios/App/App.xcworkspace (always the workspace)

# Supabase — project buemdfxyhxunzpgdoqin.supabase.co
# Some migrations were applied manually via SQL Editor; CLI state drifts.
# See NORTH_STAR "Fix Supabase migration drift" before `supabase db push`.
```

## Architecture — multi-file concepts worth knowing

### Audio resolution pipeline (`src/lib/roomAudioResolver.ts`)

One canonical path from any raw audio reference to a playable URL:

1. `toAudioKey(raw)` — sync, pure, **idempotent** (while-loop strip of `audio/` prefix is load-bearing).
2. `tryResolveLocal(key)` — sync. Returns a local URL for `kids/*`, `music/*`, and absolute `https://…`. Returns null for adult-room keys.
3. `resolveRoomAudioUrl(raw, opts)` — async. Calls `tryResolveLocal` first (enforces the kids invariant); adult-room keys go to Supabase via `getPublicUrl('room-audio', filename)`. On error, returns `{ url: '/audio/{key}', fallback: true, error }` for silent degradation.
4. `useAudioUrl(filename)` hook (`src/hooks/useAudioUrl.ts`) — React-facing layer. Seeds `useState` synchronously via `tryResolveLocal` so local keys have no loading flash. Contract: `{ url, loading, error, refresh }`.

**Hard invariant:** `kids/*` and `music/*` never reach Supabase. Tests in `src/hooks/__tests__/useAudioUrl.test.ts` guard this. Violating it breaks the kids offline-first rule.

Consumer pattern: pass canonical keys (not URLs) to `<TalkingFacePlayButton src={key} />`. Use `toAudioKey(raw)` anywhere you take messy input. Use `useAudioUrl` in React render; use `resolveRoomAudioUrl` in imperative contexts like `MusicPlayerContext.play()`.

### Room content pipeline

Room JSON in `public/data/*.json` (~476 rooms) → loaded by `src/lib/roomLoader*.ts` → normalized by pre-processors in `src/components/room/RoomRenderer.tsx` and `src/components/room/roomRenderer/helpers.ts` (these emit canonical keys via `toAudioKey`, not URLs) → rendered by `src/components/room/RoomRendererUI.tsx` → audio via `<TalkingFacePlayButton>` which calls `useAudioUrl`. Route pattern: `/room/:roomId` where `roomId` is the JSON filename minus `.json`.

### Mercy character / Speak tab dual invariant

`MercyGuidePanel` has four tabs: Journey, Grammar, **Speak**, Logic. `MercySpeakTab.tsx` has two audio paths that are easy to break:
- **Kids mode** → pre-recorded ElevenLabs mp3 at `/audio/kids/<key>.mp3` (or `/audio/kids/josh/<key>.mp3` for male voice).
- **Adult mode** → browser `window.speechSynthesis.speak()`. The current implementation chunks text > 180 chars into sentence-sized utterances because Chrome silently drops utterances that exceed ~15s or ~250 chars. See `speakViaTTS` + `chunkForTTS` helper.

### Boot entry (`src/main.tsx`)

Not a vanilla create-react-app boot. Includes:
- One-time auto-reload on dynamic-import chunk failures (stale-deploy recovery)
- Full-screen fatal error overlay (user-safe in prod, stack traces in dev)
- Legacy path normalization (`/upgrade` → `/pricing`)
- Session-storage deep-link restore for auth redirects
- `window.__mbResolveAudioSrc` seam (older code path; modern path is `useAudioUrl`)
- **PWA service worker registration is intentionally disabled** (`registerPwaServiceWorker` IIFE is a no-op). Workbox still builds `dist/sw.js`. Re-enable only when shipping PWA offline for real.

### Supabase

- Singleton client at `src/lib/supabaseClient.ts` — the **ONLY** `createClient()` call in the app.
- 9 edge functions for email (`email-broadcast`, `send-email-campaign`, `email-automations`, `send-redeem-email`, `send-feedback-reply`, `send-pending-emails`, `admin-daily-digest`, `test-email`, `mercy-ai-builder-email`). Plus billing, audio generation, admin, etc.
- `room-audio` Storage bucket is PUBLIC (post-Phase-2). Tier-gating lives in the app layer, not in RLS. Revisit tracked in NORTH_STAR Deferred Tech Debt.
- DNS is on Cloudflare. `admin@mercyblade.com` → forwarded to Chau's personal inbox via Cloudflare Email Routing.

### Dev server quirks

- Port 3107 is `--strictPort`. Fails hard if in use; kill the stale PID instead of falling back.
- Grammar server on `127.0.0.1:3001`, proxied at `/api/*`. `concurrently` starts both.
- `/functions/v1/*` is proxied to Supabase in `vite.config.ts`.

## Email system (as of April 21, 2026)

- **Provider:** Resend. Verified sending domain: `mercyblade.com`. Use `hello@mercyblade.com` as the canonical from-address.
- **Cohort:** ~100 existing users in `profiles`.
- **Tables:** `email_campaigns` + `email_events`, admin-gated (`get_admin_level >= 9`).
- **Unsubscribe system is still being built** — no `email_unsubscribes` table yet, no unsubscribe edge function yet, no footer in campaign templates yet. Do not send marketing emails until this is in place.
- **Two campaign edge functions disagree** on `audience_type` values (`send-email-campaign` uses `'vip' | 'level0' | 'inactive'`; `email-broadcast` uses `'level2' | 'level3' | 'all_vip' | 'manual'`). Both mix the legacy `vip` naming with the newer `level` system — treat as broken until reconciled. Prefer `email-broadcast` (newer, has a `preview` action).
- **No admin UI** for drafting campaigns — must INSERT into `email_campaigns` via SQL Editor then invoke the function.
- Transactional plaintext templates live in `src/emails/*.txt` (not marketing templates).

## Non-obvious invariants and gotchas

- **Kids audio stays local.** Never route `kids/*` or `music/*` through Supabase. P0.
- **`toAudioKey` must remain idempotent.** Call sites use it defensively; the while-loop on `audio/` is load-bearing.
- **Four tsconfigs.** `tsconfig.json` (editor), `tsconfig.typecheck.json` (app typecheck), `tsconfig.scripts.json` (scripts), `tsconfig.core.json` (leaner build variant).
- **Workbox cache pattern now matches `(sign|public)` for `room-audio`** (`vite.config.ts`). Don't narrow it back to `/sign/` — the bucket is public today.
- **Bundled adult-room audio was removed** from `public/audio/*.mp3` (kids/ and music/ kept). Development requires Supabase reachability OR acceptance of the local fallback. Don't re-add the removed files.
- **`.env.local` was deleted** (its only unique value duplicated into `.env`). Both files are gitignored.
- **`public/audio/manifest.json` and `public/version.json` are gitignored** (auto-regenerated by prebuild hook).
- **Vitest config must not import `@vitejs/plugin-react-swc`** unless installed (noted in `package.json._meta`).
- **`rooms:check` prebuild hook** blocks builds on bad JSON. Run `npm run validate-rooms` directly for full error list.

## Traps this codebase hit recently — don't repeat them

- **Dead-code wiring.** `keywordResponder.ts` existed but had zero callers; "fixing" it had no runtime effect. Before changing a module, `grep -r 'from.*moduleName' src` to confirm it's imported.
- **Patch-and-retry without evidence.** TTS was "fixed" three times in a row because each fix was speculation. Runtime logs → diagnosis → fix is faster than three rounds of guessing.
- **Chrome `speechSynthesis` quirks.** `cancel()` can leave the engine paused; `onvoiceschanged` fires outside the user-gesture window (blocks `speak()`); long utterances silently fail at ~15s. The current `speakViaTTS` handles these; don't "simplify" it.
- **Silent audio fallback can hide real Supabase failures.** The resolver returns `/audio/{key}` on any signing error. When debugging "audio works for some users but not others," check the resolver's `console.warn('[roomAudioResolver] falling back to local …')` logs before assuming Supabase is fine.

## User preferences

Chau (the founder) prefers **short replies**, lead with the action, skip context-setting unless asked. Conversation is in English; Vietnamese is reserved for user-facing output (emails, scripts, UI). Action items should be flagged with a `CHAU ↓↓↓ COPY FROM HERE` marker on its own line. Full preferences and accumulated rules for this project live at `~/.claude/projects/-Users-admin-MercyB/memory/` — they auto-load every session. Read them if you're unsure how to respond.

## Git discipline

- Never push without explicit approval. Every `git push` is a conscious act.
- `tsc --noEmit` + `vite build` green before every commit.
- Small logical commits. If multiple concerns, split.
- Follow the Co-Authored-By trailer style visible in `git log`.
- Supabase migrations in `supabase/migrations/` — human-reviewed before applying.
