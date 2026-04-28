# Recommendation flag runbook

Operational reference for flipping the three recommendation flags. Pair
with `reports/recommendations-verification-2026-04-27.md` for the
*why* and the soak schedule. This file is the *how*.

## Common: where to flip

Supabase Dashboard → Database → Tables → `feature_flags`. Find the row
by `flag_key` and edit either:

- `is_enabled` (boolean) — global on/off.
- `enabled_user_ids` (uuid[]) — per-user override; users in this list
  get the flag ON regardless of `is_enabled`.

The resolution order is documented in `src/hooks/useFeatureFlag.ts` and
identical for all three flags: per-user list wins, then global, then
OFF.

## Pre-flip checklist (every flip)

1. Open Sentry → filter by `category:recommendation` (for the two
   recommendation flags) or `category:speak.streaming` (for the
   streaming flag). Confirm the previous 24h shows ≤ 1 warning per
   surface. If you see a flood of warnings, **don't flip** — investigate.
2. Confirm `feature_flags.flag_key` row exists. (All three are seeded
   already; if a row is missing, the migration didn't apply — re-run
   `supabase db push --linked`.)
3. For per-user flips: get the user's `auth.users.id` UUID (visible
   from Supabase Dashboard → Authentication → Users).

## Flip 1 — `phoneme_drill_recommendations_enabled`

### Per-user (Day 1)

```sql
UPDATE public.feature_flags
SET enabled_user_ids = ARRAY['<chau-uuid>'::uuid, '<admin-uuid>'::uuid]
WHERE flag_key = 'phoneme_drill_recommendations_enabled';
```

### Smoke test (do this from a real session)

1. Sign in as Chau. Navigate to Home (/).
2. Have ≥ 5 historic speech_attempts on a single phoneme with avg < 70.
   Quickest way: open `/practice/phoneme/th` and intentionally fail 6
   takes, OR run this SQL to backfill for testing:
   ```sql
   -- Replace <chau-uuid>; this seeds 6 weak /θ/ attempts.
   INSERT INTO public.speech_attempts (user_id, room_id, line_id, target_text,
     transcript, match_score, overall_score, word_scores, provider,
     phoneme_scores, attempted_at)
   SELECT '<chau-uuid>', 'test_th_drill', concat('line_', n)::text,
     'I think this is the third thing.',
     'I sink sis is da turd sing.', 0.45, 45, '[]'::jsonb, 'cloud',
     '[{"Phoneme":"th","AccuracyScore":42}]'::jsonb,
     now() - (n || ' minutes')::interval
   FROM generate_series(1, 6) n;
   ```
3. Reload Home. The card "Bạn có thể luyện /θ/ trong 5 phút" should
   render below the existing welcome panel.
4. Tap "Bắt đầu". Confirm navigation to `/practice/phoneme/th?src=home`.
5. Open Sentry. Confirm a breadcrumb fired:
   `category:recommendation message:"recommendation home_drill served"
   data.recommendation_id="phoneme_drill:th"`.

### Expected behavior

- Card visible only when the picker found a qualifying phoneme.
- After completing a drill (or 24h passes), the card may show a
  *different* phoneme — the cooldown is per-phoneme, not global.
- Card never shows for users without speech_attempts.

### Rollback

```sql
UPDATE public.feature_flags
SET is_enabled = false, enabled_user_ids = ARRAY[]::uuid[]
WHERE flag_key = 'phoneme_drill_recommendations_enabled';
```

Effect is immediate on next mount. There is no in-flight cleanup —
the card simply stops rendering. Existing drill sessions in
`/practice/phoneme/<slug>` continue normally; the flag only gates the
*recommendation*, not the drill page itself.

## Flip 2 — `practice_recommendations_enabled`

### Per-user (Day 3)

```sql
UPDATE public.feature_flags
SET enabled_user_ids = ARRAY['<chau-uuid>'::uuid]
WHERE flag_key = 'practice_recommendations_enabled';
```

### Smoke test

1. Sign in as Chau. Navigate to Home.
2. The PracticeRecommendationCard should render below the welcome
   panel (above the drill card if both flags are on).
3. The Vietnamese title should describe the rule that fired (e.g.
   "Hôm nay luyện vần /θ/", "Giữ nhịp luyện đều", "Thử phòng mới
   chưa bao giờ vào").
4. Tap "Bắt đầu". The CTA target depends on rule:
   - room id → navigates to `/room/<id>`
   - path starting with `/` → navigates verbatim
5. Sentry breadcrumb: `category:recommendation message:"recommendation
   home_practice served" data.recommendation_type=<rule_type>`.

### Expected behavior

- Same recommendation does NOT reappear within 4 hours
  (`RECOMMENDATION_COOLDOWN_MS` in `practiceRecommendations.ts`).
- All eligible rules on cooldown → card hides (returns null
  deliberately rather than falling back to a stale suggestion).
- Anonymous users → card hides.
- Users with zero `speech_attempts` rows in the last 7 days → card
  most likely hides (only the `warm_up` rule has no signal
  prerequisite).

### Mercy chat surface

When this flag is ON, asking Mercy "tôi nên luyện gì?" inlines a
recommendation card under her reply. To smoke-test:

1. Open MercyGuidePanel → Speak tab → switch to chat mode (the
   in-tab message composer).
2. Type "tôi nên luyện gì hôm nay?" and send.
3. Mercy's reply should be followed by a card matching the Home one
   (same recommendation rule, same id, subject to the same cooldown).

### Rollback

```sql
UPDATE public.feature_flags
SET is_enabled = false, enabled_user_ids = ARRAY[]::uuid[]
WHERE flag_key = 'practice_recommendations_enabled';
```

## Flip 3 — `pronunciation_streaming_enabled` — DO NOT FLIP YET

**Blocker: `azure-phoneme-stream` edge function is NOT deployed to
production.** See `reports/recommendations-verification-2026-04-27.md`
§ "Flag 3" for the full story.

### Pre-flip deploy + verify (Day 7-8)

```bash
supabase functions deploy azure-phoneme-stream \
  --project-ref buemdfxyhxunzpgdoqin

# Smoke test the WebSocket directly. Get a JWT from the browser:
#   open devtools console, run:
#   (await window.__MB_JWT__()).slice(0, 40) + '…'
# Then in a terminal:
JWT="<paste full JWT>"
PROJECT_REF="buemdfxyhxunzpgdoqin"
wscat -c "wss://${PROJECT_REF}.supabase.co/functions/v1/azure-phoneme-stream?token=${JWT}"

# Expected: connection opens. Send `{"type":"hello","reference_text":"hello world"}`.
# Server should respond with a `ready` frame. Type Ctrl-C to disconnect.
```

If `wscat` fails to connect (HTTP 404, 401, or connection refused):
**don't flip the flag**. Investigate the deploy first.

### Per-user (Day 9)

```sql
UPDATE public.feature_flags
SET enabled_user_ids = ARRAY['<chau-uuid>'::uuid]
WHERE flag_key = 'pronunciation_streaming_enabled';
```

### Smoke test

1. Sign in as Chau. Open any room. Enter Speak mode.
2. Record a short attempt. The streaming path should fire:
   - Sentry breadcrumb `category:speak.streaming message:"streaming
     pronunciation start"` followed by `first_partial` then `stop`.
   - Live partial scores should appear in the UI as you speak (rather
     than only after release).
3. If you see breadcrumb `phase:fallback` instead, the streaming path
   bailed out — check the `reason` field. Common reasons:
   `worklet_load_failed`, `no_audio_context`, `no_token`, `disabled`.
4. Cost check: open the AzureSpeechCost dashboard
   (`/admin/cost-monitoring`). One streaming session uses more API
   passes than one batch attempt — confirm the per-user 24h spend is
   within budget.

### Rollback

```sql
UPDATE public.feature_flags
SET is_enabled = false, enabled_user_ids = ARRAY[]::uuid[]
WHERE flag_key = 'pronunciation_streaming_enabled';
```

The MercySpeakTab hook is no-op when `enabled === false` — users
revert to the post-recording flow immediately on the next attempt.

## Monitoring (all three flags)

After every flip, watch these for 24 hours:

- **Sentry** — `category:recommendation OR category:speak.streaming`,
  `level:warning OR level:error`. Pause rollout if either appears
  more than 1× per surface per hour.
- **`/admin/cost-monitoring`** — for the streaming flag, confirm
  Azure Speech daily spend stays under the existing
  `AZURE_SPEECH_DAILY_CAP_USD` cap.
- **`/admin/latency`** — for the practice flag, confirm `ai-chat.total`
  P95 hasn't crept up (the chat surface adds an extra DB read per
  Mercy reply).

## Auto-incident on bad flips

The SLO infrastructure (PR #196) will auto-open an incident if a flag
flip causes the `ai_chat_p99` SLO to enter `critical` state. That
incident is your hard signal to roll back, not a soft "consider
reverting." Look at `/admin/slo` after every flip.
