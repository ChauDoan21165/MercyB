# Local Setup

> Bare-metal "fresh clone to dev server running" guide. If you've
> done this once before, the existing **[`SETUP.md`](../../SETUP.md)**
> at the repo root is the shorter reference. This doc covers
> everything `SETUP.md` doesn't — the gotchas, the env vars that
> aren't in `.env.example`, the first-run errors that look scary but
> aren't, and the order to do things in.

---

## Prerequisites

You need:

- **Node 22+.** CI and the Capacitor 8 toolchain target Node 22.
  Netlify (the post-2026-05-27 production host) runs Node 22; local
  Node 22+ is fine. Check with `node -v`.
- **npm.** This repo uses npm. There is no pnpm/yarn lockfile.
  `corepack` is not configured.
- **git.** Standard. The repo is on GitLab —
  `git@gitlab.com:cd12536/mercyB.git`.
- **A modern terminal.** macOS, Linux, or WSL. Native Windows works
  but the contributor experience is rougher.

Optional, for specific work only:

- **`glab` CLI** — only if you're going to open merge requests from
  the terminal. `brew install glab` on macOS.
- **`gh` CLI** — only useful for legacy GitHub artefacts; this repo
  is on GitLab now.
- **Supabase CLI** — only for editing edge functions or running
  migrations locally. Invoke via `npx supabase ...`; no global
  install required.
- **Netlify CLI** — for manual production deploys. Invoke via
  `npx netlify ...`. See `.github/workflows/DEPLOYMENT.md`.
- **Vercel CLI** — only for emergency recovery deploys to the
  documented fallback host (`npx vercel ...`); see
  `docs/runbooks/disaster-recovery.md` §2.2.
- **Xcode** — only for iOS Capacitor builds.
- **Android Studio** — only for Android Capacitor builds.

If your task is "fix a TypeScript bug in `src/`", you need Node 22
and npm. That's it.

---

## Clone

```bash
git clone git@gitlab.com:cd12536/mercyB.git ~/MercyB
cd ~/MercyB
```

If you don't have SSH set up with GitLab, use HTTPS:

```bash
git clone https://gitlab.com/cd12536/mercyB.git ~/MercyB
```

> **Note for AI agents:** all our paths in docs assume the repo is at
> `~/MercyB`. If you clone somewhere else, `find`/grep paths in the
> docs will need adjustment.

## Install dependencies

```bash
npm install
```

This:

1. Installs the npm dependencies (~10 minutes on a cold cache).
2. Runs the **`prepare`** script automatically, which installs git
   pre-commit hooks via `scripts/setup-hooks.sh`. You'll see hook
   install output near the end.

You should see no errors. Warnings about peer dependencies are
expected (and currently not fixable without a coordinated
TanStack-Query + React Router upgrade).

If `npm install` fails, see **[Common first-run errors](#common-first-run-errors)**
below.

## Configure environment variables (the canonical gotcha)

This is the **single most confusing** part of first-time setup.

The repo ships an **`.env.example`** at the root, but it documents
**only the Apple IAP / RevenueCat / analytics subset** of env vars.
The two env vars you actually need to talk to Supabase
(`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) are **NOT** in
`.env.example` — they live in the **Netlify** project's build/runtime
env (post-2026-05-27 migration; the Vercel project's env retains a
mirror copy for the documented recovery deploy path). Obtain them
from there or from Chau.

> Why this is the case: those keys were added to the Vercel env
> early in the project's life, before `.env.example` was created,
> and never back-ported. They're now mirrored in Netlify too. The
> canonical list (with rationale per key) lives in
> **`docs/SECURITY_HARDENING_2025.md`**.

### What you need at minimum to run `npm run dev`

```bash
# .env.local at the repo root (gitignored — never commit)
VITE_SUPABASE_URL=https://buemdfxyhxunzpgdoqin.supabase.co
VITE_SUPABASE_ANON_KEY=<get from Chau, the Netlify project env, or the Vercel recovery env>
```

That's enough to boot the dev server. Without the Supabase URL/key,
the dev server still starts, but every Supabase call fails — which
means:

- Audio degrades silently to `/audio/{key}` local fallback (and the
  files are no longer in `public/audio/`, so playback fails).
- Auth doesn't work.
- The `me-entitlement` edge function call fails; the app treats you
  as not-premium.

The dev server **doesn't crash** from missing env — it just runs in
a degraded mode. This is intentional (a no-network mode for offline
work), but it does mean you can spend an hour staring at a broken
audio player before realising you forgot a `.env.local` line.

### Other env vars you might want

Open `.env.example` and copy the rows you actually need into
`.env.local`:

- `VITE_SENTRY_DSN` — enables Sentry monitoring in dev. Leave blank
  to skip; the SDK is route-gated and stays out of static pages
  even when set. See the [observability deep-dive](../architecture/systems/observability.md).
- `VITE_REVENUECAT_APPLE_API_KEY` — only needed for iOS IAP testing.
- `VITE_GA4_MEASUREMENT_ID` — prod-only; leave blank for local.
- `VITE_FB_PIXEL_ID`, `VITE_CLARITY_PROJECT_ID` — same; prod-only.

Edge-function secrets (no `VITE_` prefix — e.g.
`REVENUECAT_WEBHOOK_AUTH_TOKEN`) live in Supabase Edge Function
secrets, not in `.env.local`. They never reach the browser bundle.

### What is *never* in git

- `.env` and `.env.local` — both gitignored.
- `public/audio/manifest.json` — auto-generated by prebuild hook;
  gitignored.
- `public/version.json` — auto-generated; gitignored.
- Any Supabase service-role key. The service-role key never lives in
  a file; it's in the macOS Keychain under `mb-supabase-service-role`
  for agents who need it. (See memory: `project_agent_infra_access`.)

If you see credentials in a PR diff, that's a bug — flag immediately.

## Start the dev server

```bash
npm run dev
```

This runs **two** servers concurrently via `concurrently`:

1. **Vite** at `127.0.0.1:3107` (`--strictPort` — it will refuse to
   start on any other port).
2. **Grammar server** at `127.0.0.1:3001`, an Express server proxied
   at `/api/*`.

Open `http://127.0.0.1:3107`.

Or, just Vite (skip the grammar server):

```bash
npm run dev:frontend
```

`/functions/v1/*` is proxied to Supabase from the Vite dev server.

### Why `--strictPort`?

If port 3107 is already in use, Vite **refuses to fall back** to
another port — it dies. This is deliberate. Falling back to 3108
silently is how you spend twenty minutes debugging why your dev
server isn't picking up code changes (you're looking at the dev
server on the wrong port).

If you see `error when starting dev server: Port 3107 is in use`,
find and kill the stale PID:

```bash
lsof -i :3107
kill -9 <PID>
```

## Verify your setup with the gates

These three commands are the local equivalent of CI. Run all three;
expect them to pass on a fresh clone.

```bash
npm run typecheck:ci   # bare `tsc --noEmit` — what CI runs
npm run lint           # eslint
npm test               # vitest run
```

> Run **`npm run typecheck:ci`**, not `npm run typecheck`. The latter
> excludes `vite.config.ts` (and other config files) and will not
> catch type errors CI rejects. Memory:
> `feedback_testing_discipline` and the README both call this out.

### What "pass" looks like

`typecheck:ci` — no output. Silence means success.

`lint` — exits 0 with a list of files checked. Some warnings are
expected (unused-vars in WIP files); errors should be zero.

`npm test` — vitest produces a summary like
`Test Files  234 passed (234)`. The first run is slow (~2–3 minutes
cold). Subsequent runs are fast.

`npx playwright test` — the e2e suite. Requires a one-time
`npx playwright install` (downloads browser binaries, ~200 MB). Not
needed for most local work.

## Production build (when you actually need it)

```bash
npm run build
```

The prebuild hook runs `rooms:check` first — registry generation +
core room validation across `public/data/*.json`. If any room JSON
is invalid, the build refuses to proceed. Fix with
`npm run validate-rooms` (full integrity check; surfaces all errors,
not just the first one).

Preview the production build:

```bash
npm run preview
```

Note that `preview` serves the build output **without** the
grammar server, so any `/api/*` calls will fail. Use `npm run dev`
for full-stack local work.

---

## Common first-run errors

### `EADDRINUSE: address already in use 127.0.0.1:3107`

Port 3107 is held by a previous dev server. Kill it
(`lsof -i :3107` then `kill -9 <PID>`). Don't change the port in
`vite.config.ts` — it's `--strictPort` for a reason.

### `Error: Cannot find module @sentry/react` (or similar dependency error)

You're probably in a worktree that has a stale `node_modules`
symlink to a path that doesn't have the package. Memory:
`feedback_stale_shared_node_modules_false_red`. Fix:

```bash
rm node_modules   # if it's a symlink to a stale shared cache
npm ci
```

### Audio doesn't play in dev (silent failure)

Most likely: `.env.local` is missing `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY`. The resolver silently falls back to a
local `/audio/{key}` path; those files are no longer in
`public/audio/` (since d2951ddd), so playback fails. Add the env
vars and restart `npm run dev`.

You can confirm by checking the browser console for
`[roomAudioResolver] falling back to local …` warnings.

### Pre-commit hook blocks every commit

Your hooks weren't installed by `npm install` (or the
`prepare` script was skipped). Re-run manually:

```bash
bash scripts/setup-hooks.sh
```

You can verify with `ls -la .git/hooks/pre-commit`.

The hooks validate room JSON, enforce filename rules (no quotes /
spaces), and regenerate the room registry. If a commit is blocked,
read the hook output — it points at the specific file.

### `npm run typecheck` passes, but `npm run typecheck:ci` fails

You forgot the **`:ci`** suffix. The non-`:ci` variant excludes
config files. CI runs `typecheck:ci`. Always reproduce locally
against `typecheck:ci`.

### Vite hot reload doesn't pick up `.ts` changes

Usually because the file has a TypeScript error. Vite is permissive
about runtime errors but stricter about syntax. Run
`npm run typecheck:ci` to find the real problem.

### Playwright tests fail because browsers aren't installed

```bash
npx playwright install
```

This downloads Chromium / Firefox / WebKit binaries (~200 MB).
First-time only.

### Build fails on `rooms:check`

A room JSON file is malformed. Run the fuller diagnostic:

```bash
npm run validate-rooms
```

That surfaces *every* error, not just the first. Common issues:
missing `keywords_en` array, unclosed JSON brace, or a filename
with a forbidden character (quote, space, backtick).

### Service worker keeps serving stale content

The PWA service worker is registered **in production only**
(`src/main.tsx` guards on `import.meta.env.DEV`). If you're seeing
stale content in dev, it's not the SW — try a hard refresh
(`Cmd+Shift+R`) or clear localStorage.

In production preview, the SW IS registered. If `npm run preview`
shows stale content, click the chunk-recovery reload (it should
happen automatically after one failed chunk fetch).

### iOS Capacitor build can't find `dist/index.html`

```bash
npm run build && npx cap sync ios
```

Memory: `feedback_cap_sync_ios_mechanics` — `cap sync ios` needs a
gitignored `dist/index.html` placeholder; the build creates it.
`Podfile` / `Podfile.lock` are tracked; add them with `git add -f`
if a Pod update changed them.

---

## A short pre-flight check before opening an MR

Once `npm run dev` works and the three gates pass, verify these:

- [ ] Your branch was created off **`origin/main`**, not a stale
      local main:
      ```bash
      git fetch origin
      git checkout -b feat/your-thing origin/main
      ```
      Memory: `feedback_branch_hygiene`. Branches off stale local
      `main` are the single most common collision source.
- [ ] You're working in a **git worktree** if you're an AI agent or
      working alongside other agents:
      ```bash
      git worktree add ~/MercyB-<task> -b feat/your-thing origin/main
      ```
      `PRINCIPLES.md` §13.
- [ ] You've **read CLAUDE.md** before changing anything in
      `src/lib/roomAudioResolver.ts`, `src/components/room/`,
      `src/main.tsx`, `src/router/AnonymousOnboardingGate.tsx`, or
      `src/lib/teacher-mercy/`. Each has load-bearing doctrine
      blocks.
- [ ] Your change isn't on the **CC2 lane** (kids) unless you're
      CC2.

Once those are checked, head to
**[your-first-contribution.md](./your-first-contribution.md)** for
the rest of the flow.

---

## Where to ask when something is broken

We don't have a contributor chat — Chau is the founder and the
audience for these docs. Until that changes:

- **An obvious doc gap** — open a doc-only MR. Memory:
  `feedback_recon_unique_filenames` if you're writing a recon doc.
- **A real bug in setup** — open an issue or MR; describe what
  failed and what worked.
- **An AI agent that's stuck on infra access** — see memory entry
  `project_agent_infra_access` for the macOS Keychain key location.

Welcome aboard.
