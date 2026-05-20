import { TGHEE_BLOCKED_SAFE, stableId } from "./tghee-event-engine.mjs";

export function buildCausalityTimeline(events) {
  return {
    timeline_id: stableId("tghee-causality", events.map((event) => event.event_id).join(",")),
    causality_chain: events.map((event) => ({
      event_id: event.event_id,
      ordinal: event.ordinal,
      type: event.type,
      caused_by: event.caused_by,
      caused_next: events.filter((candidate) => candidate.caused_by.includes(event.type)).map((candidate) => candidate.event_id),
      blocked_safe_after_event: event.blocked_safe_after_event,
    })),
    current_blocked_safe_cause: events.at(-1)?.event_id,
    root_denial_cause: events[0]?.event_id,
    current_blocked_safe_posture: TGHEE_BLOCKED_SAFE,
  };
}

export function enforceCausalityStrict(timeline) {
  const failures = [];
  if (!timeline.root_denial_cause) failures.push("root denial cause missing");
  if (!timeline.current_blocked_safe_cause) failures.push("current blocked-safe cause missing");
  for (const item of timeline.causality_chain) {
    if (item.ordinal > 10 && item.caused_by.length === 0) failures.push(`${item.event_id} lost causality`);
    if (item.blocked_safe_after_event.production_safe !== false) failures.push(`${item.event_id} promoted production safety`);
  }
  if (failures.length > 0) throw new Error(`TGHEE causality strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}
