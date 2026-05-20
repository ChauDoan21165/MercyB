import { TGHEE_DEPENDENCIES, TGHEE_STREAMS, stableId } from "./tghee-event-engine.mjs";

export function buildLineageEvolutionMap(events) {
  return {
    map_id: stableId("tghee-lineage-evolution", events.length),
    streams: TGHEE_STREAMS.map((stream) => ({
      stream,
      canonical_status: stream === "A46" ? "canonical_convergence_authority" : "denial_lineage_source",
      lineage_state: "blocked_safe_unresolved",
      superseded_by: stream === "A46" ? null : "A46 convergence governance",
    })),
    lineage_edges: TGHEE_STREAMS.filter((stream) => stream !== "A46").map((stream) => ({
      from: stream,
      to: "A46",
      relation: "denial_lineage_preserved_without_readiness_promotion",
    })),
    orphaned_lineage_policy: "reject_without_canonical_ancestry_and_source_evidence",
    stale_lineage_policy: "reject_without_current_seal_and_unresolved_dependency_continuity",
    duplicated_lineage_policy: "deduplicate_without_resolving_dependencies",
    unresolved_dependencies_preserved: TGHEE_DEPENDENCIES,
    event_ancestry: events.map((event) => ({
      event_id: event.event_id,
      type: event.type,
      actor: event.actor,
      dependencies: event.dependencies,
    })),
  };
}

export function enforceLineageStrict(lineage) {
  const failures = [];
  for (const dependency of TGHEE_DEPENDENCIES) {
    if (!lineage.unresolved_dependencies_preserved.includes(dependency)) failures.push(`missing dependency ancestry: ${dependency}`);
  }
  if (lineage.streams.some((stream) => stream.lineage_state !== "blocked_safe_unresolved")) {
    failures.push("lineage state stopped being blocked_safe_unresolved");
  }
  if (lineage.streams.some((stream) => stream.stream !== "A46" && stream.superseded_by !== "A46 convergence governance")) {
    failures.push("non-A46 lineage did not preserve A46 supersession");
  }
  if (failures.length > 0) throw new Error(`TGHEE lineage strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}
