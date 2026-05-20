import type {
  PlacementV3Action,
  PlacementV3FlowState,
  PlacementV3Session,
  SessionError,
} from "./types.ts";

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function isExpired(session: PlacementV3Session, nowIso: string): boolean {
  const updated = Date.parse(session.updated_at);
  const now = Date.parse(nowIso);
  return Number.isFinite(updated) && Number.isFinite(now)
    ? now - updated > SESSION_TTL_MS
    : false;
}

export function canTransition(
  from: PlacementV3FlowState,
  action: PlacementV3Action,
): boolean {
  if (from === "completed") {
    return action === "status" || action === "resume" || action === "respond";
  }
  if (from === "abandoned") {
    return action === "status" || action === "resume" || action === "start";
  }
  if (from === "error") {
    return action === "status" || action === "resume" || action === "abandon";
  }
  return true;
}

export function markAbandoned(
  session: PlacementV3Session,
  now: string,
): PlacementV3Session {
  return {
    ...session,
    flow_state: "abandoned",
    abandoned_at: now,
    updated_at: now,
  };
}

export function markCompleted(
  session: PlacementV3Session,
  now: string,
): PlacementV3Session {
  return {
    ...session,
    flow_state: "completed",
    completed_at: now,
    current_modality: null,
    updated_at: now,
  };
}

export function markError(
  session: PlacementV3Session,
  error: SessionError,
): PlacementV3Session {
  return {
    ...session,
    flow_state: "error",
    metadata: {
      ...session.metadata,
      errors: [...(session.metadata.errors ?? []), error],
    },
    updated_at: error.at,
  };
}

export function recoverFromError(
  session: PlacementV3Session,
  now: string,
): PlacementV3Session {
  return {
    ...session,
    flow_state: "in_progress",
    updated_at: now,
  };
}

export function appendRecoverableError(
  session: PlacementV3Session,
  error: SessionError,
): PlacementV3Session {
  return {
    ...session,
    metadata: {
      ...session.metadata,
      errors: [...(session.metadata.errors ?? []), error],
    },
    updated_at: error.at,
  };
}

