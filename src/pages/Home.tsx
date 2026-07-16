/**
 * File: Home.tsx
 * Path: src/pages/Home.tsx
 */

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Compass, GraduationCap, LibraryBig, Mic, UsersRound } from "lucide-react";

import BottomMusicBar from "@/components/audio/BottomMusicBar";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { reportRouteMountPerf } from "@/lib/monitoring/routePerf";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { recordLearningEvent } from "@/lib/tutor/learningEvents";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";
import LanguageTrackHome, {
  TargetSwitcher,
} from "@/pages/home/LanguageTrackHome";
import { parseLanguagePair } from "@/lib/languagePair/languagePair";
import { readAnonymousPair } from "@/lib/languagePair/anonymousPair";
import type { NativeLang } from "@/components/languages/nativeContent";
import { pickHomeCopy, type HomeNativeSlots } from "@/components/home/nativeCopy";
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
const PARENT_VIEW_ROUTE = "/parent/me";

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

export default function Home({ nativeLangOverride }: { nativeLangOverride?: NativeLang } = {}) {
  // Route mount-perf observer. Captured first so the elapsed time
  // covers the full hook prologue + render. Breadcrumb-only via
  // reportRouteMountPerf; zero behavior change.
  const routeMountStartRef = useRef<number>(performance.now());
  useEffect(() => {
    reportRouteMountPerf("home", performance.now() - routeMountStartRef.current);
  }, []);

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

  // ── Native language for copy selection ──────────────────────────────────────
  // Moved early so t() is available in all render paths (helper functions +
  // main return). nativeLangOverride wins for /learn/<native>/english routes;
  // otherwise falls back to the stored pair or "vi" for legacy /vietnamese-english/.
  const anonPairEarly = onboardingProfile ? null : readAnonymousPair();
  const pairSourceEarly =
    onboardingProfile ??
    (anonPairEarly
      ? { native_language: anonPairEarly.native, target_languages: anonPairEarly.targets }
      : null);
  const { nativeLanguage: pairNativeEarly } = parseLanguagePair(pairSourceEarly);
  const effectiveNative = nativeLangOverride ?? pairNativeEarly ?? "vi";
  const t = (vi: string, en: string) => effectiveNative === "vi" ? vi : en;
  const nt = (slots: HomeNativeSlots) => pickHomeCopy(slots, effectiveNative);
  const showVietnameseGloss = effectiveNative === "vi";

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

  const handleParentProgress = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    nav(PARENT_VIEW_ROUTE);
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
        aria-label={`${title}. ${isExpanded ? "Collapse details" : "Preview details"}`}
        className="mb-a11y-card-button"
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
          aria-label={nt({ en: "Open AI Tutor with Teacher Mercy", vi: "Mở AI Tutor với Giáo viên Mercy", es: "Abre AI Tutor con Teacher Mercy", fr: "Ouvrir AI Tutor avec Teacher Mercy", de: "AI Tutor mit Teacher Mercy öffnen", ru: "Открыть AI Tutor с Teacher Mercy", pa: "Teacher Mercy ਨਾਲ AI Tutor ਖੋਲ੍ਹੋ", sw: "Fungua AI Tutor na Teacher Mercy", ja: "AIチューターを開く", zh: "打开 AI 导师", id: "Buka AI Tutor bersama Teacher Mercy", th: "เปิด AI Tutor กับ Teacher Mercy", ar: "افتح مدرس الذكاء الاصطناعي مع Teacher Mercy", hi: "Teacher Mercy के साथ AI Tutor खोलें", ur: "Teacher Mercy کے ساتھ AI Tutor کھولیں", ko: "Teacher Mercy와 함께 AI Tutor 열기", pt: "Abra o AI Tutor com Teacher Mercy", tr: "Teacher Mercy ile AI Tutor'u Aç" })}
          className="mb-a11y-card-button"
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
              src="/teacher-mercy.webp"
              alt="Teacher Mercy"
              width={1024}
              height={1024}
              {...({ fetchpriority: "high" } as Record<string, string>)}
              loading="eager"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }}
            />
          </picture>
        </div>

        <div style={{ marginTop: 16, fontSize: isPhone ? z(22) : z(30), fontWeight: 950, letterSpacing: -0.5, color: "rgba(100,30,60,0.94)", lineHeight: 1.15 }}>
          Teacher Mercy
        </div>
        {showVietnameseGloss && (
          <div style={{ marginTop: 4, fontSize: z(13), fontWeight: 700, color: "rgba(140,60,90,0.62)", letterSpacing: 0.2 }}>
            Giáo viên Mercy
          </div>
        )}

        <div style={{ marginTop: 14, fontSize: isPhone ? z(14) : z(16), fontWeight: 700, color: "rgba(80,20,45,0.78)", lineHeight: 1.6, maxWidth: "min(340px, 100%)", margin: "14px auto 0" }}>
          {nt({ en: "Open AI Tutor to practice with Mercy. Mercy remembers your progress.", vi: "Mở AI Tutor để luyện câu với Mercy. Mercy sẽ nhớ tiến bộ học của bạn.", es: "Abre AI Tutor para practicar con Mercy. Mercy recuerda tu progreso.", fr: "Ouvrez AI Tutor pour pratiquer avec Mercy. Mercy se souvient de vos progrès.", de: "Öffne den AI Tutor, um mit Mercy zu üben. Mercy merkt sich deine Fortschritte.", ru: "Откройте AI Tutor, чтобы практиковаться с Mercy. Mercy запоминает ваш прогресс.", pa: "Mercy ਨਾਲ ਅਭਿਆਸ ਕਰਨ ਲਈ AI Tutor ਖੋਲ੍ਹੋ। Mercy ਤੁਹਾਡੀ ਤਰੱਕੀ ਯਾਦ ਰੱਖਦੀ ਹੈ।", sw: "Fungua AI Tutor kufanya mazoezi na Mercy. Mercy anakumbuka maendeleo yako.", ja: "AIチューターを開いてMercyと文章を練習。Mercyが学習の進捗を記録します。", zh: "打开 AI 导师，和 Mercy 练习句子。Mercy 会记住你的学习进度。", id: "Buka AI Tutor untuk berlatih dengan Mercy. Mercy mengingat kemajuanmu.", th: "เปิด AI Tutor เพื่อฝึกกับ Mercy Mercy จดจำความก้าวหน้าของคุณ", ar: "افتح مدرس الذكاء الاصطناعي للتدرب مع Mercy. Mercy تتذكر تقدمك.", hi: "Mercy के साथ अभ्यास करने के लिए AI Tutor खोलें। Mercy आपकी प्रगति याद रखती है।", ur: "Mercy کے ساتھ مشق کرنے کے لیے AI Tutor کھولیں۔ Mercy آپ کی پیشرفت یاد رکھتی ہے۔", ko: "Mercy와 함께 연습하려면 AI Tutor를 여세요. Mercy가 여러분의 진행 상황을 기억합니다.", pt: "Abra o AI Tutor para praticar com a Mercy. A Mercy lembra do seu progresso.", tr: "Mercy ile pratik yapmak için AI Tutor'u açın. Mercy ilerlemenizi hatırlar." })}
        </div>
        {!isPhone && (
          <div style={{ marginTop: 6, fontSize: z(13), fontWeight: 600, color: "rgba(140,60,90,0.58)", lineHeight: 1.5 }}>
            {nt({ en: "Practice sentences with Mercy. Correction, memory, and review in one place.", vi: "Luyện câu với Mercy. Sửa lỗi, ghi nhớ, và ôn tập trong cùng một chỗ.", es: "Practica frases con Mercy. Corrección, memoria y repaso en un solo lugar.", fr: "Entraîne-toi à faire des phrases avec Mercy. Correction, mémorisation et révision au même endroit.", de: "Übe Sätze mit Mercy. Korrektur, Merken und Wiederholen an einem Ort.", ru: "Практикуйте предложения с Mercy. Исправление, запоминание и повторение в одном месте.", pa: "Mercy ਨਾਲ ਵਾਕਾਂ ਦਾ ਅਭਿਆਸ ਕਰੋ। ਸੁਧਾਰ, ਯਾਦ ਅਤੇ ਸਮੀਖਿਆ ਇੱਕ ਥਾਂ 'ਤੇ।", sw: "Fanya mazoezi ya sentensi na Mercy. Marekebisho, kumbukumbu na mapitio mahali pamoja.", ja: "Mercyと文章練習。訂正、記憶、復習が一つに。", zh: "和 Mercy 练习句子。纠正、记忆和复习，一站式完成。", id: "Latih kalimat bersama Mercy. Koreksi, memori, dan ulasan dalam satu tempat.", th: "ฝึกประโยคกับ Mercy การแก้ไข การจดจำ และการทบทวนในที่เดียว", ar: "تمرن على الجمل مع Mercy. التصحيح والتذكر والمراجعة في مكان واحد.", hi: "Mercy के साथ वाक्यों का अभ्यास करें। सुधार, याद रखना और समीक्षा, सब एक जगह।", ur: "Mercy کے ساتھ جملوں کی مشق کریں۔ تصحیح، یادداشت، اور جائزہ ایک جگہ پر۔", ko: "Mercy와 함께 문장을 연습하세요. 교정, 기억, 복습이 한 곳에서 이루어집니다.", pt: "Pratique frases com a Mercy. Correção, memória e revisão em um só lugar.", tr: "Mercy ile cümle pratiği yapın. Düzeltme, hafıza ve tekrar tek bir yerde." })}
          </div>
        )}

        <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 9999, background: "rgba(180,60,100,0.10)", border: "1px solid rgba(180,60,100,0.18)", color: "rgba(120,30,60,0.90)", fontWeight: 900, fontSize: z(14) }}>
          {nt({ en: "Open AI Tutor →", vi: "Mở AI Tutor →", es: "Abrir AI Tutor →", fr: "Ouvrir AI Tutor →", de: "AI Tutor öffnen →", ru: "Открыть AI Tutor →", pa: "AI Tutor ਖੋਲ੍ਹੋ →", sw: "Fungua AI Tutor →", ja: "AIチューターを開く →", zh: "打开 AI 导师 →", id: "Buka AI Tutor →", th: "เปิด AI Tutor →", ar: "افتح مدرس الذكاء الاصطناعي ←", hi: "AI Tutor खोलें →", ur: "AI Tutor کھولیں →", ko: "AI Tutor 열기 →", pt: "Abrir AI Tutor →", tr: "AI Tutor'u Aç →" })}
        </div>
        {!access.isAuthenticated && showVietnameseGloss && (
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
            className="mb-a11y-chip"
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
            {nt({ en: "Try pronunciation now — no signup needed", vi: "Thử phát âm ngay — không cần đăng nhập", es: "Prueba la pronunciación ahora — sin registro", fr: "Essayez la prononciation maintenant — sans inscription", de: "Jetzt Aussprache testen — keine Anmeldung nötig", ru: "Попробуйте произношение сейчас — без регистрации", pa: "ਹੁਣੇ ਉਚਾਰਨ ਅਜ਼ਮਾਓ — ਸਾਈਨ ਅੱਪ ਦੀ ਲੋੜ ਨਹੀਂ", sw: "Jaribu matamshi sasa — hakuna haja ya kujisajili", ja: "今すぐ発音を試す — サインアップ不要", zh: "立即试发音 — 无需登录", id: "Coba pengucapan sekarang — tanpa perlu daftar", th: "ลองออกเสียงตอนนี้ — ไม่ต้องสมัครสมาชิก", ar: "جرب النطق الآن — لا حاجة للتسجيل", hi: "अभी उच्चारण आज़माएं — साइनअप की ज़रूरत नहीं", ur: "ابھی تلفظ آزمائیں — سائن اپ کی ضرورت نہیں", ko: "지금 발음을 체험해보세요 — 가입 불필요", pt: "Experimente a pronúncia agora — sem precisar se cadastrar", tr: "Şimdi telaffuzu dene — kayıt gerekmez" })}
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
      aria-label={nt({ en: "Try pronunciation — no signup needed", vi: "Thử phát âm — không cần đăng nhập", es: "Prueba la pronunciación — sin registro", fr: "Essayez la prononciation — sans inscription", de: "Aussprache testen — keine Anmeldung nötig", ru: "Попробуйте произношение — без регистрации", pa: "ਉਚਾਰਨ ਅਜ਼ਮਾਓ — ਸਾਈਨ ਅੱਪ ਦੀ ਲੋੜ ਨਹੀਂ", sw: "Jaribu matamshi — hakuna haja ya kujisajili", ja: "発音を試す — サインアップ不要", zh: "试发音 — 无需登录", id: "Coba pengucapan — tanpa perlu daftar", th: "ลองออกเสียง — ไม่ต้องสมัครสมาชิก", ar: "جرب النطق — لا حاجة للتسجيل", hi: "उच्चारण आज़माएं — साइनअप की ज़रूरत नहीं", ur: "تلفظ آزمائیں — سائن اپ کی ضرورت نہیں", ko: "발음 체험하기 — 가입 불필요", pt: "Experimente a pronúncia — sem cadastro", tr: "Telaffuzu dene — kayıt gerekmez" })}
      className="mb-a11y-card-button"
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
            {nt({ en: "Try one word — no signup", vi: "Thử một từ — không cần đăng nhập", es: "Prueba una palabra — sin registro", fr: "Essayez un mot — sans inscription", de: "Ein Wort testen — keine Anmeldung", ru: "Попробуйте одно слово — без регистрации", pa: "ਇੱਕ ਸ਼ਬਦ ਅਜ਼ਮਾਓ — ਸਾਈਨ ਅੱਪ ਨਹੀਂ", sw: "Jaribu neno moja — bila kujisajili", ja: "一言試す — サインアップ不要", zh: "试说一个词 — 无需登录", id: "Coba satu kata — tanpa daftar", th: "ลองหนึ่งคำ — ไม่ต้องสมัคร", ar: "جرب كلمة واحدة — بدون تسجيل", hi: "एक शब्द आज़माएं — साइनअप नहीं", ur: "ایک لفظ آزمائیں — سائن اپ کی ضرورت نہیں", ko: "한 단어 체험하기 — 가입 없음", pt: "Experimente uma palavra — sem cadastro", tr: "Bir kelime dene — kayıt gerekmez" })}
          </div>
          {!isPhone && (
            <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(8,75,90,0.55)", marginTop: 2 }}>
              {nt({ en: "Try pronunciation — no signup", vi: "Thử phát âm — không cần đăng nhập", es: "Prueba la pronunciación — sin registro", fr: "Essayez la prononciation — sans inscription", de: "Aussprache testen — keine Anmeldung", ru: "Попробуйте произношение — без регистрации", pa: "ਉਚਾਰਨ ਅਜ਼ਮਾਓ — ਸਾਈਨ ਅੱਪ ਨਹੀਂ", sw: "Jaribu matamshi — bila kujisajili", ja: "発音を試す — サインアップ不要", zh: "试发音 — 无需登录", id: "Coba pengucapan — tanpa daftar", th: "ลองออกเสียง — ไม่ต้องสมัคร", ar: "جرب النطق — بدون تسجيل", hi: "उच्चारण आज़माएं — साइनअप नहीं", ur: "تلفظ آزمائیں — سائن اپ کی ضرورت نہیں", ko: "발음 체험하기 — 가입 없음", pt: "Experimente a pronúncia — sem cadastro", tr: "Telaffuzu dene — kayıt gerekmez" })}
            </div>
          )}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone
              ? nt({ en: "Get a pronunciation score in 12 seconds.", vi: "Nhận điểm phát âm trong 12 giây.", es: "Obtén tu puntuación de pronunciación en 12 segundos.", fr: "Obtenez votre note de prononciation en 12 secondes.", de: "Erhalte deine Aussprachebewertung in 12 Sekunden.", ru: "Получите оценку произношения за 12 секунд.", pa: "12 ਸਕਿੰਟਾਂ ਵਿੱਚ ਉਚਾਰਨ ਸਕੋਰ ਪ੍ਰਾਪਤ ਕਰੋ।", sw: "Pata alama ya matamshi kwa sekunde 12.", ja: "12秒で発音スコアを取得。", zh: "12 秒获得发音评分。", id: "Dapatkan skor pengucapan dalam 12 detik.", th: "รับคะแนนการออกเสียงภายใน 12 วินาที", ar: "احصل على درجة النطق في 12 ثانية.", hi: "12 सेकंड में उच्चारण स्कोर पाएं।", ur: "12 سیکنڈ میں تلفظ کا اسکور حاصل کریں۔", ko: "12초 만에 발음 점수를 확인하세요.", pt: "Obtenha uma nota para sua pronúncia em 12 segundos.", tr: "12 saniyede telaffuz puanını al." })
              : nt({ en: "Hear how MercyBlade scores your pronunciation in 12 seconds.", vi: "Nghe MercyBlade chấm điểm phát âm của bạn trong 12 giây.", es: "Escucha cómo MercyBlade evalúa tu pronunciación en 12 segundos.", fr: "Écoutez comment MercyBlade évalue votre prononciation en 12 secondes.", de: "Hör, wie MercyBlade deine Aussprache in 12 Sekunden bewertet.", ru: "Услышьте, как MercyBlade оценивает ваше произношение за 12 секунд.", pa: "ਸੁਣੋ ਕਿ MercyBlade 12 ਸਕਿੰਟਾਂ ਵਿੱਚ ਤੁਹਾਡੇ ਉਚਾਰਨ ਦਾ ਸਕੋਰ ਕਿਵੇਂ ਦਿੰਦਾ ਹੈ।", sw: "Sikia jinsi MercyBlade inavyokadiria matamshi yako kwa sekunde 12.", ja: "MercyBladeが12秒で発音を採点するのを聞いてみよう。", zh: "在 12 秒内，听听 MercyBlade 如何给你的发音评分。", id: "Dengarkan bagaimana MercyBlade menilai pengucapanmu dalam 12 detik.", th: "ฟังว่า MercyBlade ให้คะแนนการออกเสียงของคุณอย่างไรใน 12 วินาที", ar: "اسمع كيف يقوم MercyBlade بتقييم نطقك في 12 ثانية.", hi: "सुनें कैसे MercyBlade 12 सेकंड में आपके उच्चारण का स्कोर देता है।", ur: "سنیں کہ MercyBlade 12 سیکنڈ میں آپ کے تلفظ کو کیسے اسکور کرتا ہے۔", ko: "MercyBlade가 12초 만에 여러분의 발음을 어떻게 평가하는지 들어보세요.", pt: "Ouça como o MercyBlade avalia sua pronúncia em 12 segundos.", tr: "MercyBlade'in 12 saniyede telaffuzunu nasıl puanladığını duy." })}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              {showVietnameseGloss && "Nhận điểm phát âm từ MercyBlade chỉ trong 12 giây."}
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
    <button type="button" onClick={handleLibrary} aria-label={nt({ en: "Open library", vi: "Mở thư viện", es: "Abrir biblioteca", fr: "Ouvrir la bibliothèque", de: "Bibliothek öffnen", ru: "Открыть библиотеку", pa: "ਲਾਇਬ੍ਰੇਰੀ ਖੋਲ੍ਹੋ", sw: "Fungua maktaba", ja: "ライブラリを開く", zh: "打开学习库", id: "Buka perpustakaan", th: "เปิดคลังบทเรียน", ar: "افتح المكتبة", hi: "लाइब्रेरी खोलें", ur: "لائبریری کھولیں", ko: "라이브러리 열기", pt: "Abrir biblioteca", tr: "Kütüphaneyi aç" })}
      className="mb-a11y-card-button"
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
          <div style={{ fontSize: secTitleSize, fontWeight: 900, color: "rgba(0,80,70,0.92)", letterSpacing: -0.3 }}>{nt({ en: "Library", vi: "Thư viện", es: "Biblioteca", fr: "Bibliothèque", de: "Bibliothek", ru: "Библиотека", pa: "ਲਾਇਬ੍ਰੇਰੀ", sw: "Maktaba", ja: "ライブラリ", zh: "学习库", id: "Perpustakaan", th: "คลังบทเรียน", ar: "المكتبة", hi: "लाइब्रेरी", ur: "لائبریری", ko: "라이브러리", pt: "Biblioteca", tr: "Kütüphane" })}</div>
          {!isPhone && <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(0,100,85,0.52)", marginTop: 2 }}>{nt({ en: "Library", vi: "Thư viện", es: "Biblioteca", fr: "Bibliothèque", de: "Bibliothek", ru: "Библиотека", pa: "ਲਾਇਬ੍ਰੇਰੀ", sw: "Maktaba", ja: "ライブラリ", zh: "学习库", id: "Perpustakaan", th: "คลังบทเรียน", ar: "المكتبة", hi: "लाइब्रेरी", ur: "لائبریری", ko: "라이브러리", pt: "Biblioteca", tr: "Kütüphane" })}</div>}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone ? nt({ en: "Read. Listen. Improve every day.", vi: "Đọc. Nghe. Tiến bộ từng ngày.", es: "Lee. Escucha. Mejora cada día.", fr: "Lis. Écoute. Progresse chaque jour.", de: "Lies. Hör. Verbessere dich täglich.", ru: "Читай. Слушай. Совершенствуйся каждый день.", pa: "ਪੜ੍ਹੋ। ਸੁਣੋ। ਹਰ ਰੋਜ਼ ਸੁਧਾਰ ਕਰੋ।", sw: "Soma. Sikiliza. Boresha kila siku.", ja: "読む。聞く。毎日上達。", zh: "阅读。倾听。每天进步。", id: "Baca. Dengarkan. Tingkatkan setiap hari.", th: "อ่าน ฟัง พัฒนาทุกวัน", ar: "اقرأ. استمع. تحسن كل يوم.", hi: "पढ़ें। सुनें। हर दिन सुधार करें।", ur: "پڑھیں۔ سنیں۔ ہر روز بہتر بنیں۔", ko: "읽으세요. 들어보세요. 매일 발전하세요.", pt: "Leia. Ouça. Melhore a cada dia.", tr: "Oku. Dinle. Her gün geliş." }) : nt({ en: "Read. Listen. Reflect. Improve every day.", vi: "Đọc. Nghe. Suy ngẫm. Tiến bộ từng ngày.", es: "Lee. Escucha. Reflexiona. Mejora cada día.", fr: "Lis. Écoute. Réfléchis. Progresse chaque jour.", de: "Lies. Hör. Reflektiere. Verbessere dich täglich.", ru: "Читай. Слушай. Размышляй. Совершенствуйся каждый день.", pa: "ਪੜ੍ਹੋ। ਸੁਣੋ। ਸੋਚੋ। ਹਰ ਰੋਜ਼ ਸੁਧਾਰ ਕਰੋ।", sw: "Soma. Sikiliza. Tafakari. Boresha kila siku.", ja: "読む。聞く。振り返る。毎日上達。", zh: "阅读。倾听。反思。每天进步。", id: "Baca. Dengarkan. Renungkan. Tingkatkan setiap hari.", th: "อ่าน ฟัง ไตร่ตรอง พัฒนาทุกวัน", ar: "اقرأ. استمع. تأمل. تحسن كل يوم.", hi: "पढ़ें। सुनें। चिंतन करें। हर दिन सुधार करें।", ur: "پڑھیں۔ سنیں۔ غور کریں۔ ہر روز بہتر بنیں۔", ko: "읽으세요. 들어보세요. 생각해보세요. 매일 발전하세요.", pt: "Leia. Ouça. Reflita. Melhore a cada dia.", tr: "Oku. Dinle. Düşün. Her gün geliş." })}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              {nt({ en: "Read, listen, reflect — build a real English habit.", vi: "Đọc, nghe, suy ngẫm — xây dựng thói quen tiếng Anh thực sự.", es: "Lee, escucha, reflexiona — crea un hábito de inglés real.", fr: "Lis, écoute, réfléchis — construis une vraie habitude d'anglais.", de: "Lies, hör, reflektiere — entwickle eine echte englische Gewohnheit.", ru: "Читай, слушай, размышляй — выработай настоящую английскую привычку.", pa: "ਪੜ੍ਹੋ, ਸੁਣੋ, ਸੋਚੋ — ਇੱਕ ਸੱਚੀ ਅੰਗਰੇਜ਼ੀ ਆਦਤ ਬਣਾਓ।", sw: "Soma, sikiliza, tafakari — jenga tabia halisi ya Kiingereza.", ja: "読む、聞く、振り返る — 本当の英語習慣を身につけよう。", zh: "阅读、倾听、反思 — 养成真正的英语习惯。", id: "Baca, dengarkan, renungkan — bangun kebiasaan Inggris yang nyata.", th: "อ่าน ฟัง ไตร่ตรอง — สร้างนิสัยภาษาอังกฤษที่แท้จริง", ar: "اقرأ، استمع، تأمل — ابنِ عادة إنجليزية حقيقية.", hi: "पढ़ें, सुनें, चिंतन करें — एक वास्तविक अंग्रेज़ी की आदत बनाएं।", ur: "پڑھیں، سنیں، غور کریں — ایک حقیقی انگریزی عادت بنائیں۔", ko: "읽고, 듣고, 생각하며 — 진짜 영어 습관을 만들어보세요.", pt: "Leia, ouça, reflita — crie um hábito real de inglês.", tr: "Oku, dinle, düşün — gerçek bir İngilizce alışkanlığı edin." })}
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
    <button type="button" onClick={() => nav("/exam-prep/toeic")} aria-label={t("Mở gói luyện TOEIC", "Open TOEIC practice pack")}
      className="mb-a11y-card-button"
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
            {t("Luyện TOEIC", "TOEIC Practice")}
          </div>
          {!isPhone && (
            <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(67,56,202,0.55)", marginTop: 2 }}>
              TOEIC 450 → 750+
            </div>
          )}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone ? t("Luyện đúng định dạng, giải thích bằng tiếng Việt.", "Practice the official format with clear explanations.") : t("Luyện đúng định dạng. Hiểu sâu nhờ giải thích tiếng Việt.", "Practice the official format. Understand each answer clearly.")}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              {t("Official format, Vietnamese explanations — built for the score you need.", "Official format, clear explanations — built for the score you need.")}
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
    <button type="button" onClick={() => nav("/exam-prep/ielts/speaking")} aria-label={t("Mở gói IELTS Speaking", "Open IELTS Speaking content pack")}
      className="mb-a11y-card-button"
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
            {showVietnameseGloss ? (isPhone ? "Biết band hiện tại, biết cách nâng lên." : "Biết band hiện tại. Biết chính xác cách nâng lên.") : (isPhone ? "Know your current band and how to improve." : "Know your current band. Know exactly how to level up.")}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              {t("Chiến lược riêng cho người Việt, từ vựng theo band, bài mẫu band 5 + band 7.", "Band-based strategy, vocabulary, and Band 5 + Band 7 sample answers.")}
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
      className="mb-a11y-card-button"
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
          <div style={{ fontSize: secTitleSize, fontWeight: 900, color: "rgba(7,89,133,0.92)", letterSpacing: -0.3 }}>{nt({ en: "Check Your Level", vi: "Kiểm tra trình độ", es: "Comprueba tu nivel", fr: "Vérifie ton niveau", de: "Überprüfe dein Niveau", ru: "Проверьте свой уровень", pa: "ਆਪਣਾ ਪੱਧਰ ਜਾਂਚੋ", sw: "Angalia kiwango chako", ja: "レベルをチェック", zh: "检测你的水平", id: "Cek Levelmu", th: "ตรวจระดับของคุณ", ar: "اختبر مستواك", hi: "अपना स्तर जांचें", ur: "اپنی سطح چیک کریں", ko: "내 레벨 확인하기", pt: "Descubra seu nível", tr: "Seviyeni Kontrol Et" })}</div>
          {!isPhone && <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(7,89,133,0.55)", marginTop: 2 }}>{nt({ en: "Know where to start", vi: "Biết bắt đầu từ đâu", es: "Saber por dónde empezar", fr: "Sais par où commencer", de: "Finde heraus, wo du anfangen sollst", ru: "Узнайте, с чего начать", pa: "ਜਾਣੋ ਕਿੱਥੋਂ ਸ਼ੁਰੂ ਕਰਨਾ ਹੈ", sw: "Jua pa kuanzia", ja: "スタート地点を確認", zh: "知道从哪里开始", id: "Tahu harus mulai dari mana", th: "รู้ว่าควรเริ่มต้นที่ไหน", ar: "اعرف من أين تبدأ", hi: "जानें कहां से शुरू करें", ur: "جانیں کہاں سے شروع کرنا ہے", ko: "어디서부터 시작할지 알아보세요", pt: "Saiba por onde começar", tr: "Nereden başlayacağını bil" })}</div>}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {showVietnameseGloss
              ? (isPhone ? nt({ en: "Know where to start — 6 min.", vi: "Biết bắt đầu từ đâu — 6 phút.", es: "Saber por dónde empezar — 6 min.", fr: "Sais par où commencer — 6 min.", de: "Finde heraus, wo du anfangen sollst — 6 Min.", ru: "Узнайте, с чего начать — 6 мин.", pa: "ਜਾਣੋ ਕਿੱਥੋਂ ਸ਼ੁਰੂ ਕਰਨਾ ਹੈ — 6 ਮਿੰਟ।", sw: "Jua pa kuanzia — dakika 6.", ja: "スタート地点を確認 — 6分。", zh: "知道从哪里开始 — 6 分钟。", id: "Tahu harus mulai dari mana — 6 menit.", th: "รู้ว่าควรเริ่มต้นที่ไหน — 6 นาที", ar: "اعرف من أين تبدأ — 6 دقائق.", hi: "जानें कहां से शुरू करें — 6 मिनट।", ur: "جانیں کہاں سے شروع کرنا ہے — 6 منٹ۔", ko: "어디서부터 시작할지 알아보세요 — 6분.", pt: "Saiba por onde começar — 6 min.", tr: "Nereden başlayacağını bil — 6 dk." }) : nt({ en: "Know your real level. 6–9 min.", vi: "Biết chính xác trình độ thật của bạn. 6–9 phút.", es: "Conoce tu nivel real. 6–9 min.", fr: "Connais ton vrai niveau. 6–9 min.", de: "Kenn dein wahres Niveau. 6–9 Min.", ru: "Узнайте свой реальный уровень. 6–9 мин.", pa: "ਆਪਣਾ ਅਸਲੀ ਪੱਧਰ ਜਾਣੋ। 6–9 ਮਿੰਟ।", sw: "Jua kiwango chako halisi. Dakika 6–9.", ja: "本当のレベルを知ろう。6〜9分。", zh: "了解你的真实水平。6-9 分钟。", id: "Ketahui level aslimu. 6–9 menit.", th: "รู้ระดับจริงของคุณ 6–9 นาที", ar: "اعرف مستواك الحقيقي. 6–9 دقائق.", hi: "अपना वास्तविक स्तर जानें। 6–9 मिनट।", ur: "اپنی حقیقی سطح جانیں۔ 6–9 منٹ۔", ko: "실제 레벨을 확인하세요. 6–9분.", pt: "Conheça seu nível real. 6–9 min.", tr: "Gerçek seviyeni öğren. 6–9 dk." }))
              : (isPhone ? nt({ en: "Know where to start — 6 min.", vi: "Biết bắt đầu từ đâu — 6 phút.", es: "Saber por dónde empezar — 6 min.", fr: "Sais par où commencer — 6 min.", de: "Finde heraus, wo du anfangen sollst — 6 Min.", ru: "Узнайте, с чего начать — 6 мин.", pa: "ਜਾਣੋ ਕਿੱਥੋਂ ਸ਼ੁਰੂ ਕਰਨਾ ਹੈ — 6 ਮਿੰਟ।", sw: "Jua pa kuanzia — dakika 6.", ja: "スタート地点を確認 — 6分。", zh: "知道从哪里开始 — 6 分钟。", id: "Tahu harus mulai dari mana — 6 menit.", th: "รู้ว่าควรเริ่มต้นที่ไหน — 6 นาที", ar: "اعرف من أين تبدأ — 6 دقائق.", hi: "जानें कहां से शुरू करें — 6 मिनट।", ur: "جانیں کہاں سے شروع کرنا ہے — 6 منٹ۔", ko: "어디서부터 시작할지 알아보세요 — 6분.", pt: "Saiba por onde começar — 6 min.", tr: "Nereden başlayacağını bil — 6 dk." }) : nt({ en: "Know your real level. 6–9 min.", vi: "Biết chính xác trình độ thật của bạn. 6–9 phút.", es: "Conoce tu nivel real. 6–9 min.", fr: "Connais ton vrai niveau. 6–9 min.", de: "Kenn dein wahres Niveau. 6–9 Min.", ru: "Узнайте свой реальный уровень. 6–9 мин.", pa: "ਆਪਣਾ ਅਸਲੀ ਪੱਧਰ ਜਾਣੋ। 6–9 ਮਿੰਟ।", sw: "Jua kiwango chako halisi. Dakika 6–9.", ja: "本当のレベルを知ろう。6〜9分。", zh: "了解你的真实水平。6-9 分钟。", id: "Ketahui level aslimu. 6–9 menit.", th: "รู้ระดับจริงของคุณ 6–9 นาที", ar: "اعرف مستواك الحقيقي. 6–9 دقائق.", hi: "अपना वास्तविक स्तर जानें। 6–9 मिनट।", ur: "اپنی حقیقی سطح جانیں۔ 6–9 منٹ۔", ko: "실제 레벨을 확인하세요. 6–9분.", pt: "Conheça seu nível real. 6–9 min.", tr: "Gerçek seviyeni öğren. 6–9 dk." }))}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              {nt({ en: "Know exactly where you stand. About 6–9 minutes.", vi: "Biết chính xác trình độ của bạn. Khoảng 6–9 phút.", es: "Descubre exactamente cuál es tu nivel. Unos 6–9 minutos.", fr: "Sache exactement où tu en es. Environ 6–9 minutes.", de: "Finde genau heraus, wo du stehst. Etwa 6–9 Minuten.", ru: "Узнайте свой точный уровень. Около 6–9 минут.", pa: "ਆਪਣਾ ਸਹੀ ਪੱਧਰ ਜਾਣੋ। ਲਗਭਗ 6–9 ਮਿੰਟ।", sw: "Jua kiwango chako hasa. Takriban dakika 6–9.", ja: "自分の正確なレベルを把握。約6〜9分。", zh: "准确了解你的水平。约 6-9 分钟。", id: "Tahu persis posisimu. Sekitar 6–9 menit.", th: "รู้แน่ชัดว่าคุณอยู่ระดับไหน ประมาณ 6–9 นาที", ar: "اعرف بالضبط أين تقف. حوالي 6–9 دقائق.", hi: "ठीक-ठीक जानें कि आप कहां खड़े हैं। लगभग 6–9 मिनट।", ur: "جانئے کہ آپ کہاں کھڑے ہیں۔ تقریباً 6–9 منٹ۔", ko: "자신의 위치를 정확히 파악하세요. 약 6–9분 소요.", pt: "Saiba exatamente onde você está. Cerca de 6–9 minutos.", tr: "Tam olarak nerede olduğunu bil. Yaklaşık 6–9 dakika." })}
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
      aria-label={t("Mở luyện thi VSTEP", "Open VSTEP English exam prep")}
      className="mb-a11y-card-button"
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
            {t("Chinh phục B2 VSTEP", "B2 VSTEP Prep")}
          </div>
          {!isPhone && (
            <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(127,29,29,0.55)", marginTop: 2 }}>
              {t("VSTEP — Kỳ thi năng lực ngoại ngữ Việt Nam", "VSTEP — Vietnamese national English exam")}
            </div>
          )}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone ? t("Đúng định dạng Bộ. Đạt chuẩn đầu ra.", "Official format. Graduation-standard practice.") : t("Học đúng định dạng Bộ Giáo dục. Đạt chuẩn đầu ra.", "Practice the official Ministry format. Build toward the required outcome.")}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              {t("Speaking B1 + B2, 30 chủ đề, mẹo riêng cho người Việt.", "Speaking B1 + B2, 30 topics, with practical strategy.")}
            </div>
          )}
        </div>

        <div style={{ color: "rgba(185,28,28,0.70)", flexShrink: 0 }}>
          <ChevronRight size={22} />
        </div>
      </div>
    </button>
  );

  // ── Parent progress card ──────────────────────────────────────────────────
  // ParentView is intentionally reachable for every signed-in account; the
  // Premium access decision remains inside ParentView via useUserAccess.
  const parentProgressCard = (
    <button
      type="button"
      onClick={handleParentProgress}
      aria-label={t("Phụ huynh — theo dõi tiến bộ của con", "Parent progress")}
      data-testid="parent-progress-home-card"
      className="mb-a11y-card-button"
      style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer" }}
    >
      <div
        style={{
          borderRadius: 20,
          padding: isPhone ? "16px 18px" : "18px 20px",
          background:
            "linear-gradient(150deg, rgba(255,247,237,0.96) 0%, rgba(240,253,250,0.94) 100%)",
          border: "1px solid rgba(180,83,9,0.16)",
          boxShadow: "0 10px 28px rgba(180,83,9,0.09)",
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
            background: "linear-gradient(180deg, #F59E0B 0%, #0F766E 100%)",
            display: "grid",
            placeItems: "center",
            boxShadow: isPhone ? "0 4px 12px rgba(180,83,9,0.15)" : "0 8px 20px rgba(180,83,9,0.20)",
            flexShrink: 0,
          }}
        >
          <UsersRound size={isPhone ? 20 : 24} color="white" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: secTitleSize,
              fontWeight: 900,
              color: "rgba(120,53,15,0.94)",
              letterSpacing: -0.3,
            }}
          >
            {t("Góc phụ huynh", "Parent corner")}
          </div>
          {!isPhone && (
            <div style={{ fontSize: z(12), fontWeight: 700, color: "rgba(15,118,110,0.58)", marginTop: 2 }}>
              {t("Theo dõi tiến bộ của con", "Track your child’s progress")}
            </div>
          )}
          <div style={{ marginTop: isPhone ? 4 : 6, fontSize: z(14), fontWeight: 700, color: "rgba(0,0,0,0.62)", lineHeight: 1.45 }}>
            {isPhone ? t("Xem con đang tiến bộ ở đâu, không tạo áp lực.", "See where your child is improving, without pressure.") : t("Xem con đang tiến bộ ở đâu và cần luyện gì tiếp theo.", "See where your child is improving and what to practice next.")}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 3, fontSize: z(12), fontWeight: 600, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              {t("Tóm tắt trung thực, dễ hiểu cho gia đình — không xếp hạng, không gây áp lực.", "An honest, easy family summary — no ranking, no pressure.")}
            </div>
          )}
        </div>

        <div style={{ color: "rgba(180,83,9,0.70)", flexShrink: 0 }}>
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
  const {
    targets: pairTargets,
    primaryTarget: pairPrimary,
  } = parseLanguagePair(pairSourceEarly);
  // Non-English targets use the focused track shell.
  // Native-English routes stay on the real Home learning surface; Home copy
  // is already native-aware via effectiveNative and falls back to English
  // for non-Vietnamese learners.
  if (pairPrimary && pairPrimary !== "en") {
    return (
      <LanguageTrackHome
        nativeLanguage={effectiveNative}
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

      <main id="main-content" tabIndex={-1} style={frame}>
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
            {isPhone ? nt({ en: "See your pronunciation score in 12 seconds.", vi: "Xem điểm phát âm của bạn trong 12 giây.", es: "Ve tu puntuación de pronunciación en 12 segundos.", fr: "Vois ta note de prononciation en 12 secondes.", de: "Sieh deine Aussprachebewertung in 12 Sekunden.", ru: "Узнайте свою оценку произношения за 12 секунд.", pa: "12 ਸਕਿੰਟਾਂ ਵਿੱਚ ਆਪਣਾ ਉਚਾਰਨ ਸਕੋਰ ਵੇਖੋ।", sw: "Ona alama yako ya matamshi kwa sekunde 12.", ja: "12秒で発音スコアを確認。", zh: "12 秒查看发音评分。", id: "Lihat skor pengucapanmu dalam 12 detik.", th: "ดูคะแนนการออกเสียงของคุณใน 12 วินาที", ar: "شاهد درجة نطقك في 12 ثانية.", hi: "12 सेकंड में अपना उच्चारण स्कोर देखें।", ur: "12 سیکنڈ میں اپنا تلفظ اسکور دیکھیں۔", ko: "12초 만에 내 발음 점수를 확인하세요.", pt: "Veja sua nota de pronúncia em 12 segundos.", tr: "12 saniyede telaffuz puanını gör." }) : nt({ en: "See your pronunciation score in 12 seconds — no signup.", vi: "Xem điểm phát âm của bạn trong 12 giây — không cần đăng nhập.", es: "Ve tu puntuación de pronunciación en 12 segundos — sin registro.", fr: "Vois ta note de prononciation en 12 secondes — sans inscription.", de: "Sieh deine Aussprachebewertung in 12 Sekunden — keine Anmeldung.", ru: "Узнайте свою оценку произношения за 12 секунд — без регистрации.", pa: "12 ਸਕਿੰਟਾਂ ਵਿੱਚ ਆਪਣਾ ਉਚਾਰਨ ਸਕੋਰ ਵੇਖੋ — ਸਾਈਨ ਅੱਪ ਨਹੀਂ।", sw: "Ona alama yako ya matamshi kwa sekunde 12 — bila kujisajili.", ja: "12秒で発音スコアを確認 — サインアップ不要。", zh: "12 秒查看发音评分 — 无需登录。", id: "Lihat skor pengucapanmu dalam 12 detik — tanpa daftar.", th: "ดูคะแนนการออกเสียงของคุณใน 12 วินาที — ไม่ต้องสมัคร", ar: "شاهد درجة نطقك في 12 ثانية — بدون تسجيل.", hi: "12 सेकंड में अपना उच्चारण स्कोर देखें — साइनअप नहीं।", ur: "12 سیکنڈ میں اپنا تلفظ اسکور دیکھیں — سائن اپ کی ضرورت نہیں۔", ko: "12초 만에 내 발음 점수 확인 — 가입 불필요.", pt: "Veja sua nota de pronúncia em 12 segundos — sem cadastro.", tr: "12 saniyede telaffuz puanını gör — kayıt gerekmez." })}
          </div>
          {!isPhone && (
            <div style={{ marginTop: 2, fontSize: z(12), fontWeight: 500, color: "rgba(0,0,0,0.40)", lineHeight: 1.4 }}>
              {nt({ en: "See your pronunciation score in 12 seconds — no signup.", vi: "Xem điểm phát âm của bạn trong 12 giây — không cần đăng nhập.", es: "Ve tu puntuación de pronunciación en 12 segundos — sin registro.", fr: "Vois ta note de prononciation en 12 secondes — sans inscription.", de: "Sieh deine Aussprachebewertung in 12 Sekunden — keine Anmeldung.", ru: "Узнайте свою оценку произношения за 12 секунд — без регистрации.", pa: "12 ਸਕਿੰਟਾਂ ਵਿੱਚ ਆਪਣਾ ਉਚਾਰਨ ਸਕੋਰ ਵੇਖੋ — ਸਾਈਨ ਅੱਪ ਨਹੀਂ।", sw: "Ona alama yako ya matamshi kwa sekunde 12 — bila kujisajili.", ja: "12秒で発音スコアを確認 — サインアップ不要。", zh: "12 秒查看发音评分 — 无需登录。", id: "Lihat skor pengucapanmu dalam 12 detik — tanpa daftar.", th: "ดูคะแนนการออกเสียงของคุณใน 12 วินาที — ไม่ต้องสมัคร", ar: "شاهد درجة نطقك في 12 ثانية — بدون تسجيل.", hi: "12 सेकंड में अपना उच्चारण स्कोर देखें — साइनअप नहीं।", ur: "12 سیکنڈ میں اپنا تلفظ اسکور دیکھیں — سائن اپ کی ضرورت نہیں۔", ko: "12초 만에 내 발음 점수 확인 — 가입 불필요.", pt: "Veja sua nota de pronúncia em 12 segundos — sem cadastro.", tr: "12 saniyede telaffuz puanını gör — kayıt gerekmez." })}
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

          {placementCard}

          {/* Try one word — no signup. On desktop: standalone card.
              On mobile: compact chip nested under Teacher Mercy so the
              primary action stays dominant. */}
          {isPhone ? (
            <button
              type="button"
              onClick={handleTryOneWord}
              aria-label={nt({ en: "Try pronunciation — no signup", vi: "Thử phát âm — không cần đăng nhập", es: "Prueba la pronunciación — sin registro", fr: "Essayez la prononciation — sans inscription", de: "Aussprache testen — keine Anmeldung", ru: "Попробуйте произношение — без регистрации", pa: "ਉਚਾਰਨ ਅਜ਼ਮਾਓ — ਸਾਈਨ ਅੱਪ ਨਹੀਂ", sw: "Jaribu matamshi — bila kujisajili", ja: "発音を試す — サインアップ不要", zh: "试发音 — 无需登录", id: "Coba pengucapan — tanpa daftar", th: "ลองออกเสียง — ไม่ต้องสมัคร", ar: "جرب النطق — بدون تسجيل", hi: "उच्चारण आज़माएं — साइनअप नहीं", ur: "تلفظ آزمائیں — سائن اپ کی ضرورت نہیں", ko: "발음 체험하기 — 가입 없음", pt: "Experimente a pronúncia — sem cadastro", tr: "Telaffuzu dene — kayıt gerekmez" })}
              className="mb-a11y-card-button"
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
                  {nt({ en: "Try pronunciation now — no signup", vi: "Thử phát âm ngay — không cần đăng nhập", es: "Prueba la pronunciación ahora — sin registro", fr: "Essayez la prononciation maintenant — sans inscription", de: "Jetzt Aussprache testen — keine Anmeldung", ru: "Попробуйте произношение сейчас — без регистрации", pa: "ਹੁਣੇ ਉਚਾਰਨ ਅਜ਼ਮਾਓ — ਸਾਈਨ ਅੱਪ ਨਹੀਂ", sw: "Jaribu matamshi sasa — bila kujisajili", ja: "今すぐ発音を試す — サインアップ不要", zh: "立即试发音 — 无需登录", id: "Coba pengucapan sekarang — tanpa perlu daftar", th: "ลองออกเสียงตอนนี้ — ไม่ต้องสมัครสมาชิก", ar: "جرب النطق الآن — لا حاجة للتسجيل", hi: "अभी उच्चारण आज़माएं — साइनअप की ज़रूरत नहीं", ur: "ابھی تلفظ آزمائیں — سائن اپ کی ضرورت نہیں", ko: "지금 발음을 체험해보세요 — 가입 불필요", pt: "Experimente a pronúncia agora — sem precisar se cadastrar", tr: "Şimdi telaffuzu dene — kayıt gerekmez" })}
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
          {isPhone && showVietnameseGloss && (
            <div style={{
              marginTop: 12, paddingTop: 10,
              borderTop: "1px solid rgba(0,0,0,0.06)",
              fontSize: z(10), fontWeight: 700, letterSpacing: 1.2,
              textTransform: "uppercase", color: "rgba(0,0,0,0.32)",
            }}>
              {t("Luyện thi", "Exam prep")}
            </div>
          )}
          {showVietnameseGloss && (
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
          )}
          {showVietnameseGloss && (
            <ProgressiveDisclosureCard
              cardId="toeic"
              title={t("Luyện TOEIC", "TOEIC Practice")}
              shortLine="TOEIC 450 → 750+"
              accentColor="#6366F1"
              iconBg="rgba(238,242,255,0.96)"
              iconEl={<GraduationCap size={isPhone ? 20 : 24} color="white" />}
              onStart={() => nav("/exam-prep/toeic")}
              startLabel="Open TOEIC practice →"
            >
              {toeicCard}
            </ProgressiveDisclosureCard>
          )}
          {showVietnameseGloss && (
            <ProgressiveDisclosureCard
              cardId="vstep"
              title={t("Chinh phục B2 VSTEP", "B2 VSTEP Prep")}
              shortLine={t("Đúng định dạng Bộ. Đạt chuẩn đầu ra.", "Official format. Graduation-standard practice.")}
              accentColor="#B91C1C"
              iconBg="rgba(254,242,242,0.96)"
              iconEl={<GraduationCap size={isPhone ? 20 : 24} color="white" />}
              onStart={() => nav("/exam/vstep")}
              startLabel="Open VSTEP prep →"
            >
              {vstepCard}
            </ProgressiveDisclosureCard>
          )}
          {user && (
            <ProgressiveDisclosureCard
              cardId="parent-progress"
              title={t("Góc phụ huynh", "Parent corner")}
              shortLine={t("Theo dõi tiến bộ của con", "Track your child’s progress")}
              accentColor="#B45309"
              iconBg="rgba(255,247,237,0.96)"
              iconEl={<UsersRound size={isPhone ? 20 : 24} color="white" />}
              onStart={handleParentProgress}
              startLabel={t("Mở góc phụ huynh →", "Open parent corner →")}
            >
              {parentProgressCard}
            </ProgressiveDisclosureCard>
          )}

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
              {nt({ en: "Explore", vi: "Khám phá", es: "Explorar", fr: "Explorer", de: "Entdecken", ru: "Исследовать", pa: "ਪੜਚੋਲ ਕਰੋ", sw: "Gundua", ja: "探索", zh: "探索", id: "Jelajahi", th: "สำรวจ", ar: "استكشف", hi: "एक्सप्लोर करें", ur: "دریافت کریں", ko: "둘러보기", pt: "Explorar", tr: "Keşfet" })}
            </div>
          )}
          <ProgressiveDisclosureCard
            cardId="library"
            title="Library"
            shortLine={nt({ en: "Read. Listen. Improve every day.", vi: "Đọc. Nghe. Tiến bộ từng ngày.", es: "Lee. Escucha. Mejora cada día.", fr: "Lis. Écoute. Progresse chaque jour.", de: "Lies. Hör. Verbessere dich täglich.", ru: "Читай. Слушай. Совершенствуйся каждый день.", pa: "ਪੜ੍ਹੋ। ਸੁਣੋ। ਹਰ ਰੋਜ਼ ਸੁਧਾਰ ਕਰੋ।", sw: "Soma. Sikiliza. Boresha kila siku.", ja: "読む。聞く。毎日上達。", zh: "阅读。倾听。每天进步。", id: "Baca. Dengarkan. Tingkatkan setiap hari.", th: "อ่าน ฟัง พัฒนาทุกวัน", ar: "اقرأ. استمع. تحسن كل يوم.", hi: "पढ़ें। सुनें। हर दिन सुधार करें।", ur: "پڑھیں۔ سنیں۔ ہر روز بہتر بنیں۔", ko: "읽으세요. 들어보세요. 매일 발전하세요.", pt: "Leia. Ouça. Melhore a cada dia.", tr: "Oku. Dinle. Her gün geliş." })}
            accentColor="#14B8A6"
            iconBg="rgba(236,255,252,0.96)"
            iconEl={<LibraryBig size={isPhone ? 20 : 24} color="white" />}
            onStart={handleLibrary}
            startLabel={nt({ en: "Open Library →", vi: "Mở thư viện →", es: "Abrir biblioteca →", fr: "Ouvrir la bibliothèque →", de: "Bibliothek öffnen →", ru: "Открыть библиотеку →", pa: "ਲਾਇਬ੍ਰੇਰੀ ਖੋਲ੍ਹੋ →", sw: "Fungua maktaba →", ja: "ライブラリを開く →", zh: "打开学习库 →", id: "Buka Perpustakaan →", th: "เปิดคลังบทเรียน →", ar: "افتح المكتبة ←", hi: "लाइब्रेरी खोलें →", ur: "لائبریری کھولیں →", ko: "라이브러리 열기 →", pt: "Abrir Biblioteca →", tr: "Kütüphaneyi Aç →" })}
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
            aria-label={nt({ en: "See what you need to practice", vi: "Xem điểm bạn cần luyện", es: "Ve lo que necesitas practicar", fr: "Vois ce que tu dois pratiquer", de: "Sieh, was du üben musst", ru: "Посмотрите, что вам нужно отработать", pa: "ਵੇਖੋ ਕਿ ਤੁਹਾਨੂੰ ਕਿਸ ਦਾ ਅਭਿਆਸ ਕਰਨ ਦੀ ਲੋੜ ਹੈ", sw: "Angalia unachohitaji kufanyia mazoezi", ja: "練習が必要な項目を見る", zh: "查看你需要练习的内容", id: "Lihat apa yang perlu kamu latih", th: "ดูสิ่งที่คุณต้องฝึก", ar: "شاهد ما تحتاج إلى التدرب عليه", hi: "देखें कि आपको किस चीज़ का अभ्यास करना है", ur: "دیکھیں کہ آپ کو کس چیز کی مشق کرنی ہے", ko: "무엇을 연습해야 할지 확인하세요", pt: "Veja o que você precisa praticar", tr: "Neyi pratik yapman gerektiğini gör" })}
            className="mb-a11y-card-button w-full rounded-[20px] border border-slate-200 bg-white px-5 py-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:border-slate-300"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {nt({ en: "See what you need to practice", vi: "Xem điểm bạn cần luyện", es: "Ve lo que necesitas practicar", fr: "Vois ce que tu dois pratiquer", de: "Sieh, was du üben musst", ru: "Посмотрите, что вам нужно отработать", pa: "ਵੇਖੋ ਕਿ ਤੁਹਾਨੂੰ ਕਿਸ ਦਾ ਅਭਿਆਸ ਕਰਨ ਦੀ ਲੋੜ ਹੈ", sw: "Angalia unachohitaji kufanyia mazoezi", ja: "練習が必要な項目を見る", zh: "查看你需要练习的内容", id: "Lihat apa yang perlu kamu latih", th: "ดูสิ่งที่คุณต้องฝึก", ar: "شاهد ما تحتاج إلى التدرب عليه", hi: "देखें कि आपको किस चीज़ का अभ्यास करना है", ur: "دیکھیں کہ آپ کو کس چیز کی مشق کرنی ہے", ko: "무엇을 연습해야 할지 확인하세요", pt: "Veja o que você precisa praticar", tr: "Neyi pratik yapman gerektiğini gör" })}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {nt({ en: "See what you're working on", vi: "Xem những gì bạn đang luyện", es: "Ve en lo que estás trabajando", fr: "Vois sur quoi tu travailles", de: "Sieh, woran du arbeitest", ru: "Посмотрите, над чем вы работаете", pa: "ਵੇਖੋ ਕਿ ਤੁਸੀਂ ਕਿਸ 'ਤੇ ਕੰਮ ਕਰ ਰਹੇ ਹੋ", sw: "Ona unachofanyia kazi", ja: "現在取り組んでいる内容を見る", zh: "查看你正在练习的内容", id: "Lihat apa yang sedang kamu kerjakan", th: "ดูสิ่งที่คุณกำลังทำอยู่", ar: "شاهد ما تعمل عليه", hi: "देखें कि आप किस पर काम कर रहे हैं", ur: "دیکھیں کہ آپ کس چیز پر کام کر رہے ہیں", ko: "지금 무엇을 하고 있는지 확인하세요", pt: "Veja no que você está trabalhando", tr: "Ne üzerinde çalıştığını gör" })}
                </p>
              </div>
              <ChevronRight size={20} className="shrink-0 text-slate-400" aria-hidden="true" />
            </div>
          </button>

          {/* Weekly leaderboard — retention card (feature-flagged). */}
          {leaderboardEnabled && Boolean(user) && <LeaderboardCard />}
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
      </main>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: `calc(${isPhone ? 8 : 10}px + env(safe-area-inset-bottom, 0px))`, zIndex: 80, padding: "0 16px", pointerEvents: "none" }} aria-label="Bottom music dock">
        <div style={{ maxWidth: PAGE_MAX, margin: "0 auto", pointerEvents: "auto" }}>
          <BottomMusicBar />
        </div>
      </div>
    </div>
  );
}
