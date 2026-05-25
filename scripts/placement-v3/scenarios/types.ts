export type ScenarioModality =
  | "writing"
  | "reading"
  | "listening"
  | "speaking"
  | "mercy"
  | "azure-phoneme";

export interface PlacementBenchmarkStep {
  id: string;
  modality: ScenarioModality;
  expectedCefr: string;
  timeoutMs: number;
  payload: Record<string, unknown>;
}

export interface PlacementBenchmarkScenario {
  id: string;
  label: string;
  expectedCefrTrajectory: string[];
  expectedApiCount: number;
  timeoutThresholdMs: number;
  steps: PlacementBenchmarkStep[];
}
