# XP integration guide (A9 / PR `feat/xp-gamification`)

> **For handler-owners.** A9's PR ships the XP infrastructure (tables,
> RPC, badge, /xp page, level-up modal). The `awardXPEvent()` calls
> from individual handlers are intentionally **NOT** in this PR — they
> belong to whoever owns each handler. Wire them in your own PR; A9
> will not edit your domain.

## TL;DR

```ts
import { awardXPEventBackground } from "@/lib/xp/awardXPEvent";

awardXPEventBackground({
  event_type: "lesson_complete",
  source_id: lessonId,            // required for idempotency on this type
});
```

That's it. The function is fire-and-forget, errors are swallowed, and
the server enforces idempotency, the 1-hour cooldown, and the 500
XP/day per-event-type cap.

## Event types and where to call them

| Event type                  | Suggested call site                                   | source_id |
| ---                         | ---                                                   | --- |
| `lesson_complete`           | room/lesson completion handler                         | lesson / room id |
| `drill_complete`            | drill telemetry handler (when score recorded)          | drill id |
| `challenge_complete`        | pronunciation challenge completion                     | challenge id |
| `vocabulary_review_5_words` | vocabulary review session, after every 5 words        | none — daily cap protects |
| `streak_day_continued`      | streak-bump handler (when day counter increments)     | ISO date `YYYY-MM-DD` |
| `streak_week_continued`     | streak handler (when week marker increments)          | ISO week `YYYY-Www` |
| `first_time_in_category`    | first-touch into IELTS / profession pack / etc.       | category key |
| `perfect_score_lesson`      | lesson completion when score is 100%                  | lesson id (bonus on top of `lesson_complete`) |
| `listening_clip_complete`   | listening clip "I'm done" or auto-finish              | clip id |

## Why I'm not wiring these myself

The brief lists six handlers across `src/lib/`, `src/components/`,
`src/pages/` belonging to other agents (rooms, drills, vocabulary,
streak, listening, pronunciation challenge). Per the parallel-CC
discipline, A9 doesn't touch other agents' files. Each handler-owner
should add the one-line call in their next PR.

## Failure modes

`awardXPEvent` returns a structured result, but `awardXPEventBackground`
silently drops errors — both safe to call from any handler. If you want
to surface the result (e.g., to chain a level-up celebration), use the
non-background variant:

```ts
const result = await awardXPEvent({
  event_type: "lesson_complete",
  source_id: lessonId,
});
if (result.level_changed) {
  // Trigger LevelUpModal — see src/components/xp/LevelUpModal.tsx
}
```

`reason` values:
- `awarded` — XP added (success).
- `duplicate` — same `(user_id, event_type, source_id)` already recorded.
- `cooldown` — same source within the last hour.
- `capped` — daily 500 XP/event_type cap reached.
- `disabled` — user has `user_xp.gamification_enabled = false`.
- `invalid` — bad input (non-positive XP, missing event_type).
- `rpc_error` — network / DB error; `error_message` populated.

## What lives where

- `src/lib/xp/levels.ts` — pure level-curve math.
- `src/lib/xp/eventTypes.ts` — canonical event registry + bilingual labels.
- `src/lib/xp/awardXPEvent.ts` — client wrapper; this is the API for handlers.
- `src/lib/xp/xpClient.ts` — **legacy** `awardXp()` for the existing daily-challenge flow. Don't add new callers; use `awardXPEvent` instead.
- `src/components/xp/XPBadge.tsx` — Home badge.
- `src/components/xp/LevelUpModal.tsx` — celebration modal (subscribe via `level_changed` from `awardXPEvent`).
- `src/pages/xp/XPHistoryPage.tsx` — `/xp` route.
- `supabase/migrations/20260609000000_xp_system.sql` — `award_xp_event()` RPC + `xp_events` table + `current_level` / `gamification_enabled` columns on `user_xp`.

## Anti-gaming guarantees (server-side)

You don't need to worry about any of these in your handler:

1. **Idempotency.** Same `(user_id, event_type, source_id)` triple is rejected with `reason: "duplicate"`. Calling `awardXPEvent` ten times for the same lesson awards once.
2. **Cooldown.** If the same `source_id` was awarded for the same event within the last hour, returns `reason: "cooldown"`.
3. **Daily cap.** 500 XP per `event_type` per UTC day per user. Beyond that returns `reason: "capped"`.
4. **Multiplier sanity.** `p_multiplier` is clamped — can't push a single award over the cap.
5. **No negative XP.** RPC rejects non-positive amounts.
6. **Opt-out.** When `user_xp.gamification_enabled = false`, the RPC short-circuits with `reason: "disabled"` and writes nothing.

## Warm-tone constraint

This system is engagement, not pressure. Do **not**:

- Show "you missed yesterday" / "you broke your streak" framing.
- Compare a user's XP or level to another user's.
- Fire push notifications about streaks ending.
- Add a public XP leaderboard (the referral leaderboard is separate).

The `gamification_enabled = false` opt-out is part of the contract.
Every visible XP surface (badge, modal, page, /xp link) must respect it.
