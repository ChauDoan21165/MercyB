// src/lib/conversationCapture/captureConsent.ts
//
// The privacy gate for the C2 conversation data-capture pipeline
// (src/lib/conversationCapture/conversationCapture.ts). Lane A MUST check hasCaptureConsent()
// before calling startSession / logTurn — capture stays dark until the learner
// explicitly opts in via <ConsentModal />.
//
// Opt-in by default: with no stored choice, hasCaptureConsent() is false (no
// capture). The choice is a single localStorage flag — device-local, no
// account round-trip — so it is best-effort and fail-safe: any storage error
// reads as "no consent" (fail closed, never capture without a clear yes).

const CONSENT_KEY = "mb-capture-consent";

export function getCaptureConsentKey(): string {
  return CONSENT_KEY;
}

/**
 * True only when the learner has explicitly agreed. Defaults to false — no
 * stored value, a "false" value, or any storage error all mean "do not
 * capture". This is the gate Lane A checks before startSession / logTurn.
 */
export function hasCaptureConsent(): boolean {
  try {
    return getStorage()?.getItem(CONSENT_KEY) === "true";
  } catch {
    return false; // fail closed
  }
}

/** Persist the learner's choice. true → capture allowed; false → declined. */
export function setCaptureConsent(value: boolean): void {
  try {
    getStorage()?.setItem(CONSENT_KEY, value ? "true" : "false");
  } catch {
    // best-effort; never throw into the conversation flow
  }
}

/**
 * Whether the learner has made ANY choice yet (agreed OR declined). Lane A
 * gates the one-time modal on this — show <ConsentModal /> only when this is
 * false, so a learner who declined is never re-prompted (no dark pattern).
 */
export function hasCaptureConsentDecision(): boolean {
  try {
    const raw = getStorage()?.getItem(CONSENT_KEY);
    return raw === "true" || raw === "false";
  } catch {
    return false;
  }
}

function getStorage(): Storage | null {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return null;
  }
  return window.localStorage;
}
