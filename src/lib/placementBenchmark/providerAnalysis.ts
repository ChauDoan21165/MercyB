import type { BenchmarkStepMetric } from "./types.js";

export function analyzeProviderUsage(steps: BenchmarkStepMetric[]) {
  const providerCounts: Record<string, number> = {};
  const failoverEvents = steps.filter((step) => step.failover);
  for (const step of steps) {
    providerCounts[step.provider] = (providerCounts[step.provider] ?? 0) + 1;
  }
  return {
    providerCounts,
    failoverCount: failoverEvents.length,
    failoverRate: steps.length ? Number((failoverEvents.length / steps.length).toFixed(4)) : 0,
    failoverRecoverySuccessRate: failoverEvents.length
      ? Number(
          (
            failoverEvents.filter((step) => step.status === "success").length /
            failoverEvents.length
          ).toFixed(4),
        )
      : 1,
  };
}
