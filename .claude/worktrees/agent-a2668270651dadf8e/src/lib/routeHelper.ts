/**
 * Path: src/lib/routeHelper.ts
 * File: routeHelper.ts
 */

export const ROUTES = {
  home: "/",
  signin: "/signin",
  admin: "/admin",
  tiers: "/tiers",
  rooms: "/rooms",
  account: "/account",
  sexualityCulture: "/sexuality-culture",
  room: (roomId: string) => `/room/${encodeURIComponent(normalizeRoomId(roomId))}`,
} as const;

export type RouteKind =
  | "home"
  | "signin"
  | "admin"
  | "tiers"
  | "rooms"
  | "room"
  | "account"
  | "unknown";

const DEFAULT_RETURN_TO: string = ROUTES.home;

function safeString(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

function normalizeMatchValue(value: string): string {
  return value.trim().toLowerCase().replace(/_/g, "-");
}

function getParentRouteForRoomId(roomId: string | null | undefined): string {
  const raw = normalizeRoomId(String(roomId ?? ""));
  const normalized = normalizeMatchValue(raw);

  if (!normalized) return ROUTES.rooms;

  if (/^sexuality-curiosity-(level3|vip3)-sub[1-6]\b/.test(normalized)) {
    return ROUTES.sexualityCulture;
  }

  if (/^sexuality-and-curiosity-and-culture-(level3|vip3)\b/.test(normalized)) {
    return "/rooms-level3";
  }

  const levelMatch = normalized.match(/(?:^|-|_)(?:level)([1-9])(?:$|-|_)/);
  if (levelMatch) {
    return `/rooms-level${levelMatch[1]}`;
  }

  const vipMatch = normalized.match(/(?:^|-|_)(?:vip)([1-9])(?:$|-|_)/);
  if (vipMatch) {
    return `/rooms-level${vipMatch[1]}`;
  }

  if (/(?:^|-|_)(level0|free)(?:$|-|_)/.test(normalized)) {
    return ROUTES.rooms;
  }

  return ROUTES.rooms;
}

export function normalizeRoomId(roomId: string): string {
  return safeString(roomId).replace(/^\/+|\/+$/g, "");
}

export function stripRoomAccessSuffix(roomId: string): string {
  const id = normalizeRoomId(roomId);
  return id.replace(/([_-])(level[1-9]|level0|vip[1-9]|vip|free)$/i, "");
}

export function extractRoomIdFromPath(path: string | null | undefined): string {
  const value = safeString(path);
  if (!value.startsWith("/room/")) return "";

  const withoutPrefix = value.slice("/room/".length);
  const firstSegment = withoutPrefix.split("/")[0];

  if (!firstSegment) return "";

  try {
    return decodeURIComponent(firstSegment);
  } catch {
    return firstSegment;
  }
}

export function isSafeInternalPath(path: string | null | undefined): boolean {
  const value = safeString(path);

  if (!value) return false;
  if (!value.startsWith("/")) return false;
  if (value.startsWith("//")) return false;
  if (/^[a-z]+:/i.test(value)) return false;
  if (value.includes("\n") || value.includes("\r")) return false;

  return true;
}

export function sanitizeReturnTo(
  path: string | null | undefined,
  fallback: string = DEFAULT_RETURN_TO
): string {
  return isSafeInternalPath(path) ? safeString(path) : fallback;
}

export function withReturnTo(path: string, returnTo: string): string {
  const safePath = sanitizeReturnTo(path, DEFAULT_RETURN_TO);
  const safeReturnTo = sanitizeReturnTo(returnTo, DEFAULT_RETURN_TO);
  const separator = safePath.includes("?") ? "&" : "?";

  return `${safePath}${separator}returnTo=${encodeURIComponent(safeReturnTo)}`;
}

export function readReturnTo(
  params: URLSearchParams | string | null | undefined,
  fallback: string = DEFAULT_RETURN_TO
): string {
  if (!params) return fallback;

  const value =
    typeof params === "string"
      ? new URLSearchParams(params).get("returnTo")
      : params.get("returnTo");

  return sanitizeReturnTo(value, fallback);
}

export function roomPath(roomId: string): string {
  return ROUTES.room(roomId);
}

export function classifyRoute(path: string | null | undefined): RouteKind {
  const safePath = sanitizeReturnTo(path, DEFAULT_RETURN_TO);

  if (safePath === ROUTES.home) return "home";
  if (safePath === ROUTES.signin) return "signin";
  if (safePath === ROUTES.admin) return "admin";
  if (safePath === ROUTES.tiers || safePath.startsWith("/tiers/")) return "tiers";
  if (
    safePath === ROUTES.rooms ||
    /^\/rooms-level[1-9]$/i.test(safePath) ||
    safePath === ROUTES.sexualityCulture
  ) {
    return "rooms";
  }
  if (safePath === ROUTES.account || safePath.startsWith("/account/")) {
    return "account";
  }
  if (safePath.startsWith("/room/")) return "room";

  return "home";
}

export function getParentRoute(input: string | null | undefined): string {
  const value = safeString(input);

  if (!value) return ROUTES.rooms;

  if (isSafeInternalPath(value)) {
    const routeKind = classifyRoute(value);

    if (routeKind === "room") {
      return getParentRouteForRoomId(extractRoomIdFromPath(value));
    }

    if (value === ROUTES.sexualityCulture) {
      return "/rooms-level3";
    }

    if (routeKind === "rooms") return ROUTES.home;
    if (routeKind === "tiers") return ROUTES.home;
    if (routeKind === "signin") return ROUTES.home;
    if (routeKind === "admin") return ROUTES.home;
    if (routeKind === "account") return ROUTES.home;

    return ROUTES.home;
  }

  return getParentRouteForRoomId(value);
}

export const getParentPath = getParentRoute;