# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MercyBlade is a Vietnamese-first English-learning app (mobile-first, Capacitor + Vite React). The core content unit is a "room": a bilingual (EN/VI) JSON file under `public/data/` with keyword-matched entries, audio, and structured learning content. There are ~476 rooms today. Kids mode has a separate, offline-first experience. Read `NORTH_STAR.md` for mission, principles, and Phase 2 audio cutover history — it's the authoritative context document for any major decision.

## Commands

```bash
# Dev (Vite + grammar server together on 127.0.0.1:3107 + :3001; strictPort, no fallback)
npm run dev
npm run dev:frontend   # just Vite, without the grammar server

# Production build — runs rooms:check (registry + validation) as prebuild hook, then vite build
npm run build
npm run preview        # serve dist/ locally, same port

# Verification gates — run both before committing non-trivial changes
npm run typecheck      # uses tsconfig.typecheck.json (NOT tsconfig.json)
npm run lint           # eslint .

# Tests
npm test               # vitest run (unit/integration)
npx vitest run path/to/file.test.ts         # single file
npx vitest run -t 'partial test name'        # single test by name
npx playwright test                          # e2e (see playwright.config.ts, e2e/)

# Room data integrity (called automatically by `npm run build` via prebuild)
npm run rooms:check          # generate-room-registry + validate-rooms (core-only)
npm run validate-rooms       # full validation (all rooms)
npm run check:empty-rooms    # flag rooms with no entries
npm run check:kw-coverage    # flag rooms with thin keyword coverage

# iOS / Capacitor
npx cap sync ios             # copies dist/ → ios/App/App/public and reinstalls pods
npx cap open ios             # opens ios/App/App.xcworkspace in Xcode (always the workspace, not the xcodeproj)

# Supabase (project: buemdfxyhxunzpgdoqin.supabase.co)
# Migrations: 116 files under supabase/migrations/. CLI state may drift — some migrations
# were applied manually via the dashboard SQL Editor. See NORTH_STAR.md > Deferred Tech Debt
# "Fix Supabase migration drift" before running `supabase db push`.
```

## Architecture — the things that require reading multiple files

### Audio resolution pipeline (post-Phase-2, single source of truth)

Any audio URL in the app flows through one canonical pipeline defined in `src/lib/roomAudioResolver.ts`:

1. `toAudioKey(raw)` — sync, pure, **idempotent** (while-loop on `audio/` prefix strip). Normalizes every legacy input shape (`foo.mp3`, `/audio/foo.mp3`, `public/audio/foo.mp3`, `kids/x.mp3`, `private:foo.mp3`, `https://…`) into one canonical key.
2. `tryResolveLocal(key)` — sync. Returns a local `/audio/…` URL for keys that must never hit the network: `kids/*`, `music/*`, `https://…` passthrough. Returns `null` for adult-room keys that need remote resolution.
3. `resolveRoomAudioUrl(raw, opts)` — async. Calls `tryResolveLocal` first; only adult-room keys reach Supabase via `getPublicUrl('room-audio', filename)`. On any error, returns `{ url: '/audio/{key}', fallback: true, error }` so playback silently degrades to local.
4. `useAudioUrl(filename)` hook in `src/hooks/useAudioUrl.ts` — the React-facing layer. Seeds `useState` synchronously via `tryResolveLocal` to avoid loading flash for local keys. Signature locked with CC #2: `{ url, loading, error, refresh }`.

**Hard invariant:** `kids/*` and `music/*` keys NEVER reach Supabase. Enforced in `resolveRoomAudioUrl` by calling `tryResolveLocal` before any remote call. Violating this breaks the "kids offline-first" contract. There are tests specifically guarding this.

Consumer components that build audio URLs should:
- Pass canonical keys (not URLs) to `<TalkingFacePlayButton src={key} />`
- Use `toAudioKey(raw)` anywhere they receive messy input from JSON/props
- Use `useAudioUrl` in render-time React contexts; use `resolveRoomAudioUrl` directly in imperative contexts like `MusicPlayerContext.play()`

### Room content pipeline

Room JSON (in `public/data/*.json`) → loaded at runtime by `src/lib/roomLoader*.ts` → normalized by pre-processors in `src/components/room/RoomRenderer.tsx` and `src/components/room/roomRenderer/helpers.ts` (these now emit canonical audio keys via `toAudioKey`, not URLs) → rendered by `src/components/room/RoomRendererUI.tsx` → audio plays via `<TalkingFacePlayButton>` which wraps `useAudioUrl`.

Room URL pattern is `/room/:roomId` where `roomId` is the JSON filename minus `.json` (see `src/router/AppRouter.tsx`).

### Mercy character and the tab layout

The in-room experience is `MercyGuidePanel` with four tabs: Journey, Grammar, **Speak**, Logic. MercySpeakTab has a dual-system invariant that is easy to break:
- **Kids mode** → pre-recorded ElevenLabs mp3 at `/audio/kids/<key>.mp3` or `/audio/kids/josh/<key>.mp3` (Mercy voice vs Josh voice toggle). Files built inline in `src/components/mercy-guide/MercySpeakTab.tsx:kidsAudioSrc` useMemo.
- **Adult mode** → browser `window.speechSynthesis.speak(utterance)`. The current implementation chunks text > 180 chars into sentence-sized utterances because Chrome silently drops utterances that exceed ~15s or ~250 chars. See `speakViaTTS` in MercySpeakTab.

### Boot entry (`src/main.tsx`)

Not a vanilla create-react-app boot. Includes:
- One-time auto-reload on dynamic-import chunk load failures (stale-deploy recovery)
- Full-screen fatal error overlay (user-safe in prod, stack traces in dev)
- Legacy path normalization (`/upgrade` → `/pricing`)
- Session-storage deep-link restore (for auth redirect flows)
- `window.__mbResolveAudioSrc` seam — older code path; the modern path is the useAudioUrl hook, but the seam is still available for non-React consumers.
- **PWA service worker registration is intentionally disabled** in `main.tsx` (see the `registerPwaServiceWorker` IIFE). Workbox still builds `dist/sw.js` at build time; re-enable the registration call only when shipping PWA offline for real.

### Supabase

- Singleton client in `src/lib/supabaseClient.ts` — the ONLY `createClient()` call in the whole app. Imports from anywhere else must come from here.
- Edge functions under `supabase/functions/` (see `admin-billing-*`, `generate-room-audio`, `adult-content-url`, `apple-server-notifications`, etc.)
- `room-audio` Storage bucket is currently PUBLIC — tier-gating for VIP content lives in the app layer, not RLS. Revisiting this is tracked in NORTH_STAR > Deferred Tech Debt "Tier-gate VIP audio via signed URLs".

### Dev server quirks

- Port 3107 is locked with `--strictPort`. If it's in use, Vite fails hard rather than falling back. Kill the stale process or use `dev:frontend` on an alternate port.
- The grammar-server (`server/grammar-server.ts`) runs at `http://127.0.0.1:3001` and is proxied through Vite at `/api/*`. The `concurrently` in `npm run dev` starts both.
- `/functions/v1/*` is proxied to the Supabase project in `vite.config.ts`.

## Non-obvious invariants and gotchas

- **Kids audio stays local.** Never route `kids/*` or `music/*` through Supabase. Any code path that does is a P0 bug.
- **`toAudioKey` must remain idempotent.** Call sites call it defensively, including on pre-normalized inputs. The while-loop on `audio/` prefix strip is load-bearing — don't replace it with a single `.replace()`.
- **Four tsconfigs.** `tsconfig.json` is the editor config. `tsconfig.typecheck.json` is what `npm run typecheck` uses for the app. `tsconfig.scripts.json` is for the `scripts/` directory. `tsconfig.core.json` is a leaner variant used by some build steps.
- **Workbox cache pattern drift.** `vite.config.ts` currently matches `/storage/v1/object/sign/room-audio/…`, but the bucket is now public so URLs contain `/public/room-audio/…`. The regex needs updating from `\/sign\/room-audio\/` to `\/(sign|public)\/room-audio\/` before Phase 2.6 bundled-audio removal for offline caching to work. Tracked in NORTH_STAR.
- **Bundled adult-room audio was removed** from `public/audio/*.mp3` (kids/ and music/ kept). That means development works only if the Supabase public bucket is reachable, or if resolver's local fallback is tolerated. Don't re-add the removed files.
- **`.env.local` was deleted** (its only unique value — `OPENAI_API_KEY` — already exists in `.env`). Both files are gitignored. The upload script reads from `.env` via dotenv.
- **Vitest config must not import `@vitejs/plugin-react-swc` unless it's installed** — called out in `package.json` `_meta`.
- **CLI build** runs `rooms:check` as a prebuild hook. A room JSON that fails validation blocks the build. When debugging, run `npm run validate-rooms` directly for the full message list.

## Working style conventions from NORTH_STAR

Since this repo is built by a 1-3 person team using AI agents heavily:
- Plan before code for non-trivial work; short contract-first exchanges for parallel-agent work.
- Never auto-push — every `git push` is explicit.
- Kids mode and Vietnamese-first positioning are non-negotiable filters on any new feature.
- Room-content changes don't need component changes; component changes should be tier/mode-aware (kids vs adult paths have different invariants).
