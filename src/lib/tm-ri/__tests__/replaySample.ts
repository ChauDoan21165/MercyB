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
