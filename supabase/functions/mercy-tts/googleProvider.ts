export type GoogleTtsLanguage = "en" | "vi" | "fr" | "zh" | "de" | "ja" | "ko" | "es" | string;

export interface GoogleTtsRequest {
  text: string;
  language: GoogleTtsLanguage;
  apiKey: string;
  fetchImpl?: typeof fetch;
}

export interface GoogleTtsSuccess {
  ok: true;
  audio: Uint8Array;
  upstreamStatus: number;
}

export interface GoogleTtsFailure {
  ok: false;
  error: string;
  upstreamStatus?: number;
}

export type GoogleTtsResult = GoogleTtsSuccess | GoogleTtsFailure;

const GOOGLE_TTS_ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize";

const GOOGLE_LANGUAGE_CODE: Record<string, string> = {
  en: "en-US",
  vi: "vi-VN",
  fr: "fr-FR",
  zh: "cmn-CN",
  de: "de-DE",
  ja: "ja-JP",
  ko: "ko-KR",
  es: "es-ES",
};

function normalizeLanguage(language: GoogleTtsLanguage): string {
  const normalized = String(language || "en").trim().toLowerCase();
  if (!normalized) return "en";
  return normalized.split("-")[0] || "en";
}

export function googleLanguageCodeFor(language: GoogleTtsLanguage): string {
  return GOOGLE_LANGUAGE_CODE[normalizeLanguage(language)] ?? "en-US";
}

export function buildGoogleTtsPayload(text: string, language: GoogleTtsLanguage): Record<string, unknown> {
  return {
    input: { text },
    voice: {
      languageCode: googleLanguageCodeFor(language),
      ssmlGender: "FEMALE",
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: 0.92,
      pitch: 0,
    },
  };
}

export function buildGoogleTtsUrl(apiKey: string): string {
  return `${GOOGLE_TTS_ENDPOINT}?key=${encodeURIComponent(apiKey)}`;
}

function decodeBase64Audio(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function fetchGoogleTtsAudio({
  text,
  language,
  apiKey,
  fetchImpl = fetch,
}: GoogleTtsRequest): Promise<GoogleTtsResult> {
  const safeText = String(text ?? "").trim();
  const safeKey = String(apiKey ?? "").trim();
  if (!safeText) return { ok: false, error: "text_required" };
  if (!safeKey) return { ok: false, error: "api_key_required" };

  const response = await fetchImpl(buildGoogleTtsUrl(safeKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildGoogleTtsPayload(safeText, language)),
  });

  if (!response.ok) {
    return { ok: false, error: "upstream_failed", upstreamStatus: response.status };
  }

  const body = await response.json().catch(() => null) as { audioContent?: unknown } | null;
  const audioContent = typeof body?.audioContent === "string" ? body.audioContent : "";
  if (!audioContent) {
    return { ok: false, error: "missing_audio_content", upstreamStatus: response.status };
  }

  return {
    ok: true,
    audio: decodeBase64Audio(audioContent),
    upstreamStatus: response.status,
  };
}
