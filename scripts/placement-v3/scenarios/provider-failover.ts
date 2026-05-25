import type { PlacementBenchmarkScenario } from "./types.js";

export const providerFailoverScenario: PlacementBenchmarkScenario = {
  id: "provider-failover",
  label: "Provider failover stress scenario",
  expectedCefrTrajectory: ["B1"],
  expectedApiCount: 3,
  timeoutThresholdMs: 90_000,
  steps: [
    {
      id: "failover-reading",
      modality: "reading",
      expectedCefr: "B1",
      timeoutMs: 10_000,
      payload: {
        forceOpenAiFailure: true,
        promptId: "failover-reading",
        passageText: "The warranty covers manufacturing faults, but it excludes damage caused by improper installation.",
        questionText: "What is not covered?",
        questionType: "short_answer",
        expectedAnswer: "Damage caused by improper installation.",
        userResponse: "If someone installs it wrong and damages it, that is excluded.",
        targetCefr: "B1",
      },
    },
    {
      id: "failover-speaking",
      modality: "speaking",
      expectedCefr: "B1",
      timeoutMs: 10_000,
      payload: {
        forceOpenAiFailure: true,
        promptId: "failover-speaking",
        taskText: "Describe a useful app.",
        transcript: "A useful app for me is a dictionary because it gives examples and pronunciation. I use it when I read articles or prepare for interviews.",
        durationSeconds: 35,
        targetLanguage: "en",
      },
    },
  ],
};
