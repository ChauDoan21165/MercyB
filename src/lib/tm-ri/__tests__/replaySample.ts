import { RuntimeReplayEngine, type TmRiLearnerSignal, type TmRiRuntimeEvent } from "../index";

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
