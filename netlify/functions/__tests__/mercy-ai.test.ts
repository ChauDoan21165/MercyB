import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.hoisted(() => vi.fn());
const createClient = vi.hoisted(() => vi.fn(() => ({ auth: { getUser } })));

vi.mock("@supabase/supabase-js", () => ({
  createClient,
}));

const ENV_KEYS = [
  "SUPABASE_URL",
  "VITE_SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "VITE_SUPABASE_ANON_KEY",
  "DEEPSEEK_API_KEY",
  "DEEPSEEK_SPEAK_MODEL",
] as const;

const savedEnv: Partial<Record<(typeof ENV_KEYS)[number], string>> = {};

function event(body: unknown, headers: Record<string, string | undefined> = {}) {
  return {
    httpMethod: "POST",
    headers: {
      Authorization: "Bearer session-jwt",
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

beforeEach(() => {
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_ANON_KEY = "anon-key";
  process.env.DEEPSEEK_API_KEY = "deepseek-secret";
  getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
    choices: [{ message: { content: "Where did you buy it?" } }],
  }), { status: 200, headers: { "Content-Type": "application/json" } })));
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("Netlify /api/mercy-ai Speak function", () => {
  it("calls DeepSeek server-side for authenticated speak-follow-up requests", async () => {
    const { handler } = await import("../mercy-ai");

    const response = await handler(event({
      mode: "speak-follow-up",
      transcript: "I bought a hat yesterday.",
      context: {
        learnerLevel: "beginner",
        currentTopic: "topic-shopping",
        recentTurns: [{ role: "learner", text: "I want to buy a hat." }],
      },
    }));

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      question: "Where did you buy it?",
      provider: "deepseek",
      model: "deepseek-chat",
    });
    expect(createClient).toHaveBeenCalledWith("https://project.supabase.co", "anon-key");
    expect(getUser).toHaveBeenCalledWith("session-jwt");
    expect(fetch).toHaveBeenCalledWith("https://api.deepseek.com/chat/completions", expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({
        Authorization: "Bearer deepseek-secret",
      }),
    }));
  });

  it("fails safely to clarification when the DeepSeek key is missing", async () => {
    delete process.env.DEEPSEEK_API_KEY;
    const { handler } = await import("../mercy-ai");

    const response = await handler(event({
      mode: "speak-follow-up",
      transcript: "I like summer because it is sunny.",
    }));

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      question: "Mercy chưa nghe rõ. Bạn nói lại câu đó nhé. I didn't catch that clearly. Can you say it again?",
      provider: "local-fallback",
      fallback: true,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails safely to clarification when DeepSeek rejects or returns unusable output", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      choices: [{ message: { content: "Why did you choose the general?" } }],
    }), { status: 200 })));
    const { handler } = await import("../mercy-ai");

    const response = await handler(event({
      mode: "speak-follow-up",
      transcript: "I like summer because I can swim.",
    }));

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      question: "Mercy chưa nghe rõ. Bạn nói lại câu đó nhé. I didn't catch that clearly. Can you say it again?",
      provider: "local-fallback",
      fallback: true,
    });
  });
});
