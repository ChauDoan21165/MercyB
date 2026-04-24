-- Seeds the behavior-tracking feature flag row.
--
-- Gates two writers added in fix/session-tracking (2026-04-28):
--   • src/services/userSessions.ts     → user_sessions
--   • src/services/userBehavior.ts     → user_behavior_tracking
--
-- Background: both tables were empty in production despite 122 users
-- because useSessionManagement + useBehaviorTracking hooks existed but
-- were never imported. Admin analytics (DAU, funnel, popular rooms by
-- interaction) read from those tables so every chart showed zeros. Fix
-- wires the writes through lean services and gates them on this flag.
--
-- Default ON globally so the fix actually takes effect on deploy. If
-- anything misbehaves (excess writes, RLS errors, perf issue) flip
-- is_enabled=false via SQL Editor — all writes short-circuit to no-ops
-- without a code rollback.
--
-- Resolution order is enforced by:
--   • src/hooks/useFeatureFlag.ts
--   • src/lib/featureFlags.ts
--   • src/services/behaviorTrackingFlag.ts
-- Keep all four in sync if semantics change.

INSERT INTO public.feature_flags (flag_key, is_enabled, enabled_user_ids, description)
VALUES (
  'behaviorTrackingEnabled',
  true,
  ARRAY[]::uuid[],
  'Gates writes to user_sessions (via AuthProvider sign-in + 5-min heartbeat) and user_behavior_tracking (via RoomRenderer room visits + keyword taps). Flip is_enabled=false to kill all tracker writes without a redeploy.'
)
ON CONFLICT (flag_key) DO NOTHING;
