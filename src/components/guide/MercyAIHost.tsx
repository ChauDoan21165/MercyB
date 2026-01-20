// FILE: MercyAIHost.tsx
// PATH: src/components/guide/MercyAIHost.tsx
// VERSION: MB-BLUE-101.7h — 2026-01-20 (+0700)
// NOTE:
// - Split into host/* modules for growth & safety.
// - Auth source of truth: AuthProvider via useAuth().
// - Keep: profiles lookup prefers email (fallback to user.id only if needed)
// - Keep: repeat loop listener (mb:host-repeat-target) + play request + clear state
//
// NEW (host hearts):
// - repeatCount increments on explicit user “repeat ack” while repeatStep==="your_turn"
// - trigger heartBurst when repeatCount === 3 (UI render later in Part 2)

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TalkingFaceIcon from "@/components/guide/TalkingFaceIcon";
import { useAuth } from "@/providers/AuthProvider";

import type { HostContext, PanelMode } from "@/components/guide/host/types";
import { safeSetLS, safeLang } from "@/components/guide/host/utils";
import { useHostContextSync } from "@/components/guide/host/useHostContext";
import { useHostProfile } from "@/components/guide/host/useHostProfile";
import { useRepeatLoop } from "@/components/guide/host/useRepeatLoop";
import { useMakeReply } from "@/components/guide/host/makeReply";
import { useHostActions } from "@/components/guide/host/buildActions";
import { useDevHostState } from "@/components/guide/host/useDevState";
import TypingIndicator from "@/components/guide/host/TypingIndicator";

export default function MercyAIHost() {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PanelMode>("home");
  const [mounted, setMounted] = useState(false);

  const [lang, setLang] = useState(safeLang());

  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  const [messages, setMessages] = useState<{ id: string; role: "assistant" | "user"; text: string }[]>([]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");

  // Mini test state (kept local for now; makeReply is pure)
  const [testActive, setTestActive] = useState(false);
  const [testStep, setTestStep] = useState<0 | 1 | 2 | 3>(0);
  const [testScore, setTestScore] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ roomId?: string }>();

  const isSignin = location.pathname.startsWith("/signin");
  const isAdmin = location.pathname.startsWith("/admin");
  const isRoom = location.pathname.startsWith("/room/");
  const roomIdFromUrl = params.roomId;

  const appKey = "mercy_blade";

  useEffect(() => setMounted(true), []);

  /* =========================
     Auth snapshot (LOCKED via AuthProvider)
  ========================= */
  useEffect(() => {
    setAuthUserId(user?.id ?? null);
    setAuthEmail(user?.email ?? "");
  }, [user?.id, user?.email]);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "vi" : "en";
      safeSetLS("mb.host.lang", next);
      return next;
    });
  }, []);

  const clearTypingTimer = useCallback(() => {
    // IMPORTANT: timer id can be 0 in some environments — check against null, not truthy.
    if (typingTimerRef.current !== null) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearTypingTimer();
  }, [clearTypingTimer]);

  const addMsg = useCallback((role: "assistant" | "user", text: string) => {
    setMessages((prev) => {
      const clean = (text ?? "").trim();
      if (!clean) return prev;
      const id = `${role === "user" ? "u" : "a"}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
      return [...prev, { id, role, text: clean.length > 1200 ? `${clean.slice(0, 1200)}…` : clean }];
    });
  }, []);

  /* =========================
     Host Context (window event + route sync)
  ========================= */
  const [ctx, setCtx] = useHostContextSync({
    isAdmin,
    isRoom,
    roomIdFromUrl,
  });

  /* =========================
     Profile + progress (Supabase reads)
  ========================= */
  const { displayName, canVoiceTest, lastProgress, speak, stopVoice, isSpeaking } = useHostProfile({
    isAdmin,
    open,
    lang,
    authUserId,
    authEmail,
  });

  const pageHint = useMemo(() => {
    const p = location.pathname || "/";
    if (p.startsWith("/signin")) return lang === "vi" ? "Hỗ trợ đăng nhập" : "Login help";
    if (p.startsWith("/room/")) return lang === "vi" ? "Hỗ trợ phòng học" : "Room help";
    if (p.startsWith("/tiers")) return lang === "vi" ? "Chọn gói VIP" : "Choose VIP tier";
    return lang === "vi" ? "Hỗ trợ" : "Help";
  }, [location.pathname, lang]);

  const headerSubtitle = useMemo(() => {
    switch (mode) {
      case "email":
        return lang === "vi" ? "Hỗ trợ email" : "Email help";
      case "billing":
        return lang === "vi" ? "Hỗ trợ thanh toán/VIP" : "Subscription help";
      case "about":
        return lang === "vi" ? "Giới thiệu" : "About";
      default:
        return pageHint;
    }
  }, [mode, pageHint, lang]);

  const contextLine = useMemo(() => {
    const rid = (ctx as HostContext)?.roomId ?? roomIdFromUrl;
    const parts: string[] = [];
    if (ctx.roomTitle) parts.push(ctx.roomTitle);
    else if (rid) parts.push(rid);
    if (ctx.entryId) parts.push(`entry:${ctx.entryId}`);
    if (ctx.keyword) parts.push(`kw:${ctx.keyword}`);
    return parts.length ? parts.join(" • ") : null;
  }, [ctx.roomId, ctx.roomTitle, ctx.entryId, ctx.keyword, roomIdFromUrl]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    if (!open) return;
    const t = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [isAdmin, open]);

  useEffect(() => {
    if (isAdmin) return;
    if (!open) return;
    scrollToBottom();
  }, [isAdmin, messages, open, scrollToBottom]);

  const goTiers = useCallback(() => {
    const rid = ctx.roomId ?? roomIdFromUrl;
    const returnTo = rid ? `/room/${rid}` : location.pathname || "/";
    navigate(`/tiers?returnTo=${encodeURIComponent(returnTo)}`);
  }, [ctx.roomId, roomIdFromUrl, location.pathname, navigate]);

  const baseAssistantHome = useMemo(() => {
    const name = displayName ? ` ${displayName}` : "";
    const p =
      lastProgress?.roomId && !isSignin
        ? lang === "vi"
          ? `Lần trước: ${lastProgress.roomId}${lastProgress.keyword ? ` • kw:${lastProgress.keyword}` : ""}${
              lastProgress.next ? `\nBước tiếp: ${lastProgress.next}` : ""
            }`
          : `Last time: ${lastProgress.roomId}${lastProgress.keyword ? ` • kw:${lastProgress.keyword}` : ""}${
              lastProgress.next ? `\nNext: ${lastProgress.next}` : ""
            }`
        : "";

    if (lang === "vi") {
      return `Chào${name}. Mình là Mercy Host.\n${p ? p + "\n" : ""}Bạn muốn làm gì ngay bây giờ?\n• Chọn gói VIP (/tiers)\n• Làm mini test\n• Vào phòng học\n• Báo lỗi (audio/UI)`;
    }

    return `Hi${name}. I’m Mercy Host.\n${p ? p + "\n" : ""}What do you need right now?\n• Choose a VIP tier (/tiers)\n• Take a mini test\n• Start learning in a room\n• Report a problem (audio/UI)`;
  }, [displayName, lastProgress, isSignin, lang]);

  const seedIfEmpty = useCallback(
    (nextMode: PanelMode) => {
      setMessages((prev) => {
        if (prev.length) return prev;
        const first =
          nextMode === "home"
            ? baseAssistantHome
            : lang === "vi"
            ? `Chào. Hỏi mình về ${nextMode}.`
            : `Hi. Ask me anything about ${nextMode}.`;
        return [{ id: `a_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`, role: "assistant", text: first }];
      });
    },
    [baseAssistantHome, lang]
  );

  /* =========================
     Repeat loop (events + hearts)
     - MUST match host/useRepeatLoop.ts API
  ========================= */
  const {
    repeatTarget,
    repeatStep,
    setRepeatStep,
    repeatSeenAt,
    repeatCount,
    heartBurst,
    requestPlayRepeat,
    clearRepeat,
    clearHeart,
    triggerHeart,
    tryAcknowledgeRepeat,
  } = useRepeatLoop({
    isAdmin,
    onOpen: () => setOpen(true),
    onSeedIfEmpty: () => seedIfEmpty(mode),
    onTarget: (t) => {
      // Best-effort context update — never clear existing ctx
      setCtx((prev) => ({
        ...prev,
        roomId: t.roomId ?? prev.roomId,
        entryId: (t.entryId ?? prev.entryId) as any,
        keyword: (t.keyword ?? prev.keyword) as any,
        focus_en: ((t.text_en ?? "").trim() || (prev as any)?.focus_en) as any,
        focus_vi: ((t.text_vi ?? "").trim() || (prev as any)?.focus_vi) as any,
      }));
    },
  });

  /* =========================
     Reply function (pure)
     - MUST match host/makeReply.ts API
  ========================= */
  const makeReplyFn = useMakeReply();

  const assistantRespond = useCallback(
    (userText: string, currentMode: PanelMode) => {
      clearTypingTimer();
      setIsTyping(true);

      typingTimerRef.current = window.setTimeout(() => {
        setIsTyping(false);
        typingTimerRef.current = null;

        // 1) Repeat ACK has priority (STRICT + local)
        const ack = tryAcknowledgeRepeat ? tryAcknowledgeRepeat(userText) : null;
        if (ack?.handled) {
          addMsg("assistant", ack.replyText);
          return;
        }

        // 2) Normal reply (pure)
        const reply = makeReplyFn(userText, {
          isAdmin,
          locationPath: location.pathname,
          lang,
          mode: currentMode,
          ctx,
          roomIdFromUrl,
          authUserId,
          authEmail,
          appKey,
          contextLine,
          headerSubtitle,

          repeatTarget,
          repeatStep,
          repeatCount,

          // mini test state (local)
          testActive,
          testStep,
          testScore,
          onTestUpdate: (next) => {
            if (typeof next.active === "boolean") setTestActive(next.active);
            if (typeof next.step === "number") setTestStep(next.step as 0 | 1 | 2 | 3);
            if (typeof next.score === "number") setTestScore(next.score);
          },

          // optional hooks for side effects (safe)
          onSetRepeatStep: (s) => setRepeatStep(s),
          onTriggerHeart: (k) => triggerHeart(k),
          onClearHeart: () => clearHeart(),
        });

        addMsg("assistant", reply);
      }, 650);
    },
    [
      addMsg,
      clearTypingTimer,
      tryAcknowledgeRepeat,
      makeReplyFn,
      isAdmin,
      location.pathname,
      lang,
      ctx,
      roomIdFromUrl,
      authUserId,
      authEmail,
      appKey,
      contextLine,
      headerSubtitle,
      repeatTarget,
      repeatStep,
      repeatCount,
      testActive,
      testStep,
      testScore,
      setRepeatStep,
      triggerHeart,
      clearHeart,
    ]
  );

  const openPanel = useCallback(() => {
    setOpen(true);
    seedIfEmpty(mode);
  }, [seedIfEmpty, mode]);

  const closePanel = useCallback(() => {
    setOpen(false);
    clearTypingTimer();
    setIsTyping(false);
    stopVoice();
  }, [clearTypingTimer, stopVoice]);

  const onSend = useCallback(() => {
    const text = (draft ?? "").trim();
    if (!text) return;

    setDraft("");
    addMsg("user", text);

    // Small command routing (keep simple + local)
    const lower = text.toLowerCase().trim();
    if (lower === "/tiers") {
      goTiers();
      assistantRespond(text, mode);
      return;
    }
    if (lower === "/email") setMode("email");
    if (lower === "/billing") setMode("billing");
    if (lower === "/about") setMode("about");
    if (lower === "/home") setMode("home");

    assistantRespond(text, mode);
  }, [draft, addMsg, assistantRespond, mode, goTiers]);

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
      }
    },
    [onSend, closePanel]
  );

  /* =========================
     Quick actions
     - MUST match host/buildActions.ts API
  ========================= */
  const actions = useHostActions({
    lang,
    onGoTiers: goTiers,
    addAssistantMsg: (t) => addMsg("assistant", t),
    clearChat: () => setMessages([]),
    setMode,
    startMiniTest: () => {
      setTestActive(true);
      setTestStep(1);
      setTestScore(0);
      addMsg(
        "assistant",
        lang === "vi"
          ? `OK. Mini test (3 câu).\nQ1) “I ___ coffee.”\nA) like  B) likes  C) liking`
          : `OK. Mini test (3 questions).\nQ1) “I ___ coffee.”\nA) like  B) likes  C) liking`
      );
    },
    canVoiceTest,
    speak,
  });

  useDevHostState({
    open,
    mode,
    page: location.pathname,
    roomId: ctx.roomId ?? roomIdFromUrl,
    ctx,
    isTyping,
    messagesCount: messages.length,
    isAdmin,
    displayName,
    lastProgress,
    lang,
    authUserId,
    authEmail,
    testActive,
    testStep,
    testScore,
    appKey,
    canVoiceTest,
    isSpeaking,
    repeatTarget,
    repeatStep,
    repeatSeenAt,
    repeatCount,
    heartBurst,
  });

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

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isSpeaking ? (
                <button
                  type="button"
                  onClick={stopVoice}
                  title={lang === "vi" ? "Dừng giọng" : "Stop voice"}
                  style={{
                    border: "1px solid rgba(0,0,0,0.10)",
                    background: "#fff",
                    borderRadius: 999,
                    height: 32,
                    padding: "0 10px",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    color: "rgba(0,0,0,0.70)",
                  }}
                >
                  ■
                </button>
              ) : null}

              <button
                type="button"
                onClick={toggleLang}
                aria-label="Toggle language"
                title={lang === "en" ? "Switch to Vietnamese" : "Chuyển sang English"}
                style={{
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "#fff",
                  borderRadius: 999,
                  height: 32,
                  padding: "0 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(0,0,0,0.70)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {lang === "en" ? "EN" : "VI"}
              </button>

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
            {/* Repeat card */}
            {repeatTarget ? (
              <div
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "rgba(0,0,0,0.03)",
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#111" }}>
                    {lang === "vi" ? "Repeat (lặp lại)" : "Repeat"}
                  </div>
                  <button
                    type="button"
                    onClick={clearRepeat}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.12)",
                      background: "#fff",
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: "pointer",
                      color: "rgba(0,0,0,0.70)",
                    }}
                  >
                    {lang === "vi" ? "Xóa" : "Clear"}
                  </button>
                </div>

                <div style={{ fontSize: 11, color: "rgba(0,0,0,0.60)", marginTop: 6 }}>
                  {lang === "vi"
                    ? repeatStep === "play"
                      ? "Bấm Play → nghe 1 lần → rồi nhại lại."
                      : "Đến lượt bạn. Nói to, rõ, chậm."
                    : repeatStep === "play"
                    ? "Tap Play → listen once → then repeat."
                    : "Your turn. Speak clearly and slowly."}
                  {repeatSeenAt ? ` • ${new Date(repeatSeenAt).toLocaleTimeString()}` : ""}
                </div>

                {repeatTarget.text_en ? (
                  <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: "#111", whiteSpace: "pre-line" }}>
                    {repeatTarget.text_en}
                  </div>
                ) : null}

                {repeatTarget.text_vi ? (
                  <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.78)", whiteSpace: "pre-line" }}>
                    {repeatTarget.text_vi}
                  </div>
                ) : null}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                  {repeatTarget.audio_url ? (
                    <button
                      type="button"
                      onClick={requestPlayRepeat}
                      style={{
                        borderRadius: 999,
                        border: "1px solid rgba(0,0,0,0.12)",
                        background: "#111",
                        padding: "6px 10px",
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.92)",
                      }}
                    >
                      {lang === "vi" ? "Play" : "Play"}
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setRepeatStep("your_turn")}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.12)",
                      background: "#fff",
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                      color: "rgba(0,0,0,0.82)",
                    }}
                  >
                    {lang === "vi" ? "Đến lượt tôi" : "My turn"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRepeatStep("idle");
                      addMsg(
                        "assistant",
                        lang === "vi"
                          ? "OK. Khi muốn lặp lại, chọn keyword/entry trong room nhé."
                          : "Okay. Pick a keyword/entry in a room when you want another repeat."
                      );
                    }}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.12)",
                      background: "#fff",
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                      color: "rgba(0,0,0,0.82)",
                    }}
                  >
                    {lang === "vi" ? "Xong" : "Done"}
                  </button>
                </div>
              </div>
            ) : null}

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
                    color: "rgba(0,0,0,0.70)",
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
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.70)" }}>
                {lang === "vi" ? "Gợi ý nhanh" : "Care loop"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(0,0,0,0.60)", marginTop: 6 }}>
                {lang === "vi"
                  ? `Mình ghi nhận câu hỏi/lỗi để đội dev sửa sau. Nếu bạn muốn mở VIP, vào /tiers.`
                  : `I record questions/faults so we can fix bugs later. If you want VIP access, go to /tiers.`}
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
                placeholder={
                  lang === "vi"
                    ? "Gõ ở đây… (Enter để gửi, Shift+Enter xuống dòng)"
                    : "Type here… (Enter to send, Shift+Enter newline)"
                }
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
                {lang === "vi" ? "Gửi" : "Send"}
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
