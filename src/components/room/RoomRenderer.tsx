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
// VERSION: MB-BLUE-99.11x-split-boxes+dbin-kwfix — 2026-01-25 (+0700)
//
// Split more (ROI):
// - BOX 2 → RoomBoxTitleRow.tsx
// - BOX 3 → RoomBoxWelcomeKeywords.tsx
// - BOX 4 → RoomBoxContent.tsx
// - BOX 5 → RoomBoxChatFeedback.tsx
//
// HARDEN (99.11x):
// - DB load queries BOTH effectiveRoomId + coreRoomId in ONE query (some rooms exist only as *_vipX).
// - Keyword pills: force readable foreground on dark backgrounds (light text).
//
// FIX (99.11x+rank-tier):
// - If room.id has NO *_vipX suffix (ex: "cyrus_v1") but DB marks it as VIP (required_rank / vip_rank / tier_rank),
//   DO NOT infer "free". Prefer rank-based tier mapping BEFORE tierFromRoomId().
//
// FIX (99.11x+meta-free-override):
// - If room.meta tier says "free" BUT the id/rank implies VIP, DO NOT let "free" override.
//   This is the root cause of free users seeing vip rooms like *_vip5_bonus (shown as TIER: FREE).

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BilingualEssay } from "@/components/room/BilingualEssay";
import { useUserAccess } from "@/hooks/useUserAccess";
import type { TierId } from "@/lib/constants/tiers";
import { normalizeTier } from "@/lib/constants/tiers";
import { tierFromRoomId } from "@/lib/tierFromRoomId";

import {
  MercyGuideCorner,
  buildKeywordColorMap,
  entryMatchesKeyword,
  normalizeTextForKwMatch,
} from "@/components/room/RoomRendererUI";

import { ROOM_CSS } from "@/components/room/roomRendererStyles";
import { supabase } from "@/lib/supabaseClient";

import { prettifyRoomIdEN, isBadAutoTitle } from "@/components/room/roomIdUtils";
import { coerceRoomEntryRowToEntry } from "@/components/room/roomEntriesDb";
import {
  resolveKeywords,
  resolveEssay,
  extractJsonLeafEntries,
  deriveKeywordsFromEntryList,
} from "@/components/room/roomJsonExtract";

import { useAuthUser } from "@/components/room/hooks/useAuthUser";
import { useRoomFeedback } from "@/components/room/hooks/useRoomFeedback";
import { useCommunityChat } from "@/components/room/hooks/useCommunityChat";

import { dispatchHostContext, dispatchHostRepeatTarget } from "@/components/room/roomHostDispatch";
import {
  coreRoomIdFromEffective,
  coerceLegacyEntryShape,
  isMeaningfulEntry,
  pickRepeatTargetFromEntry,
} from "@/components/room/roomEntryCoercion";
import { buildKeywordLookupFromEntries, pickOneKeywordPairForEntry } from "@/components/room/roomKeywordMap";

import { RoomBoxTitleRow } from "@/components/room/RoomBoxTitleRow";
import { RoomBoxWelcomeKeywords } from "@/components/room/RoomBoxWelcomeKeywords";
import { RoomBoxContent } from "@/components/room/RoomBoxContent";
import { RoomBoxChatFeedback } from "@/components/room/RoomBoxChatFeedback";

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

// ✅ NEW: rank-based tier inference for rooms whose ids don't include *_vipX suffix
function pickRequiredRank(room: AnyRoom): number | null {
  // accept several common column names / shapes
  const candidates = [
    room?.required_rank,
    room?.requiredRank,
    room?.required_vip_rank,
    room?.requiredVipRank,
    room?.vip_rank,
    room?.vipRank,
    room?.tier_rank,
    room?.tierRank,
    room?.meta?.required_rank,
    room?.meta?.vip_rank,
    room?.meta?.tier_rank,
  ];

  for (const v of candidates) {
    const n = Number(v);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return null;
}

function tierIdFromRequiredRank(rank: number | null): TierId | null {
  if (rank == null) return null;

  // Mercy Blade tiers that exist today
  // (Keep conservative: never invent vip4..vip8)
  if (rank >= 9) return "vip9";
  if (rank >= 3) return "vip3";
  // NOTE: Mercy Blade has no VIP2 product; treat rank>=2 as vip3 (lock, safe)
  if (rank >= 2) return "vip3";
  if (rank >= 1) return "vip1";
  return "free";
}

function preferNonFreeTier(meta: TierId | null, rank: TierId | null, inferred: TierId): TierId {
  // If meta says FREE but rank/id imply VIP, do NOT let FREE override.
  if (meta === "free" && (rank && rank !== "free")) return rank;
  if (meta === "free" && inferred !== "free") return inferred;

  // Otherwise keep the normal precedence.
  return meta ?? rank ?? inferred;
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
    obs.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["controls"] });
    return () => obs.disconnect();
  }, []);

  const tier = useMemo(() => pickTier(safeRoom), [safeRoom]);
  const requiredTierIdFromMeta = useMemo<TierId | null>(() => normalizeRoomTierToTierId(tier), [tier]);

  // ✅ NEW: if DB/room payload includes required rank, trust it (fixes "cyrus_v1" showing free)
  const requiredRank = useMemo<number | null>(() => pickRequiredRank(safeRoom), [safeRoom]);
  const requiredTierIdFromRank = useMemo<TierId | null>(() => tierIdFromRequiredRank(requiredRank), [requiredRank]);

  const inferredTierId = useMemo<TierId>(() => tierFromRoomId(effectiveRoomId), [effectiveRoomId]);

  const requiredTierId = useMemo<TierId>(() => {
    // priority: explicit tier string > rank > id inference
    // BUT: never allow meta "free" to override rank/id VIP
    return preferNonFreeTier(requiredTierIdFromMeta, requiredTierIdFromRank, inferredTierId);
  }, [requiredTierIdFromMeta, requiredTierIdFromRank, inferredTierId]);

  const displayTierId = useMemo<TierId>(() => {
    // same as required, because the tier pill MUST reflect real gating
    // BUT: never allow meta "free" to override rank/id VIP
    return preferNonFreeTier(requiredTierIdFromMeta, requiredTierIdFromRank, inferredTierId);
  }, [requiredTierIdFromMeta, requiredTierIdFromRank, inferredTierId]);

  const isLocked = useMemo(() => {
    if (accessLoading) return requiredTierId !== "free";
    return !access.canAccessTier(requiredTierId);
  }, [accessLoading, access, requiredTierId]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      window.location.href = "/signin";
    }
  }, []);

  // ---- DB entries (RLS) ----
  const [dbRows, setDbRows] = useState<any[] | null>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [dbSourceRoomId, setDbSourceRoomId] = useState<string | null>(null); // ✅ DEV: which id actually produced rows

  // Optional dev: show which ids we *intended* to query (effective + core)
  const dbQueriedIds = useMemo(() => {
    if (!effectiveRoomId) return "";
    const e = String(effectiveRoomId);
    const c = String(coreRoomId || "");
    if (c && c !== e) return `${e} OR ${c}`;
    return e;
  }, [effectiveRoomId, coreRoomId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!effectiveRoomId) {
        setDbRows(null);
        setDbError(null);
        setDbSourceRoomId(null);
        setDbLoading(false);
        return;
      }

      setDbLoading(true);
      setDbError(null);
      setDbSourceRoomId(null);

      // ✅ HARDEN: query BOTH effective + core in ONE query.
      // Some rooms only exist as *_vipX (no core rows), others only exist as core (no suffix rows).
      const ids: string[] = [];
      const e = String(effectiveRoomId || "").trim();
      const c = String(coreRoomId || "").trim();
      if (e) ids.push(e);
      if (c && c !== e) ids.push(c);

      try {
        const q = supabase
          .from("room_entries")
          .select("*")
          .in("room_id", ids)
          // safest ordering that won't explode if sort_order doesn't exist
          .order("created_at", { ascending: true })
          .limit(500);

        const { data, error } = await q;
        if (cancelled) return;

        const rows = Array.isArray(data) ? data : [];
        setDbRows(rows);

        if (error) {
          setDbError(error.message || String(error));
          setDbSourceRoomId(null);
        } else {
          setDbError(null);

          // dev helper: which key actually has rows (pick the most frequent room_id)
          if (rows.length > 0) {
            const counts = new Map<string, number>();
            for (const r of rows) {
              const rid = String((r as any)?.room_id || "").trim();
              if (!rid) continue;
              counts.set(rid, (counts.get(rid) || 0) + 1);
            }
            let best: { id: string; n: number } | null = null;
            for (const [id, n] of counts.entries()) {
              if (!best || n > best.n) best = { id, n };
            }
            setDbSourceRoomId(best?.id ?? null);
          } else {
            setDbSourceRoomId(null);
          }
        }
      } catch (err: any) {
        if (cancelled) return;
        setDbRows([]);
        setDbError(String(err?.message || err || "DB load failed"));
        setDbSourceRoomId(null);
      } finally {
        if (!cancelled) setDbLoading(false);
      }
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

  const dbLeafEntries = useMemo(() => {
    if (!Array.isArray(dbRows) || dbRows.length === 0) return [];
    return dbRows
      .map(coerceRoomEntryRowToEntry)
      .map(coerceLegacyEntryShape)
      .filter((x) => x && typeof x === "object")
      .filter(isMeaningfulEntry);
  }, [dbRows]);

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

    const hasReal = (kwRaw?.en?.length || 0) > 0 || (kwRaw?.vi?.length || 0) > 0;
    const base = hasReal ? kwRaw : entryCount > 0 ? deriveKeywordsFromEntryList(entries) : { en: [], vi: [] };

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

  const kwColorMap = useMemo(() => buildKeywordColorMap(enKeywords, viKeywords, 5), [enKeywords, viKeywords]);

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
    introVI?.trim() || `Chào mừng bạn đến với phòng ${titleVI || titleEN}, vui lòng nhấp vào từ khóa để bắt đầu`;

  const toggleKeyword = useCallback((next: string) => {
    setActiveKeyword((cur) => {
      const curKey = normalizeTextForKwMatch(cur || "");
      const nextKey = normalizeTextForKwMatch(next || "");
      return curKey && curKey === nextKey ? null : next;
    });
  }, []);

  // Host context
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

  // Repeat target
  useEffect(() => {
    if (!effectiveRoomId) return;
    if (!activeKeyword) return;
    if (!activeEntry) return;
    if (isLocked) return;

    const entryId = String(activeEntry?.id || activeEntry?.slug || "").trim() || null;
    const { text_en, text_vi, audio_url } = pickRepeatTargetFromEntry(activeEntry);
    if (!text_en && !text_vi) return;

    dispatchHostRepeatTarget({ roomId: effectiveRoomId, entryId, text_en, text_vi, audio_url, pace: "normal" });
  }, [effectiveRoomId, activeKeyword, activeEntry, isLocked]);

  // Chat + feedback
  // ✅ FIX: load chat history across both effective + core ids (canonical write stays effectiveRoomId because it's first).
  const chatRoomIds = useMemo(() => {
    const ids: string[] = [];
    const e = String(effectiveRoomId || "").trim();
    const c = String(coreRoomId || "").trim();
    if (e) ids.push(e);
    if (c && c !== e) ids.push(c);
    return ids.length > 0 ? ids : [e];
  }, [effectiveRoomId, coreRoomId]);

  const chat = useCommunityChat(supabase, chatRoomIds, authUser);

  const [chatCollapsed, setChatCollapsed] = useState(false);
  useEffect(() => setChatCollapsed(false), [chat.canonicalRoomId]);

  const feedback = useRoomFeedback(supabase, coreRoomId, authUser);

  const roomIsEmpty = !room;

  const devLine = showDev
    ? `DEV room="${effectiveRoomId}" | coreRoomId="${coreRoomId}" | tier(meta)="${tier || ""}" | rank=${
        requiredRank ?? ""
      } | requiredTier="${requiredTierId}" | displayTier="${displayTierId}" | dbQuery="${dbQueriedIds}" | dbSource="${
        dbSourceRoomId ?? ""
      }" | chatRoomId="${chat.canonicalRoomId}" | chatRows=${chat.chatRows.length} ${
        chat.chatLoading ? "(loading)" : ""
      } ${chat.chatError ? `chatError="${chat.chatError}"` : ""} | dbRows=${
        Array.isArray(dbRows) ? dbRows.length : "null"
      } ${dbLoading ? "(loading)" : ""} ${dbError ? `dbError="${dbError}"` : ""} | dbLeafEntries(real)=${
        dbLeafEntries.length
      } | jsonLeafEntries=${jsonLeafEntries.length} | chosen=${chosenEntries.source} | allEntries=${
        allEntries.length
      } | kwButtons=${Math.max(kw.en.length, kw.vi.length)} | activeKeyword=${
        activeKeyword ? `"${activeKeyword}"` : "null"
      }`
    : "";

  return (
    <div
      ref={rootRef}
      className="mb-room w-full max-w-none"
      data-mb-scope="room"
      data-mb-theme={useColorThemeSafe ? "color" : "bw"}
    >
      <style>
        {ROOM_CSS +
          `
/* HARDEN: keyword pill text must stay readable (fix "black on dark")
   IMPORTANT: scope this ONLY to the keyword PILLS / BUTTONS,
   do NOT affect essay highlight spans (.mb-entryText) */
.mb-room .mb-kw-row .mb-kw,
.mb-room .mb-kw-row [data-mb-kw],
.mb-room .mb-welcomeLine .mb-kw,
.mb-room .mb-welcomeLine [data-mb-kw],
.mb-room button.mb-kw,
.mb-room button[data-mb-kw]{
  color:#fff !important;
}
/* Keep descendants readable ONLY inside the pill/button, not inside essay */
.mb-room .mb-kw-row .mb-kw *,
.mb-room .mb-kw-row [data-mb-kw] *,
.mb-room .mb-welcomeLine .mb-kw *,
.mb-room .mb-welcomeLine [data-mb-kw] *,
.mb-room button.mb-kw *,
.mb-room button[data-mb-kw] *{
  color:inherit !important;
}
`}
      </style>

      {roomIsEmpty ? (
        <div className="rounded-xl border p-6 text-muted-foreground">Room loaded state is empty.</div>
      ) : (
        <>
          <MercyGuideCorner
            disabled={isLocked}
            roomTitle={roomTitleBilingual}
            activeKeyword={activeKeyword}
            onClearKeyword={() => setActiveKeyword(null)}
            onScrollToAudio={scrollToAudio}
          />

          <RoomBoxTitleRow
            isNarrow={isNarrow}
            roomTitleBilingual={roomTitleBilingual}
            displayTierId={displayTierId}
            authUser={authUser}
            accessLoading={accessLoading}
            accessTier={access.tier}
            onSignOut={signOut}
            onRefresh={() => window.location.reload()}
          />

          <RoomBoxWelcomeKeywords
            welcomeEN={welcomeEN}
            welcomeVI={welcomeVI}
            kwColorMap={kwColorMap}
            kw={kw}
            activeKeyword={activeKeyword}
            isLocked={isLocked}
            showDev={showDev}
            devLine={devLine}
            onToggleKeyword={toggleKeyword}
          />

          {(essay.en || essay.vi) ? (
            <div className="mb-card p-4 md:p-6 mb-5">
              <BilingualEssay title="Essay" en={essay.en || ""} vi={essay.vi || ""} />
            </div>
          ) : null}

          <RoomBoxContent
            isLocked={isLocked}
            accessLoading={accessLoading}
            requiredTierId={requiredTierId}
            accessTier={access.tier}
            activeKeyword={activeKeyword}
            activeEntry={activeEntry}
            activeEntryIndex={activeEntryIndex}
            enKeywords={enKeywords}
            viKeywords={viKeywords}
            // ✅ keep your cast (safe + zero runtime effect)
            audioAnchorRef={audioAnchorRef as React.RefObject<HTMLDivElement>}
            dbError={dbError}
            dbLoading={dbLoading}
            onClearKeyword={() => setActiveKeyword(null)}
          />

          <RoomBoxChatFeedback
            authUser={authUser}
            activeEntry={activeEntry}
            chat={chat}
            chatCollapsed={chatCollapsed}
            setChatCollapsed={setChatCollapsed}
            feedback={feedback}
          />
        </>
      )}
    </div>
  );
}

/* teacher GPT — new thing to learn:
   Never trust a “free” tier label from content payloads.
   If ID/rank implies VIP, let that win — otherwise you create accidental leaks. */
