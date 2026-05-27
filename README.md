# MercyBlade

> **Foreign languages for Vietnamese learners — and Vietnamese for English-speakers.**
> A bilingual-first language-learning app (PWA, plus iOS/Android shells via Capacitor).

**Live:** https://mercyblade.com

MercyBlade teaches English (and other language modules) to Vietnamese learners —
Vietnamese-first in every screen — alongside a reverse track teaching Vietnamese
to English speakers. The product optimizes for learning **outcomes**, not
engagement metrics.

`STRATEGY.md` and `PRINCIPLES.md` are the two canonical living documents — read
them before making product or architecture decisions.

## Tech stack

| Layer        | Technology                                                       |
|--------------|------------------------------------------------------------------|
| Frontend     | React 18, Vite 6, TypeScript 5                                    |
| Data / state | TanStack Query 5, React Router 6                                  |
| Backend      | Supabase (Postgres, Auth, Storage, Edge Functions) — Pro plan    |
| Hosting      | **Netlify** — production + preview deploys (Vercel is the documented recovery host; see `docs/runbooks/disaster-recovery.md`) |
| Repository   | **GitLab** (`gitlab.com:cd12536/mercyB`); GitHub kept read-only as `old-origin` |
| Mobile       | Capacitor 8 (iOS + Android shells)                                |
| Monitoring   | Sentry (`@sentry/react` 10)                                       |

## Getting started

### Prerequisites

- **Node 22+** — the CI pipeline and the Capacitor 8 toolchain target Node 22.
  (The Netlify production build runtime is Node 22; local Node 22+ is fine.)
- **npm** — this repo uses npm; there is no pnpm/yarn lockfile.
- **Supabase CLI** *(optional)* — only for edge-function / migration work.
  Invoke via `npx supabase ...` (the repo's scripts already do).
- **Netlify CLI** *(optional)* — only for manual production deploys
  (`npx netlify ...`). See `.github/workflows/DEPLOYMENT.md`.
- **Vercel CLI** *(optional)* — only for emergency recovery deploys to
  the documented fallback host (`npx vercel ...`); see
  `docs/runbooks/disaster-recovery.md` §2.2.
- **`glab` CLI** *(optional)* — for creating merge requests from the
  terminal (`glab mr create`). The repo is on GitLab; `gh pr create` is
  the legacy path.

### Install & run

```bash
npm install      # also installs the pre-commit room-validation hooks
                 # (the `prepare` script runs scripts/setup-hooks.sh)
npm run dev      # Vite on 127.0.0.1:3107 + grammar server on :3001 (strictPort)
```

Environment variables are **not** auto-provisioned. They live in the
**Netlify** project (build/runtime env) and Supabase project settings;
see `SETUP.md` and `docs/SECURITY_HARDENING_2025.md` for the canonical
list. The legacy Vercel project retains a mirror copy so the documented
recovery path in `docs/runbooks/disaster-recovery.md` §2.2 works without
re-population. If Supabase is unreachable in dev, audio degrades silently
to a local `/audio/{key}` path.

## Repository structure

```
src/          App code: components/ pages/ screens/ router/ lib/ hooks/
              mercy/ languages/ providers/ contexts/
public/data/  ~476 room JSON files — the learning-content corpus
supabase/     Edge functions (functions/) and SQL migrations (migrations/)
ios/          Capacitor iOS shell (open the .xcworkspace)
android/      Capacitor Android shell
scripts/      Build / validation / content tooling (see scripts/README.md)
docs/         Internal design, ops, security, billing, submission docs
```

## Common commands

Use the **actual** `package.json` script names below — some older docs cite
aliases (`validate:rooms`, `registry:generate`) that do not exist.

```bash
npm run dev            # dev server (Vite + grammar server)
npm run build          # production build (runs the rooms:check prebuild hook)
npm run preview        # serve the production build
npm test               # vitest run
npm run lint           # eslint
npm run typecheck      # app typecheck (tsconfig.typecheck.json, src/** only)
npm run typecheck:ci   # what CI runs: bare `tsc --noEmit`
npm run validate-rooms # full room-data integrity validation
npm run rooms:check    # registry regen + core room validation (prebuild hook)
npx cap sync ios       # copy dist/ into the iOS shell, reinstall pods
```

## Architecture overview

- **Room content pipeline** — `public/data/*.json` (~476 rooms) →
  `src/lib/roomLoader*.ts` → normalized in
  `src/components/room/RoomRenderer.tsx` → rendered by `RoomRendererUI.tsx`.
  Route: `/room/:roomId`. Audio resolves through
  `src/lib/roomAudioResolver.ts` to the Supabase `room-audio` bucket
  (service-worker cached for offline playback after first play).
- **Teacher Mercy engine** — the in-product teacher character. Live engine in
  `src/lib/teacher-mercy/*` and `src/config/mercyPersona.ts`, surfaced via
  `MercyGuidePanel` (Journey / Grammar / Speak / Logic tabs).
- **Placement engine** — adaptive English-level placement; a server-side 2PL
  IRT engine under `supabase/functions/placement-session/engine/*` backed by a
  `placement_items` bank (Placement v2, in progress).
- **Payments** — web and Android use Stripe; iOS routes subscriptions through
  Apple IAP via RevenueCat (App Store rule 3.1.1). Platform switch in
  `src/screens/Pricing.tsx`. Details in `SETUP.md` and `docs/billing/`.

## Documentation & handoff

| Doc                                              | Purpose                                  |
|--------------------------------------------------|------------------------------------------|
| `STRATEGY.md`, `PRINCIPLES.md`                    | Canonical living docs — read first       |
| `CLAUDE.md`                                       | Architecture invariants, gotchas, traps  |
| `SETUP.md`                                        | Local dev setup, hooks, IAP env vars     |
| `ROOM_GUIDE.md`                                   | Canonical room-system reference          |
| `SECURITY.md`, `docs/SECURITY_HARDENING_2025.md`  | Security monitoring + hardening checklist |
| `.github/workflows/DEPLOYMENT.md`                 | Deploy runbook (Netlify primary; edge functions; recovery via Vercel) |
| `.github/workflows/ROLLBACK.md`                   | Rollback runbook (Netlify CLI + dashboard) |
| `docs/runbooks/disaster-recovery.md`              | Provider-outage / account-lockout playbook (authoritative) |
| `docs/onboarding/`                                | New-contributor docs (README, local-setup, first PR, glossary) |
| `docs/architecture/`                              | System overview + 9 per-system deep-dives + data-flow |
| `docs/`                                           | Billing, app-store submission, observability, performance, accessibility |
