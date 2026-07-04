import { describe, expect, it } from "vitest";
import { createObservationPacket } from "../../obs/evidencePacket";
import { detectAudioObservations } from "../../obs/detectors/audio";
import { detectLearningObservation } from "../../obs/detectors/learning";
import { detectSpeechObservations } from "../../obs/detectors/speech";
import { buildTeacherContext } from "../contextBuilder";
import { observationPacketFromAudio, observationPacketFromLearning, observationPacketFromSpeech } from "../runtimeHooks";

const OBSERVED_AT = "2026-07-03T00:00:00.000Z";

function answer(taskId: string, responseTimeMs: number, correct: boolean) {
  return detectLearningObservation({ action: "answer", route: "/placement/test/:sessionId", taskId, responseTimeMs, correct }, OBSERVED_AT);
}

function hint(taskId: string) {
  return detectLearningObservation({ action: "hint", route: "/placement/test/:sessionId", taskId }, OBSERVED_AT);
}

describe("TeacherContext pipeline", () => {
  it("builds TeacherContext from verified TM INT pipelines", () => {
    const packet = createObservationPacket([
      ...detectAudioObservations({
        requestedUrl: "",
        durationSeconds: 0,
        route: "/placement/test/:sessionId",
        taskId: "listening-a2-class-delay-1",
      }, OBSERVED_AT),
      ...detectSpeechObservations({
        permissionState: "denied",
        route: "/placement/test/:sessionId",
        taskId: "speaking-a2-intro-1",
      }, OBSERVED_AT),
      answer("rapid-1", 700, false),
      answer("rapid-2", 850, false),
      answer("transfer::item-1", 1900, true),
      answer("transfer::item-2", 2100, true),
      hint("support-1"),
      hint("support-2"),
    ], OBSERVED_AT);

    const context = buildTeacherContext(packet);

    expect(context.schemaVersion).toBe("tm-int-teacher-context-v1");
    expect(context.observationSummary.factCount).toBe(packet.facts.length);
    expect(context.observationSummary.factTypeCounts).toMatchObject({
      AudioDurationZero: 1,
      MicPermissionDenied: 1,
      AssessmentAnswerSubmitted: 4,
      HintUsed: 2,
    });
    expect(context.productIssues).toEqual([
      expect.objectContaining({ source: "TC-000001", issue: "product_failure_audio", affectedSkill: "listening", evidenceCount: 2 }),
      expect.objectContaining({ source: "TC-000002", issue: "product_or_permission_block", affectedSkill: "speaking", evidenceCount: 1 }),
    ]);
    expect(context.pendingRetests).toEqual([
      expect.objectContaining({ source: "TC-000001", skill: "listening" }),
      expect.objectContaining({ source: "TC-000002", skill: "speaking" }),
    ]);
    expect(context.learningSignals.map((signal) => signal.signal_key)).toEqual(expect.arrayContaining([
      "hint_dependency",
      "transfer_success",
    ]));
    expect(context.learningSignals.every((signal) => signal.alternatives.length > 0)).toBe(true);
    expect(context.learningSignals.every((signal) => signal.evidenceReferences?.length === signal.evidenceCount)).toBe(true);
    expect(context.learningSignals.find((signal) => signal.signal_key === "transfer_success")?.evidenceReferences).toEqual([
      "AssessmentAnswerSubmitted:transfer::item-1",
      "AssessmentAnswerSubmitted:transfer::item-2",
    ]);
    expect(context.recommendations.map((recommendation) => recommendation.source)).toEqual(expect.arrayContaining([
      "TC-000001",
      "TC-000002",
      "TC-000003",
      "LEARNING-BEHAVIOR-FAMILY-v1",
    ]));
    expect(context.recommendations.every((recommendation) => recommendation.evidenceCount > 0)).toBe(true);
    expect(JSON.stringify(context)).not.toMatch(/weak listening|weak speaking|poor learner|low ability|lazy|careless|"verified":true/i);
  });

  it("does not create a recommendation for normal audio and speaking observations", () => {
    const packet = createObservationPacket([
      ...detectAudioObservations({
        requestedUrl: "/audio/ok.mp3",
        durationSeconds: 4,
        replayCount: 1,
        taskId: "normal-listening",
      }, OBSERVED_AT),
      ...detectSpeechObservations({ permissionState: "granted", timedOut: false, taskId: "normal-speaking" }, OBSERVED_AT),
    ], OBSERVED_AT);

    const context = buildTeacherContext(packet);

    expect(context.productIssues).toEqual([]);
    expect(context.pendingRetests).toEqual([]);
    expect(context.recommendations).toEqual([]);
  });

  it("runtime hooks adapt product and learning events without fake placeholders", () => {
    const audioPacket = observationPacketFromAudio({ requestedUrl: "", durationSeconds: 0, taskId: "audio-1" }, OBSERVED_AT);
    const speechPacket = observationPacketFromSpeech({ permissionState: "denied", taskId: "speech-1" }, OBSERVED_AT);
    const learningPacket = observationPacketFromLearning([
      { action: "answer", taskId: "learn-1", responseTimeMs: 5200, correct: true },
    ], OBSERVED_AT);

    expect(audioPacket.facts.map((fact) => fact.factType)).toEqual(["AudioUnavailable", "AudioDurationZero"]);
    expect(speechPacket.facts.map((fact) => fact.factType)).toEqual(["MicPermissionDenied"]);
    expect(learningPacket.facts.map((fact) => fact.factType)).toEqual(["AssessmentAnswerSubmitted"]);
  });
});
