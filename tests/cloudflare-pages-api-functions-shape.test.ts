import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { onRequestGet as feedbackOnRequestGet } from "../functions/api/mercy-feedback";
import { onRequestGet as grammarOnRequestGet } from "../functions/api/mercy/grammar";
import { onRequestPost as ttsOnRequestPost } from "../functions/api/tts";

const root = process.cwd();

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function ttsContext(body: Record<string, unknown>) {
  return {
    request: new Request("https://example.test/api/tts", {
      method: "POST",
      headers: { authorization: "Bearer user-token" },
      body: JSON.stringify(body),
    }),
    env: {
      SUPABASE_URL: "https://supabase.test",
      SUPABASE_ANON_KEY: "anon",
    },
  };
}

describe("Cloudflare Pages API function shape", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses a root functions directory with the four live API routes", () => {
    const stat = fs.statSync(path.join(root, "functions"));
    expect(stat.isDirectory()).toBe(true);

    for (const rel of [
      "functions/api/tts.ts",
      "functions/api/mercy/grammar.ts",
      "functions/api/mercy-ai.ts",
      "functions/api/mercy-feedback.ts",
    ]) {
      expect(fs.existsSync(path.join(root, rel))).toBe(true);
    }
  });

  it("keeps Pages TTS Azure-first through mercy-tts and not ElevenLabs-direct", () => {
    const tts = read("functions/api/tts.ts");
    expect(tts).toContain("export async function onRequestPost");
    expect(tts).not.toContain("export async function onRequest(");
    expect(tts).toContain("/functions/v1/mercy-tts");
    expect(tts).toContain('language: upstreamLanguage');
    expect(tts).toContain('"vi-VN-HoaiMyNeural"');
    expect(tts).toContain('payload.provider !== "azure"');
    expect(tts).not.toContain("ELEVENLABS_API_KEY");
    expect(tts).not.toContain("api.elevenlabs.io");
  });

  it("limits service-role use to the feedback insert sink", () => {
    const apiFiles = [
      "functions/api/tts.ts",
      "functions/api/mercy/grammar.ts",
      "functions/api/mercy-ai.ts",
      "functions/api/mercy-feedback.ts",
    ];
    const serviceRoleFiles = apiFiles.filter((rel) => read(rel).includes("SUPABASE_SERVICE_ROLE_KEY"));
    expect(serviceRoleFiles).toEqual(["functions/api/mercy-feedback.ts"]);
  });

  it("uses method-specific exports for every live Pages API route", () => {
    for (const rel of [
      "functions/api/tts.ts",
      "functions/api/mercy/grammar.ts",
      "functions/api/mercy-ai.ts",
      "functions/api/mercy-feedback.ts",
    ]) {
      const source = read(rel);
      expect(source).toContain("export async function onRequestPost");
      expect(source).toContain("export function onRequestOptions");
      expect(source).not.toContain("export async function onRequest(");
    }
  });

  it("preserves non-POST JSON contracts for remaining Pages blockers", async () => {
    const feedback = await feedbackOnRequestGet({
      request: new Request("https://example.test/api/mercy-feedback"),
      env: {},
    });
    await expect(feedback.json()).resolves.toMatchObject({
      ok: false,
      acceptedCount: 0,
      error: "method_not_allowed",
    });
    expect(feedback.status).toBe(405);

    const grammar = await grammarOnRequestGet({
      request: new Request("https://example.test/api/mercy/grammar"),
      env: {},
    });
    await expect(grammar.json()).resolves.toMatchObject({
      ok: false,
      error: "Method not allowed",
    });
    expect(grammar.status).toBe(405);
    expect(grammar.headers.get("Allow")).toBe("POST");
  });

  it("keeps grammar flag lookup on the masked public view", () => {
    const grammar = read("functions/api/mercy/grammar.ts");
    expect(grammar).toContain('.from("feature_flags_public")');
    expect(grammar).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("keeps speak follow-up support on the Pages mercy-ai function", () => {
    const mercyAi = read("functions/api/mercy-ai.ts");
    expect(mercyAi).toContain("export async function onRequestPost");
    expect(mercyAi).not.toContain("export async function onRequest(");
    expect(mercyAi).toContain('norm(body.mode) === "speak-follow-up"');
    expect(mercyAi).toContain('norm(body.mode) === "ai-conversation-turn"');
    expect(mercyAi).toContain("buildDeepSeekSpeakFollowUp");
    expect(mercyAi).toContain("buildAiConversationTurn");
    expect(mercyAi).toContain("env,");
    expect(mercyAi).not.toContain("process.env");
  });

  it("routes Vietnamese Pages TTS to Azure vi-VN and rejects non-Azure Vietnamese audio", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        audioUrl: "data:audio/mpeg;base64,SUQzBAAA",
        provider: "azure",
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await ttsOnRequestPost(ttsContext({
      text: "Xin chao",
      language: "vi",
      voiceId: "english-legacy-voice",
    }));

    expect(response.status).toBe(200);
    const upstreamBody = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(upstreamBody).toMatchObject({
      text: "Xin chao",
      language: "vi-VN",
      voice_id: "vi-VN-HoaiMyNeural",
    });
    expect(upstreamBody.voice_id).not.toBe("english-legacy-voice");

    fetchMock.mockResolvedValueOnce(Response.json({
      audioUrl: "data:audio/mpeg;base64,SUQzBAAA",
      provider: "elevenlabs",
    }));
    const rejected = await ttsOnRequestPost(ttsContext({
      text: "Xin chao",
      language: "vi-VN",
      voice_id: "english-legacy-voice",
    }));
    expect(rejected.status).toBe(502);
    await expect(rejected.json()).resolves.toMatchObject({
      ok: false,
      error: "Vietnamese TTS requires Azure vi-VN",
      provider: "elevenlabs",
    });
  });
});
