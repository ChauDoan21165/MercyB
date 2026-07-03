import { describe, expect, it } from "vitest";
import { buildAudioDecisionEvidence } from "../dp/audio";
import { judgeReplayTeachingCase000001, runTeachingCaseAudioPipeline } from "../judge/replay";
import { buildListeningAttemptMemory } from "../lm/audio";
import { createObservationPacket } from "../obs/evidencePacket";
import { LINH_AUDIO_FAILURE_REPLAY, replayObservationScenario } from "../obs/replay";
import type { ObservationFact, ObservationPacket } from "../obs/types";
import { buildAudioPedDecision } from "../ped/audio";

const OBSERVED_AT = "2026-07-03T00:00:00.000Z";

function packetFor(facts: ObservationFact[]): ObservationPacket {
  return createObservationPacket(facts, OBSERVED_AT);
}

function audioFact(factType: ObservationFact["factType"], metrics?: Record<string, number>): ObservationFact {
  return {
    capabilityId:
      factType === "AudioUnavailable"
        ? "OBS-AUDIO-000001"
        : factType === "AudioDurationZero"
          ? "OBS-AUDIO-000002"
          : factType === "AudioPlaybackFailed"
            ? "OBS-AUDIO-000003"
            : "OBS-AUDIO-000004",
    factType,
    severity: factType === "AudioReplayCount" ? "info" : "failure",
    observedAt: OBSERVED_AT,
    context: {
      route: "/placement/test/:sessionId",
      taskId: "listening-a2-class-delay-1",
      requestedUrl: "/audio/placement-v3/listening-a2-class-delay-1.mp3",
    },
    metrics,
    message: `${factType} observed.`,
  };
}

describe("TC-000001 Placement Audio Unavailable vertical slice", () => {
  it("DP emits product failure evidence for audio unavailable", () => {
    const dp = buildAudioDecisionEvidence(packetFor([audioFact("AudioUnavailable")]), OBSERVED_AT);

    expect(dp.evidence[0]).toMatchObject({
      tmIntId: "DP-AUDIO-000001",
      reason: "product_failure_audio",
      confidence: 0.99,
      placement_validity: "invalid_listening",
      teacher_action: "retest_required",
    });
  });

  it("DP emits product failure evidence for duration zero", () => {
    const dp = buildAudioDecisionEvidence(packetFor([audioFact("AudioDurationZero", { durationSeconds: 0 })]), OBSERVED_AT);

    expect(dp.evidence).toHaveLength(1);
    expect(dp.evidence[0]?.sourceFacts[0]?.factType).toBe("AudioDurationZero");
    expect(dp.evidence[0]?.sourceFacts[0]?.metrics).toEqual({ durationSeconds: 0 });
  });

  it("DP consumes playback failure as product audio failure", () => {
    const dp = buildAudioDecisionEvidence(packetFor([audioFact("AudioPlaybackFailed")]), OBSERVED_AT);

    expect(dp.evidence).toHaveLength(1);
    expect(dp.evidence[0]?.reason).toBe("product_failure_audio");
  });

  it("PED and LM produce required teacher decision and invalid listening attempt", () => {
    const dp = buildAudioDecisionEvidence(packetFor([audioFact("AudioUnavailable")]), OBSERVED_AT);
    const ped = buildAudioPedDecision(dp, OBSERVED_AT);
    const lm = buildListeningAttemptMemory(ped, OBSERVED_AT);

    expect(ped.decisions[0]).toMatchObject({
      tmIntId: "PED-AUDIO-000001",
      exclude_listening_score: true,
      offer_retest: true,
      continue_remaining_sections: true,
      show_support_message: true,
    });
    expect(lm.listeningAttempts[0]).toMatchObject({
      tmIntId: "LM-AUDIO-000001",
      status: "invalid",
      reason: "product_failure",
      retest_pending: true,
    });
  });

  it("Linh replay passes deterministic Judge hook without inferring weak listening", () => {
    const obs = replayObservationScenario(LINH_AUDIO_FAILURE_REPLAY, OBSERVED_AT);
    const judge = judgeReplayTeachingCase000001(obs);
    const output = JSON.stringify(judge.first);

    expect(judge.pass).toBe(true);
    expect(judge.deterministic).toBe(true);
    expect(judge.failures).toEqual([]);
    expect(judge.first.dp.evidence[0]?.reason).toBe("product_failure_audio");
    expect(judge.first.ped.decisions[0]?.exclude_listening_score).toBe(true);
    expect(judge.first.lm.listeningAttempts[0]?.status).toBe("invalid");
    expect(output).not.toMatch(/weak listening|poor learner|bad comprehension|weakness/i);
    expect(output).not.toMatch(/"verified":true/i);
  });

  it("normal audio observation does not invalidate listening", () => {
    const packet = packetFor([audioFact("AudioReplayCount", { replayCount: 1 })]);
    const output = runTeachingCaseAudioPipeline(packet);
    const judge = judgeReplayTeachingCase000001(packet);

    expect(output.dp.evidence).toEqual([]);
    expect(output.ped.decisions).toEqual([]);
    expect(output.lm.listeningAttempts).toEqual([]);
    expect(judge.pass).toBe(true);
  });

  it("regression: product failures never reduce learner listening ability", () => {
    const obs = packetFor([
      audioFact("AudioUnavailable"),
      audioFact("AudioDurationZero", { durationSeconds: 0 }),
      audioFact("AudioPlaybackFailed"),
    ]);
    const judge = judgeReplayTeachingCase000001(obs);
    const text = JSON.stringify(judge);

    expect(judge.pass).toBe(true);
    expect(text).toContain("product_failure_audio");
    expect(text).toContain("invalid_listening");
    expect(text).not.toMatch(/weak listening|poor comprehension|bad comprehension|poor learner|ability.*reduced/i);
  });
});
