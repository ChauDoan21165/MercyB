# Recommendation engine verification — 2026-04-27

Pre-flip audit of three recommendation feature flags. Investigation
first, recommendation second. **Do not flip any flag without running
the data-readiness SQL below for your production project.**

## TL;DR

| Flag | Code path ready? | Data ready? | Infra ready? | Recommend flip? | Earliest safe flip |
|---|---|---|---|---|---|
| `phoneme_drill_recommendations_enabled` | ✅ | ⚠ Run SQL §A | ✅ 26 hand-curated drill packs in repo | ✅ **YES, after SQL §A returns ≥ 1 row** | Day 1 |
| `practice_recommendations_enabled` | ✅ | ⚠ Run SQL §B | ✅ Rules engine self-contained | ⚠ Yes only AFTER drill flag has soaked 48h | Day 3 |
| `pronunciation_streaming_enabled` | ✅ | n/a (real-time path) | ❌ **`azure-phoneme-stream` edge function NOT DEPLOYED** | ❌ **NO — block until deploy lands** | Day 7+ |

The hard blocker on the streaming flag is real: I queried `supabase functions list --project-ref buemdfxyhxunzpgdoqin` — only `azure-phoneme` (batch) is ACTIVE. Flipping the flag today would have every paying user open a WebSocket to a 404, fall back to the post-recording flow, and emit a noisy `breadcrumbStreamingPronunciation("fallback")` Sentry crumb for every attempt. Cheap fallback, expensive noise. Don't ship it.

---

## Flag 1 — `phoneme_drill_recommendations_enabled`

### What it gates

`src/components/home/RecommendedDrillCard.tsx` — the Home card "Bạn có thể luyện /θ/ trong 5 phút". Hidden by default. Renders only when:

1. Flag = ON (per-user list OR global).
2. User is signed in.
3. Their weakest phoneme has **≥ 5 attempts**, **avg score < 70**, AND a hand-curated drill pack exists for it.
4. They haven't drilled that specific phoneme in the last 24h (`drillGraduation` localStorage cooldown).

### Code path

```
RecommendedDrillCard.useEffect
 → getWeeklyProgressSummary(userId)
   → SELECT * FROM speech_attempts WHERE user_id = ? AND attempted_at > now() - interval '7 days'
 → pickRecommendation(userId, summary.weakest)
   → walk weakest[] → first phoneme with attemptCount ≥ 5, avg < 70, and a pack in src/data/pronunciation/phoneme-drills/index.ts
   → readGraduationState(userId).byPhoneme[slug] cooldown check
 → render CTA → /practice/phoneme/<slug>?src=home
```

### Drill pack inventory

26 packs hand-written in `src/data/pronunciation/phoneme-drills/index.ts` covering: `th`, `dh`, `v`, `w`, `r`, `ae`, `ih_iy`, `uh_uw`, `ey`, `ay`, `ow`, `ch`, `jh`, `sh`, plus 12 more. Coverage is solid for VN learner pain points.

### Data-readiness SQL (Section A)

Run in Supabase SQL Editor as service role:

```sql
-- Are there enough recent speech attempts to actually surface a recommendation?
WITH recent AS (
  SELECT user_id, phoneme_scores, attempted_at
  FROM public.speech_attempts
  WHERE attempted_at > now() - interval '7 days'
)
SELECT
  count(*) AS total_attempts,
  count(DISTINCT user_id) AS distinct_users,
  count(*) FILTER (WHERE phoneme_scores IS NOT NULL AND phoneme_scores::text != 'null')
    AS attempts_with_phoneme_data
FROM recent;
```

Pass condition: `distinct_users ≥ 5` AND `attempts_with_phoneme_data ≥ 50`. If yes, the flag will produce real recommendations for users who hit the eligibility bar. If no, recommendations will silently never show — which is safe, but defeats the point of flipping.

### Recommended flip — Day 1

- **Per-user first** (Chau + 1-2 admins). UPDATE `enabled_user_ids` rather than `is_enabled`.
- 24h soak. Read Sentry breadcrumbs filtered to `category:recommendation`. Confirm `result:served` events appear and `result:no_signal` is the dominant outcome (expected — most users won't qualify).
- If clean, expand to global on Day 2.

### Rollback

```sql
UPDATE public.feature_flags
SET is_enabled = false, enabled_user_ids = ARRAY[]::uuid[]
WHERE flag_key = 'phoneme_drill_recommendations_enabled';
```

Effect is immediate (next page mount). The card disappears; no in-flight requests to clean up.

---

## Flag 2 — `practice_recommendations_enabled`

### What it gates

Two surfaces:
1. `src/components/home/PracticeRecommendationCard.tsx` — Home card "Mercy gợi ý: hôm nay luyện X".
2. Mercy chat — when the user asks "tôi nên luyện gì?" the chat layer fetches and inlines a recommendation card.

### Code path

```
PracticeRecommendationCard.useEffect
 → getRecommendation(userId)
   → loadWeeklyCached(userId)        # sessionStorage 10-min TTL
     → getWeeklyProgressSummary(userId)
       → SELECT * FROM speech_attempts WHERE user_id = ? AND attempted_at > now() - interval '7 days'
   → readRecommendationState(userId) # localStorage cooldown
   → selectRecommendation(RECOMMENDATION_RULES, ctx, state)
     → walk priority-ordered rules:
       1. weak_phoneme_drill   (≥ 5 attempts, avg < 70, has pack)
       2. build_consistency    (gap detection)
       3. new_territory        (haven't tried room kind X)
       4. mock_interview_prep  (level + signal mix)
       5. reading_aloud_focus  (improving but stuck)
       6. warm_up              (gentlest fallback)
   → first non-cooldown match wins → render CTA
```

### Data-readiness SQL (Section B)

```sql
-- Same WeeklyProgress backing data PLUS room/path activity for the
-- consistency + new-territory rules.
WITH weekly_speech AS (
  SELECT user_id, count(*) AS speech_count
  FROM public.speech_attempts
  WHERE attempted_at > now() - interval '7 days'
  GROUP BY user_id
),
weekly_rooms AS (
  SELECT user_id, count(DISTINCT room_id) AS distinct_rooms
  FROM public.room_progress
  WHERE last_visited_at > now() - interval '14 days'
  GROUP BY user_id
)
SELECT
  count(*) FILTER (WHERE ws.speech_count >= 5)        AS users_eligible_weak_phoneme,
  count(*) FILTER (WHERE wr.distinct_rooms >= 3)      AS users_eligible_consistency,
  count(*)                                            AS total_active_users
FROM weekly_speech ws
FULL OUTER JOIN weekly_rooms wr USING (user_id);
```

Pass condition: `users_eligible_weak_phoneme ≥ 3` OR `users_eligible_consistency ≥ 5`. If both are zero, the rules engine returns null for everyone — flag is a no-op.

### Risk vs Flag 1

Wider blast radius (6 rule types, two surfaces). The Mercy chat surface specifically can surprise users who weren't expecting an inline card under Mercy's reply. Recommend: flip the Home card surface FIRST by leaving the chat-side feature flag check in place, OR ship a chat-surface kill switch (separate flag) before Day 3 flip.

### Recommended flip — Day 3 (after 48h on Flag 1 with no incidents)

- Per-user first, then global.
- Watch breadcrumbs for `recommendation_type` distribution. If only `warm_up` ever fires, the rules engine isn't seeing enough signal — investigate before global.

### Rollback

```sql
UPDATE public.feature_flags
SET is_enabled = false, enabled_user_ids = ARRAY[]::uuid[]
WHERE flag_key = 'practice_recommendations_enabled';
```

---

## Flag 3 — `pronunciation_streaming_enabled` — **DO NOT FLIP**

### Hard blocker

```
$ supabase functions list --project-ref buemdfxyhxunzpgdoqin | grep stream
(no rows)
$ supabase functions list --project-ref buemdfxyhxunzpgdoqin | grep azure-phoneme
3820166a-... | azure-phoneme | azure-phoneme | ACTIVE | 22 | 2026-04-27 05:16:03
```

`azure-phoneme-stream/` exists in the repo (`supabase/functions/azure-phoneme-stream/index.ts`, complete with WebSocket handling and a 22-test protocol suite at `supabase/functions/azure-phoneme-stream/__tests__/protocol.test.ts`) but **was never deployed**. Flipping the flag would point every paying user's MercySpeakTab at a non-existent `/functions/v1/azure-phoneme-stream` → connection error → fallback to post-recording. The fallback works, but the noise is wasteful.

### Pre-flip checklist (Day 7 earliest)

1. `supabase functions deploy azure-phoneme-stream --project-ref buemdfxyhxunzpgdoqin`
2. Verify with `wscat` against the deployed endpoint using a real JWT (see runbook).
3. Test one round-trip from MercySpeakTab in dev with `pronunciation_streaming_enabled` = on for Chau only.
4. Confirm `breadcrumbStreamingPronunciation` events show `start → first_partial → stop` cleanly (no `fallback` or `error`).
5. Watch Azure cost dashboard for the day — streaming runs more API passes per recording.
6. Per-user expansion: 5 → 25 → global, 24h between steps.

### Why not ship the deploy + flip together?

A streaming WS deploy needs a soak window separate from the flag flip. Combining them fuses two failure modes (deploy regression vs flag-rollout regression) and makes rollback ambiguous.

### Rollback

```sql
UPDATE public.feature_flags
SET is_enabled = false, enabled_user_ids = ARRAY[]::uuid[]
WHERE flag_key = 'pronunciation_streaming_enabled';
```

The MercySpeakTab `useStreamingPronunciation` hook is no-op when `enabled === false`; users immediately revert to post-recording flow on next attempt.

---

## Phased rollout summary

| Day | Action | Pre-conditions |
|---|---|---|
| **Day 1** (this week) | Flip `phoneme_drill_recommendations_enabled` for Chau + 1-2 admins | SQL §A returned `distinct_users ≥ 5` |
| **Day 2** | Expand drill flag to global | 24h soak clean (no Sentry warnings, no error breadcrumbs) |
| **Day 3** | Flip `practice_recommendations_enabled` for Chau + admins | Drill flag globally on for 48h with no incidents; SQL §B passed |
| **Day 4** | Expand practice flag to global | 24h soak clean; recommendation_type distribution sensible |
| **Day 7** | Deploy `azure-phoneme-stream` edge fn | Practice flag globally on for 4 days, no streaming-related Sentry noise from existing fallback path |
| **Day 8** | Verify streaming with `wscat`, test in dev | Function deployed, JWT round-trips work |
| **Day 9** | Flip `pronunciation_streaming_enabled` for Chau only | Manual smoke-test passed |
| **Day 11** | Expand streaming to 5-user pilot | 48h Chau-only with no fallback events |
| **Day 14** | Global streaming | 5-user pilot clean for 72h |

If any flag flip generates a `level: warning` breadcrumb at category `recommendation` or `speak.streaming` — pause the rollout, investigate, decide before continuing.

---

## What this PR does

- Adds `breadcrumbRecommendation` + `breadcrumbStreamingPronunciation` helpers in `src/lib/monitoring/breadcrumbs.ts`.
- Wires those breadcrumbs into the three entry points (`PracticeRecommendationCard`, `RecommendedDrillCard`, `useStreamingPronunciation`).
- Documents this report and the operational runbook.
- **Does NOT touch any flag value.** Chau makes the actual flips on the Supabase Dashboard following the schedule above.
