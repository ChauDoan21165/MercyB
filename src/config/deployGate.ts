// Deploy-gate signal.
//
// **NOT ENFORCED** — this is a *signal* future CI/CD checks can read.
// Today no automation is wired. Chau decides when to start blocking.
//
// Rationale: building blocking gates before there's any operator
// confidence in the SLO numbers risks blocking legitimate work on
// noisy data. Phase 1 = exposure only. Phase 2 = enforce in CI when
// the dashboard has been trusted for two weeks.

import { calculateAllBudgets } from "@/lib/admin/errorBudget";

export interface DeployGateResult {
  blocked: boolean;
  reason: string;
  blocking_slos: string[];
}

/**
 * Returns a recommendation. Future CI can read this and refuse to merge
 * non-critical PRs when blocked=true. Today: only the dashboard reads it.
 */
export async function shouldGateDeploys(): Promise<DeployGateResult> {
  const budgets = await calculateAllBudgets();
  const blocking = budgets.filter(
    (b) => b.status === "critical" || b.status === "exhausted",
  );
  if (blocking.length === 0) {
    return {
      blocked: false,
      reason: "All SLOs healthy or in warning band",
      blocking_slos: [],
    };
  }
  return {
    blocked: true,
    reason: `${blocking.length} SLO(s) in critical/exhausted state — pause non-critical merges and ship reliability fixes first.`,
    blocking_slos: blocking.map((b) => b.slo_id),
  };
}
