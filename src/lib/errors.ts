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

/**
 * Map legacy error codes to canonical kinds
 */
export function normalizeRoomError(error: any): RoomErrorPayload {
  if (!error) {
    return { kind: "unknown" };
  }

  // If already normalized
  if (error.kind) {
    return error as RoomErrorPayload;
  }

  // Map legacy codes
  const code = error.code || error.type || "";
  
  let kind: RoomErrorKind = "unknown";
  
  if (code.includes("AUTHENTICATION") || code === "auth") {
    kind = "auth";
  } else if (code.includes("ACCESS") || code.includes("TIER") || code === "access") {
    kind = "access";
  } else if (code.includes("NOT_FOUND") || code === "not_found") {
    kind = "not_found";
  }

  return {
    code: error.code,
    roomId: error.roomId || error.room_id,
    kind,
    message: error.message,
  };
}
