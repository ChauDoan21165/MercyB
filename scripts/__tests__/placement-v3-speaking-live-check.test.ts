import { describe, expect, it } from "vitest";

import {
  assertSafeLiveCheckEnv,
  isProductionLikeSupabaseUrl,
  recoveryStateFromProviderBody,
} from "../placement-v3-speaking-live-check";

describe("placement v3 speaking live-check safety guards", () => {
  it("refuses production execution", () => {
    const result = assertSafeLiveCheckEnv({
      NODE_ENV: "production",
      PLACEMENT_V3_SPEAKING_LIVE_CHECK: "1",
      PLACEMENT_V3_VALIDATION_ENV: "validation",
      AZURE_SPEECH_KEY: "key",
    });
    expect(result).toEqual({
      ok: false,
      reason: "Refusing Placement V3 speaking live-check in production env.",
    });
  });

  it("refuses without explicit live-check marker", () => {
    const result = assertSafeLiveCheckEnv({
      PLACEMENT_V3_VALIDATION_ENV: "validation",
      AZURE_SPEECH_KEY: "key",
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("PLACEMENT_V3_SPEAKING_LIVE_CHECK=1");
  });

  it("refuses without validation environment marker", () => {
    const result = assertSafeLiveCheckEnv({
      PLACEMENT_V3_SPEAKING_LIVE_CHECK: "1",
      AZURE_SPEECH_KEY: "key",
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("PLACEMENT_V3_VALIDATION_ENV");
  });

  it("refuses without Azure Speech key", () => {
    const result = assertSafeLiveCheckEnv({
      PLACEMENT_V3_SPEAKING_LIVE_CHECK: "1",
      PLACEMENT_V3_VALIDATION_ENV: "validation",
    });
    expect(result).toEqual({
      ok: false,
      reason: "Refusing live-check without AZURE_SPEECH_KEY.",
    });
  });

  it("refuses production-like Supabase URLs", () => {
    expect(isProductionLikeSupabaseUrl("https://buemdfxyhxunzpgdoqin.supabase.co")).toBe(true);
    const result = assertSafeLiveCheckEnv({
      PLACEMENT_V3_SPEAKING_LIVE_CHECK: "1",
      PLACEMENT_V3_VALIDATION_ENV: "validation",
      AZURE_SPEECH_KEY: "key",
      SUPABASE_URL: "https://buemdfxyhxunzpgdoqin.supabase.co",
    });
    expect(result).toEqual({
      ok: false,
      reason: "Refusing production-like Supabase URL for live-check.",
    });
  });

  it("allows explicit local validation with Azure key and non-production Supabase URL", () => {
    const result = assertSafeLiveCheckEnv({
      PLACEMENT_V3_SPEAKING_LIVE_CHECK: "1",
      PLACEMENT_V3_VALIDATION_ENV: "local",
      AZURE_SPEECH_KEY: "key",
      SUPABASE_URL: "http://127.0.0.1:54321",
    });
    expect(result).toEqual({ ok: true });
  });

  it("maps Azure timeout sentinel to learner-visible retry state", () => {
    const recovery = recoveryStateFromProviderBody({
      ok: false,
      use_local: true,
      reason: "azure_timeout",
    });
    expect(recovery.timeout_fallback_status).toEqual({
      fallback: true,
      errorCode: "timeout",
      providerTimeout: true,
      retryable: true,
      recoverable: true,
      reason: "azure_timeout",
    });
    expect(recovery.learner_visible_recovery_state).toMatchObject({
      can_retry: true,
      metadata: {
        fallback: true,
        errorCode: "timeout",
        providerTimeout: true,
        retryable: true,
        recoverable: true,
      },
    });
  });
});
