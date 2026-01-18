// src/components/community/RoomCommunityChat.tsx
// MB-BLUE-101.COMMUNITY-CHAT — 2026-01-14 (+0700)
//
// RoomCommunityChat (UI + DB):
// - Room-scoped community chat (user ↔ user)
// - DO NOT replace BOX 5 feedback (admin channel). Keep separate.
// - Simple fetch + send. (Realtime can be added later.)

import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Msg = {
  id: string;
  room_id: string;
  user_id: string | null;
  user_email: string | null;
  content: string;
  created_at: string;
};

function shortEmail(email?: string | null) {
  const e = String(email || "").trim();
  if (!e) return "Someone";
  const [name, domain] = e.split("@");
  if (!domain) return e;
  const head = name.length <= 3 ? name : `${name.slice(0, 3)}…`;
  return `${head}@${domain}`.toUpperCase();
}

export default function RoomCommunityChat({
  roomId,
  className = "",
}: {
  roomId: string;
  className?: string;
}) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);

  const safeRoomId = useMemo(() => String(roomId || "").trim(), [roomId]);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  async function load() {
    if (!safeRoomId) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("room_messages")
        .select("id, room_id, user_id, user_email, content, created_at")
        .eq("room_id", safeRoomId)
        .order("created_at", { ascending: true })
        .limit(80);

      if (error) throw error;
      setMessages(Array.isArray(data) ? (data as Msg[]) : []);
      // scroll after paint
      setTimeout(scrollToBottom, 0);
    } catch (e: any) {
      setError(String(e?.message || e || "Failed to load chat"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMessages([]);
    setText("");
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeRoomId]);

  async function send() {
    const content = text.trim();
    if (!content || !safeRoomId) return;

    setSending(true);
    setError(null);

    try {
      const { data: userRes } = await supabase.auth.getUser();
      const u = userRes?.user ?? null;

      const { error } = await supabase.from("room_messages").insert({
        room_id: safeRoomId,
        user_id: u?.id ?? null,
        user_email: u?.email ?? null,
        content,
      });

      if (error) throw error;

      setText("");
      await load();
    } catch (e: any) {
      setError(String(e?.message || e || "Failed to send"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div data-mb-community-chat className={`w-full ${className}`}>
      <style>{`
        [data-mb-community-chat] .mb-chatShell{
          border:1px solid rgba(0,0,0,0.10);
          background:rgba(255,255,255,0.92);
          backdrop-filter:blur(10px);
          border-radius:20px;
          box-shadow:0 14px 40px rgba(0,0,0,0.08);
          overflow:hidden;
        }
        [data-mb-community-chat] .mb-chatHead{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding:10px 12px;
          border-bottom:1px solid rgba(0,0,0,0.08);
        }
        [data-mb-community-chat] .mb-chatTitle{
          font-weight:950;
          font-size:13px;
          letter-spacing:0.02em;
          text-transform:uppercase;
          opacity:0.85;
        }
        [data-mb-community-chat] .mb-chatBtns{
          display:flex;
          gap:8px;
          align-items:center;
        }
        [data-mb-community-chat] .mb-miniBtn{
          height:30px;
          padding:0 10px;
          border-radius:999px;
          border:1px solid rgba(0,0,0,0.14);
          background:rgba(255,255,255,0.92);
          font-size:12px;
          font-weight:900;
        }

        [data-mb-community-chat] .mb-chatBody{
          padding:10px 12px;
        }
        [data-mb-community-chat] .mb-list{
          height:140px;
          overflow:auto;
          border-radius:14px;
          border:1px solid rgba(0,0,0,0.10);
          background:rgba(255,255,255,0.70);
          padding:8px;
        }
        [data-mb-community-chat] .mb-msg{
          display:flex;
          gap:8px;
          padding:6px 6px;
          border-radius:12px;
        }
        [data-mb-community-chat] .mb-msg + .mb-msg{
          margin-top:2px;
        }
        [data-mb-community-chat] .mb-who{
          flex:0 0 auto;
          font-size:11px;
          font-weight:900;
          opacity:0.65;
          max-width:110px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        [data-mb-community-chat] .mb-text{
          flex:1 1 auto;
          font-size:13px;
          line-height:1.35;
          word-break:break-word;
          opacity:0.92;
        }

        [data-mb-community-chat] .mb-compose{
          margin-top:10px;
          display:flex;
          gap:8px;
          align-items:flex-end;
        }
        [data-mb-community-chat] textarea{
          flex:1 1 auto;
          min-height:44px;
          max-height:92px;
          resize:vertical;
          border-radius:14px;
          border:1px solid rgba(0,0,0,0.12);
          padding:10px 10px;
          font-size:13px;
          background:rgba(255,255,255,0.88);
          outline:none;
        }
        [data-mb-community-chat] .mb-send{
          flex:0 0 auto;
          height:44px;
          width:52px;
          border-radius:16px;
          border:1px solid rgba(0,0,0,0.14);
          background:rgba(255,255,255,0.94);
          font-weight:900;
        }
        [data-mb-community-chat] .mb-error{
          margin-top:8px;
          font-size:12px;
          opacity:0.70;
        }
      `}</style>

      <div className="mb-chatShell">
        <div className="mb-chatHead">
          <div className="mb-chatTitle">Community chat</div>
          <div className="mb-chatBtns">
            <button type="button" className="mb-miniBtn" onClick={() => setOpen((v) => !v)}>
              {open ? "Hide" : "Show"}
            </button>
            <button type="button" className="mb-miniBtn" onClick={() => load()} disabled={loading}>
              ↻
            </button>
          </div>
        </div>

        {open ? (
          <div className="mb-chatBody">
            <div ref={listRef} className="mb-list" aria-label="Community messages">
              {loading ? (
                <div className="text-xs opacity-60 p-2">Loading…</div>
              ) : messages.length ? (
                messages.map((m) => (
                  <div key={m.id} className="mb-msg">
                    <div className="mb-who" title={m.user_email || ""}>
                      {shortEmail(m.user_email)}
                    </div>
                    <div className="mb-text">{m.content}</div>
                  </div>
                ))
              ) : (
                <div className="text-xs opacity-60 p-2">
                  No messages yet. Say hello 👋
                </div>
              )}
            </div>

            <div className="mb-compose">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a message… (room community)"
                onKeyDown={(e) => {
                  // Cmd/Ctrl+Enter to send
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <button
                type="button"
                className="mb-send"
                onClick={send}
                disabled={sending || !text.trim()}
                title="Send (Ctrl/Cmd+Enter)"
              >
                ➤
              </button>
            </div>

            {error ? <div className="mb-error">⚠ {error}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
