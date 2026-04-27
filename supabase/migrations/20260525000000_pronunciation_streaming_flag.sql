-- Streaming pronunciation feedback (PR feat/pronunciation-streaming).
--
-- Seeds the `pronunciation_streaming_enabled` feature flag in the OFF
-- position. Chau flips it on (per user_id or globally) after the WebSocket
-- + AudioWorklet path is verified end-to-end against the staging Azure
-- region. The MercySpeakTab reads this flag at mount time; when off the
-- existing post-recording flow is unchanged.
--
-- Reversibility:
--   DELETE FROM public.feature_flags WHERE flag_key = 'pronunciation_streaming_enabled';

INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES (
  'pronunciation_streaming_enabled',
  false,
  'Real-time pronunciation feedback over WebSocket via azure-phoneme-stream edge fn. OFF = post-recording flow only. ON = MercySpeakTab opens a streaming session per attempt; falls back to post-recording on connection error or first-partial timeout. Wire-up dark-shipped 2026-04-27.'
)
ON CONFLICT (flag_key) DO NOTHING;
