# Gamification module (Lane F)

Client-first retention engine — **streaks, XP, daily goals, achievements** —
that pairs with the SRS module. Same isolation contract.

## Isolation contract (non-negotiable)

- **Self-contained.** Everything lives under `src/features/gamification/`. The
  only files this module touches outside that tree are:
  1. `src/lib/featureFlags.ts` — the `FEATURE_GAMIFICATION` constant.
  2. `src/router/AppRouter.tsx` — one flag-gated `<Route>`.
  3. A host nav surface may *optionally* spread `gamificationNavItems()`.
- **Behind a flag, default OFF.** `FEATURE_GAMIFICATION` (env
  `VITE_FEATURE_GAMIFICATION`). Nothing renders until it is flipped.
- **Touches NOTHING** in lanes A/B/C/D, billing, auth, or audio.
- **No new tables or migrations.** State persists to **IndexedDB** behind the
  `GamificationStore` interface — Supabase-swap-ready, but client-only today.
- **No merge, no deploy** from this branch (`lane-f/gamification`).

## Architecture

```
types.ts            THE CONTRACT — every engine/store/component builds on this.
defaults.ts         createDefaultState() + local-day date helpers (toIsoDate…).
flag.ts             isGamificationEnabled().
store/              GamificationStore impls + factory (F5 owns).
engines/            Pure reducers: streak (F1), xp (F2), goal (F3), achievements (F4).
components/         Widgets + achievements screen (F6).
hooks/              useGamification() — load → apply engine → save (F6).
routes/             GamificationPage (the one flagged route).
nav/                gamificationNav — data descriptor for host nav surfaces.
```

### Engines are pure

`(state, event) -> result`. No I/O, no clock reads inside — callers pass
`today: IsoDate` / `now: number`. Deterministic, trivially testable, and the
persistence layer (`GamificationStore`) is the only thing that does I/O.

### Persistence seam

`createGamificationStore()` returns the best store for the environment
(IndexedDB in the browser, in-memory in SSR/tests). Swapping in a
server-backed store later is a one-file change behind the same interface.

## Work-streams

| Stream | Scope |
|--------|-------|
| STEP 0 | scaffold + `types.ts` contract + flag + flagged route/nav (this commit) |
| F1 | streak engine (daily streak, freeze/grace) + tests |
| F2 | XP engine (rules, levels) + tests |
| F3 | daily-goal engine (configurable goal, progress) + tests |
| F4 | achievements (definitions, unlock logic) + tests |
| F5 | IndexedDB store + tests |
| F6 | UI widgets (streak/XP/goal, achievement screen) + component tests |
