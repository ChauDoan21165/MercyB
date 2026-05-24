import { beforeEach, describe, expect, it, vi } from "vitest";

const invoke = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    functions: {
      invoke,
    },
  },
}));

describe("openaiRealtimeVoice client helper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("requests only an ephemeral realtime session from MercyB backend", async () => {
    invoke.mockResolvedValue({
      data: {
        clientSecret: "ek_test_ephemeral",
        expiresAt: 123,
        model: "gpt-realtime",
        voice: "marin",
      },
      error: null,
    });
    const { fetchOpenAiRealtimeSession } = await import("../openaiRealtimeVoice");

    const session = await fetchOpenAiRealtimeSession({
      mode: "journey",
      targetLanguage: "fr",
      explainLanguage: "vi",
    });

    expect(session?.clientSecret).toBe("ek_test_ephemeral");
    expect(invoke).toHaveBeenCalledWith("openai-realtime-session", {
      body: {
        mode: "journey",
        targetLanguage: "fr",
        explainLanguage: "vi",
      },
    });
    expect(JSON.stringify(invoke.mock.calls[0])).not.toMatch(/OPENAI_API_KEY|sk-/);
  });

  it("normalizes fallback text before handing off to existing TTS", async () => {
    const { sanitizeRealtimeFallbackText } = await import("../openaiRealtimeVoice");

    expect(sanitizeRealtimeFallbackText("  Mercy   answers\nnow. ")).toBe("Mercy answers now.");
  });
});
