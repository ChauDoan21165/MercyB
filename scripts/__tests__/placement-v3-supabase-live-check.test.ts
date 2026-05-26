import { describe, expect, it } from "vitest";

import { parseBurnInArgs, runBurnIn } from "../placement-v3/supabase-burnin.ts";
import {
  LiveCheckSafetyError,
  assertCleanupNamespace,
  assertLiveCheckSafety,
  isProductionSupabaseUrl,
  resolveLiveCheckConfig,
  runPlacementV3SupabaseLiveCheck,
} from "../placement-v3/supabase-live-check.ts";

const safeEnv = {
  PLACEMENT_V3_SUPABASE_LIVE_CHECK: "1",
  PLACEMENT_V3_SUPABASE_VALIDATION_ENV: "validation",
  PLACEMENT_V3_SUPABASE_VALIDATION_EMAIL: "placement-v3-test-validation@mercyblade.test",
  SUPABASE_URL: "https://placement-validation.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key-for-test",
  NODE_ENV: "test",
};

describe("placement v3 Supabase live-check safety", () => {
  it("accepts an explicitly marked validation environment", () => {
    expect(() => assertLiveCheckSafety(safeEnv)).not.toThrow();
    expect(resolveLiveCheckConfig(safeEnv, { dryRun: true }).validationEnv).toBe("validation");
  });

  it("refuses production runtime markers and production-like URLs", () => {
    expect(() => assertLiveCheckSafety({ ...safeEnv, NODE_ENV: "production" })).toThrow(/NODE_ENV=production/);
    expect(() => assertLiveCheckSafety({ ...safeEnv, VERCEL_ENV: "production" })).toThrow(/VERCEL_ENV=production/);
    expect(isProductionSupabaseUrl("https://buemdfxyhxunzpgdoqin.supabase.co")).toBe(true);
    expect(() => assertLiveCheckSafety({ ...safeEnv, SUPABASE_URL: "https://buemdfxyhxunzpgdoqin.supabase.co" })).toThrow(/production Supabase URL/);
  });

  it("refuses missing markers and credentials", () => {
    expect(() => assertLiveCheckSafety({ ...safeEnv, PLACEMENT_V3_SUPABASE_LIVE_CHECK: "" })).toThrow(LiveCheckSafetyError);
    expect(() => assertLiveCheckSafety({
      PLACEMENT_V3_SUPABASE_LIVE_CHECK: "",
      PLACEMENT_V3_SUPABASE_VALIDATION_ENV: "",
      SUPABASE_URL: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
    })).toThrow(/PLACEMENT_V3_SUPABASE_LIVE_CHECK, PLACEMENT_V3_SUPABASE_VALIDATION_ENV, SUPABASE_URL or VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY/);
  });

  it("refuses cleanup outside validation-owned namespace", () => {
    expect(() => assertCleanupNamespace("chau@example.com")).toThrow(/Refusing cleanup/);
    expect(() => assertCleanupNamespace("placement-v3-test-validation@mercyblade.test")).not.toThrow();
  });
});

describe("placement v3 Supabase burn-in dry-run", () => {
  it("runs dry-run without live writes", async () => {
    const summary = await runBurnIn(parseBurnInArgs(["node", "script", "--dry-run", "--iterations=2", "--concurrency=2", "--json"]), safeEnv);
    expect(summary.ok).toBe(true);
    expect(summary.iterationsSucceeded).toBe(2);
    expect(summary.skippedLiveSegments).toContain("supabase-network");
  });

  it("tracks duplicate submit suppression", async () => {
    const summary = await runBurnIn(parseBurnInArgs(["node", "script", "--dry-run", "--iterations=1", "--inject=duplicate-submit", "--json"]), safeEnv);
    expect(summary.ok).toBe(true);
    expect(summary.duplicateSubmitsSuppressed).toBeGreaterThan(0);
  });

  it("tracks partial fallback metadata recovery", async () => {
    const summary = await runBurnIn(parseBurnInArgs(["node", "script", "--dry-run", "--iterations=1", "--inject=partial-fallback-metadata", "--json"]), safeEnv);
    expect(summary.ok).toBe(true);
    expect(summary.fallbackMetadataRecoveries).toBeGreaterThan(0);
  });

  it("tracks transient DB retry recovery and concurrent isolation", async () => {
    const summary = await runBurnIn(parseBurnInArgs(["node", "script", "--dry-run", "--iterations=4", "--concurrency=2", "--inject=transient-db-error", "--json"]), safeEnv);
    expect(summary.ok).toBe(true);
    expect(summary.sessionsCreated).toBe(4);
    expect(summary.retryRecoveries).toBe(4);
  });

  it("keeps JSON output shape stable", async () => {
    const summary = await runBurnIn(parseBurnInArgs(["node", "script", "--dry-run", "--iterations=1", "--json"]), safeEnv);
    expect(Object.keys(summary)).toEqual([
      "ok",
      "iterationsAttempted",
      "iterationsSucceeded",
      "iterationsFailed",
      "concurrentWorkers",
      "sessionsCreated",
      "responsesPersisted",
      "duplicateSubmitsSuppressed",
      "retryRecoveries",
      "fallbackMetadataRecoveries",
      "staleSessionsCleaned",
      "resultReloadRetries",
      "cleanupRowsRemoved",
      "p50PersistenceLatencyMs",
      "p95PersistenceLatencyMs",
      "skippedLiveSegments",
      "blockingFailures",
    ]);
  });

  it("returns non-ok on unrecovered persistence mismatch", async () => {
    const summary = await runBurnIn(parseBurnInArgs(["node", "script", "--dry-run", "--iterations=1", "--inject=missing-provider-metadata", "--json"]), safeEnv);
    expect(summary.ok).toBe(false);
    expect(summary.blockingFailures.join(" ")).toMatch(/provider metadata/);
  });

  it("live-check runner exposes result reload and cleanup metrics", async () => {
    const result = await runPlacementV3SupabaseLiveCheck(resolveLiveCheckConfig(safeEnv, {
      dryRun: true,
      cleanup: true,
      inject: ["stale-session", "result-reload"],
    }));
    expect(result.ok).toBe(true);
    expect(result.staleSessionsCleaned).toBeGreaterThan(0);
    expect(result.resultReloadRetries).toBe(1);
    expect(result.cleanupRowsRemoved).toBeGreaterThan(0);
  });
});
