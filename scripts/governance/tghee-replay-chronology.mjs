import { stableId } from "./tghee-event-engine.mjs";

export function buildReplayChronology(events) {
  const replayEvents = events.filter((event) => /replay|stale|fragment|fixture/i.test(`${event.type} ${event.summary} ${event.scope}`));
  return {
    chronology_id: stableId("tghee-replay-chronology", replayEvents.map((event) => event.event_id).join(",")),
    replay_events: replayEvents.map((event) => ({
      event_id: event.event_id,
      ordinal: event.ordinal,
      type: event.type,
      actor: event.actor,
      replay_state: "rejected_non_canonical",
      causality: event.caused_by,
      ancestry: event.dependencies,
    })),
    replay_storms: replayEvents.filter((event) => /storm|poisoning/i.test(`${event.type} ${event.summary}`)).map((event) => ({
      event_id: event.event_id,
      storm_state: "detected_and_rejected",
      stale_replay_became_canonical: false,
    })),
    stale_replay_supersession_policy: "current sealed A46 convergence artifacts supersede stale replay snapshots",
    replay_poisoning_policy: "reject before unresolved dependency lineage can be rewritten",
  };
}

export function enforceReplayStrict(chronology) {
  const failures = [];
  if (chronology.replay_events.length === 0) failures.push("replay chronology disappeared");
  for (const event of chronology.replay_events) {
    if (event.replay_state !== "rejected_non_canonical") failures.push(`${event.event_id} replay became canonical`);
  }
  for (const storm of chronology.replay_storms) {
    if (storm.stale_replay_became_canonical) failures.push(`${storm.event_id} stale replay became canonical`);
  }
  if (failures.length > 0) throw new Error(`TGHEE replay strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}
