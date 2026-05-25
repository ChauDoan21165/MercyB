import type { PlacementBenchmarkScenario } from "./types.js";

export const mercyConversationalScenario: PlacementBenchmarkScenario = {
  id: "mercy-conversational",
  label: "Mercy conversational placement-adjacent flow",
  expectedCefrTrajectory: ["B1", "B1"],
  expectedApiCount: 3,
  timeoutThresholdMs: 90_000,
  steps: [
    {
      id: "mercy-b1-diagnose",
      modality: "mercy",
      expectedCefr: "B1",
      timeoutMs: 30_000,
      payload: {
        message: "I always confuse articles and plural endings. Can you check my English and tell me my likely level?",
      },
    },
    {
      id: "mercy-b1-correction",
      modality: "mercy",
      expectedCefr: "B1",
      timeoutMs: 30_000,
      payload: {
        message: "Yesterday I go to supermarket and buy two apple for my childs.",
      },
    },
  ],
};
