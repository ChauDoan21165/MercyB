// FILE: metrics.ts
// PATH: src/core/types/metrics.ts
//
// Purpose:
// - Define metric calculation results
// - Used by scoring + analytics + Mercy Host

export interface DrillMetrics {
  durationSec: number;

  accuracy?: number; // 0..1
  wpm?: number;
  chars?: number;

  score: number; // 0..100

  breakdown: {
    base: number;
    accuracyBonus: number;
    speedBonus: number;
    completionBonus: number;
    penalty: number;
    manualOverride?: number;
  };
}

export interface SessionMetrics {
  score: number; // 0..100
  avgAccuracy?: number; // 0..1
}

export interface LevelGateResult {
  ready: boolean;
  average: number; // 0..1
  missingSkills: string[];
  reasons: string[];
}