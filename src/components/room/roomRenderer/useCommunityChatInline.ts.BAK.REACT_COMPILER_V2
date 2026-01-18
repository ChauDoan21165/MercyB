// FILE: src/components/room/roomRenderer/useCommunityChatInline.ts
// MB-BLUE-99.11v-split-chat — 2026-01-19 (+0700)

import { useCallback, useEffect, useRef, useState } from "react";
import { shortEmailLabel, shortUserId } from "@/components/room/roomRenderer/helpers";
import type { SupabaseClient } from "@supabase/supabase-js";

type ChatRow = {
  id: any;
  room_id?: string;
  user_id?: string;
  message?: string;
  created_at?: string;
};

export function useCommunityChatInline(args: {
  supabase: SupabaseClient;
  roomId: string;
  authUser: any | null;
  limit?: number;
}) {
  const { supabase, roomId, authUser } = args;
  const canonicalChatRoomId = String(roomId || "").trim();

  const [chatRows, setChatRows] = useState<ChatRow[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatText, setChatText] = useState("");
  const [chatCollapsed, setChatCollapsed] = useState(false);

  const chatListRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  const captureChatStick = () => {
    const el = chatListRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  };

  const scrollToBottomIfSticky = () => {
    const el = chatListRef.current;
    if (!el) return;
    if (!stickToBottomRef.current) return;
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
        rows.reverse(); // oldest -> newest
        setChatRows(rows);
        setChatLoading(false);

        setTimeout(() => scrollToBottomIfSticky(), 0);
      } catch (e: any) {
        setChatRows([]);
        setChatError(`Load exception: ${e?.message || String(e)}`);
        setChatLoading(false);
      }
    },
    [canonicalChatRoomId, supabase],
  );

  useEffect(() => {
    loadChatInline(args.limit ?? 60);
  }, [loadChatInline]);

  // reset on room change
  useEffect(() => {
    setChatCollapsed(false);
  }, [canonicalChatRoomId]);

  // realtime subscribe (canonical only)
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
  }, [canonicalChatRoomId, supabase]);

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
        await loadChatInline(args.limit ?? 60);
      }

      setChatText("");
      setChatSending(false);

      stickToBottomRef.current = true;
      setTimeout(() => scrollToBottomIfSticky(), 0);
    } catch (e: any) {
      setChatError(`Send exception: ${e?.message || String(e)}`);
      setChatSending(false);
    }
  }, [authUser?.id, canonicalChatRoomId, chatText, loadChatInline, supabase]);

  function formatWho(m: any) {
    const isMe = authUser ? String(m?.user_id || "") === String(authUser?.id || "") : false;

    const who = isMe
      ? shortEmailLabel(String((authUser as any)?.email || "")) || "ME"
      : shortUserId(String(m?.user_id || "user"));

    return who;
  }

  function formatWhen(m: any) {
    return m?.created_at ? new Date(m.created_at).toLocaleString() : "";
  }

  return {
    canonicalChatRoomId,
    chatRows,
    chatLoading,
    chatSending,
    chatError,
    setChatError,
    chatText,
    setChatText,
    chatCollapsed,
    setChatCollapsed,
    chatListRef,
    captureChatStick,
    loadChatInline,
    sendChatInline,
    scrollToBottomIfSticky,
    stickToBottomRef,
    formatWho,
    formatWhen,
  };
}
