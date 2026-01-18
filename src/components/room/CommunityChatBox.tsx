import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ChatMsg = {
  id: string;
  room_id: string | null;
  user_id: string | null;
  user_email: string | null;
  message: string;
  created_at: string;
};

function shortEmail(email: string) {
  const e = String(email || "").trim();
  if (!e) return "anon";
  const [name, domain] = e.split("@");
  if (!domain) return e;
  const head = name.length <= 3 ? name : `${name.slice(0, 3)}…`;
  return `${head}@${domain}`;
}

export default function CommunityChatBox({
  roomId,
  disabled,
}: {
  roomId: string;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(true);

  const [authUser, setAuthUser] = useState<any | null>(null);

  const [rows, setRows] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const safeRoomId = useMemo(() => String(roomId || "").trim(), [roomId]);

  // auth state
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

  // initial load + realtime
  useEffect(() => {
    if (!safeRoomId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      try {
        const { data, error } = await supabase
          .from("room_chat_messages")
          .select("id, room_id, user_id, user_email, message, created_at")
          .eq("room_id", safeRoomId)
          .order("created_at", { ascending: true })
          .limit(80);

        if (cancelled) return;

        if (error) throw error;
        setRows(Array.isArray(data) ? (data as ChatMsg[]) : []);
      } catch (e: any) {
        if (cancelled) return;
        setErr(String(e?.message || e || "Failed to load chat"));
        setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel(`mb-room-chat:${safeRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_chat_messages",
          filter: `room_id=eq.${safeRoomId}`,
        },
        (payload) => {
          const next = payload.new as ChatMsg;
          setRows((prev) => {
            // de-dupe
            if (prev.some((r) => r.id === next.id)) return prev;
            return [...prev, next];
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [safeRoomId]);

  // keep scroll at bottom when open + new messages
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [rows, open]);

  async function send() {
    const msg = text.trim();
    if (!msg) return;

    if (!authUser) {
      setErr("Please sign in to chat.");
      return;
    }

    setSending(true);
    setErr(null);

    try {
      const { error } = await supabase.from("room_chat_messages").insert({
        room_id: safeRoomId,
        user_id: authUser.id,
        user_email: authUser.email ?? null,
        message: msg,
      });

      if (error) throw error;

      setText("");
      // realtime insert will append the message
    } catch (e: any) {
      setErr(String(e?.message || e || "Failed to send"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mb-chatCard">
      <div className="mb-chatTop">
        <button
          type="button"
          className="mb-chatToggle"
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
          title="Community Chat"
        >
          💬 Community Chat {open ? "▾" : "▸"}
        </button>

        {authUser ? (
          <span className="mb-chatWho" title={String(authUser.email || "")}>
            signed in as <b>{shortEmail(String(authUser.email || ""))}</b>
          </span>
        ) : (
          <a className="mb-chatWho" href="/signin">
            sign in to chat
          </a>
        )}
      </div>

      {open ? (
        <>
          <div ref={listRef} className="mb-chatList" aria-label="Chat messages">
            {loading ? <div className="mb-chatHint">Loading…</div> : null}
            {!loading && rows.length === 0 ? (
              <div className="mb-chatHint">No messages yet. Say hi 👋</div>
            ) : null}

            {rows.map((r) => (
              <div key={r.id} className="mb-chatMsg">
                <div className="mb-chatMeta">
                  <span className="mb-chatUser">{shortEmail(String(r.user_email || "anon"))}</span>
                  <span className="mb-chatTime">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
                  </span>
                </div>
                <div className="mb-chatBody">{r.message}</div>
              </div>
            ))}
          </div>

          <div className="mb-chatInputRow">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={authUser ? "Write a message…" : "Sign in to chat…"}
              disabled={disabled || sending || !authUser}
            />
            <button
              type="button"
              onClick={send}
              disabled={disabled || sending || !authUser || !text.trim()}
              title={authUser ? "Send" : "Sign in to send"}
            >
              ➤
            </button>
          </div>

          {err ? <div className="mb-chatErr">⚠ {err}</div> : null}
        </>
      ) : null}
    </div>
  );
}
