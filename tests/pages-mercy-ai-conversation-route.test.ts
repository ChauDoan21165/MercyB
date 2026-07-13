import { beforeEach, describe, expect, it, vi } from "vitest";

const getUserMock = vi.hoisted(() => vi.fn());

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: getUserMock,
    },
  })),
}));

import { onRequestPost } from "../functions/api/mercy-ai";

const env = {
  SUPABASE_URL: "https://supabase.test",
  SUPABASE_ANON_KEY: "anon-key",
  OPENAI_API_KEY: "openai-key",
};

function postMercyAi(
  body: Record<string, unknown>,
  envOverride?: Record<string, string>,
): Promise<Response> {
  return onRequestPost({
    request: new Request("https://example.test/api/mercy-ai", {
      method: "POST",
      headers: {
        Authorization: "Bearer user-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),
    env: envOverride ?? env,
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

type FetchSpy = ReturnType<typeof vi.fn<typeof fetch>>;

function appFetchCalls(fetchMock: FetchSpy) {
  return fetchMock.mock.calls.filter(([url]) => !String(url).includes("function_failure_logs"));
}

describe("Pages /api/mercy-ai AI conversation mode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    getUserMock.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
  });

  it("handles ai-conversation-turn with generated reply and A1 developer grounding", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ is_premium: true, status: "active" }))
      .mockResolvedValueOnce(jsonResponse([{ admin_level: 0 }]))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              reply: "That is useful customer support experience. What kind of customers did you help most often?",
              correctionCandidate: null,
            }),
          },
        }],
        usage: { prompt_tokens: 120, completion_tokens: 40, total_tokens: 160 },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({
      mode: "ai-conversation-turn",
      scenarioId: "topic-work-job",
      learnerText: "I handled customer support.",
      turnCount: 2,
      messages: [
        { role: "developer", text: "Deterministic turn policy: ask about customers next." },
        { role: "assistant", text: "Tell me about your last role." },
      ],
      promptMetadata: {
        scenarioId: "topic-work-job",
        topicId: "topic-work-job",
        locale: "vi",
      },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      reply: expect.stringContaining("customer support"),
      correction: null,
      provider: "openai",
      model: "gpt-4o-mini",
      correctionGateModel: "gpt-4o",
    });

    const calls = appFetchCalls(fetchMock);
    expect(calls).toHaveLength(3);
    expect(String(calls[0][0])).toBe("https://supabase.test/functions/v1/me-entitlement");
    expect(calls[0][1]).toMatchObject({
      method: "GET",
      headers: {
        Authorization: "Bearer user-token",
        apikey: "anon-key",
      },
    });
    expect(String(calls[1][0])).toBe(
      "https://supabase.test/rest/v1/profiles?select=admin_level&id=eq.user-1&limit=1",
    );

    const openAiBody = JSON.parse(String(calls[2][1]?.body));
    expect(openAiBody.model).toBe("gpt-4o-mini");
    expect(openAiBody.messages[0].content).toContain("Job interview practice");
    expect(openAiBody.messages[1].content).toContain("Client grounding");
    expect(openAiBody.messages[1].content).toContain("Deterministic turn policy");
    expect(openAiBody.messages[1].content).toContain("topic-work-job");
  });

  it("fails closed when OpenAI returns no generated Mercy reply", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ is_premium: true, status: "active" }))
      .mockResolvedValueOnce(jsonResponse([{ admin_level: 0 }]))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              reply: "",
              correctionCandidate: null,
            }),
          },
        }],
        usage: { prompt_tokens: 80, completion_tokens: 2, total_tokens: 82 },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({
      mode: "ai-conversation-turn",
      scenarioId: "topic-work-job",
      learnerText: "I handled customer support.",
      turnCount: 2,
      messages: [
        { role: "developer", text: "Deterministic turn policy: ask about customers next." },
      ],
    });

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: "OpenAI response missing generated Mercy reply",
    });
    expect(appFetchCalls(fetchMock)).toHaveLength(3);
  });

  it("requires premium entitlement before calling OpenAI", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ is_premium: false, status: "free" }))
      .mockResolvedValueOnce(jsonResponse([{ admin_level: 0 }]));
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({
      mode: "ai-conversation-turn",
      learnerText: "I can start next week.",
      turnCount: 0,
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Premium required" });
    expect(appFetchCalls(fetchMock)).toHaveLength(2);
  });

  it("keeps learner-led conversation grounded in the user's words, not job interview fallback", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ is_premium: true, status: "active" }))
      .mockResolvedValueOnce(jsonResponse([{ admin_level: 0 }]))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              reply: "You said your bus was late. What did you do while you waited?",
              correctionCandidate: null,
            }),
          },
        }],
        usage: { prompt_tokens: 90, completion_tokens: 20, total_tokens: 110 },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({
      mode: "ai-conversation-turn",
      scenarioId: "learner-led",
      learnerText: "This morning my bus was late and I felt nervous.",
      turnCount: 0,
      messages: [],
      promptMetadata: {
        scenarioId: "learner-led",
        locale: "vi",
      },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      reply: expect.stringContaining("bus"),
      provider: "openai",
    });

    const openAiBody = JSON.parse(String(appFetchCalls(fetchMock)[2][1]?.body));
    const promptText = openAiBody.messages
      .map((message: { content: string }) => message.content)
      .join("\n");
    expect(promptText).toContain("Learner-led conversation");
    expect(promptText).toContain("This morning my bus was late and I felt nervous.");
    expect(promptText).not.toContain("Job interview practice");
    expect(promptText).not.toContain("what is one strength you would bring to this role");
  });

  it("allows admin_level 9 conversation access even when billing entitlement is free", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ is_premium: false, status: "free" }))
      .mockResolvedValueOnce(jsonResponse([{ admin_level: 9 }]))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              reply: "Let's stay with your work topic. What happened with the customer?",
              correctionCandidate: null,
            }),
          },
        }],
        usage: { prompt_tokens: 80, completion_tokens: 20, total_tokens: 100 },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({
      mode: "ai-conversation-turn",
      scenarioId: "topic-work-job",
      learnerText: "I helped a difficult customer.",
      turnCount: 1,
      messages: [
        { role: "developer", text: "Deterministic turn policy: follow the customer story." },
      ],
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      reply: expect.stringContaining("customer"),
      provider: "openai",
    });
    const calls = appFetchCalls(fetchMock);
    expect(calls).toHaveLength(3);
    expect(String(calls[2][0])).toBe("https://api.openai.com/v1/chat/completions");
  });

  it("keeps premium users entitled when the admin-level profile lookup fails", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ is_premium: true, status: "active" }))
      .mockResolvedValueOnce(jsonResponse({ error: "profile lookup failed" }, 500))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              reply: "You mentioned reports. What kind of report was it?",
              correctionCandidate: null,
            }),
          },
        }],
        usage: { prompt_tokens: 80, completion_tokens: 20, total_tokens: 100 },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({
      mode: "ai-conversation-turn",
      scenarioId: "topic-work-job",
      learnerText: "I finished my report.",
      turnCount: 1,
      messages: [
        { role: "developer", text: "Deterministic turn policy: ask about reports next." },
      ],
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      reply: expect.stringContaining("report"),
      provider: "openai",
    });
    expect(appFetchCalls(fetchMock)).toHaveLength(3);
  });

  it("keeps the 50-turn cap contract before calling OpenAI", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ is_premium: true, status: "active" }))
      .mockResolvedValueOnce(jsonResponse([{ admin_level: 0 }]));
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({
      mode: "ai-conversation-turn",
      learnerText: "I can start next week.",
      turnCount: 50,
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Session turn cap reached" });
    expect(appFetchCalls(fetchMock)).toHaveLength(2);
  });
});

describe("Pages /api/mercy-ai sentence-correction mode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    getUserMock.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
  });

  it("returns corrected sentence, explanation, grammarTip, confident on a grammar error", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
      jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              corrected: "I go to school yesterday.",
              explanation: "Dùng 'went' thay vì 'go' vì đây là quá khứ.",
              grammarTip: "Mẹo: go → went (quá khứ bất quy tắc).",
              confident: true,
            }),
          },
        }],
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({
      mode: "sentence-correction",
      learnerText: "I go to school yesterday.",
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      corrected: "I go to school yesterday.",
      explanation: "Dùng 'went' thay vì 'go' vì đây là quá khứ.",
      grammarTip: "Mẹo: go → went (quá khứ bất quy tắc).",
      confident: true,
    });

    // Must call OpenAI directly via raw fetch (not a Supabase or DeepSeek endpoint)
    const calls = appFetchCalls(fetchMock);
    expect(calls).toHaveLength(1);
    expect(String(calls[0][0])).toBe("https://api.openai.com/v1/chat/completions");
    const body = JSON.parse(String(calls[0][1]?.body));
    expect(body.model).toBe("gpt-4o-mini");
    expect(body.temperature).toBe(0.25);
    expect(body.response_format).toEqual({ type: "json_object" });
  });

  it("fails over sentence correction from OpenAI to DeepSeek on provider failure", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ error: { message: "quota" } }, 429))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              corrected: "This lesson is easier than yesterday.",
              explanation: "Dùng 'easier' thay vì 'more easy'.",
              grammarTip: "Mẹo: easy → easier trong so sánh hơn.",
              confident: true,
            }),
          },
        }],
        usage: { prompt_tokens: 90, completion_tokens: 35, total_tokens: 125 },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi(
      {
        mode: "sentence-correction",
        learnerText: "This lesson is more easy than yesterday.",
      },
      { ...env, DEEPSEEK_API_KEY: "deepseek-key" },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      corrected: "This lesson is easier than yesterday.",
      confident: true,
    });
    const calls = appFetchCalls(fetchMock);
    expect(calls).toHaveLength(2);
    expect(String(calls[0][0])).toBe("https://api.openai.com/v1/chat/completions");
    expect(String(calls[1][0])).toBe("https://api.deepseek.com/chat/completions");
  });

  it("returns confident:false with abstain message when the learner text is incomprehensible", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
      jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              corrected: "",
              explanation: "Mercy chưa sửa chắc câu này. Bạn thử viết ngắn hơn, rõ hơn rồi gửi lại nhé.",
              grammarTip: "",
              confident: false,
            }),
          },
        }],
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({
      mode: "sentence-correction",
      learnerText: "asdfjkl qwerty zxcvbn",
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.confident).toBe(false);
    expect(body.corrected).toBe("");
  });

  it("does not override OpenAI abstain with a hardcoded buy-a-head correction", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
      jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              corrected: "",
              explanation: "Mercy chưa sửa chắc câu này. Bạn thử viết ngắn hơn, rõ hơn rồi gửi lại nhé.",
              grammarTip: "",
              confident: false,
            }),
          },
        }],
        usage: { prompt_tokens: 155, completion_tokens: 32, total_tokens: 187 },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({
      mode: "sentence-correction",
      learnerText: "hello I buy a head yesterday because someone's coming and I'm going to be out a lot so I need a hat",
      explainLanguage: "vi",
      target: "en",
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      confident: false,
      corrected: "",
      explanation: "Mercy chưa sửa chắc câu này. Bạn thử viết ngắn hơn, rõ hơn rồi gửi lại nhé.",
      grammarTip: "",
    });
  });

  it("returns app-owned 504 when sentence correction exceeds the server deadline", async () => {
    vi.useFakeTimers();
    try {
      getUserMock.mockResolvedValueOnce({
        data: { user: { id: "timeout-user" } },
        error: null,
      });
      const fetchMock = vi.fn<typeof fetch>((_url, init) => {
        const signal = init?.signal;
        return new Promise<Response>((_resolve, reject) => {
          signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        });
      });
      vi.stubGlobal("fetch", fetchMock);

      const responsePromise = postMercyAi(
        {
          mode: "sentence-correction",
          learnerText: "I go to school yesterday.",
        },
        { ...env, MERCY_AI_CORRECTION_TIMEOUT_MS: "25" },
      );

      await vi.advanceTimersByTimeAsync(25);
      const response = await responsePromise;

      expect(response.status).toBe(504);
      await expect(response.json()).resolves.toEqual({
        error: "Correction timed out",
        timeout: true,
      });
      const calls = appFetchCalls(fetchMock);
      expect(calls).toHaveLength(1);
      expect(calls[0][1]?.signal).toBeInstanceOf(AbortSignal);
    } finally {
      vi.useRealTimers();
    }
  });

  it("rejects missing learnerText with 400", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi({ mode: "sentence-correction" });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Missing learnerText" });
    expect(appFetchCalls(fetchMock)).toHaveLength(0);
  });

  it("returns 500 when OPENAI_API_KEY is absent", async () => {
    getUserMock.mockResolvedValueOnce({
      data: { user: { id: "missing-openai-user" } },
      error: null,
    });
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi(
      { mode: "sentence-correction", learnerText: "I go to school yesterday." },
      { ...env, OPENAI_API_KEY: "" },
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Missing OPENAI_API_KEY" });
    expect(appFetchCalls(fetchMock)).toHaveLength(0);
  });
});

describe("Pages /api/mercy-ai host mode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    getUserMock.mockResolvedValue({
      data: { user: { id: "host-user" } },
      error: null,
    });
  });

  it("fails over host chat from OpenAI to DeepSeek while preserving { text } response shape", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ error: { message: "upstream overloaded" } }, 503))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              text: "EN:\nHi. What are you practicing today?\n\nVI:\nChào bạn. Hôm nay bạn muốn luyện gì?",
            }),
          },
        }],
        usage: { prompt_tokens: 70, completion_tokens: 25, total_tokens: 95 },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await postMercyAi(
      { userText: "hi", lang: "en" },
      { ...env, DEEPSEEK_API_KEY: "deepseek-key" },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      text: "EN:\nHi. What are you practicing today?\n\nVI:\nChào bạn. Hôm nay bạn muốn luyện gì?",
    });
    const calls = appFetchCalls(fetchMock);
    expect(calls).toHaveLength(2);
    expect(String(calls[0][0])).toBe("https://api.openai.com/v1/chat/completions");
    expect(String(calls[1][0])).toBe("https://api.deepseek.com/chat/completions");
  });
});
