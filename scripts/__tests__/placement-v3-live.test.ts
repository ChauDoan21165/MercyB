import { describe, expect, it } from "vitest";

import {
  assertLiveRunnerSafety,
  isValidationLearnerEmail,
  parseArgs,
  runPlacementV3Live,
} from "../placement-v3-live";

const safeEnv = {
  PLACEMENT_V3_VALIDATION_ENV: "validation",
  PLACEMENT_V3_LIVE_VALIDATION: "1",
  PLACEMENT_V3_VALIDATION_LEARNER_EMAIL: "placement-v3-test-123e4567-e89b-12d3-a456-426614174000@mercyblade.test",
};

describe("placement v3 live runner", () => {
  it("parses supported execution flags", () => {
    expect(parseArgs(["--dry-run", "--skip-speaking", "--cleanup"])).toEqual({
      dryRun: true,
      speakingOnly: false,
      skipSpeaking: true,
      cleanup: true,
    });
    expect(parseArgs(["--speaking-only"])).toMatchObject({ speakingOnly: true });
  });

  it("refuses production execution", () => {
    const result = assertLiveRunnerSafety({
      ...safeEnv,
      NODE_ENV: "production",
    }, safeEnv.PLACEMENT_V3_VALIDATION_LEARNER_EMAIL);
    expect(result).toEqual({
      ok: false,
      reason: "Refusing Placement V3 live validation in production env.",
    });
  });

  it("refuses missing validation markers", () => {
    expect(assertLiveRunnerSafety({}, safeEnv.PLACEMENT_V3_VALIDATION_LEARNER_EMAIL)).toEqual({
      ok: false,
      reason: "Refusing live validation without PLACEMENT_V3_LIVE_VALIDATION=1.",
    });
    expect(assertLiveRunnerSafety({
      PLACEMENT_V3_LIVE_VALIDATION: "1",
    }, safeEnv.PLACEMENT_V3_VALIDATION_LEARNER_EMAIL)).toEqual({
      ok: false,
      reason: "Refusing live validation without PLACEMENT_V3_VALIDATION_ENV=local|staging|validation.",
    });
  });

  it("refuses invalid learner namespace", () => {
    expect(isValidationLearnerEmail("chau@example.com")).toBe(false);
    expect(assertLiveRunnerSafety({
      PLACEMENT_V3_LIVE_VALIDATION: "1",
      PLACEMENT_V3_VALIDATION_ENV: "validation",
    }, "chau@example.com")).toEqual({
      ok: false,
      reason: "Refusing invalid validation learner namespace.",
    });
  });

  it("returns a no-write execution plan in dry-run mode", async () => {
    const summary = await runPlacementV3Live({
      dryRun: true,
      speakingOnly: false,
      skipSpeaking: false,
      cleanup: false,
    }, safeEnv);

    expect(summary.ok).toBe(true);
    expect(summary.dry_run).toBe(true);
    expect(summary.learner.created_or_resolved).toBe("planned");
    expect(summary.persistence_verification.mode).toBe("dry_run");
    expect(summary.persistence_verification.session_persisted).toBe(false);
    expect(summary.azure_speaking).toEqual({
      status: "skipped",
      reason: "missing_azure_speech_key",
    });
    expect(summary.skipped_validations).toContain("azure_speaking_live_check_missing_key");
  });

  it("executes the orchestration flow with memory persistence when Supabase env is absent", async () => {
    const summary = await runPlacementV3Live({
      dryRun: false,
      speakingOnly: false,
      skipSpeaking: true,
      cleanup: false,
    }, safeEnv);

    expect(summary.ok).toBe(true);
    expect(summary.persistence_verification.mode).toBe("memory");
    expect(summary.persistence_verification.session_persisted).toBe(true);
    expect(summary.persistence_verification.response_count).toBeGreaterThan(0);
    expect(summary.persistence_verification.profile_persisted).toBe(true);
    expect(summary.retry_idempotency).toEqual({
      duplicate_short_circuited: true,
      response_count_after_duplicate: 1,
    });
    expect(summary.provider_metadata.timeout_fallback_persisted).toBe(true);
    expect(summary.provider_metadata.fallback_metadata).toMatchObject({
      errorCode: "timeout",
      providerTimeout: true,
      retryable: true,
      recoverable: true,
    });
    expect(summary.azure_speaking).toEqual({
      status: "skipped",
      reason: "skip_speaking",
    });
  });

  it("skips Azure execution safely when key is absent", async () => {
    const summary = await runPlacementV3Live({
      dryRun: false,
      speakingOnly: false,
      skipSpeaking: false,
      cleanup: false,
    }, safeEnv);

    expect(summary.azure_speaking).toEqual({
      status: "skipped",
      reason: "missing_azure_speech_key",
    });
    expect(summary.skipped_validations).toContain("azure_speaking_live_check_missing_key");
  });

  it("supports speaking-only mode without running orchestration persistence", async () => {
    const summary = await runPlacementV3Live({
      dryRun: false,
      speakingOnly: true,
      skipSpeaking: true,
      cleanup: false,
    }, safeEnv);

    expect(summary.ok).toBe(true);
    expect(summary.session_lifecycle).toMatchObject({
      session_id: null,
      started: false,
      completed: false,
      final_state: "speaking_only",
    });
    expect(summary.persistence_verification).toMatchObject({
      session_persisted: false,
      response_count: 0,
      profile_persisted: false,
    });
    expect(summary.azure_speaking).toEqual({
      status: "skipped",
      reason: "skip_speaking",
    });
  });
});
