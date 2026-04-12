/**
 * File: Home.tsx
 * Path: src/pages/Home.tsx
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LibraryBig } from "lucide-react";

import BottomMusicBar from "@/components/audio/BottomMusicBar";
import { MercyGuide } from "@/components/MercyGuide";
import { GuideBox } from "@/components/GuideBox";
import { useAuth } from "@/providers/AuthProvider";

const PAGE_MAX = 980;
const LS_ZOOM = "mb.ui.zoom";
const DEFAULT_ZOOM = 100;

const MERCY_GUIDE_BUBBLE_STORAGE_KEY = "mercy-guide-bubble-position-v2";
const GUIDE_BOX_BUBBLE_STORAGE_KEY = "guide-box-bubble-position-v8-left";

const GUIDE_BUBBLE_SIZE = 92;
const MERCY_BUBBLE_SIZE = 64;

function toDisplayName(email: string, meta: unknown) {
  const safeMeta =
    meta && typeof meta === "object" ? (meta as Record<string, unknown>) : null;

  const fullName = String(
    safeMeta?.full_name ?? safeMeta?.name ?? safeMeta?.display_name ?? "",
  ).trim();

  if (fullName) return fullName;

  const firstName = String(safeMeta?.first_name ?? "").trim();
  if (firstName) return firstName;

  const local = email.split("@")[0]?.trim() ?? "";
  if (!local) return "friend";

  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function readZoomPct(): number {
  try {
    const raw = Number(localStorage.getItem(LS_ZOOM));
    if (Number.isFinite(raw)) return clamp(Math.round(raw), 60, 140);
  } catch {
    // ignore
  }

  try {
    const css = getComputedStyle(document.documentElement)
      .getPropertyValue("--mb-essay-zoom")
      .trim();
    const parsed = Number(css);
    if (Number.isFinite(parsed)) return clamp(Math.round(parsed), 60, 140);
  } catch {
    // ignore
  }

  return DEFAULT_ZOOM;
}

function clearCustomBubbleStorage() {
  try {
    window.sessionStorage.removeItem(GUIDE_BOX_BUBBLE_STORAGE_KEY);
  } catch {
    // ignore
  }

  try {
    window.sessionStorage.removeItem(MERCY_GUIDE_BUBBLE_STORAGE_KEY);
  } catch {
    // ignore
  }

  try {
    window.localStorage.removeItem(MERCY_GUIDE_BUBBLE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function Home() {
  const nav = useNavigate();
  const { user, isLoading } = useAuth();

  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );
  const [zoomPct, setZoomPct] = useState<number>(() => readZoomPct());
  const [sharedReady, setSharedReady] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sync = () => setZoomPct(readZoomPct());
    sync();

    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === LS_ZOOM) sync();
    };

    const obs = new MutationObserver(() => sync());
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "data-mb-zoom"],
    });

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      obs.disconnect();
    };
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

  const isDesktopTop = viewportWidth >= 960;
  const isSignedIn = !!user?.id;
  const userEmail = String(user?.email ?? "").trim();

  const displayName = useMemo(
    () => toDisplayName(userEmail, user?.user_metadata),
    [userEmail, user?.user_metadata],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    setSharedReady(false);

    if (!isDesktopTop) {
      clearCustomBubbleStorage();
      setSharedReady(true);
      return;
    }

    const syncBubblePositions = () => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) {
        setSharedReady(true);
        return;
      }

      const gap = 14;
      const columnWidth = Math.max(180, (rect.width - gap * 2) / 3);

      const guideCenterX = rect.left + columnWidth / 2;
      const teacherCenterX = rect.right - columnWidth / 2;
      const targetCenterY = rect.top + rect.height * 0.7;

      const guideLeft = Math.round(
        Math.max(12, guideCenterX - GUIDE_BUBBLE_SIZE / 2),
      );
      const guideBottom = Math.round(
        Math.max(
          118,
          window.innerHeight - targetCenterY - GUIDE_BUBBLE_SIZE / 2,
        ),
      );

      const teacherRight = Math.round(
        Math.max(12, window.innerWidth - teacherCenterX - MERCY_BUBBLE_SIZE / 2),
      );
      const teacherBottom = Math.round(
        Math.max(
          112,
          window.innerHeight - targetCenterY - MERCY_BUBBLE_SIZE / 2,
        ),
      );

      try {
        window.sessionStorage.setItem(
          GUIDE_BOX_BUBBLE_STORAGE_KEY,
          JSON.stringify({
            left: guideLeft,
            bottom: guideBottom,
          }),
        );

        const mercyBubblePayload = JSON.stringify({
          right: teacherRight,
          bottom: teacherBottom,
        });

        window.localStorage.setItem(
          MERCY_GUIDE_BUBBLE_STORAGE_KEY,
          mercyBubblePayload,
        );
        window.sessionStorage.setItem(
          MERCY_GUIDE_BUBBLE_STORAGE_KEY,
          mercyBubblePayload,
        );
      } catch {
        // ignore
      }

      setSharedReady(true);
    };

    const raf = window.requestAnimationFrame(syncBubblePositions);
    return () => window.cancelAnimationFrame(raf);
  }, [isDesktopTop, viewportWidth]);

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(255,237,213,0.55) 0%, rgba(250,247,241,0.95) 26%, rgba(248,247,250,1) 62%, rgba(252,249,243,1) 100%)",
  };

  const frame: React.CSSProperties = {
    maxWidth: PAGE_MAX,
    margin: "0 auto",
    padding: "10px 16px 188px",
  };

  const heroShell: React.CSSProperties = {
    marginTop: 8,
    borderRadius: 28,
    border: "1px solid rgba(0,0,0,0.06)",
    background:
      "linear-gradient(180deg, rgba(255,252,245,0.98), rgba(248,243,234,0.94))",
    boxShadow: "0 18px 42px rgba(0,0,0,0.07)",
    padding: isDesktopTop ? "24px 24px 28px" : "22px 16px 26px",
    textAlign: "center",
  };

  const statusRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  };

  const statusBadge: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 12px",
    borderRadius: 9999,
    border: isSignedIn
      ? "1px solid rgba(16,185,129,0.22)"
      : "1px solid rgba(0,0,0,0.08)",
    background: isSignedIn ? "rgba(236,253,245,0.90)" : "rgba(255,255,255,0.85)",
    fontSize: z(12),
    fontWeight: 900,
    color: isSignedIn ? "rgba(6,95,70,0.92)" : "rgba(0,0,0,0.64)",
  };

  const statusDot: React.CSSProperties = {
    width: 9,
    height: 9,
    borderRadius: 9999,
    background: isLoading
      ? "rgba(0,0,0,0.28)"
      : isSignedIn
        ? "rgb(16,185,129)"
        : "rgba(0,0,0,0.26)",
  };

  const topRightPill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minWidth: 0,
    maxWidth: "100%",
    padding: "7px 12px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.86)",
    fontSize: z(12),
    fontWeight: 900,
    color: "rgba(0,0,0,0.70)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const headline: React.CSSProperties = {
    margin: "18px 0 0",
    fontSize: isDesktopTop ? z(42) : z(26),
    fontWeight: 950,
    lineHeight: 1.02,
    letterSpacing: -1.2,
    color: "rgba(10,10,10,0.96)",
  };

  const subline: React.CSSProperties = {
    marginTop: 12,
    fontSize: isDesktopTop ? z(20) : z(16),
    lineHeight: 1.45,
    fontWeight: 800,
    color: "rgba(0,0,0,0.62)",
  };

  const stageShell: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 26,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(180deg, rgba(247,247,249,0.98), rgba(243,242,245,0.95))",
    boxShadow: "0 16px 34px rgba(0,0,0,0.06)",
    padding: isDesktopTop ? "22px 18px 26px" : "20px 14px 24px",
    minHeight: isDesktopTop ? 330 : 0,
    position: "relative",
    overflow: "hidden",
  };

  const stageGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isDesktopTop ? "repeat(3, minmax(0, 1fr))" : "1fr",
    gap: 14,
    alignItems: "stretch",
    minHeight: isDesktopTop ? 280 : 0,
  };

  const desktopEmptyCell: React.CSSProperties = {
    minHeight: 220,
  };

  const libraryButton: React.CSSProperties = {
    width: "100%",
    display: "block",
    cursor: "pointer",
    textAlign: "center",
    background: "transparent",
    border: "none",
    padding: 0,
  };

  const libraryShell: React.CSSProperties = {
    width: "100%",
    borderRadius: 26,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(251,250,248,0.94))",
    boxShadow: "0 16px 34px rgba(0,0,0,0.06)",
    padding: isDesktopTop ? "28px 22px" : "24px 18px",
    textAlign: "center",
  };

  const libraryBubble: React.CSSProperties = {
    width: 92,
    height: 92,
    borderRadius: 9999,
    display: "grid",
    placeItems: "center",
    margin: "0 auto",
    background: "linear-gradient(180deg, #34D399 0%, #14B8A6 100%)",
    boxShadow: "0 12px 28px rgba(20,184,166,0.22)",
    border: "2px solid rgba(255,255,255,0.96)",
  };

  const libraryTitle: React.CSSProperties = {
    marginTop: 18,
    fontSize: isDesktopTop ? z(26) : z(22),
    fontWeight: 900,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -0.4,
  };

  const librarySub: React.CSSProperties = {
    marginTop: 10,
    fontSize: z(15),
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.64)",
    fontWeight: 700,
  };

  const floatingFacesWrap: React.CSSProperties = {
    marginTop: 18,
  };

  const bottomDockOuter: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 10,
    zIndex: 80,
    padding: "0 16px",
    pointerEvents: "none",
  };

  const bottomDockInner: React.CSSProperties = {
    maxWidth: PAGE_MAX,
    margin: "0 auto",
    pointerEvents: "auto",
  };

  const sharedKey = `${isDesktopTop ? "desktop" : "mobile"}-${viewportWidth}`;

  const libraryCard = (
    <button
      type="button"
      onClick={() => nav("/rooms")}
      aria-label="Library"
      style={libraryButton}
    >
      <div style={libraryShell}>
        <div style={libraryBubble} aria-hidden="true">
          <LibraryBig size={36} color="white" />
        </div>

        <div style={libraryTitle}>Library</div>
        <div style={librarySub}>Start from tier Free up</div>
      </div>
    </button>
  );

  return (
    <div style={wrap}>
      <div style={frame}>
        <section style={heroShell} aria-label="Homepage hero">
          <div style={statusRow}>
            <div style={statusBadge} aria-live="polite">
              <span style={statusDot} />
              <span>
                {isLoading
                  ? "Checking sign-in..."
                  : isSignedIn
                    ? "Signed in"
                    : "Start free"}
              </span>
            </div>

            {isSignedIn ? (
              <div style={topRightPill} title={`Welcome, ${displayName}`}>
                Welcome, {displayName}
              </div>
            ) : null}
          </div>

          <h1 style={headline}>Small Steps. Real Progress.</h1>
          <div style={subline}>English for real life.</div>
        </section>

        <section
          ref={stageRef}
          style={stageShell}
          aria-label={isDesktopTop ? "Desktop homepage choices" : "Homepage choices"}
        >
          <div style={stageGrid}>
            {isDesktopTop ? <div style={desktopEmptyCell} /> : null}
            <div>{libraryCard}</div>
            {isDesktopTop ? <div style={desktopEmptyCell} /> : null}
          </div>
        </section>

        <div style={floatingFacesWrap}>
          {sharedReady ? (
            <React.Fragment key={sharedKey}>
              <MercyGuide />
              <GuideBox />
            </React.Fragment>
          ) : null}
        </div>
      </div>

      <div style={bottomDockOuter} aria-label="Bottom music dock">
        <div style={bottomDockInner}>
          <BottomMusicBar />
        </div>
      </div>
    </div>
  );
}