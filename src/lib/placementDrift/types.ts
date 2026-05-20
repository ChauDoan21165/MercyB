export type DriftProvider = "openai" | "gemini" | "none" | "unknown";
export type DriftModality = "writing" | "reading" | "listening" | "speaking";
export type DriftStatus = "success" | "error" | "timeout" | "malformed";
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export const CEFR_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export interface ReplayScore {
  runId: string;
  batchId: string;
  sampleId: string;
  modality: DriftModality;
  expectedCefr: CefrLevel;
  parsedCefr: CefrLevel | null;
  provider: DriftProvider;
  model: string | null;
  retryPath: string[];
  taxonomyTags: string[];
  latencyMs: number;
  tokensInput: number;
  tokensOutput: number;
  status: DriftStatus;
  malformed: boolean;
  createdAt: string;
}

export interface DriftDelta {
  sampleId: string;
  modality: DriftModality;
  expectedCefr: CefrLevel;
  baselineCefr: CefrLevel | null;
  currentCefr: CefrLevel | null;
  deltaBands: number | null;
  provider: DriftProvider;
  taxonomyTags: string[];
  status: DriftStatus;
}

export interface DriftAlert {
  scope: string;
  severity: "info" | "warning" | "critical";
  metric: string;
  value: number;
  threshold: number;
  sampleIds: string[];
  message: string;
}

export interface DriftSummary {
  runCount: number;
  scoreCount: number;
  successRate: number;
  malformedRate: number;
  p95LatencyMs: number;
  meanAbsoluteDelta: number;
  catastrophicDisagreements: number;
  alerts: DriftAlert[];
}
