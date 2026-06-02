# Review — Spaced-Repetition Review Module (Lane D)

> **Status:** behind `FEATURE_REVIEW` (default **OFF**). Not shipped. Lands on
> `lane-d/review`, ships as one deliberate release after review.

A spaced-repetition review system spanning all 7 MercyBlade study flows. It
attacks **retention**: turning content a learner has already met into durable
long-term memory via scheduled recall.

## The 7 flows

| Flow id | Front (prompt) | Back (answer) |
| ------- | -------------- | ------------- |
| `vi-en` | Vietnamese     | English       |
| `vi-de` | Vietnamese     | German        |
| `vi-ja` | Vietnamese     | Japanese      |
| `vi-ko` | Vietnamese     | Korean        |
| `vi-zh` | Vietnamese     | Chinese       |
| `en-vi` | English        | Vietnamese    |
| `en-es` | English        | Spanish       |

Canonical list lives in [`flows.ts`](./flows.ts).

## Isolation contract (non-negotiable)

This module is a **fully isolated lane**. The rules below are load-bearing — a
change that breaks one rejects the whole module.

1. **Lives entirely under `src/features/review/`.** Own routes, own state, own
   tests. The ONLY files outside this directory it touches:
   - `src/lib/featureFlags.ts` — one flag line (`REVIEW_ENABLED`, default off).
   - `src/router/AppRouter.tsx` — one flagged lazy route.
   - One nav entry (a single flagged `<NavLink>` in the shared shell).
2. **Touches NOTHING** in `src/lib/tutor`, `tests/regression`, Azure/infra,
   billing, auth, or the audio pipeline. It reuses existing audio playback
   **read-only** (resolve a canonical key → URL; never write/upload).
3. **Client-first. NO new Supabase tables or migrations** (Dashboard is locked).
   All review state persists in **IndexedDB** behind the [`ReviewStore`](./types.ts)
   interface, so a Supabase-backed store can replace it later without touching
   any other layer.
4. **No merge to main. No deploy.** One deliberate release later.

## Why a new module and not an extension of `src/lib/vocabulary`

Recon found an existing SRS surface: `src/lib/vocabulary/sm2.ts` (hand-rolled
SM-2), `src/lib/vocabulary/repository.ts` (Supabase-backed), and
`src/pages/vocabulary/ReviewSession.tsx`. We deliberately do **not** extend it:

- It is **Supabase-coupled** (`vocabulary_entries` table, RLS-scoped reads).
  Extending it would require schema work — forbidden by the no-migrations rule.
- It is **single-flow** (English vocab only) and **single-source** (user-saved
  words), not the 7-flow, content-derived deck this module needs.
- It hand-rolls SM-2; this module uses **FSRS** (`ts-fsrs`) per the brief.

That surface keeps working untouched. This module borrows its **tone** (no
shame for "Again", "Lần ôn tiếp theo", "Hoàn thành" celebration) and may later
share a Supabase-backed `ReviewStore` — but the layers stay separate. When the
two are reconciled, the seam is the `ReviewStore` + `ContentAdapter` interfaces.

## Architecture — the contract

Everything is wired through interfaces in [`types.ts`](./types.ts). The slices
implement them and never reach across:

```
                 ┌──────────────────────────────────────┐
   content  →    │ ContentAdapter   getItems(flow)        │  (D3, read-only)
                 └──────────────────────────────────────┘
                                  │ ReviewItem[]
                                  ▼
   IndexedDB ←→  ┌──────────────────────────────────────┐
                 │ ReviewStore   cards / log / counts     │  (D2, idb)
                 └──────────────────────────────────────┘
                                  │ StoredCard / DailyCount
                                  ▼
   ts-fsrs   ←→  ┌──────────────────────────────────────┐
                 │ Scheduler   newCard / review / preview │  (D1, ts-fsrs)
                 └──────────────────────────────────────┘
                                  │ SchedulerCardState
                                  ▼
                 ┌──────────────────────────────────────┐
                 │ session  buildQueue / grade / summary  │  (D4, pure logic)
                 └──────────────────────────────────────┘
                                  │ SessionCard / SessionSummary
                                  ▼
                 ┌──────────────────────────────────────┐
   render utils  │ ui/session (D5)   ui/overview (D6)     │
   (D7)      →    └──────────────────────────────────────┘
```

## Slice map (parallel build)

Each slice owns a non-overlapping subdirectory. None edit `types.ts` without
coordinating with the lane leader (interface change = stop-the-world).

| Slice | Dir          | Owns                                                        | Depends on (interfaces)        |
| ----- | ------------ | ----------------------------------------------------------- | ------------------------------ |
| D1    | `scheduler/` | `Scheduler` impl over `ts-fsrs`; grade→interval/due mapping | `types.ts`                     |
| D2    | `store/`     | `ReviewStore` over IndexedDB (`idb`)                        | `types.ts`                     |
| D3    | `content/`   | `ContentAdapter` — read-only pull from existing content     | `types.ts`                     |
| D4    | `session/`   | queue builder, ordering, grading loop, session summary      | `Scheduler`+`ReviewStore`+`ContentAdapter` |
| D5    | `ui/session/`| card front/back, grade buttons, progress, complete panel    | D4 session API + D7            |
| D6    | `ui/overview/`| deck list, due counts, daily-limit settings                | D4 + D2 + D7                   |
| D7    | `render/`    | per-language display utils (CJK sizing, Korean, diacritics) | `types.ts`                     |

## Conventions

- **Time is `ms` epoch** everywhere in the contract (`nowMs`, `due`). The UI
  converts to local dates for the `YYYY-MM-DD` daily-count key. Pass a clock
  into pure logic for deterministic tests — never call `Date.now()` inside
  schedulers/session logic.
- **`ReviewItem.id` is namespaced**: `"<flow>:<kind>:<slug>"`, stable across
  rebuilds, so a card's scheduling state survives content edits.
- **Fail soft.** A flow with no content yields an empty deck, not an error.
  Audio resolution failures degrade silently (the card still reviews).
- **Tests alongside every slice** in `__tests__/`. Nothing unverified ships.

## Flag & route

- Flag: `FEATURE_FLAGS.REVIEW_ENABLED` (env `VITE_REVIEW_ENABLED`, default off).
  Re-exported as `FEATURE_REVIEW` from [`flag.ts`](./flag.ts).
- Route: `/review` (overview) and `/review/:flow` (session), lazy-loaded and
  gated on the flag in `AppRouter.tsx`. When off, the route 404s to `/`.
- Nav: a single flagged entry; hidden entirely when the flag is off.
