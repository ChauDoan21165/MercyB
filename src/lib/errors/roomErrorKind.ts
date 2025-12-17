import { RoomJsonNotFoundError } from "@/lib/roomJsonResolver";

export function classifyRoomError(err: unknown): "not_found" | "json_invalid" | "network" | "server" {
  if (err instanceof RoomJsonNotFoundError) {
    const reason = (err.reason || "").toLowerCase();
    const detail = (err.detail || "").toLowerCase();

    // Only true “does not exist”
    if (reason.includes("http 404") || reason.includes("file not found") || detail.includes("http 404")) {
      return "not_found";
    }

    // Everything else is: file exists but room is invalid
    return "json_invalid";
  }

  // Fetch errors / offline etc.
  if (err instanceof TypeError) return "network";

  return "server";
}
