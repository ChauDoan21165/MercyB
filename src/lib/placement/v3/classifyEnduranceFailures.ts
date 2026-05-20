export type EnduranceFailureCategory =
  | "retry_storm"
  | "timeout_cluster"
  | "state_corruption"
  | "memory_growth"
  | "duplicate_submission"
  | "persistence_failure"
  | "ui_degradation"
  | "recommendation_failure"
  | "unknown";

export type EnduranceFailureSignal = {
  runId?: string;
  scenario?: string;
  message?: string;
  code?: string;
  retries?: number;
  fallbacks?: number;
  timeouts?: number;
  duplicateSubmissions?: number;
  persistenceErrors?: number;
  recommendationErrors?: number;
  memoryGrowthMb?: number;
  durationMs?: number;
  baselineDurationMs?: number;
  uiErrors?: number;
};

export type EnduranceFailureClassification = {
  category: EnduranceFailureCategory;
  severity: "low" | "medium" | "high";
  signature: string;
  reason: string;
};

function lower(value: unknown): string {
  return String(value ?? "").toLowerCase();
}

export function classifyEnduranceFailure(
  signal: EnduranceFailureSignal,
): EnduranceFailureClassification {
  const text = `${lower(signal.code)} ${lower(signal.message)} ${lower(signal.scenario)}`;

  if ((signal.retries ?? 0) >= 5 || /retry storm|too many retries/.test(text)) {
    return {
      category: "retry_storm",
      severity: (signal.retries ?? 0) >= 10 ? "high" : "medium",
      signature: `retry:${signal.code ?? signal.scenario ?? "unknown"}`,
      reason: "Retry count crossed the endurance threshold.",
    };
  }

  if ((signal.timeouts ?? 0) >= 2 || /timeout|aborterror|timed out/.test(text)) {
    return {
      category: "timeout_cluster",
      severity: (signal.timeouts ?? 0) >= 4 ? "high" : "medium",
      signature: `timeout:${signal.scenario ?? signal.code ?? "unknown"}`,
      reason: "Timeouts clustered in one run or scenario.",
    };
  }

  if (/invalid_transition|state|session_not_found|prompt_mismatch|impossible/.test(text)) {
    return {
      category: "state_corruption",
      severity: "high",
      signature: `state:${signal.code ?? signal.message ?? "unknown"}`,
      reason: "Session state or prompt contract became inconsistent.",
    };
  }

  if ((signal.memoryGrowthMb ?? 0) >= 32 || /memory|heap/.test(text)) {
    return {
      category: "memory_growth",
      severity: (signal.memoryGrowthMb ?? 0) >= 96 ? "high" : "medium",
      signature: `memory:${Math.round(signal.memoryGrowthMb ?? 0)}mb`,
      reason: "Heap growth exceeded the configured endurance threshold.",
    };
  }

  if ((signal.duplicateSubmissions ?? 0) > 0 || /duplicate|replay/.test(text)) {
    return {
      category: "duplicate_submission",
      severity: (signal.duplicateSubmissions ?? 0) > 2 ? "high" : "medium",
      signature: `duplicate:${signal.scenario ?? "submission"}`,
      reason: "Duplicate or replayed submissions were observed.",
    };
  }

  if ((signal.persistenceErrors ?? 0) > 0 || /persist|insert|upsert|database|storage/.test(text)) {
    return {
      category: "persistence_failure",
      severity: "high",
      signature: `persistence:${signal.code ?? signal.scenario ?? "unknown"}`,
      reason: "A persistence operation failed or returned inconsistent state.",
    };
  }

  if ((signal.uiErrors ?? 0) > 0 || /ui|browser|render|navigation|hydration/.test(text)) {
    return {
      category: "ui_degradation",
      severity: "medium",
      signature: `ui:${signal.code ?? signal.scenario ?? "unknown"}`,
      reason: "Browser/UI execution degraded or emitted errors.",
    };
  }

  if ((signal.recommendationErrors ?? 0) > 0 || /recommend/.test(text)) {
    return {
      category: "recommendation_failure",
      severity: "medium",
      signature: `recommendation:${signal.code ?? signal.scenario ?? "unknown"}`,
      reason: "Recommendation generation failed or partially fell back.",
    };
  }

  if (
    typeof signal.durationMs === "number" &&
    typeof signal.baselineDurationMs === "number" &&
    signal.durationMs > signal.baselineDurationMs * 2.5
  ) {
    return {
      category: "ui_degradation",
      severity: "medium",
      signature: `slow:${signal.scenario ?? "session"}`,
      reason: "Run duration exceeded 2.5x the baseline.",
    };
  }

  return {
    category: "unknown",
    severity: "low",
    signature: `unknown:${signal.code ?? signal.scenario ?? "none"}`,
    reason: "Failure did not match a known endurance cluster.",
  };
}

export function classifyEnduranceFailures(
  signals: EnduranceFailureSignal[],
): EnduranceFailureClassification[] {
  return signals.map(classifyEnduranceFailure);
}
