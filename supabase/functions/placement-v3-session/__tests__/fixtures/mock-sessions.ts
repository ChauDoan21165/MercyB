import { selectPrompt } from "../../modality.ts";
import { makeSession } from "../../persistence.ts";

export const NOW = "2026-05-20T12:00:00.000Z";
export const USER_ID = "user-1";
export const FIRST_PROMPT = selectPrompt({
  modality: "writing",
  targetLevel: "A2",
  responses: [],
});

export function freshSession() {
  return makeSession({
    id: "session-1",
    userId: USER_ID,
    now: NOW,
    prompt: FIRST_PROMPT,
  });
}

