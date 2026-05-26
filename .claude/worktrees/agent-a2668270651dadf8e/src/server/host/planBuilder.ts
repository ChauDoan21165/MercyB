// src/server/host/planBuilder.ts

import { TierPolicy } from "./tierPolicy";
import { HostIntent } from "./intent";

export function buildTeachingPlan({
  intent,
  userMessage,
  roomContext,
  tierPolicy,
}: {
  intent: HostIntent;
  userMessage: string;
  roomContext: any;
  tierPolicy: TierPolicy;
}) {
  switch (intent) {
    case "pronunciation":
      return {
        type: "pronunciation",
        sentence: roomContext?.active_entry ?? null,
        tierPolicy,
      };

    case "grammar_fix":
      return {
        type: "grammar",
        text: userMessage,
        tierPolicy,
      };

    case "meaning_explain":
      return {
        type: "meaning",
        text: userMessage,
        lessonObjective: roomContext?.lesson_objective,
        tierPolicy,
      };

    case "repeat_practice":
      return {
        type: "repeat",
        entry: roomContext?.active_entry,
        tierPolicy,
      };

    default:
      return {
        type: "general",
        text: userMessage,
        tierPolicy,
      };
  }
}