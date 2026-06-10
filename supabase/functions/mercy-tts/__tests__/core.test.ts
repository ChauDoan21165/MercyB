import { describe, expect, it, vi, afterEach } from "vitest";
import { handleMercyTtsRequest } from "../core";

const VALID_MP3 = new Uint8Array([0x49, 0x44, 0x33, 0x04, 0x00, 0x00]);

function audioResponse(bytes = VALID_MP3) {
  return new Response(bytes, {
    status: 200,
    headers: { "content-type": "audio/mpeg" },
  });
}

function jsonRequest(body: Record<string, unknown> = {}) {
  return new Request("https://example.test/mercy-tts", {
    method: "POST",
    body: JSON.stringify({
      text: "Hello Mercy.",
      voice_id: "voice-1",
      language: "en",
      ...body,
    }),
  });
}

type FlagMap = Record<string, boolean>;

function makeSupabase(flags: FlagMap = { azure_tts: true, elevenlabs_tts: true }) {
  const insert = vi.fn(async () => ({ error: null }));
  const createClient = vi.fn(() => ({
    from(table: string) {
      if (table === "feature_flags") {
        let flagKey = "";
        const chain = {
          select: vi.fn(() => chain),
          eq: vi.fn((_column: string, value: string) => {
            flagKey = value;
            return chain;
          }),
          maybeSingle: vi.fn(async () => ({
            data: { is_enabled: flags[flagKey] ?? false, enabled_user_ids: [] },
            error: null,
          })),
        };
        return chain;
      }
      if (table === "mercy_tts_usage") {
        const chain = {
          select: vi.fn(() => chain),
          gte: vi.fn(() => chain),
          eq: vi.fn(() => chain),
          insert,
          then(resolve: (value: { count: number; error: null }) => unknown) {
            return Promise.resolve(resolve({ count: 0, error: null }));
          },
        };
        return chain;
      }
      throw new Error(`Unexpected table: ${table}`);
    },
  }));
  return { createClient, insert };
}

function makeDeps(fetcher: typeof fetch, flags?: FlagMap) {
  const { createClient, insert } = makeSupabase(flags);
  return {
    deps: {
      createClient: createClient as never,
      env: (key: string) => ({
        SUPABASE_URL: "https://supabase.test",
        SUPABASE_ANON_KEY: "anon",
        SUPABASE_SERVICE_ROLE_KEY: "service",
        AZURE_SPEECH_KEY: "azure-key",
        AZURE_SPEECH_REGION: "westus",
        ELEVENLABS_API_KEY: "eleven-key",
      }[key]),
      fetcher,
      now: () => Date.UTC(2026, 0, 1),
    },
    insert,
  };
}

async function responseJson(response: Response) {
  return await response.json() as Record<string, unknown>;
}

describe("mercy-tts provider fallback", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns Azure on Azure success and does not call ElevenLabs", async () => {
    const fetcher = vi.fn(async () => audioResponse());
    const { deps } = makeDeps(fetcher as unknown as typeof fetch);

    const response = await handleMercyTtsRequest(jsonRequest(), deps);
    const body = await responseJson(response);

    expect(response.status).toBe(200);
    expect(body.provider).toBe("azure");
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(String(fetcher.mock.calls[0][0])).toContain("tts.speech.microsoft.com");
  });

  it("calls ElevenLabs when Azure returns 429", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response("quota", { status: 429 }))
      .mockResolvedValueOnce(audioResponse());
    const { deps } = makeDeps(fetcher as unknown as typeof fetch);

    const response = await handleMercyTtsRequest(jsonRequest(), deps);
    const body = await responseJson(response);

    expect(response.status).toBe(200);
    expect(body.provider).toBe("elevenlabs");
    expect(body.fallback_reason).toBe("azure_429");
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(String(fetcher.mock.calls[1][0])).toContain("api.elevenlabs.io");
  });

  it("calls ElevenLabs when Azure throws", async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error("azure down"))
      .mockResolvedValueOnce(audioResponse());
    const { deps } = makeDeps(fetcher as unknown as typeof fetch);

    const response = await handleMercyTtsRequest(jsonRequest(), deps);
    const body = await responseJson(response);

    expect(response.status).toBe(200);
    expect(body.provider).toBe("elevenlabs");
    expect(body.fallback_reason).toBe("azure_error");
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("calls ElevenLabs when Azure times out", async () => {
    vi.useFakeTimers();
    const fetcher = vi
      .fn()
      .mockImplementationOnce((_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("aborted", "AbortError"));
          });
        })
      )
      .mockResolvedValueOnce(audioResponse());
    const { deps } = makeDeps(fetcher as unknown as typeof fetch);

    const pending = handleMercyTtsRequest(jsonRequest(), deps);
    await vi.advanceTimersByTimeAsync(9000);
    const response = await pending;
    const body = await responseJson(response);

    expect(response.status).toBe(200);
    expect(body.provider).toBe("elevenlabs");
    expect(body.fallback_reason).toBe("azure_timeout");
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("calls ElevenLabs when Azure returns empty or invalid output", async () => {
    const cases = [
      {
        name: "empty",
        response: new Response(new Uint8Array(), {
          status: 200,
          headers: { "content-type": "audio/mpeg" },
        }),
        reason: "azure_empty_audio",
      },
      {
        name: "invalid",
        response: new Response(new TextEncoder().encode("not audio"), {
          status: 200,
          headers: { "content-type": "text/plain" },
        }),
        reason: "azure_invalid_content_type",
      },
    ];

    for (const c of cases) {
      const fetcher = vi
        .fn()
        .mockResolvedValueOnce(c.response)
        .mockResolvedValueOnce(audioResponse());
      const { deps } = makeDeps(fetcher as unknown as typeof fetch);

      const response = await handleMercyTtsRequest(jsonRequest({ text: `Hello ${c.name}.` }), deps);
      const body = await responseJson(response);

      expect(response.status).toBe(200);
      expect(body.provider).toBe("elevenlabs");
      expect(body.fallback_reason).toBe(c.reason);
      expect(fetcher).toHaveBeenCalledTimes(2);
    }
  });

  it("returns provider_unavailable when both providers fail", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response("quota", { status: 429 }))
      .mockResolvedValueOnce(new Response("bad", { status: 500 }));
    const { deps } = makeDeps(fetcher as unknown as typeof fetch);

    const response = await handleMercyTtsRequest(jsonRequest(), deps);
    const body = await responseJson(response);

    expect(response.status).toBe(502);
    expect(body).toMatchObject({
      code: "provider_unavailable",
      provider: null,
      fallback_reason: "azure_429,elevenlabs_500",
    });
  });
});

describe("mercy-tts finalized-audio storage cache", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function makeDepsWithStorage(
    fetcher: typeof fetch,
    storageImpl: {
      list: ReturnType<typeof vi.fn>;
      getPublicUrl: ReturnType<typeof vi.fn>;
      upload: ReturnType<typeof vi.fn>;
    },
    flags: FlagMap = { azure_tts: true, elevenlabs_tts: true },
  ) {
    const insert = vi.fn(async () => ({ error: null }));
    const createClient = vi.fn(() => ({
      from(table: string) {
        if (table === "feature_flags") {
          let flagKey = "";
          const chain: Record<string, unknown> = {
            select: vi.fn(() => chain),
            eq: vi.fn((_c: string, value: string) => {
              flagKey = value;
              return chain;
            }),
            maybeSingle: vi.fn(async () => ({
              data: { is_enabled: flags[flagKey] ?? false, enabled_user_ids: [] },
              error: null,
            })),
          };
          return chain;
        }
        if (table === "mercy_tts_usage") {
          const chain: Record<string, unknown> = {
            select: vi.fn(() => chain),
            gte: vi.fn(() => chain),
            eq: vi.fn(() => chain),
            insert,
            then(resolve: (v: { count: number; error: null }) => unknown) {
              return Promise.resolve(resolve({ count: 0, error: null }));
            },
          };
          return chain;
        }
        throw new Error(`Unexpected table: ${table}`);
      },
      storage: {
        from: vi.fn(() => storageImpl),
      },
    }));
    return {
      deps: {
        createClient: createClient as never,
        env: (key: string) => ({
          SUPABASE_URL: "https://supabase.test",
          SUPABASE_ANON_KEY: "anon",
          SUPABASE_SERVICE_ROLE_KEY: "service",
          AZURE_SPEECH_KEY: "azure-key",
          AZURE_SPEECH_REGION: "westus",
          ELEVENLABS_API_KEY: "eleven-key",
        }[key]),
        fetcher,
        now: () => Date.UTC(2026, 0, 1),
      },
      insert,
    };
  }

  it("serves cached audio without calling Azure (cap-proof) on a cache hit", async () => {
    const fetcher = vi.fn(async () => audioResponse());
    const storageImpl = {
      list: vi.fn(async () => ({ data: [{ name: "abc.mp3" }], error: null })),
      getPublicUrl: vi.fn(() => ({
        data: { publicUrl: "https://cdn.test/room-audio/tts-cache/abc.mp3" },
      })),
      upload: vi.fn(async () => ({ data: {}, error: null })),
    };
    const { deps, insert } = makeDepsWithStorage(fetcher as unknown as typeof fetch, storageImpl);

    const response = await handleMercyTtsRequest(jsonRequest({ language: "en" }), deps);
    const body = await responseJson(response);

    expect(response.status).toBe(200);
    expect(body.provider).toBe("azure");
    expect(body.cached).toBe(true);
    expect(String(body.audioUrl)).toContain("tts-cache/");
    // No Azure (or any provider) call, and no usage row — the cache hit is free.
    expect(fetcher).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
    expect(storageImpl.upload).not.toHaveBeenCalled();
  });

  it("synthesizes and uploads to cache on a cache miss", async () => {
    const fetcher = vi.fn(async () => audioResponse());
    const storageImpl = {
      list: vi.fn(async () => ({ data: [], error: null })),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://cdn.test/x" } })),
      upload: vi.fn(async () => ({ data: {}, error: null })),
    };
    const { deps, insert } = makeDepsWithStorage(fetcher as unknown as typeof fetch, storageImpl);

    const response = await handleMercyTtsRequest(jsonRequest({ language: "en" }), deps);
    const body = await responseJson(response);

    expect(response.status).toBe(200);
    expect(body.provider).toBe("azure");
    expect(body.cached).toBe(false);
    // Azure was called, and the fresh clip was written to the cache.
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledTimes(1);
    expect(storageImpl.upload).toHaveBeenCalledTimes(1);
    expect(String(storageImpl.upload.mock.calls[0][0])).toContain("tts-cache/");
  });

  it("degrades to live synthesis when the cache lookup errors", async () => {
    const fetcher = vi.fn(async () => audioResponse());
    const storageImpl = {
      list: vi.fn(async () => {
        throw new Error("storage down");
      }),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: "" } })),
      upload: vi.fn(async () => ({ data: {}, error: null })),
    };
    const { deps } = makeDepsWithStorage(fetcher as unknown as typeof fetch, storageImpl);

    const response = await handleMercyTtsRequest(jsonRequest({ language: "en" }), deps);
    const body = await responseJson(response);

    // Never throws; falls through to Azure synthesis.
    expect(response.status).toBe(200);
    expect(body.provider).toBe("azure");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
