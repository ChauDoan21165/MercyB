export const GOOGLE_TTS_BASE = "https://texttospeech.googleapis.com/v1/text:synthesize";

export interface GoogleTtsRequestBody {
  input: { text: string };
  voice: { languageCode: string };
  audioConfig: { audioEncoding: "MP3" };
}

export function googleLanguageCodeFor(language: string): string {
  const normalized = String(language || "en").trim().toLowerCase();
  switch (normalized) {
    case "fr":
      return "fr-FR";
    case "zh":
    case "zh-cn":
    case "cmn":
    case "cmn-cn":
      return "cmn-CN";
    case "de":
      return "de-DE";
    case "ja":
      return "ja-JP";
    case "ko":
      return "ko-KR";
    case "es":
      return "es-ES";
    case "vi":
      return "vi-VN";
    case "en":
    default:
      return "en-US";
  }
}

export function buildGoogleTtsRequestBody(text: string, language: string): GoogleTtsRequestBody {
  return {
    input: { text },
    voice: { languageCode: googleLanguageCodeFor(language) },
    audioConfig: { audioEncoding: "MP3" },
  };
}

export function buildGoogleTtsUrl(apiKey: string): string {
  return `${GOOGLE_TTS_BASE}?key=${encodeURIComponent(apiKey)}`;
}

export async function synthesizeGoogleTts(
  fetcher: typeof fetch,
  apiKey: string,
  text: string,
  language: string,
): Promise<Response> {
  return fetcher(buildGoogleTtsUrl(apiKey), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(buildGoogleTtsRequestBody(text, language)),
  });
}
