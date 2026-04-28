/**
 * File: Home.tsx
 * Path: src/pages/Home.tsx
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Compass, GraduationCap, LibraryBig, Mic } from "lucide-react";

import BottomMusicBar from "@/components/audio/BottomMusicBar";
import { MercyGuide } from "@/components/MercyGuide";
import { FeedbackBar } from "@/components/FeedbackBar";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import FocusAreasCard from "@/components/home/FocusAreasCard";
import PracticeRecommendationCard from "@/components/home/PracticeRecommendationCard";
import RecommendedDrillCard from "@/components/home/RecommendedDrillCard";
import TodaysLessonCard from "@/components/home/TodaysLessonCard";
import WeeklyProgressWidget from "@/components/home/WeeklyProgressWidget";
import StoryPromptCard from "@/components/home/StoryPromptCard";
import LeaderboardCard from "@/components/leaderboard/LeaderboardCard";
import { StreakBadge } from "@/components/streak/StreakBadge";

const PAGE_MAX = 980;
const LS_ZOOM  = "mb.ui.zoom";
const DEFAULT_ZOOM = 100;
const DEFAULT_TRIAL_ENDED_MESSAGE = "Your free trial has ended. Please upgrade to continue.";

const MERCY_GUIDE_BUBBLE_STORAGE_KEY = "mercy-guide-bubble-position-v2";
const GUIDE_BOX_BUBBLE_STORAGE_KEY   = "guide-box-bubble-position-v8-left";

const GUIDE_BUBBLE_SIZE  = 92;
const MERCY_BUBBLE_SIZE  = 64;

function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }

function readZoomPct(): number {
  try {
    const raw = Number(localStorage.getItem(LS_ZOOM));
    if (Number.isFinite(raw)) return clamp(Math.round(raw), 60, 140);
  } catch { /* ignore */ }
  try {
    const css = getComputedStyle(document.documentElement).getPropertyValue("--mb-essay-zoom").trim();
    const parsed = Number(css);
    if (Number.isFinite(parsed)) return clamp(Math.round(parsed), 60, 140);
  } catch { /* ignore */ }
  return DEFAULT_ZOOM;
}

function clearCustomBubbleStorage() {
  try { window.sessionStorage.removeItem(GUIDE_BOX_BUBBLE_STORAGE_KEY); } catch { /* ignore */ }
  try { window.sessionStorage.removeItem(MERCY_GUIDE_BUBBLE_STORAGE_KEY); } catch { /* ignore */ }
  try { window.localStorage.removeItem(MERCY_GUIDE_BUBBLE_STORAGE_KEY); } catch { /* ignore */ }
}

function hasOpenTeacherMercyPanel(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(
    document.querySelector('[aria-label="Close Mercy panel"]') ||
    document.querySelector('[aria-label="Collapse Mercy panel"]'),
  );
}

export default function Home() {
  const nav    = useNavigate();
  const access = useUserAccess();
  const { user } = useAuth();
  const { enabled: leaderboardEnabled } =
    useFeatureFlag("mercyblade_leaderboard_enabled", false);

  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );
  const [zoomPct, setZoomPct]       = useState<number>(() => readZoomPct());
  const [sharedReady, setSharedReady] = useState(false);
  const [isTeacherMercyOpen, setIsTeacherMercyOpen] = useState<boolean>(() => hasOpenTeacherMercyPanel());

  // Try-one-word request: bumping the counter forces MercyGuide to open
  // on the requested tab with the requested practice line, even if the
  // user clicks the card a second time with identical values.
  const [tryOneWordRequestId, setTryOneWordRequestId] = useState(0);
  const TRY_ONE_WORD_LINE = "Hello, how are you?";

  const stageRef = useRef<HTMLDivElement | null>(null);

  const trialEndedMessage    = access.accessAnnouncement || DEFAULT_TRIAL_ENDED_MESSAGE;
  const isTeacherMercyAllowed =
    !access.isAuthenticated || access.loading || (!access.isTrialExpired && access.features.hasMercyGuide);

  useEffect(() => {
    const sync = () => setZoomPct(readZoomPct());
    sync();
    const onStorage = (e: StorageEvent) => { if (!e.key || e.key === LS_ZOOM) sync(); };
    const obs = new MutationObserver(() => sync());
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "data-mb-zoom"] });
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener("storage", onStorage); obs.disconnect(); };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const sync = () => setIsTeacherMercyOpen(hasOpenTeacherMercyPanel());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-label", "class", "style"] });
    window.addEventListener("focus", sync);
    return () => { observer.disconnect(); window.removeEventListener("focus", sync); };
  }, []);

  const z = useMemo(() => {
    const scale = zoomPct / 100;
    return (px: number) => Math.round(px * scale);
  }, [zoomPct]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    if (!access.isAuthenticated || access.loading || !access.isTrialExpired) return;
    if (typeof document === "undefined") return;
    if (hasOpenTeacherMercyPanel()) {
      const closeButton   = document.querySelector('[aria-label="Close Mercy panel"]') as HTMLButtonElement | null;
      const collapseButton = document.querySelector('[aria-label="Collapse Mercy panel"]') as HTMLButtonElement | null;
      (closeButton || collapseButton)?.click();
    }
  }, [access.isAuthenticated, access.loading, access.isTrialExpired]);

  const isDesktopTop      = viewportWidth >= 960;
  const isPhone           = viewportWidth < 640;
  const mobileHeadlineSize = viewportWidth <= 360 ? 19 : viewportWidth <= 400 ? 21 : 24;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSharedReady(false);
    if (!isDesktopTop) {
      clearCustomBubbleStorage();
      try {
        const mercyPayload = JSON.stringify({ right: 16, bottom: 44 });
        window.localStorage.setItem(MERCY_GUIDE_BUBBLE_STORAGE_KEY, mercyPayload);
        window.sessionStorage.setItem(MERCY_GUIDE_BUBBLE_STORAGE_KEY, mercyPayload);
      } catch { /* ignore */ }
      setSharedReady(true);
      return;
    }

    const syncBubblePositions = () => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) { setSharedReady(true); return; }
      const gap = 14;
      const columnWidth   = Math.max(180, (rect.width - gap * 2) / 3);
      const guideCenterX  = rect.left + columnWidth / 2;
      const teacherCenterX = rect.right - columnWidth / 2;
      const targetCenterY = rect.top + rect.height * 0.7;

      const guideLeft   = Math.round(Math.max(12, guideCenterX - GUIDE_BUBBLE_SIZE / 2));
      const guideBottom = Math.round(Math.max(118, window.innerHeight - targetCenterY - GUIDE_BUBBLE_SIZE / 2));
      const teacherRight  = Math.round(Math.max(12, window.innerWidth - teacherCenterX - MERCY_BUBBLE_SIZE / 2));
      const teacherBottom = 44;

      try {
        window.sessionStorage.setItem(GUIDE_BOX_BUBBLE_STORAGE_KEY, JSON.stringify({ left: guideLeft, bottom: guideBottom }));
        const mercyPayload = JSON.stringify({ right: teacherRight, bottom: teacherBottom });
        window.localStorage.setItem(MERCY_GUIDE_BUBBLE_STORAGE_KEY, mercyPayload);
        window.sessionStorage.setItem(MERCY_GUIDE_BUBBLE_STORAGE_KEY, mercyPayload);
      } catch { /* ignore */ }

      setSharedReady(true);
    };

    const raf = window.requestAnimationFrame(syncBubblePositions);
    return () => window.cancelAnimationFrame(raf);
  }, [isDesktopTop, viewportWidth]);

  // ── Styles ──────────────────────────────────────────────────────────────────

  const wrap: React.CSSProperties = {
    width: "100%", minHeight: "100vh", overflowX: "hidden",
    background: "radial-gradient(circle at top, rgba(255,237,213,0.55) 0%, rgba(250,247,241,0.95) 26%, rgba(248,247,250,1) 62%, rgba(252,249,243,1) 100%)",
  };

  const frame: React.CSSProperties = {
    maxWidth: PAGE_MAX, margin: "0 auto",
    padding: isPhone ? "10px 12px 108px" : "10px 16px 188px",
  };

  const heroShell: React.CSSProperties = {
    marginTop: 6, borderRadius: 28, border: "1px solid rgba(0,0,0,0.06)",
    background: "linear-gradient(180deg, rgba(255,252,245,0.98), rgba(248,243,234,0.94))",
    boxShadow: "0 18px 42px rgba(0,0,0,0.07)",
    padding: isDesktopTop ? "24px 24px 28px" : "18px 14px 22px",
    textAlign: "center",
  };

  const headline: React.CSSProperties = {
    margin: "2px 0 0",
    fontSize: isDesktopTop ? z(42) : z(mobileHeadlineSize),
    fontWeight: 950, lineHeight: 1.05, letterSpacing: isPhone ? -0.9 : -1.2,
    color: "rgba(10,10,10,0.96)", overflowWrap: "break-word", wordBreak: "break-word",
  };

  const headlineAccent: React.CSSProperties = {
    display: "inline-block",
    backgroundImage: "linear-gradient(135deg, #B45309 0%, #D97706 28%, #14B8A6 74%, #0F766E 100%)",
    WebkitBackgroundClip: "text", backgroundClip: "text",
    WebkitTextFillColor: "transparent", color: "transparent",
  };

  const subline: React.CSSProperties = {
    marginTop: 12, fontSize: isDesktopTop ? z(20) : z(16),
    lineHeight: 1.45, fontWeight: 800, color: "rgba(0,0,0,0.62)",
  };

  const sharedKey = `${isDesktopTop ? "desktop" : "mobile"}-${viewportWidth}`;

  const handleLibrary = () => {
    if (access.isAuthenticated && access.isTrialExpired) { window.alert(trialEndedMessage); return; }
    nav("/rooms");
  };

  // Open the Mercy bubble's panel via focus + Enter. Used by both the
  // Teacher Mercy card (auth path) and the Try-one-word card (anon
  // path). Pure DOM dispatch — no synthetic PointerEvent (those crash
  // on the bubble's setPointerCapture handler; see commit b0d0153a).
  const focusAndOpenMercyBubble = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    const bubble =
      document.querySelector<HTMLElement>('[aria-label="Open Mercy Guide"]') ||
      document.querySelector<HTMLElement>('[aria-label="Open Teacher Mercy for kids"]');
    if (!bubble) {
      console.warn("[Home] Teacher Mercy bubble not found; cannot open panel.");
      return;
    }
    bubble.focus();
    bubble.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Enter" }),
    );
  };

  const handleTryOneWord = () => {
    setTryOneWordRequestId((id) => id + 1);
    focusAndOpenMercyBubble();
  };

  const handleTeacherMercy = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Signed-out users: route to sign-in instead of trying to open the
    // Mercy bubble (which never renders for them).
    if (!access.isAuthenticated) {
      nav("/signin");
      return;
    }

    // Mercy unification: signed-in users land on the single-pane chat by
    // default. The legacy multi-tab MercyGuide bubble below stays mounted
    // for users who opt back into 'classic' via the in-chat settings,
    // and is still independently clickable on its own as a fallback.
    nav("/mercy/chat");
  };

  // ── Teacher Mercy hero card ────────────────────────────────────────────────
  const teacherCard = (
    <button type="button" onClick={handleTeacherMercy} aria-label="Open Teacher Mercy"
      style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "center" }}>
      <div style={{
        borderRadius: 26, padding: isPhone ? "22px 16px 26px" : "32px 24px 36px",
        background: "linear-gradient(150deg, rgba(250,232,255,0.96) 0%, rgba(255,240,248,0.96) 40%, rgba(253,240,230,0.94) 100%)",
        border: "1px solid rgba(190,100,140,0.14)",
        boxShadow: "0 20px 48px rgba(160,60,100,0.10)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Soft glow */}
        <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 260, height: 140, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(220,100,160,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Avatar */}
        <div style={{ width: isPhone ? 100 : 120, height: isPhone ? 100 : 120, borderRadius: 9999, margin: "0 auto", overflow: "hidden", border: "3px solid rgba(255,255,255,0.95)", boxShadow: "0 12px 32px rgba(160,60,100,0.18)" }}>
          <img src="/teacher-mercy.png" alt="Teacher Mercy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }}
          />
        </div>

        <div style={{ marginTop: 16, fontSize: isPhone ? z(22) : z(30), fontWeight: 950, letterSpacing: -0.5, color: "rgba(100,30,60,0.94)", lineHeight: 1.15 }}>
          Teacher Mercy
        </div>
        <div style={{ marginTop: 4, fontSize: z(13), fontWeight: 700, color: "rgba(140,60,90,0.62)", letterSpacing: 0.2 }}>
          Giáo viên Mercy
        </div>

        <div style={{ marginTop: 14, fontSize: isPhone ? z(14) : z(16), fontWeight: 700, color: "rgba(80,20,45,0.78)", lineHeight: 1.6, maxWidth: "min(340px, 100%)", margin: "14px auto 0" }}>
          Your English teacher. Grammar, pronunciation, writing — all in one place.
        </div>
        <div style={{ marginTop: 6, fontSize: z(13), fontWeight: 600, color: "rgba(140,60,90,0.58)", lineHeight: 1.5 }}>
          Ngữ pháp, phát âm, viết văn — tất cả trong một nơi.
        </div>

        <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 9999, background: "rgba(180,60,100,0.10)", border: "1px solid rgba(180,60,100,0.18)", color: "rgba(120,30,60,0.90)", fontWeight: 900, fontSize: z(14) }}>
          {!access.isAuthenticated
            ? "Sign in to chat with Teacher Mercy →"
            : "Open Teacher Mercy →"}
        </div>
        {!access.isAuthenticated && (
          <div style={{ marginTop: 6, fontSize: z(13), fontWeight: 600, color: "rgba(140,60,90,0.58)", lineHeight: 1.5 }}>
            Đăng nhập để học cùng Mercy →
          </div>
        )}
        {!access.isAuthenticated && (
          <span
            role="link"
            tabIndex={0}
            aria-label="Try pronunciation now — no signup needed"
            onClick={(e) => { e.stopPropagation(); handleTryOneWord(); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                handleTryOneWord();
              }
            }}
            style={{
              display: "inline-block",
              marginTop: 12,
              padding: "6px 14px",
              borderRadius: 9999,
              border: "1px dashed rgba(14,116,144,0.45)",
              background: "rgba(207,250,254,0.55)",
              color: "rgba(8,75,90,0.92)",
              fontSize: z(12),
              fontWeight: 800,
              lineHeight: 1.4,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <span>Phát âm thử ngay — không cần đăng nhập</span>
            <br />
            <span style={{ fontWeight: 600, color: "rgba(8,75,90,0.65)" }}>
              Try pronunciation now — no signup
            </span>
          </span>
        )}
      </div>
    </button>
  );

  // ── Try one word — no signup (anon-friendly secondary card) ───────────────
  // Cuts time-to-first-pronunciation-score: opens MercyGuide directly
  // on the pronunciation tab with a fixed starter line so anonymous
  // users don't have to pick content first. See A7's onboarding audit
  // (reports/onboarding-60s-audit-2026-04-26.md).
  const tryOneWordCard = (
    <button
      type="button"
      onClick={handleTryOneWord}
      aria-label="Try one word — no signup needed"
      style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer" }}
    >
      <div
        style={{
          borderRadius: 20,
          padding: isPhone ? "16px 18px" : "18px 20px",
          background: "linear-gradient(150deg, rgba(224,242,254,0.96) 0%, rgba(236,254,255,0.94) 100%)",
          border: "1px solid rgba(14,116,144,0.18)",
          boxShadow: "0 10px 28px rgba(14,116,144,0.10)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 9999,
            background: "linear-gradient(180deg, #38BDF8 0%, #0891B2 100%)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 8px 20px rgba(14,116,144,0.22)",
            flexShrink: 0,
          }}
        >
          <Mic size={24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: isPhone ? z(18) : z(20), fontWeight: 900, color: "rgba(8,75,90,0.94)", letterSpacing: -0.3 }}>
            Try one word — no signup
          </div>
          <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(8,75,90,0.55)", marginTop: 2 }}>
            Phát âm thử — không cần đăng nhập
          </div>
          <div style={{ marginTop: 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            Hear how MercyBlade scores your pronunciation in 12 seconds.
          </div>
          <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
            Nghe MercyBlade chấm phát âm chỉ trong 12 giây.
          </div>
        </div>

        <div style={{ color: "rgba(14,116,144,0.70)", flexShrink: 0 }}>
          <ChevronRight size={22} />
        </div>
      </div>
    </button>
  );

  // ── Library secondary card ─────────────────────────────────────────────────
  const libraryCard = (
    <button type="button" onClick={handleLibrary} aria-label="Library"
      style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
      <div style={{
        borderRadius: 20, padding: isPhone ? "16px 18px" : "18px 20px",
        background: "linear-gradient(150deg, rgba(236,255,252,0.96) 0%, rgba(244,255,250,0.94) 100%)",
        border: "1px solid rgba(20,184,166,0.14)",
        boxShadow: "0 10px 28px rgba(20,184,166,0.08)",
        display: "flex", alignItems: "center", gap: 16, textAlign: "left",
      }}>
        <div style={{ width: 52, height: 52, borderRadius: 9999, background: "linear-gradient(180deg, #34D399 0%, #14B8A6 100%)", display: "grid", placeItems: "center", boxShadow: "0 8px 20px rgba(20,184,166,0.20)", flexShrink: 0 }}>
          <LibraryBig size={24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: isPhone ? z(18) : z(20), fontWeight: 900, color: "rgba(0,80,70,0.92)", letterSpacing: -0.3 }}>Library</div>
          <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(0,100,85,0.52)", marginTop: 2 }}>Thư viện</div>
          <div style={{ marginTop: 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            Browse rooms. Read, listen, reflect.
          </div>
          <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
            Vào room để đọc, nghe, suy ngẫm.
          </div>
        </div>

        <div style={{ color: "rgba(20,184,166,0.70)", flexShrink: 0 }}>
          <BookOpen size={22} />
        </div>
      </div>
    </button>
  );

  // ── TOEIC practice pack invitation card ────────────────────────────────────
  // Vietnamese corporate market: ~200k TOEIC test-takers/year. Card is
  // open to anonymous visitors so it doubles as a marketing surface
  // for the corporate-vertical funnel. Tap → /exam-prep/toeic which
  // shows the 30-item pack (no auth, no paywall). The premium-gated
  // timed-practice mode at /exam/toeic is unaffected.
  const toeicCard = (
    <button type="button" onClick={() => nav("/exam-prep/toeic")} aria-label="TOEIC practice pack"
      style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
      <div style={{
        borderRadius: 20, padding: isPhone ? "16px 18px" : "18px 20px",
        background: "linear-gradient(150deg, rgba(238,242,255,0.96) 0%, rgba(243,244,255,0.94) 100%)",
        border: "1px solid rgba(99,102,241,0.18)",
        boxShadow: "0 10px 28px rgba(99,102,241,0.10)",
        display: "flex", alignItems: "center", gap: 16, textAlign: "left",
      }}>
        <div style={{ width: 52, height: 52, borderRadius: 9999, background: "linear-gradient(180deg, #818CF8 0%, #6366F1 100%)", display: "grid", placeItems: "center", boxShadow: "0 8px 20px rgba(99,102,241,0.22)", flexShrink: 0 }}>
          <GraduationCap size={24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: isPhone ? z(18) : z(20), fontWeight: 900, color: "rgba(55,48,163,0.94)", letterSpacing: -0.3 }}>
            Luyện TOEIC
          </div>
          <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(67,56,202,0.55)", marginTop: 2 }}>
            TOEIC practice pack
          </div>
          <div style={{ marginTop: 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            Luyện TOEIC theo định dạng chính thức. Giải thích bằng tiếng Việt.
          </div>
          <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
            30 items, official format, Vietnamese explanations.
          </div>
        </div>

        <div style={{ color: "rgba(99,102,241,0.70)", flexShrink: 0 }}>
          <ChevronRight size={22} />
        </div>
      </div>
    </button>
  );

  // ── IELTS Speaking content pack ────────────────────────────────────────────
  // Marketing surface for /exam-prep/ielts/speaking (open, no paywall).
  // 30 topics across all 3 parts, VN-speaker strategies + vocabulary by
  // band + band-7/band-5 sample answers. Closes the IELTS revenue funnel
  // alongside Writing (PR #174), Listening, and Reading sections.
  const ieltsSpeakingCard = (
    <button type="button" onClick={() => nav("/exam-prep/ielts/speaking")} aria-label="IELTS Speaking content pack"
      style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
      <div style={{
        borderRadius: 20, padding: isPhone ? "16px 18px" : "18px 20px",
        background: "linear-gradient(150deg, rgba(236,253,245,0.96) 0%, rgba(240,253,250,0.94) 100%)",
        border: "1px solid rgba(16,185,129,0.18)",
        boxShadow: "0 10px 28px rgba(16,185,129,0.10)",
        display: "flex", alignItems: "center", gap: 16, textAlign: "left",
      }}>
        <div style={{ width: 52, height: 52, borderRadius: 9999, background: "linear-gradient(180deg, #34D399 0%, #10B981 100%)", display: "grid", placeItems: "center", boxShadow: "0 8px 20px rgba(16,185,129,0.22)", flexShrink: 0 }}>
          <GraduationCap size={24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: isPhone ? z(18) : z(20), fontWeight: 900, color: "rgba(6,95,70,0.94)", letterSpacing: -0.3 }}>
            IELTS Speaking
          </div>
          <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(15,118,110,0.55)", marginTop: 2 }}>
            30 topics — Part 1, 2, 3
          </div>
          <div style={{ marginTop: 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            IELTS Speaking với phản hồi tiếng Việt — biết chính xác band đang ở đâu và làm thế nào để lên.
          </div>
          <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
            Vietnamese-language strategies, vocabulary by band, sample answers band 7 + band 5.
          </div>
        </div>

        <div style={{ color: "rgba(16,185,129,0.70)", flexShrink: 0 }}>
          <ChevronRight size={22} />
        </div>
      </div>
    </button>
  );

  // ── Placement test invitation card ─────────────────────────────────────────
  // Visual rhythm: Teacher Mercy → Library → Placement test. Mirrors
  // libraryCard's structure (icon-badge left, EN+VI text, chevron right)
  // with a sky/blue palette so the three cards read as distinct.
  const placementCard = (
    <button type="button" onClick={() => nav("/placement")} aria-label="Placement test"
      style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
      <div style={{
        borderRadius: 20, padding: isPhone ? "16px 18px" : "18px 20px",
        background: "linear-gradient(150deg, rgba(236,246,255,0.96) 0%, rgba(244,250,255,0.94) 100%)",
        border: "1px solid rgba(14,165,233,0.16)",
        boxShadow: "0 10px 28px rgba(14,165,233,0.08)",
        display: "flex", alignItems: "center", gap: 16, textAlign: "left",
      }}>
        <div style={{ width: 52, height: 52, borderRadius: 9999, background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)", display: "grid", placeItems: "center", boxShadow: "0 8px 20px rgba(14,165,233,0.20)", flexShrink: 0 }}>
          <Compass size={24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: isPhone ? z(18) : z(20), fontWeight: 900, color: "rgba(7,89,133,0.92)", letterSpacing: -0.3 }}>Placement test</div>
          <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(7,89,133,0.55)", marginTop: 2 }}>Bài đánh giá</div>
          <div style={{ marginTop: 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            Find your starting level. About 6–9 minutes.
          </div>
          <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
            Tìm điểm bắt đầu phù hợp. Khoảng 6–9 phút.
          </div>
        </div>

        <div style={{ color: "rgba(14,165,233,0.70)", flexShrink: 0 }}>
          <ChevronRight size={22} />
        </div>
      </div>
    </button>
  );

  // ── VSTEP exam-prep card (Vietnamese-only moat) ───────────────────────────
  // VSTEP is required for Vietnamese university graduation and civil
  // service positions; ~250k test takers/year. Most international
  // English-prep apps target IELTS/TOEIC and skip VSTEP entirely. This
  // card surfaces the differentiator on the home page. Red/gold
  // palette nods to the Vietnamese flag without being literal.
  const vstepCard = (
    <button
      type="button"
      onClick={() => nav("/exam/vstep/speaking")}
      aria-label="VSTEP — Vietnamese national English exam prep"
      style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer" }}
    >
      <div
        style={{
          borderRadius: 20,
          padding: isPhone ? "16px 18px" : "18px 20px",
          background:
            "linear-gradient(150deg, rgba(254,242,242,0.96) 0%, rgba(255,251,235,0.96) 100%)",
          border: "1px solid rgba(185,28,28,0.16)",
          boxShadow: "0 10px 28px rgba(185,28,28,0.10)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 9999,
            background: "linear-gradient(180deg, #DC2626 0%, #B45309 100%)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 8px 20px rgba(185,28,28,0.22)",
            flexShrink: 0,
          }}
        >
          <GraduationCap size={24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: isPhone ? z(18) : z(20),
              fontWeight: 900,
              color: "rgba(127,29,29,0.94)",
              letterSpacing: -0.3,
            }}
          >
            VSTEP — Kỳ thi tiếng Anh quốc gia
          </div>
          <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(127,29,29,0.55)", marginTop: 2 }}>
            Vietnamese Standardized Test of English Proficiency
          </div>
          <div style={{ marginTop: 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            App học tiếng Anh tập trung riêng vào VSTEP — đúng định dạng Bộ Giáo dục.
          </div>
          <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
            B1 + B2 Speaking, 30 chủ đề, mẹo cho người Việt.
          </div>
        </div>

        <div style={{ color: "rgba(185,28,28,0.70)", flexShrink: 0 }}>
          <ChevronRight size={22} />
        </div>
      </div>
    </button>
  );

  return (
    <div style={wrap}>
      {/* Top-right floating streak badge — hidden when streak_current === 0 */}
      <div
        style={{
          position: "fixed",
          top: `calc(12px + env(safe-area-inset-top, 0px))`,
          right: 16,
          zIndex: 70,
          pointerEvents: "auto",
        }}
        aria-label="Study streak quick view"
      >
        <StreakBadge />
      </div>

      <div style={frame}>
        {/* Headline */}
        <section style={heroShell} aria-label="Homepage hero">
          <h1 style={headline}>
            <span>Small Steps.</span>{" "}
            <span style={headlineAccent}>Real Progress.</span>
          </h1>
          <div style={subline}>
            English for real <span style={{ color: "rgba(13,148,136,0.92)" }}>life</span>.
          </div>
        </section>

        {/* Main content */}
        <section ref={stageRef} style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }} aria-label="Homepage choices">
          {/* Today's 5-minute lesson — top anchor for returning users.
              Sits above Teacher Mercy so a learner who opens the app
              with no plan has one obvious next step. Never auto-navigates;
              the user must tap "Bắt đầu" themselves. */}
          <TodaysLessonCard isPhone={isPhone} />

          {/* Practice recommendation — Mercy's "what should I practice
              tonight?" card. Self-fetching, hidden when the feature
              flag is off, the user is anonymous, or no rule fires.
              One recommendation visible at a time. */}
          <PracticeRecommendationCard />

          {/* Targeted phoneme drill — surfaced when a weak phoneme
              has both signal (5+ attempts) and a hand-curated drill
              pack. Self-gates on its own feature flag + 24h cooldown
              keyed off the graduation tracker. */}
          <RecommendedDrillCard />

          {/* Weekly progress widget — only renders for signed-in users
              with attempts; hidden otherwise. The widget owns its own
              fetch so Home doesn't auto-load progress data. */}
          <WeeklyProgressWidget />

          {/* Story-share prompt — self-gates on eligibility (paid, 21+
              days, 50+ attempts, sustained improvement) AND a 30-day
              cooldown. Renders nothing for users who don't qualify, so
              the surface stays clean for new + struggling learners. */}
          <StoryPromptCard />

          {/* Teacher Mercy — hero */}
          {teacherCard}

          {/* Try one word — no signup. Cuts time-to-first-score for
              anonymous users; opens MercyGuide on the pronunciation
              tab with a fixed starter line. */}
          {tryOneWordCard}

          {/* Library — secondary */}
          {libraryCard}

          {/* Placement test — invitation card (always visible; /placement route still gates auth) */}
          {placementCard}

          {/* VSTEP — Vietnamese national exam prep (Vietnamese-only moat) */}
          {vstepCard}

          {/* TOEIC practice pack — Vietnamese corporate vertical.
              Marketing surface for /exam-prep/toeic (open, no paywall). */}
          {toeicCard}

          {/* IELTS Speaking content pack — closes the IELTS funnel alongside
              Writing/Listening/Reading. Marketing surface for
              /exam-prep/ielts/speaking (open, no paywall). */}
          {ieltsSpeakingCard}

          {/* Focus areas — tertiary (feature-flagged) */}
          <FocusAreasCard />

          {/* Weekly leaderboard — Step 4 retention card (feature-flagged) */}
          {leaderboardEnabled && Boolean(user) && <LeaderboardCard />}
        </section>

        {/* Floating bubbles */}
        <div style={{ marginTop: isPhone ? 10 : 18 }}>
          {sharedReady ? (
            <React.Fragment key={sharedKey}>
              {isTeacherMercyAllowed ? (
                <MercyGuide
                  // Only inject Try-one-word props after the user has
                  // clicked the card (id > 0). Pre-click, leave undefined
                  // so MercyGuide keeps its existing default tab.
                  initialTab={tryOneWordRequestId > 0 ? "pronunciation" : undefined}
                  initialPracticeLine={tryOneWordRequestId > 0 ? TRY_ONE_WORD_LINE : undefined}
                  openRequestId={tryOneWordRequestId}
                />
              ) : null}
            </React.Fragment>
          ) : null}
        </div>
      </div>

      <div style={{ position: "fixed", left: 16, bottom: `calc(${isPhone ? 44 : 52}px + env(safe-area-inset-bottom, 0px))`, zIndex: 81, pointerEvents: "auto" }}>
        <FeedbackBar />
      </div>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: `calc(${isPhone ? 8 : 10}px + env(safe-area-inset-bottom, 0px))`, zIndex: 80, padding: "0 16px", pointerEvents: "none" }} aria-label="Bottom music dock">
        <div style={{ maxWidth: PAGE_MAX, margin: "0 auto", pointerEvents: "auto" }}>
          <BottomMusicBar />
        </div>
      </div>
    </div>
  );
}
