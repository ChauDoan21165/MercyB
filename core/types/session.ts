// core/types/session.ts

import { Metrics } from "./metrics";

export type ModuleKey =
  | "timed_speaking"
  | "accuracy_drill"
  | "listening_lite"
  | "gate_test"
  | "recovery";

export interface SessionRawData {
  textResponse?: string;
  durationSec?: number;
  restartCount?: number;
  promptId?: string;
}

export interface DrillResult {
  sessionId: string;
  level: number;
  module: ModuleKey;
  timestampISO: string;

  raw: SessionRawData;
  scored: Metrics;

  mercyHost: {
    diagnosis: string;
    prescription: string;
  };
}

export interface GateResult {
  level: number;
  pass: boolean;
  reasons: string[];
  metricsAtAttempt: Metrics;
}