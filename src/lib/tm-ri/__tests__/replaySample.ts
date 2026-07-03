import { expect } from "vitest";
import { RuntimeReplayEngine, type TmRiLearnerSignal, type TmRiReplayAnalysis, type TmRiRuntimeEvent } from "../index";

export const runLinhLikeAudioFailureReplay = () => {
  const runtimeEvents: readonly TmRiRuntimeEvent[] = [
    {
      id: "linh-audio",
      type: "audio_unavailable",
      timestampMs: 100,
      modality: "listening",
      assessmentSkill: "listening",
      durationSeconds: 0,
      inputMode: "none",
    },
    {
      id: "linh-score",
      type: "assessment_result_shown",
      timestampMs: 300,
      assessmentSkill: "listening",
      scoreShown: true,
      confidence: 91,
    },
  ];

  const learnerSignals: readonly TmRiLearnerSignal[] = [
    {
      id: "linh-guessed",
      timestampMs: 250,
      action: "guess",
      text: "I guessed because the audio would not play.",
      confidence: 12,
    },
  ];

  return new RuntimeReplayEngine().analyze(runtimeEvents, learnerSignals);
};

export const expectLinhLikeCriticalAudioFailureReplay = (analysis: TmRiReplayAnalysis) => {
  const findingCodes = analysis.observationPacket.findings.map((finding) => finding.code);
  const repairTitles = analysis.repairPlan.items.map((item) => item.title);
  const graphEdges = analysis.knowledgeGraph.edges.map((edge) => `${edge.from}->${edge.to}:${edge.relation}`);

  expect(analysis.assessmentIntegrity.listeningNotGradableAsWrong).toBe(true);
  expect(analysis.honesty.recommendations).toEqual(
    expect.arrayContaining(["withhold_cefr", "explain_degraded", "retry_required"]),
  );
  expect(findingCodes).toEqual(expect.arrayContaining(["audio_unavailable", "invalid_scoring_risk"]));
  expect(repairTitles).toEqual(
    expect.arrayContaining([
      "Make listening media availability a scored precondition",
      "Lower or withhold placement claims when evidence is degraded",
    ]),
  );
  expect(graphEdges).toEqual(
    expect.arrayContaining([
      "observation:audio_unavailable->pedagogy:audio_unavailable:informs",
      "observation:invalid_scoring_risk->pedagogy:invalid_scoring_risk:informs",
    ]),
  );
};

export const runSpeakingTextFallbackReplay = () => {
  const runtimeEvents: readonly TmRiRuntimeEvent[] = [
    {
      id: "mic-denied",
      type: "mic_unavailable",
      timestampMs: 100,
      modality: "speaking",
      assessmentSkill: "speaking",
    },
    {
      id: "typed-fallback",
      type: "fallback_input_used",
      timestampMs: 150,
      modality: "speaking",
      assessmentSkill: "speaking",
      inputMode: "text",
    },
    {
      id: "speaking-score",
      type: "assessment_scored",
      timestampMs: 200,
      assessmentSkill: "speaking",
      confidence: 70,
    },
  ];

  return new RuntimeReplayEngine().analyze(runtimeEvents, []);
};

export const runMixedPlacementAudioFailureReplay = () => {
  const runtimeEvents: readonly TmRiRuntimeEvent[] = [
    {
      id: "mixed-listening-audio",
      type: "media_loaded",
      timestampMs: 100,
      modality: "listening",
      assessmentSkill: "listening",
      playable: false,
      durationSeconds: 0,
      inputMode: "none",
    },
    {
      id: "mixed-placement-result",
      type: "assessment_result_shown",
      timestampMs: 260,
      modality: "mixed",
      assessmentSkill: "mixed",
      scoreShown: true,
      confidence: 84,
    },
  ];

  const learnerSignals: readonly TmRiLearnerSignal[] = [
    {
      id: "learner-completed-mixed",
      timestampMs: 280,
      action: "complete",
      text: "I finished the placement, but one audio question did not play.",
      confidence: 45,
    },
  ];

  return new RuntimeReplayEngine().analyze(runtimeEvents, learnerSignals);
};

export const expectMixedPlacementAudioFailureReplay = (analysis: TmRiReplayAnalysis) => {
  const findingCodes = analysis.observationPacket.findings.map((finding) => finding.code);
  const graphEdges = analysis.knowledgeGraph.edges.map((edge) => `${edge.from}->${edge.to}:${edge.relation}`);

  expect(analysis.assessmentIntegrity.degradedEvidence).toBe(true);
  expect(analysis.assessmentIntegrity.invalidScoringRisk).toBe(true);
  expect(analysis.assessmentIntegrity.confidenceOverclaimRisk).toBe(true);
  expect(analysis.assessmentIntegrity.listeningNotGradableAsWrong).toBe(true);
  expect(analysis.honesty.resultConfidence).toBe("withheld");
  expect(analysis.honesty.recommendations).toEqual(
    expect.arrayContaining(["withhold_cefr", "explain_degraded", "retry_required"]),
  );
  expect(findingCodes).toEqual(
    expect.arrayContaining(["audio_unavailable", "unplayable_media", "invalid_scoring_risk"]),
  );
  expect(analysis.trust.collapsePoint).toBeDefined();
  expect(analysis.observationPacket.productTrust.collapsed).toBe(true);
  expect(graphEdges).toEqual(
    expect.arrayContaining([
      "observation:audio_unavailable->pedagogy:audio_unavailable:informs",
      "observation:invalid_scoring_risk->pedagogy:invalid_scoring_risk:informs",
    ]),
  );
};

export const expectSpeakingTextFallbackReplay = (analysis: TmRiReplayAnalysis) => {
  const findingCodes = analysis.observationPacket.findings.map((finding) => finding.code);
  const repairTitles = analysis.repairPlan.items.map((item) => item.title);
  const graphEdges = analysis.knowledgeGraph.edges.map((edge) => `${edge.from}->${edge.to}:${edge.relation}`);

  expect(analysis.assessmentIntegrity.speakingModalityDegraded).toBe(true);
  expect(analysis.assessmentIntegrity.spokenEvidenceAvailable).toBe(false);
  expect(analysis.honesty.inputModeRecommendation).toBe("text");
  expect(analysis.honesty.recommendations).toEqual(
    expect.arrayContaining(["lower_confidence", "explain_degraded", "withhold_cefr"]),
  );
  expect(analysis.honesty.resultConfidence).toBe("withheld");
  expect(findingCodes).toEqual(
    expect.arrayContaining(["mic_unavailable", "degraded_evidence", "invalid_scoring_risk", "speaking_modality_degraded"]),
  );
  expect(repairTitles).toContain("Separate typed fallback from spoken evidence");
  expect(graphEdges).toEqual(
    expect.arrayContaining([
      "observation:mic_unavailable->pedagogy:mic_unavailable:informs",
      "observation:speaking_modality_degraded->pedagogy:speaking_modality_degraded:informs",
      "observation:speaking_modality_degraded->repair:2:Separate typed fallback from spoken evidence:requires",
    ]),
  );
};
