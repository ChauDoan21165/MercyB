// FILE: MercyAIHost.tsx
// PATH: src/components/guide/MercyAIHost.tsx
// VERSION: MB-BLUE-102.4 — 2026-01-14 (+0700)
// PURPOSE:
// - Mercy Blade Guide Host (NO AI CALLS)
// - Real typing indicator (dots) + delayed feel
// - Host-like: calm, contextual, says ONE good line (or silence)
// - Bulletproof: typing triggers on ANY open
// - Auto-open once per session (NOT on /signin), unless hint dismissed
//
// NOTE:
// - Surgical patch: preserve structure; no big rewrites
// - Admin pages hidden; /signin stays clean

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import TalkingFaceIcon from "@/components/guide/TalkingFaceIcon";

type QuickAction = {
  id: string;
  label: string;
  description?: string;
  onClick: () => void;
};

type PanelMode = "home" | "email" | "billing" | "about";

type HostPage = "home" | "room" | "signin" | "other";
type HostMode =
  | "silent"
  | "welcome_home"
  | "room_pick_keyword"
  | "room_after_keyword"
  | "idle_nudge";

type HostState = {
  mode: HostMode;
  line?: string; // ONE line only
};

function isTruthyString(v: string | null | undefined) {
  return (v ?? "").trim().toLowerCase() === "true";
}

function TypingIndicator() {
  // Bulletproof typing dots: includes its own keyframes (no Tailwind animation dependency)
  return (
    <div className="mb-typing" aria-label="Typing">
      <style>{`
        .mb-typing{display:inline-flex;gap:6px;align-items:center}
        .mb-typing .dot{width:6px;height:6px;border-radius:9999px;background:rgba(0,0,0,.45);opacity:.35;animation:mbTyping 1s infinite ease-in-out}
        .mb-typing .dot:nth-child(2){animation-delay:.15s}
        .mb-typing .dot:nth-child(3){animation-delay:.30s}
        @keyframes mbTyping{
          0%,80%,100%{transform:translateY(0);opacity:.35}
          40%{transform:translateY(-3px);opacity:.85}
        }
      `}</style>
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  );
}

// Small idle detector (host-like nudge). No dependencies.
function useIdleFlag(ms = 12000) {
  const [isIdle, setIsIdle] = useState(false);
  useEffect(() => {
    let t: number | null = null;

    const bump = () => {
      setIsIdle(false);
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => setIsIdle(true), ms);
    };

    bump();

    window.addEventListener("mousemove", bump, { passive: true });
    window.addEventListener("keydown", bump);
    window.addEventListener("pointerdown", bump);
    window.addEventListener("scroll", bump, { passive: true });

    return () => {
      if (t) window.clearTimeout(t);
      window.removeEventListener("mousemove", bump);
      window.removeEventListener("keydown", bump);
      window.removeEventListener("pointerdown", bump);
      window.removeEventListener("scroll", bump);
    };
  }, [ms]);

  return isIdle;
}

function deriveHostState(args: {
  page: HostPage;
  hasKeyword: boolean;
  isIdle: boolean;
}): HostState {
  // Silence wins by default.
  if (args.page === "signin") return { mode: "silent" };

  // Contextual welcome guidance (ONE line).
  if (args.page === "home") {
    return {
      mode: "welcome_home",
      line: "Welcome. Explore freely — nothing auto-plays.",
    };
  }

  if (args.page === "room") {
    if (!args.hasKeyword) {
      return {
        mode: "room_pick_keyword",
        line: "Pick one idea. I’ll guide you step by step.",
      };
    }
    return {
      mode: "room_after_keyword",
      line: "Listen first. Meaning comes after.",
    };
  }

  if (args.isIdle) {
    return { mode: "idle_nudge", line: "Take your time. No rush." };
  }

  return { mode: "silent" };
}

export default function MercyAIHost() {
  const [open, setOpen] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [mode, setMode] = useState<PanelMode>("home");
  const [mounted, setMounted] = useState(false);

  // ✅ Typing UI
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<number | null>(null);
  const openedTypingOnceRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();

  const panelRef = useRef<HTMLDivElement | null>(null);

  const pathname = location.pathname || "/";
  const isSignin = pathname.startsWith("/signin");
  const isAdmin = pathname.startsWith("/admin");

  // Idle nudge (only matters when panel is open and we're in "home" mode)
  const isIdle = useIdleFlag(12000);

  // Keep admin UI clean
  if (isAdmin) return null;

  useEffect(() => {
    setMounted(true);
  }, []);

  // One-time hint dismissal
  useEffect(() => {
    try {
      const key = "mb_ai_host_hint_dismissed";
      const v = localStorage.getItem(key);
      if (isTruthyString(v)) setHintDismissed(true);
    } catch {
      // ignore
    }
  }, []);

  // Cleanup typing timer
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    };
  }, []);

  function startTyping(ms = 650) {
    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    setIsTyping(true);
    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
    }, ms);
  }

  function dismissHint() {
    setHintDismissed(true);
    try {
      localStorage.setItem("mb_ai_host_hint_dismissed", "true");
    } catch {
      // ignore
    }
  }

  function openPanel() {
    setMode("home");
    setOpen(true);
    startTyping(650);
  }

  function closePanel() {
    setOpen(false);
    setIsTyping(false);
    openedTypingOnceRef.current = false;
    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
  }

  // ✅ Auto-open ONCE per session (NOT on /signin), unless user dismissed hint.
  useEffect(() => {
    if (hintDismissed) return;
    if (isSignin) return;

    try {
      const k = "mb_ai_host_autopen_done";
      const done = sessionStorage.getItem(k);
      if (done === "true") return;

      // Only auto-open on meaningful pages: home or room.
      const should = pathname === "/" || pathname.startsWith("/room/");
      if (!should) return;

      sessionStorage.setItem(k, "true");
      setMode("home");
      setOpen(true);
    } catch {
      // If sessionStorage fails, do nothing (stay calm)
    }
  }, [hintDismissed, isSignin, pathname]);

  // ✅ BULLETPROOF: whenever panel opens, show typing once
  useEffect(() => {
    if (!open) return;
    if (openedTypingOnceRef.current) return;
    openedTypingOnceRef.current = true;
    startTyping(650);
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const el = panelRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) closePanel();
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const pageHint = useMemo(() => {
    if (pathname.startsWith("/signin")) return "Login help";
    if (pathname.startsWith("/room/")) return "Room help";
    return "Help";
  }, [pathname]);

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

  // Host context (lightweight, no dependencies)
  const hostPage: HostPage = useMemo(() => {
    if (pathname.startsWith("/signin")) return "signin";
    if (pathname === "/") return "home";
    if (pathname.startsWith("/room/")) return "room";
    return "other";
  }, [pathname]);

  // Best-effort "keyword chosen" signal (no big wiring):
  // - If URL has ?k=... or ?keyword=... treat as chosen.
  // - If later you pass real selectedKeyword state, we’ll replace this.
  const hasKeyword = useMemo(() => {
    try {
      const sp = new URLSearchParams(location.search || "");
      const k = (sp.get("k") || sp.get("keyword") || "").trim();
      return k.length > 0;
    } catch {
      return false;
    }
  }, [location.search]);

  const hostState = useMemo(() => {
    return deriveHostState({
      page: hostPage,
      hasKeyword,
      // Idle nudge only when panel open; otherwise don't “nag”
      isIdle: open && mode === "home" ? isIdle : false,
    });
  }, [hostPage, hasKeyword, isIdle, open, mode]);

  const assistantMessage = useMemo(() => {
    // Mode-specific help stays as-is (structured).
    if (mode === "email") {
      return `If email isn’t arriving:
• Check spam/junk and search “Mercy”
• Wait a few minutes (delivery can be delayed)
• For domain email: confirm mailbox works (MX + inbox access)`;
    }
    if (mode === "billing") {
      return `VIP subscription:
• After payment, VIP should activate automatically
• If not: sign out/in once, then check your tier page`;
    }
    if (mode === "about") {
      return `Mercy Blade = calm guidance + rooms.
• Rooms have short bilingual learning + audio
• Admin is for creators/operators`;
    }

    // HOME mode: be a host — ONE line or silence.
    if (hostState.mode !== "silent" && hostState.line) {
      return hostState.line;
    }

    // Fallback (rare)
    return "I’m here if you need help.";
  }, [mode, hostState]);

  const actions: QuickAction[] = useMemo(
    () => [
      {
        id: "login",
        label: "Login help",
        description: "Email, phone OTP, Google/Facebook issues",
        onClick: () => {
          setMode("home");
          setOpen(false);
          navigate("/signin");
        },
      },
      {
        id: "email",
        label: "Email not arriving",
        description: "Password reset / verification email tips",
        onClick: () => {
          startTyping(650);
          window.setTimeout(() => setMode("email"), 650);
        },
      },
      {
        id: "billing",
        label: "Subscription",
        description: "VIP access & payment questions",
        onClick: () => {
          startTyping(650);
          window.setTimeout(() => setMode("billing"), 650);
        },
      },
      {
        id: "about",
        label: "How Mercy Blade works",
        description: "Quick explanation & navigation",
        onClick: () => {
          startTyping(650);
          window.setTimeout(() => setMode("about"), 650);
        },
      },
    ],
    [navigate]
  );

  // --------------------------
  // UI (bulletproof positioning)
  // --------------------------
  const ui = (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 2147483000, // extremely high; wins over app layers
        pointerEvents: "none", // allow clicks through except on our UI
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        {/* Panel */}
        {open ? (
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            className="overflow-hidden border border-black/10 bg-white shadow-2xl"
            style={{
              width: 420,
              maxWidth: "92vw",
              height: 520,
              maxHeight: "78vh",
              borderRadius: 16,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-3"
              style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center">
                  {/* talking only when typing; calm otherwise */}
                  <TalkingFaceIcon size={26} isTalking={isTyping} />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">Mercy Host</div>
                  <div className="text-xs text-black/60">{headerSubtitle}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={closePanel}
                className="rounded-full px-2 py-1 text-sm text-black/60 hover:bg-black/5"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div
              className="px-4 py-3 overflow-auto"
              style={{ height: "calc(100% - 112px)" }}
            >
              {/* Assistant bubble */}
              <div className="flex items-start gap-2">
                <div className="mt-1 h-7 w-7 rounded-full bg-black/5 flex items-center justify-center">
                  <TalkingFaceIcon size={20} isTalking={isTyping} />
                </div>

                <div
                  className="bg-black/5 px-3 py-2"
                  style={{
                    borderRadius: 16,
                    maxWidth: "85%",
                    minHeight: 36, // ✅ prevents layout jump when switching to dots
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isTyping ? (
                    <TypingIndicator />
                  ) : (
                    <div className="text-xs text-black/80 whitespace-pre-line">
                      {assistantMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick reply chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                {actions.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={a.onClick}
                    className="rounded-full border border-black/10 bg-white hover:bg-black/5 px-3 py-1.5 text-xs text-black/80"
                    title={a.description}
                    disabled={isTyping}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Note */}
              <div className="mt-4 rounded-xl bg-black/5 p-3">
                <div className="text-[11px] font-semibold text-black/70">
                  Quick note
                </div>
                <div className="text-[11px] text-black/60 mt-1">
                  Guide-first (no AI calls yet). Later we’ll add one{" "}
                  <span className="font-semibold">Ask teacher GPT</span> button
                  behind a single API gateway.
                </div>
              </div>

              {/* Keep footer clean: remove redundant “Typing…” line (it looked noisy) */}
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={dismissHint}
                  className="text-[11px] text-black/60 hover:text-black"
                >
                  Don’t show hint again
                </button>

                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-xl bg-black text-white text-[11px] px-3 py-2 hover:opacity-90"
                >
                  Got it
                </button>
              </div>
            </div>

            {/* Input bar (visual only) */}
            <div className="border-t border-black/10 bg-white px-3 py-3">
              <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2">
                <input
                  disabled
                  value=""
                  placeholder="Ask a question… (coming soon)"
                  className="w-full bg-transparent text-xs text-black/60 placeholder:text-black/40 outline-none"
                />
                <div className="text-black/30 text-sm" aria-hidden="true">
                  ➤
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Floating button */}
        <button
          type="button"
          onClick={openPanel}
          className="mt-3 h-12 w-12 rounded-full shadow-lg border border-black/10 bg-white hover:bg-black/5 flex items-center justify-center"
          aria-label="Open Mercy Host"
          title="Mercy Host"
        >
          {/* Only “talk” when typing — otherwise it should feel calm. */}
          <TalkingFaceIcon size={28} isTalking={isTyping} />
        </button>

        {/* Hint bubble */}
        {!hintDismissed && !open && !isSignin ? (
          <button
            type="button"
            onClick={openPanel}
            className="absolute bottom-14 right-0 mb-2 rounded-2xl border border-black/10 bg-white shadow-lg px-3 py-2 text-xs text-black/70 hover:bg-black/5"
          >
            Need help?
          </button>
        ) : null}
      </div>
    </div>
  );

  // Portal to body so it cannot be trapped by page layout/transforms.
  if (mounted && typeof document !== "undefined" && document.body) {
    return createPortal(ui, document.body);
  }
  return ui;
}
