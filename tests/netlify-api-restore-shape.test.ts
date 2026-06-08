import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf8");
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
  });

  it("restores /api/tts through Azure-first mercy-tts instead of direct ElevenLabs", () => {
    const tts = read("netlify/functions/api-tts.ts");
    expect(tts).toContain("/functions/v1/mercy-tts");
    expect(tts).not.toContain("api.elevenlabs.io");
    expect(tts).toContain("language.toLowerCase().split");
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
});
