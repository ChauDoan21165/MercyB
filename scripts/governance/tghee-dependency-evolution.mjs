import { TGHEE_DEPENDENCIES, TGHEE_STREAMS, stableId } from "./tghee-event-engine.mjs";

export function buildUnresolvedDependencyHistory(events) {
  return {
    history_id: stableId("tghee-unresolved-dependencies", events.length),
    dependencies: TGHEE_DEPENDENCIES.map((dependency) => {
      const relatedEvents = events.filter((event) => event.dependencies.includes(dependency));
      return {
        dependency,
        originated_at_event_id: relatedEvents[0]?.event_id ?? null,
        propagated_event_ids: relatedEvents.map((event) => event.event_id),
        blocked_streams: TGHEE_STREAMS.filter((stream) => stream !== "A46"),
        unresolved_duration_state: "unresolved_since_introduction",
        reinforced_by_denial_events: relatedEvents
          .filter((event) => /denial|strict|rejected|regeneration|dependency/i.test(`${event.type} ${event.summary}`))
          .map((event) => event.event_id),
        current_state: "unresolved",
      };
    }),
    propagation_waves: [
      {
        wave: "initial_denial",
        event_types: ["denial introduced", "unresolved dependency added"],
        effect: "blocked reliability readiness without resolving upstream evidence gaps",
      },
      {
        wave: "convergence_normalization",
        event_types: ["lineage superseded", "canonical authority changed"],
        effect: "centralized dependency lineage under A46 without promoting readiness",
      },
      {
        wave: "recursive_reinforcement",
        event_types: ["replay poisoning rejected", "adversarial fixture rejected", "deterministic regeneration verified"],
        effect: "reinforced unresolved dependencies under adversarial replay pressure",
      },
    ],
  };
}

export function enforceDependencyStrict(history) {
  const failures = [];
  for (const item of history.dependencies) {
    if (item.current_state !== "unresolved") failures.push(`${item.dependency} changed from unresolved`);
    if (!item.originated_at_event_id) failures.push(`${item.dependency} lost origin event`);
    if (item.propagated_event_ids.length === 0) failures.push(`${item.dependency} lost propagation ancestry`);
  }
  if (failures.length > 0) throw new Error(`TGHEE dependency strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}
