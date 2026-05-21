// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

import {
  detectVietnamesePhonemeFlags,
  levelFromPronunciation,
  normalizeAzurePhonemeResponse,
  scorePronunciationWithAzure,
  type PhonemeBridgeDeps,
} from "../phonemeBridge";
import type { GradeSpeakingRequest } from "../types";

const request: GradeSpeakingRequest = {
  promptId: "b2-s-opinion",
  taskText: "I think this is a good idea",
  userResponse: "I think this is a good idea",
  targetLanguage: "en",
  userId: "user-1",
  audioBase64: btoa("fake wav bytes"),
  audioContentType: "audio/wav",
};

function depsWithResponse(body: unknown, status = 200): PhonemeBridgeDeps {
  return {
    functionBaseUrl: "https://functions.example.com",
    serviceRoleKey: "service-role",
    fetch: vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  };
}

function azureBody(score = 88) {
  return {
    ok: true,
    provider: "azure",
    score,
    audio_seconds: 2.4,
    cost_usd_cents: 0.07,
    word_scores: [
      {
        word: "think",
        heard: "think",
        score,
        phonemes: [
          { phoneme: "θ", score },
          { phoneme: "ɪ", score },
          { phoneme: "ŋ", score },
          { phoneme: "k", score },
        ],
      },
    ],
  };
}

describe("normalizeAzurePhonemeResponse", () => {
  it("normalizes Azure word and phoneme scores", () => {
    const result = normalizeAzurePhonemeResponse(azureBody(91));

    expect(result.ok).toBe(true);
    expect(result.score).toBe(91);
    expect(result.level).toBe("C1");
    expect(result.wordScores[0].phonemes).toHaveLength(4);
    expect(result.phonemeScores[0]).toMatchObject({
      word: "think",
      phoneme: "θ",
      score: 91,
      status: "correct",
    });
  });

  it("maps sentinel responses to failed pronunciation without readiness evidence", () => {
    const result = normalizeAzurePhonemeResponse({
      ok: false,
      use_local: true,
      reason: "azure_timeout",
    });

    expect(result.ok).toBe(false);
    expect(result.level).toBe("A1");
    expect(result.rawReason).toBe("azure_phoneme_azure_timeout");
    expect(result.phonemeScores).toHaveLength(0);
  });

  it("handles malformed Azure payloads without crashing", () => {
    const result = normalizeAzurePhonemeResponse({
      ok: true,
      provider: "azure",
      score: 72,
      word_scores: "not-an-array",
    } as never);

    expect(result.ok).toBe(true);
    expect(result.score).toBe(72);
    expect(result.wordScores).toHaveLength(0);
    expect(result.phonemeScores).toHaveLength(0);
    expect(result.confidence).toBe(0.2);
  });

  it("keeps partial word evidence when phoneme arrays are missing", () => {
    const result = normalizeAzurePhonemeResponse({
      ok: true,
      provider: "azure",
      score: 64,
      word_scores: [
        { word: "culture", heard: "culture", score: 64 },
        { word: "empty", heard: "empty", score: 50, phonemes: "bad" },
      ],
    } as never);

    expect(result.ok).toBe(true);
    expect(result.wordScores).toHaveLength(2);
    expect(result.phonemeScores).toHaveLength(0);
    expect(result.confidence).toBe(0.2);
  });

  it("deduplicates repeated phoneme entries from Azure payloads", () => {
    const result = normalizeAzurePhonemeResponse({
      ok: true,
      provider: "azure",
      score: 55,
      word_scores: [
        {
          word: "think",
          heard: "tink",
          score: 55,
          phonemes: [
            { phoneme: "θ", score: 35 },
            { phoneme: "θ", score: 45 },
            { phoneme: "ɪ", score: 80 },
          ],
        },
      ],
    } as never);

    expect(result.phonemeScores).toHaveLength(2);
    expect(result.phonemeScores.map((item) => item.phoneme)).toEqual(["θ", "ɪ"]);
    expect(result.phonemeScores[0].score).toBe(35);
  });

  it("drops malformed word and phoneme entries while preserving usable partial evidence", () => {
    const result = normalizeAzurePhonemeResponse({
      ok: true,
      provider: "azure",
      word_scores: [
        null,
        { heard: "missing-word", score: 90 },
        {
          word: "clear",
          heard: "clear",
          score: "bad",
          phonemes: [
            { phoneme: "", score: 80 },
            { phoneme: "k", score: "72" },
            { phoneme: "l", score: Number.NaN },
          ],
        },
      ],
    } as never);

    expect(result.ok).toBe(true);
    expect(result.wordScores).toHaveLength(1);
    expect(result.wordScores[0]).toMatchObject({
      word: "clear",
      score: 72,
      status: "close",
    });
    expect(result.phonemeScores).toEqual([
      { word: "clear", phoneme: "k", score: 72, status: "close" },
    ]);
  });

  it("marks Azure success payloads with no usable score or phoneme evidence as low-confidence", () => {
    const result = normalizeAzurePhonemeResponse({
      ok: true,
      provider: "azure",
      word_scores: [
        { word: "think", heard: "think", score: "bad", phonemes: [{ phoneme: "θ", score: "bad" }] },
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.score).toBe(0);
    expect(result.confidence).toBe(0.2);
    expect(result.rawReason).toBe("azure_phoneme_missing_score_and_phonemes");
    expect(result.phonemeScores).toHaveLength(0);
  });

  it("keeps low-confidence pronunciation evidence bounded", () => {
    const result = normalizeAzurePhonemeResponse({
      ok: true,
      provider: "azure",
      score: 20,
      word_scores: [
        {
          word: "think",
          heard: "tink",
          score: 20,
          phonemes: [{ phoneme: "θ", score: 20 }],
        },
      ],
    } as never);

    expect(result.ok).toBe(true);
    expect(result.level).toBe("A1");
    expect(result.confidence).toBeLessThan(0.5);
  });

  it.each([
    [94, "C2"],
    [86, "C1"],
    [78, "B2"],
    [66, "B1"],
    [50, "A2"],
    [30, "A1"],
  ] as const)("maps %i pronunciation score to %s", (score, level) => {
    expect(levelFromPronunciation(score)).toBe(level);
  });
});

describe("detectVietnamesePhonemeFlags", () => {
  it("surfaces final consonant, TH, and vowel-reduction VN L1 phoneme patterns", () => {
    const flags = detectVietnamesePhonemeFlags([
      {
        word: "think",
        heard: "tink",
        score: 45,
        status: "wrong",
        phonemes: [
          { word: "think", phoneme: "θ", score: 25, status: "wrong" },
          { word: "think", phoneme: "ɪ", score: 80, status: "close" },
          { word: "think", phoneme: "k", score: 35, status: "wrong" },
        ],
      },
      {
        word: "face",
        heard: "fess",
        score: 52,
        status: "wrong",
        phonemes: [
          { word: "face", phoneme: "eɪ", score: 40, status: "wrong" },
          { word: "face", phoneme: "s", score: 88, status: "correct" },
        ],
      },
    ]);

    expect(flags.map((flag) => flag.pattern)).toEqual(
      expect.arrayContaining([
        "final-consonant-cluster-reduction",
        "th-stopping-and-fronting",
        "diphthong-monophthong-reduction",
      ]),
    );
  });
});

describe("scorePronunciationWithAzure", () => {
  it("calls azure-phoneme with multipart audio and target text", async () => {
    const deps = depsWithResponse(azureBody(84));
    deps.userAccessToken = "learner-jwt";
    const result = await scorePronunciationWithAzure(request, deps);

    expect(result.ok).toBe(true);
    expect(deps.fetch).toHaveBeenCalledOnce();
    const [url, init] = (deps.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://functions.example.com/azure-phoneme");
    expect(init.headers.Authorization).toBe("Bearer learner-jwt");
    expect(init.headers.apikey).toBe("service-role");
    expect(init.body).toBeInstanceOf(FormData);
  });

  it("requires a learner JWT before calling azure-phoneme", async () => {
    const deps = depsWithResponse(azureBody(84));
    const result = await scorePronunciationWithAzure(request, deps);

    expect(result.ok).toBe(false);
    expect(result.rawReason).toBe("missing_learner_jwt");
    expect(deps.fetch).not.toHaveBeenCalled();
  });

  it("loads audio bytes from storage path when audioBase64 is absent", async () => {
    const deps = {
      ...depsWithResponse(azureBody(76)),
      userAccessToken: "learner-jwt",
      loadAudioBytes: vi.fn().mockResolvedValue({
        bytes: new Uint8Array([1, 2, 3]),
        contentType: "audio/wav",
      }),
    };
    const result = await scorePronunciationWithAzure({
      ...request,
      audioBase64: null,
      audioStoragePath: "placement-audio/session/audio.wav",
    }, deps);

    expect(result.ok).toBe(true);
    expect(deps.loadAudioBytes).toHaveBeenCalledWith("placement-audio/session/audio.wav");
  });

  it("returns failed pronunciation when audio is missing", async () => {
    const deps = depsWithResponse(azureBody());
    deps.userAccessToken = "learner-jwt";
    const result = await scorePronunciationWithAzure({
      ...request,
      audioBase64: null,
      audioStoragePath: null,
    }, deps);

    expect(result.ok).toBe(false);
    expect(result.rawReason).toBe("missing_audio");
  });

  it("returns failed pronunciation when base64 audio is malformed", async () => {
    const deps = depsWithResponse(azureBody());
    deps.userAccessToken = "learner-jwt";
    const result = await scorePronunciationWithAzure({
      ...request,
      audioBase64: "not valid base64 %",
      audioStoragePath: null,
    }, deps);

    expect(result.ok).toBe(false);
    expect(result.rawReason).toBe("missing_audio");
    expect(deps.fetch).not.toHaveBeenCalled();
  });

  it("returns failed pronunciation on Azure HTTP failure", async () => {
    const deps = depsWithResponse({ error: "boom" }, 500);
    deps.userAccessToken = "learner-jwt";
    const result = await scorePronunciationWithAzure(request, deps);
    expect(result.ok).toBe(false);
    expect(result.rawReason).toBe("azure_phoneme_http_500");
  });

  it("does not retry non-retryable Azure HTTP failures", async () => {
    const deps = depsWithResponse({ error: "bad request" }, 400);
    deps.userAccessToken = "learner-jwt";

    const result = await scorePronunciationWithAzure(request, deps);

    expect(result.ok).toBe(false);
    expect(result.rawReason).toBe("azure_phoneme_http_400");
    expect(deps.fetch).toHaveBeenCalledOnce();
  });

  it("retries retryable Azure HTTP failures before using the successful response", async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response("no", { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(azureBody(82)), { status: 200 }));
    const deps: PhonemeBridgeDeps = {
      functionBaseUrl: "https://functions.example.com",
      serviceRoleKey: "service-role",
      userAccessToken: "learner-jwt",
      retryDelaysMs: [0],
      fetch: fetchImpl,
    };

    const result = await scorePronunciationWithAzure(request, deps);

    expect(result.ok).toBe(true);
    expect(result.score).toBe(82);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("rebuilds multipart form data for each retry attempt", async () => {
    const bodies: unknown[] = [];
    const fetchImpl = vi.fn(async (_url, init) => {
      bodies.push(init?.body);
      return bodies.length === 1
        ? new Response("rate limited", { status: 429 })
        : new Response(JSON.stringify(azureBody(83)), { status: 200 });
    });
    const deps: PhonemeBridgeDeps = {
      functionBaseUrl: "https://functions.example.com",
      serviceRoleKey: "service-role",
      userAccessToken: "learner-jwt",
      retryDelaysMs: [0],
      fetch: fetchImpl,
    };

    const result = await scorePronunciationWithAzure(request, deps);

    expect(result.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(bodies[0]).toBeInstanceOf(FormData);
    expect(bodies[1]).toBeInstanceOf(FormData);
    expect(bodies[0]).not.toBe(bodies[1]);
  });

  it("returns timeout after aborting Azure attempts", async () => {
    const fetchImpl = vi.fn((_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      })
    );
    const deps: PhonemeBridgeDeps = {
      functionBaseUrl: "https://functions.example.com",
      serviceRoleKey: "service-role",
      userAccessToken: "learner-jwt",
      timeoutMs: 1,
      retryDelaysMs: [],
      fetch: fetchImpl,
    };

    const result = await scorePronunciationWithAzure(request, deps);

    expect(result.ok).toBe(false);
    expect(result.rawReason).toBe("azure_phoneme_timeout");
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("returns failed pronunciation on invalid JSON", async () => {
    const deps: PhonemeBridgeDeps = {
      functionBaseUrl: "https://functions.example.com",
      serviceRoleKey: "service-role",
      userAccessToken: "learner-jwt",
      fetch: vi.fn().mockResolvedValue(new Response("{", { status: 200 })),
    };

    const result = await scorePronunciationWithAzure(request, deps);
    expect(result.ok).toBe(false);
    expect(result.rawReason).toBe("azure_phoneme_invalid_json");
  });
});
