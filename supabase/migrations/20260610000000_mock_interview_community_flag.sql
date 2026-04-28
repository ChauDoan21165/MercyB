-- Feature flag: mock_interview_community_enabled
--
-- Gates the Phase 2 community-prompts integration into the mock
-- interview room (src/pages/mock-interview/MockInterviewRoom.tsx).
-- When OFF, the room behaves exactly as it does today; when ON, a
-- pre-flight panel offers a hardcoded/community ratio slider, the
-- active prompt shows an attribution badge when community-sourced,
-- and a post-interview CTA invites the user to share a question with
-- the community.
--
-- Default OFF globally; flipped per cohort by adding user IDs to
-- enabled_user_ids via the admin UI or SQL Editor. Resolution order
-- enforced by src/hooks/useFeatureFlag.ts.
--
-- Reversibility:
--   DELETE FROM public.feature_flags
--   WHERE flag_key = 'mock_interview_community_enabled';

INSERT INTO public.feature_flags (flag_key, is_enabled, enabled_user_ids, description)
VALUES (
  'mock_interview_community_enabled',
  false,
  ARRAY[]::uuid[],
  'Phase 2 — show community-curated prompts in MockInterviewRoom with a hardcoded/community ratio slider, attribution badge, and post-interview share CTA. Off by default; flipped per cohort by admin.'
)
ON CONFLICT (flag_key) DO NOTHING;
