// core/types/metrics.ts

export type MetricKey =
  | "accuracy"
  | "fluency"
  | "listening"
  | "vocabulary"
  | "pressure"
  | "consistency"
  | "mastery";

export type Metrics = Record<MetricKey, number>;

export interface MetricDelta {
  before: number;
  after: number;
  change: number;
}

export interface MetricSnapshot {
  dateISO: string;
  metrics: Metrics;
}