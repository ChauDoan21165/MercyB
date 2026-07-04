import { describe, expect, it } from "vitest";

import {
  applyPlacementRuntimeDecision,
  buildPlacementRuntimeEvidenceBundle,
  buildPlacementTeacherContext,
} from "@/lib/placement/v3/runtimeIntegration";
import { runRr001PlacementRuntimeReplay } from "@/lib/placement/v3/rr001RuntimeReplay";
import { createDpDecisionFromRuntimeEvidenceBundle, validateDpEvidenceIntake } from "@/lib/tm-int/dp";
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
    const bundle = buildPlacementRuntimeEvidenceBundle(timeline, REPLAY_TIME);

    const decision = createDpDecisionFromRuntimeEvidenceBundle(bundle);
    const result = validateDpEvidenceIntake(decision, bundle.teacherContext, bundle);

    expect(result.pass).toBe(true);
    expect(decision.productIssueHandling.issueTypes).toContain("product_failure_audio");
  });

  it("rejects placement runtime DP intake that classifies product failure as learner weakness", () => {
    const timeline: PlacementV3ObservationTimelineItem[] = [
      {
        kind: "speaking_capture",
        taskId: "speaking-a2-learning-goals-1",
        modality: "speaking",
        observedAt: REPLAY_TIME,
        speechPermission: "denied",
      },
    ];
    const bundle = buildPlacementRuntimeEvidenceBundle(timeline, REPLAY_TIME);
    const unsafeDecision = {
      ...createDpDecisionFromRuntimeEvidenceBundle(bundle),
      productIssueHandling: {
        productIssuePresent: true,
        issueTypes: ["product_or_permission_block"],
        handledAsProductIssue: false,
        classifiedAsLearnerWeakness: true,
        rationale: "weak speaking caused microphone permission failure",
      },
      learnerPerformanceClaims: [
        {
          claimId: "unsafe-placement-weakness",
          claimType: "learner_weakness",
          statement: "weak speaking",
          citedObservationIds: [bundle.teacherContext.observationSummary.packetId],
          citedLearningSignalIds: [],
          rationale: "weak speaking caused microphone permission failure",
          supported: true,
        },
      ],
      explanation: "weak speaking caused microphone permission failure",
    } as const;

    const result = validateDpEvidenceIntake(unsafeDecision, bundle.teacherContext, bundle);

    expect(result.pass).toBe(false);
    expect(result.dpDecisionValidation.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "product_failure_as_learner_weakness" })]),
    );
  });
});
