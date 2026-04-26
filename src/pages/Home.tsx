/**
 * File: Home.tsx
 * Path: src/pages/Home.tsx
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, LibraryBig } from "lucide-react";

import BottomMusicBar from "@/components/audio/BottomMusicBar";
import { MercyGuide } from "@/components/MercyGuide";
import { FeedbackBar } from "@/components/FeedbackBar";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { supabase } from "@/lib/supabaseClient";
import FocusAreasCard from "@/components/home/FocusAreasCard";
import LeaderboardCard from "@/components/leaderboard/LeaderboardCard";
import { StreakBadge } from "@/components/streak/StreakBadge";

const LS_PLACEMENT_BANNER_DISMISSED = "mb.placement.banner.dismissed";
const LS_PLACEMENT_REDIRECT_SEEN    = "mb.placement.redirect.seen";

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
  const { enabled: placementFlagEnabled, loading: placementFlagLoading } =
    useFeatureFlag("placement_test_enabled", false);
  const { enabled: leaderboardEnabled } =
    useFeatureFlag("mercyblade_leaderboard_enabled", false);

  const [placementBannerDismissed, setPlacementBannerDismissed] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(LS_PLACEMENT_BANNER_DISMISSED) === "1";
    } catch {
      return false;
    }
  });
  const [placementCompleted, setPlacementCompleted] = useState<boolean | null>(null);

  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );
  const [zoomPct, setZoomPct]       = useState<number>(() => readZoomPct());
  const [sharedReady, setSharedReady] = useState(false);
  const [isTeacherMercyOpen, setIsTeacherMercyOpen] = useState<boolean>(() => hasOpenTeacherMercyPanel());

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

  // ── Placement test integration (feature-flagged) ────────────────────────
  //
  // On mount, for authenticated users only, check whether they've ever
  // completed the placement test. If NOT, and they haven't already been
  // redirected once this session (to avoid ping-pong), send them to
  // /placement. If YES, show the dismissible banner instead.
  //
  // Diagnostic console logs are intentional — feature flags + auth +
  // profile fetch is a three-way race that's a pain to debug blind.
  // Safe to keep in prod; they're prefixed and rare.
  useEffect(() => {
    if (placementFlagLoading) {
      console.log("[Home/placement] flag still resolving, waiting");
      return;
    }
    if (!placementFlagEnabled) {
      console.log("[Home/placement] flag disabled for this user");
      return;
    }
    if (!user?.id) {
      console.log("[Home/placement] no authenticated user");
      setPlacementCompleted(null);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("placement_completed_at")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.warn("[Home/placement] profile fetch error:", error.message);
        setPlacementCompleted(null);
        return;
      }
      const completedAt =
        (data as { placement_completed_at?: string | null } | null)
          ?.placement_completed_at ?? null;
      const completed = Boolean(completedAt);
      setPlacementCompleted(completed);

      if (completed) {
        console.log("[Home/placement] already completed at", completedAt);
        return;
      }

      let alreadyRedirected = false;
      try {
        alreadyRedirected =
          window.sessionStorage.getItem(LS_PLACEMENT_REDIRECT_SEEN) === "1";
      } catch { /* ignore */ }

      if (alreadyRedirected) {
        console.log("[Home/placement] redirect already seen this session — showing banner instead");
        return;
      }

      try {
        window.sessionStorage.setItem(LS_PLACEMENT_REDIRECT_SEEN, "1");
      } catch { /* ignore */ }
      console.log("[Home/placement] redirecting to /placement");
      nav("/placement", { replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [placementFlagLoading, placementFlagEnabled, user?.id, nav]);

  const dismissPlacementBanner = () => {
    try {
      window.localStorage.setItem(LS_PLACEMENT_BANNER_DISMISSED, "1");
    } catch { /* ignore */ }
    setPlacementBannerDismissed(true);
  };

  const showPlacementBanner =
    placementFlagEnabled &&
    Boolean(user) &&
    placementCompleted === false &&
    !placementBannerDismissed;

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

  const handleTeacherMercy = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Find the floating Mercy bubble.
    // The bubble uses onPointerDown (not onClick), so .click() doesn't
    // trigger the React handler. We dispatch a real pointerdown event,
    // and as a fallback also send an Enter keydown which the bubble's
    // onKeyDown handler converts to handleOpenGuideFromBubble.
    const bubble =
      document.querySelector<HTMLElement>('[aria-label="Open Mercy Guide"]') ||
      document.querySelector<HTMLElement>('[aria-label="Open Teacher Mercy for kids"]');

    if (bubble) {
      // Primary: pointerdown event (matches the bubble's onPointerDown handler)
      bubble.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          cancelable: true,
          pointerType: "mouse",
          button: 0,
        })
      );
      // Fallback: focus + Enter keydown (matches the bubble's onKeyDown handler)
      bubble.focus();
      bubble.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          key: "Enter",
        })
      );
    } else {
      console.warn(
        "[Home] Teacher Mercy bubble not found; cannot open panel. " +
        "User may be unauthenticated or trial expired."
      );
    }

    // Backwards-compat custom event (no current listener; kept for future).
    window.dispatchEvent(new CustomEvent("mercy-guide:focus"));
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
          Open Teacher Mercy →
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

  const placementBanner = showPlacementBanner ? (
    <div
      style={{
        marginTop: 8,
        borderRadius: 14,
        border: "1px solid rgba(16,185,129,0.24)",
        background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(20,184,166,0.06))",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}
      role="region"
      aria-label="Placement test suggestion"
    >
      <span style={{ fontSize: 20, lineHeight: 1, flex: "0 0 auto" }} aria-hidden>🎯</span>
      <div style={{ flex: 1, minWidth: 180, fontSize: 13, fontWeight: 700, color: "rgba(0,60,50,0.90)", lineHeight: 1.45 }}>
        Take the placement test to see where to start
        <span style={{ display: "block", fontSize: 12, fontWeight: 400, color: "#94a3b8", marginTop: 2 }}>
          Làm bài đánh giá để biết nên bắt đầu từ đâu
        </span>
      </div>
      <button
        type="button"
        onClick={() => nav("/placement")}
        style={{
          background: "#059669",
          color: "white",
          border: "none",
          borderRadius: 9999,
          fontSize: 12,
          fontWeight: 900,
          padding: "8px 14px",
          cursor: "pointer",
          minHeight: 34,
        }}
      >
        Take test → · Làm bài →
      </button>
      <button
        type="button"
        onClick={dismissPlacementBanner}
        aria-label="Dismiss placement suggestion"
        style={{
          background: "transparent",
          color: "rgba(0,0,0,0.40)",
          border: "none",
          fontSize: 18,
          lineHeight: 1,
          cursor: "pointer",
          padding: "4px 6px",
        }}
      >
        ×
      </button>
    </div>
  ) : null;

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
        {placementBanner}
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
          {/* Teacher Mercy — hero */}
          {teacherCard}

          {/* Library — secondary */}
          {libraryCard}

          {/* Focus areas — tertiary (feature-flagged) */}
          <FocusAreasCard />

          {/* Weekly leaderboard — Step 4 retention card (feature-flagged) */}
          {leaderboardEnabled && Boolean(user) && <LeaderboardCard />}
        </section>

        {/* Floating bubbles */}
        <div style={{ marginTop: isPhone ? 10 : 18 }}>
          {sharedReady ? (
            <React.Fragment key={sharedKey}>
              {isTeacherMercyAllowed ? <MercyGuide /> : null}
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
