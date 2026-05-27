/**
 * File: Home.tsx
 * Path: src/pages/Home.tsx
 */

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Compass, GraduationCap, LibraryBig, Mic } from "lucide-react";

import BottomMusicBar from "@/components/audio/BottomMusicBar";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { isPlacementEntryRouteAvailable } from "@/lib/placement/availability";
import { recordLearningEvent } from "@/lib/tutor/learningEvents";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";
import LanguageTrackHome, {
  TargetSwitcher,
} from "@/pages/home/LanguageTrackHome";
import { parseLanguagePair } from "@/lib/languagePair/languagePair";
import { readAnonymousPair } from "@/lib/languagePair/anonymousPair";
import DailyChallengeCard from "@/components/home/DailyChallengeCard";
import FocusAreasCard from "@/components/home/FocusAreasCard";
import PracticeRecommendationCard from "@/components/home/PracticeRecommendationCard";
import RecommendedDrillCard from "@/components/home/RecommendedDrillCard";
import WeeklyProgressWidget from "@/components/home/WeeklyProgressWidget";
import StoryPromptCard from "@/components/home/StoryPromptCard";
import LeaderboardCard from "@/components/leaderboard/LeaderboardCard";
import { StreakBadge } from "@/components/streak/StreakBadge";
import { XPBadge } from "@/components/xp/XPBadge";
// NOTE: LanguageSwitcher (the all-tracks grid) is no longer rendered on
// the default home — the home now shows only the learner's chosen pair.
// The component file is intentionally kept in the repo (not deleted) and
// the /languages index + the "Khám phá ngôn ngữ khác" affordance below
// keep every built track discoverable (STRATEGY §4 / #582).

const MercyGuide = lazyWithRetry(() => import("@/components/MercyGuide"));

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
  //
  // Seeded to 1 when the marketing landing's "Nói thử ngay" CTA sent
  // the visitor here with ?trypron=1 — MercyGuide then opens its
  // pronunciation tab reactively on mount (openRequestId, no DOM-timing
  // race). Strictly query-param-gated: absent on 100% of normal
  // traffic, so behavior is byte-identical without the param. jsdom /
  // SSR safe via the typeof-window guard.
  const [tryOneWordRequestId, setTryOneWordRequestId] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      return new URLSearchParams(window.location.search).has("trypron")
        ? 1
        : 0;
    } catch {
      return 0;
    }
  });
  const TRY_ONE_WORD_LINE = "Hello, how are you?";

  // Progressive disclosure: only one secondary card expanded at a time on mobile.
  // null = all collapsed. Desktop is unaffected — cards render full content.
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

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

  // Remove the static hero shell that index.html injected for instant LCP.
  // The shell provides a 0.5–1.0s LCP; React replaces it with the real component.
  useEffect(() => {
    const el = document.getElementById('mb-static-hero');
    if (!el) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.remove();
    } else {
      el.style.opacity = '0';
      el.style.transition = 'opacity 150ms ease-out';
      const id = setTimeout(() => el.remove(), 150);
      return () => clearTimeout(id);
    }
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

  // Onboarding gate (Duolingo pair-selection — PR 2). Single source of
  // truth: profiles.native_language. NULL ⇒ the user has not completed
  // pair-selection onboarding → redirect to /onboarding. Existing users
  // were backfilled to 'vi' by migration 20260615000000 (option (c)),
  // so they are never redirected — nothing changes for them. Only
  // genuinely new users (native_language still NULL) enter the flow,
  // which always writes native_language on finish AND on skip, so the
  // redirect cannot loop. Reads the shared profile cache; failures
  // never block Home (undefined row ⇒ no redirect).
  const { data: onboardingProfile } = useProfileQuery(
    access.isAuthenticated && !access.loading ? user?.id ?? null : null,
  );
  useEffect(() => {
    const row = onboardingProfile as
      | { native_language?: string | null }
      | null
      | undefined;
    if (!row) return;
    if (row.native_language) return;
    nav("/onboarding", { replace: true });
  }, [onboardingProfile, nav]);

  const isDesktopTop      = viewportWidth >= 960;
  const isPhone           = viewportWidth < 640;
  const mobileHeadlineSize = viewportWidth <= 360 ? 19 : viewportWidth <= 400 ? 21 : 24;
  // Secondary cards get softer visual weight on mobile
  const secIconSize   = isPhone ? 44 : 52;
  const secTitleSize  = isPhone ? z(17) : z(20);
  const secBorderColor = isPhone ? "rgba(0,0,0,0.07)" : undefined; // use per-card default on desktop
  const secShadow      = isPhone ? "0 4px 16px rgba(0,0,0,0.04)" : undefined;

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
    nav("/ai-tutor");
  };

  // ── Progressive disclosure wrapper for secondary cards ──────────────────
  // On mobile: collapsed by default (title + short line + "Preview" chip).
  // Tap once to expand (shows full detail + "Start" CTA inside the card).
  // Tap again to collapse. Desktop is unaffected — cards render full content.
  const ProgressiveDisclosureCard: React.FC<{
    cardId: string;
    title: string;
    shortLine: string;
    accentColor: string;
    iconBg: string;
    iconEl: React.ReactNode;
    children: React.ReactNode;
    onStart: () => void;
    startLabel: string;
  }> = ({ cardId, title, shortLine, accentColor, iconBg, iconEl, children, onStart, startLabel }) => {
    const isExpanded = expandedCardId === cardId;
    const collapsible = isPhone;

    if (!collapsible) {
      // Desktop: render children directly (existing behavior)
      return <>{children}</>;
    }

    // Mobile: collapsed or expanded
    const toggle = () => setExpandedCardId(isExpanded ? null : cardId);

    return (
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={title}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
        style={{
          borderRadius: 20,
          padding: isPhone ? "16px 18px" : "18px 20px",
          background: `linear-gradient(150deg, ${iconBg}, rgba(255,255,255,0.94))`,
          border: `1px solid ${accentColor}22`,
          boxShadow: isExpanded
            ? `0 10px 28px ${accentColor}14`
            : "0 4px 16px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: isExpanded ? "column" : "row",
          alignItems: isExpanded ? "stretch" : "center",
          gap: isExpanded ? 10 : 16,
          cursor: "pointer",
          transition: "box-shadow 0.15s ease, padding 0.15s ease",
        }}
      >
        {!isExpanded ? (
          // ── Collapsed state ──
          <>
            <div style={{
              width: secIconSize, height: secIconSize, borderRadius: 9999,
              display: "grid", placeItems: "center",
              background: `linear-gradient(180deg, ${accentColor}CC, ${accentColor})`,
              boxShadow: `0 4px 12px ${accentColor}22`,
              flexShrink: 0,
            }}>
              {iconEl}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: secTitleSize, fontWeight: 900, letterSpacing: -0.3, color: "rgba(0,0,0,0.90)" }}>
                {title}
              </div>
              <div style={{ marginTop: 2, fontSize: z(13), fontWeight: 700, color: "rgba(0,0,0,0.55)", lineHeight: 1.35 }}>
                {shortLine}
              </div>
            </div>
            <div style={{ flexShrink: 0, fontSize: z(11), fontWeight: 700, color: "rgba(0,0,0,0.30)", display: "flex", alignItems: "center", gap: 3 }}>
              Preview <ChevronRight size={12} />
            </div>
          </>
        ) : (
          // ── Expanded state ──
          <>
            {/* Full detail — render the children */}
            {children}

            {/* Start CTA */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onStart(); }}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "12px 16px",
                borderRadius: 14,
                border: `1px solid ${accentColor}33`,
                background: `${accentColor}14`,
                color: accentColor,
                fontWeight: 900,
                fontSize: z(14),
                cursor: "pointer",
              }}
            >
              {startLabel}
            </button>

            {/* Collapse hint */}
            <div style={{ textAlign: "center", fontSize: z(11), fontWeight: 600, color: "rgba(0,0,0,0.28)", marginTop: 2 }}>
              Tap to close
            </div>
          </>
        )}
      </div>
    );
  };

  // ── Teacher Mercy hero card ────────────────────────────────────────────────
  const teacherCard = (
    // A30 / audit H1: this card used to be ONE big <button> with an
    // interactive <span role="link"> nested inside it (invalid HTML —
    // AT may never expose the inner control). It is now a plain
    // container holding TWO sibling native <button>s: the card body
    // (Open Teacher Mercy) and the "Try pronunciation" chip. textAlign
    // moves onto the card div so the centered layout is preserved now
    // that the outer wrapper is no longer the button that provided it.
    <div style={{ width: "100%" }}>
      <div style={{
        borderRadius: 26, padding: isPhone ? "22px 16px 26px" : "32px 24px 36px",
        background: "linear-gradient(150deg, rgba(250,232,255,0.96) 0%, rgba(255,240,248,0.96) 40%, rgba(253,240,230,0.94) 100%)",
        border: "1px solid rgba(190,100,140,0.14)",
        boxShadow: "0 20px 48px rgba(160,60,100,0.10)",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* Soft glow */}
        <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 260, height: 140, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(220,100,160,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <button
          type="button"
          onClick={handleTeacherMercy}
          aria-label="Open Teacher Mercy"
          style={{ display: "block", width: "100%", background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer", textAlign: "center", font: "inherit", color: "inherit" }}
        >
        {/* Avatar */}
        <div style={{ width: isPhone ? 100 : 120, height: isPhone ? 100 : 120, borderRadius: 9999, margin: "0 auto", overflow: "hidden", border: "3px solid rgba(255,255,255,0.95)", boxShadow: "0 12px 32px rgba(160,60,100,0.18)" }}>
          {/* LCP image. AVIF + WebP variants are 480×480 (covers up to @4
              DPR on the 120px-displayed avatar circle) at ~11 KB each;
              PNG fallback is the original 1024×1024 at 822 KB and only
              served to browsers without AVIF/WebP support. width/height
              attributes match the PNG's natural dimensions so the
              browser can reserve a 1:1 aspect-ratio box before paint —
              CSS overrides for final rendering. fetchpriority="high"
              flags this as the LCP candidate for the homepage. */}
          <picture>
            <source srcSet="/teacher-mercy.avif" type="image/avif" />
            <source srcSet="/teacher-mercy.webp" type="image/webp" />
            <img
              src="/teacher-mercy.png"
              alt="Teacher Mercy"
              width={1024}
              height={1024}
              fetchPriority="high"
              loading="eager"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }}
            />
          </picture>
        </div>

        <div style={{ marginTop: 16, fontSize: isPhone ? z(22) : z(30), fontWeight: 950, letterSpacing: -0.5, color: "rgba(100,30,60,0.94)", lineHeight: 1.15 }}>
          Teacher Mercy
        </div>
        <div style={{ marginTop: 4, fontSize: z(13), fontWeight: 700, color: "rgba(140,60,90,0.62)", letterSpacing: 0.2 }}>
          Giáo viên Mercy
        </div>

        <div style={{ marginTop: 14, fontSize: isPhone ? z(14) : z(16), fontWeight: 700, color: "rgba(80,20,45,0.78)", lineHeight: 1.6, maxWidth: "min(340px, 100%)", margin: "14px auto 0" }}>
          Mở AI Tutor để luyện câu với Mercy. Mercy sẽ nhớ tiến bộ học của bạn.
        </div>
        {!isPhone && (
          <div style={{ marginTop: 6, fontSize: z(13), fontWeight: 600, color: "rgba(140,60,90,0.58)", lineHeight: 1.5 }}>
            Practice sentences with Mercy. Correction, memory, and review in one place.
          </div>
        )}

        <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 9999, background: "rgba(180,60,100,0.10)", border: "1px solid rgba(180,60,100,0.18)", color: "rgba(120,30,60,0.90)", fontWeight: 900, fontSize: z(14) }}>
          Mở AI Tutor →
        </div>
        {!access.isAuthenticated && (
          <div style={{ marginTop: 6, fontSize: z(13), fontWeight: 600, color: "rgba(140,60,90,0.58)", lineHeight: 1.5 }}>
            Vào AI Tutor mới để luyện câu với Mercy →
          </div>
        )}
        </button>
        {!access.isAuthenticated && (
          <button
            type="button"
            aria-label="Try pronunciation now — no signup needed"
            onClick={handleTryOneWord}
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
              fontFamily: "inherit",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <span>Thử phát âm ngay — không cần đăng nhập</span>
            <br />
            <span style={{ fontWeight: 600, color: "rgba(8,75,90,0.65)" }}>
              Try pronunciation now — no signup
            </span>
          </button>
        )}
      </div>
    </div>
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
          {!isPhone && (
            <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(8,75,90,0.55)", marginTop: 2 }}>
              Thử phát âm — không cần đăng nhập
            </div>
          )}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone ? "Get a pronunciation score in 12 seconds." : "Hear how MercyBlade scores your pronunciation in 12 seconds."}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              Nhận điểm phát âm từ MercyBlade chỉ trong 12 giây.
            </div>
          )}
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
        <div style={{ width: secIconSize, height: secIconSize, borderRadius: 9999, background: "linear-gradient(180deg, #34D399 0%, #14B8A6 100%)", display: "grid", placeItems: "center", boxShadow: isPhone ? "0 4px 12px rgba(20,184,166,0.14)" : "0 8px 20px rgba(20,184,166,0.20)", flexShrink: 0 }}>
          <LibraryBig size={isPhone ? 20 : 24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: secTitleSize, fontWeight: 900, color: "rgba(0,80,70,0.92)", letterSpacing: -0.3 }}>Library</div>
          {!isPhone && <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(0,100,85,0.52)", marginTop: 2 }}>Thư viện</div>}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone ? "Đọc. Nghe. Tiến bộ từng ngày." : "Đọc. Nghe. Suy ngẫm. Tiến bộ từng ngày."}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              Read, listen, reflect — build a real English habit.
            </div>
          )}
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
        <div style={{ width: secIconSize, height: secIconSize, borderRadius: 9999, background: "linear-gradient(180deg, #818CF8 0%, #6366F1 100%)", display: "grid", placeItems: "center", boxShadow: isPhone ? "0 4px 12px rgba(99,102,241,0.16)" : "0 8px 20px rgba(99,102,241,0.22)", flexShrink: 0 }}>
          <GraduationCap size={isPhone ? 20 : 24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: secTitleSize, fontWeight: 900, color: "rgba(55,48,163,0.94)", letterSpacing: -0.3 }}>
            Luyện TOEIC
          </div>
          {!isPhone && (
            <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(67,56,202,0.55)", marginTop: 2 }}>
              TOEIC 450 → 750+
            </div>
          )}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone ? "Luyện đúng định dạng, giải thích bằng tiếng Việt." : "Luyện đúng định dạng. Hiểu sâu nhờ giải thích tiếng Việt."}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              Official format, Vietnamese explanations — built for the score you need.
            </div>
          )}
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
        <div style={{ width: secIconSize, height: secIconSize, borderRadius: 9999, background: "linear-gradient(180deg, #34D399 0%, #10B981 100%)", display: "grid", placeItems: "center", boxShadow: isPhone ? "0 4px 12px rgba(16,185,129,0.16)" : "0 8px 20px rgba(16,185,129,0.22)", flexShrink: 0 }}>
          <GraduationCap size={isPhone ? 20 : 24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: secTitleSize, fontWeight: 900, color: "rgba(6,95,70,0.94)", letterSpacing: -0.3 }}>
            IELTS Speaking
          </div>
          {!isPhone && (
            <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(15,118,110,0.55)", marginTop: 2 }}>
              Band 5 → Band 7
            </div>
          )}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone ? "Biết band hiện tại, biết cách nâng lên." : "Biết band hiện tại. Biết chính xác cách nâng lên."}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              Chiến lược riêng cho người Việt, từ vựng theo band, bài mẫu band 5 + band 7.
            </div>
          )}
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
    <button type="button" onClick={() => {
      recordLearningEvent({
        eventType: "placement_cta_clicked",
        product: "ai_tutor",
        targetLanguage: "en",
        safeTopicTag: "placement",
      });
      nav("/placement");
    }} aria-label="Placement test"
      style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
      <div style={{
        borderRadius: 20, padding: isPhone ? "16px 18px" : "18px 20px",
        background: "linear-gradient(150deg, rgba(236,246,255,0.96) 0%, rgba(244,250,255,0.94) 100%)",
        border: "1px solid rgba(14,165,233,0.16)",
        boxShadow: "0 10px 28px rgba(14,165,233,0.08)",
        display: "flex", alignItems: "center", gap: 16, textAlign: "left",
      }}>
        <div style={{ width: secIconSize, height: secIconSize, borderRadius: 9999, background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)", display: "grid", placeItems: "center", boxShadow: isPhone ? "0 4px 12px rgba(14,165,233,0.14)" : "0 8px 20px rgba(14,165,233,0.20)", flexShrink: 0 }}>
          <Compass size={isPhone ? 20 : 24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: secTitleSize, fontWeight: 900, color: "rgba(7,89,133,0.92)", letterSpacing: -0.3 }}>Take Placement Test</div>
          {!isPhone && <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(7,89,133,0.55)", marginTop: 2 }}>Kiểm tra trình độ</div>}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone ? "Biết chính xác trình độ của bạn — 6 phút." : "Biết chính xác trình độ thật của bạn. 6–9 phút."}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              Know exactly where you stand. About 6–9 minutes.
            </div>
          )}
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
      onClick={() => nav("/exam/vstep")}
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
            width: secIconSize,
            height: secIconSize,
            borderRadius: 9999,
            background: "linear-gradient(180deg, #DC2626 0%, #B45309 100%)",
            display: "grid",
            placeItems: "center",
            boxShadow: isPhone ? "0 4px 12px rgba(185,28,28,0.16)" : "0 8px 20px rgba(185,28,28,0.22)",
            flexShrink: 0,
          }}
        >
          <GraduationCap size={isPhone ? 20 : 24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: secTitleSize,
              fontWeight: 900,
              color: "rgba(127,29,29,0.94)",
              letterSpacing: -0.3,
            }}
          >
            Chinh phục B2 VSTEP
          </div>
          {!isPhone && (
            <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(127,29,29,0.55)", marginTop: 2 }}>
              VSTEP — Kỳ thi năng lực ngoại ngữ Việt Nam
            </div>
          )}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone ? "Đúng định dạng Bộ. Đạt chuẩn đầu ra." : "Học đúng định dạng Bộ Giáo dục. Đạt chuẩn đầu ra."}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              Speaking B1 + B2, 30 chủ đề, mẹo riêng cho người Việt.
            </div>
          )}
        </div>

        <div style={{ color: "rgba(185,28,28,0.70)", flexShrink: 0 }}>
          <ChevronRight size={22} />
        </div>
      </div>
    </button>
  );

  // Pair-aware Home routing (Duolingo onboarding PR 3). Reuses the
  // profile already fetched for the onboarding gate above — no extra
  // query. A NON-English primary target gets its own focused track
  // home (a NEW surface). English / unknown / not-yet-loaded falls
  // through to the canonical (vi,en) Home below — byte-identical for
  // the 95% audience (locked #14). A multi-target user keeps the
  // canonical home and gains a switcher pinned at the top. Placed
  // after every Home hook (Rules of Hooks — [[feedback_react_hooks_ordering]]).
  // Signed-in users: the profile row is the source of truth (byte
  // identical to before — locked #14). Anonymous visitors have no
  // profile, so fall back to the localStorage pair they picked in the
  // picker; parseLanguagePair stays the single owner of pair parsing.
  // Plain sync read (not a hook) — keeps Rules-of-Hooks ordering intact
  // ([[feedback_react_hooks_ordering]]).
  const anonPair = onboardingProfile ? null : readAnonymousPair();
  const pairSource =
    onboardingProfile ??
    (anonPair
      ? {
          native_language: anonPair.native,
          target_languages: anonPair.targets,
        }
      : null);
  const {
    nativeLanguage: pairNative,
    targets: pairTargets,
    primaryTarget: pairPrimary,
  } = parseLanguagePair(pairSource);
  if (pairPrimary && pairPrimary !== "en") {
    return (
      <LanguageTrackHome
        nativeLanguage={pairNative}
        targets={pairTargets}
        primaryTarget={pairPrimary}
      />
    );
  }

  return (
    <div style={wrap}>
      {/* Multi-target users keep this canonical (vi,en) home unchanged
          but gain a switcher at the top. Single-target (the 95%) →
          condition false → nothing rendered → DOM identical to today
          (locked #14). */}
      {pairTargets.length > 1 ? (
        <TargetSwitcher targets={pairTargets} primaryTarget={pairPrimary} />
      ) : null}
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
        <XPBadge />
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
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(13), fontWeight: 600, color: isPhone ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.48)", lineHeight: 1.4 }}>
            {isPhone ? "See your pronunciation score in 12 seconds." : "See your pronunciation score in 12 seconds — no signup."}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 2, fontSize: z(12), fontWeight: 500, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              Xem điểm phát âm của bạn trong 12 giây — không cần đăng nhập.
            </div>
          )}
        </section>

        {/* Main content — hierarchy:
              1. Today's Lesson (one obvious next step)
              2. Teacher Mercy (the hero relationship)
              3. Progress (returning users see momentum)
              4. Secondary learning paths (recommendations + entry points + exam prep) */}
        <section ref={stageRef} style={{ marginTop: isPhone ? 10 : 14, display: "flex", flexDirection: "column", gap: isPhone ? 10 : 12 }} aria-label="Homepage choices">
          {/* Daily pronunciation challenge — sits at the very top
              when active. Self-gates on the daily_challenge_enabled
              feature flag and hides itself once the user has a
              completion for today. */}
          <DailyChallengeCard isPhone={isPhone} />

          {/* ── 2. Teacher Mercy ─────────────────────────────────────────
              Hero card. Same handler as before (auth → bubble open;
              anon → /signin), with the inline anon "Phát âm thử ngay"
              pill preserved inside the card. */}
          {teacherCard}

          {isPlacementEntryRouteAvailable() && placementCard}

          {/* Try one word — no signup. On desktop: standalone card.
              On mobile: compact chip nested under Teacher Mercy so the
              primary action stays dominant. */}
          {isPhone ? (
            <button
              type="button"
              onClick={handleTryOneWord}
              aria-label="Try pronunciation — no signup"
              style={{
                width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer",
                marginTop: -2,
              }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 16px", borderRadius: 14,
                background: "rgba(14,116,144,0.06)", border: "1px solid rgba(14,116,144,0.10)",
              }}>
                <Mic size={16} style={{ color: "rgba(14,116,144,0.60)", flexShrink: 0 }} />
                <span style={{ fontSize: z(13), fontWeight: 700, color: "rgba(8,75,90,0.78)", flex: 1, textAlign: "left" }}>
                  Thử phát âm ngay — không cần đăng nhập
                </span>
                <ChevronRight size={14} style={{ color: "rgba(14,116,144,0.45)", flexShrink: 0 }} />
              </div>
            </button>
          ) : (
            tryOneWordCard
          )}

          {/* ── 3. Progress ──────────────────────────────────────────────
              Weekly progress widget renders only for signed-in users
              with attempts. The story-share prompt sits adjacent because
              it's a celebratory progress signal — self-gates on
              eligibility (paid, 21+ days, 50+ attempts, sustained
              improvement) AND a 30-day cooldown, so it renders nothing
              for new or struggling learners. */}
          <WeeklyProgressWidget />
          <StoryPromptCard />

          {/* ── 4. Secondary learning paths ──────────────────────────────
              Mercy-flavoured recommendations, alternative entry points,
              and exam-prep marketing surfaces. Each card self-gates so
              users who don't qualify see less, not more. */}

          {/* Practice recommendation — Mercy's "what should I practice
              tonight?" card. Self-fetching, hidden when the feature flag
              is off, the user is anonymous, or no rule fires. */}
          <PracticeRecommendationCard />

          {/* Targeted phoneme drill — surfaced when a weak phoneme has
              both signal (5+ attempts) and a hand-curated drill pack.
              Self-gates on its own feature flag + 24h cooldown. */}
          <RecommendedDrillCard />

          {/* ── Intent group: "Prepare for exams" ─────────────────────
              Goal-oriented learners scan for their exam. Grouped so the
              eye can skip the whole block if not exam-prepping. */}
          {isPhone && (
            <div style={{
              marginTop: 12, paddingTop: 10,
              borderTop: "1px solid rgba(0,0,0,0.06)",
              fontSize: z(10), fontWeight: 700, letterSpacing: 1.2,
              textTransform: "uppercase", color: "rgba(0,0,0,0.32)",
            }}>
              Luyện thi
            </div>
          )}
          <ProgressiveDisclosureCard
            cardId="ielts"
            title="IELTS Speaking"
            shortLine="Band 5 → Band 7"
            accentColor="#10B981"
            iconBg="rgba(236,253,245,0.96)"
            iconEl={<GraduationCap size={isPhone ? 20 : 24} color="white" />}
            onStart={() => nav("/exam-prep/ielts/speaking")}
            startLabel="Open IELTS Speaking →"
          >
            {ieltsSpeakingCard}
          </ProgressiveDisclosureCard>
          <ProgressiveDisclosureCard
            cardId="toeic"
            title="Luyện TOEIC"
            shortLine="TOEIC 450 → 750+"
            accentColor="#6366F1"
            iconBg="rgba(238,242,255,0.96)"
            iconEl={<GraduationCap size={isPhone ? 20 : 24} color="white" />}
            onStart={() => nav("/exam-prep/toeic")}
            startLabel="Open TOEIC practice →"
          >
            {toeicCard}
          </ProgressiveDisclosureCard>
          <ProgressiveDisclosureCard
            cardId="vstep"
            title="Chinh phục B2 VSTEP"
            shortLine="Đúng định dạng Bộ. Đạt chuẩn đầu ra."
            accentColor="#B91C1C"
            iconBg="rgba(254,242,242,0.96)"
            iconEl={<GraduationCap size={isPhone ? 20 : 24} color="white" />}
            onStart={() => nav("/exam/vstep")}
            startLabel="Open VSTEP prep →"
          >
            {vstepCard}
          </ProgressiveDisclosureCard>

          {/* ── Intent group: "Explore & improve" ────────────────────
              Browsing, practice, and discovery. Everything below this
              label is supplementary — not the main path. */}
          {isPhone && (
            <div style={{
              marginTop: 12, paddingTop: 10,
              borderTop: "1px solid rgba(0,0,0,0.06)",
              fontSize: z(10), fontWeight: 700, letterSpacing: 1.2,
              textTransform: "uppercase", color: "rgba(0,0,0,0.32)",
            }}>
              Khám phá
            </div>
          )}
          <ProgressiveDisclosureCard
            cardId="library"
            title="Library"
            shortLine="Đọc. Nghe. Tiến bộ từng ngày."
            accentColor="#14B8A6"
            iconBg="rgba(236,255,252,0.96)"
            iconEl={<LibraryBig size={isPhone ? 20 : 24} color="white" />}
            onStart={handleLibrary}
            startLabel="Open Library →"
          >
            {libraryCard}
          </ProgressiveDisclosureCard>
          <FocusAreasCard />

          {/* Stage-3A discovery — local-only weakness map. Coexists
              with FocusAreasCard (Supabase): different consumers,
              different posture. C5 dispatch — per C1 recon. */}
          <button
            type="button"
            data-testid="home-weak-at-link"
            onClick={() => nav("/weak-at")}
            className="w-full rounded-[20px] border border-slate-200 bg-white px-5 py-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  Xem điểm bạn cần luyện
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  See what you're working on
                </p>
              </div>
              <ChevronRight size={20} className="shrink-0 text-slate-400" aria-hidden="true" />
            </div>
          </button>

          {/* Weekly leaderboard — retention card (feature-flagged). */}
          {leaderboardEnabled && Boolean(user) && <LeaderboardCard />}

          {/* The default home renders only the learner's chosen pair
              (VI→EN here). The other built tracks are NOT un-surfaced
              (STRATEGY §4 / the #582 v3.0 reversal) — they stay
              discoverable via this explicit affordance and the
              /languages index. Diagnosis: /languages had ZERO inbound
              links before this; this affordance is now the discovery
              entry point that the old all-tracks grid implicitly was. */}
          <button
            type="button"
            onClick={() => nav("/languages")}
            aria-label="Explore other languages"
            style={{
              marginTop: 4,
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "rgba(0,0,0,0.86)" }}>
                Khám phá ngôn ngữ khác
              </span>
              <span style={{ display: "block", marginTop: 2, fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.45)" }}>
                Hàn · Nhật · Trung · Pháp · Đức · Tây Ban Nha…
              </span>
            </span>
            <span aria-hidden style={{ fontSize: 20, fontWeight: 800, color: "rgba(0,0,0,0.4)" }}>
              →
            </span>
          </button>
        </section>

        {/* Floating bubbles */}
        <div style={{ marginTop: isPhone ? 10 : 18 }}>
          {sharedReady ? (
            <React.Fragment key={sharedKey}>
              {isTeacherMercyAllowed ? (
                <Suspense fallback={null}>
                  <MercyGuide
                    // Only inject Try-one-word props after the user has
                    // clicked the card (id > 0). Pre-click, leave undefined
                    // so MercyGuide keeps its existing default tab.
                    initialTab={tryOneWordRequestId > 0 ? "pronunciation" : undefined}
                    initialPracticeLine={tryOneWordRequestId > 0 ? TRY_ONE_WORD_LINE : undefined}
                    openRequestId={tryOneWordRequestId}
                  />
                </Suspense>
              ) : null}
            </React.Fragment>
          ) : null}
        </div>
      </div>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: `calc(${isPhone ? 8 : 10}px + env(safe-area-inset-bottom, 0px))`, zIndex: 80, padding: "0 16px", pointerEvents: "none" }} aria-label="Bottom music dock">
        <div style={{ maxWidth: PAGE_MAX, margin: "0 auto", pointerEvents: "auto" }}>
          <BottomMusicBar />
        </div>
      </div>
    </div>
  );
}
