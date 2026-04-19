// src/components/FeedbackBar.tsx

import { useState } from "react";
import { Send, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export function FeedbackBar() {
  const [open, setOpen]       = useState(false);
  const [text, setText]       = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("feedback").insert({
        user_id: user?.id ?? null,
        message: trimmed,
        status: "new",
        priority: "normal",
        category: "general",
      });
      setText("");
      setSent(true);
      setTimeout(() => { setSent(false); setOpen(false); }, 2000);
    } catch { /* silent */ } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) void handleSubmit();
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <>
      {/* Floating pill button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open feedback"
        style={{
          height: 34,
          padding: "0 14px",
          borderRadius: 9999,
          border: "1px solid rgba(0,0,0,0.10)",
          background: "rgba(255,255,255,0.90)",
          backdropFilter: "blur(8px)",
          color: "rgba(0,0,0,0.58)",
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          whiteSpace: "nowrap",
        }}
      >
        💬 Feedback / Ý kiến
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000001,
            background: "rgba(0,0,0,0.30)",
            backdropFilter: "blur(3px)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: "0 16px 24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 480,
              borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.98)",
              boxShadow: "0 20px 48px rgba(0,0,0,0.18)",
              padding: "18px 16px 16px",
              display: "flex", flexDirection: "column", gap: 12,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "rgba(0,0,0,0.80)" }}>
                💬 Feedback / Ý kiến
              </div>
              <button type="button" onClick={() => setOpen(false)}
                style={{ width: 30, height: 30, borderRadius: 9999, border: "1px solid rgba(0,0,0,0.08)", background: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(0,0,0,0.50)" }}>
                <X size={14} />
              </button>
            </div>

            {/* Textarea + send */}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts... / Chia sẻ ý kiến..."
                rows={3}
                maxLength={1000}
                disabled={sending || sent}
                autoFocus
                style={{
                  flex: 1, padding: "10px 12px", borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.10)", outline: "none",
                  fontSize: 14, resize: "none", fontFamily: "inherit",
                  background: "rgba(252,252,251,0.98)", color: "rgba(0,0,0,0.82)",
                  lineHeight: 1.55,
                }}
              />
              <button type="button" onClick={() => void handleSubmit()}
                disabled={!text.trim() || sending || sent}
                style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  border: sent ? "1px solid rgba(180,83,105,0.20)" : "1px solid rgba(0,128,120,0.18)",
                  background: sent ? "rgba(180,83,105,0.09)" : "rgba(0,128,120,0.09)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  cursor: text.trim() && !sending && !sent ? "pointer" : "default",
                  color: "rgba(0,0,0,0.65)",
                  opacity: !text.trim() || sending ? 0.45 : 1,
                }}>
                <Send size={16} />
              </button>
            </div>

            {sent ? (
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(131,24,67,0.84)" }}>
                🌹 Thank you! / Cảm ơn bạn!
              </div>
            ) : (
              <div style={{ fontSize: 11, color: "rgba(0,0,0,0.36)" }}>Ctrl+Enter to send</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FeedbackBar;
