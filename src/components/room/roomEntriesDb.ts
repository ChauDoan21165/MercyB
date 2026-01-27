// FILE: src/components/room/roomEntriesDb.ts
// VERSION: MB-BLUE-99.11y-roomEntriesDb-in-query — 2026-01-22 (+0700)
//
// FIX:
// - Support roomIdOrIds: string | string[]
// - Query by BOTH effective + core via .in("room_id", ids) (single round-trip)
// - Return sourceRoomId: which id actually produced rows (best-effort)
// - Keep coercion + sorting behavior stable

import { stripTierSuffix } from "@/components/room/roomIdUtils";

function asArray(x: any) {
  return Array.isArray(x) ? x : [];
}

function uniqStrings(ids: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of ids) {
    const s = String(raw || "").trim();
    if (!s) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function normalizeRoomIdsForQuery(roomIdOrIds: string | string[]) {
  const baseIds = Array.isArray(roomIdOrIds) ? roomIdOrIds : [roomIdOrIds];

  const expanded: string[] = [];
  for (const id of baseIds) {
    const rid = String(id || "").trim();
    if (!rid) continue;

    expanded.push(rid);

    const core = stripTierSuffix(rid);
    if (core && core !== rid) expanded.push(core);
  }

  return uniqStrings(expanded);
}

function looksUsefulEntryObject(obj: any): boolean {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;

  if (obj.audio || obj.mp3 || obj.audio_url || obj.audioUrl) return true;

  const hasText =
    typeof obj.text === "string" ||
    typeof obj.content === "string" ||
    typeof obj.content_en === "string" ||
    typeof obj.content_vi === "string" ||
    typeof obj.copy_en === "string" ||
    typeof obj.copy_vi === "string";

  if (hasText) return true;

  if (obj.id || obj.slug || obj.keyword || obj.title_en || obj.title_vi || obj.title?.en || obj.title?.vi) return true;

  return false;
}

function normalizeTypedRoomEntryRow(row: any): any {
  const id = row?.id ?? row?.slug ?? row?.keyword ?? row?.index ?? undefined;

  const keyword = typeof row?.keyword === "string" ? row.keyword : "";
  const slug = typeof row?.slug === "string" ? row.slug : keyword;

  const audio =
    (typeof row?.audio === "string" ? row.audio : "") ||
    (typeof row?.audio_url === "string" ? row.audio_url : "") ||
    (typeof row?.audioUrl === "string" ? row.audioUrl : "") ||
    "";

  const en =
    (typeof row?.content_en === "string" ? row.content_en : "") ||
    (typeof row?.copy_en === "string" ? row.copy_en : "") ||
    (typeof row?.text_en === "string" ? row.text_en : "") ||
    "";

  const vi =
    (typeof row?.content_vi === "string" ? row.content_vi : "") ||
    (typeof row?.copy_vi === "string" ? row.copy_vi : "") ||
    (typeof row?.text_vi === "string" ? row.text_vi : "") ||
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

export function coerceRoomEntryRowToEntry(row: any): any {
  if (!row || typeof row !== "object") return row;

  const preferred = [row.entry, row.payload, row.data, row.content, row.room_entry, row.roomEntry, row.value].filter(
    Boolean
  );

  for (const v of preferred) {
    if (looksUsefulEntryObject(v)) return v;
  }

  // scan keys for object payload
  let best: any = null;
  let bestScore = -1;

  for (const key of Object.keys(row)) {
    const val = (row as any)[key];
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

function sortRoomEntryRows(rows: any[]): any[] {
  const arr = asArray(rows).slice();
  arr.sort((a, b) => {
    const ai = Number.isFinite(Number(a?.index)) ? Number(a.index) : Number.POSITIVE_INFINITY;
    const bi = Number.isFinite(Number(b?.index)) ? Number(b.index) : Number.POSITIVE_INFINITY;
    if (ai !== bi) return ai - bi;

    const at = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const bt = b?.created_at ? new Date(b.created_at).getTime() : 0;
    if (at !== bt) return at - bt;

    return String(a?.id ?? "").localeCompare(String(b?.id ?? ""));
  });
  return arr;
}

export async function fetchRoomEntriesDb(supabase: any, roomIdOrIds: string | string[]) {
  const ids = normalizeRoomIdsForQuery(roomIdOrIds);

  if (ids.length === 0) {
    return { rows: [], error: null as string | null, sourceRoomId: null as string | null };
  }

  // Keep the first provided id as "effective" for choosing a likely source.
  const effective = String(Array.isArray(roomIdOrIds) ? roomIdOrIds[0] : roomIdOrIds || "").trim();
  const core = effective ? stripTierSuffix(effective) : "";

  try {
    const { data, error } = await supabase
      .from("room_entries")
      .select("*")
      .in("room_id", ids)
      .order("index", { ascending: true })
      .order("id", { ascending: true });

    if (error) return { rows: [], error: error.message || "DB error", sourceRoomId: null as string | null };

    const rows = sortRoomEntryRows(Array.isArray(data) ? data : []);

    // Best-effort: infer which id actually returned rows.
    let sourceRoomId: string | null = null;
    if (rows.length > 0) {
      const hasEffective = effective ? rows.some((r) => String((r as any)?.room_id || "") === effective) : false;
      const hasCore = core ? rows.some((r) => String((r as any)?.room_id || "") === core) : false;

      if (hasEffective) sourceRoomId = effective;
      else if (hasCore) sourceRoomId = core;
      else sourceRoomId = String((rows[0] as any)?.room_id || "") || null;
    }

    return { rows, error: null as string | null, sourceRoomId };
  } catch (e: any) {
    return { rows: [], error: String(e?.message || e || "DB error"), sourceRoomId: null as string | null };
  }
}
