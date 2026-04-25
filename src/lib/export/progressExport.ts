// src/lib/export/progressExport.ts
//
// Step 11 — client-side export of a user's own progress data.
// Free-tier feature; drives evangelism via "look what I learned"
// posts. The reads run through the singleton supabase client so
// existing RLS policies guarantee a user only ever exports their own
// rows — there's no admin client and no service-role escalation here.
//
// Three data sources combined into one export bundle:
//   - profile     → streak counters, total XP, lessons completed
//   - room progress (last 90 days) → which rooms, how far, when last seen
//   - weakness areas → tag, mistakes_count, last_seen
//
// CSV is the user-facing default (opens in Excel / Google Sheets).
// JSON is the "developer" path — same data, machine-shaped, useful for
// users who want to feed their data into another tool.

import { supabase } from "@/lib/supabaseClient";

const RECENT_PROGRESS_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface ProgressExportProfile {
  user_id: string;
  username: string | null;
  streak_current: number;
  streak_longest: number;
  total_xp: number;
  lessons_completed: number;
}

export interface ProgressExportRoom {
  room_id: string;
  progress_pct: number;
  last_seen_at: string | null;
}

export interface ProgressExportWeakness {
  tag: string;
  mistakes_count: number;
  last_seen_at: string | null;
}

export interface ProgressExportBundle {
  exported_at: string;
  profile: ProgressExportProfile;
  rooms: ProgressExportRoom[];
  weaknesses: ProgressExportWeakness[];
}

export type ExportFormat = "csv" | "json";

/**
 * Load every row this user is allowed to read across the three
 * sources. RLS on profiles, user_room_progress, and user_weakness
 * (or whichever table holds weakness counts) all use `user_id =
 * auth.uid()` policies, so this function returns ONLY the caller's
 * data even though it's the same query path an admin would use.
 */
export async function buildProgressExportBundle(
  userId: string,
  now: Date = new Date(),
): Promise<ProgressExportBundle> {
  if (!userId) {
    throw new Error("buildProgressExportBundle: userId is required");
  }
  const cutoffIso = new Date(now.getTime() - RECENT_PROGRESS_DAYS * DAY_MS).toISOString();

  const [profileRes, xpRes, lessonsRes, roomsRes, weaknessRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, streak_current, streak_longest")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("user_xp")
      .select("total_xp")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("user_room_progress")
      .select("room_id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("progress_pct", 100),
    supabase
      .from("user_room_progress")
      .select("room_id, progress_pct, last_seen_at")
      .eq("user_id", userId)
      .gte("last_seen_at", cutoffIso)
      .order("last_seen_at", { ascending: false })
      .limit(500),
    // Best-effort: the weakness table is optional — return [] if it
    // doesn't exist or the read fails.
    supabase
      .from("user_weakness_tags")
      .select("tag, mistakes_count, last_seen_at")
      .eq("user_id", userId)
      .order("mistakes_count", { ascending: false })
      .limit(100),
  ]);

  const profileRow = (profileRes.data ?? null) as
    | { id: string; username: string | null; streak_current: number; streak_longest: number }
    | null;
  const xpRow = (xpRes.data ?? null) as { total_xp: number | null } | null;

  const rooms: ProgressExportRoom[] = Array.isArray(roomsRes.data)
    ? (roomsRes.data as ProgressExportRoom[])
    : [];

  const weaknesses: ProgressExportWeakness[] = Array.isArray(weaknessRes.data)
    ? (weaknessRes.data as ProgressExportWeakness[])
    : [];

  return {
    exported_at: now.toISOString(),
    profile: {
      user_id: userId,
      username: profileRow?.username ?? null,
      streak_current: profileRow?.streak_current ?? 0,
      streak_longest: profileRow?.streak_longest ?? 0,
      total_xp: xpRow?.total_xp ?? 0,
      lessons_completed: lessonsRes.count ?? 0,
    },
    rooms,
    weaknesses,
  };
}

/**
 * Serialize a bundle as CSV. Three sections separated by blank lines —
 * Excel + Google Sheets handle the empty-row separator gracefully and
 * users see "Profile / Rooms / Weaknesses" as visually distinct blocks.
 */
export function bundleToCsv(bundle: ProgressExportBundle): string {
  const lines: string[] = [];

  lines.push("# MercyBlade progress export");
  lines.push(`# Exported at: ${bundle.exported_at}`);
  lines.push("");

  lines.push("# Profile");
  lines.push("user_id,username,streak_current,streak_longest,total_xp,lessons_completed");
  lines.push(
    [
      bundle.profile.user_id,
      bundle.profile.username ?? "",
      bundle.profile.streak_current,
      bundle.profile.streak_longest,
      bundle.profile.total_xp,
      bundle.profile.lessons_completed,
    ]
      .map(csvCell)
      .join(","),
  );
  lines.push("");

  lines.push(`# Rooms (last ${RECENT_PROGRESS_DAYS} days)`);
  lines.push("room_id,progress_pct,last_seen_at");
  for (const r of bundle.rooms) {
    lines.push([r.room_id, r.progress_pct, r.last_seen_at ?? ""].map(csvCell).join(","));
  }
  lines.push("");

  lines.push("# Weakness areas");
  lines.push("tag,mistakes_count,last_seen_at");
  for (const w of bundle.weaknesses) {
    lines.push(
      [w.tag, w.mistakes_count, w.last_seen_at ?? ""].map(csvCell).join(","),
    );
  }

  return lines.join("\n");
}

/** Stable JSON serialization — pretty-printed for human readability. */
export function bundleToJson(bundle: ProgressExportBundle): string {
  return JSON.stringify(bundle, null, 2);
}

/**
 * High-level export: build the bundle, serialize, return a Blob.
 * Caller is responsible for triggering the browser download.
 */
export async function exportToCsv(
  userId: string,
  now: Date = new Date(),
): Promise<{ filename: string; blob: Blob }> {
  const bundle = await buildProgressExportBundle(userId, now);
  const csv = bundleToCsv(bundle);
  return {
    filename: defaultFilename(bundle, "csv"),
    blob: new Blob([csv], { type: "text/csv;charset=utf-8" }),
  };
}

export async function exportToJson(
  userId: string,
  now: Date = new Date(),
): Promise<{ filename: string; blob: Blob }> {
  const bundle = await buildProgressExportBundle(userId, now);
  const json = bundleToJson(bundle);
  return {
    filename: defaultFilename(bundle, "json"),
    blob: new Blob([json], { type: "application/json;charset=utf-8" }),
  };
}

function defaultFilename(
  bundle: ProgressExportBundle,
  format: ExportFormat,
): string {
  const datePart = bundle.exported_at.slice(0, 10);
  const handle =
    bundle.profile.username && bundle.profile.username.length > 0
      ? bundle.profile.username
      : "user";
  return `mercyblade-${handle}-${datePart}.${format}`;
}

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // RFC 4180: wrap in quotes when value has comma, double-quote, or newline.
  // Existing double-quotes get doubled.
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
