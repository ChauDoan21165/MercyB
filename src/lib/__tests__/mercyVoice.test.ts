import { beforeEach, describe, expect, it, vi } from "vitest";

const { invoke } = vi.hoisted(() => ({
  invoke: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    functions: {
      invoke,
    },
  },
}));

import { fetchCloudTtsUrl } from "@/lib/mercyVoice";

describe("fetchCloudTtsUrl", () => {
  beforeEach(() => {
    invoke.mockReset();
  });

  it("sends only text, language, and voice id to the server-side TTS function", async () => {
    invoke.mockResolvedValue({
      data: {
        audioUrl: "data:audio/mpeg;base64,AAAA",
        cached: false,
        provider: "azure",
      },
      error: null,
    });

    const result = await fetchCloudTtsUrl({ text: "Bonjour.", language: "fr" });

    expect(result).toMatchObject({
      audioUrl: "data:audio/mpeg;base64,AAAA",
      cached: false,
      provider: "azure",
    });
    expect(invoke).toHaveBeenCalledWith("mercy-tts", {
      body: {
        text: "Bonjour.",
        language: "fr",
        voice_id: expect.any(String),
      },
    });
    expect(JSON.stringify(invoke.mock.calls)).not.toMatch(/GOOGLE|ELEVEN|API_KEY|secret/i);
  });

  it("extracts English from bilingual display text before invoking cloud TTS", async () => {
    invoke.mockResolvedValue({
      data: {
        audioUrl: "data:audio/mpeg;base64,AAAA",
        cached: false,
        provider: "azure",
      },
      error: null,
    });

    await fetchCloudTtsUrl({
      text: "Mercy chưa nghe rõ. Bạn nói lại nhé. I didn't catch that clearly. Can you say it again?",
      language: "vi",
      requiredProvider: "azure",
    });

    expect(invoke).toHaveBeenCalledWith("mercy-tts", {
      body: {
        text: "I didn't catch that clearly. Can you say it again?",
        language: "en",
        voice_id: expect.any(String),
      },
    });
    expect(JSON.stringify(invoke.mock.calls)).not.toMatch(
      /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i,
    );
  });

  it("does not invoke cloud TTS for Vietnamese-only text", async () => {
    await expect(fetchCloudTtsUrl({ text: "Hôm nay trời đẹp.", language: "vi" })).resolves.toBeNull();

    expect(invoke).not.toHaveBeenCalled();
  });

  it("returns null when cloud TTS reports a provider fallback", async () => {
    invoke.mockResolvedValue({
      data: {
        error: "Cloud TTS unavailable",
        code: "provider_unavailable",
        fallback_reason: "azure_tts_flag_off,elevenlabs_flag_off",
        provider: null,
      },
      error: null,
    });

    await expect(fetchCloudTtsUrl({ text: "Bonjour.", language: "fr" })).resolves.toBeNull();
  });

  it("returns null when the caller requires Azure but the edge function falls back", async () => {
    invoke.mockResolvedValue({
      data: {
        audioUrl: "data:audio/mpeg;base64,AAAA",
        cached: false,
        provider: "elevenlabs",
        fallback_reason: "azure_429",
      },
      error: null,
    });

    await expect(
      fetchCloudTtsUrl({ text: "Hello.", language: "en", requiredProvider: "azure" }),
    ).resolves.toBeNull();
  });

  it("retries once and recovers Azure after a cold-start timeout fallback", async () => {
    invoke
      .mockResolvedValueOnce({
        data: {
          audioUrl: "data:audio/mpeg;base64,ELEVEN",
          cached: false,
          provider: "elevenlabs",
          fallback_reason: "azure_timeout",
        },
        error: null,
      })
      .mockResolvedValueOnce({
        data: {
          audioUrl: "data:audio/mpeg;base64,AZURE",
          cached: false,
          provider: "azure",
        },
        error: null,
      });

    const result = await fetchCloudTtsUrl({
      text: "Hello.",
      language: "en",
      requiredProvider: "azure",
    });

    expect(result).toMatchObject({ provider: "azure", audioUrl: "data:audio/mpeg;base64,AZURE" });
    expect(invoke).toHaveBeenCalledTimes(2);
  });

  it("does not retry on a non-transient Azure fallback (cap/flag/key)", async () => {
    invoke.mockResolvedValue({
      data: {
        audioUrl: "data:audio/mpeg;base64,ELEVEN",
        cached: false,
        provider: "elevenlabs",
        fallback_reason: "azure_429",
      },
      error: null,
    });

    const result = await fetchCloudTtsUrl({
      text: "Hello.",
      language: "en",
      requiredProvider: "azure",
    });

    expect(result).toBeNull();
    expect(invoke).toHaveBeenCalledTimes(1);
  });
});
