import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  isProductionLikeSupabaseUrl,
  validateLiveCheckEnvironment,
} from "../placement-v3-speaking-live-check.mjs";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "../..");

describe("placement-v3 speaking live-check safety guards", () => {
  it("refuses execution without explicit markers and Azure key", () => {
    const result = validateLiveCheckEnvironment({});

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("missing PLACEMENT_V3_SPEAKING_LIVE_CHECK=1");
    expect(result.errors).toContain("missing PLACEMENT_V3_SPEAKING_LIVE_PROVIDER=azure");
    expect(result.errors).toContain("missing PLACEMENT_V3_SPEAKING_LIVE_ACK_NON_PROD=1");
    expect(result.errors).toContain("missing AZURE_SPEECH_KEY");
  });

  it("refuses production and production-like Supabase environments", () => {
    const result = validateLiveCheckEnvironment({
      NODE_ENV: "production",
      SUPABASE_URL: "https://abcd.supabase.co",
      PLACEMENT_V3_SPEAKING_LIVE_CHECK: "1",
      PLACEMENT_V3_SPEAKING_LIVE_PROVIDER: "azure",
      PLACEMENT_V3_SPEAKING_LIVE_ACK_NON_PROD: "1",
      AZURE_SPEECH_KEY: "key",
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("refusing production execution");
    expect(result.errors.join("\n")).toContain("refusing production-like Supabase URL");
  });

  it("allows explicit non-production validation markers", () => {
    const result = validateLiveCheckEnvironment({
      NODE_ENV: "test",
      SUPABASE_URL: "http://127.0.0.1:54321",
      PLACEMENT_V3_SPEAKING_LIVE_CHECK: "1",
      PLACEMENT_V3_SPEAKING_LIVE_PROVIDER: "azure",
      PLACEMENT_V3_SPEAKING_LIVE_ACK_NON_PROD: "1",
      AZURE_SPEECH_KEY: "key",
    });

    expect(result.ok).toBe(true);
  });

  it("classifies remote Supabase project URLs as production-like unless named non-production", () => {
    expect(isProductionLikeSupabaseUrl("https://abcd.supabase.co")).toBe(true);
    expect(isProductionLikeSupabaseUrl("https://dev-abcd.supabase.co")).toBe(false);
    expect(isProductionLikeSupabaseUrl("http://localhost:54321")).toBe(false);
  });

  it("the npm command fails closed when invoked without live validation env", () => {
    const result = spawnSync("node", ["scripts/placement-v3-speaking-live-check.mjs"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: { PATH: process.env.PATH ?? "" },
    });

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("[placement:v3:speaking:live-check] refused");
    expect(result.stderr).toContain("missing AZURE_SPEECH_KEY");
  });
});
