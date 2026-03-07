// FILE: src/lib/feedback-ids.ts

const SESSION_KEY = "mb_session_id";

function randomId(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2)}`;

  return `${prefix}_${rand}`;
}

export function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const id = randomId("sess");
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

export function newConversationId(): string {
  return randomId("conv");
}

export function newResponseId(): string {
  return randomId("resp");
}