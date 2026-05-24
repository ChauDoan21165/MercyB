import { describe, expect, it, vi } from "vitest";

import {
  buildGoogleTtsPayload,
  buildGoogleTtsUrl,
  fetchGoogleTtsAudio,
  googleLanguageCodeFor,
} from "../googleProvider.ts";

describe("googleProvider request shape", () => {
  it("maps tutor target languages to Google TTS language codes", () => {
    expect(googleLanguageCodeFor("en")).toBe("en-US");
    expect(googleLanguageCodeFor("fr")).toBe("fr-FR");
    expect(googleLanguageCodeFor("zh")).toBe("cmn-CN");
    expect(googleLanguageCodeFor("vi")).toBe("vi-VN");
  });

  it("builds the Google synthesize payload without provider secrets", () => {
    const payload = buildGoogleTtsPayload("Bonjour.", "fr");

    expect(payload).toEqual({
      input: { text: "Bonjour." },
      voice: {
        languageCode: "fr-FR",
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 0.92,
        pitch: 0,
      },
    });
    expect(JSON.stringify(payload)).not.toContain("secret");
  });

  it("keeps the API key in the request URL only", async () => {
    const fetchImpl = vi.fn(async (_url: string, _init: RequestInit) =>
      new Response(JSON.stringify({ audioContent: btoa("mp3-bytes") }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as unknown as typeof fetch;

    const result = await fetchGoogleTtsAudio({
      text: "Mercy reads corrected text.",
      language: "en",
      apiKey: "test-secret-key",
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(buildGoogleTtsUrl("test-secret-key"));
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(String(init.body)).not.toContain("test-secret-key");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Array.from(result.audio)).toEqual(Array.from(new TextEncoder().encode("mp3-bytes")));
    }
  });

  it("returns a structured failure on upstream errors", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 403 })) as unknown as typeof fetch;

    const result = await fetchGoogleTtsAudio({
      text: "Mercy text.",
      language: "en",
      apiKey: "test-secret-key",
      fetchImpl,
    });

    expect(result).toEqual({ ok: false, error: "upstream_failed", upstreamStatus: 403 });
  });
});
