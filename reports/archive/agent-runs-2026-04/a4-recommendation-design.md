# A4 — Weakest-Skill Recommendation Engine v2

**Status:** shipped (this PR)
**Owner:** A4 track
**Step:** Roadmap step 4 (Retention)

## Why

The Home `FocusAreas` card and the daily-challenge surface (A3) both
need a single answer to: *what should this learner work on next?* Until
now, that decision was an ad-hoc `severity_score desc limit 3` query.
That works on day one but degrades as the learner accumulates history:

- A rule the user just practised yesterday keeps surfacing because its
  raw `severity_score` is still high.
- A B2 rule fired by a stray edge-case detector keeps outranking the A1
  rules the learner is genuinely missing.
- A brand-new user with zero history sees an empty card and bounces.

v2 replaces that query with a small composite score and explicit
cold-start fallback so the card and the daily challenge always have
something useful to show.

## Algorithm

For every rule in `WEAKNESS_CATALOG` we compute three sub-scores in
`[0, 1]`, then combine them:

| Sub-score | Formula | Intent |
|---|---|---|
| `errorScore` | `min(1, errorCount / 5)` | Reward rules the user has demonstrably missed. Saturates at 5 errors so a single noisy day doesn't dominate. |
| `recencyScore` | `min(1, daysSinceLastAttempt / 14)` (0 if never) | Penalise rules practised in the last 24 h; fade the penalty over 14 days. Prevents the card from re-recommending the same rule the user just finished. |
| `cefrAlign` | `1 - |ruleCefrIdx - userCefrIdx| / 5` | Soft-prefer rules near the user's CEFR. Acts as a tie-breaker when error data is sparse. |

```
score      = 0.6 * errorScore + 0.3 * recencyScore + 0.1 * cefrAlign
confidence = min(1, errorCount / 5)
```

Weights were chosen so `errorCount` dominates whenever the user has
demonstrable signal, but recency and CEFR can break ties between rules
the user has hit a similar number of times.

`confidence` is exposed separately so the UI can show "we think you
struggle with X" with stronger language once we have ≥5 attempts.

### Sorting

Recommendations sort by `score desc`, with ties broken by `errorCount
desc` then alphabetical tag. Sort is deterministic — same history in
returns same list out, every time.

### Reason codes

Each recommendation carries a `reason` so the card can pick copy:

| Reason | When it fires | Sample copy |
|---|---|---|
| `cold_start` | User has zero history. | "Hãy bắt đầu với những điểm cơ bản…" |
| `high_error_rate` | `errorScore` dominates. | "Bạn đã nhầm 5 lần với điểm này." |
| `stale_practice` | `recencyScore` dominates. | "Đã 3 tuần rồi — ôn lại nhé." |
| `cefr_aligned` | `cefrAlign` dominates. | "Phù hợp với trình độ của bạn." |

## Cold-start strategy

If the user has no records (or all records are zero-error), the
engine takes a separate code path:

1. Sort all catalog tags by CEFR ascending (A1 → C2). Tie-break
   alphabetically for stability.
2. Return the top-N as `WeaknessRecommendation` entries with
   `confidence = 0`, `errorCount = 0`, and `reason = "cold_start"`.

The first three cold-start recommendations are typically
`vi_l1_3rd_person_s`, `vi_l1_a_vs_an_vowel`, and `vi_l1_missing_be` —
all A1-level rules a Vietnamese learner is virtually guaranteed to
benefit from.

This guarantees `getTopWeaknesses`, `recommendNextLesson`, and
`recommendDailyChallenge` are always meaningful for new users; the
caller never has to handle "no recommendation."

## Public API

```ts
getTopWeaknesses(userId, n=3, opts?): Promise<WeaknessRecommendation[]>
recommendNextLesson(userId, opts?): Promise<WeaknessTag | null>
recommendDailyChallenge(userId, opts?): Promise<WeaknessTag>
```

`opts` accepts:

- `fetchHistory?: (userId) => Promise<UserWeaknessHistory>` — used by
  tests to inject fixture data without hitting Supabase.
- `now?: Date` — clock injection so recency calculations are
  deterministic in tests.

The pure ranker `rankWeaknesses(history, now)` is also exported for
direct use in unit tests and any server-side aggregation that already
has the history in memory.

## Data layer

Default `fetchHistory` reads `mb_user_weakness_profile` rows for the
user and projects them to the engine's `AttemptRecord` shape:

| profile column | engine field |
|---|---|
| `key_pattern` | `ruleTag` |
| `frequency` | `errorCount` |
| `last_seen` | `lastSeenAt` |

The Supabase client is imported **lazily** inside the default fetcher
so tests can import the engine without bringing up `createClient`. On
any error (RLS, network, unset env), the fetcher returns
`{ records: [] }` so the engine surfaces a cold-start recommendation
rather than crashing the card.

## How A3 (daily challenge) consumes this

A3's UI calls `recommendDailyChallenge(userId)` once per day and
caches the resulting `WeaknessTag` for the rest of the day. The
signature is locked: `(userId: string, opts?) => Promise<WeaknessTag>`.

The engine guarantees a non-null tag so A3 never needs a
"no challenge today" branch.

## Constraints honoured

- `weakness-catalog.ts`, `l1-error-detector.ts`,
  `l1-vn-explanations.ts`, `micro-lessons.ts` — read-only.
- `focusAreasLogic.ts` — additive only (`AttemptRecord`,
  `computeWeaknessDensity`, `timeSinceLastAttempt`); no rename or
  remove of existing exports.
- No changes to streaks, leaderboard, XP, or
  `FocusAreasMicroLessonDialog.tsx`.

## Tests

`src/lib/weakness/__tests__/recommendationEngine.test.ts` — 23 unit
tests covering ordering, recency penalty, confidence saturation,
cold-start, micro-lesson filtering, deterministic sort, malformed
inputs, and the async API with an injected fetcher.
