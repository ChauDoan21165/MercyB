import { describe, expect, it } from "vitest";

import {
  applyPlacementRuntimeDecision,
  buildPlacementTeacherContext,
} from "@/lib/placement/v3/runtimeIntegration";
import { runRr001PlacementRuntimeReplay } from "@/lib/placement/v3/rr001RuntimeReplay";
import { createDpDecisionFromRuntimeEvidenceBundle, validateDpEvidenceIntake } from "@/lib/tm-int/dp";
import type { RuntimeEvidenceBundle } from "@/lib/tm-int/runtimeReadiness";
import type {
  PlacementV3ObservationTimelineItem,
  PlacementV3Results,
} from "@/lib/placement/v3/types";

const REPLAY_TIME = "2026-07-03T00:00:00.000Z";

function baseResults(): PlacementV3Results {
  return {
    sessionId: "placement-rr-001",
    completedAt: REPLAY_TIME,
    overallCefr: "A2",
    overallConfidence: 0.6,
    overallSummary: { en: "A2 placement.", vi: "Xếp trình độ A2." },
    skills: [
      {
        modality: "listening",
        cefr: "A2",
        confidence: 0.58,
        summary: { en: "Listening estimate.", vi: "Ước lượng nghe." },
      },
      {
        modality: "speaking",
        cefr: "A2",
        confidence: 0.61,
        summary: { en: "Speaking estimate.", vi: "Ước lượng nói." },
      },
    ],
    l1Flags: [],
    recommendations: [],
    strengths: [],
    gaps: [],
    questionCount: 5,
  };
}

describe("placement RR-001 runtime integration", () => {
  it("excludes listening score and offers retest when placement audio is unavailable", () => {
    const timeline: PlacementV3ObservationTimelineItem[] = [
      {
        kind: "listening_media",
        taskId: "listening-a2-class-delay-1",
        modality: "listening",
        observedAt: REPLAY_TIME,
        mediaStatus: "unplayable",
        requestedAudioUrl: "/audio/placement-v3/listening-a2-class-delay-1.mp3",
        audioDurationSeconds: 0,
      },
    ];

    const runtime = buildPlacementTeacherContext(timeline, REPLAY_TIME);
    const results = applyPlacementRuntimeDecision(baseResults(), runtime.teacherContext, runtime.decision, timeline);

    expect(runtime.observationPacket.facts.map((fact) => fact.factType)).toEqual([
      "AudioDurationZero",
      "AudioPlaybackFailed",
    ]);
    expect(results.skills.find((skill) => skill.modality === "listening")).toMatchObject({
      scoreEligible: false,
      runtimeExclusionReason: "product_failure_audio",
    });
    expect(results.runtimeDecision?.offers.listeningRetest).toBe(true);
    expect(JSON.stringify(results.teacherContext)).not.toMatch(/weak listening|poor learner|bad comprehension/i);
  });

  it("excludes speaking score and offers fallback and retry when microphone permission is denied", () => {
    const timeline: PlacementV3ObservationTimelineItem[] = [
      {
        kind: "speaking_capture",
        taskId: "speaking-a2-learning-goals-1",
        modality: "speaking",
        observedAt: REPLAY_TIME,
        speechPermission: "denied",
      },
    ];

    const runtime = buildPlacementTeacherContext(timeline, REPLAY_TIME);
    const results = applyPlacementRuntimeDecision(baseResults(), runtime.teacherContext, runtime.decision, timeline);

    expect(runtime.observationPacket.facts.map((fact) => fact.factType)).toEqual(["MicPermissionDenied"]);
    expect(results.skills.find((skill) => skill.modality === "speaking")).toMatchObject({
      scoreEligible: false,
      runtimeExclusionReason: "mic_permission_or_device_block",
    });
    expect(results.runtimeDecision?.offers).toMatchObject({
      speakingTextFallback: true,
      micRetry: true,
    });
    expect(JSON.stringify(results.teacherContext)).not.toMatch(/weak speaking|poor pronunciation|low ability/i);
  });

  it("marks placement validity questionable for rapid guessing without lowering placement", () => {
    const timeline: PlacementV3ObservationTimelineItem[] = [
      {
        kind: "answer",
        taskId: "reading-b1-work-email-1",
        modality: "reading",
        observedAt: REPLAY_TIME,
        elapsedMs: 900,
        observedCorrect: false,
      },
      {
        kind: "answer",
        taskId: "conversation-a2-job-goals-1",
        modality: "conversation",
        observedAt: REPLAY_TIME,
        elapsedMs: 800,
        observedCorrect: false,
      },
    ];

    const runtime = buildPlacementTeacherContext(timeline, REPLAY_TIME);
    const results = applyPlacementRuntimeDecision(baseResults(), runtime.teacherContext, runtime.decision, timeline);

    expect(results.placementValidity).toBe("questionable");
    expect(results.runtimeDecision?.offers.confidenceFollowUp).toBe(true);
    expect(results.runtimeDecision?.recommendationActions).toContain(
      "pause_assessment_ask_confidence_check_and_do_not_lower_placement",
    );
    expect(JSON.stringify(results.teacherContext)).not.toMatch(/lazy|careless|low ability|lowered mastery/i);
  });

  it("does not change scores for normal available runtime evidence", () => {
    const timeline: PlacementV3ObservationTimelineItem[] = [
      {
        kind: "listening_media",
        taskId: "listening-a2-class-delay-1",
        modality: "listening",
        observedAt: REPLAY_TIME,
        mediaStatus: "playable",
        requestedAudioUrl: "/audio/placement-v3/listening-a2-class-delay-1.mp3",
        audioDurationSeconds: 12,
      },
      {
        kind: "speaking_capture",
        taskId: "speaking-a2-learning-goals-1",
        modality: "speaking",
        observedAt: REPLAY_TIME,
        speechPermission: "granted",
      },
    ];

    const runtime = buildPlacementTeacherContext(timeline, REPLAY_TIME);
    const results = applyPlacementRuntimeDecision(baseResults(), runtime.teacherContext, runtime.decision, timeline);

    expect(runtime.observationPacket.facts).toEqual([]);
    expect(results.placementValidity).toBe("valid");
    expect(results.skills.every((skill) => skill.scoreEligible)).toBe(true);
    expect(results.runtimeDecision?.recommendationActions).toEqual([]);
  });

  it("replays the placement decision deterministically", () => {
    const replay = runRr001PlacementRuntimeReplay();

    expect(replay.replay.pass).toBe(true);
    expect(replay.replay.deterministic).toBe(true);
    expect(replay.decision).toMatchObject({
      excludeListeningScore: true,
      excludeSpeakingScore: true,
      placementValidity: "questionable",
    });
    expect(replay.teacherContext.replayTrace.map((step) => step.stage)).toContain("RUNTIME");
  });

  it("feeds placement runtime evidence into DP evidence intake", () => {
    const timeline: PlacementV3ObservationTimelineItem[] = [
      {
        kind: "listening_media",
        taskId: "listening-a2-class-delay-1",
        modality: "listening",
        observedAt: REPLAY_TIME,
        mediaStatus: "unplayable",
        requestedAudioUrl: "/audio/placement-v3/listening-a2-class-delay-1.mp3",
        audioDurationSeconds: 0,
      },
    ];
    const runtime = buildPlacementTeacherContext(timeline, REPLAY_TIME);
    const bundle: RuntimeEvidenceBundle = {
      schemaVersion: "tm-int-runtime-evidence-bundle-v1",
      contractId: "RR-001",
      runtimeEvent: {
        eventId: "placement-runtime-dp-intake",
        route: "/placement/v3",
        eventType: "placement_runtime_decision",
        observedAt: REPLAY_TIME,
        observationIds: [runtime.observationPacket.packetId],
      },
      obsPacket: runtime.observationPacket,
      learningSignals: runtime.teacherContext.learningSignals,
      teacherContext: runtime.teacherContext,
      dpDecision: {
        stage: "DP",
        source: "TC-000001",
        reason: "product_failure_audio",
        evidenceCount: 2,
        productFailure: true,
        learnerWeakness: false,
        observationIds: [runtime.observationPacket.packetId],
        signalKeys: [],
      },
      pedDecision: {
        stage: "PED",
        source: "TC-000001",
        action: "exclude_listening_score_and_offer_retest",
        evidenceCount: 2,
        productFailure: true,
        learnerWeakness: false,
        observationIds: [runtime.observationPacket.packetId],
        signalKeys: [],
      },
      runtimeDecision: {
        changed: true,
        changedBecauseOfTeacherContext: true,
        teacherContextUsed: true,
        learningSignalsUsed: true,
        summary: "placement runtime decision used Teacher Context",
        observationIds: [runtime.observationPacket.packetId],
        signalKeys: [],
      },
      replay: runtime.replay.replay,
      judgeReproduction: runtime.replay.replay,
    };

    const decision = createDpDecisionFromRuntimeEvidenceBundle(bundle);
    const result = validateDpEvidenceIntake(decision, runtime.teacherContext, bundle);

    expect(result.pass).toBe(true);
    expect(decision.productIssueHandling.issueTypes).toContain("product_failure_audio");
  });
});
