import { beforeEach, describe, expect, it, vi } from "vitest";

const invoke = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    functions: {
      invoke,
    },
  },
}));

describe("mercyVoice cloud client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("sends only text, language, and optional voice id to the server-side TTS function", async () => {
    invoke.mockResolvedValue({ data: { audioUrl: "https://example.test/voice.mp3", cached: false }, error: null });
    const { fetchCloudTtsUrl } = await import("@/lib/mercyVoice");

    await fetchCloudTtsUrl({ text: "Bonjour.", language: "fr" });

    expect(invoke).toHaveBeenCalledWith("mercy-tts", {
      body: {
        text: "Bonjour.",
        language: "fr",
        voice_id: expect.any(String),
      },
    });
    expect(JSON.stringify(invoke.mock.calls[0])).not.toMatch(/GOOGLE|ELEVEN|API_KEY|secret/i);
  });

  it("keeps exact non-secret cloud readiness blockers for fallback reporting", async () => {
    invoke.mockResolvedValue({
      data: {
        error: "Cloud TTS disabled or not configured",
        code: "flag_off",
        providerStatus: {
          google: { flagEnabled: false, keyConfigured: false },
          elevenlabs: { flagEnabled: true, keyConfigured: false, voiceConfigured: true },
        },
      },
      error: null,
    });
    const { fetchCloudTtsUrl, getLastCloudTtsBlocker } = await import("@/lib/mercyVoice");

    const result = await fetchCloudTtsUrl({ text: "Mercy text.", language: "en" });

    expect(result).toBeNull();
    expect(getLastCloudTtsBlocker()).toEqual({
      code: "flag_off",
      error: "Cloud TTS disabled or not configured",
      google: { flagEnabled: false, keyConfigured: false },
      elevenlabs: { flagEnabled: true, keyConfigured: false, voiceConfigured: true },
    });
  });
});
