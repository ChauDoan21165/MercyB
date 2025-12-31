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

  // Fetch assignments possibly relevant to this room
  // We query broadly then resolve priority in code to avoid schema brittleness.
  const { data: assignments, error: aErr } = await supabase
    .from("room_specification_assignments")
    .select("*");

  if (aErr) {
    // Fail open: return defaults rather than breaking room rendering
    console.warn("[roomSpec] assignments query failed:", aErr.message);
    return { ...DEFAULT_ROOM_SPEC };
  }

  const rows = Array.isArray(assignments) ? assignments : [];

  // Determine which assignments match room/tier/app
  const matches: Array<{ scope: Scope; specId: string }> = [];

  for (const row of rows) {
    const scope = normalizeScope(
      firstDefined(row.scope, row.target_scope, row.applies_to, row.level)
    );
    if (!scope) continue;

    // Allow various column names for target identifiers
    const targetRoomId = firstDefined(
      row.room_id,
      row.roomId,
      row.target_room_id,
      row.targetRoomId,
      row.target_id,
      row.targetId
    );

    const targetTier = firstDefined(
      row.tier,
      row.tier_id,
      row.tierId,
      row.target_tier,
      row.targetTier
    );

    const isMatch =
      scope === "room"
        ? String(targetRoomId || "").trim() === rid
        : scope === "tier"
        ? t && String(targetTier || "").trim().toLowerCase() === t
        : scope === "app";

    if (!isMatch) continue;

    // Spec id (many schemas store it as spec_id or room_specification_id)
    const specId = firstDefined(
      row.spec_id,
      row.specId,
      row.room_specification_id,
      row.roomSpecificationId,
      row.specification_id,
      row.specificationId,
      row.room_spec_id,
      row.roomSpecId,
      row.target_spec_id,
      row.targetSpecId
    );

    if (!specId) continue;

    matches.push({ scope, specId: String(specId) });
  }

  // If nothing assigned, defaults apply
  if (matches.length === 0) return { ...DEFAULT_ROOM_SPEC };

  // Priority: room > tier > app
  const best =
    matches.find((m) => m.scope === "room") ||
    matches.find((m) => m.scope === "tier") ||
    matches.find((m) => m.scope === "app") ||
    null;

  if (!best) return { ...DEFAULT_ROOM_SPEC };

  // Fetch spec record
  const { data: specRow, error: sErr } = await supabase
    .from("room_specifications")
    .select("*")
    .eq("id", best.specId)
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
    id: String(specRow.id ?? best.specId),
    use_color_theme,
    nav_mode,
    title_align,
    feedback_mode,
  };
}
