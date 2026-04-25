/**
 * ConversationThread — multi-turn Mercy chat surface.
 *
 * Loads the messages of an active conversation, streams them top-to-bottom,
 * appends new turns through conversationClient. The composer is sticky at
 * the bottom. A confirm-gated "Clear conversation" button hard-deletes the
 * thread (and cascades the messages) via conversationClient.deleteConversation.
 *
 * Each message has a per-message VN/EN toggle. Default render is bilingual
 * (EN above, VN below) — toggling collapses to the side the user clicked.
 *
 * Note on streaming: askMercyApi (the existing wrapper) returns the full
 * answer in one round-trip via supabase.functions.invoke. The ai-chat
 * edge function does support SSE streaming but it requires a direct fetch
 * to /functions/v1/ai-chat with auth headers. For Mercy v2 we keep the
 * existing wrapper to avoid coupling to a second auth path; the visible
 * "thinking…" indicator covers the latency. Token-level streaming is a
 * follow-up — the indicator hook is here so the wiring is one-line later.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { askMercyApi } from "@/components/mercy-guide/api/askMercyApi";
import {
  appendMessage,
  deleteConversation,
  getMessagesForConversation,
  type MercyMessage,
} from "@/lib/mercy/conversationClient";
import {
  getAssistantVietnamese,
  splitBilingualAnswer,
} from "@/components/mercy-guide/shared";

type ViewLang = "both" | "en" | "vi";

export type ConversationThreadProps = {
  conversationId: string | null;
  /** Called after the thread is hard-deleted so the parent can clear selection. */
  onCleared?: () => void;
};

const wrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 480,
};

const scrollerStyle: React.CSSProperties = {
  flex: "1 1 auto",
  overflowY: "auto",
  padding: "16px 16px 8px",
};

const composerStyle: React.CSSProperties = {
  flex: "0 0 auto",
  borderTop: "1px solid rgba(0,0,0,0.08)",
  padding: 12,
  background: "white",
  position: "sticky",
  bottom: 0,
};

const messageRowStyle = (role: "user" | "mercy"): React.CSSProperties => ({
  display: "flex",
  justifyContent: role === "user" ? "flex-end" : "flex-start",
  marginBottom: 12,
});

const bubbleStyle = (role: "user" | "mercy"): React.CSSProperties => ({
  maxWidth: "80%",
  padding: "10px 14px",
  borderRadius: 14,
  background: role === "user" ? "#fef3c7" : "#f1f5f9",
  color: "#0f172a",
  fontSize: 14,
  lineHeight: 1.5,
  border: role === "user" ? "1px solid #fde68a" : "1px solid #e2e8f0",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
});

const langToggleStyle: React.CSSProperties = {
  display: "inline-flex",
  gap: 4,
  marginTop: 8,
  fontSize: 11,
  color: "rgba(0,0,0,0.55)",
};

const viCopyStyle: React.CSSProperties = {
  display: "block",
  marginTop: 6,
  paddingTop: 6,
  borderTop: "1px dashed rgba(0,0,0,0.1)",
  color: "#475569",
  fontSize: 13,
};

const composerInputStyle: React.CSSProperties = {
  flex: 1,
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 9999,
  padding: "10px 14px",
  fontSize: 14,
  outline: "none",
};

const composerButtonStyle = (disabled: boolean): React.CSSProperties => ({
  borderRadius: 9999,
  padding: "10px 18px",
  fontWeight: 700,
  fontSize: 14,
  background: disabled ? "#cbd5e1" : "#0f172a",
  color: "white",
  border: "none",
  cursor: disabled ? "not-allowed" : "pointer",
});

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "8px 16px 0",
};

const clearButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 9999,
  padding: "4px 12px",
  fontSize: 12,
  color: "#475569",
  cursor: "pointer",
};

function MessageBubble({
  message,
  defaultLang,
}: {
  message: MercyMessage;
  defaultLang: ViewLang;
}) {
  const [lang, setLang] = useState<ViewLang>(defaultLang);
  const showEn = lang !== "vi";
  const showVi = lang !== "en" && Boolean(message.viTranslation);

  return (
    <div style={messageRowStyle(message.role)}>
      <div style={bubbleStyle(message.role)} data-testid={`message-${message.role}`}>
        {showEn ? <div>{message.content}</div> : null}
        {showVi ? (
          <div style={viCopyStyle} data-testid="message-vi">
            {message.viTranslation}
          </div>
        ) : null}
        {message.viTranslation ? (
          <div style={langToggleStyle} aria-label="Toggle language">
            <button
              type="button"
              onClick={() => setLang("both")}
              style={{ background: "none", border: "none", cursor: "pointer", color: lang === "both" ? "#0f172a" : "inherit", fontWeight: lang === "both" ? 700 : 400 }}
            >
              EN+VI
            </button>
            <span aria-hidden>·</span>
            <button
              type="button"
              onClick={() => setLang("en")}
              style={{ background: "none", border: "none", cursor: "pointer", color: lang === "en" ? "#0f172a" : "inherit", fontWeight: lang === "en" ? 700 : 400 }}
            >
              EN
            </button>
            <span aria-hidden>·</span>
            <button
              type="button"
              onClick={() => setLang("vi")}
              style={{ background: "none", border: "none", cursor: "pointer", color: lang === "vi" ? "#0f172a" : "inherit", fontWeight: lang === "vi" ? 700 : 400 }}
            >
              VI
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ConversationThread({ conversationId, onCleared }: ConversationThreadProps) {
  const [messages, setMessages] = useState<MercyMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Load history whenever the active conversation changes.
  useEffect(() => {
    let alive = true;
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);
    getMessagesForConversation(conversationId)
      .then((rows) => {
        if (!alive) return;
        setMessages(rows);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load conversation");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [conversationId]);

  // Auto-scroll to bottom on new message.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, pending]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || !conversationId || pending) return;

    setError(null);
    setInput("");
    setPending(true);

    try {
      const userTurn = await appendMessage(conversationId, "user", text);
      setMessages((prev) => [...prev, userTurn]);

      const { data, error: apiError } = await askMercyApi({
        input: text,
        mode: "general_guide",
      });
      if (apiError || !data?.ok || !data?.answer) {
        throw new Error(apiError?.message || data?.error || "Mercy could not respond.");
      }

      const split = splitBilingualAnswer(data.answer);
      const en = split.en || data.answer;
      const vi = getAssistantVietnamese(data, data.answer) || split.vi || undefined;

      const mercyTurn = await appendMessage(conversationId, "mercy", en, vi);
      setMessages((prev) => [...prev, mercyTurn]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }, [conversationId, input, pending]);

  const handleClear = useCallback(async () => {
    if (!conversationId) return;
    const ok = window.confirm(
      "Clear this conversation? This permanently deletes every message in it.",
    );
    if (!ok) return;
    try {
      await deleteConversation(conversationId);
      setMessages([]);
      onCleared?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear conversation.");
    }
  }, [conversationId, onCleared]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  const placeholder = useMemo(
    () =>
      conversationId
        ? "Hỏi Mercy bất kỳ điều gì… (Ask Mercy anything…)"
        : "Pick a conversation or start a new one to begin.",
    [conversationId],
  );

  return (
    <div style={wrapStyle} data-testid="conversation-thread">
      {conversationId ? (
        <div style={toolbarStyle}>
          <button
            type="button"
            onClick={handleClear}
            style={clearButtonStyle}
            data-testid="clear-conversation"
          >
            Clear conversation · Xóa
          </button>
        </div>
      ) : null}

      <div ref={scrollerRef} style={scrollerStyle} data-testid="thread-scroller">
        {loading ? (
          <div style={{ color: "#64748b", fontSize: 13 }}>Loading…</div>
        ) : null}

        {!loading && messages.length === 0 && conversationId ? (
          <div style={{ color: "#64748b", fontSize: 13 }}>
            New conversation. Say hi to Mercy below.
          </div>
        ) : null}

        {!conversationId ? (
          <div style={{ color: "#64748b", fontSize: 13 }}>
            Select a conversation from the list, or start a new one.
          </div>
        ) : null}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} defaultLang="both" />
        ))}

        {pending ? (
          <div style={messageRowStyle("mercy")}>
            <div style={{ ...bubbleStyle("mercy"), fontStyle: "italic", color: "#64748b" }}>
              Mercy đang suy nghĩ… (thinking…)
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              borderRadius: 8,
              background: "#fef2f2",
              color: "#991b1b",
              fontSize: 13,
            }}
            role="alert"
          >
            {error}
          </div>
        ) : null}
      </div>

      <div style={composerStyle}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={!conversationId || pending}
            style={composerInputStyle}
            data-testid="thread-composer"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!conversationId || pending || !input.trim()}
            style={composerButtonStyle(!conversationId || pending || !input.trim())}
            data-testid="thread-send"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConversationThread;
