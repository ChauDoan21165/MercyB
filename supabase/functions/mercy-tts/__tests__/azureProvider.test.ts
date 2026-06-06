import { describe, expect, it, vi } from "vitest";
import {
  AZURE_OUTPUT_FORMAT,
  azureVoiceFor,
  buildAzureSsml,
  buildAzureTtsUrl,
  escapeSsml,
  synthesizeAzureTts,
} from "../azureProvider";

describe("mercy-tts Azure provider", () => {
  it("maps tutor target languages to Azure neural voices", () => {
    expect(azureVoiceFor("en")).toEqual({ locale: "en-US", name: "en-US-AvaMultilingualNeural" });
    expect(azureVoiceFor("vi")).toEqual({ locale: "vi-VN", name: "vi-VN-HoaiMyNeural" });
    expect(azureVoiceFor("fr").name).toBe("fr-FR-DeniseNeural");
    expect(azureVoiceFor("zh").name).toBe("zh-CN-XiaoxiaoNeural");
    expect(azureVoiceFor("ja").name).toBe("ja-JP-NanamiNeural");
  });

  it("normalizes locale-tagged and unknown languages to a safe voice", () => {
    expect(azureVoiceFor("en-US").name).toBe("en-US-AvaMultilingualNeural");
    expect(azureVoiceFor("vi-VN").name).toBe("vi-VN-HoaiMyNeural");
    expect(azureVoiceFor("tlh")).toEqual({ locale: "en-US", name: "en-US-AvaMultilingualNeural" });
  });

  it("escapes XML-significant characters in the spoken text", () => {
    expect(escapeSsml(`Tom & Jerry said "<hi>"`)).toBe(
      "Tom &amp; Jerry said &quot;&lt;hi&gt;&quot;",
    );
  });

  it("wraps text in an SSML envelope addressed to the language voice", () => {
    expect(buildAzureSsml("Xin chào.", azureVoiceFor("vi"))).toBe(
      "<speak version='1.0' xml:lang='vi-VN'>" +
        "<voice xml:lang='vi-VN' name='vi-VN-HoaiMyNeural'>Xin chào.</voice></speak>",
    );
  });

  it("posts SSML with the subscription-key, mp3 output, and region endpoint", async () => {
    const fetcher = vi.fn(async () => new Response(new Uint8Array([1, 2, 3])));

    await synthesizeAzureTts(fetcher as unknown as typeof fetch, "secret key", "test-region", "Hello.", "en");

    expect(fetcher).toHaveBeenCalledWith(buildAzureTtsUrl("test-region"), {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": "secret key",
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": AZURE_OUTPUT_FORMAT,
        "User-Agent": "mercyblade-tts",
      },
      body: buildAzureSsml("Hello.", azureVoiceFor("en")),
    });
    expect(buildAzureTtsUrl("test-region")).toBe(
      "https://test-region.tts.speech.microsoft.com/cognitiveservices/v1",
    );
    expect(AZURE_OUTPUT_FORMAT).toMatch(/mp3$/);
  });
});
