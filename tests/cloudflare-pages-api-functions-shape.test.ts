import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

describe("Cloudflare Pages API function shape", () => {
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
    expect(tts).toContain("/functions/v1/mercy-tts");
    expect(tts).toContain("language.toLowerCase().split");
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

  it("keeps grammar flag lookup on the masked public view", () => {
    const grammar = read("functions/api/mercy/grammar.ts");
    expect(grammar).toContain('.from("feature_flags_public")');
    expect(grammar).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("keeps speak follow-up support on the Pages mercy-ai function", () => {
    const mercyAi = read("functions/api/mercy-ai.ts");
    expect(mercyAi).toContain('norm(body.mode) === "speak-follow-up"');
    expect(mercyAi).toContain("buildDeepSeekSpeakFollowUp");
  });
});
