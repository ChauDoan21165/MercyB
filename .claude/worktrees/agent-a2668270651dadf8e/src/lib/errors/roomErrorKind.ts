/**
 * Room error classification
 * Single source of truth for mapping room-loading errors
 *
 * This file MUST NOT import itself.
 * Other files import FROM this file.
 */

export class RoomJsonNotFoundError extends Error {
  constructor(
    public room_id: string,
    public expected_path: string,
    public reason: string,
    public detail?: string
  ) {
    super(reason);
    this.name = "RoomJsonNotFoundError";
  }
}

/**
 * Classify low-level errors into UI-safe error kinds
 */
export function classifyRoomError(
  err: unknown
): "not_found" | "json_invalid" | "network" | "server" {
  // Our strict room JSON error
  if (err instanceof RoomJsonNotFoundError) {
    const reason = (err.reason || "").toLowerCase();
    const detail = (err.detail || "").toLowerCase();

    // True "room does not exist"
    if (
      reason.includes("http 404") ||
      reason.includes("file not found") ||
      reason.includes("not found") ||
      detail.includes("http 404")
    ) {
      return "not_found";
    }

    // File exists but JSON is invalid / incomplete
    return "json_invalid";
  }

  // Network / fetch failures
  if (err instanceof TypeError) {
    return "network";
  }

  // Anything else
  return "server";
}
