// src/lib/roomJsonResolver.ts

export type RoomJsonResolverErrorKind =
  | "not_found"
  | "json_invalid"
  | "network"
  | "server";

function stripJsonSuffix(s: string): string {
  return s.replace(/\.json$/i, "");
}

function lastPathSegment(s: string): string {
  const cleaned = (s || "").trim();
  if (!cleaned) return "";
  const withoutQuery = cleaned.split("?")[0] || cleaned;
  const parts = withoutQuery.split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : withoutQuery;
}

export function canonicalizeRoomId(input: string): string {
  const seg = lastPathSegment(String(input || ""));

  return stripJsonSuffix(seg)
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function normalizeRoomIdForCanonicalFile(input: string): string {
  return canonicalizeRoomId(input);
}

// Legacy static JSON path resolution is disabled.
export function resolveRoomJsonPath(_roomIdRaw: string): string {
  throw new Error(
    "Legacy static /data room JSON loading is disabled. Use the secure loader."
  );
}

export async function loadRoomJson(roomIdRaw: string): Promise<any> {
  const id = canonicalizeRoomId(roomIdRaw);

  let res: Response;
  try {
    // Replace this URL/body with your real secure endpoint contract.
    res = await fetch("/functions/v1/secure-room-loader", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ roomId: id }),
    });
  } catch {
    const err = new Error("NETWORK_ERROR");
    (err as any).kind = "network" satisfies RoomJsonResolverErrorKind;
    throw err;
  }

  if (res.status === 404) {
    const err = new Error("ROOM_NOT_FOUND");
    (err as any).kind = "not_found" satisfies RoomJsonResolverErrorKind;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(`HTTP_${res.status}`);
    (err as any).kind = "server" satisfies RoomJsonResolverErrorKind;
    throw err;
  }

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const text = await res.text();

  if (!ct.includes("application/json") && /^\s*<!doctype html>|^\s*<html/i.test(text)) {
    const err = new Error("ROOM_NOT_FOUND");
    (err as any).kind = "not_found" satisfies RoomJsonResolverErrorKind;
    throw err;
  }

  try {
    return JSON.parse(text);
  } catch {
    const err = new Error("JSON_INVALID");
    (err as any).kind = "json_invalid" satisfies RoomJsonResolverErrorKind;
    throw err;
  }
}