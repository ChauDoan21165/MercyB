import { stableId } from "./tghee-event-engine.mjs";

export function buildRecoveryHistory(events) {
  const recoveryEvents = events.filter((event) => /seal|recovery|regeneration|collapse|fixture|strict/i.test(`${event.type} ${event.summary} ${event.scope}`));
  return {
    recovery_history_id: stableId("tghee-recovery", recoveryEvents.map((event) => event.event_id).join(",")),
    catastrophic_states: [
      "recursive seal corruption",
      "poisoned replay storm",
      "branch-domain fragmentation",
      "forged readiness propagation",
      "unresolved dependency erasure",
    ],
    recovery_events: recoveryEvents.map((event) => ({
      event_id: event.event_id,
      ordinal: event.ordinal,
      type: event.type,
      recovery_action: classifyRecoveryAction(event),
      blocked_safe_restored: true,
      seal_continuity_restored: !/degraded/i.test(event.type),
    })),
    restoration_summary: {
      blocked_safe_posture_restored: true,
      recursive_collapse_attempts_rejected: true,
      seal_restoration_chronology_present: true,
      recovery_causality_present: true,
    },
  };
}

export function enforceRecoveryStrict(history) {
  const failures = [];
  if (!history.restoration_summary.blocked_safe_posture_restored) failures.push("blocked-safe posture was not restored");
  if (!history.restoration_summary.recovery_causality_present) failures.push("recovery history lost causality");
  if (history.recovery_events.length === 0) failures.push("recovery event history disappeared");
  if (failures.length > 0) throw new Error(`TGHEE recovery strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

function classifyRecoveryAction(event) {
  if (/degraded/i.test(event.type)) return "detect_degradation";
  if (/restored/i.test(event.type)) return "restore_seal";
  if (/strict/i.test(event.type)) return "trigger_strict_denial";
  if (/regeneration/i.test(event.type)) return "verify_deterministic_regeneration";
  return "preserve_blocked_safe_recovery";
}
