export type BenchmarkProvider = "openai" | "gemini" | "azure" | "none" | "local";
export type BenchmarkStatus = "success" | "error" | "timeout" | "skipped";
export type BenchmarkModality =
  | "session"
  | "writing"
  | "reading"
  | "listening"
  | "speaking"
  | "mercy"
  | "azure-phoneme";

export interface BenchmarkStepMetric {
  runId: string;
  scenarioId: string;
  stepId: string;
  modality: BenchmarkModality;
  provider: BenchmarkProvider;
  model?: string | null;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: BenchmarkStatus;
  tokensInput: number;
  tokensOutput: number;
  estimatedCostUsd: number;
  attempts: BenchmarkProvider[];
  failover: boolean;
  errorCode?: string | null;
  errorMessage?: string | null;
  cefrEstimate?: string | null;
}

export interface BenchmarkRunMetric {
  runId: string;
  suiteId: string;
  scenarioId: string;
  startedAt: string;
  completedAt: string;
  status: BenchmarkStatus;
  totalDurationMs: number;
  totalTokensInput: number;
  totalTokensOutput: number;
  estimatedCostUsd: number;
  steps: BenchmarkStepMetric[];
}

export interface AggregatedBenchmarkMetrics {
  runCount: number;
  stepCount: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  averageCostUsd: number;
  averageTokensInput: number;
  averageTokensOutput: number;
  failoverRate: number;
  errorRate: number;
  byModality: Record<string, {
    count: number;
    p50LatencyMs: number;
    p95LatencyMs: number;
    averageCostUsd: number;
    errorRate: number;
  }>;
}

export interface CostBreakdown {
  provider: BenchmarkProvider;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  estimatedCostUsd: number;
}
