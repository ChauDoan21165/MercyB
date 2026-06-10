import { expect, test, type APIRequestContext } from "@playwright/test";

const BASE_URL = process.env.GOLDEN_FLOW_BASE_URL ?? "https://mercyblade.com";
const PREMIUM_JWT = process.env.GOLDEN_FLOW_PREMIUM_JWT ?? "";
const FREE_JWT = process.env.GOLDEN_FLOW_FREE_JWT ?? "";
const ALLOW_MISSING_SECRETS = process.env.GOLDEN_FLOW_ALLOW_MISSING_SECRETS === "1";
const EXPECTED_SUPABASE_HOST = new URL(
  process.env.GOLDEN_FLOW_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "https://buemdfxyhxunzpgdoqin.supabase.co",
).host;

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

function jsAssetPathsFrom(text: string): string[] {
  return Array.from(
    text.matchAll(/(?:src|href)="([^"]*\/assets\/[^"]+\.js)"|["'](\.?\/?assets\/[^"']+\.js|\.\/[^"'/]+\.js)["']/g),
    (match) => {
      const assetPath = match[1] || match[2];
      if (assetPath.startsWith("./")) return `assets/${assetPath.slice(2)}`;
      if (assetPath.startsWith("/")) return assetPath.slice(1);
      return assetPath;
    },
  );
}

function absoluteAssetUrl(assetPath: string): string {
  if (assetPath.startsWith("http")) return assetPath;
  return `${BASE_URL}${assetPath.startsWith("/") ? "" : "/"}${assetPath}`;
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

  test("AUTH CONFIG: signin bundle points at real Supabase and never placeholder", async ({ request }) => {
    test.setTimeout(180 * 1000);

    const response = await request.get(`${BASE_URL}/signin`);
    expect(response.status(), await response.text()).toBeLessThan(400);

    const html = await response.text();
    expect(html).not.toContain("placeholder.invalid");

    const pending = [...new Set(jsAssetPathsFrom(html))];
    const seen = new Set<string>();
    const bundledJs: string[] = [];

    expect(pending.length, "expected signin page to reference built JS assets").toBeGreaterThan(0);

    while (pending.length > 0) {
      const batch = pending.splice(0, 12).filter((assetPath) => {
        if (seen.has(assetPath)) return false;
        seen.add(assetPath);
        return true;
      });

      const fetched = await Promise.all(
        batch.map(async (assetPath) => {
          const assetUrl = absoluteAssetUrl(assetPath);
          const assetResponse = await request.get(assetUrl);
          expect(assetResponse.status(), `${assetUrl}\n${await assetResponse.text()}`).toBeLessThan(400);
          return assetResponse.text();
        }),
      );

      for (const js of fetched) {
        bundledJs.push(js);
        for (const discovered of jsAssetPathsFrom(js)) {
          if (!seen.has(discovered)) pending.push(discovered);
        }
      }
    }

    const joined = bundledJs.join("\n");
    expect(joined).not.toContain("placeholder.invalid");
    expect(joined).toContain(EXPECTED_SUPABASE_HOST);
  });
});
