import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.hoisted(() => vi.fn());
const createClient = vi.hoisted(() => vi.fn(() => ({ auth: { getUser } })));

vi.mock("@supabase/supabase-js", () => ({
  createClient,
}));

const savedEnv: Record<string, string | undefined> = {};

function event(body: unknown) {
  return {
    httpMethod: "POST",
    headers: {
      Authorization: "Bearer session-jwt",
    },
    body: JSON.stringify(body),
  };
}

beforeEach(() => {
  for (const key of ["SUPABASE_URL", "SUPABASE_ANON_KEY", "OPENAI_API_KEY"]) {
    savedEnv[key] = process.env[key];
  }
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_ANON_KEY = "anon-key";
  process.env.OPENAI_API_KEY = "openai-key";
  getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
});

afterEach(() => {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("Netlify /api/mercy-ai AI conversation mode", () => {
  it("blocks non-premium learners before OpenAI is called", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({ is_premium: false, status: "inactive" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ));
    const { handler } = await import("../api-mercy-ai");

    const response = await handler(event({
      mode: "ai-conversation-turn",
      scenarioId: "job-interview",
      learnerText: "I want a customer service job.",
      turnCount: 0,
      history: [],
    }));

    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body ?? "{}")).toEqual({ error: "Premium required" });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://project.supabase.co/functions/v1/me-entitlement",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer session-jwt",
          apikey: "anon-key",
        }),
      }),
    );
  });

  it("allows premium learners into the OpenAI conversation path", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ is_premium: true, status: "active" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        choices: [{
          message: {
            content: JSON.stringify({
              reply: "You said customer service. What did you do in your last job?",
              correctionCandidate: null,
            }),
          },
        }],
        usage: { prompt_tokens: 80, completion_tokens: 40, total_tokens: 120 },
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }));
    vi.stubGlobal("fetch", fetchMock);
    const { handler } = await import("../api-mercy-ai");

    const response = await handler(event({
      mode: "ai-conversation-turn",
      scenarioId: "job-interview",
      learnerText: "I want a customer service job.",
      turnCount: 0,
      history: [],
    }));

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body ?? "{}")).toMatchObject({
      reply: "You said customer service. What did you do in your last job?",
      provider: "openai",
      model: "gpt-4o-mini",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
