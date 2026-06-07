// PATH: supabase/functions/mercy-tts/index.ts
//
// Cloud text-to-speech for Teacher Mercy. Azure Cognitive Services TTS is the
// PRIMARY provider when azure_tts is enabled and configured (native VN neural
// voice; shares the AZURE_SPEECH_* secrets that already power VN pronunciation).
// ElevenLabs remains the fallback when elevenlabs_tts is enabled and configured,
// so a single provider failure cannot 502. Browser TTS stays as the client
// fallback path inside src/lib/teacher-mercy/voiceEngine.ts.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  trackLatency,
  trackLatencyMs,
} from "../_shared/latencyTelemetry.ts";
import { handleMercyTtsRequest } from "./core.ts";

serve((req) => handleMercyTtsRequest(req, {
  createClient,
  env: (key) => Deno.env.get(key) ?? undefined,
  fetcher: fetch,
  trackLatency,
  trackLatencyMs,
}));
