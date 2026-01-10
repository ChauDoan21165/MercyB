// FILE: MercyAIHost.tsx
// PATH: src/components/guide/MercyAIHost.tsx
// VERSION: MB-BLUE-101.7d — 2026-01-10 (+0700)
// NOTE: FIX — timer clear was truthy-check bug; stabilize callbacks (lint-safe); keep behavior identical.
//       KEEP: big face (~3x), REAL typing, rule-based chat, assistant typing dots.
//       KEEP: closed state does NOT block page clicks (no fullscreen overlay when closed).

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TalkingFaceIcon from "@/components/guide/TalkingFaceIcon";

type QuickAction = {
  id: string;
  label: string;
  description?: string;
  onClick: () => void;
};

type PanelMode = "home" | "email" | "billing" | "about";

type HostContext = {
  roomId?: string;
  entryId?: string;
  keyword?: string;
};

type ChatMsg = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

function isTruthyString(v: string | null | undefined) {
  return (v ?? "").trim().toLowerCase() === "true";
}

function safeGetLS(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLS(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function uid(prefix = "m") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

/**
 * Typing dots (bulletproof)
 * - No <style>
 * - No CSS keyframes
 * - SVG animate only
 */
function TypingIndicator() {
  return (
    <svg
      width="28"
      height="10"
      viewBox="0 0 28 10"
      role="img"
      aria-label="Typing"
      style={{ display: "block" }}
    >
      <circle cx="6" cy="5" r="2" fill="rgba(0,0,0,0.55)">
        <animate
          attributeName="opacity"
          values="0.25;0.9;0.25"
          dur="1s"
          repeatCount="indefinite"
          begin="0s"
        />
      </circle>
      <circle cx="14" cy="5" r="2" fill="rgba(0,0,0,0.55)">
        <animate
          attributeName="opacity"
          values="0.25;0.9;0.25"
          dur="1s"
          repeatCount="indefinite"
          begin="0.15s"
        />
      </circle>
      <circle cx="22" cy="5" r="2" fill="rgba(0,0,0,0.55)">
        <animate
          attributeName="opacity"
          values="0.25;0.9;0.25"
          dur="1s"
          repeatCount="indefinite"
          begin="0.3s"
        />
      </circle>
    </svg>
  );
}

function clampText(s: string, max = 1200) {
  const t = (s ?? "").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

function containsAny(hay: string, needles: string[]) {
  const h = hay.toLowerCase();
  return needles.some((n) => h.includes(n));
}

export default function MercyAIHost() {
  const [open, setOpen] = useState(false);

  // mode = destination (header subtitle)
  const [mode, setMode] = useState<PanelMode>("home");

  const [mounted, setMounted] = useState(false);
  const [ctx, setCtx] = useState<HostContext>({});

  // Typing state (assistant typing)
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  // Chat
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ roomId?: string }>();

  const isSignin = location.pathname.startsWith("/signin");
  const isAdmin = location.pathname.startsWith("/admin");
  const isRoom = location.pathname.startsWith("/room/");
  const roomIdFromUrl = params.roomId;

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearTypingTimer = useCallback(() => {
    // IMPORTANT: timer id can be 0 in some environments — check against null, not truthy.
    if (typingTimerRef.current !== null) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearTypingTimer();
  }, [clearTypingTimer]);

  // Keep ctx via window event
  useEffect(() => {
    if (isAdmin) return;

    const onCtx = (e: Event) => {
      const ce = e as CustomEvent<HostContext>;
      if (!ce.detail) return;
      setCtx((prev) => ({ ...prev, ...ce.detail }));
    };
    window.addEventListener("mb:host-context", onCtx as EventListener);
    return () => {
      window.removeEventListener("mb:host-context", onCtx as EventListener);
    };
  }, [isAdmin]);

  // Keep ctx.roomId aligned with route
  useEffect(() => {
    if (isAdmin) return;
    if (!isRoom) return;
    if (!roomIdFromUrl) return;
    setCtx((prev) => ({ ...prev, roomId: roomIdFromUrl }));
  }, [isAdmin, isRoom, roomIdFromUrl]);

  const pageHint = useMemo(() => {
    const p = location.pathname || "/";
    if (p.startsWith("/signin")) return "Login help";
    if (p.startsWith("/room/")) return "Room help";
    return "Help";
  }, [location.pathname]);

  const headerSubtitle = useMemo(() => {
    switch (mode) {
      case "email":
        return "Email help";
      case "billing":
        return "Subscription help";
      case "about":
        return "About";
      default:
        return pageHint;
    }
  }, [mode, pageHint]);

  const contextLine = useMemo(() => {
    const rid = ctx.roomId ?? roomIdFromUrl;
    const parts: string[] = [];
    if (rid) parts.push(rid);
    if (ctx.entryId) parts.push(`entry:${ctx.entryId}`);
    if (ctx.keyword) parts.push(`kw:${ctx.keyword}`);
    return parts.length ? parts.join(" • ") : null;
  }, [ctx.roomId, ctx.entryId, ctx.keyword, roomIdFromUrl]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    if (!open) return;
    const t = window.setTimeout(() => {
      scrollToBottom();
      inputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [isAdmin, open, scrollToBottom]);

  useEffect(() => {
    if (isAdmin) return;
    if (!open) return;
    scrollToBottom();
  }, [isAdmin, messages, open, scrollToBottom]);

  const addMsg = useCallback((role: ChatMsg["role"], text: string) => {
    const clean = clampText(text);
    if (!clean) return;
    setMessages((prev) => [
      ...prev,
      { id: uid(role === "user" ? "u" : "a"), role, text: clean },
    ]);
  }, []);

  const baseAssistantHome = useMemo(() => {
    return `Hi. I’m Mercy Host.
Tell me what you need right now (login, email, VIP, or a room problem).`;
  }, []);

  const seedIfEmpty = useCallback(
    (nextMode: PanelMode) => {
      setMessages((prev) => {
        if (prev.length) return prev;
        const first =
          nextMode === "home"
            ? baseAssistantHome
            : `Hi. Ask me anything about ${nextMode}.`;
        return [{ id: uid("a"), role: "assistant", text: first }];
      });
    },
    [baseAssistantHome]
  );

  const makeReply = useCallback(
    (userTextRaw: string, currentMode: PanelMode) => {
      const userText = userTextRaw.toLowerCase();
      const rid = ctx.roomId ?? roomIdFromUrl;

      if (
        currentMode === "email" ||
        containsAny(userText, ["email", "mail", "reset", "verify", "verification", "spam"])
      ) {
        return `Email help:
• Check spam/junk and search “Mercy”
• Wait 2–5 minutes (providers can delay)
• If you used domain email: confirm your mailbox really receives mail
Tell me: is this password reset, verification, or receipt?`;
      }

      if (
        currentMode === "billing" ||
        containsAny(userText, ["vip", "pay", "payment", "stripe", "subscribe", "subscription", "receipt"])
      ) {
        return `VIP / billing:
• After payment, VIP should activate automatically
• If it doesn’t: sign out → sign in once, then check Tier/VIP page
Tell me: which tier (VIP1/VIP3/VIP9) and what you see now?`;
      }

      if (currentMode === "about" || containsAny(userText, ["how", "works", "what is", "about", "guide"])) {
        return `Mercy Blade:
• Rooms = short bilingual learning + audio
• This Host is for navigation + help (AI later behind one button)
If you tell me what page you’re on, I’ll point the next step.`;
      }

      if (
        containsAny(userText, ["login", "signin", "sign in", "otp", "phone", "password", "google", "facebook"])
      ) {
        return `Login help:
• Email/password: use Forgot password if needed
• Phone OTP: confirm country code + try again
• Google/Facebook: must be enabled in Supabase Auth
What method are you using (email / phone / Google / Facebook)?`;
      }

      if (
        rid &&
        containsAny(userText, ["room", "audio", "sound", "play", "cannot hear", "can't hear", "progress"])
      ) {
        return `Room help (${rid}):
• Try reloading once
• If audio doesn’t play: check if the entry actually has audio attached
Tell me the exact room + which entry line is failing (or send the roomId).`;
      }

      return `Got it. Tell me one detail:
• What page are you on? (${location.pathname})
• What did you click?
• What did you expect vs what happened?`;
    },
    [ctx.roomId, roomIdFromUrl, location.pathname]
  );

  const assistantRespond = useCallback(
    (userText: string, currentMode: PanelMode) => {
      clearTypingTimer();
      setIsTyping(true);

      typingTimerRef.current = window.setTimeout(() => {
        setIsTyping(false);
        typingTimerRef.current = null;
        addMsg("assistant", makeReply(userText, currentMode));
      }, 650);
    },
    [addMsg, clearTypingTimer, makeReply]
  );

  const transitionToMode = useCallback(
    (nextMode: PanelMode) => {
      setMode(nextMode);
      seedIfEmpty(nextMode);
      clearTypingTimer();
      setIsTyping(true);

      typingTimerRef.current = window.setTimeout(() => {
        setIsTyping(false);
        typingTimerRef.current = null;

        if (nextMode === "email")
          addMsg("assistant", "Okay — email not arriving. What type (verification / reset / receipt)?");
        else if (nextMode === "billing")
          addMsg("assistant", "Okay — billing/VIP. Which tier and what’s wrong?");
        else if (nextMode === "about")
          addMsg("assistant", "Okay — here’s how Mercy Blade works. What are you trying to do?");
        else addMsg("assistant", baseAssistantHome);
      }, 500);
    },
    [addMsg, baseAssistantHome, clearTypingTimer, seedIfEmpty]
  );

  const openPanel = useCallback(() => {
    setOpen(true);
    seedIfEmpty(mode);
    clearTypingTimer();
    setIsTyping(true);
    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
      typingTimerRef.current = null;
      inputRef.current?.focus();
    }, 250);
  }, [clearTypingTimer, mode, seedIfEmpty]);

  const closePanel = useCallback(() => {
    setOpen(false);
    setIsTyping(false);
    clearTypingTimer();
  }, [clearTypingTimer]);

  // Auto-open on /signin — ONCE per browser
  useEffect(() => {
    if (isAdmin) return;
    if (!isSignin) return;

    const k = "mb_ai_host_autopened_signin_once";
    if (isTruthyString(safeGetLS(k))) return;

    safeSetLS(k, "true");
    setOpen(true);
    setMode("home");
    seedIfEmpty("home");
    clearTypingTimer();
    setIsTyping(true);
    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
      typingTimerRef.current = null;
    }, 450);
  }, [isAdmin, isSignin, clearTypingTimer, seedIfEmpty]);

  // ESC to close
  useEffect(() => {
    if (isAdmin) return;
    if (!open) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAdmin, open, closePanel]);

  const actions: QuickAction[] = useMemo(
    () => [
      {
        id: "login",
        label: "Login help",
        description: "Email, phone OTP, Google/Facebook issues",
        onClick: () => {
          closePanel();
          navigate("/signin");
        },
      },
      {
        id: "email",
        label: "Email not arriving",
        description: "Password reset / verification email tips",
        onClick: () => transitionToMode("email"),
      },
      {
        id: "billing",
        label: "Subscription",
        description: "VIP access & payment questions",
        onClick: () => transitionToMode("billing"),
      },
      {
        id: "about",
        label: "How Mercy Blade works",
        description: "Quick explanation & navigation",
        onClick: () => transitionToMode("about"),
      },
    ],
    [closePanel, navigate, transitionToMode]
  );

  const onSend = useCallback(() => {
    const text = clampText(draft);
    if (!text) return;
    setDraft("");
    seedIfEmpty(mode);
    addMsg("user", text);
    assistantRespond(text, mode);
  }, [addMsg, assistantRespond, draft, mode, seedIfEmpty]);

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  // Dev observability
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g: any = globalThis as any;
    g.__MB_HOST_STATE__ = {
      open,
      mode,
      page: location.pathname,
      roomId: ctx.roomId ?? roomIdFromUrl,
      ctx,
      isTyping,
      messagesCount: messages.length,
      isAdmin,
    };
  }, [open, mode, location.pathname, ctx, roomIdFromUrl, isTyping, messages.length, isAdmin]);

  if (!mounted || typeof document === "undefined" || !document.body) return null;

  // ✅ IMPORTANT: hide UI on admin AFTER hooks (no early return before hooks)
  if (isAdmin) return null;

  const fontStack =
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';

  // ✅ closed state must not cover the screen (so OAuth buttons work)
  const ui = open ? (
    <div
      data-mb-host="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        fontFamily: fontStack,
      }}
    >
      {/* Backdrop (click to close) */}
      <div
        onMouseDown={closePanel}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "transparent",
        }}
      />

      {/* Dock */}
      <div style={{ position: "fixed", right: 24, bottom: 24 }}>
        <div
          role="dialog"
          aria-modal="false"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 460,
            maxWidth: "92vw",
            maxHeight: "calc(100vh - 140px)",
            borderRadius: 18,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.10)",
            boxShadow: "0 18px 55px rgba(0,0,0,0.22)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(0,0,0,0.10)",
              background: "#fff",
              flex: "0 0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                }}
                aria-hidden="true"
              >
                <TalkingFaceIcon size={44} isTalking={isTyping} />
              </div>

              <div style={{ lineHeight: 1.15, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Mercy Host</div>

                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(0,0,0,0.60)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 310,
                  }}
                  title={contextLine ?? headerSubtitle}
                >
                  {contextLine ?? headerSubtitle}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={closePanel}
              aria-label="Close"
              style={{
                border: "1px solid rgba(0,0,0,0.10)",
                background: "#fff",
                borderRadius: 999,
                width: 36,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(0,0,0,0.60)",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div
            ref={scrollRef}
            style={{
              padding: "12px 16px",
              overflow: "auto",
              background: "#fff",
              flex: "1 1 auto",
              minHeight: 0,
            }}
          >
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    marginTop: 10,
                  }}
                >
                  <div
                    style={{
                      borderRadius: 16,
                      maxWidth: "86%",
                      background: isUser ? "#111" : "rgba(0,0,0,0.06)",
                      color: isUser ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.82)",
                      padding: "10px 12px",
                      fontSize: 12,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {isTyping ? (
              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 10 }}>
                <div
                  style={{
                    borderRadius: 16,
                    maxWidth: "86%",
                    background: "rgba(0,0,0,0.06)",
                    padding: "10px 12px",
                    minHeight: 36,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <TypingIndicator />
                </div>
              </div>
            ) : null}

            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {actions.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={a.onClick}
                  title={a.description}
                  style={{
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "#fff",
                    padding: "6px 10px",
                    fontSize: 12,
                    color: "rgba(0,0,0,0.82)",
                    cursor: "pointer",
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: 14,
                borderRadius: 14,
                background: "rgba(0,0,0,0.06)",
                padding: 12,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.70)" }}>Note</div>
              <div style={{ fontSize: 11, color: "rgba(0,0,0,0.60)", marginTop: 6 }}>
                This is a rule-based helper (no AI calls yet). Later we’ll add one{" "}
                <span style={{ fontWeight: 700 }}>Ask teacher GPT</span> button behind a single gateway.
              </div>
            </div>
          </div>

          {/* Input bar (REAL typing) */}
          <div
            style={{
              borderTop: "1px solid rgba(0,0,0,0.10)",
              background: "#fff",
              padding: "10px 12px",
              flex: "0 0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#fff",
                padding: "10px 12px",
              }}
            >
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Type here… (Enter to send, Shift+Enter newline)"
                rows={1}
                style={{
                  width: "100%",
                  resize: "none",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 12,
                  color: "rgba(0,0,0,0.85)",
                  lineHeight: "18px",
                  maxHeight: 90,
                  overflow: "auto",
                }}
              />
              <button
                type="button"
                onClick={onSend}
                disabled={!draft.trim()}
                style={{
                  borderRadius: 12,
                  background: !draft.trim() ? "rgba(0,0,0,0.18)" : "#111",
                  color: "#fff",
                  fontSize: 11,
                  padding: "8px 12px",
                  border: "none",
                  cursor: !draft.trim() ? "default" : "pointer",
                  flex: "0 0 auto",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      data-mb-host="true"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 2147483000,
        fontFamily: fontStack,
      }}
    >
      <button
        type="button"
        onClick={openPanel}
        aria-label="Open Mercy Host"
        title="Mercy Host"
        style={{
          width: 96,
          height: 96,
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "#fff",
          boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <TalkingFaceIcon size={78} isTalking={false} />
      </button>
    </div>
  );

  return createPortal(ui, document.body);
}

/* teacher GPT — new thing to learn (2 lines):
   Don’t clear timers with “if (id)” — use “id !== null”, because 0 can be a valid id in some runtimes.
   Stable callbacks (useCallback) prevent hook deps and event listeners from getting weird. */
