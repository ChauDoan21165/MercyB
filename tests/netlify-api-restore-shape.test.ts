import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { handler as ttsHandler } from "../netlify/functions/api-tts";

const root = process.cwd();

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function ttsEvent(body: Record<string, unknown>) {
  return {
    httpMethod: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

describe("Netlify API restore shape", () => {
  it("routes all dark /api endpoints to Netlify Functions", () => {
    const toml = read("netlify.toml");
    for (const route of [
      "/api/tts",
      "/api/mercy/grammar",
      "/api/mercy-ai",
      "/api/mercy-feedback",
    ]) {
      expect(toml).toContain(`from = "${route}"`);
    }
    expect(toml).toContain('functions = "netlify/functions"');
    expect(toml).toContain('to = "/.netlify/functions/api-mercy-ai"');
    expect(toml).not.toContain('to = "/.netlify/functions/mercy-ai"');
    expect(toml).not.toContain('function = "mercy-ai-proxy"');
  });

  it("uploads Netlify Functions during manual production deploy", () => {
    const ci = read(".gitlab-ci.yml");
    expect(ci).toContain("netlify-cli deploy");
    expect(ci).toContain("--dir=dist");
    expect(ci).toContain("--functions=netlify/functions");
    expect(ci).toContain("--skip-functions-cache");
  });

  it("restores /api/tts through Azure-first mercy-tts instead of direct ElevenLabs", () => {
    const tts = read("netlify/functions/api-tts.ts");
    expect(tts).toContain("/functions/v1/mercy-tts");
    expect(tts).not.toContain("api.elevenlabs.io");
    expect(tts).toContain('language: upstreamLanguage');
    expect(tts).toContain('"vi-VN-HoaiMyNeural"');
    expect(tts).toContain('payload.provider !== "azure"');
  });

  it("does not introduce service-role use except the feedback insert sink", () => {
    const files = fs
      .readdirSync(path.join(root, "netlify/functions"))
      .filter((name) => name.endsWith(".ts"));
    const serviceRoleFiles = files.filter((name) =>
      read(`netlify/functions/${name}`).includes("SUPABASE_SERVICE_ROLE_KEY"),
    );
    expect(serviceRoleFiles).toEqual(["api-mercy-feedback.ts"]);
  });

  it("keeps grammar flag lookup on the masked public view", () => {
    const grammar = read("netlify/functions/api-mercy-grammar.ts");
    expect(grammar).toContain('.from("feature_flags_public")');
    expect(grammar).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("keeps speak follow-up support on the restored /api/mercy-ai function", () => {
    const mercyAi = read("netlify/functions/api-mercy-ai.ts");
    expect(mercyAi).toContain('norm(body.mode) === "speak-follow-up"');
    expect(mercyAi).toContain("buildDeepSeekSpeakFollowUp");
  });
});

describe("Netlify /api/tts retry + never-raw-502 (parity with Pages handler)", () => {
  const ORIGINAL = { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_ANON_KEY };
  afterEach(() => {
    process.env.SUPABASE_URL = ORIGINAL.url;
    process.env.SUPABASE_ANON_KEY = ORIGINAL.key;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });
  function withEnv() {
    process.env.SUPABASE_URL = "https://project.supabase.co";
    process.env.SUPABASE_ANON_KEY = "anon-key";
  }

  it("recovers a transient Vietnamese Azure miss on the retry (200, no 502)", async () => {
    withEnv();
    const flaky = vi.fn()
      .mockResolvedValueOnce(Response.json({ audioUrl: "data:audio/mpeg;base64,SUQzBAAA", provider: "elevenlabs" }))
      .mockResolvedValueOnce(Response.json({ audioUrl: "data:audio/mpeg;base64,SUQzBAAA", provider: "azure" }));
    vi.stubGlobal("fetch", flaky);

    const res = await ttsHandler(ttsEvent({ text: "Xin chao", language: "vi" }));

    expect(res.statusCode).toBe(200);
    expect(flaky).toHaveBeenCalledTimes(2);
  });

  it("resolves a mercy-tts CACHE-HIT https Storage audioUrl into streamed audio (not a 503)", async () => {
    withEnv();
    const CACHE_URL = "https://proj.supabase.co/storage/v1/object/public/room-audio/tts-cache/abc.mp3";
    const fetchMock = vi.fn(async (url: unknown) => {
      const u = String(url);
      if (u.includes("/functions/v1/mercy-tts")) {
        return Response.json({ audioUrl: CACHE_URL, provider: "azure", cached: true });
      }
      return new Response(new Uint8Array([0x49, 0x44, 0x33, 0x04]), {
        status: 200,
        headers: { "Content-Type": "audio/mpeg" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await ttsHandler(ttsEvent({ text: "Xin chao", language: "vi" }));

    expect(res.statusCode).toBe(200);
    expect(fetchMock.mock.calls.some(([u]) => String(u) === CACHE_URL)).toBe(true);
  });

  it("returns a typed retryable 503 (never a raw 502) on persistent non-Azure Vietnamese", async () => {
    withEnv();
    const persistent = vi.fn(async () =>
      Response.json({ audioUrl: "data:audio/mpeg;base64,SUQzBAAA", provider: "elevenlabs" }));
    vi.stubGlobal("fetch", persistent);

    const res = await ttsHandler(ttsEvent({ text: "Xin chao", language: "vi" }));

    expect(res.statusCode).toBe(503);
    expect(persistent).toHaveBeenCalledTimes(2);
    expect(JSON.parse(res.body ?? "{}")).toMatchObject({ ok: false, retryable: true });
  });

  it("passes a 4xx auth error through without retrying", async () => {
    withEnv();
    const unauthorized = vi.fn(async () => Response.json({ error: "Invalid JWT" }, { status: 401 }));
    vi.stubGlobal("fetch", unauthorized);

    const res = await ttsHandler(ttsEvent({ text: "Hello", language: "en" }));

    expect(res.statusCode).toBe(401);
    expect(unauthorized).toHaveBeenCalledTimes(1);
    expect(JSON.parse(res.body ?? "{}")).toMatchObject({ ok: false, retryable: false });
  });
});
