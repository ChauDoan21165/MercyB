// src/lib/mercyVoice.ts
//
// Cloud-TTS helper used by both the React hook (src/hooks/useMercyVoice.ts)
// and imperative call sites (src/lib/pronunciation/tts.ts). Single
// responsibility: ask the mercy-tts edge function for a playable
// audio URL.
//
// Returns null on any failure — flag off, no API key, daily cap hit,
// network blip, missing voice ID. Callers are expected to fall back
// to the existing browser-TTS path on null. Never throws on the
// happy path; never lets the speaker go silent.

import { supabase } from "@/lib/supabaseClient";
import {
  voiceIdFor,
  isVoiceConfigured,
  type MercyLanguage,
} from "@/config/mercyVoices";

interface FetchCloudTtsArgs {
  text: string;
  language: MercyLanguage;
  /** Override the language's configured voice ID. */
  voiceIdOverride?: string;
}

export interface CloudTtsUrl {
  audioUrl: string;
  cached: boolean;
}

export async function fetchCloudTtsUrl(
  args: FetchCloudTtsArgs,
): Promise<CloudTtsUrl | null> {
  const text = String(args?.text ?? "").trim();
  if (!text) return null;

  const language: MercyLanguage = args.language === "en" ? "en" : "vi";
  const voice_id = args.voiceIdOverride || voiceIdFor(language);

  if (!args.voiceIdOverride && !isVoiceConfigured(language)) {
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke<{
      audioUrl?: string;
      cached?: boolean;
      code?: string;
      error?: string;
    }>("mercy-tts", {
      body: { text, voice_id, language },
    });
    if (error || !data?.audioUrl) return null;
    return { audioUrl: data.audioUrl, cached: !!data.cached };
  } catch (err) {
    console.warn("[mercyVoice] cloud request failed", err);
    return null;
  }
}
