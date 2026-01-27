// FILE: src/components/room/hooks/useCommunityChat.ts
// VERSION: MB-BLUE-99.11w-host-repeat-target — 2026-01-21 (+0700)
//
// LOCKED INTENT:
// - Canonical chat room_id = effectiveRoomId ONLY (load/write/realtime)
// - NO JSX in this file (.ts only)

import { useCallback, useEffect, useRef, useState } from "react";

type SupabaseLike = any;

type ChatRow = { id: any; room_id?: string; user_id?: string; message?: string; created_at?: string };

const TABLE = "community_messages";

export function useCommunityChat(supabase: SupabaseLike, roomId: string, authUser: any) {
  const canonicalRoomId = String(roomId || "").trim();
  const authUserId = String(authUser?.id || "").trim() || null;

  const [chatRows, setChatRows] = useState<ChatRow[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatText, setChatText] = useState("");

  const chatListRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  const captureChatStick = useCallback(() => {
    const el = chatListRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  }, []);

  const scrollToBottomIfSticky = useCallback(() => {
    const el = chatListRef.current;
    if (!el || !stickToBottomRef.current) return;
    try {
      el.scrollTop = el.scrollHeight;
    } catch {
      // ignore
    }
  }, []);

  const loadChat = useCallback(
    async (limit = 60) => {
      if (!canonicalRoomId) {
        setChatRows([]);
        setChatError("Chat room key missing.");
        setChatLoading(false);
        return;
      }

      setChatLoading(true);
      setChatError(null);

      try {
        const { data, error } = await supabase
          .from(TABLE)
          .select("id, room_id, user_id, message, created_at")
          .eq("room_id", canonicalRoomId)
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
    [canonicalRoomId, scrollToBottomIfSticky, supabase],
  );

  useEffect(() => {
    loadChat(60);
  }, [loadChat]);

  // realtime
  useEffect(() => {
    if (!canonicalRoomId) return;

    const channel = supabase.channel(`mb-chat:${canonicalRoomId}`);
    channel.on("postgres_changes", { event: "INSERT", schema: "public", table: TABLE }, (payload: any) => {
      const row = (payload?.new || null) as ChatRow | null;
      if (!row) return;
      if (String(row.room_id || "") !== canonicalRoomId) return;

      setChatRows((cur) => {
        const id = String((row as any)?.id ?? "");
        if (id && cur.some((r) => String((r as any)?.id ?? "") === id)) return cur;
        return [...cur, row];
      });

      setTimeout(() => scrollToBottomIfSticky(), 0);
    });

    channel.subscribe();
    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {
        // ignore
      }
    };
  }, [canonicalRoomId, scrollToBottomIfSticky, supabase]);

  // ✅ internal sender that can accept an explicit message (prevents UI mismatch bugs)
  const sendMessage = useCallback(
    async (message: string) => {
      const msg = String(message || "").trim();
      if (!msg) return;

      if (!authUserId) {
        setChatError("Please sign in to post messages.");
        return;
      }
      if (!canonicalRoomId) {
        setChatError("Chat room key missing.");
        return;
      }

      setChatSending(true);
      setChatError(null);

      try {
        let res = await supabase
          .from(TABLE)
          .insert({ room_id: canonicalRoomId, message: msg })
          .select("id, room_id, user_id, message, created_at")
          .single();

        // fallback if DB requires explicit user_id
        if (res?.error) {
          const em = String(res.error?.message || "").toLowerCase();
          if (em.includes("user_id")) {
            res = await supabase
              .from(TABLE)
              .insert({ room_id: canonicalRoomId, message: msg, user_id: authUserId })
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
          await loadChat(60);
        }

        setChatText("");
        setChatSending(false);
        stickToBottomRef.current = true;
        setTimeout(() => scrollToBottomIfSticky(), 0);
      } catch (e: any) {
        setChatError(`Send exception: ${e?.message || String(e)}`);
        setChatSending(false);
      }
    },
    [authUserId, canonicalRoomId, loadChat, scrollToBottomIfSticky, supabase],
  );

  // keep existing API (no behavior change)
  const sendChat = useCallback(async () => {
    const msg = String(chatText || "").trim();
    if (!msg) return;
    await sendMessage(msg);
  }, [chatText, sendMessage]);

  // IMPORTANT:
  // - Do NOT wrap this in useMemo(() => ({ ... })) — ESLint rule:
  //   react-hooks/preserve-manual-memoization
  // - Returning a fresh object is OK because the functions are memoized via useCallback.
  return {
    canonicalRoomId,
    chatRows,
    chatLoading,
    chatSending,
    chatError,
    setChatError,
    chatText,
    setChatText,
    chatListRef,
    captureChatStick,
    loadChat,
    sendChat,

    // ✅ NEW alias for UI components:
    // - call chat.sendMessage("hello") instead of fiddling with setChatText
    sendMessage,
  };
}
