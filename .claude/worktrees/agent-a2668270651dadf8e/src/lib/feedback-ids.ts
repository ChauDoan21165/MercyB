// FILE: src/lib/feedback-ids.ts

const SESSION_KEY = "mb_session_id";
// Stable across sessions (localStorage, not sessionStorage) so repeat
// feedback from the same browser can be de-duplicated server-side.
const ANON_KEY = "mb_feedback_anon_id";

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

/**
 * Stable anonymous actor id for feedback attribution. Persists in
 * localStorage so the same browser keeps one id across sessions; falls
 * back to a fresh ephemeral id when storage is unavailable (private
 * mode / SSR) rather than throwing — feedback must never break the
 * surface it is attached to.
 */
export function getAnonId(): string {
  try {
    const existing = localStorage.getItem(ANON_KEY);
    if (existing) return existing;
    const id = randomId("anon");
    localStorage.setItem(ANON_KEY, id);
    return id;
  } catch {
    return randomId("anon");
  }
}