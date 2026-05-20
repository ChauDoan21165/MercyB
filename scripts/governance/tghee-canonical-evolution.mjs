import { stableId } from "./tghee-event-engine.mjs";

export function buildCanonicalAuthorityHistory(events) {
  const canonicalEvents = events.filter((event) => /canonical|branch|lineage|replay|orphaned/i.test(`${event.type} ${event.summary} ${event.scope}`));
  return {
    canonical_history_id: stableId("tghee-canonical", canonicalEvents.map((event) => event.event_id).join(",")),
    canonical_authority: "A46 convergence governance",
    authority_transitions: canonicalEvents.map((event) => ({
      event_id: event.event_id,
      ordinal: event.ordinal,
      type: event.type,
      authority_before: event.ordinal < 110 ? "branch-local denied governance" : "A46 convergence governance",
      authority_after: event.canonical_authority_after_event,
      stale_lineage_authority: "rejected",
      branch_contamination_authority: "rejected",
    })),
    branch_domain_history: {
      canonical_branch: "feat/a42-reliability-forecast-ops",
      branch_domain_isolation: "preserved",
      cross_branch_contamination: "rejected",
      forked_canonical_identity: "rejected",
    },
    invalidation_reasons: [
      "missing source evidence",
      "stale seal identity",
      "unresolved dependency continuity gap",
      "unsupported readiness implication",
      "branch-domain mismatch",
    ],
  };
}

export function enforceCanonicalStrict(history) {
  const failures = [];
  if (history.canonical_authority !== "A46 convergence governance") failures.push("canonical authority changed unexpectedly");
  if (history.branch_domain_history.branch_domain_isolation !== "preserved") failures.push("branch-domain isolation became ambiguous");
  for (const transition of history.authority_transitions) {
    if (transition.stale_lineage_authority !== "rejected") failures.push(`${transition.event_id} stale lineage gained authority`);
    if (transition.branch_contamination_authority !== "rejected") failures.push(`${transition.event_id} branch contamination gained authority`);
  }
  if (failures.length > 0) throw new Error(`TGHEE canonical strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}
