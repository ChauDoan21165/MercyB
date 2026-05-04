// src/components/FeedbackBar.tsx

import { useState } from "react";
import { Send, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export function FeedbackBar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen]       = useState(false);
  const [text, setText]       = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Anonymous users don't see the feedback button. RLS now requires
  // auth.uid() = user_id on insert; rendering for guests would only
  // produce silent failures.
  if (!user) return null;

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setErrorMsg(null);

    const { error } = await supabase.from("feedback").insert({
      user_id: user.id,
      message: trimmed,
      status: "new",
      priority: "normal",
      category: "general",
    });

    if (error) {
      if (import.meta.env.DEV) console.warn("[feedback] insert failed:", error);
      const friendly = "Có lỗi khi gửi báo cáo. Vui lòng thử lại.";
      setErrorMsg(friendly);
      toast({
        title: "Gửi không thành công",
        description: friendly,
        variant: "destructive",
      });
      setSending(false);
      return;
    }

    setText("");
    setSent(true);
    setSending(false);
    setTimeout(() => { setSent(false); setOpen(false); }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) void handleSubmit();
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <>
      {/* Floating pill button — owns its own fixed positioning so it
          floats correctly wherever this component is mounted.
          Bottom offset clears BottomMusicBar (36px tall, anchored at
          viewport bottom — see .mb-bar in audio/BottomMusicBar.tsx).
          36px bar height + 16px gap + iOS safe-area inset. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open feedback"
        style={{
          position: "fixed",
          left: 16,
          bottom: `calc(36px + 16px + env(safe-area-inset-bottom, 0px))`,
          zIndex: 9999,
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
            ) : errorMsg ? (
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(180,40,40,0.92)" }}>
                ⚠️ {errorMsg}
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
