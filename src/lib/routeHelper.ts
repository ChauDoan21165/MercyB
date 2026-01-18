// src/lib/routeHelper.ts
// MB-BLUE-ROUTE-1.0 — Production-only route helpers
// IMPORTANT:
// - NO test code in here (no describe/it/expect).
// - Keep helpers deterministic.
// - Tests live in src/lib/__tests__/routeHelper.test.ts

export type RoomRouteKind = "room" | "tiers" | "home" | "signin" | "admin";

export const ROUTES = {
  home: "/",
  signin: "/signin",
  admin: "/admin",
  tiers: "/tiers",
  room: (roomId: string) => `/room/${encodeURIComponent(roomId)}`,
} as const;

export function normalizeRoomId(roomId: string): string {
  const id = (roomId ?? "").trim();
  if (!id) return "";
  return id.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function stripRoomAccessSuffix(roomId: string): string {
  const id = normalizeRoomId(roomId);
  return id.replace(/_(vip|free)$/i, "");
}

export function isSafeInternalPath(path: string | null | undefined): boolean {
  if (!path) return false;
  const p = path.trim();
  if (!p.startsWith("/")) return false;
  if (p.startsWith("//")) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(p)) return false;
  if (p.includes("\n") || p.includes("\r")) return false;
  return true;
}

export function sanitizeReturnTo(
  returnTo: string | null | undefined,
  fallback: string = ROUTES.home
): string {
  if (!returnTo) return fallback;
  const trimmed = returnTo.trim();
  return isSafeInternalPath(trimmed) ? trimmed : fallback;
}

export function withReturnTo(path: string, returnTo: string): string {
  const base = path || ROUTES.home;
  const rt = sanitizeReturnTo(returnTo, ROUTES.home);
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}returnTo=${encodeURIComponent(rt)}`;
}

export function readReturnTo(
  searchParams: { get: (k: string) => string | null } | null | undefined,
  fallback: string = ROUTES.home
): string {
  const raw = searchParams?.get?.("returnTo") ?? null;
  return sanitizeReturnTo(raw, fallback);
}

export function roomPath(roomId: string): string {
  const id = normalizeRoomId(roomId);
  return ROUTES.room(id);
}

export function classifyRoute(pathname: string): RoomRouteKind {
  const p = (pathname ?? "").trim();
  if (p === ROUTES.home) return "home";
  if (p.startsWith(ROUTES.signin)) return "signin";
  if (p.startsWith(ROUTES.admin)) return "admin";
  if (p.startsWith(ROUTES.tiers)) return "tiers";
  if (p.startsWith("/room/")) return "room";
  return "home";
}

export function extractRoomIdFromPath(pathname: string): string {
  const p = (pathname ?? "").trim();
  const prefix = "/room/";
  if (!p.startsWith(prefix)) return "";
  const rest = p.slice(prefix.length);
  const seg = rest.split("/")[0] ?? "";
  try {
    return decodeURIComponent(seg);
  } catch {
    return seg;
  }
}
