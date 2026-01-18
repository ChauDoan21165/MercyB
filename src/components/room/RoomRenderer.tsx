/**
 * ROOM 5-BOX SPEC (LOCKED)
 * BOX 2: Title row (tier left, title centered, fav+refresh right) — ONE ROW
 * BOX 3: Welcome line (EN / VI) + keyword buttons
 * BOX 4: EMPTY until keyword; then EN → TalkingFace → VI
 * BOX 5: Feedback bar pushed to bottom (no header line)
 *
 * Gate: useUserAccess() (public.profiles), admin/high-admin bypass via hook.
 */

// FILE: src/components/room/RoomRenderer.tsx
// VERSION: MB-BLUE-99.11v-keyword-bilingual — 2026-01-18 (+0700)
//
// FIXES INCLUDED (kept, but file shortened):
// - DB fetch tries effectiveRoomId THEN coreRoomId (suffix-free) if needed.
// - Ignore DB if only __legacy stub rows; fallback to JSON.
// - Coerce legacy JSON entries (copy->content, audio->audio_en, merge keywords).
// - Keyword pills: 1 per entry when entry keyword fields exist; no fake EN/EN.
// - Chat: canonical room_id = effectiveRoomId only (load/write/realtime).

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BilingualEssay } from "@/components/room/BilingualEssay";
import { useUserAccess } from "@/hooks/useUserAccess";
import type { TierId } from "@/lib/constants/tiers";
import { normalizeTier } from "@/lib/constants/tiers";
import { tierFromRoomId } from "@/lib/tierFromRoomId";

import {
  ActiveEntry,
  MercyGuideCorner,
  KW_CLASSES,
  buildKeywordColorMap,
  highlightByColorMap,
  entryMatchesKeyword,
  normalizeTextForKwMatch,
} from "@/components/room/RoomRendererUI";

import { ROOM_CSS } from "@/components/room/roomRendererStyles";
import { supabase } from "@/lib/supabaseClient";

import { prettifyRoomIdEN, isBadAutoTitle } from "@/components/room/roomIdUtils";
import { fetchRoomEntriesDb, coerceRoomEntryRowToEntry } from "@/components/room/roomEntriesDb";
import {
  resolveKeywords,
  resolveEssay,
  extractJsonLeafEntries,
  deriveKeywordsFromEntryList,
} from "@/components/room/roomJsonExtract";

import { useAuthUser } from "@/components/room/hooks/useAuthUser";
import { useRoomFeedback } from "@/components/room/hooks/useRoomFeedback";

type AnyRoom = any;

const pickTitleENRaw = (r: AnyRoom) => r?.title?.en || r?.title_en || r?.name?.en || r?.name_en || "";
const pickTitleVIRaw = (r: AnyRoom) => r?.title?.vi || r?.title_vi || r?.name?.vi || r?.name_vi || "";

const pickIntroEN = (r: AnyRoom) =>
  r?.intro?.en ||
  r?.description?.en ||
  r?.intro_en ||
  r?.description_en ||
  r?.summary?.en ||
  r?.summary_en ||
  r?.description ||
  "";

const pickIntroVI = (r: AnyRoom) =>
  r?.intro?.vi ||
  r?.description?.vi ||
  r?.intro_vi ||
  r?.description_vi ||
  r?.summary?.vi ||
  r?.summary_vi ||
  r?.description_vi ||
  "";

function pickTier(room: AnyRoom): string {
  // IMPORTANT: do NOT default missing tier to "free" here.
  return String(room?.tier ?? room?.meta?.tier ?? "").toLowerCase();
}
function normalizeRoomTierToTierId(roomTier: string): TierId | null {
  const t = String(roomTier || "").trim();
  if (!t) return null;
  return normalizeTier(t);
}

function shortEmailLabel(email: string) {
  const e = String(email || "").trim();
  if (!e) return "SIGNED IN";
  const [name, domain] = e.split("@");
  if (!domain) return e.toUpperCase();
  const head = name.length <= 3 ? name : `${name.slice(0, 3)}…`;
  return `${head}@${domain}`.toUpperCase();
}
function shortUserId(id: string) {
  const s = String(id || "").trim();
  if (!s) return "USER";
  return (s.slice(0, 6) + "…" + s.slice(-4)).toUpperCase();
}
function dispatchHostContext(detail: Record<string, any>) {
  try {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("mb:host-context", { detail }));
  } catch {
    // ignore
  }
}
function coreRoomIdFromEffective(effectiveRoomId: string) {
  const id = String(effectiveRoomId || "").trim();
  if (!id) return id;
  return id.replace(/_(vip[1-9]|free)$/i, "");
}

// ----- “meaningful” entry + legacy coercion -----
function isLegacyStubEntry(e: any) {
  const slug = String(e?.slug ?? "").trim();
  const id = String(e?.id ?? "").trim();
  return slug.includes("__legacy") || id.includes("__legacy");
}
function hasMeaningfulText(e: any) {
  const en = String(e?.content?.en ?? "").trim();
  const vi = String(e?.content?.vi ?? "").trim();
  const en2 = String(e?.copy?.en ?? "").trim();
  const vi2 = String(e?.copy?.vi ?? "").trim();
  return en.length + vi.length + en2.length + vi2.length > 0;
}
function hasMeaningfulAudio(e: any) {
  const a = String(e?.audio_en ?? e?.audio ?? "").trim();
  return !!a;
}
function isMeaningfulEntry(e: any) {
  if (!e || typeof e !== "object") return false;
  if (isLegacyStubEntry(e)) return false;
  return (
    hasMeaningfulText(e) ||
    hasMeaningfulAudio(e) ||
    Array.isArray(e?.keywords_en) ||
    Array.isArray(e?.keywords_vi) ||
    Array.isArray(e?.keywords) ||
    Array.isArray(e?.tags)
  );
}

function coerceLegacyEntryShape(entry: any) {
  if (!entry || typeof entry !== "object") return entry;
  const e: any = { ...entry };

  if (!e.content && e.copy && typeof e.copy === "object") e.content = e.copy;

  if (typeof e.audio === "string" && e.audio.trim() && !e.audio_en) e.audio_en = e.audio.trim();

  if (typeof e.audio_en === "string" && e.audio_en.trim()) {
    const a = e.audio_en.trim();
    const isUrl = /^https?:\/\//i.test(a);
    if (!isUrl) {
      if (a.startsWith("/")) {
        // ok
      } else if (a.startsWith("audio/")) {
        e.audio_en = `/${a}`;
      } else if (!a.includes("/")) {
        e.audio_en = `/audio/${a}`;
      }
    }
  }

  const bag: string[] = [];
  const pushMany = (arr: any) => {
    if (!Array.isArray(arr)) return;
    for (const x of arr) {
      const s = String(x ?? "").trim();
      if (s) bag.push(s);
    }
  };

  pushMany(e.keywords);
  pushMany(e.keywords_en);
  pushMany(e.keywords_vi);
  pushMany(e.tags);

  const slug = String(e.slug ?? "").trim();
  if (slug) bag.push(slug);

  const title = String(e.title ?? "").trim();
  if (title) bag.push(title);

  const seen = new Set<string>();
  const merged = bag
    .map((s) => normalizeTextForKwMatch(s))
    .filter(Boolean)
    .filter((s) => {
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    });

  if (merged.length) e.keywords = merged;

  return e;
}

// ----- keyword bilingual lookup + per-entry keyword selection -----
function buildKeywordLookupFromEntries(entries: any[]) {
  const viByEn = new Map<string, string>();
  const enByVi = new Map<string, string>();

  const putPair = (enRaw: any, viRaw: any) => {
    const en = String(enRaw ?? "").trim();
    const vi = String(viRaw ?? "").trim();
    if (!en || !vi) return;

    const enN = normalizeTextForKwMatch(en);
    const viN = normalizeTextForKwMatch(vi);
    if (!enN || !viN) return;
    if (enN === viN) return;

    if (!viByEn.has(enN)) viByEn.set(enN, vi);
    if (!enByVi.has(viN)) enByVi.set(viN, en);
  };

  for (const e of entries || []) {
    const enArr = Array.isArray(e?.keywords_en) ? e.keywords_en : [];
    const viArr = Array.isArray(e?.keywords_vi) ? e.keywords_vi : [];
    const n = Math.min(enArr.length, viArr.length);
    for (let i = 0; i < n; i++) putPair(enArr[i], viArr[i]);
  }

  return { viByEn, enByVi };
}

function pickOneKeywordPairForEntry(
  entry: any,
  lookup: { viByEn: Map<string, string>; enByVi: Map<string, string> },
): { en: string; vi: string } | null {
  const enArr = Array.isArray(entry?.keywords_en) ? entry.keywords_en : [];
  const viArr = Array.isArray(entry?.keywords_vi) ? entry.keywords_vi : [];

  // Prefer paired index i↔i
  {
    const n = Math.min(enArr.length, viArr.length);
    for (let i = 0; i < n; i++) {
      const en = String(enArr[i] ?? "").trim();
      const vi = String(viArr[i] ?? "").trim();
      if (!en || !vi) continue;
      if (normalizeTextForKwMatch(en) === normalizeTextForKwMatch(vi)) continue;
      return { en, vi };
    }
  }

  // EN-only -> try lookup
  if (enArr.length > 0) {
    const en = String(enArr[0] ?? "").trim();
    if (!en) return null;
    let vi = String(lookup.viByEn.get(normalizeTextForKwMatch(en)) ?? "").trim();
    if (vi && normalizeTextForKwMatch(vi) === normalizeTextForKwMatch(en)) vi = "";
    return { en, vi };
  }

  // VI-only -> try lookup
  if (viArr.length > 0) {
    const vi = String(viArr[0] ?? "").trim();
    if (!vi) return null;
    let en = String(lookup.enByVi.get(normalizeTextForKwMatch(vi)) ?? "").trim();
    if (en && normalizeTextForKwMatch(en) === normalizeTextForKwMatch(vi)) en = "";
    return { en, vi };
  }

  return null;
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
  const safeRoom = (room ?? {}) as AnyRoom;
  const effectiveRoomId = String(safeRoom?.id || roomId || "");
  const coreRoomId = useMemo(() => coreRoomIdFromEffective(effectiveRoomId), [effectiveRoomId]);

  const access = useUserAccess();
  const accessLoading = access.loading || access.isLoading;
  const authUser = useAuthUser(supabase);

  const isDev = typeof import.meta !== "undefined" && (import.meta as any).env?.DEV;
  const showDev = useMemo(() => {
    if (!isDev) return false;
    try {
      if (typeof window === "undefined") return false;
      return new URLSearchParams(window.location.search).get("dev") === "1";
    } catch {
      return false;
    }
  }, [isDev]);

  const isNarrow =
    typeof window !== "undefined" ? window.matchMedia("(max-width: 860px)").matches : false;

  const scrollToAudio = () => {
    const el = audioAnchorRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // kill native audio controls (locked rule)
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

  // Spec asserts (DEV only)
  useEffect(() => {
    if (!isDev) return;
    const root = rootRef.current;
    if (!root) return;

    const boxes = ["2", "3", "4", "5"].map((n) => root.querySelector(`[data-room-box="${n}"]`));
    if (!boxes.every(Boolean)) {
      // eslint-disable-next-line no-console
      console.error("ROOM 5-BOX SPEC VIOLATION: missing data-room-box=2/3/4/5");
      return;
    }
    const idx = boxes.map((el) => Array.prototype.indexOf.call(root.children, el));
    if (!(idx[0] < idx[1] && idx[1] < idx[2] && idx[2] < idx[3])) {
      // eslint-disable-next-line no-console
      console.error("ROOM 5-BOX SPEC VIOLATION: boxes not ordered 2→3→4→5. Indexes:", idx);
    }
  }, [effectiveRoomId, isDev]);

  const tier = useMemo(() => pickTier(safeRoom), [safeRoom]);
  const requiredTierIdFromMeta = useMemo<TierId | null>(() => normalizeRoomTierToTierId(tier), [tier]);
  const inferredTierId = useMemo<TierId>(() => tierFromRoomId(effectiveRoomId), [effectiveRoomId]);

  const requiredTierId = useMemo<TierId>(() => requiredTierIdFromMeta ?? inferredTierId, [
    requiredTierIdFromMeta,
    inferredTierId,
  ]);
  const displayTierId = useMemo<TierId>(() => requiredTierIdFromMeta ?? inferredTierId, [
    requiredTierIdFromMeta,
    inferredTierId,
  ]);

  const isLocked = useMemo(() => {
    if (accessLoading) return requiredTierId !== "free";
    return !access.canAccessTier(requiredTierId);
  }, [accessLoading, access, requiredTierId]);

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } finally {
      window.location.href = "/signin";
    }
  }

  // ---- DB entries (RLS) ----
  const [dbRows, setDbRows] = useState<any[] | null>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!effectiveRoomId) {
        setDbRows(null);
        setDbError(null);
        setDbLoading(false);
        return;
      }

      setDbLoading(true);
      setDbError(null);

      // ✅ FIX: try effective first, then coreRoomId if no useful rows
      const r1 = await fetchRoomEntriesDb(supabase, effectiveRoomId);
      let rows = Array.isArray(r1?.rows) ? r1.rows : [];
      let error = r1?.error ?? null;

      if (rows.length === 0 && coreRoomId && coreRoomId !== effectiveRoomId) {
        const r2 = await fetchRoomEntriesDb(supabase, coreRoomId);
        const rows2 = Array.isArray(r2?.rows) ? r2.rows : [];
        if (rows2.length > 0) {
          rows = rows2;
          error = r2?.error ?? null;
        }
      }

      if (cancelled) return;
      setDbRows(rows);
      setDbError(error);
      setDbLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [effectiveRoomId, coreRoomId]);

  // ---- titles / intros ----
  const rawEN = useMemo(() => String(pickTitleENRaw(safeRoom) || ""), [safeRoom]);
  const rawVI = useMemo(() => String(pickTitleVIRaw(safeRoom) || ""), [safeRoom]);

  const titleEN = useMemo(() => {
    const r = rawEN.trim();
    if (!r) return prettifyRoomIdEN(effectiveRoomId);
    if (isBadAutoTitle(r, effectiveRoomId)) return prettifyRoomIdEN(effectiveRoomId);
    return r;
  }, [rawEN, effectiveRoomId]);

  const titleVI = useMemo(() => String(rawVI || "").trim(), [rawVI]);

  const roomTitleBilingual = useMemo(() => {
    const en = String(titleEN || "").trim();
    const vi = String(titleVI || "").trim();
    if (en && vi) return `${en} / ${vi}`;
    return en || vi || "Untitled Room";
  }, [titleEN, titleVI]);

  const introEN = useMemo(() => pickIntroEN(safeRoom), [safeRoom]);
  const introVI = useMemo(() => pickIntroVI(safeRoom), [safeRoom]);

  // ---- keywords + entries (DB preferred, JSON fallback) ----
  const kwRaw = useMemo(() => resolveKeywords(safeRoom), [safeRoom]);
  const essay = useMemo(() => resolveEssay(safeRoom), [safeRoom]);

  const dbLeafEntriesRaw = useMemo(() => {
    if (!Array.isArray(dbRows) || dbRows.length === 0) return [];
    return dbRows
      .map(coerceRoomEntryRowToEntry)
      .map(coerceLegacyEntryShape)
      .filter((x) => x && typeof x === "object");
  }, [dbRows]);

  const dbLeafEntries = useMemo(() => {
    if (dbLeafEntriesRaw.length === 0) return [];
    return dbLeafEntriesRaw.filter(isMeaningfulEntry);
  }, [dbLeafEntriesRaw]);

  const jsonLeafEntries = useMemo(() => {
    const extracted = extractJsonLeafEntries(safeRoom);
    const fallback = Array.isArray((safeRoom as any)?.entries) ? (safeRoom as any).entries : [];
    const leaf = (Array.isArray(extracted) && extracted.length > 0 ? extracted : fallback) as any[];
    return leaf.map(coerceLegacyEntryShape).filter((x) => x && typeof x === "object");
  }, [safeRoom]);

  const chosenEntries = useMemo(() => {
    if (dbLeafEntries.length > 0) return { source: "DB" as const, list: dbLeafEntries };
    return { source: "JSON" as const, list: jsonLeafEntries };
  }, [dbLeafEntries, jsonLeafEntries]);

  const allEntries = useMemo(() => chosenEntries.list.map((e: any) => ({ entry: e })), [chosenEntries]);

  const kw = useMemo(() => {
    const entries = chosenEntries.list;
    const entryCount = entries.length;
    const lookup = buildKeywordLookupFromEntries(entries);

    // Prefer ONE keyword per entry when entry keyword fields exist
    if (entryCount > 0) {
      const perEntry = entries
        .map((e) => pickOneKeywordPairForEntry(e, lookup))
        .filter(Boolean) as Array<{ en: string; vi: string }>;

      if (perEntry.length > 0) {
        const trimmed = perEntry.slice(0, Math.max(1, entryCount));
        return {
          en: trimmed.map((p) => String(p.en || "").trim()),
          vi: trimmed.map((p) => {
            const vi = String(p.vi || "").trim();
            const en = String(p.en || "").trim();
            return vi && normalizeTextForKwMatch(vi) !== normalizeTextForKwMatch(en) ? vi : "";
          }),
        };
      }
    }

    // fallback: room keywords if present else derived
    const hasReal = (kwRaw?.en?.length || 0) > 0 || (kwRaw?.vi?.length || 0) > 0;
    const base = hasReal ? kwRaw : entryCount > 0 ? deriveKeywordsFromEntryList(entries) : { en: [], vi: [] };

    // final: enforce no fake EN/EN display by blanking VI when same
    const maxLen = Math.max(base.en.length, base.vi.length);
    return {
      en: Array.from({ length: maxLen }).map((_, i) => String(base.en[i] ?? "").trim()),
      vi: Array.from({ length: maxLen }).map((_, i) => {
        const en = String(base.en[i] ?? "").trim();
        const vi = String(base.vi[i] ?? "").trim();
        if (!vi) return "";
        return normalizeTextForKwMatch(vi) === normalizeTextForKwMatch(en) ? "" : vi;
      }),
    };
  }, [kwRaw, chosenEntries]);

  const enKeywords = (kw.en.length ? kw.en : kw.vi).map(String);
  const viKeywords = (kw.vi.length ? kw.vi : kw.en).map(String);

  const kwColorMap = useMemo(() => buildKeywordColorMap(enKeywords, viKeywords, 5), [
    enKeywords,
    viKeywords,
  ]);

  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  useEffect(() => setActiveKeyword(null), [roomId]);
  useEffect(() => setActiveKeyword(null), [effectiveRoomId]);

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

  // ---- BOX 5: CHAT (canonical = effectiveRoomId) ----
  type ChatRow = { id: any; room_id?: string; user_id?: string; message?: string; created_at?: string };

  const canonicalChatRoomId = String(effectiveRoomId || "").trim();

  const [chatRows, setChatRows] = useState<ChatRow[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatText, setChatText] = useState("");
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  const captureChatStick = () => {
    const el = chatListRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  };
  const scrollToBottomIfSticky = () => {
    const el = chatListRef.current;
    if (!el || !stickToBottomRef.current) return;
    try {
      el.scrollTop = el.scrollHeight;
    } catch {
      // ignore
    }
  };

  const loadChatInline = useCallback(
    async (limit = 60) => {
      if (!canonicalChatRoomId) {
        setChatRows([]);
        setChatError("Chat room key missing.");
        setChatLoading(false);
        return;
      }

      setChatLoading(true);
      setChatError(null);

      try {
        const { data, error } = await supabase
          .from("community_messages")
          .select("id, room_id, user_id, message, created_at")
          .eq("room_id", canonicalChatRoomId)
          .order("created_at", { ascending: false })
          .limit(Math.max(1, Math.min(200, limit)));

        if (error) {
          setChatRows([]);
          setChatError(`Load failed: ${error.message || String(error)}`);
          setChatLoading(false);
          return;
        }

        const rows = Array.isArray(data) ? (data as ChatRow[]) : [];
        rows.reverse();
        setChatRows(rows);
        setChatLoading(false);
        setTimeout(() => scrollToBottomIfSticky(), 0);
      } catch (e: any) {
        setChatRows([]);
        setChatError(`Load exception: ${e?.message || String(e)}`);
        setChatLoading(false);
      }
    },
    [canonicalChatRoomId],
  );

  useEffect(() => {
    loadChatInline(60);
  }, [loadChatInline]);

  useEffect(() => {
    if (!canonicalChatRoomId) return;

    const channel = supabase.channel(`mb-chat-rebuild:${canonicalChatRoomId}`);
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "community_messages" },
      (payload: any) => {
        const row = (payload?.new || null) as ChatRow | null;
        if (!row) return;
        if (String(row.room_id || "") !== canonicalChatRoomId) return;

        setChatRows((cur) => {
          const id = String((row as any)?.id ?? "");
          if (id && cur.some((r) => String((r as any)?.id ?? "") === id)) return cur;
          return [...cur, row];
        });

        setTimeout(() => scrollToBottomIfSticky(), 0);
      },
    );

    channel.subscribe();
    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {
        // ignore
      }
    };
  }, [canonicalChatRoomId]);

  const sendChatInline = useCallback(async () => {
    const msg = String(chatText || "").trim();
    if (!msg) return;

    if (!authUser?.id) {
      setChatError("Please sign in to post messages.");
      return;
    }
    if (!canonicalChatRoomId) {
      setChatError("Chat room key missing.");
      return;
    }

    setChatSending(true);
    setChatError(null);

    try {
      let res = await supabase
        .from("community_messages")
        .insert({ room_id: canonicalChatRoomId, message: msg })
        .select("id, room_id, user_id, message, created_at")
        .single();

      if (res?.error) {
        const em = String(res.error?.message || "").toLowerCase();
        if (em.includes("user_id")) {
          res = await supabase
            .from("community_messages")
            .insert({ room_id: canonicalChatRoomId, message: msg, user_id: authUser.id })
            .select("id, room_id, user_id, message, created_at")
            .single();
        }
      }

      if (res?.error) {
        setChatError(`Send failed: ${String(res.error?.message || res.error)}`);
        setChatSending(false);
        return;
      }

      const data = res?.data as any;
      if (data) {
        setChatRows((cur) => {
          const id = String(data?.id ?? "");
          if (id && cur.some((r) => String((r as any)?.id ?? "") === id)) return cur;
          return [...cur, data];
        });
      } else {
        await loadChatInline(60);
      }

      setChatText("");
      setChatSending(false);
      stickToBottomRef.current = true;
      setTimeout(() => scrollToBottomIfSticky(), 0);
    } catch (e: any) {
      setChatError(`Send exception: ${e?.message || String(e)}`);
      setChatSending(false);
    }
  }, [authUser?.id, canonicalChatRoomId, chatText, loadChatInline]);

  const feedback = useRoomFeedback(supabase, coreRoomId, authUser);

  const [chatCollapsed, setChatCollapsed] = useState(false);
  useEffect(() => setChatCollapsed(false), [canonicalChatRoomId]);

  const chatListMaxH = activeEntry ? 140 : 220;
  const roomIsEmpty = !room;

  const titleStyle: React.CSSProperties = useMemo(
    () => ({
      fontSize: isNarrow ? 22 : 28,
      fontWeight: 950,
      letterSpacing: -0.6,
      lineHeight: 1.08,
      minWidth: 0,
      whiteSpace: "normal",
      overflow: "hidden",
      textOverflow: "clip",
      overflowWrap: "anywhere",
      wordBreak: "break-word",
      display: "-webkit-box",
      WebkitLineClamp: 2 as any,
      WebkitBoxOrient: "vertical" as any,
    }),
    [isNarrow],
  );

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
            roomTitle={roomTitleBilingual}
            activeKeyword={activeKeyword}
            onClearKeyword={clearKeyword}
            onScrollToAudio={scrollToAudio}
          />

          {/* BOX 2 */}
          <div className="mb-titleRow" data-room-box="2">
            <div className="mb-titleLeft">
              {displayTierId !== "free" ? <span className="mb-tier">{displayTierId}</span> : null}

              {authUser ? (
                <span className="mb-tier" title={String(authUser.email || authUser.id || "")}>
                  ✓ {shortEmailLabel(String((authUser as any).email || ""))}
                </span>
              ) : (
                <a className="mb-tier" href="/signin" title="Sign in">
                  ⟶ SIGN IN
                </a>
              )}

              {!accessLoading ? (
                <span className="mb-tier" title="Your current tier from public.profiles">
                  TIER: {String(access.tier || "free").toUpperCase()}
                </span>
              ) : null}
            </div>

            <div className="mb-titleCenter" style={{ minWidth: 0 }}>
              <div className="mb-roomTitle" title={roomTitleBilingual} style={titleStyle}>
                {roomTitleBilingual}
              </div>
            </div>

            <div className="mb-titleRight">
              {authUser ? (
                <button type="button" className="mb-tier" title="Sign out" onClick={signOut}>
                  SIGN OUT
                </button>
              ) : null}

              <button type="button" className="mb-iconBtn" title="Favorite (UI shell)" onClick={() => {}}>
                ♡
              </button>
              <button
                type="button"
                className="mb-iconBtn"
                title="Refresh"
                onClick={() => window.location.reload()}
              >
                ↻
              </button>
            </div>
          </div>

          {/* BOX 3 */}
          <section className="mb-card p-5 md:p-6 mb-5" data-room-box="3">
            <div className="mb-welcomeLine">
              <span>
                {highlightByColorMap(welcomeEN, kwColorMap)} <b>/</b> {highlightByColorMap(welcomeVI, kwColorMap)}
              </span>
            </div>

            {showDev ? (
              <div className="mt-2 text-[11px] opacity-70">
                <b>DEV</b> room="{effectiveRoomId}" | coreRoomId="{coreRoomId}" | chatRoomId="{canonicalChatRoomId}" |
                chatRows={chatRows.length} {chatLoading ? "(loading)" : ""}{" "}
                {chatError ? `chatError="${chatError}"` : ""} | dbRows={Array.isArray(dbRows) ? dbRows.length : "null"}{" "}
                {dbLoading ? "(loading)" : ""} {dbError ? `dbError="${dbError}"` : ""} | dbLeafEntries(real)=
                {dbLeafEntries.length} | jsonLeafEntries={jsonLeafEntries.length} | chosen={chosenEntries.source} |
                allEntries={allEntries.length} | kwButtons={Math.max(kw.en.length, kw.vi.length)} | activeKeyword=
                {activeKeyword ? `"${activeKeyword}"` : "null"}
              </div>
            ) : null}

            {Math.max(kw.en.length, kw.vi.length) > 0 ? (
              <div className="mb-keyRow">
                {Array.from({ length: Math.max(kw.en.length, kw.vi.length) }).map((_, i) => {
                  const en = String(kw.en[i] ?? "").trim();
                  let vi = String(kw.vi[i] ?? "").trim();
                  if (!en && !vi) return null;

                  // never show fake EN/EN
                  if (!vi || normalizeTextForKwMatch(vi) === normalizeTextForKwMatch(en)) vi = "";

                  const label = en && vi ? `${en} / ${vi}` : en || vi;
                  const next = (en || vi).trim();
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

          {/* BOX 4 */}
          <section className="mb-card p-5 md:p-6 mb-5 mb-box4" data-room-box="4">
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
                <div className="min-h-[460px]" />
              ) : activeEntry ? (
                <ActiveEntry
                  entry={activeEntry}
                  index={activeEntryIndex >= 0 ? activeEntryIndex : 0}
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
          <div style={{ marginTop: "auto" }} data-room-box="5">
            <div className="mb-card p-3 md:p-4">
              <div className="mb-chatWrap mb-4">
                <div className="mb-chatHeader" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span>Community Chat</span>

                  <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      type="button"
                      className="mb-tier"
                      onClick={() => setChatCollapsed((v) => !v)}
                      title={chatCollapsed ? "Expand chat" : "Collapse chat"}
                    >
                      {chatCollapsed ? "▸" : "▾"}
                    </button>

                    <button
                      type="button"
                      className="mb-tier"
                      onClick={() => loadChatInline(60)}
                      disabled={chatLoading}
                      title="Refresh chat"
                    >
                      ↻
                    </button>
                  </div>
                </div>

                {chatCollapsed ? (
                  <div className="mb-chatTiny" style={{ padding: "6px 2px" }}>
                    Chat collapsed (still here). Click <b>▸</b> to expand.
                  </div>
                ) : (
                  <>
                    <div
                      className="mb-chatList"
                      style={{ maxHeight: chatListMaxH, overflow: "auto" }}
                      ref={chatListRef}
                      onScroll={captureChatStick}
                      onWheel={captureChatStick}
                      onTouchMove={captureChatStick}
                    >
                      {chatRows.length === 0 ? (
                        <div className="text-xs opacity-70">
                          No messages under this room key yet.
                          <span style={{ opacity: 0.7 }}> (room_id="{canonicalChatRoomId}")</span>
                        </div>
                      ) : (
                        chatRows.map((m: any) => {
                          const isMe = authUser
                            ? String(m?.user_id || "") === String((authUser as any)?.id || "")
                            : false;

                          const who = isMe
                            ? shortEmailLabel(String((authUser as any)?.email || "")) || "ME"
                            : shortUserId(String(m?.user_id || "user"));

                          const when = m?.created_at ? new Date(m.created_at).toLocaleString() : "";
                          const text = String(m?.message || "").trim();

                          return (
                            <div key={String(m?.id)} className="mb-chatMsg">
                              <div className="mb-chatMeta">
                                {who} {when ? `• ${when}` : ""}
                              </div>
                              <div className="whitespace-pre-wrap">{text || "[empty]"}</div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {!authUser ? (
                      <div className="mb-chatTiny">
                        <a className="underline font-bold" href="/signin">
                          Sign in
                        </a>{" "}
                        to post messages.
                        <span style={{ opacity: 0.7 }}> (room_id="{canonicalChatRoomId}")</span>
                      </div>
                    ) : (
                      <div className="mb-chatComposer">
                        <input
                          value={chatText}
                          onChange={(e) => setChatText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              sendChatInline();
                            }
                          }}
                          placeholder="Say something… (max 500 chars)"
                          disabled={chatSending}
                          maxLength={500}
                        />
                        <button
                          type="button"
                          onClick={sendChatInline}
                          disabled={chatSending || !chatText.trim()}
                          title="Send"
                        >
                          ➤
                        </button>
                      </div>
                    )}

                    {chatError ? <div className="mb-chatTiny">⚠ {chatError}</div> : null}
                    {chatLoading ? <div className="mb-chatTiny">Loading…</div> : null}
                  </>
                )}
              </div>

              <div className="mb-feedback">
                <input
                  value={feedback.feedbackText}
                  onChange={(e) => {
                    feedback.setFeedbackText(e.target.value);
                    if (feedback.feedbackError) feedback.setFeedbackError(null);
                    if (feedback.feedbackSent) feedback.setFeedbackSent(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      feedback.sendFeedback();
                    }
                  }}
                  placeholder="Feedback to admin / Góp ý cho admin…"
                  aria-label="Feedback to admin"
                  disabled={feedback.feedbackSending}
                  maxLength={500}
                />
                <button
                  type="button"
                  title={authUser ? "Send feedback" : "Sign in to send feedback"}
                  onClick={feedback.sendFeedback}
                  disabled={feedback.feedbackSending || !feedback.feedbackText.trim()}
                >
                  ➤
                </button>
              </div>

              {feedback.feedbackError || feedback.feedbackSent ? (
                <div className="mt-2 text-xs opacity-70">
                  {feedback.feedbackError ? `⚠ ${feedback.feedbackError}` : "✓ Sent to admin"}
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
