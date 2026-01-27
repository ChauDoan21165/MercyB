// FILE: MercyAIHost.tsx
// PATH: src/components/guide/MercyAIHost.tsx
// VERSION: MB-BLUE-101.7e — 2026-01-14 (+0700)
// NOTE: ADD "CARE LOOP" (NO AI):
// - Loads user display name (from profiles best-effort) + last progress snapshot (mercy_host_notes note_type='progress')
// - Logs every user message as a 'question' note
// - Logs room/audio complaints as 'fault' notes
// - Guides users to choose tier (/tiers), pay, then start learning
// - Adds a tiny rule-based English level quick test (NO AI) and recommends where to start
// - Adds EN/VI toggle for Host UI + messages
// - Adds VOICE button:
//   - Admin users can test voice via browser TTS (speechSynthesis) at $0 cost.
//   - Non-admin users see VIP9-only upsell message.
// - Listens to window "mb:host-progress" to persist progress notes (RoomRenderer will emit later)
// KEEP: big face (~3x), REAL typing, rule-based chat, assistant typing dots.
// KEEP: closed state does NOT block page clicks (no fullscreen overlay when closed).

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TalkingFaceIcon from "@/components/guide/TalkingFaceIcon";
import { supabase } from "@/lib/supabaseClient";

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

type HostLang = "en" | "vi";

type HostNoteType = "question" | "progress" | "fault" | "feedback";
type HostCategory = "ui" | "content" | "audio" | "billing" | "auth" | "performance" | "other";
type HostRowType = "user_report" | "host_auto" | "admin_note";

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

function safeLang(): HostLang {
  const v = (safeGetLS("mb.host.lang") ?? "").toLowerCase().trim();
  return v === "vi" ? "vi" : "en";
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
        <animate attributeName="opacity" values="0.25;0.9;0.25" dur="1s" repeatCount="indefinite" begin="0s" />
      </circle>
      <circle cx="14" cy="5" r="2" fill="rgba(0,0,0,0.55)">
        <animate attributeName="opacity" values="0.25;0.9;0.25" dur="1s" repeatCount="indefinite" begin="0.15s" />
      </circle>
      <circle cx="22" cy="5" r="2" fill="rgba(0,0,0,0.55)">
        <animate attributeName="opacity" values="0.25;0.9;0.25" dur="1s" repeatCount="indefinite" begin="0.3s" />
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

function normalizeOneLetterAnswer(s: string): "a" | "b" | "c" | null {
  const t = (s ?? "").trim().toLowerCase();
  if (!t) return null;
  const first = t[0];
  if (first === "a" || first === "b" || first === "c") return first;
  return null;
}

export default function MercyAIHost() {
  const [open, setOpen] = useState(false);

  // mode = destination (header subtitle)
  const [mode, setMode] = useState<PanelMode>("home");

  const [mounted, setMounted] = useState(false);
  const [ctx, setCtx] = useState<HostContext>({});

  // Language toggle
  const [lang, setLang] = useState<HostLang>(safeLang());

  // Typing state (assistant typing)
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  // Chat
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auth snapshot (best-effort; Host must not crash)
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string>("");

  // Identity / care
  const [displayName, setDisplayName] = useState<string>("");

  // Voice (admin test via browser TTS; VIP9 later real voice)
  const [canVoiceTest, setCanVoiceTest] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Lightweight progress memory (last seen)
  const [lastProgress, setLastProgress] = useState<{
    updatedAt?: string;
    roomId?: string;
    keyword?: string;
    entryId?: string;
    next?: string;
  } | null>(null);

  // Quick test (NO AI)
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep auth snapshot current (best-effort)
  useEffect(() => {
    let alive = true;

    const sync = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const u = data?.session?.user ?? null;
        if (!alive) return;
        setAuthUserId(u?.id ?? null);
        setAuthEmail(u?.email ?? "");
      } catch {
        if (!alive) return;
        setAuthUserId(null);
        setAuthEmail("");
      }
    };

    void sync();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const u = session?.user ?? null;
      setAuthUserId(u?.id ?? null);
      setAuthEmail(u?.email ?? "");
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: HostLang = prev === "en" ? "vi" : "en";
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

  const stopVoice = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      try {
        if (typeof window === "undefined") return false;
        if (!("speechSynthesis" in window)) return false;

        stopVoice();

        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang === "vi" ? "vi-VN" : "en-US";
        u.rate = 1;
        u.pitch = 1;

        u.onstart = () => setIsSpeaking(true);
        u.onend = () => setIsSpeaking(false);
        u.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(u);
        return true;
      } catch {
        setIsSpeaking(false);
        return false;
      }
    },
    [lang, stopVoice]
  );

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
    setMessages((prev) => [...prev, { id: uid(role === "user" ? "u" : "a"), role, text: clean }]);
  }, []);

  const loadMyDisplayName = useCallback(async () => {
    try {
      const { data: s } = await supabase.auth.getSession();
      const uidUser = s?.session?.user?.id;
      const email = s?.session?.user?.email ?? "";
      if (!uidUser) return;

      // Best-effort: don't assume exact schema. If these columns don't exist,
      // Supabase will error — we swallow, and fallback to email.
      const { data: p, error } = await supabase
        .from("profiles")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .select("display_name, full_name, name, is_admin, admin_level" as any)
        .eq("id", uidUser)
        .maybeSingle();

      if (error) {
        setDisplayName((email || "").trim());
        setCanVoiceTest(false);
        return;
      }

      const anyP = p as unknown as {
        display_name?: string | null;
        full_name?: string | null;
        name?: string | null;
        is_admin?: boolean | null;
        admin_level?: number | null;
      } | null;

      const n =
        (anyP?.display_name ?? "").trim() ||
        (anyP?.full_name ?? "").trim() ||
        (anyP?.name ?? "").trim() ||
        "";

      setDisplayName((n || email || "").trim());

      const adminOk =
        Boolean(anyP?.is_admin) ||
        (typeof anyP?.admin_level === "number" && Number.isFinite(anyP.admin_level) && anyP.admin_level >= 1);

      setCanVoiceTest(adminOk);
    } catch {
      // ignore
    }
  }, []);

  const loadLastProgress = useCallback(async () => {
    try {
      const { data: s } = await supabase.auth.getSession();
      const uidUser = s?.session?.user?.id;
      if (!uidUser) return;

      const { data, error } = await supabase
        .from("mercy_host_notes")
        .select("created_at, room_id, keyword, entry_id, details, note_type")
        .eq("user_id", uidUser)
        .eq("note_type", "progress")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) return;

      const row = data?.[0] as
        | {
            created_at?: string;
            room_id?: string | null;
            keyword?: string | null;
            entry_id?: string | null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            details?: any;
          }
        | undefined;

      if (!row) return;

      const d = row.details ?? {};
      setLastProgress({
        updatedAt: row.created_at,
        roomId: row.room_id ?? undefined,
        keyword: row.keyword ?? undefined,
        entryId: row.entry_id ?? undefined,
        next: typeof d?.next === "string" ? d.next : undefined,
      });
    } catch {
      // ignore
    }
  }, []);

  const logHostNote = useCallback(
    async (args: {
      note_type: HostNoteType;
      category: HostCategory;
      type: HostRowType;
      title: string;
      message: string;
      fault_code?: string | null;
      severity?: number | null; // omit to use DB default when possible
      details?: Record<string, unknown>;
    }) => {
      try {
        const { data: s } = await supabase.auth.getSession();
        const uidUser = s?.session?.user?.id;
        if (!uidUser) return;

        const rid = ctx.roomId ?? roomIdFromUrl ?? null;

        // client_version: best-effort (optional)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const v = (import.meta as any)?.env?.VITE_APP_VERSION;
        const clientVersion = typeof v === "string" && v.trim().length ? v.trim() : null;

        // IMPORTANT:
        // - meta/details in DB are jsonb NOT NULL (default {}), so never send null.
        // - severity has default; if we don't have a number, omit it (don’t send null).
        const payload: Record<string, unknown> = {
          user_id: uidUser,
          user_email: s?.session?.user?.email ?? null,
          app_key: appKey,
          page_path: location.pathname ?? null,

          room_id: rid,
          keyword: ctx.keyword ?? null,
          entry_id: ctx.entryId ?? null,

          note_type: args.note_type,
          category: args.category,
          type: args.type,
          title: args.title,
          message: args.message,
          fault_code: args.fault_code ?? null,

          details: args.details ?? {},
          meta: {
            mode,
            contextLine,
            lang,
          },
          client_version: clientVersion,
        };

        if (typeof args.severity === "number" && Number.isFinite(args.severity)) {
          payload.severity = args.severity;
        }

        await supabase.from("mercy_host_notes").insert(payload);
      } catch {
        // ignore: app must never crash because logging failed
      }
    },
    [ctx.entryId, ctx.keyword, ctx.roomId, roomIdFromUrl, location.pathname, mode, contextLine, lang]
  );

  // Load identity + last progress when panel opens (care)
  useEffect(() => {
    if (isAdmin) return;
    if (!open) return;
    void loadMyDisplayName();
    void loadLastProgress();
  }, [isAdmin, open, loadMyDisplayName, loadLastProgress]);

  // Listen for progress events from RoomRenderer (care memory pipeline)
  useEffect(() => {
    if (isAdmin) return;

    // RoomRenderer should dispatch:
    // window.dispatchEvent(new CustomEvent("mb:host-progress", { detail: { roomId, keyword, entryId, next } }))
    const onProgress = (e: Event) => {
      const ce = e as CustomEvent<{ roomId?: string; keyword?: string; entryId?: string; next?: string }>;
      const d = ce.detail;
      if (!d) return;

      setLastProgress({
        updatedAt: new Date().toISOString(),
        roomId: d.roomId,
        keyword: d.keyword,
        entryId: d.entryId,
        next: d.next,
      });

      void logHostNote({
        note_type: "progress",
        category: "other",
        type: "host_auto",
        title: "Progress update",
        message: `Progress: ${[d.roomId, d.keyword, d.entryId].filter(Boolean).join(" • ")}`,
        details: { next: d.next ?? null },
      });
    };

    window.addEventListener("mb:host-progress", onProgress as EventListener);
    return () => window.removeEventListener("mb:host-progress", onProgress as EventListener);
  }, [isAdmin, logHostNote]);

  const goTiers = useCallback(() => {
    const rid = ctx.roomId ?? roomIdFromUrl;
    const returnTo = rid ? `/room/${rid}` : location.pathname || "/";
    navigate(`/tiers?returnTo=${encodeURIComponent(returnTo)}`);
  }, [ctx.roomId, roomIdFromUrl, location.pathname, navigate]);

  const startQuickTest = useCallback(() => {
    setTestActive(true);
    setTestStep(1);
    setTestScore(0);

    if (lang === "vi") {
      addMsg(
        "assistant",
        `Mini test (30 giây) để gợi ý nơi bắt đầu.\n\nQ1) “I ___ a student.”\nA) am  B) is  C) are\nTrả lời: A / B / C`
      );
    } else {
      addMsg(
        "assistant",
        `Mini test (30 seconds) to recommend where to start.\n\nQ1) “I ___ a student.”\nA) am  B) is  C) are\nReply: A / B / C`
      );
    }

    void logHostNote({
      note_type: "question",
      category: "other",
      type: "host_auto",
      title: "Quick test started",
      message: "User started quick test",
      details: { step: 1 },
    });
  }, [addMsg, lang, logHostNote]);

  const finishQuickTest = useCallback(
    (finalScore: number) => {
      setTestActive(false);
      setTestStep(0);

      // Very rough mapping (good enough for onboarding)
      const level = finalScore <= 1 ? "beginner" : finalScore === 2 ? "intermediate" : "advanced";

      const recEn =
        level === "beginner"
          ? `Result: Beginner.\nStart: simple rooms with short lines + repeat audio.\nTip: pick 1 keyword and repeat 3 times.\nNext: go to /tiers to unlock more rooms.`
          : level === "intermediate"
          ? `Result: Intermediate.\nStart: rooms with longer sentences + shadowing.\nTip: listen once → repeat once → read once.\nNext: go to /tiers if you want VIP rooms.`
          : `Result: Advanced.\nStart: VIP rooms (long cycles) + fast listening.\nTip: use “keyword” to drill weak points.\nNext: VIP9 gives Mercy voice coaching (daily minutes cap).`;

      const recVi =
        level === "beginner"
          ? `Kết quả: Cơ bản.\nBắt đầu: phòng câu ngắn + nghe lặp.\nMẹo: chọn 1 keyword và lặp 3 lần.\nBước tiếp: vào /tiers để mở thêm phòng.`
          : level === "intermediate"
          ? `Kết quả: Trung bình.\nBắt đầu: phòng câu dài hơn + shadowing.\nMẹo: nghe 1 lần → nhại 1 lần → đọc 1 lần.\nBước tiếp: vào /tiers nếu muốn mở phòng VIP.`
          : `Kết quả: Khá.\nBắt đầu: phòng VIP (chu kỳ dài) + nghe nhanh.\nMẹo: dùng keyword để khoan vào điểm yếu.\nBước tiếp: VIP9 có giọng nói Mercy (giới hạn phút/ngày).`;

      addMsg("assistant", lang === "vi" ? recVi : recEn);

      void logHostNote({
        note_type: "progress",
        category: "other",
        type: "host_auto",
        title: "Quick test result",
        message: `Quick test result: ${level} (${finalScore}/3)`,
        details: { level, score: finalScore },
      });
    },
    [addMsg, lang, logHostNote]
  );

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
        return [{ id: uid("a"), role: "assistant", text: first }];
      });
    },
    [baseAssistantHome, lang]
  );

  const makeReply = useCallback(
    (userTextRaw: string, currentMode: PanelMode) => {
      const userText = userTextRaw.toLowerCase();
      const rid = ctx.roomId ?? roomIdFromUrl;

      // QUICK TEST handling (NO AI)
      if (testActive) {
        const ans = normalizeOneLetterAnswer(userTextRaw);
        if (!ans) {
          return lang === "vi" ? "Bạn trả lời A / B / C nhé." : "Please answer A / B / C.";
        }

        // Correct answers:
        // Q1: A (am)
        // Q2: B (goes)
        // Q3: A (Yesterday)
        let add = 0;

        if (testStep === 1 && ans === "a") add = 1;
        if (testStep === 2 && ans === "b") add = 1;
        if (testStep === 3 && ans === "a") add = 1;

        const nextScore = testScore + add;
        setTestScore(nextScore);

        if (testStep === 1) {
          setTestStep(2);
          return lang === "vi"
            ? `Q2) “He ___ to work every day.”\nA) go  B) goes  C) going\nTrả lời: A / B / C`
            : `Q2) “He ___ to work every day.”\nA) go  B) goes  C) going\nReply: A / B / C`;
        }

        if (testStep === 2) {
          setTestStep(3);
          return lang === "vi"
            ? `Q3) Chọn đúng: “___ I watched a movie.”\nA) Yesterday  B) Tomorrow  C) Now\nTrả lời: A / B / C`
            : `Q3) Choose: “___ I watched a movie.”\nA) Yesterday  B) Tomorrow  C) Now\nReply: A / B / C`;
        }

        // step 3 -> finish
        setTestStep(0);
        window.setTimeout(() => {
          finishQuickTest(nextScore);
        }, 0);

        return lang === "vi" ? "Xong. Mình tổng kết nhé…" : "Done. Let me summarize…";
      }

      // Tier / pay guidance (survival loop)
      if (
        containsAny(userText, [
          "tier",
          "tiers",
          "vip",
          "price",
          "pricing",
          "upgrade",
          "pay",
          "payment",
          "subscribe",
          "subscription",
          "checkout",
          "gói",
          "nâng",
          "thanh toán",
          "đăng ký",
        ])
      ) {
        if (!authUserId) {
          return lang === "vi"
            ? `Để thanh toán và mở VIP, bạn cần đăng nhập trước.\n• Bấm “Login help” hoặc vào /signin\nSau đó vào /tiers để chọn gói.`
            : `To pay and unlock VIP, please sign in first.\n• Tap “Login help” or go to /signin\nThen go to /tiers to choose a plan.`;
        }

        return lang === "vi"
          ? `Mình sẽ dẫn bạn theo 3 bước:\n1) Vào /tiers chọn gói (VIP1/VIP3/VIP9)\n2) Thanh toán\n3) Quay lại phòng học và bắt đầu\nBạn muốn mình mở trang /tiers không?`
          : `Here’s the 3-step path:\n1) Go to /tiers and choose VIP (VIP1/VIP3/VIP9)\n2) Pay\n3) Return to learning rooms and start\nDo you want me to open /tiers now?`;
      }

      if (
        currentMode === "email" ||
        containsAny(userText, ["email", "mail", "reset", "verify", "verification", "spam", "thư", "mail", "xác minh"])
      ) {
        return lang === "vi"
          ? `Hỗ trợ email:
• Kiểm tra spam/junk và tìm “Mercy”
• Chờ 2–5 phút (có thể trễ)
• Nếu dùng email theo domain: kiểm tra hộp thư có nhận được mail không
Bạn đang cần: đặt lại mật khẩu / xác minh / hóa đơn?`
          : `Email help:
• Check spam/junk and search “Mercy”
• Wait 2–5 minutes (providers can delay)
• If you used a domain email: confirm your mailbox really receives mail
Tell me: password reset, verification, or receipt?`;
      }

      if (
        currentMode === "billing" ||
        containsAny(userText, ["receipt", "stripe", "billing", "invoice", "vip", "pay", "payment", "hóa đơn", "stripe"])
      ) {
        return lang === "vi"
          ? `VIP / thanh toán:
• Sau khi trả tiền, VIP sẽ tự kích hoạt
• Nếu chưa: đăng xuất → đăng nhập lại 1 lần, rồi kiểm tra trang Tier/VIP
Bạn mua gói nào (VIP1/VIP3/VIP9) và hiện đang thấy gì?`
          : `VIP / billing:
• After payment, VIP should activate automatically
• If it doesn’t: sign out → sign in once, then check Tier/VIP page
Tell me: which tier (VIP1/VIP3/VIP9) and what you see now?`;
      }

      if (
        currentMode === "about" ||
        containsAny(userText, ["how", "works", "what is", "about", "guide", "là gì", "hoạt động"])
      ) {
        return lang === "vi"
          ? `Mercy Blade:
• Rooms = học song ngữ ngắn + audio
• Host = dẫn đường + hỗ trợ + ghi nhận lỗi (chưa gọi AI)
Bạn đang ở trang nào? Mình chỉ bạn bước tiếp theo.`
          : `Mercy Blade:
• Rooms = short bilingual learning + audio
• This Host = navigation + help + logging (no AI calls yet)
Tell me what page you’re on, and I’ll point the next step.`;
      }

      if (
        containsAny(userText, [
          "login",
          "signin",
          "sign in",
          "otp",
          "phone",
          "password",
          "google",
          "facebook",
          "đăng nhập",
          "mật khẩu",
          "sđt",
        ])
      ) {
        return lang === "vi"
          ? `Hỗ trợ đăng nhập:
• Email/mật khẩu: dùng “Forgot password” khi cần
• Phone OTP: kiểm tra mã quốc gia + thử lại
• Google/Facebook: phải bật trong Supabase Auth
Bạn đang dùng cách nào (email / phone / Google / Facebook)?`
          : `Login help:
• Email/password: use Forgot password if needed
• Phone OTP: confirm country code + try again
• Google/Facebook: must be enabled in Supabase Auth
What method are you using (email / phone / Google / Facebook)?`;
      }

      // Voice (VIP9 only) — message only (button handles admin test)
      if (containsAny(userText, ["voice", "speak", "talk", "read to me", "nói", "giọng", "đọc"])) {
        return lang === "vi"
          ? `Giọng nói của Mercy Host là tính năng VIP9.
• VIP9 có giới hạn phút/ngày để hệ thống bền vững
Bạn muốn nâng cấp không? Bấm “Chọn gói (Pay)” để vào /tiers.`
          : `Mercy Host Voice is VIP9 only.
• VIP9 includes a daily minutes cap (so the system stays profitable)
Want it? Tap “Choose tier” to open /tiers.`;
      }

      // Room/audio complaints -> log fault
      if (
        rid &&
        containsAny(userText, ["room", "audio", "sound", "play", "cannot hear", "can't hear", "progress", "không nghe", "âm thanh", "phòng"])
      ) {
        void logHostNote({
          note_type: "fault",
          category: containsAny(userText, ["audio", "sound", "play", "can't hear", "cannot hear", "không nghe", "âm thanh"])
            ? "audio"
            : "ui",
          type: "user_report",
          title: "Room/audio issue",
          message: userTextRaw,
          fault_code: containsAny(userText, ["audio", "sound", "play", "can't hear", "cannot hear", "không nghe", "âm thanh"])
            ? "AUDIO_PLAY_FAIL"
            : "ROOM_ISSUE",
          severity: 2,
          details: { room_id: rid, ctx },
        });

        return lang === "vi"
          ? `Hỗ trợ phòng (${rid}):
• Thử reload 1 lần
• Nếu audio không chạy: có thể entry đó không có audio
Bạn cho mình biết: phòng + dòng entry nào bị lỗi (hoặc gửi roomId).`
          : `Room help (${rid}):
• Try reloading once
• If audio doesn’t play: the entry may not have audio attached
Tell me: which room + which entry line is failing (or send the roomId).`;
      }

      // Default
      return lang === "vi"
        ? `Ok. Cho mình 1 chi tiết:
• Bạn đang ở trang nào? (${location.pathname})
• Bạn bấm gì?
• Bạn mong gì xảy ra và thực tế ra sao?`
        : `Got it. Tell me one detail:
• What page are you on? (${location.pathname})
• What did you click?
• What did you expect vs what happened?`;
    },
    [
      authUserId,
      ctx,
      roomIdFromUrl,
      location.pathname,
      lang,
      logHostNote,
      testActive,
      testStep,
      testScore,
      finishQuickTest,
    ]
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
          addMsg(
            "assistant",
            lang === "vi"
              ? "OK — email không tới. Bạn cần: xác minh / reset / hóa đơn?"
              : "Okay — email not arriving. What type (verification / reset / receipt)?"
          );
        else if (nextMode === "billing")
          addMsg("assistant", lang === "vi" ? "OK — thanh toán/VIP. Bạn đang ở gói nào và lỗi gì?" : "Okay — billing/VIP. Which tier and what’s wrong?");
        else if (nextMode === "about")
          addMsg("assistant", lang === "vi" ? "OK — Mercy Blade hoạt động thế nào. Bạn đang muốn làm gì?" : "Okay — here’s how Mercy Blade works. What are you trying to do?");
        else addMsg("assistant", baseAssistantHome);
      }, 500);
    },
    [addMsg, baseAssistantHome, clearTypingTimer, seedIfEmpty, lang]
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
    stopVoice();
  }, [clearTypingTimer, stopVoice]);

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
        id: "tiers",
        label: lang === "vi" ? "Chọn gói (Pay)" : "Choose tier",
        description: lang === "vi" ? "Mở trang /tiers để thanh toán" : "Open /tiers to pay and unlock",
        onClick: () => {
          goTiers();
        },
      },
      {
        id: "voice",
        label: canVoiceTest
          ? lang === "vi"
            ? "Giọng nói (Admin Test)"
            : "Voice (Admin Test)"
          : lang === "vi"
          ? "Giọng nói (VIP9)"
          : "Voice (VIP9)",
        description: canVoiceTest
          ? lang === "vi"
            ? "Test giọng nói ngay trên trình duyệt (không tốn tiền)"
            : "Test voice using browser TTS (no cost)"
          : lang === "vi"
          ? "Chỉ dành cho VIP9"
          : "VIP9 only",
        onClick: () => {
          // If not signed in -> signin
          if (!authUserId) {
            closePanel();
            navigate("/signin");
            return;
          }

          if (!canVoiceTest) {
            addMsg(
              "assistant",
              lang === "vi"
                ? "Giọng nói Mercy Host là VIP9. Bạn có thể nâng cấp ở /tiers."
                : "Mercy Host Voice is VIP9 only. You can upgrade at /tiers."
            );
            return;
          }

          const ok = speak(
            lang === "vi"
              ? "Xin chào. Tôi là Mercy Host. Đây là bản thử giọng nói dành cho admin."
              : "Hi. I am Mercy Host. This is an admin voice test."
          );

          if (!ok) {
            addMsg(
              "assistant",
              lang === "vi" ? "Trình duyệt này không hỗ trợ Text-to-Speech." : "This browser does not support Text-to-Speech."
            );
          }
        },
      },
      {
        id: "test",
        label: lang === "vi" ? "Mini test" : "Mini test",
        description: lang === "vi" ? "Đo nhanh trình độ để gợi ý nơi bắt đầu" : "Quick level check to recommend where to start",
        onClick: () => {
          if (!open) openPanel();
          seedIfEmpty(mode);
          startQuickTest();
        },
      },
      {
        id: "login",
        label: lang === "vi" ? "Hỗ trợ đăng nhập" : "Login help",
        description: lang === "vi" ? "Email, OTP, Google/Facebook" : "Email, phone OTP, Google/Facebook issues",
        onClick: () => {
          closePanel();
          navigate("/signin");
        },
      },
      {
        id: "email",
        label: lang === "vi" ? "Email không tới" : "Email not arriving",
        description: lang === "vi" ? "Reset / xác minh / hóa đơn" : "Password reset / verification email tips",
        onClick: () => transitionToMode("email"),
      },
      {
        id: "billing",
        label: lang === "vi" ? "Thanh toán/VIP" : "Subscription",
        description: lang === "vi" ? "VIP & lỗi kích hoạt" : "VIP access & payment questions",
        onClick: () => transitionToMode("billing"),
      },
      {
        id: "about",
        label: lang === "vi" ? "Cách dùng" : "How it works",
        description: lang === "vi" ? "Giới thiệu nhanh & dẫn đường" : "Quick explanation & navigation",
        onClick: () => transitionToMode("about"),
      },
    ],
    [
      addMsg,
      authUserId,
      canVoiceTest,
      closePanel,
      goTiers,
      lang,
      mode,
      navigate,
      open,
      openPanel,
      seedIfEmpty,
      speak,
      startQuickTest,
      transitionToMode,
    ]
  );

  const onSend = useCallback(() => {
    const text = clampText(draft);
    if (!text) return;

    setDraft("");
    seedIfEmpty(mode);
    addMsg("user", text);

    // Log every user message as a 'question' note (best effort)
    void logHostNote({
      note_type: "question",
      category: "other",
      type: "user_report",
      title: "User message",
      message: text,
      details: {
        page: location.pathname,
        roomId: ctx.roomId ?? roomIdFromUrl ?? null,
        keyword: ctx.keyword ?? null,
        entryId: ctx.entryId ?? null,
        mode,
      },
    });

    assistantRespond(text, mode);
  }, [addMsg, assistantRespond, draft, mode, seedIfEmpty, logHostNote, location.pathname, ctx, roomIdFromUrl]);

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
    };
  }, [
    open,
    mode,
    location.pathname,
    ctx,
    roomIdFromUrl,
    isTyping,
    messages.length,
    isAdmin,
    displayName,
    lastProgress,
    lang,
    authUserId,
    authEmail,
    testActive,
    testStep,
    testScore,
    canVoiceTest,
    isSpeaking,
  ]);

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

/* teacher GPT — new thing to learn (2 lines):
   If a DB column has a NOT NULL default (like jsonb default {}), don’t send null — omit it or send {}.
   Browser Text-to-Speech is a free way to prototype “Mercy Voice” UX before paying for real AI voice. */
