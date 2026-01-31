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
//
// PATCH (2026-01-29):
// - Remove React portal usage to eliminate dev/StrictMode/HMR NotFoundError(removeChild) crashes.
//   (Render inline in the React tree; UI is fixed-position anyway.)

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TalkingFaceIcon from "@/components/guide/TalkingFaceIcon";
import { useAuth } from "@/providers/AuthProvider";

import type { HostContext, PanelMode } from "@/components/guide/host/types";

// ✅ FIX (prod parity): import explicit file so Vercel/Linux resolver can’t “miss” it.
import { safeSetLS, safeLang } from "@/components/guide/host/utils.ts";

import { useHostContextSync } from "@/components/guide/host/useHostContext";
import { useHostProfile } from "@/components/guide/host/useHostProfile";
import { useRepeatLoop } from "@/components/guide/host/useRepeatLoop";
import { useMakeReply } from "@/components/guide/host/makeReply";
import { useHostActions } from "@/components/guide/host/buildActions";
import { useDevHostState } from "@/components/guide/host/useDevState";
import TypingIndicator from "@/components/guide/host/TypingIndicator";

type TierKey = "free" | "vip1" | "vip3" | "vip9";

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

function todayKeyLocal(): string {
  // YYYY-MM-DD in local time
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
  // Best-effort, non-breaking heuristic:
  // 1) Known localStorage keys (if your app sets any of them)
  // 2) ctx.vipRank / ctx.userVipRank (if present)
  // 3) canVoiceTest -> treat as high tier hint
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

  // Optional hint: voice test is typically paid/high tier.
  if (args.canVoiceTest) return 9;

  // If logged-in but we cannot detect rank, assume VIP1 (marketing-friendly, but safe quota still applies).
  if (args.authUserId) return 1;

  // Anonymous => free
  return 0;
}

function tierFromRank(rank: number): TierKey {
  if (rank >= 9) return "vip9";
  if (rank >= 3) return "vip3";
  if (rank >= 1) return "vip1";
  return "free";
}

function tierLabel(tier: TierKey): string {
  if (tier === "vip9") return "VIP9";
  if (tier === "vip3") return "VIP3";
  if (tier === "vip1") return "VIP1";
  return "Free";
}

function tierNextUpgrade(tier: TierKey): TierKey {
  if (tier === "free") return "vip1";
  if (tier === "vip1") return "vip3";
  if (tier === "vip3") return "vip9";
  return "vip9";
}

function dailyAiLimitForTier(tier: TierKey): number {
  // Marketing-friendly default caps
  if (tier === "free") return 3;
  if (tier === "vip1") return 30;
  if (tier === "vip3") return 200;
  return 2000; // vip9 effectively unlimited
}

function shouldCountAsAiMessage(userText: string, currentMode: PanelMode): boolean {
  const t = (userText ?? "").trim();
  if (!t) return false;
  const lower = t.toLowerCase();

  // Commands shouldn't consume AI quota
  if (lower.startsWith("/")) return false;

  // Pure navigation prompts shouldn't consume AI quota
  if (currentMode === "home" && (lower === "tiers" || lower === "pricing")) return false;

  return true;
}

function getAiUsageKey(appKey: string, tier: TierKey): string {
  // per-day, per-app, per-user-tier bucket (simple)
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

  // Host gentle nudges / “stuck” rescue (local only)
  const repeatNudgeTimerRef = useRef<number | null>(null);
  const repeatNudgedKeyRef = useRef<string>("");

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

  const addMsg = useCallback((role: "assistant" | "user", text: string) => {
    setMessages((prev) => {
      const clean = (text ?? "").trim();
      if (!clean) return prev;
      const id = `${role === "user" ? "u" : "a"}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
      return [...prev, { id, role, text: clean.length > 1200 ? `${clean.slice(0, 1200)}…` : clean }];
    });
  }, []);

  const scheduleAssistantMsg = useCallback(
    (text: string, delayMs: number) => {
      // Deterministic, calm timing (no AI)
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

  // ✅ Tier + AI quota (best-effort)
  const vipRankGuess = useMemo(() => {
    return guessVipRankFromEnv({ authUserId, canVoiceTest, ctx });
  }, [authUserId, canVoiceTest, ctx]);

  const tierKey = useMemo<TierKey>(() => tierFromRank(vipRankGuess), [vipRankGuess]);

  const aiDailyLimit = useMemo(() => dailyAiLimitForTier(tierKey), [tierKey]);

  const [aiUsedToday, setAiUsedToday] = useState(0);

  useEffect(() => {
    // Refresh usage when panel opens or tier changes or day changes
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

    const aiLine =
      lang === "vi"
        ? `AI hôm nay: ${Math.min(aiUsedToday, aiDailyLimit)}/${aiDailyLimit} • Gợi ý: gõ “fix grammar:” để sửa ngữ pháp.`
        : `AI today: ${Math.min(aiUsedToday, aiDailyLimit)}/${aiDailyLimit} • Tip: type “fix grammar:” to correct grammar.`;

    const pronLine =
      lang === "vi"
        ? "Luyện phát âm (đọc to và được góp ý) sẽ có sớm."
        : "Pronunciation coaching (read aloud + corrections) is coming soon.";

    if (lang === "vi") {
      return `Chào${name}. Mình là Mercy Host.\n${p ? p + "\n" : ""}${aiLine}\n${pronLine}\nBạn muốn làm gì ngay bây giờ?\n• Chọn gói VIP (/tiers)\n• Làm mini test\n• Vào phòng học\n• Báo lỗi (audio/UI)`;
    }

    return `Hi${name}. I’m Mercy Host.\n${p ? p + "\n" : ""}${aiLine}\n${pronLine}\nWhat do you need right now?\n• Choose a VIP tier (/tiers)\n• Take a mini test\n• Start learning in a room\n• Report a problem (audio/UI)`;
  }, [displayName, lastProgress, isSignin, lang, aiUsedToday, aiDailyLimit]);

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
        return [
          {
            id: `a_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`,
            role: "assistant",
            text: first,
          },
        ];
      });
    },
    [baseAssistantHome, lang],
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

  // Deterministic, calm coaching (no AI, no questions)
  const repeatCoach = useMemo(() => {
    if (!repeatTarget) return null;

    const en = (repeatTarget.text_en ?? "").trim();
    const vi = (repeatTarget.text_vi ?? "").trim();
    const keyword = (repeatTarget.keyword ?? "").trim();

    const words = en ? en.split(/\s+/).filter(Boolean).length : 0;
    const bucket: "short" | "medium" | "long" = words > 14 ? "long" : words > 7 ? "medium" : "short";

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

  // Failure-aware gentle nudge (only once per target+step)
  useEffect(() => {
    clearRepeatNudgeTimer();
    if (!open) return;
    if (!repeatTarget) return;
    if (repeatStep !== "your_turn") return;

    const key = `${repeatTarget.roomId ?? ""}|${repeatTarget.entryId ?? ""}|${repeatTarget.keyword ?? ""}|${repeatSeenAt ?? ""}|your_turn`;
    if (repeatNudgedKeyRef.current === key) return;

    // Nudge after a calm delay (no nagging)
    repeatNudgeTimerRef.current = window.setTimeout(() => {
      repeatNudgeTimerRef.current = null;
      repeatNudgedKeyRef.current = key;

      // One calm sentence, no emoji, no exclamation.
      scheduleAssistantMsg(lang === "vi" ? "Không sao. Thử lại chậm hơn một chút." : "That is fine. Try once more, a little slower.", 0);
    }, 12000);
  }, [open, repeatTarget, repeatStep, repeatSeenAt, clearRepeatNudgeTimer, scheduleAssistantMsg, lang]);

  /* =========================
     Reply function (pure)
     - MUST match host/makeReply.ts API
  ========================= */
  const makeReplyRaw = useMakeReply();

  // ✅ HARDEN: tolerate hook returning fn OR { makeReply: fn } during HMR/refactors
  const makeReplyFn = useMemo(() => {
    if (typeof makeReplyRaw === "function") return makeReplyRaw as any;
    const maybe = makeReplyRaw as any;
    if (typeof maybe?.makeReply === "function") return maybe.makeReply as any;
    if (typeof maybe?.default === "function") return maybe.default as any;
    return null;
  }, [makeReplyRaw]);

  const pickPraise = useCallback(() => {
    // Neutral, calm, one sentence. No emoji. No exclamation.
    const en = ["Good. Keep it relaxed.", "That was clear.", "Yes. Keep the rhythm.", "Nice. One more time.", "Good. Same pace."];
    const vi = ["Tốt. Giữ thư thái.", "Rõ rồi.", "Đúng. Giữ nhịp.", "Ổn. Thêm một lần.", "Tốt. Giữ tốc độ."];
    const arr = lang === "vi" ? vi : en;
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx] ?? (lang === "vi" ? "Tốt." : "Good.");
  }, [lang]);

  const quotaBlockMessage = useCallback(
    (tier: TierKey, used: number, limit: number) => {
      const next = tierNextUpgrade(tier);
      const nextLabel = tierLabel(next);

      if (lang === "vi") {
        return `Bạn đã dùng hết lượt AI hôm nay (${Math.min(used, limit)}/${limit}).\n${nextLabel} giúp bạn luyện tiếp mượt hơn.\nGõ /tiers để nâng cấp.`;
      }
      return `You’ve used today’s AI messages (${Math.min(used, limit)}/${limit}).\n${nextLabel} gives you more practice with less friction.\nType /tiers to upgrade.`;
    },
    [lang],
  );

  const tryConsumeAiQuota = useCallback(
    (userText: string, currentMode: PanelMode): { allowed: boolean; used: number; limit: number } => {
      const limit = aiDailyLimit;

      // VIP9: practically unlimited (still tracked)
      const usedNow = readAiUsed(appKey, tierKey);

      if (!shouldCountAsAiMessage(userText, currentMode)) {
        return { allowed: true, used: usedNow, limit };
      }

      if (usedNow >= limit) {
        return { allowed: false, used: usedNow, limit };
      }

      const nextUsed = usedNow + 1;
      writeAiUsed(appKey, tierKey, nextUsed);
      setAiUsedToday(nextUsed);
      return { allowed: true, used: nextUsed, limit };
    },
    [aiDailyLimit, appKey, tierKey],
  );

  const assistantRespond = useCallback(
    (userText: string, currentMode: PanelMode) => {
      const textTrim = (userText ?? "").trim();

      // Repeat ACK should never consume AI quota
      const looksLikeRepeatAck =
        repeatTarget && repeatStep === "your_turn" ? /(i\s*repeated|repeated|done|ok|okay|again|repeat)/i.test(textTrim) : false;

      // Commands should not consume AI quota (but can still respond)
      const lower = textTrim.toLowerCase();
      const isCommand = lower.startsWith("/");

      // ✅ QUOTA GUARD (before typing starts, calm + clear)
      if (!looksLikeRepeatAck && !isCommand) {
        const q = tryConsumeAiQuota(textTrim, currentMode);
        if (!q.allowed) {
          clearTypingTimer();
          setIsTyping(false);

          // One calm message, then one next action hint
          addMsg("assistant", quotaBlockMessage(tierKey, q.used, q.limit));
          setMode("billing");
          return;
        }
      }

      clearTypingTimer();
      setIsTyping(true);

      // Micro-timing: shorter for repeat acknowledgements, longer for normal replies
      const delayMs = looksLikeRepeatAck ? 220 : 520;

      typingTimerRef.current = window.setTimeout(() => {
        setIsTyping(false);
        typingTimerRef.current = null;

        // 1) Repeat ACK has priority (STRICT + local)
        const ack = tryAcknowledgeRepeat ? tryAcknowledgeRepeat(userText) : null;
        if (ack?.handled) {
          // Calm praise rotation (one sentence)
          addMsg("assistant", pickPraise());

          // After praise, give next micro-instruction if still in repeat mode (small breath)
          if (repeatTarget) {
            const follow =
              lang === "vi"
                ? repeatCount + 1 >= 3
                  ? "Tốt. Bạn có thể chuyển sang câu tiếp theo."
                  : "Giờ nghe lại một lần, rồi nói lại."
                : repeatCount + 1 >= 3
                ? "Good. You can move on."
                : "Now listen once more, then repeat.";
            scheduleAssistantMsg(follow, 600);
          }

          return;
        }

        // 2) Normal reply (pure)
        if (typeof makeReplyFn !== "function") {
          addMsg(
            "assistant",
            lang === "vi"
              ? "Host đang lỗi (makeReply). Bạn refresh trang (Cmd+R) giúp mình nhé."
              : "Host is in a bad state (makeReply). Please refresh (Cmd+R).",
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
      tryConsumeAiQuota,
      quotaBlockMessage,
      tierKey,
    ],
  );

  const openPanel = useCallback(() => {
    setOpen(true);
    seedIfEmpty(mode);
  }, [seedIfEmpty, mode]);

  const closePanel = useCallback(() => {
    setOpen(false);
    clearTypingTimer();
    clearRepeatNudgeTimer();
    setIsTyping(false);
    stopVoice();
  }, [clearTypingTimer, clearRepeatNudgeTimer, stopVoice]);

  const onSend = useCallback(() => {
    const text = (draft ?? "").trim();
    if (!text) return;

    setDraft("");
    addMsg("user", text);

    // Small command routing (keep simple + local)
    const lower = text.toLowerCase().trim();
    if (lower === "/tiers") {
      goTiers();
      // Deterministic acknowledgement (no AI quota)
      addMsg("assistant", lang === "vi" ? "OK. Mở trang /tiers." : "OK. Opening /tiers.");
      return;
    }
    if (lower === "/email") setMode("email");
    if (lower === "/billing") setMode("billing");
    if (lower === "/about") setMode("about");
    if (lower === "/home") setMode("home");

    // Optional: allow clearing repeat without extra UI buttons (keeps “one action button” in repeat card)
    if (lower === "/repeat clear") {
      clearRepeat();
      addMsg("assistant", lang === "vi" ? "Đã xóa repeat." : "Repeat cleared.");
      return;
    }

    assistantRespond(text, mode);
  }, [draft, addMsg, assistantRespond, mode, goTiers, clearRepeat, lang]);

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
          : `OK. Mini test (3 questions).\nQ1) “I ___ coffee.”\nA) like  B) likes  C) liking`,
      );
    },
    canVoiceTest,
    speak,
  });

  // ✅ HARDEN: never crash if hook returns non-array (dev/HMR/state mismatch)
  const safeActions = Array.isArray(actions) ? actions : [];

  useDevHostState({
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
  });

  const isBrowser = typeof document !== "undefined";

  const fontStack =
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';

  // “One next-action button” contract for repeatTarget card:
  // - We keep header controls (close/lang/voice) globally.
  // - Inside the repeat card itself, we render exactly ONE primary action button.
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
          // Move to your_turn even if audio is missing; user can still practice.
          setRepeatStep("your_turn");
        },
      };
    }

    if (step === "your_turn") {
      return {
        id: "ack",
        label: lang === "vi" ? "Tôi đã nhại lại" : "I repeated it",
        onClick: () => {
          // Deterministic ack (no AI quota).
          const userText = lang === "vi" ? "ok" : "ok";
          addMsg("user", userText);
          assistantRespond(userText, mode);
          // After ack, go to compare step for a brief loop
          setRepeatStep("compare");
        },
      };
    }

    // compare or idle: play again if possible, else go back to your_turn
    return {
      id: "again",
      label: hasAudio ? (lang === "vi" ? "Nghe lại" : "Play again") : lang === "vi" ? "Đến lượt tôi" : "My turn",
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

    // Keep it short; VIP9 still shows count but not scary
    const text = `${tier} • AI ${Math.min(used, limit)}/${limit}`;
    const warn = used >= limit;
    return { text, warn };
  }, [aiUsedToday, aiDailyLimit, tierKey]);

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
      {/* ✅ HeartBurst (inline, no portal) */}
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
                {/* 3-line Host contract: calm line, goal line, micro-instruction */}
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111" }}>{repeatCoach.calmLine}</div>

                <div style={{ fontSize: 11, color: "rgba(0,0,0,0.70)", marginTop: 6 }}>{repeatCoach.goal}</div>

                <div style={{ fontSize: 11, color: "rgba(0,0,0,0.60)", marginTop: 6 }}>
                  {repeatCoach.micro}
                  {repeatCoach.kwHint ? ` • ${repeatCoach.kwHint}` : ""}
                  {typeof repeatCount === "number" ? ` • ${Math.min(3, repeatCount)}/3` : ""}
                  {repeatSeenAt ? ` • ${new Date(repeatSeenAt).toLocaleTimeString()}` : ""}
                </div>

                {repeatCoach.showEn ? (
                  <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: "#111", whiteSpace: "pre-line" }}>
                    {repeatCoach.showEn}
                  </div>
                ) : null}

                {repeatCoach.showVi ? (
                  <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.78)", whiteSpace: "pre-line" }}>
                    {repeatCoach.showVi}
                  </div>
                ) : null}

                {/* Exactly ONE next-action button */}
                {repeatPrimaryAction ? (
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
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
                      {/* Small face motif near play actions */}
                      {repeatPrimaryAction.id === "play" || repeatPrimaryAction.id === "again" ? (
                        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
                          <TalkingFaceIcon size={18} isTalking={false} />
                        </span>
                      ) : null}
                      {repeatPrimaryAction.label}
                    </button>

                    {/* Quiet rescue hint (no extra buttons) */}
                    <div style={{ fontSize: 11, color: "rgba(0,0,0,0.55)", textAlign: "right" }}>
                      {lang === "vi" ? "Gõ /repeat clear để xóa." : "Type /repeat clear to clear."}
                    </div>
                  </div>
                ) : null}
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

            {/* Quick actions (kept). When repeatTarget is active, keep them visible but calm. */}
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {safeActions.map((a) => (
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
                  ? `Gợi ý: gõ “fix grammar:” để sửa ngữ pháp. Luyện phát âm (đọc to và được góp ý) sẽ có sớm. Nếu muốn mở VIP, vào /tiers.`
                  : `Tip: type “fix grammar:” to correct grammar. Pronunciation coaching (read aloud + corrections) is coming soon. For VIP access, go to /tiers.`}
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
                placeholder={lang === "vi" ? "Gõ ở đây… (Enter để gửi, Shift+Enter xuống dòng)" : "Type here… (Enter to send, Shift+Enter newline)"}
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

  // ✅ FINAL GUARD: must be AFTER all hooks (prevents hook-order mismatch on mount/admin/SSR)
  if (!mounted || !isBrowser) return null;
  if (isAdmin) return null;

  return ui;
}
