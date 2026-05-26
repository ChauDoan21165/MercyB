// src/lib/roomSpecification.ts
// MB-BLUE-98.5 — 2025-12-30 (+0700)
/**
 * Runtime Room Specification Resolver (AUTHORITATIVE)
 *
 * WHY:
 * - Admin UI writes intent into Supabase
 * - Runtime must resolve and apply effective spec per room
 *
 * RULES (LOCKED):
 * - No Supabase logic inside React components
 * - Priority: room > tier > app
 * - Return a single effective spec (or null)
 *
 * TABLES (EXPECTED):
 * - room_specification_assignments
 * - room_specifications
 *
 * NOTE:
 * Because column names can vary between projects, this resolver supports
 * several common column aliases. If your schema differs, we will adjust
 * the field mapping without moving logic into components.
 *
 * ✅ MB-BLUE-98.5 (UNIVERSAL ROOM UI SPEC DEFAULTS)
 * User request (LOCKED):
 * - CONTENT rooms should be universal "top keyword pills" navigation
 * - No sidebar (global)
 * - Center title (global)
 * - Thin feedback bar (global)
 *
 * Implementation:
 * - Spec defaults are applied at the resolver level (app-wide),
 *   then overridden by room/tier/app assignments (if present).
 * - Fail-open behavior remains: if Supabase queries fail, we still return
 *   DEFAULT spec (so UI stays consistent and app does not break).
 */

import { supabase } from "@/lib/supabaseClient";

export type RoomNavMode = "top" | "sidebar";
export type RoomTitleAlign = "center" | "left";
export type RoomFeedbackMode = "thin" | "off";

export type RoomSpec = {
  id: string;

  // Existing
  use_color_theme: boolean;

  // ✅ NEW universal UI spec fields
  nav_mode: RoomNavMode; // default "top" (no sidebar)
  title_align: RoomTitleAlign; // default "center"
  feedback_mode: RoomFeedbackMode; // default "thin"
};

type Scope = "room" | "tier" | "app";

const DEFAULT_ROOM_SPEC: RoomSpec = {
  id: "app_default",
  use_color_theme: true,

  // ✅ UNIVERSAL DEFAULTS (your request)
  nav_mode: "top",
  title_align: "center",
  feedback_mode: "thin",
};

function pickBool(row: any, keys: string[], fallback = false): boolean {
  for (const k of keys) {
    if (row && typeof row[k] === "boolean") return row[k];
    if (row && row[k] === 0) return false;
    if (row && row[k] === 1) return true;
  }
  return fallback;
}

function pickEnum<T extends string>(
  row: any,
  keys: string[],
  allowed: readonly T[],
  fallback: T
): T {
  for (const k of keys) {
    const v = String(row?.[k] ?? "").trim().toLowerCase();
    if (!v) continue;
    // allow some friendly aliases
    const normalized =
      v === "centre" ? "center" : v === "keywords_top" ? "top" : v;

    if ((allowed as readonly string[]).includes(normalized)) {
      return normalized as T;
    }
  }
  return fallback;
}

function firstDefined<T>(...vals: Array<T | null | undefined>): T | null {
  for (const v of vals) if (v !== null && v !== undefined) return v;
  return null;
}

function normalizeScope(raw: any): Scope | null {
  const s = String(raw || "").trim().toLowerCase();
  if (s === "room") return "room";
  if (s === "tier") return "tier";
  if (s === "app") return "app";
  return null;
}

function normalizeTier(raw: any): string | null {
  const t = String(raw || "").trim().toLowerCase();
  if (!t) return null;
  return t;
}

/**
 * getEffectiveRoomSpec(roomId, tier)
 * Returns the highest-priority assigned specification:
 *   room > tier > app
 *
 * ✅ Fail-open rule:
 * - If Supabase fails, return DEFAULT_ROOM_SPEC (NOT null),
 *   so the universal UI spec still applies everywhere.
 */
export async function getEffectiveRoomSpec(
  roomId: string,
  tier: string | null
): Promise<RoomSpec> {
  const rid = String(roomId || "").trim();
  const t = normalizeTier(tier);

  // If roomId is missing, still return defaults (app-wide behavior)
  if (!rid) return { ...DEFAULT_ROOM_SPEC };

  // Fetch assignments with three parallel filtered queries (room > tier > app).
  // Server-side filtering on (scope, target_id) avoids pulling the whole table.
  const [roomRes, tierRes, appRes] = await Promise.all([
    supabase
      .from("room_specification_assignments")
      .select("specification_id")
      .eq("scope", "room")
      .eq("target_id", rid)
      .maybeSingle(),
    t
      ? supabase
          .from("room_specification_assignments")
          .select("specification_id")
          .eq("scope", "tier")
          .eq("target_id", t)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("room_specification_assignments")
      .select("specification_id")
      .eq("scope", "app")
      .maybeSingle(),
  ]);

  if (roomRes.error || tierRes.error || appRes.error) {
    const msg =
      roomRes.error?.message ||
      tierRes.error?.message ||
      appRes.error?.message ||
      "unknown";
    console.warn("[roomSpec] assignments query failed:", msg);
    return { ...DEFAULT_ROOM_SPEC };
  }

  const specId =
    roomRes.data?.specification_id ??
    tierRes.data?.specification_id ??
    appRes.data?.specification_id ??
    null;

  if (!specId) return { ...DEFAULT_ROOM_SPEC };

  // Fetch spec record
  const { data: specRow, error: sErr } = await supabase
    .from("room_specifications")
    .select("*")
    .eq("id", specId)
    .maybeSingle();

  if (sErr) {
    console.warn("[roomSpec] spec query failed:", sErr.message);
    return { ...DEFAULT_ROOM_SPEC };
  }

  if (!specRow) return { ...DEFAULT_ROOM_SPEC };

  const use_color_theme = pickBool(specRow, [
    "use_color_theme",
    "useColorTheme",
    "color_theme_enabled",
    "colorThemeEnabled",
    "enable_color_theme",
    "enableColorTheme",
  ], DEFAULT_ROOM_SPEC.use_color_theme);

  // ✅ NEW: allow DB overrides, but defaults remain universal if absent
  const nav_mode = pickEnum<RoomNavMode>(
    specRow,
    ["nav_mode", "navMode", "navigation_mode", "navigationMode", "content_nav"],
    ["top", "sidebar"] as const,
    DEFAULT_ROOM_SPEC.nav_mode
  );

  const title_align = pickEnum<RoomTitleAlign>(
    specRow,
    ["title_align", "titleAlign", "header_align", "headerAlign"],
    ["center", "left"] as const,
    DEFAULT_ROOM_SPEC.title_align
  );

  const feedback_mode = pickEnum<RoomFeedbackMode>(
    specRow,
    ["feedback_mode", "feedbackMode", "feedback_bar", "feedbackBar"],
    ["thin", "off"] as const,
    DEFAULT_ROOM_SPEC.feedback_mode
  );

  return {
    id: String(specRow.id ?? specId),
    use_color_theme,
    nav_mode,
    title_align,
    feedback_mode,
  };
}
