import { describe, expect, it } from "vitest";
import { buildSpeechDecisionEvidence } from "../dp/speech";
import { judgeReplayTeachingCase000002, runTeachingCaseSpeechPipeline } from "../judge/replay";
import { buildSpeakingAttemptMemory } from "../lm/speech";
import { createObservationPacket } from "../obs/evidencePacket";
import type { ObservationFact, ObservationPacket } from "../obs/types";
import { buildSpeechPedDecision } from "../ped/speech";

const OBSERVED_AT = "2026-07-03T00:00:00.000Z";

function packetFor(facts: ObservationFact[]): ObservationPacket {
  return createObservationPacket(facts, OBSERVED_AT);
}

function speechFact(factType: "MicPermissionDenied" | "SpeechTimeout", metrics?: Record<string, number>): ObservationFact {
  return {
    capabilityId: factType === "MicPermissionDenied" ? "OBS-SPEECH-000001" : "OBS-SPEECH-000002",
    factType,
    severity: "warning",
    observedAt: OBSERVED_AT,
    context: {
      route: "/placement/test/:sessionId",
      taskId: "speaking-a2-intro-1",
      learnerAction: "answered",
    },
    metrics,
    message: `${factType} observed.`,
  };
}

function normalSpeechPacket(): ObservationPacket {
  return packetFor([
    {
      capabilityId: "OBS-LEARNING-000001",
      factType: "RetryObserved",
      severity: "info",
      observedAt: OBSERVED_AT,
      context: { route: "/placement/test/:sessionId", taskId: "speaking-a2-intro-1" },
      message: "Non-speech-blocking fact.",
    },
  ]);
}

describe("TC-000002 Microphone Denied During Speaking", () => {
  it("DP emits product_or_permission_block for microphone denied", () => {
    const dp = buildSpeechDecisionEvidence(packetFor([speechFact("MicPermissionDenied")]), OBSERVED_AT);

    expect(dp.evidence[0]).toMatchObject({
      tmIntId: "DP-SPEECH-000001",
      reason: "product_or_permission_block",
      confidence: "high",
      speaking_result_validity: "invalid_speaking",
    });
  });

  it("DP treats speech timeout as speech unavailable without learner inference", () => {
    const dp = buildSpeechDecisionEvidence(packetFor([speechFact("SpeechTimeout", { timeoutMs: 5000 })]), OBSERVED_AT);
    const text = JSON.stringify(dp);

    expect(dp.evidence).toHaveLength(1);
    expect(dp.evidence[0]?.sourceFacts[0]?.factType).toBe("SpeechTimeout");
    expect(dp.evidence[0]?.sourceFacts[0]?.metrics).toEqual({ timeoutMs: 5000 });
    expect(text).not.toMatch(/poor pronunciation|weak speaking|weakness/i);
  });

  it("PED allows Linh-style text fallback and mic retry while continuing", () => {
    const dp = buildSpeechDecisionEvidence(packetFor([speechFact("MicPermissionDenied")]), OBSERVED_AT);
    const ped = buildSpeechPedDecision(dp, OBSERVED_AT);

    expect(ped.decisions[0]).toMatchObject({
      tmIntId: "PED-SPEECH-000001",
      exclude_speaking_score: true,
      offer_text_fallback: true,
      offer_mic_retry: true,
      continue_remaining_sections: true,
      show_supportive_message: true,
    });
  });

  it("LM stores invalid SpeakingAttempt without lowering speaking ability", () => {
    const dp = buildSpeechDecisionEvidence(packetFor([speechFact("MicPermissionDenied")]), OBSERVED_AT);
    const ped = buildSpeechPedDecision(dp, OBSERVED_AT);
    const lm = buildSpeakingAttemptMemory(ped, OBSERVED_AT);
    const text = JSON.stringify(lm);

    expect(lm.speakingAttempts[0]).toMatchObject({
      tmIntId: "LM-SPEECH-000001",
      status: "invalid",
      reason: "mic_permission_or_device_block",
      retest_pending: true,
    });
    expect(text).not.toMatch(/poor pronunciation|weak speaking|ability.*reduced|weakness/i);
  });

  it("normal speaking available does not trigger invalidation", () => {
    const output = runTeachingCaseSpeechPipeline(normalSpeechPacket());
    const judge = judgeReplayTeachingCase000002(normalSpeechPacket());

    expect(output.dp.evidence).toEqual([]);
    expect(output.ped.decisions).toEqual([]);
    expect(output.lm.speakingAttempts).toEqual([]);
    expect(judge.pass).toBe(true);
  });

  it("Judge replay is deterministic for microphone denied", () => {
    const judge = judgeReplayTeachingCase000002(packetFor([speechFact("MicPermissionDenied")]));

    expect(judge.pass).toBe(true);
    expect(judge.deterministic).toBe(true);
    expect(judge.failures).toEqual([]);
    expect(judge.first.dp.evidence[0]?.reason).toBe("product_or_permission_block");
    expect(judge.first.ped.decisions[0]?.offer_text_fallback).toBe(true);
    expect(judge.first.lm.speakingAttempts[0]?.status).toBe("invalid");
  });

  it("regression: speech blocks never become poor pronunciation or weak speaking", () => {
    const judge = judgeReplayTeachingCase000002(packetFor([
      speechFact("MicPermissionDenied"),
      speechFact("SpeechTimeout", { timeoutMs: 5000 }),
    ]));
    const text = JSON.stringify(judge);

    expect(judge.pass).toBe(true);
    expect(text).toContain("product_or_permission_block");
    expect(text).toContain("invalid_speaking");
    expect(text).not.toMatch(/poor pronunciation|weak speaking|poor learner|ability.*reduced|weakness/i);
    expect(text).not.toMatch(/"verified":true/i);
  });
});
