import { describe, expect, it, vi } from "vitest";
import {
  buildGoogleTtsRequestBody,
  buildGoogleTtsUrl,
  googleLanguageCodeFor,
  synthesizeGoogleTts,
} from "../googleProvider";

describe("mercy-tts Google provider", () => {
  it("maps tutor target languages to Google Cloud TTS languageCode values", () => {
    expect(googleLanguageCodeFor("en")).toBe("en-US");
    expect(googleLanguageCodeFor("fr")).toBe("fr-FR");
    expect(googleLanguageCodeFor("zh")).toBe("cmn-CN");
    expect(googleLanguageCodeFor("de")).toBe("de-DE");
    expect(googleLanguageCodeFor("ja")).toBe("ja-JP");
    expect(googleLanguageCodeFor("ko")).toBe("ko-KR");
    expect(googleLanguageCodeFor("es")).toBe("es-ES");
    expect(googleLanguageCodeFor("vi")).toBe("vi-VN");
  });

  it("builds the corrected-text request shape", () => {
    expect(buildGoogleTtsRequestBody("What do you do after that?", "en")).toEqual({
      input: { text: "What do you do after that?" },
      voice: { languageCode: "en-US" },
      audioConfig: { audioEncoding: "MP3" },
    });
  });

  it("sends the API key server-side in the URL", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ audioContent: "abc" })));

    await synthesizeGoogleTts(fetcher as unknown as typeof fetch, "secret key", "我昨天去了商店。", "zh");

    expect(fetcher).toHaveBeenCalledWith(buildGoogleTtsUrl("secret key"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        input: { text: "我昨天去了商店。" },
        voice: { languageCode: "cmn-CN" },
        audioConfig: { audioEncoding: "MP3" },
      }),
    });
  });
});
