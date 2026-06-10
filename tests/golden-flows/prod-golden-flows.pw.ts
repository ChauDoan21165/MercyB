import { expect, test, type APIRequestContext } from "@playwright/test";

const BASE_URL = process.env.GOLDEN_FLOW_BASE_URL ?? "https://mercyblade.com";
const PREMIUM_JWT = process.env.GOLDEN_FLOW_PREMIUM_JWT ?? "";
const FREE_JWT = process.env.GOLDEN_FLOW_FREE_JWT ?? "";
const ALLOW_MISSING_SECRETS = process.env.GOLDEN_FLOW_ALLOW_MISSING_SECRETS === "1";

function requireToken(name: string, value: string): string {
  if (!value && !ALLOW_MISSING_SECRETS) {
    throw new Error(`${name} is required for production golden-flow verification.`);
  }
  return value;
}

function textFromJson(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  return [record.reply, record.text, record.message, record.error]
    .filter((item): item is string => typeof item === "string")
    .join("\n");
}

function normalizeForCannedCheck(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

async function postLearnerLedConversationTurn(
  request: APIRequestContext,
  learnerText: string,
) {
  return request.post(`${BASE_URL}/api/mercy-ai`, {
    headers: {
      Authorization: `Bearer ${requireToken("GOLDEN_FLOW_PREMIUM_JWT", PREMIUM_JWT)}`,
    },
    data: {
      mode: "ai-conversation-turn",
      learnerText,
      scenarioId: "learner-led",
      scenario: {
        id: "learner-led",
        title: "Learner-led conversation",
        themeContext: "The learner chooses the practical English situation from their own message.",
        learnerRole: "The learner explains a real situation they need to handle.",
        aiRole: "Mercy follows the learner's stated situation and asks one useful next question.",
        topicBoundaries: [
          "Follow the learner's latest message.",
          "Do not switch to job interview practice unless the learner asks for it.",
        ],
        l1InterferenceNotes: [],
      },
      history: [],
      turnCount: 0,
    },
  });
}

test.describe.serial("production golden flows", () => {
  test("TTS: Vietnamese text returns Azure audio, never silent fallback", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/tts`, {
      data: {
        text: "Xin chào, tôi cần luyện nghe tiếng Việt hôm nay.",
        language: "vi",
      },
    });

    expect(response.status(), await response.text()).toBe(200);
    expect(response.headers()["content-type"] ?? "").toMatch(/^audio\//);
    expect(response.headers()["x-tts-provider"]).toBe("azure");
    expect(response.headers()["x-tts-fallback-reason"]).toBeUndefined();
    expect((await response.body()).byteLength).toBeGreaterThan(100);
  });

  test("FOLLOW: opener varies across sessions and builds on learner context", async ({ request }) => {
    test.skip(ALLOW_MISSING_SECRETS && !PREMIUM_JWT, "Missing GOLDEN_FLOW_PREMIUM_JWT in dry-run mode.");

    const landlordResponse = await postLearnerLedConversationTurn(
      request,
      "I need to call my landlord because the kitchen sink is leaking.",
    );
    const pharmacyResponse = await postLearnerLedConversationTurn(
      request,
      "I need to ask the pharmacy if my prescription refill is ready today.",
    );

    expect(landlordResponse.status(), await landlordResponse.text()).toBe(200);
    expect(pharmacyResponse.status(), await pharmacyResponse.text()).toBe(200);

    const landlordReply = textFromJson(await landlordResponse.json()).toLowerCase();
    const pharmacyReply = textFromJson(await pharmacyResponse.json()).toLowerCase();

    expect(landlordReply).toMatch(/landlord|sink|leak|kitchen|repair|maintenance/);
    expect(pharmacyReply).toMatch(/pharmacy|prescription|refill|medicine|ready/);

    expect(landlordReply).not.toMatch(/job interview|interviewer|candidate|resume|strengths/);
    expect(pharmacyReply).not.toMatch(/job interview|interviewer|candidate|resume|strengths/);
    expect(normalizeForCannedCheck(landlordReply)).not.toBe(normalizeForCannedCheck(pharmacyReply));
  });

  test("GATE: free account is blocked before processing and gets no Mercy speech", async ({ request }) => {
    test.skip(ALLOW_MISSING_SECRETS && !FREE_JWT, "Missing GOLDEN_FLOW_FREE_JWT in dry-run mode.");

    const response = await request.post(`${BASE_URL}/api/mercy-ai`, {
      headers: {
        Authorization: `Bearer ${requireToken("GOLDEN_FLOW_FREE_JWT", FREE_JWT)}`,
      },
      data: {
        mode: "ai-conversation-turn",
        learnerText: "I want to practice asking a neighbor for help carrying a package.",
        scenarioId: "learner-led",
        turnCount: 0,
      },
    });

    expect(response.status(), await response.text()).toBe(403);
    const body = await response.json();
    const message = textFromJson(body);

    expect(message).toMatch(/premium required/i);
    expect(body).not.toHaveProperty("reply");
    expect(body).not.toHaveProperty("cost");
  });
});
