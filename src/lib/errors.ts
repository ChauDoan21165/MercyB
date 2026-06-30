/**
 * Canonical Room Error Types
 * Single source of truth for room loading failures across entire app
 */

export type RoomErrorKind = "auth" | "access" | "not_found" | "unknown";

export interface RoomErrorPayload {
  code?: string;
  roomId?: string;
  kind?: RoomErrorKind;
  message?: string;
}

/** Shape accepted by normalizeRoomError from any caller */
interface LegacyErrorLike {
  kind?: RoomErrorKind;
  code?: string;
  type?: string;
  roomId?: string;
  room_id?: string;
  message?: string;
}

/**
 * Map legacy error codes to canonical kinds
 */
export function normalizeRoomError(error: unknown): RoomErrorPayload {
  if (!error || typeof error !== "object") {
    return { kind: "unknown" };
  }

  const err = error as LegacyErrorLike;

  // If already normalized
  if (err.kind) {
    return err as RoomErrorPayload;
  }

  // Map legacy codes
  const code = err.code || err.type || "";

  let kind: RoomErrorKind = "unknown";

  if (code.includes("AUTHENTICATION") || code === "auth") {
    kind = "auth";
  } else if (code.includes("ACCESS") || code.includes("TIER") || code === "access") {
    kind = "access";
  } else if (code.includes("NOT_FOUND") || code === "not_found") {
    kind = "not_found";
  }

  return {
    code: err.code,
    roomId: err.roomId || err.room_id,
    kind,
    message: err.message,
  };
}
