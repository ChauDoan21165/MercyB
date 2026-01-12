/**
 * ROOM 5-BOX SPEC (LOCKED)
 * BOX 2: Title row (tier left, title centered, fav+refresh right) — ONE ROW
 * BOX 3: Welcome line (bilingual in ONE ROW separated by " / ") + keyword buttons
 * BOX 4: EMPTY space until keyword chosen; then EN → TalkingFace → VI
 * BOX 5: Feedback bar pushed to bottom of room (no header line)
 *
 * ✅ FIX (MB-BLUE-99.10):
 * - REAL gate fix: STOP using JWT / getCurrentVipKey.
 * - Gate uses useUserAccess() which now reads public.profiles (tier, is_admin, admin_level).
 * - Admin/high-admin bypass stays (hook returns isHighAdmin => access all).
 */

// FILE: src/components/room/RoomRenderer.tsx
// MB-BLUE-99.10e → MB-BLUE-99.11d — 2026-01-11 (+0700)
//
// ✅ 99.11a FIX (DB ENTRIES):
// - Entries now come from DB: public.room_entries (RLS via has_vip_rank(required_rank))
// - Filter: room_id = effectiveRoomId
// - Prefer DB entries for allEntries + keyword fallback
// - Keep JSON deepFind fallback for weird schemas
// - Keep ROOM 5-BOX SPEC + useUserAccess gate EXACTLY (no JWT/getCurrentVipKey)
//
// ✅ 99.11b FIX (AUDIO PLAYLIST):
// - NEVER delete entries like slug "all"
// - Support consecutive audio playback UI by rendering multiple TalkingFacePlayButton
// - Accept audio formats:
//    1) audio_playlist: string[] | string | {src/url/en/vi}
//    2) audio: "a.mp3 b.mp3" (space-separated) or "a.mp3, b.mp3" (comma-separated)
//    3) normal single audio fields (audio/audioUrl/mp3/etc)
//
// ✅ 99.11c FIX (AUTH UX + TIER LABEL):
// - Show signed-in indicator + Sign out button in BOX 2 (title row)
// - Do NOT show "FREE" badge for VIP rooms when room metadata is missing
//   (infer vip tier from room id suffix _vip1.._vip9 for DISPLAY only)
//
// ✅ 99.11d FIX (SECURITY / REAL GATE):
// - If room metadata is missing (tier reads as "free") BUT room id ends with _vipX,
//   then gate requires that inferred vip tier.
//   This closes the hole where normal accounts can view VIP rooms.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BilingualEssay } from "@/components/room/BilingualEssay";
import TalkingFacePlayButton from "@/components/audio/TalkingFacePlayButton";
import { useUserAccess } from "@/hooks/useUserAccess";
import type { TierId } from "@/lib/constants/tiers";
import { normalizeTier } from "@/lib/constants/tiers";

// ✅ IMPORTANT: adjust this import to your project’s supabase client export if needed.
import { supabase } from "@/lib/supabaseClient";

type AnyRoom = any;

function asArray(x: any) {
  return Array.isArray(x) ? x : [];
}
function firstNonEmptyArray(...candidates: any[]): any[] {
  for (const c of candidates) {
    const arr = asArray(c);
    if (arr.length > 0) return arr;
  }
  return [];
}

function pickTitleENRaw(room: AnyRoom) {
  return room?.title?.en || room?.title_en || room?.name?.en || room?.name_en || "";
}
function pickTitleVIRaw(room: AnyRoom) {
  return room?.title?.vi || room?.title_vi || room?.name?.vi || room?.name_vi || "";
}

/** Remove trailing tier markers: _vip1 ... _vip9, _free */
function stripTierSuffix(id: string) {
  let s = String(id || "").trim();
  if (!s) return "";
  s = s.replace(/_(vip[1-9]|free)\b/gi, "");
  s = s.replace(/_+/g, "_").replace(/^_+|_+$/g, "");
  return s;
}

/** bipolar_support_vip1 -> "Bipolar Support" */
function prettifyRoomIdEN(id: string): string {
  const core = stripTierSuffix(id).toLowerCase();
  if (!core) return "Untitled room";
  const words = core.split("_").filter(Boolean);
  const titled = words.map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
  return titled || "Untitled room";
}

/** ✅ MB-BLUE-99.8 — prettify simple entry ids like "practice" → "Practice" */
function prettifyEntryId(id: string): string {
  const s = String(id || "").trim();
  if (!s) return "";
  if (/^[a-z0-9_]+$/.test(s) && s.includes("_")) {
    return s
      .split("_")
      .filter(Boolean)
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  }
  if (/^[a-z]+$/.test(s)) return s[0].toUpperCase() + s.slice(1);
  return s;
}

/**
 * Detect “bad” titles:
 * - equal to roomId (or equal after stripping tier suffix)
 * - snake_case-ish: has "_" and no spaces, mostly lowercase
 * - ends with _vipX/_free
 */
function isBadAutoTitle(raw: string, effectiveRoomId: string) {
  const r = String(raw || "").trim();
  if (!r) return true;

  const rid = String(effectiveRoomId || "").trim();

  const rLow = r.toLowerCase();
  const ridLow = rid.toLowerCase();

  if (rLow === ridLow) return true;

  const rCore = stripTierSuffix(rLow);
  const idCore = stripTierSuffix(ridLow);
  if (rCore && idCore && rCore === idCore) return true;

  const looksSnake = /^[a-z0-9_]+$/.test(rLow) && rLow.includes("_") && !r.includes(" ");
  const hasTierSuffix = /_(vip[1-9]|free)\b/i.test(r);

  if (looksSnake || hasTierSuffix) return true;
  return false;
}

function pickIntroEN(room: AnyRoom) {
  return (
    room?.intro?.en ||
    room?.description?.en ||
    room?.intro_en ||
    room?.description_en ||
    room?.summary?.en ||
    room?.summary_en ||
    ""
  );
}
function pickIntroVI(room: AnyRoom) {
  return (
    room?.intro?.vi ||
    room?.description?.vi ||
    room?.intro_vi ||
    room?.description_vi ||
    room?.summary?.vi ||
    room?.summary_vi ||
    ""
  );
}

/* ----------------------------------------------------- */
/* ✅ MB-BLUE-99.10e — Deep fallback for unknown schemas  */
/* ----------------------------------------------------- */

function isPlainObject(x: any) {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

/**
 * Find the FIRST array that looks like it contains room entries (array of objects),
 * anywhere inside the room object, depth-limited, cycle-safe.
 */
function deepFindFirstObjectArray(root: any, maxDepth = 6): any[] {
  const seen = new WeakSet<object>();

  const looksUsefulArray = (arr: any[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    const objCount = arr.slice(0, 8).filter((x) => x && typeof x === "object").length;
    if (objCount === 0) return false;

    const sample = arr.find((x) => x && typeof x === "object") || {};
    const hasSignals = !!(
      sample?.audio ||
      sample?.mp3 ||
      sample?.text ||
      sample?.content ||
      sample?.title ||
      sample?.id ||
      sample?.slug
    );
    return hasSignals;
  };

  const visit = (node: any, depth: number): any[] => {
    if (!node || depth > maxDepth) return [];

    if (Array.isArray(node)) {
      if (looksUsefulArray(node)) return node;

      for (const item of node) {
        const found = visit(item, depth + 1);
        if (found.length) return found;
      }
      return [];
    }

    if (isPlainObject(node)) {
      if (seen.has(node)) return [];
      seen.add(node);

      const preferredKeys = [
        "entries",
        "items",
        "cards",
        "blocks",
        "sections",
        "steps",
        "children",
        "nodes",
        "rows",
        "cols",
        "data",
        "payload",
        "content",
      ];

      for (const k of preferredKeys) {
        if (k in node) {
          const found = visit((node as any)[k], depth + 1);
          if (found.length) return found;
        }
      }

      for (const k of Object.keys(node)) {
        if (preferredKeys.includes(k)) continue;
        const v = (node as any)[k];
        if (!v || typeof v !== "object") continue;
        const found = visit(v, depth + 1);
        if (found.length) return found;
      }
    }

    return [];
  };

  return visit(root, 0);
}

function resolveTopContainers(room: AnyRoom): any[] {
  const direct = firstNonEmptyArray(
    room?.sections,
    room?.blocks,
    room?.items,
    room?.cards,
    room?.entries,

    room?.content?.sections,
    room?.content?.blocks,
    room?.content?.items,
    room?.content?.cards,
    room?.content?.entries,

    room?.content?.data?.sections,
    room?.content?.data?.blocks,
    room?.content?.data?.items,
    room?.content?.data?.cards,
    room?.content?.data?.entries,

    room?.content?.payload?.sections,
    room?.content?.payload?.blocks,
    room?.content?.payload?.items,
    room?.content?.payload?.cards,
    room?.content?.payload?.entries,

    room?.data?.sections,
    room?.data?.blocks,
    room?.data?.items,
    room?.data?.cards,
    room?.data?.entries,

    room?.payload?.sections,
    room?.payload?.blocks,
    room?.payload?.items,
    room?.payload?.cards,
    room?.payload?.entries,
  );

  if (direct.length) return direct;
  return deepFindFirstObjectArray(room, 6);
}

function resolveEntries(room: AnyRoom): any[] {
  return firstNonEmptyArray(
    room?.entries,
    room?.content?.entries,
    room?.data?.entries,
    room?.payload?.entries,

    room?.sections,
    room?.content?.sections,
    room?.content?.blocks,
    room?.blocks,
    room?.items,
    room?.content?.items,
    room?.cards,
    room?.content?.cards,
  );
}

function resolveKeywords(room: AnyRoom) {
  const en = firstNonEmptyArray(room?.keywords_en, room?.keywords?.en, room?.meta?.keywords_en);
  const vi = firstNonEmptyArray(room?.keywords_vi, room?.keywords?.vi, room?.meta?.keywords_vi);
  return { en, vi };
}

/* ----------------------------------------------------- */
/* ✅ MB-BLUE-99.10b — FLATTEN wrappers -> leaf entries   */
/* ----------------------------------------------------- */

function hasAnyChildArrays(node: any): boolean {
  if (!node || typeof node !== "object") return false;

  const buckets = [
    node?.entries,
    node?.items,
    node?.cards,
    node?.blocks,
    node?.steps,
    node?.children,
    node?.nodes,
    node?.rows,
    node?.cols,
    node?.sections,

    node?.content?.entries,
    node?.content?.items,
    node?.content?.cards,
    node?.content?.blocks,
    node?.content?.steps,
    node?.content?.children,
    node?.content?.nodes,
    node?.content?.rows,
    node?.content?.cols,
    node?.content?.sections,

    node?.content?.data?.entries,
    node?.content?.data?.items,
    node?.content?.data?.cards,
    node?.content?.data?.blocks,
    node?.content?.data?.steps,
    node?.content?.data?.sections,

    node?.content?.payload?.entries,
    node?.content?.payload?.items,
    node?.content?.payload?.cards,
    node?.content?.payload?.blocks,
    node?.content?.payload?.steps,
    node?.content?.payload?.sections,

    node?.payload?.entries,
    node?.payload?.items,
    node?.payload?.cards,
    node?.payload?.blocks,
    node?.payload?.steps,
    node?.payload?.sections,

    node?.data?.entries,
    node?.data?.items,
    node?.data?.cards,
    node?.data?.blocks,
    node?.data?.steps,
    node?.data?.sections,
  ];

  return buckets.some((b) => Array.isArray(b) && b.length > 0);
}

function looksLikeLeafEntry(x: any): boolean {
  if (!x || typeof x !== "object") return false;

  if (hasAnyChildArrays(x)) return false;

  if (
    x.audio ||
    x.audio_en ||
    x.audio_vi ||
    x.mp3 ||
    x.mp3_en ||
    x.mp3_vi ||
    x.audio_playlist ||
    x.audioPlaylist ||
    x.audios
  )
    return true;

  const hasText =
    typeof x.text === "string" ||
    typeof x.content === "string" ||
    typeof x.copy?.en === "string" ||
    typeof x.text?.en === "string" ||
    typeof x.body?.en === "string" ||
    typeof x.content?.en === "string" ||
    typeof x.description?.en === "string" ||
    typeof x.summary?.en === "string" ||
    typeof x.copy_en === "string" ||
    typeof x.text_en === "string" ||
    typeof x.body_en === "string" ||
    typeof x.content_en === "string" ||
    typeof x.description_en === "string" ||
    typeof x.summary_en === "string" ||
    typeof x.copy?.vi === "string" ||
    typeof x.text?.vi === "string" ||
    typeof x.body?.vi === "string" ||
    typeof x.content?.vi === "string" ||
    typeof x.description?.vi === "string" ||
    typeof x.summary?.vi === "string" ||
    typeof x.copy_vi === "string" ||
    typeof x.text_vi === "string" ||
    typeof x.body_vi === "string" ||
    typeof x.content_vi === "string" ||
    typeof x.description_vi === "string" ||
    typeof x.summary_vi === "string";

  if (hasText) return true;

  const hasTitle = !!(
    x.title?.en ||
    x.title_en ||
    x.heading?.en ||
    x.heading_en ||
    x.name?.en ||
    x.name_en
  );
  const hasMeta = !!(x.id || x.slug);

  return hasTitle || hasMeta;
}

function collectChildEntryArrays(node: any): any[][] {
  if (!node || typeof node !== "object") return [];

  const buckets = [
    asArray(node?.entries),
    asArray(node?.items),
    asArray(node?.cards),
    asArray(node?.blocks),
    asArray(node?.steps),
    asArray(node?.children),
    asArray(node?.nodes),
    asArray(node?.rows),
    asArray(node?.cols),
    asArray(node?.sections),

    asArray(node?.content?.entries),
    asArray(node?.content?.items),
    asArray(node?.content?.cards),
    asArray(node?.content?.blocks),
    asArray(node?.content?.steps),
    asArray(node?.content?.children),
    asArray(node?.content?.nodes),
    asArray(node?.content?.rows),
    asArray(node?.content?.cols),
    asArray(node?.content?.sections),

    asArray(node?.content?.data?.entries),
    asArray(node?.content?.data?.items),
    asArray(node?.content?.data?.cards),
    asArray(node?.content?.data?.blocks),
    asArray(node?.content?.data?.steps),
    asArray(node?.content?.data?.sections),

    asArray(node?.content?.payload?.entries),
    asArray(node?.content?.payload?.items),
    asArray(node?.content?.payload?.cards),
    asArray(node?.content?.payload?.blocks),
    asArray(node?.content?.payload?.steps),
    asArray(node?.content?.payload?.sections),

    asArray(node?.payload?.entries),
    asArray(node?.payload?.items),
    asArray(node?.payload?.cards),
    asArray(node?.payload?.blocks),
    asArray(node?.payload?.steps),
    asArray(node?.payload?.sections),

    asArray(node?.data?.entries),
    asArray(node?.data?.items),
    asArray(node?.data?.cards),
    asArray(node?.data?.blocks),
    asArray(node?.data?.steps),
    asArray(node?.data?.sections),
  ];

  return buckets.filter((a) => Array.isArray(a) && a.length > 0);
}

function flattenToLeafEntries(input: any[], maxDepth = 6): any[] {
  const out: any[] = [];

  const visit = (arr: any[], depth: number) => {
    for (const x of asArray(arr)) {
      if (!x || typeof x !== "object") continue;

      const children = collectChildEntryArrays(x);
      if (children.length && depth < maxDepth) {
        for (const c of children) visit(c, depth + 1);
        continue;
      }

      if (looksLikeLeafEntry(x)) out.push(x);
    }
  };

  visit(input, 0);
  return out;
}

function deriveKeywordsFromEntryList(entries: any[]): { en: string[]; vi: string[] } {
  const raw: string[] = [];
  for (const e of asArray(entries)) {
    const k =
      e?.id ||
      e?.slug ||
      e?.title?.en ||
      e?.heading?.en ||
      e?.title_en ||
      e?.heading_en ||
      "";
    const txt = String(k || "").trim();
    if (txt) raw.push(txt);
  }

  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of raw) {
    const low = s.toLowerCase();
    if (seen.has(low)) continue;
    seen.add(low);
    out.push(s);
  }

  return { en: out, vi: out };
}

function deriveKeywordsFromEntries(room: AnyRoom): { en: string[]; vi: string[] } {
  const tops = resolveTopContainers(room);
  if (tops.length === 0) return { en: [], vi: [] };

  const leaf = flattenToLeafEntries(tops, 6);
  return deriveKeywordsFromEntryList(leaf);
}

function resolveEssay(room: AnyRoom) {
  const en =
    room?.essay?.en ||
    room?.essay_en ||
    room?.content?.essay?.en ||
    room?.content?.essay_en ||
    "";
  const vi =
    room?.essay?.vi ||
    room?.essay_vi ||
    room?.content?.essay?.vi ||
    room?.content?.essay_vi ||
    "";
  return { en, vi };
}

function pickTier(room: AnyRoom): string {
  return String(room?.tier || room?.meta?.tier || "free").toLowerCase();
}

function normalizeRoomTierToTierId(roomTier: string): TierId {
  const t = String(roomTier || "").trim();
  if (!t) return "free";
  return normalizeTier(t);
}

/** ✅ Infer tier from room id suffix _vip1.._vip9 / _free */
function inferTierIdFromRoomId(effectiveRoomId: string): TierId | null {
  const s = String(effectiveRoomId || "").toLowerCase().trim();
  const m = s.match(/_(vip[1-9])\b/);
  if (m?.[1]) return m[1] as TierId;
  if (/_free\b/.test(s)) return "free";
  return null;
}

function normalizeAudioSrc(src: string): string {
  const s = String(src || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const p = s.replace(/^\/+/, "");
  if (p.startsWith("audio/")) return `/${p}`;
  return `/audio/${p.split("/").pop() || p}`;
}

function pickAudio(entry: any): string {
  const candidates: any[] = [];
  candidates.push(entry?.audio, entry?.audio_en, entry?.audio_vi);
  candidates.push(entry?.audioRef, entry?.audio_ref);
  candidates.push(entry?.audioUrl, entry?.audio_url);
  candidates.push(entry?.mp3, entry?.mp3_en, entry?.mp3_vi);

  for (const c of candidates) {
    if (!c) continue;
    if (typeof c === "string") {
      const norm = normalizeAudioSrc(c);
      if (norm) return norm;
    } else if (typeof c === "object") {
      const s = String(c?.en || c?.vi || c?.src || c?.url || "").trim();
      const norm = normalizeAudioSrc(s);
      if (norm) return norm;
    }
  }
  return "";
}

function pickAudioList(entry: any): string[] {
  const out: string[] = [];

  const push = (v: any) => {
    if (!v) return;

    if (Array.isArray(v)) {
      for (const item of v) push(item);
      return;
    }

    if (typeof v === "object") {
      const s = String(v?.en || v?.vi || v?.src || v?.url || "").trim();
      if (s) push(s);
      return;
    }

    if (typeof v === "string") {
      const s = v.trim();
      if (!s) return;

      const parts = s.includes(" ")
        ? s.split(/\s+/g)
        : s.includes(",")
          ? s.split(",")
          : [s];

      for (const p of parts) {
        const norm = normalizeAudioSrc(String(p || "").trim());
        if (norm) out.push(norm);
      }
    }
  };

  push(entry?.audio_playlist);
  push(entry?.audioPlaylist);
  push(entry?.audio_list);
  push(entry?.audioList);
  push(entry?.audios);

  if (out.length === 0) push(entry?.audio);

  if (out.length === 0) {
    const one = pickAudio(entry);
    if (one) out.push(one);
  }

  const seen = new Set<string>();
  return out.filter((s) => {
    const k = s.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function audioLabelFromSrc(src: string): string {
  const s = String(src || "").trim();
  return s ? s.split("/").pop() || s : "";
}

function stripImplicitAudioLines(text: string): string {
  if (!text) return "";
  const lines = String(text).split("\n");
  const out: string[] = [];
  const timeLine = /^\s*\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? "";
    const t = raw.trim();
    if (t.toLowerCase().includes(".mp3")) {
      const next = (lines[i + 1] ?? "").trim();
      if (timeLine.test(next)) i++;
      continue;
    }
    if (timeLine.test(t)) continue;
    out.push(raw);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function normalizeEntryTextEN(entry: any): string {
  const candidates = [
    entry?.copy?.en,
    entry?.text?.en,
    entry?.body?.en,
    entry?.content?.en,
    entry?.description?.en,
    entry?.summary?.en,
    entry?.copy_en,
    entry?.text_en,
    entry?.body_en,
    entry?.content_en,
    entry?.description_en,
    entry?.summary_en,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return stripImplicitAudioLines(c);
  }
  if (typeof entry?.text === "string" && entry.text.trim()) return stripImplicitAudioLines(entry.text);
  if (typeof entry?.content === "string" && entry.content.trim()) return stripImplicitAudioLines(entry.content);
  return "";
}
function normalizeEntryTextVI(entry: any): string {
  const candidates = [
    entry?.copy?.vi,
    entry?.text?.vi,
    entry?.body?.vi,
    entry?.content?.vi,
    entry?.description?.vi,
    entry?.summary?.vi,
    entry?.copy_vi,
    entry?.text_vi,
    entry?.body_vi,
    entry?.content_vi,
    entry?.description_vi,
    entry?.summary_vi,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return stripImplicitAudioLines(c);
  }
  return "";
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const KW_CLASSES = [
  "mb-kw-0",
  "mb-kw-1",
  "mb-kw-2",
  "mb-kw-3",
  "mb-kw-4",
  "mb-kw-5",
  "mb-kw-6",
  "mb-kw-7",
] as const;

type KeywordColorMap = Map<string, (typeof KW_CLASSES)[number]>;

function normalizeKwKey(s: string) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, " ");
}

function normalizeTextForKwMatch(s: string) {
  const base = String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[\s\-_]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!base) return "";

  const words = base.split(" ").map((w) => {
    if (w.length < 4) return w;
    if (w.endsWith("ies") && w.length >= 5) return w.slice(0, -3) + "y";
    if (w.endsWith("es") && w.length >= 5) {
      const root = w.slice(0, -2);
      if (/(s|x|z|ch|sh)$/.test(root)) return root;
    }
    if (w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
    return w;
  });

  return words.join(" ");
}

function buildKeywordColorMap(enKeywords: string[], viKeywords: string[], maxPairs = 5): KeywordColorMap {
  const map: KeywordColorMap = new Map();

  const maxLen = Math.max(enKeywords.length, viKeywords.length);
  const n = Math.min(maxPairs, maxLen);

  let colorIdx = 0;

  for (let i = 0; i < n; i++) {
    const en = String(enKeywords[i] ?? "").trim();
    const vi = String(viKeywords[i] ?? "").trim();

    if (!en && !vi) continue;

    const cls = KW_CLASSES[colorIdx % KW_CLASSES.length];
    colorIdx++;

    if (en) map.set(normalizeKwKey(en), cls);
    if (vi) map.set(normalizeKwKey(vi), cls);
  }

  return map;
}

function highlightByColorMap(text: string, colorMap: KeywordColorMap) {
  const t = String(text || "");
  if (!t.trim()) return t;

  if (!colorMap || colorMap.size === 0) return t;

  const ordered = Array.from(colorMap.keys()).sort((a, b) => b.length - a.length);

  const keyToVariantPattern = (k: string) => {
    const parts = k.split(" ").filter(Boolean).map(escapeRegExp);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join("[\\s\\-_]+");
  };

  const pattern = ordered.map(keyToVariantPattern).filter(Boolean).join("|");
  if (!pattern) return t;

  const re = new RegExp(
    `(^|[^\\p{L}\\p{N}_])(${pattern})(?=[^\\p{L}\\p{N}_]|$)`,
    "giu",
  );

  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(t))) {
    const start = m.index;
    const full = m[0] || "";
    const prefix = m[1] || "";
    const match = m[2] || "";
    const end = start + full.length;

    if (start > last) parts.push(t.slice(last, start));
    if (prefix) parts.push(prefix);

    const cls = colorMap.get(normalizeKwKey(match)) || KW_CLASSES[0];
    parts.push(
      <span key={`${start}-${end}`} className={`mb-kw ${cls}`}>
        {match}
      </span>,
    );

    last = end;
  }

  if (last < t.length) parts.push(t.slice(last));
  return <span className="whitespace-pre-line leading-relaxed">{parts}</span>;
}

function pickEntryHeading(entry: any, index: number) {
  return (
    entry?.title?.en ||
    entry?.heading?.en ||
    entry?.title_en ||
    entry?.heading_en ||
    entry?.name?.en ||
    entry?.name_en ||
    prettifyEntryId(entry?.id || entry?.slug || "") ||
    `Entry ${index + 1}`
  );
}

function isUglyHeading(h: string) {
  const s = String(h || "").trim();
  if (!s) return true;
  const looksSlug = /^[a-z0-9_-]+$/.test(s) && (s.includes("-") || s.includes("_"));
  const tooIdLike = /_(vip[1-9]|free)\b/i.test(s);
  return looksSlug || tooIdLike;
}

function entryMatchesKeyword(entry: any, kw: string): boolean {
  const kRaw = String(kw || "").trim();
  if (!kRaw) return false;

  const k = normalizeTextForKwMatch(kRaw);

  const meta = normalizeTextForKwMatch(String(entry?.id || entry?.slug || ""));

  const title = normalizeTextForKwMatch(
    String(
      entry?.title?.en ||
        entry?.title_en ||
        entry?.heading?.en ||
        entry?.heading_en ||
        entry?.id ||
        entry?.slug ||
        "",
    ),
  );

  const en = normalizeTextForKwMatch(normalizeEntryTextEN(entry));
  const vi = normalizeTextForKwMatch(normalizeEntryTextVI(entry));

  return meta.includes(k) || title.includes(k) || en.includes(k) || vi.includes(k);
}

/* ----------------------------------------------------- */
/* ✅ MB-BLUE-99.9b/100.0 — Mercy Guide (UI shell, NO API) */
/* ----------------------------------------------------- */
function MercyGuideCorner({
  disabled,
  roomTitle,
  activeKeyword,
  onClearKeyword,
  onScrollToAudio,
}: {
  disabled: boolean;
  roomTitle: string;
  activeKeyword: string | null;
  onClearKeyword?: () => void;
  onScrollToAudio?: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (disabled) return null;

  const hasStep = !!(activeKeyword && String(activeKeyword).trim());

  return (
    <div className="mb-guideCorner">
      <button
        type="button"
        className="mb-guideBtn"
        onClick={() => setOpen((v) => !v)}
        title="Mercy Guide (UI shell)"
      >
        🙂 <span className="hidden sm:inline">Guide</span>
      </button>

      {open && (
        <div className="mb-guidePanel" role="dialog" aria-label="Mercy Guide">
          <div className="mb-guideTitle">
            Mercy Guide
            <button type="button" className="mb-guideClose" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="mb-guideBody">
            <div className="mb-guideLine">
              <b>Room:</b> {roomTitle || "Room"}
            </div>

            <div className="mb-guideLine">
              <b>Step:</b>{" "}
              {hasStep ? (
                <>
                  You chose <b>{activeKeyword}</b> — read EN → listen → compare VI.
                </>
              ) : (
                <>Click a keyword to start. Then you’ll see EN → audio → VI.</>
              )}
            </div>

            {hasStep ? (
              <div className="mb-guideActions" role="group" aria-label="Guide actions">
                <button
                  type="button"
                  className="mb-guideActionBtn"
                  onClick={onScrollToAudio}
                  disabled={!onScrollToAudio}
                  title="Scroll to the audio player"
                >
                  🔊 Audio
                </button>
                <button
                  type="button"
                  className="mb-guideActionBtn"
                  onClick={onClearKeyword}
                  disabled={!onClearKeyword}
                  title="Clear keyword"
                >
                  ⟲ Clear
                </button>
              </div>
            ) : null}

            <div className="mb-guideHint">
              (Later we can connect this panel to the real “teacher GPT” API behind one button.)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------- */
/* ✅ MB-BLUE-101.x — Mercy AI Host context bridge (NO API) */
/* ----------------------------------------------------- */
function dispatchHostContext(detail: Record<string, any>) {
  try {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("mb:host-context", { detail }));
  } catch {
    // ignore
  }
}

/* ----------------------------------------------------- */
/* ✅ MB-BLUE-99.11a — DB room_entries helpers             */
/* ----------------------------------------------------- */

function coerceRoomEntryRowToEntry(row: any): any {
  const v =
    row?.entry ??
    row?.payload ??
    row?.data ??
    row?.content ??
    row?.room_entry ??
    row?.roomEntry ??
    null;

  if (v && typeof v === "object") return v;
  return row;
}

function sortRoomEntryRows(rows: any[]): any[] {
  const arr = asArray(rows).slice();
  arr.sort((a, b) => {
    const ao = Number.isFinite(Number(a?.sort_order))
      ? Number(a.sort_order)
      : Number.POSITIVE_INFINITY;
    const bo = Number.isFinite(Number(b?.sort_order))
      ? Number(b.sort_order)
      : Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;

    const at = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const bt = b?.created_at ? new Date(b.created_at).getTime() : 0;
    if (at !== bt) return at - bt;

    const aid = String(a?.id ?? "");
    const bid = String(b?.id ?? "");
    return aid.localeCompare(bid);
  });
  return arr;
}

function shortEmailLabel(email: string) {
  const e = String(email || "").trim();
  if (!e) return "Signed in";
  const [name, domain] = e.split("@");
  if (!domain) return e;
  const head = name.length <= 3 ? name : `${name.slice(0, 3)}…`;
  return `${head}@${domain}`.toUpperCase();
}

export default function RoomRenderer({
  room,
  roomId,
  roomSpec,
}: {
  room: AnyRoom;
  roomId: string | undefined;
  roomSpec?: { use_color_theme?: boolean };
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const audioAnchorRef = useRef<HTMLDivElement | null>(null);

  const useColorThemeSafe = roomSpec?.use_color_theme !== false;

  const access = useUserAccess();
  const accessLoading = access.loading || access.isLoading;

  const safeRoom = (room ?? {}) as AnyRoom;
  const effectiveRoomId = String(safeRoom?.id || roomId || "");

  const scrollToAudio = () => {
    const el = audioAnchorRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const killControls = () => {
      root.querySelectorAll("audio").forEach((a) => {
        if (a.hasAttribute("controls")) a.removeAttribute("controls");
      });
    };

    killControls();
    const obs = new MutationObserver(() => killControls());
    obs.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["controls"],
    });

    return () => obs.disconnect();
  }, []);

  const tier = useMemo(() => pickTier(safeRoom), [safeRoom]);
  const requiredTierIdFromMeta = useMemo<TierId>(() => normalizeRoomTierToTierId(tier), [tier]);

  // ✅ Infer tier from roomId suffix
  const inferredTierId = useMemo<TierId | null>(() => inferTierIdFromRoomId(effectiveRoomId), [effectiveRoomId]);

  // ✅ REAL GATE tier:
  // If meta says free but id says vipX → treat as vipX for gating.
  const requiredTierId = useMemo<TierId>(() => {
    if (requiredTierIdFromMeta !== "free") return requiredTierIdFromMeta;
    if (inferredTierId && inferredTierId !== "free") return inferredTierId;
    return "free";
  }, [requiredTierIdFromMeta, inferredTierId]);

  // ✅ Display tier: show non-free tier when known (meta or inferred)
  const displayTierId = useMemo<TierId>(() => {
    if (requiredTierIdFromMeta !== "free") return requiredTierIdFromMeta;
    return inferredTierId ?? "free";
  }, [requiredTierIdFromMeta, inferredTierId]);

  const isLocked = useMemo(() => {
    if (accessLoading) return requiredTierId !== "free";
    return !access.canAccessTier(requiredTierId);
  }, [accessLoading, access, requiredTierId]);

  // -------------------------
  // ✅ AUTH UX (session-aware)
  // -------------------------
  const [authUser, setAuthUser] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return;
        setAuthUser(data?.user ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setAuthUser(null);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } finally {
      // simple + reliable
      window.location.href = "/signin";
    }
  }

  // -------------------------
  // ✅ DB fetch: public.room_entries (RLS gated)
  // -------------------------
  const [dbRows, setDbRows] = useState<any[] | null>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const rid = String(effectiveRoomId || "").trim();
      if (!rid) {
        setDbRows(null);
        setDbError(null);
        setDbLoading(false);
        return;
      }

      setDbLoading(true);
      setDbError(null);

      try {
        const { data, error } = await supabase
          .from("room_entries")
          .select("*")
          .eq("room_id", rid)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (cancelled) return;

        if (error) {
          setDbRows(null);
          setDbError(error.message || "DB error");
        } else {
          setDbRows(sortRoomEntryRows(Array.isArray(data) ? data : []));
          setDbError(null);
        }
      } catch (e: any) {
        if (cancelled) return;
        setDbRows(null);
        setDbError(String(e?.message || e || "DB error"));
      } finally {
        if (!cancelled) setDbLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [effectiveRoomId]);

  const rawEN = useMemo(() => String(pickTitleENRaw(safeRoom) || ""), [safeRoom]);
  const rawVI = useMemo(() => String(pickTitleVIRaw(safeRoom) || ""), [safeRoom]);

  const titleEN = useMemo(() => {
    const r = rawEN.trim();
    if (!r) return prettifyRoomIdEN(effectiveRoomId);
    if (isBadAutoTitle(r, effectiveRoomId)) return prettifyRoomIdEN(effectiveRoomId);
    return r;
  }, [rawEN, effectiveRoomId]);

  const titleVI = useMemo(() => String(rawVI || "").trim(), [rawVI]);

  const introEN = useMemo(() => pickIntroEN(safeRoom), [safeRoom]);
  const introVI = useMemo(() => pickIntroVI(safeRoom), [safeRoom]);

  const kwRaw = useMemo(() => resolveKeywords(safeRoom), [safeRoom]);
  const essay = useMemo(() => resolveEssay(safeRoom), [safeRoom]);

  const topContainers = useMemo(() => resolveTopContainers(safeRoom), [safeRoom]);
  const flatEntries = useMemo(() => resolveEntries(safeRoom), [safeRoom]);

  const dbLeafEntries = useMemo(() => {
    if (!Array.isArray(dbRows) || dbRows.length === 0) return [];
    const extracted = dbRows
      .map(coerceRoomEntryRowToEntry)
      .filter((x) => x && typeof x === "object");
    return flattenToLeafEntries(extracted, 6);
  }, [dbRows]);

  const jsonLeafEntries = useMemo(() => {
    const seed = topContainers.length ? topContainers : flatEntries;
    const leaf = flattenToLeafEntries(seed, 6);
    return leaf;
  }, [topContainers, flatEntries]);

  const allEntries = useMemo(() => {
    const leaf = dbLeafEntries.length > 0 ? dbLeafEntries : jsonLeafEntries;
    return leaf.map((e: any) => ({ entry: e }));
  }, [dbLeafEntries, jsonLeafEntries]);

  const kw = useMemo(() => {
    const hasReal = (kwRaw?.en?.length || 0) > 0 || (kwRaw?.vi?.length || 0) > 0;
    if (hasReal) return kwRaw;

    if (dbLeafEntries.length > 0) return deriveKeywordsFromEntryList(dbLeafEntries);

    return deriveKeywordsFromEntries(safeRoom);
  }, [kwRaw, safeRoom, dbLeafEntries]);

  const enKeywords = (kw.en.length ? kw.en : kw.vi).map(String);
  const viKeywords = (kw.vi.length ? kw.vi : kw.en).map(String);

  const kwColorMap = useMemo(() => buildKeywordColorMap(enKeywords, viKeywords, 5), [enKeywords, viKeywords]);

  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  useEffect(() => {
    setActiveKeyword(null);
  }, [roomId]);

  useEffect(() => {
    setActiveKeyword(null);
  }, [effectiveRoomId]);

  const activeEntry = useMemo(() => {
    if (!activeKeyword) return null;
    const found = allEntries.find((x) => entryMatchesKeyword(x.entry, activeKeyword));
    return found?.entry || null;
  }, [activeKeyword, allEntries]);

  const activeEntryIndex = useMemo(() => {
    if (!activeEntry) return -1;
    return allEntries.findIndex((x) => x.entry === activeEntry);
  }, [activeEntry, allEntries]);

  const welcomeEN = introEN?.trim() || `Welcome to ${titleEN}, please click a keyword to start`;
  const welcomeVI =
    introVI?.trim() ||
    `Chào mừng bạn đến với phòng ${titleVI || titleEN}, vui lòng nhấp vào từ khóa để bắt đầu`;

  const clearKeyword = () => setActiveKeyword(null);

  useEffect(() => {
    if (!effectiveRoomId) return;
    dispatchHostContext({ page: "room", roomId: effectiveRoomId });
  }, [effectiveRoomId]);

  useEffect(() => {
    if (!effectiveRoomId) return;

    const entryId = String(activeEntry?.id || activeEntry?.slug || "").trim() || null;
    const keyword = activeKeyword ? String(activeKeyword).trim() : null;

    dispatchHostContext({ page: "room", roomId: effectiveRoomId, keyword, entryId });
  }, [effectiveRoomId, activeKeyword, activeEntry]);

  const ROOM_CSS = useMemo(
    () => `
      [data-mb-scope="room"].mb-room{
        position: relative;
        padding: 18px 14px 16px;
        border-radius: 24px;
        background:
          radial-gradient(1100px 650px at 10% 10%, rgba(255, 105, 180, 0.11), transparent 55%),
          radial-gradient(900px 520px at 90% 25%, rgba(0, 200, 255, 0.11), transparent 55%),
          radial-gradient(900px 520px at 30% 90%, rgba(140, 255, 120, 0.11), transparent 55%),
          linear-gradient(180deg, rgba(255,255,255,0.93), rgba(255,255,255,0.88));
        box-shadow: 0 18px 55px rgba(0,0,0,0.08);
        backdrop-filter: blur(8px);
        display:flex;
        flex-direction: column;
        min-height: 72vh;
      }
      [data-mb-scope="room"][data-mb-theme="bw"].mb-room{
        background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.92));
      }

      [data-mb-scope="room"] .mb-card{
        border: 1px solid rgba(0,0,0,0.10);
        background: rgba(255,255,255,0.74);
        backdrop-filter: blur(10px);
        border-radius: 24px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      }

      [data-mb-scope="room"] .mb-titleRow{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap: 10px;
        flex-wrap: nowrap;
        min-width:0;
        margin-bottom: 10px;
      }
      [data-mb-scope="room"] .mb-titleLeft,
      [data-mb-scope="room"] .mb-titleRight{
        display:flex;
        align-items:center;
        gap: 8px;
        flex: 0 0 auto;
      }
      [data-mb-scope="room"] .mb-titleCenter{
        flex: 1 1 auto;
        min-width: 0;
        text-align:center;
      }
      [data-mb-scope="room"] .mb-tier{
        font-size: 12px;
        font-weight: 900;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(0,0,0,0.14);
        background: rgba(255,255,255,0.9);
        text-transform: uppercase;
        max-width: 240px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      [data-mb-scope="room"] .mb-iconBtn{
        width: 34px;
        height: 34px;
        border-radius: 12px;
        border: 1px solid rgba(0,0,0,0.14);
        background: rgba(255,255,255,0.9);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size: 14px;
      }
      [data-mb-scope="room"] .mb-roomTitle{
        font-size: 38px;
        line-height: 1.1;
        font-weight: 900;
        letter-spacing: -0.02em;
        text-transform: none;
      }
      @media (max-width: 560px){
        [data-mb-scope="room"] .mb-roomTitle{ font-size: 30px; }
      }

      [data-mb-scope="room"] .mb-welcomeLine{
        padding: 10px 12px;
        font-size: 15px;
        line-height: 1.45;
        text-align: center;
      }

      [data-mb-scope="room"] .mb-keyRow{
        display:flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content:center;
        margin-top: 14px;
        padding: 4px 10px 2px;
      }
      [data-mb-scope="room"] .mb-keyBtn{
        border: 1px solid rgba(0,0,0,0.14);
        background: rgba(255,255,255,0.78);
        border-radius: 999px;
        padding: 9px 14px;
        font-weight: 850;
        font-size: 14px;
        transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
      }
      [data-mb-scope="room"] .mb-keyBtn:hover{
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(0,0,0,0.06);
        background: rgba(255,255,255,0.90);
        border-color: rgba(0,0,0,0.22);
      }
      [data-mb-scope="room"] .mb-keyBtn[data-active="true"]{
        background: rgba(255,255,255,0.98);
        border-color: rgba(0,0,0,0.30);
        box-shadow: 0 14px 30px rgba(0,0,0,0.08);
      }
      [data-mb-scope="room"] .mb-keyBtn:disabled{
        opacity: 0.55;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }

      [data-mb-scope="room"] .mb-kw{
        padding: 0 0.18rem;
        border-radius: 0.45rem;
        font-weight: 800;
      }

      [data-mb-scope="room"] .mb-entryText .mb-kw,
      [data-mb-scope="room"] .mb-welcomeLine .mb-kw{
        color: rgba(255,255,255,0.95);
        text-shadow: 0 1px 0 rgba(0,0,0,0.28);
        padding: 0.04rem 0.22rem;
        border-radius: 0.55rem;
      }

      [data-mb-scope="room"] .mb-entryText .mb-kw-0,
      [data-mb-scope="room"] .mb-welcomeLine .mb-kw-0{ background: rgba(17, 24, 39, 0.78); }
      [data-mb-scope="room"] .mb-entryText .mb-kw-1,
      [data-mb-scope="room"] .mb-welcomeLine .mb-kw-1{ background: rgba(12, 74, 110, 0.78); }
      [data-mb-scope="room"] .mb-entryText .mb-kw-2,
      [data-mb-scope="room"] .mb-welcomeLine .mb-kw-2{ background: rgba(22, 101, 52, 0.78); }
      [data-mb-scope="room"] .mb-entryText .mb-kw-3,
      [data-mb-scope="room"] .mb-welcomeLine .mb-kw-3{ background: rgba(131, 24, 67, 0.78); }
      [data-mb-scope="room"] .mb-entryText .mb-kw-4,
      [data-mb-scope="room"] .mb-welcomeLine .mb-kw-4{ background: rgba(88, 28, 135, 0.78); }
      [data-mb-scope="room"] .mb-entryText .mb-kw-5,
      [data-mb-scope="room"] .mb-welcomeLine .mb-kw-5{ background: rgba(124, 45, 18, 0.78); }
      [data-mb-scope="room"] .mb-entryText .mb-kw-6,
      [data-mb-scope="room"] .mb-welcomeLine .mb-kw-6{ background: rgba(17, 94, 89, 0.78); }
      [data-mb-scope="room"] .mb-entryText .mb-kw-7,
      [data-mb-scope="room"] .mb-welcomeLine .mb-kw-7{ background: rgba(127, 29, 29, 0.78); }

      [data-mb-scope="room"] .mb-feedback{
        border: 1px solid rgba(0,0,0,0.12);
        background: rgba(255,255,255,0.70);
        border-radius: 18px;
        padding: 8px 10px;
        display: flex;
        gap: 10px;
        align-items: center;
      }
      [data-mb-scope="room"] .mb-feedback input{
        flex: 1 1 auto;
        background: transparent;
        outline: none;
        font-size: 14px;
      }
      [data-mb-scope="room"] .mb-feedback button{
        flex: 0 0 auto;
        width: 38px;
        height: 38px;
        border-radius: 14px;
        border: 1px solid rgba(0,0,0,0.14);
        background: rgba(255,255,255,0.85);
        display:flex;
        align-items:center;
        justify-content:center;
      }

      [data-mb-scope="room"] .mb-audioClamp{
        width: 100%;
        max-width: 100%;
        min-width: 0;
        overflow: hidden;
        border-radius: 18px;
        clip-path: inset(0 round 18px);
      }
      [data-mb-scope="room"] .mb-audioClamp *{
        max-width: 100%;
        box-sizing: border-box;
        min-width: 0;
      }

      [data-mb-scope="room"] .mb-zoomWrap{
        --mbz: calc(var(--mb-essay-zoom, 100) / 100);
        transform: scale(var(--mbz));
        transform-origin: top left;
        width: calc(100% / var(--mbz));
      }

      [data-mb-scope="room"] .mb-guideCorner{
        position:absolute;
        top: 14px;
        right: 14px;
        z-index: 5;
        display:flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
        pointer-events: auto;
      }
      [data-mb-scope="room"] .mb-guideBtn{
        height: 34px;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid rgba(0,0,0,0.14);
        background: rgba(255,255,255,0.92);
        font-size: 12px;
        font-weight: 900;
        box-shadow: 0 10px 24px rgba(0,0,0,0.06);
      }
      [data-mb-scope="room"] .mb-guidePanel{
        width: min(360px, calc(100vw - 48px));
        border-radius: 16px;
        border: 1px solid rgba(0,0,0,0.14);
        background: rgba(255,255,255,0.96);
        box-shadow: 0 18px 55px rgba(0,0,0,0.12);
        overflow: hidden;
      }
      [data-mb-scope="room"] .mb-guideTitle{
        display:flex;
        align-items:center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        font-weight: 950;
        border-bottom: 1px solid rgba(0,0,0,0.10);
      }
      [data-mb-scope="room"] .mb-guideClose{
        width: 30px;
        height: 30px;
        border-radius: 12px;
        border: 1px solid rgba(0,0,0,0.12);
        background: rgba(255,255,255,0.90);
        font-weight: 900;
      }
      [data-mb-scope="room"] .mb-guideBody{
        padding: 10px 12px 12px;
        font-size: 13px;
        line-height: 1.4;
      }
      [data-mb-scope="room"] .mb-guideLine{ margin: 6px 0; }
      [data-mb-scope="room"] .mb-guideHint{
        margin-top: 10px;
        font-size: 12px;
        opacity: 0.70;
      }
      [data-mb-scope="room"] .mb-guideActions{
        margin-top: 10px;
        display:flex;
        gap: 8px;
        justify-content:flex-end;
        flex-wrap: wrap;
      }
      [data-mb-scope="room"] .mb-guideActionBtn{
        height: 32px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid rgba(0,0,0,0.12);
        background: rgba(255,255,255,0.92);
        font-size: 12px;
        font-weight: 900;
      }
      [data-mb-scope="room"] .mb-guideActionBtn:disabled{
        opacity: 0.55;
        cursor: not-allowed;
      }
    `,
    [],
  );

  const roomIsEmpty = !room;

  return (
    <div
      ref={rootRef}
      className="mb-room w-full max-w-none"
      data-mb-scope="room"
      data-mb-theme={useColorThemeSafe ? "color" : "bw"}
    >
      <style>{ROOM_CSS}</style>

      {roomIsEmpty ? (
        <div className="rounded-xl border p-6 text-muted-foreground">Room loaded state is empty.</div>
      ) : (
        <>
          <MercyGuideCorner
            disabled={isLocked}
            roomTitle={titleVI ? `${titleEN} / ${titleVI}` : titleEN}
            activeKeyword={activeKeyword}
            onClearKeyword={clearKeyword}
            onScrollToAudio={scrollToAudio}
          />

          {/* BOX 2 */}
          <div className="mb-titleRow">
            <div className="mb-titleLeft">
              {/* ✅ Tier badge (never show FREE for vip rooms) */}
              {displayTierId !== "free" ? <span className="mb-tier">{displayTierId}</span> : null}

              {/* ✅ Auth state always visible */}
              {authUser ? (
                <span className="mb-tier" title={String(authUser.email || authUser.id || "")}>
                  ✓ {shortEmailLabel(String(authUser.email || ""))}
                </span>
              ) : (
                <a className="mb-tier" href="/signin" title="Sign in">
                  ⟶ SIGN IN
                </a>
              )}

              {/* ✅ Current access tier (what you ARE), helps debugging confusion */}
              {!accessLoading ? (
                <span className="mb-tier" title="Your current tier from public.profiles">
                  TIER: {String(access.tier || "free").toUpperCase()}
                </span>
              ) : null}
            </div>

            <div className="mb-titleCenter">
              <div className="mb-roomTitle">{titleVI ? `${titleEN} / ${titleVI}` : titleEN}</div>
            </div>

            <div className="mb-titleRight">
              {/* ✅ Sign out (visible + obvious) */}
              {authUser ? (
                <button type="button" className="mb-tier" title="Sign out" onClick={signOut}>
                  SIGN OUT
                </button>
              ) : null}

              <button type="button" className="mb-iconBtn" title="Favorite (UI shell)" onClick={() => {}}>
                ♡
              </button>
              <button type="button" className="mb-iconBtn" title="Refresh" onClick={() => window.location.reload()}>
                ↻
              </button>
            </div>
          </div>

          {/* BOX 3 */}
          <section className="mb-card p-5 md:p-6 mb-5">
            <div className="mb-welcomeLine">
              <span>
                {highlightByColorMap(welcomeEN, kwColorMap)} <b>/</b>{" "}
                {highlightByColorMap(welcomeVI, kwColorMap)}
              </span>
            </div>

            {Math.max(kw.en.length, kw.vi.length) > 0 ? (
              <div className="mb-keyRow">
                {Array.from({ length: Math.max(kw.en.length, kw.vi.length) }).map((_, i) => {
                  const en = String(kw.en[i] ?? "").trim();
                  const vi = String(kw.vi[i] ?? "").trim();
                  if (!en && !vi) return null;

                  const label = en && vi ? `${en} / ${vi}` : en || vi;
                  const next = en || vi;

                  const isActive =
                    normalizeTextForKwMatch(activeKeyword || "") === normalizeTextForKwMatch(next || "");

                  return (
                    <button
                      key={`kw-${i}`}
                      type="button"
                      className={`mb-keyBtn mb-kw ${KW_CLASSES[i % KW_CLASSES.length]}`}
                      data-active={isActive ? "true" : "false"}
                      disabled={isLocked}
                      onClick={() =>
                        setActiveKeyword((cur) => {
                          const curKey = normalizeTextForKwMatch(cur || "");
                          const nextKey = normalizeTextForKwMatch(next || "");
                          return curKey && curKey === nextKey ? null : next;
                        })
                      }
                      title={label}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </section>

          {(essay.en || essay.vi) && (
            <div className="mb-card p-4 md:p-6 mb-5">
              <BilingualEssay title="Essay" en={essay.en || ""} vi={essay.vi || ""} />
            </div>
          )}

          {/* BOX 4 stage */}
          <section className="mb-card p-5 md:p-6 mb-5" style={{ flex: "1 1 auto" }}>
            <div className="mb-zoomWrap">
              {isLocked ? (
                <div className="min-h-[260px] flex items-center justify-center text-center">
                  <div>
                    <div className="text-sm opacity-70 font-semibold">
                      {accessLoading ? (
                        <>Checking access…</>
                      ) : (
                        <>
                          Locked: requires <b>{requiredTierId.toUpperCase()}</b> (you are{" "}
                          <b>{String(access.tier || "free").toUpperCase()}</b>)
                        </>
                      )}
                    </div>
                    <div className="mt-3 text-sm opacity-70">
                      Complete checkout and refresh. If already paid, wait for webhook tier sync.
                    </div>
                  </div>
                </div>
              ) : !activeKeyword ? (
                <div className="min-h-[420px]" />
              ) : activeEntry ? (
                <ActiveEntry
                  entry={activeEntry}
                  index={activeEntryIndex >= 0 ? activeEntryIndex : 0}
                  kwColorMap={kwColorMap}
                  enKeywords={enKeywords}
                  viKeywords={viKeywords}
                  audioAnchorRef={audioAnchorRef}
                />
              ) : (
                <div className="min-h-[240px] flex items-center justify-center text-center">
                  <div>
                    <div className="text-sm opacity-70 font-semibold">
                      No entry matches keyword: <b>{activeKeyword}</b>
                    </div>
                    <div className="mt-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-full text-sm font-bold border bg-white"
                        onClick={() => setActiveKeyword(null)}
                      >
                        Clear keyword
                      </button>
                    </div>

                    {dbError ? <div className="mt-2 text-xs opacity-60">DB: {dbError}</div> : null}
                    {dbLoading ? <div className="mt-2 text-xs opacity-60">Loading entries…</div> : null}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* BOX 5 */}
          <div style={{ marginTop: "auto" }}>
            <div className="mb-card p-3 md:p-4">
              <div className="mb-feedback">
                <input placeholder="Feedback / Phản Hồi…" aria-label="Feedback" />
                <button type="button" title="Send feedback" onClick={() => {}}>
                  ➤
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ActiveEntry({
  entry,
  index,
  kwColorMap,
  enKeywords,
  viKeywords,
  audioAnchorRef,
}: {
  entry: any;
  index: number;
  kwColorMap: KeywordColorMap;
  enKeywords: string[];
  viKeywords: string[];
  audioAnchorRef?: React.RefObject<HTMLDivElement>;
}) {
  const rawHeading = pickEntryHeading(entry, index);
  const heading = isUglyHeading(rawHeading) ? "" : rawHeading;

  const en = normalizeEntryTextEN(entry);
  const vi = normalizeEntryTextVI(entry);

  const entryKwColorMap = useMemo(() => {
    const pairs: { en: string; vi: string }[] = [];
    const maxLen = Math.max(enKeywords.length, viKeywords.length);

    for (let i = 0; i < maxLen; i++) {
      const enK = String(enKeywords[i] ?? "").trim();
      const viK = String(viKeywords[i] ?? "").trim();
      if (!enK && !viK) continue;

      const hit = (enK && entryMatchesKeyword(entry, enK)) || (viK && entryMatchesKeyword(entry, viK));
      if (!hit) continue;

      pairs.push({ en: enK, vi: viK });
      if (pairs.length >= 5) break;
    }

    const enTop = pairs.map((p) => p.en).filter(Boolean);
    const viTop = pairs.map((p) => p.vi).filter(Boolean);

    return buildKeywordColorMap(enTop, viTop, 5);
  }, [entry, enKeywords, viKeywords]);

  const audioList = pickAudioList(entry);

  return (
    <div>
      {heading ? <h3 className="text-2xl md:text-3xl font-serif font-bold mt-1 leading-tight">{heading}</h3> : null}

      {en ? (
        <div className="mt-4 text-[15px] md:text-base mb-entryText">
          {highlightByColorMap(en, entryKwColorMap)}
        </div>
      ) : null}

      {audioList.length ? (
        <div ref={audioAnchorRef as any} className="mt-4 mb-audioClamp">
          <div className="flex flex-col gap-2">
            {audioList.map((src, i) => {
              const base = audioLabelFromSrc(src);
              const label = audioList.length > 1 ? `${base} (${i + 1}/${audioList.length})` : base;
              return (
                <TalkingFacePlayButton key={`${src}-${i}`} src={src} label={label} className="w-full" fullWidthBar />
              );
            })}
          </div>
        </div>
      ) : null}

      {vi ? (
        <div className="mt-4 text-[15px] md:text-base mb-entryText">
          {highlightByColorMap(vi, entryKwColorMap)}
        </div>
      ) : null}
    </div>
  );
}

/** New thing to learn:
 * If metadata can be missing, your UI must have a “fallback truth” (like id conventions) for BOTH display and gating—
 * otherwise you accidentally create a security hole while everything “looks fine.” */
