-- Seeds the phoneme drill recommendation flag.
--
-- Gates the Home `RecommendedDrillCard` (component at
-- src/components/home/RecommendedDrillCard.tsx). When ON, users with a
-- weak phoneme (5+ attempts, avg < 70) AND a hand-curated drill pack
-- see a 5-minute drill CTA on Home. When OFF, the card never renders.
--
-- Default OFF — same pattern as the practice recommendations flag
-- (PR #189). Flip to true via SQL Editor when ready to surface to
-- users; the heatmap CTA on /progress is NOT gated by this flag and
-- will keep working for users who navigate there manually.
--
-- ON CONFLICT DO NOTHING so reruns are safe.

INSERT INTO public.feature_flags (flag_key, is_enabled, enabled_user_ids, description)
VALUES (
  'phoneme_drill_recommendations_enabled',
  false,
  ARRAY[]::uuid[],
  'Show the targeted phoneme-drill recommendation card on Home.'
)
ON CONFLICT (flag_key) DO NOTHING;
