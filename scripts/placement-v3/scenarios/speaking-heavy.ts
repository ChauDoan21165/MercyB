import type { PlacementBenchmarkScenario } from "./types.js";

export const speakingHeavyScenario: PlacementBenchmarkScenario = {
  id: "speaking-heavy",
  label: "Speaking-heavy pronunciation and CEFR flow",
  expectedCefrTrajectory: ["A2", "B1", "B1"],
  expectedApiCount: 5,
  timeoutThresholdMs: 100_000,
  steps: [
    {
      id: "speech-azure-phoneme-th",
      modality: "azure-phoneme",
      expectedCefr: "B1",
      timeoutMs: 20_000,
      payload: {
        text: "I think the three things are worth discussing.",
        audioSeconds: 8,
        accent: "vi",
      },
    },
    {
      id: "speech-b1-story",
      modality: "speaking",
      expectedCefr: "B1",
      timeoutMs: 30_000,
      payload: {
        promptId: "speech-b1-story",
        taskText: "Tell a short story about a mistake you learned from.",
        transcript: "When I started my first job, I said yes to every request and became overloaded. After missing one deadline, I learned to ask which task was most important before accepting more work.",
        durationSeconds: 50,
        targetLanguage: "en",
      },
    },
    {
      id: "speech-b1-followup",
      modality: "speaking",
      expectedCefr: "B1",
      timeoutMs: 30_000,
      payload: {
        promptId: "speech-b1-followup",
        taskText: "Explain what advice you would give to a new employee.",
        transcript: "I would tell them to listen carefully, write down important instructions, and ask questions early. It is better to look unsure for one minute than to make a large mistake later.",
        durationSeconds: 46,
        targetLanguage: "en",
      },
    },
  ],
};
