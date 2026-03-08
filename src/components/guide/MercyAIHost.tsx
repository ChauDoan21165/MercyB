// FILE: MercyAIHost.tsx
// PATH: src/components/guide/MercyAIHost.tsx
// VERSION: MB-BLUE-101.7i — 2026-03-08 (+0700)
// NOTE:
// - Split into host/* modules for growth & safety.
// - Auth source of truth: AuthProvider via useAuth().
// - Keep: profiles lookup prefers email (fallback to user.id only if needed)
// - Keep: repeat loop listener (mb:host-repeat-target) + play request + clear state
//
// NEW (host hearts):
// - repeatCount increments on explicit user “repeat ack” while repeatStep==="your_turn"
// - trigger heartBurst when repeatCount === 3 (UI render later in Part 2)
//
// PATCH (2026-01-29):
// - Remove React portal usage to eliminate dev/StrictMode/HMR NotFoundError(removeChild) crashes.
//   (Render inline in the React tree; UI is fixed-position anyway.)
//
// PATCH (2026-03-04):
// - Add optional AI brain via /api/mercy-ai (gpt-4o-mini) with quota guard.
// - Add polite greeting for hello/hi/xin chào without spending AI.
//
// PATCH (2026-03-04b):
// - IMPORTANT: Do NOT spend AI quota unless the AI endpoint actually returns a usable reply.
//   (Previous logic could spend quota even when we fell back to deterministic makeReply.)
//
// PATCH (2026-03-04c):
// - Replace legacy VIP tiers with Free / Pro / Elite
// - Promo-friendly daily limits
// - Auto voice: speak assistant replies (toggle in header, default ON)
// - Browser TTS fallback: if speak() is missing, use window.speechSynthesis (free)
//
// PATCH (2026-03-04d):
// - Speak the very first welcome message immediately when opening host (lively teacher feel).
// - Stop voice button also cancels browser TTS.
//
// PATCH (2026-03-04e):
// - Add “I’m stuck / help / start” teacher shortcut (FREE, no AI).
//
// PATCH (2026-03-04f):
// - Add deterministic rolling context summary (FREE) to make AI feel smarter with fewer tokens.
//   (We send a short summary + a smaller history window to /api/mercy-ai.)
//
// PATCH (2026-03-04g):
// - Add feedback UI (👍/👎 + reason chips) and local queue in localStorage (FREE, no server required).
//
// PATCH (2026-03-05):
// - Add best-effort feedback drain to /api/mercy-feedback (batch + retry/backoff).
// - IMPORTANT: queue remains source of truth; never blocks UI; never crashes if offline.
//
// FIX (2026-03-05a):
// - Fix TDZ/runtime crash: feedback drain deps referenced repeatTarget/repeatStep before they were declared.
//   (Repeat loop is now initialized before feedback drain hooks.)
//
// PATCH (2026-03-08):
// - Safe low-risk bundle trim inside this file:
//   - lazy-load TalkingFaceIcon
//   - lazy-load TypingIndicator

import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

import type { HostContext, PanelMode } from "@/components/guide/host/types";

// ✅ FIX (prod parity): import explicit file so Vercel/Linux resolver can’t “miss” it.
// NOTE: Do NOT use ".ts" extension unless tsconfig allows it.
import { safeSetLS, safeLang } from "@/components/guide/host/utils";

import { useHostContextSync } from "@/components/guide/host/useHostContext";
import { useHostProfile } from "@/components/guide/host/useHostProfile";
import { useRepeatLoop } from "@/components/guide/host/useRepeatLoop";
import { useMakeReply } from "@/components/guide/host/makeReply";
import { useHostActions } from "@/components/guide/host/buildActions";
import { useDevHostState } from "@/components/guide/host/useDevState";

// ✅ lazy visual-only pieces
const TalkingFaceIcon = lazy(() => import("@/components/guide/TalkingFaceIcon"));
const TypingIndicator = lazy(() => import("@/components/guide/host/TypingIndicator"));

type TierKey = "free" | "pro" | "elite";

function safeGetLS(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLSRaw(key: string, val: string) {
  try {
    window.localStorage.setItem(key, val);
  } catch {
    // ignore
  }
}

function safeGetLSJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const j = JSON.parse(raw);
    return (j as T) ?? fallback;
  } catch {
    return fallback;
  }
}

function safeSetLSJson(key: string, val: any) {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

function todayKeyLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseIntLoose(v: any): number | null {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : null;
}

function guessVipRankFromEnv(args: { authUserId: string | null; canVoiceTest?: boolean; ctx?: any }): number {
  const ctx = args.ctx ?? null;

  const candidates: Array<string | number | null | undefined> = [
    ctx?.vipRank,
    ctx?.userVipRank,
    ctx?.accessRank,
    ctx?.vip_rank,
    safeGetLS("mb.vip_rank"),
    safeGetLS("mb.user.vip_rank"),
    safeGetLS("mb.access.rank"),
    safeGetLS("mb.user_access.rank"),
    safeGetLS("mb.profile.vip_rank"),
  ];

  for (const c of candidates) {
    const n = parseIntLoose(c);
    if (typeof n === "number") return n;
  }

  if (args.canVoiceTest) return 3;
  if (args.authUserId) return 1;
  return 0;
}

function tierFromRank(rank: number): TierKey {
  if (rank >= 3) return "elite";
  if (rank >= 1) return "pro";
  return "free";
}

function tierLabel(tier: TierKey): string {
  if (tier === "elite") return "Elite";
  if (tier === "pro") return "Pro";
  return "Free";
}

function tierNextUpgrade(tier: TierKey): TierKey {
  if (tier === "free") return "pro";
  if (tier === "pro") return "elite";
  return "elite";
}

function dailyAiLimitForTier(tier: TierKey): number {
  if (tier === "free") return 30;
  if (tier === "pro") return 300;
  return 2000;
}

function shouldCountAsAiMessage(userText: string, currentMode: PanelMode): boolean {
  const t = (userText ?? "").trim();
  if (!t) return false;
  const lower = t.toLowerCase();

  if (lower.startsWith("/")) return false;
  if (currentMode === "home" && (lower === "tiers" || lower === "pricing")) return false;

  return true;
}

function getAiUsageKey(appKey: string, tier: TierKey): string {
  return `mb.host.ai.${appKey}.${tier}.${todayKeyLocal()}`;
}

function readAiUsed(appKey: string, tier: TierKey): number {
  const key = getAiUsageKey(appKey, tier);
  const raw = safeGetLS(key);
  const n = parseIntLoose(raw);
  return typeof n === "number" && n >= 0 ? n : 0;
}

function writeAiUsed(appKey: string, tier: TierKey, used: number) {
  const key = getAiUsageKey(appKey, tier);
  safeSetLSRaw(key, String(Math.max(0, used | 0)));
}

type LastProgress = {
  roomId?: string;
  keyword?: string;
  next?: string;
};

type RepeatAckResult = { handled: boolean };

function norm(s: any) {
  return typeof s === "string" ? s.trim() : "";
}

function isBilingualBlock(s: string) {
  const t = (s ?? "").trim();
  return /(^|\n)EN:\s*\n/.test(t) && /(^|\n)VI:\s*\n/.test(t);
}

function bi(en: string, vi: string) {
  return `EN:\n${(en ?? "").trim()}\n\nVI:\n${(vi ?? "").trim()}`;
}

function ensureBilingual(text: string) {
  const t = (text ?? "").trim();
  if (!t) return "";
  if (isBilingualBlock(t)) return t;
  return bi(t, t);
}

function extractLangFromBilingualBlock(text: string, lang: "en" | "vi") {
  const t = (text ?? "").trim();
  if (!isBilingualBlock(t)) return t;

  const m = t.match(/(?:^|\n)EN:\s*\n([\s\S]*?)\n\nVI:\s*\n([\s\S]*)$/);
  if (!m) return t;

  const enPart = (m[1] ?? "").trim();
  const viPart = (m[2] ?? "").trim();
  return lang === "vi" ? viPart : enPart;
}

function canBrowserSpeak(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof (window as any).SpeechSynthesisUtterance !== "undefined"
  );
}

function stopBrowserTTS() {
  try {
    if (canBrowserSpeak()) window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}

function speakBrowserTTS(text: string, lang: "en" | "vi") {
  if (!canBrowserSpeak()) return;

  const clean = (text ?? "").trim();
  if (!clean) return;

  stopBrowserTTS();

  try {
    const Utter = (window as any).SpeechSynthesisUtterance as any;
    const u = new Utter(clean);
    u.lang = lang === "vi" ? "vi-VN" : "en-US";
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

function looksLikeHello(s: string) {
  const t = (s ?? "").trim().toLowerCase();
  return (
    t === "hi" ||
    t === "hello" ||
    t === "hey" ||
    t === "yo" ||
    t === "xin chào" ||
    t === "xin chao" ||
    t === "chào" ||
    t === "chao" ||
    t === "hello mercy" ||
    t === "hi mercy"
  );
}

function looksLikeStuck(s: string) {
  const t = (s ?? "").trim().toLowerCase();
  if (!t) return false;

  if (
    t === "help" ||
    t === "start" ||
    t === "go" ||
    t === "begin" ||
    t === "what now" ||
    t === "now what"
  ) {
    return true;
  }

  if (t === "i don't know" || t === "idk" || t === "im stuck" || t === "i am stuck") {
    return true;
  }

  if (t.includes("where do i begin")) return true;
  if (t.includes("how do i start")) return true;
  if (t.includes("how to use")) return true;
  if (t.includes("what should i do")) return true;

  if (
    t === "giúp" ||
    t === "giup" ||
    t === "bắt đầu" ||
    t === "bat dau" ||
    t === "em không biết" ||
    t === "không biết"
  ) {
    return true;
  }
  if (t.includes("bắt đầu từ đâu") || t.includes("bat dau tu dau")) return true;

  return false;
}

function teacherNextStep(args: { lang: "en" | "vi"; hasProgress: boolean }) {
  const { hasProgress } = args;

  const enProgress = hasProgress ? "• Continue your last room\n" : "";
  const viProgress = hasProgress ? "• Vào lại phòng gần nhất\n" : "";

  const en = `No problem. Here is the next step.\n${enProgress}• Take a mini test\n• Practice repeat (3 times)\n• See plans: type /tiers`;
  const vi = `Không sao. Đây là bước tiếp theo.\n${viProgress}• Làm mini test\n• Luyện nhại (3 lần)\n• Xem gói: gõ /tiers`;

  return bi(en, vi);
}

function shouldUseAiBrain(userText: string) {
  const t = (userText ?? "").trim();
  if (!t) return false;
  const low = t.toLowerCase();

  if (low.startsWith("/")) return false;
  if (looksLikeHello(t)) return false;
  if (looksLikeStuck(t)) return false;

  if (low.startsWith("fix grammar:")) return true;
  if (/[?？]$/.test(t)) return true;
  if (low.includes("why") || low.includes("how") || low.includes("what")) return true;
  if (low.includes("explain") || low.includes("summarize") || low.includes("compare")) return true;
  if (t.length >= 80) return true;

  return false;
}

function stripBilingualToLang(text: string, lang: "en" | "vi") {
  const t = (text ?? "").trim();
  if (!t) return "";
  return extractLangFromBilingualBlock(t, lang).replace(/\s+/g, " ").trim();
}

function buildRollingSummary(args: {
  lang: "en" | "vi";
  mode: PanelMode;
  contextLine: string | null;
  roomId: string | undefined;
  keyword: string | undefined;
  repeatActive: boolean;
  repeatStep: string;
  messages: Array<{ role: "assistant" | "user"; text: string }>;
}) {
  const { lang, mode, contextLine, roomId, keyword, repeatActive, repeatStep, messages } = args;

  const lastUsers = messages
    .slice()
    .reverse()
    .filter((m) => m.role === "user")
    .slice(0, 2)
    .reverse()
    .map((m) => stripBilingualToLang(m.text, lang))
    .filter(Boolean);

  const parts: string[] = [];
  parts.push(`mode:${mode}`);
  if (contextLine) parts.push(`ctx:${contextLine}`);
  else if (roomId) parts.push(`room:${roomId}`);
  if (keyword) parts.push(`kw:${keyword}`);
  if (repeatActive) parts.push(`repeat:${repeatStep}`);

  const stateLine = parts.join(" | ");
  const userLine = lastUsers.length ? `last_user: ${lastUsers.join(" / ")}` : "";

  const raw = [stateLine, userLine].filter(Boolean).join("\n");
  return raw.length > 420 ? raw.slice(0, 420) + "…" : raw;
}

type FeedbackVote = "up" | "down";
type FeedbackReason =
  | "helpful"
  | "clear"
  | "friendly"
  | "fixed_it"
  | "wrong"
  | "too_long"
  | "not_relevant"
  | "confusing"
  | "audio_ui"
  | "other";

type HostFeedbackEvent = {
  v: 1;
  ts: number;
  appKey: string;
  authUserId: string | null;
  tier: TierKey;
  lang: "en" | "vi";
  mode: PanelMode;
  path: string;
  roomId?: string;
  entryId?: string;
  keyword?: string;
  contextLine?: string | null;
  msgId: string;
  vote: FeedbackVote;
  reason?: FeedbackReason;
  assistantSnippet?: string;
  lastUserSnippet?: string;
  repeatStep?: string;
  repeatCount?: number;
};

function feedbackQueueKey(appKey: string) {
  return `mb.host.feedback.q.${appKey}.v1`;
}
function feedbackStateKey(appKey: string) {
  return `mb.host.feedback.state.${appKey}.v1`;
}

function feedbackDrainStateKey(appKey: string) {
  return `mb.host.feedback.drain.${appKey}.v1`;
}

type FeedbackDrainState = {
  nextAttemptAt: number;
  backoffMs: number;
  failCount: number;
  lastOkAt: number;
};

const FEEDBACK_DRAIN_DEFAULT: FeedbackDrainState = {
  nextAttemptAt: 0,
  backoffMs: 0,
  failCount: 0,
  lastOkAt: 0,
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function nextBackoffMs(prev: number) {
  const base = prev > 0 ? Math.min(prev * 2, 10 * 60 * 1000) : 1000;
  const jitter = Math.floor(Math.random() * 350);
  return base + jitter;
}

function safeGetNavLocale(): string {
  try {
    return (navigator as any)?.language || "en-US";
  } catch {
    return "en-US";
  }
}

function tzOffsetMinLocal(): number {
  try {
    return new Date().getTimezoneOffset() * -1;
  } catch {
    return 0;
  }
}

function getOrCreateAnonId(): string {
  const key = "mb.anon_id";
  const existing = safeGetLS(key);
  if (existing) return existing;

  const next = `mb_anon_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
  safeSetLSRaw(key, next);
  return next;
}

function toFeedbackPayload(args: {
  appKey: string;
  client: { version: string; buildTime: string };
  actor: { authUserId?: string; authEmail?: string; anonId: string };
  context: {
    pagePath: string;
    mode: PanelMode;
    contextLine?: string | null;
    roomId?: string;
    entryId?: string;
    keyword?: string;
    repeat?: { active: boolean; step: string; count: number };
  };
  items: HostFeedbackEvent[];
  signals: { aiUsedToday: number; aiDailyLimit: number; tier: TierKey; autoVoice: boolean };
}) {
  const { appKey, client, actor, context, items, signals } = args;

  return {
    schema: "mb.feedback.v1" as const,
    appKey,
    client: {
      version: client.version,
      buildTime: client.buildTime,
      platform: "web" as const,
      locale: safeGetNavLocale(),
      tzOffsetMin: tzOffsetMinLocal(),
    },
    actor: {
      authUserId: actor.authUserId ?? undefined,
      authEmail: actor.authEmail ?? undefined,
      anonId: actor.anonId,
    },
    context: {
      pagePath: context.pagePath,
      mode: context.mode,
      contextLine: context.contextLine ?? null,
      roomId: context.roomId ?? undefined,
      entryId: context.entryId ?? undefined,
      keyword: context.keyword ?? undefined,
      repeat: context.repeat ?? undefined,
    },
    items: items.map((ev) => ({
      eventId: `${ev.ts}_${ev.msgId}`,
      ts: new Date(ev.ts).toISOString(),
      type: "vote",
      vote: ev.vote,
      reasonCode: ev.reason ?? undefined,
      reasonText: "",
      target: { messageId: ev.msgId, role: "assistant" as const },
      signals: {
        aiUsedToday: signals.aiUsedToday,
        aiDailyLimit: signals.aiDailyLimit,
        tier: signals.tier,
        autoVoice: signals.autoVoice,
      },
      safety: {
        containsUserText: Boolean(ev.lastUserSnippet),
        includeText: Boolean(ev.assistantSnippet || ev.lastUserSnippet),
      },
    })),
  };
}

function clip(s: any, max: number) {
  const t = typeof s === "string" ? s.trim() : "";
  if (!t) return "";
  return t.length > max ? t.slice(0, max) + "…" : t;
}

function FaceFallback({ size = 44 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: "rgba(0,0,0,0.06)",
      }}
      aria-hidden="true"
    />
  );
}

export default function MercyAIHost() {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PanelMode>("home");
  const [mounted, setMounted] = useState(false);

  const [lang, setLang] = useState(safeLang());

  const [autoVoice, setAutoVoice] = useState<boolean>(() => {
    const raw = safeGetLS("mb.host.auto_voice");
    if (raw === "0") return false;
    if (raw === "false") return false;
    return true;
  });

  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  const [messages, setMessages] = useState<{ id: string; role: "assistant" | "user"; text: string }[]>([]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");

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

  const repeatNudgeTimerRef = useRef<number | null>(null);
  const repeatNudgedKeyRef = useRef<string>("");

  useEffect(() => setMounted(true), []);

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

  const toggleAutoVoice = useCallback(() => {
    setAutoVoice((prev) => {
      const next = !prev;
      safeSetLSRaw("mb.host.auto_voice", next ? "1" : "0");
      return next;
    });
  }, []);

  const clearTypingTimer = useCallback(() => {
    if (typingTimerRef.current !== null) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = null;
  }, []);

  const clearRepeatNudgeTimer = useCallback(() => {
    if (repeatNudgeTimerRef.current !== null) window.clearTimeout(repeatNudgeTimerRef.current);
    repeatNudgeTimerRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      clearTypingTimer();
      clearRepeatNudgeTimer();
    };
  }, [clearTypingTimer, clearRepeatNudgeTimer]);

  const [ctx, setCtx] = useHostContextSync({
    isAdmin,
    isRoom,
    roomIdFromUrl,
  });

  const profileAny = useHostProfile({
    isAdmin,
    open,
    lang,
    authUserId,
    authEmail,
  }) as any;

  const displayName: string = profileAny?.displayName ?? "";
  const canVoiceTest: boolean = Boolean(profileAny?.canVoiceTest);
  const lastProgress: LastProgress | null = (profileAny?.lastProgress ?? null) as any;
  const speak: any = profileAny?.speak;
  const stopVoice: any = profileAny?.stopVoice;
  const isSpeaking: boolean = Boolean(profileAny?.isSpeaking);

  const maybeSpeakAssistant = useCallback(
    (assistantText: string) => {
      if (!autoVoice) return;

      const clean = (assistantText ?? "").trim();
      if (!clean) return;

      const toSpeak = extractLangFromBilingualBlock(clean, lang);

      const hasAppSpeak = typeof speak === "function";

      try {
        if (hasAppSpeak && isSpeaking) stopVoice?.();
      } catch {
        // ignore
      }
      stopBrowserTTS();

      if (hasAppSpeak) {
        try {
          const r = speak(toSpeak, lang);
          if (typeof (r as any)?.catch === "function") (r as any).catch(() => {});
          return;
        } catch {
          try {
            const r2 = speak(toSpeak);
            if (typeof (r2 as any)?.catch === "function") (r2 as any).catch(() => {});
            return;
          } catch {
            // fall through
          }
        }
      }

      speakBrowserTTS(toSpeak, lang);
    },
    [autoVoice, speak, lang, isSpeaking, stopVoice],
  );

  const addMsg = useCallback(
    (role: "assistant" | "user", text: string) => {
      const clean = (text ?? "").trim();
      if (!clean) return;

      const stored = clean.length > 1800 ? `${clean.slice(0, 1800)}…` : clean;

      setMessages((prev) => {
        const id = `${role === "user" ? "u" : "a"}_${Math.random()
          .toString(16)
          .slice(2)}_${Date.now().toString(16)}`;
        return [...prev, { id, role, text: stored }];
      });

      if (role === "assistant") {
        maybeSpeakAssistant(stored);
      }
    },
    [maybeSpeakAssistant],
  );

  const scheduleAssistantMsg = useCallback(
    (text: string, delayMs: number) => {
      clearTypingTimer();
      setIsTyping(true);
      typingTimerRef.current = window.setTimeout(() => {
        setIsTyping(false);
        typingTimerRef.current = null;
        addMsg("assistant", text);
      }, Math.max(0, delayMs | 0));
    },
    [addMsg, clearTypingTimer],
  );

  const vipRankGuess = useMemo(() => {
    return guessVipRankFromEnv({ authUserId, canVoiceTest, ctx });
  }, [authUserId, canVoiceTest, ctx]);

  const tierKey = useMemo<TierKey>(() => tierFromRank(vipRankGuess), [vipRankGuess]);
  const aiDailyLimit = useMemo(() => dailyAiLimitForTier(tierKey), [tierKey]);

  const [aiUsedToday, setAiUsedToday] = useState(0);

  useEffect(() => {
    if (!mounted) return;
    const used = readAiUsed(appKey, tierKey);
    setAiUsedToday(used);
  }, [mounted, appKey, tierKey, open]);

  const bumpAiUsed = useCallback(
    (nextUsed: number) => {
      setAiUsedToday(nextUsed);
      writeAiUsed(appKey, tierKey, nextUsed);
    },
    [appKey, tierKey],
  );

  const pageHint = useMemo(() => {
    const p = location.pathname || "/";
    if (p.startsWith("/signin")) return lang === "vi" ? "Hỗ trợ đăng nhập" : "Login help";
    if (p.startsWith("/room/")) return lang === "vi" ? "Hỗ trợ phòng học" : "Room help";
    if (p.startsWith("/tiers")) return lang === "vi" ? "Chọn gói" : "Choose a plan";
    return lang === "vi" ? "Hỗ trợ" : "Help";
  }, [location.pathname, lang]);

  const headerSubtitle = useMemo(() => {
    switch (mode) {
      case "email":
        return lang === "vi" ? "Hỗ trợ email" : "Email help";
      case "billing":
        return lang === "vi" ? "Hỗ trợ gói / thanh toán" : "Plan & billing help";
      case "about":
        return lang === "vi" ? "Giới thiệu" : "About";
      default:
        return pageHint;
    }
  }, [mode, pageHint, lang]);

  const contextLine = useMemo(() => {
    const c = (ctx as HostContext | null | undefined) ?? null;
    const rid = c?.roomId ?? roomIdFromUrl;
    const parts: string[] = [];
    if (c?.roomTitle) parts.push(c.roomTitle);
    else if (rid) parts.push(rid);
    if (c?.entryId) parts.push(`entry:${c.entryId}`);
    if (c?.keyword) parts.push(`kw:${c.keyword}`);
    return parts.length ? parts.join(" • ") : null;
  }, [ctx, roomIdFromUrl]);

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
    const c = (ctx as HostContext | null | undefined) ?? null;
    const rid = c?.roomId ?? roomIdFromUrl;
    const returnTo = rid ? `/room/${rid}` : location.pathname || "/";
    navigate(`/tiers?returnTo=${encodeURIComponent(returnTo)}`);
  }, [ctx, roomIdFromUrl, location.pathname, navigate]);

  const baseAssistantHome = useMemo(() => {
    const name = displayName ? ` ${displayName}` : "";

    const p_en =
      lastProgress?.roomId && !isSignin
        ? `Last time: ${lastProgress.roomId}${lastProgress.keyword ? ` • kw:${lastProgress.keyword}` : ""}${
            lastProgress.next ? `\nNext: ${lastProgress.next}` : ""
          }`
        : "";

    const p_vi =
      lastProgress?.roomId && !isSignin
        ? `Lần trước: ${lastProgress.roomId}${lastProgress.keyword ? ` • kw:${lastProgress.keyword}` : ""}${
            lastProgress.next ? `\nBước tiếp: ${lastProgress.next}` : ""
          }`
        : "";

    const aiLine_en = `AI today: ${Math.min(aiUsedToday, aiDailyLimit)}/${aiDailyLimit} • Tip: type “fix grammar:” to correct grammar.`;
    const aiLine_vi = `AI hôm nay: ${Math.min(aiUsedToday, aiDailyLimit)}/${aiDailyLimit} • Gợi ý: gõ “fix grammar:” để sửa ngữ pháp.`;

    const pronLine_en = "Pronunciation coaching (read aloud + corrections) is coming soon.";
    const pronLine_vi = "Luyện phát âm (đọc to và được góp ý) sẽ có sớm.";

    const enText = `Hi${name}. I’m Mercy Host.\n${p_en ? p_en + "\n" : ""}${aiLine_en}\n${pronLine_en}\nWhat do you need right now?\n• Choose a plan (/tiers)\n• Take a mini test\n• Start learning in a room\n• Report a problem (audio/UI)`;

    const viText = `Chào${name}. Mình là Mercy Host.\n${p_vi ? p_vi + "\n" : ""}${aiLine_vi}\n${pronLine_vi}\nBạn muốn làm gì ngay bây giờ?\n• Chọn gói (/tiers)\n• Làm mini test\n• Vào phòng học\n• Báo lỗi (audio/UI)`;

    return bi(enText, viText);
  }, [displayName, lastProgress, isSignin, aiUsedToday, aiDailyLimit]);

  const seedIfEmpty = useCallback(
    (nextMode: PanelMode) => {
      setMessages((prev) => {
        if (prev.length) return prev;
        const first =
          nextMode === "home"
            ? baseAssistantHome
            : bi(`Hi. Ask me anything about ${nextMode}.`, `Chào. Hỏi mình về ${nextMode}.`);
        return [
          {
            id: `a_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`,
            role: "assistant",
            text: first,
          },
        ];
      });
    },
    [baseAssistantHome],
  );

  const repeatApi: any = useRepeatLoop();
  const repeatTarget = repeatApi?.repeatTarget ?? null;
  const repeatStep = repeatApi?.repeatStep ?? "idle";
  const repeatCount = repeatApi?.repeatCount ?? 0;

  const setRepeatStep = repeatApi?.setRepeatStep ?? (() => {});
  const clearRepeatBase = repeatApi?.clearRepeat ?? (() => {});
  const startRepeat = repeatApi?.startRepeat ?? (() => {});
  const ackRepeat = repeatApi?.ackRepeat ?? (() => {});

  const [repeatSeenAt, setRepeatSeenAt] = useState<number | null>(null);
  const [heartBurst, setHeartBurst] = useState(false);
  const heartTimerRef = useRef<number | null>(null);

  const clearHeart = useCallback(() => {
    if (heartTimerRef.current !== null) window.clearTimeout(heartTimerRef.current);
    heartTimerRef.current = null;
    setHeartBurst(false);
  }, []);

  const triggerHeart = useCallback(
    (_k?: string) => {
      clearHeart();
      setHeartBurst(true);
      heartTimerRef.current = window.setTimeout(() => {
        heartTimerRef.current = null;
        setHeartBurst(false);
      }, 920);
    },
    [clearHeart],
  );

  const clearRepeat = useCallback(() => {
    clearRepeatBase();
    setRepeatSeenAt(null);
    clearHeart();
  }, [clearRepeatBase, clearHeart]);

  const requestPlayRepeat = useCallback(() => {
    setRepeatStep("play");
  }, [setRepeatStep]);

  const tryAcknowledgeRepeat = useCallback(
    (userText: string): RepeatAckResult | null => {
      if (!repeatTarget) return null;
      if (repeatStep !== "your_turn") return null;

      const t = (userText ?? "").trim().toLowerCase();
      const ok =
        t === "ok" ||
        t === "okay" ||
        t === "done" ||
        t === "repeated" ||
        t === "i repeated it" ||
        t === "xong";
      if (!ok) return null;

      ackRepeat();

      if (typeof repeatCount === "number" && repeatCount + 1 === 3) triggerHeart("repeat3");

      return { handled: true };
    },
    [repeatTarget, repeatStep, ackRepeat, repeatCount, triggerHeart],
  );

  const [feedbackState, setFeedbackState] = useState<
    Record<string, { vote: FeedbackVote; reason?: FeedbackReason }>
  >(() =>
    safeGetLSJson<Record<string, { vote: FeedbackVote; reason?: FeedbackReason }>>(
      feedbackStateKey(appKey),
      {},
    ),
  );

  useEffect(() => {
    safeSetLSJson(feedbackStateKey(appKey), feedbackState);
  }, [feedbackState, appKey]);

  const anonId = useMemo(() => getOrCreateAnonId(), []);
  const [fbDrain, setFbDrain] = useState<FeedbackDrainState>(() =>
    safeGetLSJson<FeedbackDrainState>(feedbackDrainStateKey(appKey), FEEDBACK_DRAIN_DEFAULT),
  );

  useEffect(() => {
    safeSetLSJson(feedbackDrainStateKey(appKey), fbDrain);
  }, [fbDrain, appKey]);

  const fbDrainInFlightRef = useRef(false);
  const fbDrainTimerRef = useRef<number | null>(null);
  const drainFeedbackQueueRef = useRef<
    ((why: "open" | "enqueue" | "timer" | "visibility" | "online") => void) | null
  >(null);

  const clearFbDrainTimer = useCallback(() => {
    if (fbDrainTimerRef.current !== null) window.clearTimeout(fbDrainTimerRef.current);
    fbDrainTimerRef.current = null;
  }, []);

  const scheduleFbDrain = useCallback(
    (delayMs: number, why: "timer" | "enqueue" = "timer") => {
      clearFbDrainTimer();
      fbDrainTimerRef.current = window.setTimeout(() => {
        fbDrainTimerRef.current = null;
        try {
          drainFeedbackQueueRef.current?.(why);
        } catch {
          // ignore
        }
      }, Math.max(0, delayMs | 0));
    },
    [clearFbDrainTimer],
  );

  const drainFeedbackQueue = useCallback(
    async (_why: "open" | "enqueue" | "timer" | "visibility" | "online") => {
      if (fbDrainInFlightRef.current) return;

      try {
        if (
          typeof navigator !== "undefined" &&
          "onLine" in navigator &&
          (navigator as any).onLine === false
        ) {
          return;
        }
      } catch {
        // ignore
      }

      const now = Date.now();
      const st = safeGetLSJson<FeedbackDrainState>(
        feedbackDrainStateKey(appKey),
        FEEDBACK_DRAIN_DEFAULT,
      );
      if (st.nextAttemptAt && now < st.nextAttemptAt) return;

      const qKey = feedbackQueueKey(appKey);
      const qAll = safeGetLSJson<HostFeedbackEvent[]>(qKey, []);
      if (!qAll.length) {
        setFbDrain((prev) => ({ ...prev, nextAttemptAt: 0, backoffMs: 0, failCount: 0 }));
        return;
      }

      const BATCH_SIZE = 10;
      const batch = qAll.slice(0, BATCH_SIZE);

      const c = (ctx as any) ?? {};
      const rid = c?.roomId ?? roomIdFromUrl ?? undefined;

      const payload = toFeedbackPayload({
        appKey,
        client: {
          version: "MB-BLUE-101.7i",
          buildTime: "2026-03-08T00:00:00.000Z",
        },
        actor: {
          authUserId: authUserId ?? undefined,
          authEmail: authEmail || undefined,
          anonId,
        },
        context: {
          pagePath: location.pathname || "/",
          mode,
          contextLine,
          roomId: rid,
          entryId: c?.entryId ?? undefined,
          keyword: c?.keyword ?? undefined,
          repeat: {
            active: Boolean(repeatTarget),
            step: String(repeatStep ?? "idle"),
            count: typeof repeatCount === "number" ? repeatCount : 0,
          },
        },
        items: batch,
        signals: {
          aiUsedToday,
          aiDailyLimit,
          tier: tierKey,
          autoVoice,
        },
      });

      fbDrainInFlightRef.current = true;
      try {
        const r = await fetch("/api/mercy-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (r.status === 429 || r.status >= 500) {
          const retryAfterSec = parseIntLoose(r.headers.get("retry-after")) ?? null;
          const base =
            retryAfterSec !== null
              ? clamp(retryAfterSec * 1000, 1000, 10 * 60 * 1000)
              : nextBackoffMs(st.backoffMs);
          const nextAttemptAt = Date.now() + base;

          setFbDrain({
            nextAttemptAt,
            backoffMs: base,
            failCount: (st.failCount ?? 0) + 1,
            lastOkAt: st.lastOkAt ?? 0,
          });
          scheduleFbDrain(base, "timer");
          return;
        }

        if (!r.ok) {
          const base = 60 * 60 * 1000;
          setFbDrain({
            nextAttemptAt: Date.now() + base,
            backoffMs: base,
            failCount: (st.failCount ?? 0) + 1,
            lastOkAt: st.lastOkAt ?? 0,
          });
          return;
        }

        let acceptedCount = batch.length;
        try {
          const j = await r.json();
          if (typeof j?.acceptedCount === "number") {
            acceptedCount = Math.max(0, Math.min(batch.length, j.acceptedCount));
          }
        } catch {
          // ignore
        }

        const remaining = qAll.slice(acceptedCount);
        safeSetLSJson(qKey, remaining);

        setFbDrain({ nextAttemptAt: 0, backoffMs: 0, failCount: 0, lastOkAt: Date.now() });

        if (remaining.length) scheduleFbDrain(120, "timer");
      } catch {
        const base = nextBackoffMs(st.backoffMs);
        const nextAttemptAt = Date.now() + base;
        setFbDrain({
          nextAttemptAt,
          backoffMs: base,
          failCount: (st.failCount ?? 0) + 1,
          lastOkAt: st.lastOkAt ?? 0,
        });
        scheduleFbDrain(base, "timer");
      } finally {
        fbDrainInFlightRef.current = false;
      }
    },
    [
      appKey,
      anonId,
      authUserId,
      authEmail,
      location.pathname,
      mode,
      contextLine,
      ctx,
      roomIdFromUrl,
      repeatTarget,
      repeatStep,
      repeatCount,
      aiUsedToday,
      aiDailyLimit,
      tierKey,
      autoVoice,
      scheduleFbDrain,
    ],
  );

  useEffect(() => {
    drainFeedbackQueueRef.current = (why) => {
      void drainFeedbackQueue(why);
    };
    return () => {
      drainFeedbackQueueRef.current = null;
    };
  }, [drainFeedbackQueue]);

  useEffect(() => {
    if (!open) return;
    void drainFeedbackQueue("open");
  }, [open, drainFeedbackQueue]);

  useEffect(() => {
    const onVis = () => {
      try {
        if (document.visibilityState === "visible") {
          void drainFeedbackQueue("visibility");
        }
      } catch {
        // ignore
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [drainFeedbackQueue]);

  useEffect(() => {
    const onOnline = () => void drainFeedbackQueue("online");
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [drainFeedbackQueue]);

  useEffect(() => {
    return () => {
      clearFbDrainTimer();
    };
  }, [clearFbDrainTimer]);

  const pushFeedback = useCallback(
    (ev: HostFeedbackEvent) => {
      const key = feedbackQueueKey(appKey);
      const q = safeGetLSJson<HostFeedbackEvent[]>(key, []);
      const next = [...q, ev];
      const capped = next.length > 200 ? next.slice(next.length - 200) : next;
      safeSetLSJson(key, capped);

      scheduleFbDrain(250, "enqueue");
    },
    [appKey, scheduleFbDrain],
  );

  const setFeedbackForMsg = useCallback(
    (args: { msgId: string; vote: FeedbackVote; reason?: FeedbackReason; assistantText?: string }) => {
      const { msgId, vote, reason, assistantText } = args;

      const lastUser = [...messages].reverse().find((m) => m.role === "user")?.text ?? "";
      const c = (ctx as any) ?? {};

      setFeedbackState((prev) => {
        const existing = prev[msgId];
        const shouldClear = existing?.vote === vote && !reason && !existing?.reason;
        if (shouldClear) {
          const copy = { ...prev };
          delete copy[msgId];
          return copy;
        }
        return { ...prev, [msgId]: { vote, reason: reason ?? existing?.reason } };
      });

      const event: HostFeedbackEvent = {
        v: 1,
        ts: Date.now(),
        appKey,
        authUserId,
        tier: tierKey,
        lang,
        mode,
        path: location.pathname || "/",
        roomId: c?.roomId ?? roomIdFromUrl ?? undefined,
        entryId: c?.entryId ?? undefined,
        keyword: c?.keyword ?? undefined,
        contextLine,
        msgId,
        vote,
        reason,
        assistantSnippet: clip(assistantText ?? "", 280),
        lastUserSnippet: clip(lastUser, 180),
        repeatStep:
          typeof repeatApi?.repeatStep === "string" ? repeatApi.repeatStep : String(repeatStep ?? ""),
        repeatCount: typeof repeatCount === "number" ? repeatCount : undefined,
      };

      pushFeedback(event);
    },
    [
      appKey,
      authUserId,
      tierKey,
      lang,
      mode,
      location.pathname,
      ctx,
      roomIdFromUrl,
      contextLine,
      messages,
      pushFeedback,
      repeatApi,
      repeatStep,
      repeatCount,
    ],
  );

  const upReasons = useMemo(
    () =>
      [
        { id: "helpful" as const, en: "Helpful", vi: "Hữu ích" },
        { id: "clear" as const, en: "Clear", vi: "Rõ ràng" },
        { id: "friendly" as const, en: "Friendly", vi: "Dễ chịu" },
        { id: "fixed_it" as const, en: "Fixed it", vi: "Sửa đúng" },
      ] as const,
    [],
  );

  const downReasons = useMemo(
    () =>
      [
        { id: "wrong" as const, en: "Wrong", vi: "Sai" },
        { id: "not_relevant" as const, en: "Not relevant", vi: "Không đúng ý" },
        { id: "confusing" as const, en: "Confusing", vi: "Khó hiểu" },
        { id: "too_long" as const, en: "Too long", vi: "Dài quá" },
        { id: "audio_ui" as const, en: "Audio/UI", vi: "Âm thanh/UI" },
        { id: "other" as const, en: "Other", vi: "Khác" },
      ] as const,
    [],
  );

  useEffect(() => {
    if (isAdmin) return;

    const onEvt = (evt: Event) => {
      const ce = evt as CustomEvent<any>;
      const detail = ce?.detail ?? null;
      if (!detail) return;

      setOpen(true);
      seedIfEmpty(mode);

      const target = {
        text_en: detail.text_en ?? detail.textEn ?? "",
        text_vi: detail.text_vi ?? detail.textVi ?? "",
        audio_url: detail.audio_url ?? detail.audioUrl ?? "",
        room_id: detail.room_id ?? detail.roomId ?? "",
        entry_id: detail.entry_id ?? detail.entryId ?? "",
        keyword: detail.keyword ?? "",
        roomId: detail.roomId ?? detail.room_id ?? "",
        entryId: detail.entryId ?? detail.entry_id ?? "",
      };

      startRepeat(target);
      setRepeatSeenAt(Date.now());

      setCtx((prev) => ({
        ...(prev as any),
        roomId: target.roomId || (prev as any)?.roomId,
        entryId: target.entryId || (prev as any)?.entryId,
        keyword: target.keyword || (prev as any)?.keyword,
        focus_en: (String(target.text_en ?? "").trim() || (prev as any)?.focus_en) as any,
        focus_vi: (String(target.text_vi ?? "").trim() || (prev as any)?.focus_vi) as any,
      }));

      if (target.audio_url) setRepeatStep("play");
      else setRepeatStep("your_turn");
    };

    window.addEventListener("mb:host-repeat-target", onEvt as EventListener);
    return () => window.removeEventListener("mb:host-repeat-target", onEvt as EventListener);
  }, [isAdmin, seedIfEmpty, mode, startRepeat, setRepeatStep, setCtx]);

  const repeatCoach = useMemo(() => {
    if (!repeatTarget) return null;

    const en = (repeatTarget.text_en ?? "").trim();
    const vi = (repeatTarget.text_vi ?? "").trim();
    const keyword = (repeatTarget.keyword ?? "").trim();

    const words = en ? en.split(/\s+/).filter(Boolean).length : 0;
    const bucket: "short" | "medium" | "long" =
      words > 14 ? "long" : words > 7 ? "medium" : "short";

    const goal = lang === "vi" ? "Mục tiêu: nói trơn tru 3 lần." : "Goal: say it smoothly 3 times.";

    const calmLine =
      lang === "vi"
        ? repeatStep === "play"
          ? "Bước 1: nghe một lần."
          : repeatStep === "your_turn"
            ? "Bước 2: đến lượt bạn."
            : "Bước 3: nghe lại để so nhịp."
        : repeatStep === "play"
          ? "Step 1: listen once."
          : repeatStep === "your_turn"
            ? "Step 2: your turn."
            : "Step 3: listen again for rhythm.";

    const micro =
      lang === "vi"
        ? bucket === "long"
          ? "Tập trung nhịp điệu, không cần hoàn hảo."
          : bucket === "medium"
            ? "Chia 2 nhịp. Nói chậm và rõ."
            : "Một hơi. Âm cuối rõ."
        : bucket === "long"
          ? "Focus on rhythm, not perfection."
          : bucket === "medium"
            ? "Two chunks. Slow and clear."
            : "One breath. Clear endings.";

    const kwHint = keyword && lang === "vi" ? `Từ khóa: ${keyword}` : keyword ? `Keyword: ${keyword}` : null;

    const showEn = en || null;
    const showVi = vi || null;

    return { goal, calmLine, micro, kwHint, showEn, showVi, bucket };
  }, [repeatTarget, repeatStep, lang]);

  useEffect(() => {
    clearRepeatNudgeTimer();
    if (!open) return;
    if (!repeatTarget) return;
    if (repeatStep !== "your_turn") return;

    const key = `${repeatTarget.roomId ?? repeatTarget.room_id ?? ""}|${
      repeatTarget.entryId ?? repeatTarget.entry_id ?? ""
    }|${repeatTarget.keyword ?? ""}|${repeatSeenAt ?? ""}|your_turn`;
    if (repeatNudgedKeyRef.current === key) return;

    repeatNudgeTimerRef.current = window.setTimeout(() => {
      repeatNudgeTimerRef.current = null;
      repeatNudgedKeyRef.current = key;

      scheduleAssistantMsg(
        bi("That is fine. Try once more, a little slower.", "Không sao. Thử lại chậm hơn một chút."),
        0,
      );
    }, 12000);
  }, [
    open,
    repeatTarget,
    repeatStep,
    repeatSeenAt,
    clearRepeatNudgeTimer,
    scheduleAssistantMsg,
  ]);

  const makeReplyRaw = useMakeReply();

  const makeReplyFn = useMemo(() => {
    if (typeof makeReplyRaw === "function") return makeReplyRaw as any;
    const maybe = makeReplyRaw as any;
    if (typeof maybe?.makeReply === "function") return maybe.makeReply as any;
    if (typeof maybe?.default === "function") return maybe.default as any;
    return null;
  }, [makeReplyRaw]);

  const pickPraise = useCallback(() => {
    const en = [
      "Good. Keep it relaxed.",
      "That was clear.",
      "Yes. Keep the rhythm.",
      "Nice. One more time.",
      "Good. Same pace.",
    ];
    const vi = [
      "Tốt. Giữ thư thái.",
      "Rõ rồi.",
      "Đúng. Giữ nhịp.",
      "Ổn. Thêm một lần.",
      "Tốt. Giữ tốc độ.",
    ];
    const idx = Math.floor(Math.random() * en.length);
    return bi(en[idx] ?? "Good.", vi[idx] ?? "Tốt.");
  }, []);

  const quotaBlockMessage = useCallback((tier: TierKey, used: number, limit: number) => {
    const next = tierNextUpgrade(tier);
    const nextLabel = tierLabel(next);

    const en = `You’ve used today’s AI messages (${Math.min(
      used,
      limit,
    )}/${limit}).\n${nextLabel} gives you more practice with less friction.\nType /tiers to upgrade.`;
    const vi = `Bạn đã dùng hết lượt AI hôm nay (${Math.min(
      used,
      limit,
    )}/${limit}).\n${nextLabel} giúp bạn luyện tiếp mượt hơn.\nGõ /tiers để nâng cấp.`;

    return bi(en, vi);
  }, []);

  const rollingSummary = useMemo(() => {
    const c = (ctx as any) ?? {};
    const rid = c?.roomId ?? roomIdFromUrl;
    const kw = c?.keyword ?? "";
    return buildRollingSummary({
      lang,
      mode,
      contextLine,
      roomId: rid,
      keyword: kw,
      repeatActive: Boolean(repeatTarget),
      repeatStep: String(repeatStep ?? "idle"),
      messages: messages.map((m) => ({ role: m.role, text: m.text })),
    });
  }, [ctx, roomIdFromUrl, lang, mode, contextLine, repeatTarget, repeatStep, messages]);

  const callMercyAi = useCallback(
    async (userText: string) => {
      const c = (ctx as any) ?? {};
      const payload = {
        userText,
        lang,
        summary: rollingSummary,
        context: {
          roomId: c?.roomId ?? roomIdFromUrl ?? "",
          roomTitle: c?.roomTitle ?? "",
          keyword: c?.keyword ?? "",
          entryId: c?.entryId ?? "",
        },
        history: messages.slice(-4).map((m) => ({ role: m.role, text: m.text })),
      };

      const r = await fetch("/api/mercy-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) throw new Error(`mercy-ai http ${r.status}`);
      const j = await r.json();
      const text = norm(j?.text);
      return text || null;
    },
    [lang, ctx, roomIdFromUrl, messages, rollingSummary],
  );

  const assistantRespond = useCallback(
    (userText: string, currentMode: PanelMode) => {
      const textTrim = (userText ?? "").trim();
      const lower = textTrim.toLowerCase();

      if (looksLikeHello(textTrim)) {
        clearTypingTimer();
        setIsTyping(false);

        const name = displayName ? ` ${displayName}` : "";
        addMsg(
          "assistant",
          bi(
            `Hello${name}. Good to see you.\nWhat do you want to do right now?`,
            `Chào${name}. Rất vui gặp bạn.\nBạn muốn làm gì ngay bây giờ?`,
          ),
        );
        return;
      }

      if (looksLikeStuck(textTrim)) {
        clearTypingTimer();
        setIsTyping(false);

        addMsg(
          "assistant",
          teacherNextStep({
            lang,
            hasProgress: Boolean(lastProgress?.roomId) && !isSignin,
          }),
        );
        return;
      }

      const looksLikeRepeatAck =
        repeatTarget && repeatStep === "your_turn"
          ? /(i\s*repeated|repeated|done|ok|okay|again|repeat|xong)/i.test(textTrim)
          : false;

      const isCommand = lower.startsWith("/");

      clearTypingTimer();
      setIsTyping(true);

      const delayMs = looksLikeRepeatAck ? 220 : 520;

      typingTimerRef.current = window.setTimeout(async () => {
        setIsTyping(false);
        typingTimerRef.current = null;

        const ack = tryAcknowledgeRepeat ? tryAcknowledgeRepeat(userText) : null;
        if (ack?.handled) {
          addMsg("assistant", pickPraise());

          if (repeatTarget) {
            const follow = bi(
              repeatCount + 1 >= 3 ? "Good. You can move on." : "Now listen once more, then repeat.",
              repeatCount + 1 >= 3
                ? "Tốt. Bạn có thể chuyển sang câu tiếp theo."
                : "Giờ nghe lại một lần, rồi nói lại.",
            );
            scheduleAssistantMsg(follow, 600);
          }

          return;
        }

        const wantsAi = !isCommand && shouldUseAiBrain(textTrim);
        if (wantsAi) {
          const shouldCount = shouldCountAsAiMessage(textTrim, currentMode);
          const usedNow = readAiUsed(appKey, tierKey);
          const limit = aiDailyLimit;

          if (shouldCount && usedNow >= limit) {
            addMsg("assistant", quotaBlockMessage(tierKey, usedNow, limit));
            setMode("billing");
            return;
          }

          try {
            const aiText = await callMercyAi(textTrim);
            if (aiText) {
              if (shouldCount) bumpAiUsed(usedNow + 1);
              addMsg("assistant", ensureBilingual(aiText));
              return;
            }
          } catch {
            // fall through
          }
        }

        if (typeof makeReplyFn !== "function") {
          addMsg(
            "assistant",
            bi(
              "Host is in a bad state (makeReply). Please refresh (Cmd+R).",
              "Host đang lỗi (makeReply). Bạn refresh trang (Cmd+R) giúp mình nhé.",
            ),
          );
          return;
        }

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
          chatSummary: rollingSummary,
          repeatTarget,
          repeatStep,
          repeatCount,
          testActive,
          testStep,
          testScore,
          onTestUpdate: (next: { active?: boolean; step?: number; score?: number }) => {
            if (typeof next.active === "boolean") setTestActive(next.active);
            if (typeof next.step === "number") setTestStep(next.step as 0 | 1 | 2 | 3);
            if (typeof next.score === "number") setTestScore(next.score);
          },
          onSetRepeatStep: (s: any) => setRepeatStep(s),
          onTriggerHeart: (k: any) => triggerHeart(String(k)),
          onClearHeart: () => clearHeart(),
        });

        addMsg("assistant", ensureBilingual(reply));
      }, delayMs);
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
      scheduleAssistantMsg,
      pickPraise,
      tierKey,
      displayName,
      callMercyAi,
      aiDailyLimit,
      quotaBlockMessage,
      bumpAiUsed,
      lastProgress?.roomId,
      isSignin,
      rollingSummary,
    ],
  );

  const openPanel = useCallback(() => {
    setOpen(true);

    const wasEmpty = messages.length === 0;
    seedIfEmpty(mode);

    if (wasEmpty) {
      const first =
        mode === "home"
          ? baseAssistantHome
          : bi(`Hi. Ask me anything about ${mode}.`, `Chào. Hỏi mình về ${mode}.`);
      window.setTimeout(() => {
        maybeSpeakAssistant(first);
      }, 60);
    }
  }, [messages.length, seedIfEmpty, mode, baseAssistantHome, maybeSpeakAssistant]);

  const closePanel = useCallback(() => {
    setOpen(false);
    clearTypingTimer();
    clearRepeatNudgeTimer();
    setIsTyping(false);

    stopVoice?.();
    stopBrowserTTS();
  }, [clearTypingTimer, clearRepeatNudgeTimer, stopVoice]);

  const onSend = useCallback(() => {
    const text = (draft ?? "").trim();
    if (!text) return;

    setDraft("");
    addMsg("user", text);

    const lower = text.toLowerCase().trim();
    if (lower === "/tiers") {
      goTiers();
      addMsg("assistant", bi("OK. Opening /tiers.", "OK. Mở trang /tiers."));
      return;
    }
    if (lower === "/email") setMode("email");
    if (lower === "/billing") setMode("billing");
    if (lower === "/about") setMode("about");
    if (lower === "/home") setMode("home");

    if (lower === "/repeat clear") {
      clearRepeat();
      addMsg("assistant", bi("Repeat cleared.", "Đã xóa repeat."));
      return;
    }

    assistantRespond(text, mode);
  }, [draft, addMsg, assistantRespond, mode, goTiers, clearRepeat]);

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
    [onSend, closePanel],
  );

  const actions = useHostActions({
    lang,
    onGoTiers: goTiers,
    addAssistantMsg: (t: string) => addMsg("assistant", ensureBilingual(t)),
    clearChat: () => setMessages([]),
    setMode,
    startMiniTest: () => {
      setTestActive(true);
      setTestStep(1);
      setTestScore(0);
      addMsg(
        "assistant",
        bi(
          `OK. Mini test (3 questions).\nQ1) “I ___ coffee.”\nA) like  B) likes  C) liking`,
          `OK. Mini test (3 câu).\nQ1) “I ___ coffee.”\nA) like  B) likes  C) liking`,
        ),
      );
    },
    canVoiceTest,
    speak,
  });

  const safeActions = Array.isArray(actions) ? actions : [];

  (useDevHostState as any)({
    open,
    mode,
    page: location.pathname,
    roomId: (ctx as any)?.roomId ?? roomIdFromUrl,
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
    autoVoice,
    rollingSummary,
  });

  const isBrowser = typeof document !== "undefined";

  const fontStack =
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';

  const repeatPrimaryAction = useMemo(() => {
    if (!repeatTarget) return null;

    const hasAudio = Boolean(repeatTarget.audio_url);
    const step = repeatStep;

    if (step === "play") {
      return {
        id: "play",
        label: "Play",
        onClick: () => {
          if (hasAudio) requestPlayRepeat();
          setRepeatStep("your_turn");
        },
      };
    }

    if (step === "your_turn") {
      return {
        id: "ack",
        label: lang === "vi" ? "Tôi đã nhại lại" : "I repeated it",
        onClick: () => {
          const userText = "ok";
          addMsg("user", userText);
          assistantRespond(userText, mode);
          setRepeatStep("compare");
        },
      };
    }

    return {
      id: "again",
      label: hasAudio
        ? lang === "vi"
          ? "Nghe lại"
          : "Play again"
        : lang === "vi"
          ? "Đến lượt tôi"
          : "My turn",
      onClick: () => {
        if (hasAudio) requestPlayRepeat();
        setRepeatStep("your_turn");
      },
    };
  }, [repeatTarget, repeatStep, requestPlayRepeat, setRepeatStep, lang, addMsg, assistantRespond, mode]);

  const quotaBadge = useMemo(() => {
    const used = aiUsedToday;
    const limit = aiDailyLimit;
    const tier = tierLabel(tierKey);

    const text = `${tier} • AI ${Math.min(used, limit)}/${limit}`;
    const warn = used >= limit;
    return { text, warn };
  }, [aiUsedToday, aiDailyLimit, tierKey]);

  const hasAnyVoice = typeof speak === "function" || canBrowserSpeak();

  const chipStyle = {
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    padding: "5px 8px",
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
    color: "rgba(0,0,0,0.78)",
  } as React.CSSProperties;

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
      {heartBurst ? (
        <div
          data-mb-host-heartwrap
          aria-hidden="true"
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            width: 460,
            maxWidth: "92vw",
            height: 220,
            pointerEvents: "none",
            zIndex: 2147483001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "mbHostBurstWrap 920ms ease-out forwards",
          }}
        >
          <style>{`
            @keyframes mbHostBurstWrap{
              0% { opacity: 1; }
              100% { opacity: 0; }
            }
            @keyframes mbHostHeart{
              0%   { opacity: 0; transform: translate(0,0) scale(0.65); }
              18%  { opacity: 0.95; transform: translate(0,-6px) scale(1.0); }
              100% { opacity: 0; transform: translate(0,-52px) scale(1.1); }
            }
          `}</style>
          {Array.from({ length: 7 }).map((_, i) => {
            const dx = [-88, -54, -22, 0, 22, 54, 88][i] ?? 0;
            const delay = i * 45;
            const size = i % 2 === 0 ? 18 : 16;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  fontSize: size,
                  opacity: 0,
                  transform: "translate(0,0) scale(0.65)",
                  animation: `mbHostHeart 880ms ease-out ${delay}ms forwards`,
                  left: `calc(50% + ${dx}px)`,
                  top: "48%",
                }}
              >
                ♥
              </div>
            );
          })}
        </div>
      ) : null}

      <div
        onMouseDown={closePanel}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "transparent",
        }}
      />

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
                <Suspense fallback={<FaceFallback size={44} />}>
                  <TalkingFaceIcon size={44} isTalking={isTyping} />
                </Suspense>
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

                <div
                  style={{
                    marginTop: 6,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 11,
                    fontWeight: 800,
                    color: quotaBadge.warn ? "rgba(0,0,0,0.82)" : "rgba(0,0,0,0.60)",
                    background: quotaBadge.warn ? "rgba(0,0,0,0.10)" : "rgba(0,0,0,0.06)",
                    borderRadius: 999,
                    padding: "4px 10px",
                  }}
                  title={lang === "vi" ? "Giới hạn AI theo ngày" : "Daily AI limit"}
                >
                  {quotaBadge.text}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={toggleAutoVoice}
                title={
                  autoVoice
                    ? lang === "vi"
                      ? "Tắt giọng"
                      : "Mute voice"
                    : lang === "vi"
                      ? "Bật giọng"
                      : "Enable voice"
                }
                style={{
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "#fff",
                  borderRadius: 999,
                  height: 32,
                  padding: "0 10px",
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: "pointer",
                  color: "rgba(0,0,0,0.70)",
                }}
              >
                {autoVoice ? "🔊" : "🔇"}
              </button>

              {hasAnyVoice ? (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      stopVoice?.();
                    } catch {
                      // ignore
                    }
                    stopBrowserTTS();
                  }}
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
                    opacity: isSpeaking ? 1 : 0.9,
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
            {repeatTarget && repeatCoach ? (
              <div
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "rgba(0,0,0,0.03)",
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111" }}>
                  {repeatCoach.calmLine}
                </div>

                <div style={{ fontSize: 11, color: "rgba(0,0,0,0.70)", marginTop: 6 }}>
                  {repeatCoach.goal}
                </div>

                <div style={{ fontSize: 11, color: "rgba(0,0,0,0.60)", marginTop: 6 }}>
                  {repeatCoach.micro}
                  {repeatCoach.kwHint ? ` • ${repeatCoach.kwHint}` : ""}
                  {typeof repeatCount === "number" ? ` • ${Math.min(3, repeatCount)}/3` : ""}
                  {repeatSeenAt ? ` • ${new Date(repeatSeenAt).toLocaleTimeString()}` : ""}
                </div>

                {repeatCoach.showEn ? (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#111",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {repeatCoach.showEn}
                  </div>
                ) : null}

                {repeatCoach.showVi ? (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: "rgba(0,0,0,0.78)",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {repeatCoach.showVi}
                  </div>
                ) : null}

                {repeatPrimaryAction ? (
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <button
                      type="button"
                      onClick={repeatPrimaryAction.onClick}
                      style={{
                        borderRadius: 999,
                        border: "1px solid rgba(0,0,0,0.12)",
                        background: "#111",
                        padding: "8px 12px",
                        fontSize: 12,
                        fontWeight: 900,
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.92)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {repeatPrimaryAction.id === "play" || repeatPrimaryAction.id === "again" ? (
                        <span
                          aria-hidden="true"
                          style={{ display: "inline-flex", alignItems: "center" }}
                        >
                          <Suspense fallback={<FaceFallback size={18} />}>
                            <TalkingFaceIcon size={18} isTalking={false} />
                          </Suspense>
                        </span>
                      ) : null}
                      {repeatPrimaryAction.label}
                    </button>

                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(0,0,0,0.55)",
                        textAlign: "right",
                      }}
                    >
                      {lang === "vi"
                        ? "Gõ /repeat clear để xóa."
                        : "Type /repeat clear to clear."}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {messages.map((m) => {
              const isUser = m.role === "user";
              const fb = !isUser ? feedbackState[m.id] : undefined;
              const showReasons = Boolean(fb?.vote);
              const reasons = fb?.vote === "down" ? downReasons : upReasons;

              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
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

                  {!isUser ? (
                    <div
                      style={{
                        marginTop: 6,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        maxWidth: "86%",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() =>
                            setFeedbackForMsg({ msgId: m.id, vote: "up", assistantText: m.text })
                          }
                          title={lang === "vi" ? "Hữu ích" : "Helpful"}
                          style={{
                            borderRadius: 999,
                            border: "1px solid rgba(0,0,0,0.12)",
                            background: fb?.vote === "up" ? "rgba(0,0,0,0.08)" : "#fff",
                            padding: "4px 9px",
                            fontSize: 12,
                            fontWeight: 900,
                            cursor: "pointer",
                            color: "rgba(0,0,0,0.75)",
                          }}
                        >
                          👍
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setFeedbackForMsg({ msgId: m.id, vote: "down", assistantText: m.text })
                          }
                          title={lang === "vi" ? "Không hữu ích" : "Not helpful"}
                          style={{
                            borderRadius: 999,
                            border: "1px solid rgba(0,0,0,0.12)",
                            background: fb?.vote === "down" ? "rgba(0,0,0,0.08)" : "#fff",
                            padding: "4px 9px",
                            fontSize: 12,
                            fontWeight: 900,
                            cursor: "pointer",
                            color: "rgba(0,0,0,0.75)",
                          }}
                        >
                          👎
                        </button>

                        {fb?.vote ? (
                          <div style={{ fontSize: 11, color: "rgba(0,0,0,0.55)" }}>
                            {lang === "vi" ? "Cảm ơn." : "Thanks."}
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
                            {lang === "vi" ? "Phản hồi" : "Feedback"}
                          </div>
                        )}
                      </div>

                      {showReasons ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {reasons.map((r) => {
                            const label = lang === "vi" ? r.vi : r.en;
                            const active = fb?.reason === r.id;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() =>
                                  setFeedbackForMsg({
                                    msgId: m.id,
                                    vote: fb!.vote,
                                    reason: r.id,
                                    assistantText: m.text,
                                  })
                                }
                                style={{
                                  ...chipStyle,
                                  background: active ? "rgba(0,0,0,0.08)" : "#fff",
                                }}
                                title={label}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
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
                  <Suspense fallback={<div style={{ fontSize: 12 }}>...</div>}>
                    <TypingIndicator />
                  </Suspense>
                </div>
              </div>
            ) : null}

            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {safeActions.map((a: any) => (
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
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(0,0,0,0.70)",
                }}
              >
                {lang === "vi" ? "Gợi ý nhanh" : "Care loop"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(0,0,0,0.60)",
                  marginTop: 6,
                }}
              >
                {lang === "vi"
                  ? "Gợi ý: gõ “fix grammar:” để sửa ngữ pháp. Luyện phát âm (đọc to và được góp ý) sẽ có sớm. Nếu muốn mở gói, vào /tiers."
                  : "Tip: type “fix grammar:” to correct grammar. Pronunciation coaching (read aloud + corrections) is coming soon. For plans, go to /tiers."}
              </div>
            </div>
          </div>

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
        <Suspense fallback={<FaceFallback size={78} />}>
          <TalkingFaceIcon size={78} isTalking={false} />
        </Suspense>
      </button>
    </div>
  );

  if (!mounted || !isBrowser) return null;
  if (isAdmin) return null;

  return ui;
}