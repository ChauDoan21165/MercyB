import type { PlacementV3Session } from "./types.ts";

export const SAME_SESSION_RESUME_MS = 24 * 60 * 60 * 1000;
export const EXPIRED_SESSION_VISIBILITY_MS = 7 * 24 * 60 * 60 * 1000;

export type ResumeDecision =
  | {
    type: "resume_same_session";
    reason: "recent_in_progress";
    lastActivity: string;
  }
  | {
    type: "expired";
    reason: "inactive_over_24h";
    lastActivity: string;
  }
  | {
    type: "no_session";
    reason: "none_found";
  }
  | {
    type: "terminal";
    reason: "completed" | "abandoned";
    lastActivity: string;
  };

export function decideResumePolicy(
  session: PlacementV3Session | null,
  nowIso: string,
): ResumeDecision {
  if (!session) return { type: "no_session", reason: "none_found" };
  if (session.flow_state === "completed") {
    return {
      type: "terminal",
      reason: "completed",
      lastActivity: session.updated_at,
    };
  }
  if (session.flow_state === "abandoned") {
    return {
      type: "terminal",
      reason: "abandoned",
      lastActivity: session.updated_at,
    };
  }

  const ageMs = sessionAgeMs(session, nowIso);
  if (ageMs > SAME_SESSION_RESUME_MS) {
    return {
      type: "expired",
      reason: "inactive_over_24h",
      lastActivity: session.updated_at,
    };
  }
  return {
    type: "resume_same_session",
    reason: "recent_in_progress",
    lastActivity: session.updated_at,
  };
}

export function shouldOfferFreshStartAfterExpiry(
  session: PlacementV3Session,
  nowIso: string,
): boolean {
  return sessionAgeMs(session, nowIso) >= EXPIRED_SESSION_VISIBILITY_MS;
}

function sessionAgeMs(session: PlacementV3Session, nowIso: string): number {
  const updated = Date.parse(session.updated_at);
  const now = Date.parse(nowIso);
  if (!Number.isFinite(updated) || !Number.isFinite(now)) return 0;
  return Math.max(0, now - updated);
}
