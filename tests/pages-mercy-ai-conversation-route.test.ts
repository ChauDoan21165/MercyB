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

function postMercyAi(body: Record<string, unknown>): Promise<Response> {
  return onRequestPost({
    request: new Request("https://example.test/api/mercy-ai", {
      method: "POST",
      headers: {
        Authorization: "Bearer user-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),
    env,
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

describe("Pages /api/mercy-ai AI conversation mode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    getUserMock.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
  });

  it("handles ai-conversation-turn with job-interview fallback and A1 developer grounding", async () => {
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

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[0][0])).toBe("https://supabase.test/functions/v1/me-entitlement");
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: "GET",
      headers: {
        Authorization: "Bearer user-token",
        apikey: "anon-key",
      },
    });
    expect(String(fetchMock.mock.calls[1][0])).toBe(
      "https://supabase.test/rest/v1/profiles?select=admin_level&id=eq.user-1&limit=1",
    );

    const openAiBody = JSON.parse(String(fetchMock.mock.calls[2][1]?.body));
    expect(openAiBody.model).toBe("gpt-4o-mini");
    expect(openAiBody.messages[0].content).toContain("Job interview practice");
    expect(openAiBody.messages[1].content).toContain("Client grounding");
    expect(openAiBody.messages[1].content).toContain("Deterministic turn policy");
    expect(openAiBody.messages[1].content).toContain("topic-work-job");
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
    expect(fetchMock).toHaveBeenCalledTimes(2);
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
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[2][0])).toBe("https://api.openai.com/v1/chat/completions");
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
    expect(fetchMock).toHaveBeenCalledTimes(3);
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
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
