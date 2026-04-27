// Floating multi-channel support button.
//
// Vietnamese learners reach support through Zalo and Facebook
// Messenger, not email. ELSA's email-only support is a real
// differentiator MercyBlade can flip cheaply: human touch wins.
//
// Behaviour:
//   - Bottom-right fixed button on every non-admin page EXCEPT:
//       * Home ("/") — protect the magic moment
//       * Support ("/support") — redundant; the page already lists channels
//   - Click reveals a popover with three channels (Zalo, Messenger, Email).
//   - Each channel opens in a new tab/native app via plain anchors.
//
// Recording suppression (out of scope this PR): the speech tabs render
// inside the Mercy panel, which is a fixed overlay covering the bottom
// of the screen. It already obscures this button visually. A future PR
// can wire `document.body.dataset.recording` if a stronger gate is needed.

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Mail, MessageCircle, MessageSquare, Send, X } from "lucide-react";

import { SUPPORT_CHANNELS } from "@/config/product";

const SUPPRESSED_PATHS = new Set<string>(["/", "/support"]);

export default function ChatSupportButton() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (SUPPRESSED_PATHS.has(location.pathname)) return null;

  return (
    <>
      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Support channels"
          style={{
            position: "fixed",
            right: 16,
            bottom: 80,
            zIndex: 90,
            width: "min(320px, calc(100vw - 32px))",
            background: "white",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.10)",
            boxShadow: "0 18px 42px rgba(0,0,0,0.16)",
            padding: "14px 14px 10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "rgba(15,23,42,0.92)" }}>
                Nhắn tin với Mercy
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(67,56,202,0.70)" }}>
                Chat with us
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng / Close"
              style={{
                width: 28, height: 28, borderRadius: 9999,
                border: "none", background: "rgba(0,0,0,0.06)",
                color: "rgba(0,0,0,0.55)", cursor: "pointer",
                display: "grid", placeItems: "center",
              }}
            >
              <X size={14} aria-hidden />
            </button>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>
              <a href={SUPPORT_CHANNELS.zalo_url} target="_blank" rel="noopener noreferrer" style={channelLink("#0068FF")}>
                <span style={iconWrap("#0068FF")}>
                  <MessageSquare size={18} color="white" aria-hidden />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={channelLabelEn}>Zalo</span>
                  <span style={channelLabelVi}>Nhắn nhanh nhất · Fastest reply</span>
                </span>
                <Send size={14} style={{ color: "rgba(0,0,0,0.35)", flexShrink: 0 }} aria-hidden />
              </a>
            </li>
            <li>
              <a href={SUPPORT_CHANNELS.messenger_url} target="_blank" rel="noopener noreferrer" style={channelLink("#0084FF")}>
                <span style={iconWrap("#0084FF")}>
                  <MessageCircle size={18} color="white" aria-hidden />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={channelLabelEn}>Facebook Messenger</span>
                  <span style={channelLabelVi}>Nhắn qua Messenger · Chat on Messenger</span>
                </span>
                <Send size={14} style={{ color: "rgba(0,0,0,0.35)", flexShrink: 0 }} aria-hidden />
              </a>
            </li>
            <li>
              <a href={`mailto:${SUPPORT_CHANNELS.email}`} style={channelLink("#7C3AED")}>
                <span style={iconWrap("#7C3AED")}>
                  <Mail size={18} color="white" aria-hidden />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={channelLabelEn}>{SUPPORT_CHANNELS.email}</span>
                  <span style={channelLabelVi}>Gửi email · Send email</span>
                </span>
                <Send size={14} style={{ color: "rgba(0,0,0,0.35)", flexShrink: 0 }} aria-hidden />
              </a>
            </li>
          </ul>

          <div style={{ marginTop: 10, fontSize: 11, color: "rgba(0,0,0,0.45)", textAlign: "center" }}>
            Đội nhỏ, đọc mọi tin nhắn. · Small team, reads every message.
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Đóng / Close support" : "Mở / Open support"}
        aria-expanded={open}
        style={{
          position: "fixed",
          right: 16,
          bottom: `calc(16px + env(safe-area-inset-bottom, 0px))`,
          zIndex: 91,
          width: 56,
          height: 56,
          borderRadius: 9999,
          border: "none",
          background: "linear-gradient(150deg, #6366F1 0%, #4F46E5 100%)",
          color: "white",
          boxShadow: "0 12px 28px rgba(79,70,229,0.32)",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
      >
        {open ? <X size={22} aria-hidden /> : <MessageCircle size={24} aria-hidden />}
      </button>
    </>
  );
}

const channelLabelEn: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 800,
  color: "rgba(15,23,42,0.92)",
};

const channelLabelVi: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(0,0,0,0.55)",
  marginTop: 1,
};

function channelLink(_accent: string): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(0,0,0,0.02)",
    textDecoration: "none",
    color: "inherit",
  };
}

function iconWrap(bg: string): React.CSSProperties {
  return {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: bg,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  };
}
