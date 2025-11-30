// supabase/functions/room-health-auto-fix/index.ts
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

type RoomRow = {
  id: string;
  slug: string | null;
  tier: string | null;
  raw_json: string | any;
};

type FixSummary = {
  room_id: string;
  slug: string | null;
  issues_fixed: string[];
  health_score: number;
  audio_coverage: number;
};

function ensureBilingualField(obj: any, field: string, issues: string[], label: string) {
  if (!obj || typeof obj !== "object") return;

  const value = obj[field];
  if (!value || typeof value !== "object") return;

  const hasEn = typeof value.en === "string" && value.en.trim().length > 0;
  const hasVi = typeof value.vi === "string" && value.vi.trim().length > 0;

  if (!hasEn && hasVi) {
    value.en = value.vi;
    issues.push(`${label}: filled missing en from vi`);
  } else if (!hasVi && hasEn) {
    value.vi = value.en;
    issues.push(`${label}: filled missing vi from en`);
  }
}

function normalizeAudio(audio: any, issues: string[], context: string): string | null {
  if (!audio) return null;

  // If object (e.g. { en: "...", vi: "..." }), use en
  if (typeof audio === "object") {
    const en = typeof audio.en === "string" ? audio.en.trim() : "";
    const vi = typeof audio.vi === "string" ? audio.vi.trim() : "";
    const chosen = en || vi;
    if (chosen) {
      issues.push(`${context}: normalized audio object to string`);
      return stripFolder(chosen);
    }
    return null;
  }

  if (typeof audio === "string") {
    const trimmed = audio.trim();
    if (!trimmed) return null;

    const normalized = stripFolder(trimmed);
    if (normalized !== trimmed) {
      issues.push(`${context}: stripped folder path from audio`);
    }
    return normalized;
  }

  return null;
}

function stripFolder(path: string): string {
  // Heuristic: keep only filename after last "/"
  const parts = path.split("/");
  return parts[parts.length - 1];
}

function ensureSeverity(entry: any, issues: string[], index: number) {
  const key = "severity_level";
  if (entry[key] == null) return;

  const raw = Number(entry[key]);
  if (Number.isNaN(raw)) {
    entry[key] = 3;
    issues.push(`entry[${index}]: invalid severity_level -> set to 3`);
    return;
  }
  let clamped = raw;
  if (raw < 1) clamped = 1;
  if (raw > 5) clamped = 5;
  if (clamped !== raw) {
    issues.push(`entry[${index}]: clamped severity_level ${raw} -> ${clamped}`);
  }
  entry[key] = clamped;
}

function ensureAllEntry(roomJson: any, issues: string[]) {
  if (!Array.isArray(roomJson.entries)) return;

  const entries = roomJson.entries;
  const hasAll = entries.some((e: any) => {
    if (!e || typeof e !== "object") return false;
    if (e.slug === "all" || e.slug === "all-entry") return true;
    if (Array.isArray(e.keywords_en) && e.keywords_en.map((s: string) => s.toLowerCase()).includes("all")) {
      return true;
    }
    return false;
  });

  if (hasAll) return;

  const slugs = entries
    .map((e: any) => (e && typeof e.slug === "string" ? e.slug : null))
    .filter(Boolean);

  const enIntro =
    "This entry gathers all other pieces in this room so you can listen or read them straight through in one flow.";
  const viIntro =
    "Mục này gom toàn bộ các mảnh nội dung trong phòng để bạn có thể nghe hoặc đọc liền mạch trong một lần.";

  const newEntry = {
    slug: "all",
    keywords_en: ["all", "summary", "full room"],
    keywords_vi: ["tổng thể", "tất cả", "cả phòng"],
    copy: {
      en:
        enIntro +
        (slugs.length ? ` Included entries: ${slugs.join(", ")}.` : ""),
      vi:
        viIntro +
        (slugs.length ? ` Bao gồm các mục: ${slugs.join(", ")}.` : ""),
    },
    tags: ["meta", "all"],
    audio: null,
  };

  roomJson.entries.push(newEntry);
  issues.push("added All entry");
}

function kebabCase(str: string): string {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "entry";
}

function ensureSlideSlug(entry: any, index: number, issues: string[]) {
  if (typeof entry.slug === "string" && entry.slug.trim()) return;

  let base = "";
  if (Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0) {
    base = String(entry.keywords_en[0]);
  } else if (entry.title && typeof entry.title === "object" && typeof entry.title.en === "string") {
    base = entry.title.en;
  } else if (entry.copy && typeof entry.copy === "object" && typeof entry.copy.en === "string") {
    base = entry.copy.en.slice(0, 40);
  } else {
    base = `entry-${index + 1}`;
  }

  entry.slug = kebabCase(base);
  issues.push(`entry[${index}]: generated slug "${entry.slug}"`);
}

function transformRoomJson(roomJson: any): { fixed: any; issues: string[]; health_score: number; audio_coverage: number } {
  const issues: string[] = [];
  const json = structuredClone(roomJson);

  if (!Array.isArray(json.entries)) {
    json.entries = [];
    issues.push("entries: created empty array");
  }

  // Root bilingual fields
  ensureBilingualField(json, "title", issues, "root.title");
  ensureBilingualField(json, "content", issues, "root.content");

  const entries = json.entries;

  let totalEntries = entries.length;
  let entriesWithAudio = 0;
  let entriesWithFullLang = 0;

  entries.forEach((entry: any, index: number) => {
    if (!entry || typeof entry !== "object") return;

    // Ensure copy.en & copy.vi
    ensureBilingualField(entry, "copy", issues, `entry[${index}].copy`);

    const copy = entry.copy;
    const hasEn = copy && typeof copy.en === "string" && copy.en.trim().length > 0;
    const hasVi = copy && typeof copy.vi === "string" && copy.vi.trim().length > 0;
    if (hasEn && hasVi) entriesWithFullLang++;

    // Normalize audio
    const normalizedAudio = normalizeAudio(entry.audio, issues, `entry[${index}]`);
    entry.audio = normalizedAudio;
    if (normalizedAudio) entriesWithAudio++;

    // Severity 1–5
    ensureSeverity(entry, issues, index);

    // Slug
    ensureSlideSlug(entry, index, issues);
  });

  // All entry
  ensureAllEntry(json, issues);

  // Recompute counts if All entry added
  totalEntries = json.entries.length;
  // "All" entry might not have audio or full-lang; we recompute safe
  entriesWithAudio = 0;
  entriesWithFullLang = 0;
  json.entries.forEach((entry: any) => {
    if (!entry || typeof entry !== "object") return;
    if (entry.audio && typeof entry.audio === "string" && entry.audio.trim()) {
      entriesWithAudio++;
    }
    const c = entry.copy;
    const hasEn = c && typeof c.en === "string" && c.en.trim().length > 0;
    const hasVi = c && typeof c.vi === "string" && c.vi.trim().length > 0;
    if (hasEn && hasVi) entriesWithFullLang++;
  });

  const audioCoverage =
    totalEntries > 0 ? Math.round((entriesWithAudio / totalEntries) * 100) : 100;
  const languageCoverage =
    totalEntries > 0 ? Math.round((entriesWithFullLang / totalEntries) * 100) : 100;

  const healthScore = Math.round((audioCoverage + languageCoverage) / 2);

  return {
    fixed: json,
    issues,
    health_score: healthScore,
    audio_coverage: audioCoverage,
  };
}

async function processRoom(room: RoomRow): Promise<FixSummary> {
  let parsed: any;
  const issues: string[] = [];

  try {
    parsed =
      typeof room.raw_json === "string"
        ? JSON.parse(room.raw_json)
        : room.raw_json;
  } catch (_err) {
    issues.push("raw_json is invalid JSON – skipping auto-fix");
    return {
      room_id: room.id,
      slug: room.slug,
      issues_fixed: issues,
      health_score: 0,
      audio_coverage: 0,
    };
  }

  const { fixed, issues: fixIssues, health_score, audio_coverage } =
    transformRoomJson(parsed);
  issues.push(...fixIssues);

  const updatedRaw = JSON.stringify(fixed);

  const { error } = await supabase
    .from("rooms")
    .update({
      raw_json: updatedRaw,
      health_score,
      audio_coverage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", room.id);

  if (error) {
    issues.push(`DB update error: ${error.message}`);
  } else {
    issues.push("room JSON + health metrics updated");
  }

  return {
    room_id: room.id,
    slug: room.slug,
    issues_fixed: issues,
    health_score,
    audio_coverage,
  };
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const roomId: string | undefined = body.room_id;
    const roomIds: string[] | undefined = body.room_ids;

    if (!roomId && (!roomIds || roomIds.length === 0)) {
      return new Response(
        JSON.stringify({ error: "room_id or room_ids is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let ids: string[] = [];
    if (roomId) ids = [roomId];
    if (roomIds && Array.isArray(roomIds)) ids = [...new Set([...ids, ...roomIds])];

    const { data: rooms, error } = await supabase
      .from("rooms")
      .select("id, slug, tier, raw_json")
      .in("id", ids);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!rooms || rooms.length === 0) {
      return new Response(
        JSON.stringify({ error: "No rooms found for given ids" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const summaries: FixSummary[] = [];
    for (const room of rooms as RoomRow[]) {
      const summary = await processRoom(room);
      summaries.push(summary);
    }

    return new Response(
      JSON.stringify({
        message: "room-health-auto-fix completed",
        processed: summaries.length,
        summaries,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("room-health-auto-fix error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
