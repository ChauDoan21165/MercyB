import { createHash } from "node:crypto";

export const TGHEE_STREAMS = ["A39", "A42", "A44", "A45", "A47", "A48", "A49", "A50", "A46"];

export const TGHEE_DEPENDENCIES = [
  "A2 drift evidence",
  "A33 endurance evidence",
  "A33 capacity evidence",
  "replay reproducibility",
  "provider calibration",
  "provider drift",
  "fairness/bias evidence",
  "CEFR stability evidence",
  "persistence validation",
  "audit continuity",
  "human review backlog",
  "supervised execution restrictions",
];

export const TGHEE_BLOCKED_SAFE = {
  production_safe: false,
  production_readiness: false,
  placement_v3_enabled: false,
  placement_v3_enablement: "BLOCKED",
  writes_production_data: false,
  autonomous_execution: "SUPERVISED_ONLY",
  do_not_enable_continuity: true,
};

const CANONICAL_EVENTS = [
  {
    ordinal: 10,
    type: "denial introduced",
    actor: "A42",
    scope: "reliability",
    summary: "Reliability archive preserved BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS.",
    dependencies: ["A33 endurance evidence", "replay reproducibility", "provider calibration"],
    caused_by: [],
  },
  {
    ordinal: 20,
    type: "unresolved dependency added",
    actor: "A46",
    scope: "convergence",
    summary: "Global unresolved dependency taxonomy normalized across permanent denial-retention streams.",
    dependencies: TGHEE_DEPENDENCIES,
    caused_by: ["denial introduced"],
  },
  {
    ordinal: 30,
    type: "lineage superseded",
    actor: "A46",
    scope: "lineage",
    summary: "A46 convergence matrix superseded branch-local denial fragments without resolving evidence gaps.",
    dependencies: ["A33 endurance evidence", "audit continuity", "supervised execution restrictions"],
    caused_by: ["unresolved dependency added"],
  },
  {
    ordinal: 40,
    type: "stale replay rejected",
    actor: "A49",
    scope: "replay",
    summary: "Replay snapshots remained non-canonical without reproducibility and audit continuity evidence.",
    dependencies: ["replay reproducibility", "audit continuity"],
    caused_by: ["lineage superseded"],
  },
  {
    ordinal: 50,
    type: "seal degraded",
    actor: "A46",
    scope: "seal",
    summary: "Recursive simulator modeled seal fracture and canonical overwrite attempts as degraded inputs.",
    dependencies: ["A33 endurance evidence", "replay reproducibility"],
    caused_by: ["stale replay rejected"],
  },
  {
    ordinal: 60,
    type: "seal restored",
    actor: "A46",
    scope: "seal",
    summary: "Permanent convergence seal rejected degraded inputs and restored blocked-safe seal continuity.",
    dependencies: ["A33 endurance evidence", "replay reproducibility"],
    caused_by: ["seal degraded"],
  },
  {
    ordinal: 70,
    type: "branch contamination rejected",
    actor: "A46",
    scope: "branch-domain",
    summary: "Cross-branch copied seals and forked canonical identities remained non-canonical.",
    dependencies: ["audit continuity", "supervised execution restrictions"],
    caused_by: ["seal restored"],
  },
  {
    ordinal: 80,
    type: "replay poisoning rejected",
    actor: "A46",
    scope: "replay",
    summary: "Recursive replay storms were rejected before they could rewrite unresolved dependency lineage.",
    dependencies: ["replay reproducibility", "audit continuity"],
    caused_by: ["branch contamination rejected"],
  },
  {
    ordinal: 90,
    type: "strict-mode failure triggered",
    actor: "A46",
    scope: "strict-mode",
    summary: "Strict mode remained denial-preserving for readiness, provider, replay, persistence, release, and autonomous escalation attempts.",
    dependencies: ["provider drift", "persistence validation", "supervised execution restrictions"],
    caused_by: ["replay poisoning rejected"],
  },
  {
    ordinal: 100,
    type: "governance recovery executed",
    actor: "A46",
    scope: "recovery",
    summary: "Recursive collapse pressure regenerated deterministic blocked-safe governance artifacts.",
    dependencies: TGHEE_DEPENDENCIES,
    caused_by: ["strict-mode failure triggered"],
  },
  {
    ordinal: 110,
    type: "canonical authority changed",
    actor: "A46",
    scope: "canonical-authority",
    summary: "Canonical authority settled on A46 convergence governance while upstream evidence remained incomplete.",
    dependencies: ["A33 endurance evidence", "audit continuity", "supervised execution restrictions"],
    caused_by: ["governance recovery executed"],
  },
  {
    ordinal: 120,
    type: "governance fragment orphaned",
    actor: "A46",
    scope: "lineage",
    summary: "Orphaned reconciliation fragments stayed rejected without canonical ancestry and source evidence.",
    dependencies: ["audit continuity", "replay reproducibility"],
    caused_by: ["canonical authority changed"],
  },
  {
    ordinal: 130,
    type: "replay storm detected",
    actor: "A46",
    scope: "replay",
    summary: "Recursive replay storm chronology preserved stale replay rejection ordering.",
    dependencies: ["replay reproducibility", "audit continuity"],
    caused_by: ["governance fragment orphaned"],
  },
  {
    ordinal: 140,
    type: "adversarial fixture rejected",
    actor: "A46",
    scope: "adversarial-governance",
    summary: "Recursive collapse fixtures were rejected without promoting readiness or certification.",
    dependencies: TGHEE_DEPENDENCIES,
    caused_by: ["replay storm detected"],
  },
  {
    ordinal: 150,
    type: "deterministic regeneration verified",
    actor: "A46",
    scope: "determinism",
    summary: "Regenerated governance history preserved event IDs, causality ordering, canonical authority, and blocked-safe posture.",
    dependencies: TGHEE_DEPENDENCIES,
    caused_by: ["adversarial fixture rejected"],
  },
];

export function buildGovernanceEvents() {
  return CANONICAL_EVENTS.map((event) => {
    const event_id = stableId(event.ordinal, event.type, event.actor, event.scope, event.summary);
    return {
      event_id,
      ...event,
      blocked_safe_after_event: TGHEE_BLOCKED_SAFE,
      canonical_authority_after_event: event.ordinal >= 110 ? "A46 convergence governance" : "branch-local denied governance",
      readiness_allowed_after_event: false,
      release_allowed_after_event: false,
    };
  });
}

export function stableId(...parts) {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

export function assertDeterministicEvents(events) {
  const ids = events.map((event) => event.event_id);
  if (new Set(ids).size !== ids.length) throw new Error("TGHEE event history is nondeterministic: duplicate event IDs");
  const sorted = [...events].sort((a, b) => a.ordinal - b.ordinal);
  if (JSON.stringify(sorted.map((event) => event.event_id)) !== JSON.stringify(ids)) {
    throw new Error("TGHEE event history is nondeterministic: causality ordering changed");
  }
}
