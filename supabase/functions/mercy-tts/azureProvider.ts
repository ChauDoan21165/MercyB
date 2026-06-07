// PATH: supabase/functions/mercy-tts/azureProvider.ts
//
// Azure Cognitive Services Text-to-Speech provider for Teacher Mercy.
// Azure is the PRIMARY cloud voice (native Vietnamese neural voice; already
// powers VN pronunciation). ElevenLabs stays as the fallback inside index.ts.
//
// Auth: subscription key + region (Deno.env AZURE_SPEECH_KEY / AZURE_SPEECH_REGION).
// Endpoint: https://<region>.tts.speech.microsoft.com/cognitiveservices/v1
// Body: SSML. Output is MP3 so the response data URL stays `audio/mpeg`,
// preserving the existing client contract.

export interface AzureVoice {
  /** BCP-47 locale used in both the SSML envelope and the <voice> tag. */
  locale: string;
  /** Azure neural voice short name. */
  name: string;
}

// Female neural voices, one per language the function accepts (see
// normalizeLanguage in index.ts). `en` and `vi` are the only voices a prod
// surface calls today; the rest mirror the tutor target languages so the
// mapping never falls through to the wrong locale.
const AZURE_VOICE_BY_LANGUAGE: Record<string, AzureVoice> = {
  en: { locale: "en-US", name: "en-US-AvaMultilingualNeural" },
  vi: { locale: "vi-VN", name: "vi-VN-HoaiMyNeural" },
  fr: { locale: "fr-FR", name: "fr-FR-DeniseNeural" },
  zh: { locale: "zh-CN", name: "zh-CN-XiaoxiaoNeural" },
  de: { locale: "de-DE", name: "de-DE-KatjaNeural" },
  ja: { locale: "ja-JP", name: "ja-JP-NanamiNeural" },
  ko: { locale: "ko-KR", name: "ko-KR-SunHiNeural" },
  es: { locale: "es-ES", name: "es-ES-ElviraNeural" },
};

// MP3 so the resulting data URL keeps the `data:audio/mpeg;base64,…` shape the
// browser <audio> consumers already expect. Do not switch to a WAV/Opus format
// without also changing audioDataUrl() in index.ts and the client mime type.
export const AZURE_OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";

export function azureVoiceFor(language: string): AzureVoice {
  const base = String(language || "en").trim().toLowerCase().split("-")[0];
  return AZURE_VOICE_BY_LANGUAGE[base] ?? AZURE_VOICE_BY_LANGUAGE.en;
}

/** SSML-escape user text before embedding it in the <voice> element. */
export function escapeSsml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildAzureSsml(text: string, voice: AzureVoice): string {
  return (
    `<speak version='1.0' xml:lang='${voice.locale}'>` +
    `<voice xml:lang='${voice.locale}' name='${voice.name}'>` +
    `${escapeSsml(text)}` +
    `</voice></speak>`
  );
}

export function buildAzureTtsUrl(region: string): string {
  return `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
}

export async function synthesizeAzureTts(
  fetcher: typeof fetch,
  subscriptionKey: string,
  region: string,
  text: string,
  language: string,
  signal?: AbortSignal,
): Promise<Response> {
  const voice = azureVoiceFor(language);
  return fetcher(buildAzureTtsUrl(region), {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": AZURE_OUTPUT_FORMAT,
      // Azure rejects requests without a User-Agent.
      "User-Agent": "mercyblade-tts",
    },
    body: buildAzureSsml(text, voice),
    signal,
  });
}
