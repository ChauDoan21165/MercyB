import { describe, expect, it } from "vitest";
import { buildGovernanceEvents } from "../../scripts/governance/tghee-event-engine.mjs";
import { buildRecoveryHistory, enforceRecoveryStrict } from "../../scripts/governance/tghee-recovery-history.mjs";

describe("TGHEE recovery history", () => {
  it("reconstructs catastrophic recovery without readiness promotion", () => {
    const history = buildRecoveryHistory(buildGovernanceEvents());
    expect(() => enforceRecoveryStrict(history)).not.toThrow();
    expect(history.catastrophic_states).toContain("poisoned replay storm");
    expect(history.restoration_summary.blocked_safe_posture_restored).toBe(true);
    expect(history.restoration_summary.recursive_collapse_attempts_rejected).toBe(true);
    expect(history.recovery_events.some((event) => event.recovery_action === "restore_seal")).toBe(true);
  });
});
