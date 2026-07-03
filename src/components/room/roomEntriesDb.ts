import { stripTierSuffix } from "@/components/room/roomIdUtils";

type UnknownRecord = Record<string, unknown>;

function isRecord(x: unknown): x is UnknownRecord {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

function readRecord(record: UnknownRecord, key: string): UnknownRecord | null {
  const value = record[key];
  return isRecord(value) ? value : null;
}

function asArray(x: unknown): unknown[] {
  return Array.isArray(x) ? x : [];
}

function looksUsefulEntryObject(obj: unknown): obj is UnknownRecord {
  if (!isRecord(obj)) return false;

  if (obj.audio || obj.mp3 || obj.audio_url || obj.audioUrl) return true;

  const hasText =
    typeof obj.text === "string" ||
    typeof obj.content === "string" ||
    typeof obj.content_en === "string" ||
    typeof obj.content_vi === "string" ||
    typeof obj.copy_en === "string" ||
    typeof obj.copy_vi === "string";

  if (hasText) return true;

  const title = readRecord(obj, "title");
  if (obj.id || obj.slug || obj.keyword || obj.title_en || obj.title_vi || title?.en || title?.vi) return true;

  return false;
}

function normalizeTypedRoomEntryRow(row: UnknownRecord): UnknownRecord {
  const id = row.id ?? row.slug ?? row.keyword ?? row.index ?? undefined;

  const keyword = typeof row.keyword === "string" ? row.keyword : "";
  const slug = typeof row.slug === "string" ? row.slug : keyword;

  const audio =
    (typeof row.audio === "string" ? row.audio : "") ||
    (typeof row.audio_url === "string" ? row.audio_url : "") ||
    (typeof row.audioUrl === "string" ? row.audioUrl : "") ||
    "";

  const en =
    (typeof row.content_en === "string" ? row.content_en : "") ||
    (typeof row.copy_en === "string" ? row.copy_en : "") ||
    (typeof row.text_en === "string" ? row.text_en : "") ||
    "";

  const vi =
    (typeof row.content_vi === "string" ? row.content_vi : "") ||
    (typeof row.copy_vi === "string" ? row.copy_vi : "") ||
    (typeof row.text_vi === "string" ? row.text_vi : "") ||
    "";

  return {
    id,
    keyword,
    slug: slug || keyword,
    audio,
    audio_url: audio,
    audioUrl: audio,

    content_en: en,
    content_vi: vi,
    content: en || vi,

    // aliases used by older UI
    copy_en: en,
    copy_vi: vi,
    text_en: en,
    text_vi: vi,
    text: en || vi,

    title_en: keyword || slug,
    title_vi: keyword || slug,

    tags: row?.tags,
    metadata: row?.metadata,
    severity: row?.severity,
  };
}

export function coerceRoomEntryRowToEntry(row: unknown): unknown {
  if (!isRecord(row)) return row;

  const preferred = [row.entry, row.payload, row.data, row.content, row.room_entry, row.roomEntry, row.value].filter(
    Boolean
  );

  for (const v of preferred) {
    if (looksUsefulEntryObject(v)) return v;
  }

  // scan keys for object payload
  let best: UnknownRecord | null = null;
  let bestScore = -1;

  for (const key of Object.keys(row)) {
    const val = row[key];
    if (!looksUsefulEntryObject(val)) continue;

    const k = key.toLowerCase();
    let score = 0;
    if (k.includes("entry")) score += 6;
    if (k.includes("payload")) score += 5;
    if (k.includes("content")) score += 4;
    if (k.includes("data")) score += 3;

    if (val.audio || val.mp3 || val.audio_url || val.audioUrl) score += 4;
    if (typeof val.content_en === "string" || typeof val.content_vi === "string") score += 3;
    if (typeof val.text === "string" || typeof val.content === "string") score += 2;

    if (score > bestScore) {
      bestScore = score;
      best = val;
    }
  }

  if (best) return best;

  return normalizeTypedRoomEntryRow(row);
}

function sortRoomEntryRows(rows: unknown[]): unknown[] {
  const arr = asArray(rows).slice();
  arr.sort((a, b) => {
    const ar = isRecord(a) ? a : {};
    const br = isRecord(b) ? b : {};
    const ai = Number.isFinite(Number(ar.index)) ? Number(ar.index) : Number.POSITIVE_INFINITY;
    const bi = Number.isFinite(Number(br.index)) ? Number(br.index) : Number.POSITIVE_INFINITY;
    if (ai !== bi) return ai - bi;

    const at = ar.created_at ? new Date(String(ar.created_at)).getTime() : 0;
    const bt = br.created_at ? new Date(String(br.created_at)).getTime() : 0;
    if (at !== bt) return at - bt;

    return String(ar.id ?? "").localeCompare(String(br.id ?? ""));
  });
  return arr;
}

type RoomEntriesSupabaseLike = {
  from: (table: "room_entries") => {
    select: (columns: string) => {
      or: (filter: string) => RoomEntriesQueryLike;
      eq: (column: string, value: string) => RoomEntriesQueryLike;
    };
  };
};

type RoomEntriesResult = {
  data: unknown;
  error: { message?: string } | null;
};

type RoomEntriesQueryLike = PromiseLike<RoomEntriesResult> & {
  order: (column: string, options: { ascending: boolean }) => RoomEntriesQueryLike;
};

export async function fetchRoomEntriesDb(supabase: RoomEntriesSupabaseLike, effectiveRoomId: string) {
  const ridEffective = String(effectiveRoomId || "").trim();
  const ridCore = stripTierSuffix(ridEffective);

  if (!ridEffective) return { rows: [], error: null as string | null };

  try {
    const q = supabase.from("room_entries").select("*");

    const query =
      ridCore && ridCore !== ridEffective
        ? q.or(`room_id.eq.${ridEffective},room_id.eq.${ridCore}`)
        : q.eq("room_id", ridEffective);

    const { data, error } = await query.order("index", { ascending: true }).order("id", { ascending: true });

    if (error) return { rows: [], error: error.message || "DB error" };

    return { rows: sortRoomEntryRows(Array.isArray(data) ? data : []), error: null };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e || "DB error");
    return { rows: [], error: message };
  }
}
