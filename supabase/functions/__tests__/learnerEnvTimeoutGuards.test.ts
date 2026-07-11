import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function fn(path: string): string {
  return readFileSync(join(root, "supabase/functions", path), "utf8");
}

describe("learner edge env and timeout hardening contracts", () => {
  it("room-chat logs exact required Supabase env names and bounds moderation fetch", () => {
    const source = fn("room-chat/index.ts");

    expect(source).toContain("[room-chat] Missing required env ${name}");
    expect(source).toContain("getRequiredEnv('SUPABASE_URL')");
    expect(source).toContain("getRequiredEnv('SUPABASE_ANON_KEY')");
    expect(source).toContain("getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY')");
    expect(source).toContain("const MODERATION_TIMEOUT_MS = 10_000");
    expect(source).toContain("new AbortController()");
    expect(source).toContain("signal: moderationController.signal");
    expect(source).toContain("[room-chat] content moderation timed out");
  });

  it("generate-matches logs exact required env names and bounds AI scoring fetch", () => {
    const source = fn("generate-matches/index.ts");

    expect(source).toContain("[generate-matches] Missing required env ${name}");
    expect(source).toContain("getRequiredEnv('SUPABASE_URL')");
    expect(source).toContain("getRequiredEnv('SUPABASE_ANON_KEY')");
    expect(source).toContain("getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY')");
    expect(source).toContain("getRequiredEnv('LOVABLE_API_KEY')");
    expect(source).toContain("const MATCH_AI_TIMEOUT_MS = 15_000");
    expect(source).toContain("new AbortController()");
    expect(source).toContain("signal: controller.signal");
    expect(source).toContain("[generate-matches] AI match scoring timed out");
  });
});
