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

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// The entitlement gate fetches me-entitlement (billing) and the caller's
// profiles.admin_level in parallel, then routes both through the canonical
// resolver. OpenAI is only reached after the gate passes. Route by URL so the
// parallel order does not matter.
function routedFetch(opts: {
  isPremium: boolean;
  adminLevel: number;
  reply?: string;
}) {
  return vi.fn(async (url: unknown) => {
    const u = String(url);
    if (u.includes("/functions/v1/me-entitlement")) {
      return jsonResponse({ is_premium: opts.isPremium, status: opts.isPremium ? "active" : "inactive" });
    }
    if (u.includes("/rest/v1/profiles")) {
      return jsonResponse([{ admin_level: opts.adminLevel }]);
    }
    return jsonResponse({
      choices: [{ message: { content: JSON.stringify({ reply: opts.reply ?? "", correctionCandidate: null }) } }],
      usage: { prompt_tokens: 80, completion_tokens: 40, total_tokens: 120 },
    });
  });
}

function conversationEvent() {
  return event({
    mode: "ai-conversation-turn",
    scenarioId: "job-interview",
    learnerText: "I want a customer service job.",
    turnCount: 0,
    history: [],
  });
}

function openAiCalled(fetchMock: ReturnType<typeof vi.fn>): boolean {
  return fetchMock.mock.calls.some(([url]) => String(url).includes("openai"));
}

describe("Netlify /api/mercy-ai AI conversation mode", () => {
  it("blocks free non-admin learners before OpenAI is called", async () => {
    const fetchMock = routedFetch({ isPremium: false, adminLevel: 0 });
    vi.stubGlobal("fetch", fetchMock);
    const { handler } = await import("../api-mercy-ai");

    const response = await handler(conversationEvent());

    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body ?? "{}")).toEqual({ error: "Premium required" });
    expect(openAiCalled(fetchMock)).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
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
    const fetchMock = routedFetch({
      isPremium: true,
      adminLevel: 0,
      reply: "You said customer service. What did you do in your last job?",
    });
    vi.stubGlobal("fetch", fetchMock);
    const { handler } = await import("../api-mercy-ai");

    const response = await handler(conversationEvent());

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body ?? "{}")).toMatchObject({
      reply: "You said customer service. What did you do in your last job?",
      provider: "openai",
      model: "gpt-4o-mini",
    });
    expect(openAiCalled(fetchMock)).toBe(true);
  });

  it("allows a free high-admin account (admin_level >= 9) into the conversation path", async () => {
    const fetchMock = routedFetch({
      isPremium: false,
      adminLevel: 9,
      reply: "Welcome back. What role are you applying for?",
    });
    vi.stubGlobal("fetch", fetchMock);
    const { handler } = await import("../api-mercy-ai");

    const response = await handler(conversationEvent());

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body ?? "{}")).toMatchObject({
      reply: "Welcome back. What role are you applying for?",
      provider: "openai",
    });
    expect(openAiCalled(fetchMock)).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://project.supabase.co/rest/v1/profiles?select=admin_level&id=eq.user-1&limit=1",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("fails closed when OpenAI returns no generated Mercy reply", async () => {
    const fetchMock = routedFetch({ isPremium: true, adminLevel: 0, reply: "" });
    vi.stubGlobal("fetch", fetchMock);
    const { handler } = await import("../api-mercy-ai");

    const response = await handler(conversationEvent());

    expect(response.statusCode).toBe(502);
    expect(JSON.parse(response.body ?? "{}")).toEqual({
      error: "OpenAI response missing generated Mercy reply",
    });
    expect(openAiCalled(fetchMock)).toBe(true);
  });
});
