// FILE: src/components/room/hooks/useCommunityChat.ts
// MB-BLUE-99.11r-fix3 → MB-BLUE-99.11r-fix4 — 2026-01-18 (+0700)
//
// FIX4: chat still “dead” after RoomRenderer multi-id wiring
// - Root cause: core normalization too weak for ids like *_vip3_ii, *_vip1_srs02, *_free_xx
//   Legacy rows are often stored under the true core (strip vip/free + trailing tokens).
// - Also: canonical write must follow caller’s effectiveRoomId (first incoming id), NOT URL.
// - Keep: stable hook shape (HMR safety), no JSX, load via .in(), realtime on all candidate ids.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TABLE = "community_messages";

// Column names (edit if your schema differs)
const COL_ROOM = "room_id";
const COL_USER = "user_id";
const COL_MSG = "message";
const COL_CREATED = "created_at";

type ChatRow = {
  id: any;
  room_id?: string;
  user_id?: string;
  message?: string;
  created_at?: string;
};

function safeErr(e: any): string {
  try {
    if (!e) return "Unknown error";
    if (typeof e === "string") return e;
    if (typeof e?.message === "string") return e.message;
    return JSON.stringify(e);
  } catch {
    return "Unknown error";
  }
}

/**
 * ✅ FIX4: stronger “core” reducer.
 * We want legacy/core rows to match when ids can be:
 * - room_vip3
 * - room_vip3_ii
 * - room_vip1_srs02
 * - room_free_kids_l1
 *
 * Strategy:
 * - strip trailing: _vip[1-9] OR _free
 * - ALSO allow ONE extra trailing token after that (common pattern: _vip3_ii, _vip1_srs02, _free_xx)
 *
 * Examples:
 *  "public_speaking_vip3"        -> "public_speaking"
 *  "public_speaking_vip3_ii"     -> "public_speaking"
 *  "survival_resilience_vip1_srs02" -> "survival_resilience"
 *  "kids_english_free_kids_l1"   -> "kids_english"
 *
 * NOTE: We only do this at the end (trailing), to avoid wrecking ids that contain "vip" mid-string.
 */
function coreRoomIdFromEffective(effectiveRoomId: string) {
  const id = String(effectiveRoomId || "").trim();
  if (!id) return id;

  // 1) strip: _vipN or _free at end
  let core = id.replace(/_(vip[1-9]|free)$/i, "");

  // 2) strip: _vipN_<token> or _free_<token> at end (one extra segment)
  // token = letters/numbers (common room suffixes)
  core = core.replace(/_(vip[1-9]|free)_[a-z0-9]+$/i, "");

  return core;
}

function readRoomIdFromUrl(): string {
  try {
    if (typeof window === "undefined") return "";
    const path = String(window.location?.pathname || "");
    // expected: /room/<id>
    const m = path.match(/\/room\/([^/]+)$/i);
    if (!m) return "";
    return decodeURIComponent(m[1] || "").trim();
  } catch {
    return "";
  }
}

function normalizeRoomIds(roomIdOrIds: string | string[]) {
  const raw = Array.isArray(roomIdOrIds) ? roomIdOrIds : [roomIdOrIds];
  const base = raw
    .map((x) => String(x || "").trim())
    .filter(Boolean);

  const urlId = readRoomIdFromUrl();
  const expanded: string[] = [];

  // 1) keep incoming order
  for (const id of base) expanded.push(id);

  // 2) add core variants for each incoming id
  for (const id of base) {
    const core = coreRoomIdFromEffective(id);
    if (core && core !== id) expanded.push(core);
  }

  // 3) add url id (and its core) if present (read-side self-heal only)
  if (urlId) expanded.push(urlId);
  if (urlId) {
    const core = coreRoomIdFromEffective(urlId);
    if (core && core !== urlId) expanded.push(core);
  }

  // de-dupe while preserving order
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of expanded) {
    const s = String(id || "").trim();
    if (!s) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }

  return out;
}

export function useCommunityChat(supabase: any, roomIdOrIds: string | string[], authUser: any) {
  const [chatRows, setChatRows] = useState<ChatRow[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatText, setChatText] = useState("");

  const chatListRef = useRef<HTMLDivElement | null>(null);

  // stick-to-bottom tracking
  const stickToBottomRef = useRef(true);

  const roomIds = useMemo(() => normalizeRoomIds(roomIdOrIds), [roomIdOrIds]);

  // ✅ FIX4: canonical write key MUST be caller-first (effectiveRoomId),
  // NOT URL. RoomRenderer passes [effectiveRoomId, coreRoomId].
  const canonicalRoomId = useMemo(() => {
    const raw = Array.isArray(roomIdOrIds) ? roomIdOrIds : [roomIdOrIds];
    const first = String(raw[0] || "").trim();
    if (first) return first;
    return roomIds[0] || "";
  }, [roomIdOrIds, roomIds]);

  const isAuthed = !!authUser?.id;

  const captureChatStick = useCallback(() => {
    const el = chatListRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    stickToBottomRef.current = nearBottom;
  }, []);

  const scrollToBottomIfSticky = useCallback(() => {
    const el = chatListRef.current;
    if (!el) return;
    if (!stickToBottomRef.current) return;
    try {
      el.scrollTop = el.scrollHeight;
    } catch {
      // ignore
    }
  }, []);

  const loadChat = useCallback(
    async (limit = 60) => {
      if (!supabase) {
        setChatRows([]);
        setChatError("Chat client missing (supabase).");
        setChatLoading(false);
        return;
      }

      if (roomIds.length === 0) {
        setChatRows([]);
        setChatError(null);
        setChatLoading(false);
        return;
      }

      setChatLoading(true);
      setChatError(null);

      try {
        const { data, error } = await supabase
          .from(TABLE)
          .select(`id, ${COL_ROOM}, ${COL_USER}, ${COL_MSG}, ${COL_CREATED}`)
          .in(COL_ROOM, roomIds)
          .order(COL_CREATED, { ascending: false })
          .limit(Math.max(1, Math.min(200, limit)));

        if (error) {
          setChatRows([]);
          setChatError(`Load failed: ${safeErr(error)}`);
          setChatLoading(false);
          return;
        }

        const rows = Array.isArray(data) ? (data as ChatRow[]) : [];
        rows.reverse(); // oldest -> newest
        setChatRows(rows);
        setChatLoading(false);

        setTimeout(() => scrollToBottomIfSticky(), 0);
      } catch (e) {
        setChatRows([]);
        setChatError(`Load exception: ${safeErr(e)}`);
        setChatLoading(false);
      }
    },
    [roomIds, scrollToBottomIfSticky, supabase],
  );

  const sendChat = useCallback(async () => {
    const msg = String(chatText || "").trim();

    if (!supabase) {
      setChatError("Chat client missing (supabase).");
      return;
    }
    if (!canonicalRoomId) {
      setChatError("Chat room key missing.");
      return;
    }
    if (!isAuthed) {
      setChatError("Please sign in to chat.");
      return;
    }
    if (!msg) return;

    setChatSending(true);
    setChatError(null);

    try {
      // Prefer insert WITHOUT user_id (many setups fill user_id via auth.uid()/trigger).
      let payload: any = { [COL_ROOM]: canonicalRoomId, [COL_MSG]: msg };

      let res = await supabase
        .from(TABLE)
        .insert(payload)
        .select(`id, ${COL_ROOM}, ${COL_USER}, ${COL_MSG}, ${COL_CREATED}`)
        .single();

      // Fallback: if schema requires explicit user_id
      if (
        res?.error &&
        String(res.error?.message || "")
          .toLowerCase()
          .includes(COL_USER)
      ) {
        payload = { [COL_ROOM]: canonicalRoomId, [COL_MSG]: msg, [COL_USER]: authUser?.id };
        res = await supabase
          .from(TABLE)
          .insert(payload)
          .select(`id, ${COL_ROOM}, ${COL_USER}, ${COL_MSG}, ${COL_CREATED}`)
          .single();
      }

      if (res?.error) {
        setChatError(`Send failed: ${safeErr(res.error)}`);
        setChatSending(false);
        return;
      }

      const newRow = (res?.data || null) as ChatRow | null;

      if (newRow) {
        setChatRows((cur) => {
          const id = String((newRow as any)?.id ?? "");
          if (id && cur.some((r) => String((r as any)?.id ?? "") === id)) return cur;
          return [...cur, newRow];
        });
      } else {
        await loadChat(60);
      }

      setChatText("");
      setChatSending(false);

      stickToBottomRef.current = true;
      setTimeout(() => scrollToBottomIfSticky(), 0);
    } catch (e) {
      setChatError(`Send exception: ${safeErr(e)}`);
      setChatSending(false);
    }
  }, [authUser, canonicalRoomId, chatText, isAuthed, loadChat, scrollToBottomIfSticky, supabase]);

  // Load on room change / auth change
  useEffect(() => {
    if (roomIds.length === 0) {
      setChatRows([]);
      setChatError(null);
      return;
    }
    loadChat(60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalRoomId, roomIds.join("|"), isAuthed]);

  // Realtime listener: subscribe to ALL ids (canonical + alternates)
  useEffect(() => {
    if (!supabase) return;
    if (!canonicalRoomId || roomIds.length === 0) return;

    const channelName = `mb-chat:${canonicalRoomId}`;
    const channel = supabase.channel(channelName);

    for (const rid of roomIds) {
      channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: TABLE,
          filter: `${COL_ROOM}=eq.${rid}`,
        },
        (payload: any) => {
          const row = (payload?.new || null) as ChatRow | null;
          if (!row) return;

          setChatRows((cur) => {
            const id = String((row as any)?.id ?? "");
            if (id && cur.some((r) => String((r as any)?.id ?? "") === id)) return cur;
            return [...cur, row];
          });

          setTimeout(() => scrollToBottomIfSticky(), 0);
        },
      );
    }

    channel.subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {
        // ignore
      }
    };
  }, [canonicalRoomId, roomIds.join("|"), scrollToBottomIfSticky, supabase]);

  return {
    // debug helpers
    roomIds,
    canonicalRoomId,

    chatRows,
    setChatRows,

    chatText,
    setChatText,

    chatLoading,
    chatSending,

    chatError,
    setChatError,

    chatListRef,
    captureChatStick,

    loadChat,
    sendChat,
  };
}

/**
 * New thing to learn:
 * When your DB “works” but UI is dead, suspect an ID normalization edge case first (vip3_ii, vip1_srs02).
 * Make the reader accept many keys, but keep the writer canonical and caller-controlled.
 */
