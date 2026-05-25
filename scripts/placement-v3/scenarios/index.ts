import { advancedC1Scenario } from "./advanced-c1.js";
import { beginnerA1Scenario } from "./beginner-a1.js";
import { intermediateB1Scenario } from "./intermediate-b1.js";
import { mercyConversationalScenario } from "./mercy-conversational.js";
import { providerFailoverScenario } from "./provider-failover.js";
import { speakingHeavyScenario } from "./speaking-heavy.js";

export const placementBenchmarkScenarios = [
  beginnerA1Scenario,
  intermediateB1Scenario,
  advancedC1Scenario,
  speakingHeavyScenario,
  mercyConversationalScenario,
  providerFailoverScenario,
];

export type { PlacementBenchmarkScenario, PlacementBenchmarkStep } from "./types.js";
