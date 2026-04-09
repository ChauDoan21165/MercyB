// PATH: src/pages/Home.tsx
// FIXED FOR HOME PAGE TEXT ZOOM
//
// Keeps native/browser zoom behavior
// Adds Home-only text zoom wiring to the existing app zoom system
//
// VISUAL TUNE:
// - Keeps hero band intact
// - Softens page background
// - Reduces oversized homepage headings
// - Makes typography calmer and cleaner without changing layout logic
//
// COPY + LANGUAGE TUNE:
// - Vietnamese is visually secondary to English
// - Vietnamese is clearly presented as the same meaning as the English above
// - Replaces old "Mercy Host" naming with "Teacher Mercy"

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomMusicBar from "@/components/audio/BottomMusicBar";
import { MercyGuide } from "@/components/MercyGuide";
import { GuideBox } from "@/components/GuideBox";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";

const PAGE_MAX = 980;
const softPanel = "rgba(247, 250, 251, 0.94)";
const HOME_TZ = "Asia/Ho_Chi_Minh";
const ROUTE_PRICING = "/pricing";
const HERO_SRC = "/hero/hero_band.jpg";
const LS_ZOOM = "mb.ui.zoom";
const DEFAULT_ZOOM = 100;

const VN_DT_FMT = new Intl.DateTimeFormat("vi-VN", {
  timeZone: HOME_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

type ProgressSummaryRow = {
  user_id: string | null;
  streak_days: number | null;
  days_active_30d: number | null;
  last_study_at: string | null;
};

type RoomRowLite = {
  id: string;
  tier: string | null;
  sort_order: number | null;
  created_at: string | null;
};

function fmtDate(s: string | null | undefined) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return VN_DT_FMT.format(d);
}

function fmtInt(n: unknown, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? Math.max(0, Math.floor(v)) : fallback;
}

function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

function isKidsRoomId(id: string) {
  return id.includes("_kids_") || id.includes("-kids-");
}

function isVipHybridId(id: string) {
  return /^vip\d+_/.test(id) || /^vip\d+-/.test(id);
}

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

export default function Home() {
  const nav = useNavigate();
  const { user, isLoading } = useAuth();

  const [progressLoading, setProgressLoading] = useState(false);
  const [progressErr, setProgressErr] = useState<string | null>(null);
  const [progressRow, setProgressRow] = useState<ProgressSummaryRow | null>(null);
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [firstRoomId, setFirstRoomId] = useState<string | null>(null);
  const [howOpen, setHowOpen] = useState<boolean>(true);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );
  const [zoomPct, setZoomPct] = useState<number>(() => readZoomPct());

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

  useEffect(() => {
    let alive = true;

    void (async () => {
      try {
        if (!user?.id) {
          if (!alive) return;
          setProgressRow(null);
          setProgressErr(null);
          setProgressLoading(false);
          return;
        }

        const { data: sessionRes, error: sessionErr } = await supabase.auth.getSession();

        if (!alive) return;

        if (sessionErr || !sessionRes.session) {
          setProgressRow(null);
          setProgressErr(null);
          setProgressLoading(false);
          return;
        }

        setProgressLoading(true);
        setProgressErr(null);

        const { data, error } = await supabase
          .from("v_user_progress_current")
          .select("user_id, streak_days, days_active_30d, last_study_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!alive) return;

        if (error) {
          setProgressErr(error.message);
          setProgressRow(null);
        } else {
          setProgressRow((data ?? null) as ProgressSummaryRow | null);
        }
      } catch (e: unknown) {
        if (!alive) return;
        setProgressErr(e instanceof Error ? e.message : String(e));
        setProgressRow(null);
      } finally {
        if (!alive) return;
        setProgressLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let alive = true;

    void (async () => {
      try {
        if (!user?.id) {
          if (!alive) return;
          setStreakDays(null);
          return;
        }

        const { data: sessionRes, error: sessionErr } = await supabase.auth.getSession();

        if (!alive) return;

        if (sessionErr || !sessionRes.session) {
          setStreakDays(null);
          return;
        }

        const { data, error } = await supabase
          .from("v_user_streak_summary")
          .select("streak_days")
          .maybeSingle();

        if (!alive) return;

        if (error) {
          setStreakDays(null);
          return;
        }

        const v = data ? Number((data as { streak_days?: unknown }).streak_days ?? 0) : 0;
        setStreakDays(Number.isFinite(v) ? v : 0);
      } catch {
        if (!alive) return;
        setStreakDays(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, [user?.id]);

  const progressSummary = useMemo(() => {
    const streak = streakDays !== null ? streakDays : fmtInt(progressRow?.streak_days ?? 0, 0);
    const active30d = fmtInt(progressRow?.days_active_30d ?? 0, 0);
    const lastStudyAt = progressRow?.last_study_at ?? null;

    return { streak, active30d, lastStudyAt };
  }, [progressRow, streakDays]);

  useEffect(() => {
    let alive = true;

    void (async () => {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("id, tier, sort_order, created_at")
          .eq("tier", "free")
          .not("id", "like", "%_kids_%")
          .not("id", "like", "%-kids-%")
          .not("id", "like", "vip%_%")
          .not("id", "like", "vip%-%")
          .order("sort_order", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: true })
          .limit(40);

        if (!alive) return;

        const rows = (Array.isArray(data) ? (data as Array<Record<string, unknown>>) : []).map((r) => ({
          id: String(r?.id ?? ""),
          tier: (r?.tier as string | null) ?? null,
          sort_order: (r?.sort_order as number | null) ?? null,
          created_at: (r?.created_at as string | null) ?? null,
        })) as RoomRowLite[];

        const clean = rows.filter((r) => r.id && !isKidsRoomId(r.id) && !isVipHybridId(r.id));

        const rankedPrefer = [
          "sleep_basics",
          "anxiety_intro",
          "english_foundation_ef11",
          "grammar_foundations_free",
          "mercy_blade_bridge_of_hearts_free",
          "career_consultant_free",
        ];

        const byId = new Map(clean.map((r) => [r.id, r]));
        const pickRanked = rankedPrefer.find((id) => byId.has(id)) ?? null;
        const pickEarliest = clean[0]?.id ?? null;
        const pick = !error ? pickRanked || pickEarliest || null : null;

        setFirstRoomId(pick);
      } catch {
        if (!alive) return;
        setFirstRoomId(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const goFirstRoom = () => {
    if (firstRoomId) {
      nav(`/room/${firstRoomId}`);
      return;
    }
    nav("/rooms");
  };

  const isSignedIn = !!user?.id;
  const userEmail = String(user?.email ?? "").trim();
  const displayName = useMemo(
    () => toDisplayName(userEmail, user?.user_metadata),
    [userEmail, user?.user_metadata],
  );

  const primaryCtaEn = isSignedIn ? "👉 Continue learning" : "👉 Start free";
  const accountCtaEn = isSignedIn ? "👤 Account" : "🔐 Sign in";

  const goAccountOrSignin = () => {
    nav(isSignedIn ? "/account" : "/signin");
  };

  const phase0New =
    !user?.id ||
    !progressSummary.lastStudyAt ||
    fmtInt(progressSummary.active30d) === 0;

  const phase2Collapse =
    !phase0New &&
    (fmtInt(progressSummary.active30d) >= 5 ||
      fmtInt(progressSummary.streak) >= 3);

  const phase3Hide =
    !phase0New &&
    fmtInt(progressSummary.active30d) >= 10 &&
    fmtInt(progressSummary.streak) >= 7;

  useEffect(() => {
    setHowOpen(!phase2Collapse);
  }, [phase2Collapse]);

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #FBF8F3 0%, #F8F7FA 54%, #FEFCF8 100%)",
  };

  const frame: React.CSSProperties = {
    maxWidth: PAGE_MAX,
    margin: "0 auto",
    padding: "0 16px 188px",
  };

  const heroImgWrap: React.CSSProperties = {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: -16,
    marginRight: -16,
    width: "calc(100% + 32px)",
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    background: "white",
    lineHeight: 0,
  };

  const heroImg: React.CSSProperties = {
    width: "100%",
    height: "clamp(220px, 28vw, 360px)",
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
    background: "white",
  };

  const topPriorityGrid: React.CSSProperties = {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: isDesktopTop
      ? "minmax(0, 1.02fr) minmax(320px, 0.98fr)"
      : "1fr",
    gap: 14,
    alignItems: "stretch",
  };

  const authStrip: React.CSSProperties = {
    borderRadius: 20,
    border: isSignedIn
      ? "1px solid rgba(16,185,129,0.20)"
      : "1px solid rgba(0,0,0,0.08)",
    background: isSignedIn
      ? "linear-gradient(180deg, rgba(240,251,246,0.92), rgba(255,255,255,0.97))"
      : "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(247,249,252,0.93))",
    padding: "12px 14px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
  };

  const authStripTop: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  };

  const authBadge: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 11px",
    borderRadius: 9999,
    border: isSignedIn
      ? "1px solid rgba(16,185,129,0.22)"
      : "1px solid rgba(0,0,0,0.10)",
    background: isSignedIn ? "rgba(236,253,245,0.92)" : "rgba(255,255,255,0.86)",
    fontSize: z(12),
    fontWeight: 900,
    color: isSignedIn ? "rgba(6,95,70,0.92)" : "rgba(0,0,0,0.62)",
    whiteSpace: "nowrap",
  };

  const authDot: React.CSSProperties = {
    width: 9,
    height: 9,
    borderRadius: 9999,
    background: isLoading
      ? "rgba(0,0,0,0.28)"
      : isSignedIn
        ? "rgb(16,185,129)"
        : "rgba(0,0,0,0.28)",
  };

  const authTopRight: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 0,
    flex: "1 1 auto",
  };

  const authTitle: React.CSSProperties = {
    margin: "8px 0 0",
    fontSize: isDesktopTop ? z(24) : z(20),
    fontWeight: 900,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -0.45,
    lineHeight: 1.12,
  };

  const authSub: React.CSSProperties = {
    marginTop: 6,
    marginBottom: 0,
    fontSize: z(14),
    lineHeight: 1.45,
    color: "rgba(0,0,0,0.64)",
  };

  const authEmailPill: React.CSSProperties = {
    marginTop: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minWidth: 0,
    maxWidth: "100%",
    padding: "6px 10px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.86)",
    fontSize: z(11),
    fontWeight: 900,
    color: "rgba(0,0,0,0.74)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const lessonCard: React.CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(247,249,252,0.93))",
    padding: "14px 16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
  };

  const lessonTop: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  };

  const lessonMeta: React.CSSProperties = {
    fontSize: z(12),
    fontWeight: 900,
    color: "rgba(0,0,0,0.52)",
    letterSpacing: 0.2,
  };

  const lessonTitle: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: isDesktopTop ? z(24) : z(20),
    fontWeight: 900,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -0.45,
    lineHeight: 1.12,
  };

  const lessonSub: React.CSSProperties = {
    marginTop: 6,
    marginBottom: 0,
    fontSize: z(14),
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.64)",
  };

  const lessonActionsWrap: React.CSSProperties = {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.08fr) minmax(132px, 0.92fr)",
    gap: 10,
    alignItems: "stretch",
  };

  const lessonPrimaryCol: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 0,
  };

  const lessonSecondaryCol: React.CSSProperties = {
    display: "grid",
    gap: 8,
    minWidth: 0,
  };

  const compactActionBtn: React.CSSProperties = {
    padding: "11px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(255,255,255,0.86)",
    color: "rgba(0,0,0,0.74)",
    fontWeight: 900,
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    fontSize: z(13),
    lineHeight: 1.2,
    minHeight: 0,
  };

  const heroCard: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(180deg, rgba(251,252,253,0.97), rgba(245,248,250,0.93))",
    padding: isDesktopTop ? "28px 22px" : "24px 18px",
    textAlign: isDesktopTop ? "left" : "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
  };

  const mercyGuideWrap: React.CSSProperties = {
    marginTop: 18,
  };

  const hostSpotlight: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(135deg, rgba(249,252,254,0.97), rgba(245,248,251,0.94), rgba(249,247,252,0.93))",
    padding: "24px 18px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
  };

  const hostPanelGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
    alignItems: "stretch",
  };

  const hostBubble: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.90)",
    padding: "16px 16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  };

  const hostName: React.CSSProperties = {
    margin: 0,
    fontSize: z(24),
    fontWeight: 950,
    color: "rgba(0,0,0,0.88)",
    letterSpacing: -0.4,
  };

  const hostQuote: React.CSSProperties = {
    marginTop: 12,
    marginBottom: 0,
    fontSize: z(18),
    lineHeight: 1.7,
    color: "rgba(0,0,0,0.78)",
    fontWeight: 700,
  };

  const hostQuoteVi: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: z(14),
    lineHeight: 1.62,
    color: "rgba(0,0,0,0.56)",
    fontWeight: 600,
  };

  const hostMeta: React.CSSProperties = {
    marginTop: 10,
    fontSize: z(13),
    color: "rgba(0,0,0,0.54)",
    fontWeight: 800,
  };

  const band: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "linear-gradient(180deg, rgba(249,251,252,0.95), rgba(246,248,250,0.93))",
    padding: "26px 16px",
  };

  const section: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(252,252,251,0.84)",
    padding: "22px 16px",
  };

  const studyFlowSection: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(180deg, rgba(252,252,251,0.97), rgba(246,248,250,0.93))",
    padding: isDesktopTop ? "24px 20px" : "20px 16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
  };

  const blockTitle: React.CSSProperties = {
    margin: 0,
    fontSize: z(24),
    fontWeight: 850,
    color: "rgba(20,20,20,0.90)",
    letterSpacing: -0.25,
    lineHeight: 1.18,
  };

  const heroTitle: React.CSSProperties = {
    margin: 0,
    fontSize: isDesktopTop ? z(26) : z(22),
    fontWeight: 800,
    color: "rgba(25,25,25,0.90)",
    letterSpacing: -0.38,
    lineHeight: 1.16,
  };

  const heroSub: React.CSSProperties = {
    marginTop: 12,
    fontSize: z(15),
    color: "rgba(0,0,0,0.68)",
    fontWeight: 650,
    lineHeight: 1.68,
  };

  const heroSubVi: React.CSSProperties = {
    marginTop: 8,
    fontSize: z(13),
    color: "rgba(0,0,0,0.54)",
    fontWeight: 600,
    lineHeight: 1.62,
  };

  const h3: React.CSSProperties = {
    margin: 0,
    fontSize: z(18),
    fontWeight: 850,
    color: "rgba(0,0,0,0.82)",
    letterSpacing: -0.15,
    lineHeight: 1.22,
  };

  const p: React.CSSProperties = {
    marginTop: 12,
    marginBottom: 0,
    color: "rgba(0,0,0,0.70)",
    fontSize: z(15),
    lineHeight: 1.72,
  };

  const pVi: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    color: "rgba(0,0,0,0.58)",
    fontSize: z(13),
    lineHeight: 1.64,
  };

  const subtleNote: React.CSSProperties = {
    marginTop: 6,
    marginBottom: 0,
    fontSize: z(11),
    lineHeight: 1.5,
    color: "rgba(0,0,0,0.46)",
    fontWeight: 700,
  };

  const langTag: React.CSSProperties = {
    marginTop: 10,
    fontSize: z(11),
    fontWeight: 900,
    letterSpacing: 0.65,
    color: "rgba(0,0,0,0.43)",
  };

  const ctaBand: React.CSSProperties = {
    marginTop: 22,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(180deg, rgba(248,250,251,0.96), rgba(245,247,249,0.94))",
    padding: "30px 16px",
    textAlign: "center",
  };

  const ctaTitle: React.CSSProperties = {
    margin: 0,
    fontSize: isDesktopTop ? z(24) : z(20),
    fontWeight: 800,
    color: "rgba(0,0,0,0.86)",
    letterSpacing: -0.28,
    lineHeight: 1.2,
  };

  const ctaSub: React.CSSProperties = {
    marginTop: 10,
    fontSize: z(15),
    color: "rgba(0,0,0,0.65)",
    fontWeight: 700,
    lineHeight: 1.55,
  };

  const ctaRow: React.CSSProperties = {
    marginTop: 18,
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const heroCtaHint: React.CSSProperties = {
    marginTop: 12,
    fontSize: z(12),
    color: "rgba(0,0,0,0.52)",
    fontWeight: 700,
    textAlign: isDesktopTop ? "left" : "center",
  };

  const primaryBtn: React.CSSProperties = {
    padding: "13px 20px",
    borderRadius: 15,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(0, 128, 120, 0.78)",
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 198,
  };

  const secondaryBtn: React.CSSProperties = {
    padding: "13px 20px",
    borderRadius: 15,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "rgba(255,255,255,0.85)",
    color: "rgba(0,0,0,0.72)",
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 198,
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

  const progGrid: React.CSSProperties = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
  };

  const progCard: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.78)",
    padding: "14px 14px",
    boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
  };

  const progLabel: React.CSSProperties = {
    fontSize: z(12),
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "rgba(0,0,0,0.45)",
    textTransform: "uppercase",
  };

  const progBig: React.CSSProperties = {
    marginTop: 6,
    fontSize: z(28),
    fontWeight: 900,
    color: "rgba(0,0,0,0.86)",
    letterSpacing: -0.6,
  };

  const progSmall: React.CSSProperties = {
    marginTop: 6,
    fontSize: z(13),
    color: "rgba(0,0,0,0.62)",
    lineHeight: 1.5,
  };

  const progBadge: React.CSSProperties = {
    marginTop: 10,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.85)",
    fontSize: z(12),
    fontWeight: 900,
    color: "rgba(0,0,0,0.70)",
  };

  return (
    <div style={wrap}>
      <div style={frame}>
        <div>
          <div style={heroImgWrap} aria-label="Hero band">
            <img
              src={HERO_SRC}
              alt="Mercy Blade — English & Knowledge — Colors of Life"
              style={heroImg}
              loading="eager"
              decoding="async"
            />
          </div>

          <div style={topPriorityGrid}>
            <div style={authStrip} aria-label="Home auth status">
              <div style={authStripTop}>
                <div style={authBadge} aria-live="polite">
                  <span style={authDot} />
                  <span>
                    {isLoading
                      ? "Checking sign-in..."
                      : isSignedIn
                        ? "Signed in"
                        : "Signed out"}
                  </span>
                </div>

                {isSignedIn && userEmail ? (
                  <div style={authTopRight}>
                    <div style={authEmailPill} title={userEmail}>
                      ✉️ {userEmail}
                    </div>
                  </div>
                ) : null}
              </div>

              {isLoading ? (
                <p style={authSub}>We’re checking your session.</p>
              ) : isSignedIn ? (
                <>
                  <h2 style={authTitle}>Welcome back, {displayName}.</h2>
                  <p style={authSub}>
                    You’re signed in and ready to continue with calm progress.
                  </p>
                </>
              ) : (
                <>
                  <h2 style={authTitle}>Start gently.</h2>
                  <p style={authSub}>
                    You can begin free right away, or sign in so your progress stays with you.
                  </p>
                </>
              )}
            </div>

            <div style={lessonCard} aria-label="Today lesson">
              <div style={lessonTop}>
                <div style={langTag}>Today’s lesson</div>
                <div style={lessonMeta}>Lesson 4 · 3 min left</div>
              </div>

              <h2 style={lessonTitle}>Resume your next small step</h2>
              <p style={lessonSub}>
                {isSignedIn
                  ? "Continue from your last activity with one calm room."
                  : "Start with one short room — about 2 minutes."}
              </p>

              <div style={lessonActionsWrap}>
                <div style={lessonPrimaryCol}>
                  <button type="button" style={{ ...primaryBtn, width: "100%", minWidth: 0 }} onClick={goFirstRoom}>
                    {isSignedIn ? "👉 Resume lesson" : "👉 Start free"}
                  </button>
                </div>

                <div style={lessonSecondaryCol}>
                  <button
                    type="button"
                    style={compactActionBtn}
                    onClick={goFirstRoom}
                  >
                    🎙️ Practice speaking
                  </button>

                  <button
                    type="button"
                    style={compactActionBtn}
                    onClick={() => nav("/tiers")}
                  >
                    📚 Learning paths
                  </button>

                  <button
                    type="button"
                    style={compactActionBtn}
                    onClick={() => nav(ROUTE_PRICING)}
                  >
                    💎 Pricing
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={heroCard}>
            <div style={langTag}>EN</div>
            <h1 style={heroTitle}>Think in English. Calmly.</h1>
            <div style={heroSub}>
              Mercy Blade is a quiet space where you practice thinking about life in English.
              <br />
              Not grammar drills. Not pressure. Not noise.
              <br />
              Just one room, one reflection, one small step forward.
            </div>

            <div style={heroCtaHint}>
              {isSignedIn
                ? "You’re in — continue with one short room."
                : "Start with a short room — about 2 minutes."}
            </div>

            <div style={{ ...langTag, marginTop: 18 }}>VI · same meaning as EN</div>
            <h2
              style={{
                ...heroTitle,
                fontSize: isDesktopTop ? z(18) : z(17),
                color: "rgba(0,0,0,0.62)",
                fontWeight: 700,
                letterSpacing: -0.18,
                marginTop: 6,
              }}
            >
              Lắng đọng cùng tư duy tiếng Anh.
            </h2>
            <div style={heroSubVi}>
              Mercy Blade là khoảng lặng để bạn tự tại chiêm nghiệm cuộc sống bằng tiếng Anh.
              <br />
              Không rập khuôn ngữ pháp. Không áp lực. Không tạp âm.
              <br />
              Chỉ một gian phòng, một dòng suy tưởng, thong dong tiến bước về phía trước.
            </div>

            <div
              style={{
                ...heroCtaHint,
                fontSize: z(11),
                color: "rgba(0,0,0,0.46)",
              }}
            >
              Bản tiếng Việt diễn đạt cùng ý với phần tiếng Anh ở trên.
            </div>
          </div>

          <div style={mercyGuideWrap}>
            <MercyGuide />
            <GuideBox />
          </div>

          <div style={hostSpotlight} aria-label="Teacher Mercy spotlight">
            <div style={hostPanelGrid}>
              <div style={hostBubble}>
                <div style={langTag}>EN + VI</div>
                <h2 style={hostName}>Teacher Mercy</h2>

                <p style={hostQuote}>“Would you like a quiet thought for today?”</p>
                <p style={hostQuoteVi}>
                  “Bạn có muốn nhận một suy ngẫm nhẹ nhàng cho hôm nay không?”
                </p>

                <div style={hostMeta}>
                  A gentle guide for reflection — not a noisy chatbot.
                  <br />
                  <span
                    style={{
                      fontSize: z(12),
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.50)",
                    }}
                  >
                    Người dẫn lối dịu dàng cho suy ngẫm — không phải chatbot ồn ào.
                  </span>
                </div>

                <p style={p}>
                  Teacher Mercy helps you enter the experience softly.
                  <br />
                  It invites you to pause, reflect, and continue with calm focus.
                </p>

                <p style={pVi}>
                  Teacher Mercy giúp bạn bước vào trải nghiệm một cách nhẹ nhàng.
                  <br />
                  Mời bạn dừng lại, suy ngẫm, rồi tiếp tục với sự tập trung bình tĩnh.
                </p>

                <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" style={{ ...primaryBtn, minWidth: 220 }} onClick={goFirstRoom}>
                    {isSignedIn
                      ? "🌿 Continue with Teacher Mercy"
                      : "🌿 Enter with Teacher Mercy"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={section}>
            <div style={langTag}>EN + VI</div>
            <h3 style={h3}>Teacher Mercy — A Caring Presence</h3>

            <p style={p}>Teacher Mercy is a calm companion that stays with the learner.</p>
            <p style={pVi}>
              Teacher Mercy là người đồng hành bình tâm luôn đi cùng người học.
            </p>

            <p style={p}>
              It helps the learner enter gently.
              <br />
              It offers the next small step.
              <br />
              It keeps the experience soft, clear, and human.
            </p>
            <p style={pVi}>
              Mercy giúp bạn bước vào hành trình thật nhẹ nhàng.
              <br />
              Gợi mở bước tiếp theo vừa vặn.
              <br />
              Giữ cho trải nghiệm mềm mại, rõ ràng và đầy tính con người.
            </p>

            <p style={p}>
              Teacher Mercy is not trying to flood the learner with features.
              <br />
              It is trying to hold the learner in a steady study rhythm.
            </p>
            <p style={pVi}>
              Teacher Mercy không cố làm bạn choáng ngợp vì quá nhiều tính năng.
              <br />
              Mercy muốn giữ cho bạn một nhịp học đều đặn và bền vững.
            </p>
          </div>

          <div style={studyFlowSection} aria-label="Mercy study flow">
            <div style={langTag}>EN</div>
            <h3 style={h3}>The Mercy study flow</h3>
            <p style={p}>
              Mercy starts from a real sentence from the learner.
            </p>
            <p style={p}>
              It improves that sentence naturally.
              <br />
              It helps the learner say it aloud.
              <br />
              It explains the difference between English thinking and Vietnamese thinking.
              <br />
              It remembers useful patterns over time.
            </p>
            <p style={p}>
              This makes the study flow feel alive.
              <br />
              One sentence becomes correction, speaking, understanding, and memory.
            </p>

            <div style={{ ...langTag, marginTop: 16 }}>VI · same meaning as EN</div>
            <h3
              style={{
                ...h3,
                fontSize: z(16),
                color: "rgba(0,0,0,0.66)",
                fontWeight: 700,
              }}
            >
              Lộ trình học của Teacher Mercy
            </h3>
            <p style={pVi}>
              Teacher Mercy bắt đầu từ những câu nói chân thực nhất của bạn.
            </p>
            <p style={pVi}>
              Trau chuốt câu từ để cách diễn đạt tự nhiên hơn.
              <br />
              Khích lệ bạn cất tiếng nói tự tin.
              <br />
              Làm sáng tỏ sự khác biệt giữa tư duy Anh - Việt.
              <br />
              Ghi dấu những mẫu câu hữu ích theo dòng thời gian.
            </p>
            <p style={pVi}>
              Nhờ đó, mỗi bước học đều khơi nguồn cảm hứng.
              <br />
              Từ một câu nói, mở ra sự thấu hiểu, khả năng diễn đạt và trí nhớ bền lâu.
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                style={{ ...primaryBtn, minWidth: 220 }}
                onClick={goFirstRoom}
              >
                {isSignedIn ? "👉 Continue the Mercy flow" : "👉 Start with one sentence"}
              </button>

              <button
                type="button"
                style={{ ...secondaryBtn, minWidth: 220 }}
                onClick={() => nav(ROUTE_PRICING)}
              >
                💎 Pricing
              </button>
            </div>
          </div>

          <div style={section} aria-label="Your progress">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={langTag}>EN</div>
                <h3 style={h3}>Your progress</h3>
                <div style={{ ...p, marginTop: 8 }}>
                  {isSignedIn
                    ? "A quiet snapshot — what you’ve practiced recently."
                    : "Sign in to save your path and see your quiet progress snapshot."}
                </div>
              </div>
            </div>

            {user?.id && progressErr ? (
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 14,
                  border: "1px solid rgba(255,0,0,0.25)",
                  background: "rgba(255,255,255,0.7)",
                }}
              >
                <div style={{ fontWeight: 900, color: "rgba(120,0,0,0.80)", fontSize: z(16) }}>
                  Progress error
                </div>
                <div style={{ marginTop: 6, fontSize: z(13), color: "rgba(0,0,0,0.65)" }}>
                  {progressErr}
                </div>
              </div>
            ) : null}

            <div style={progGrid}>
              <div style={progCard}>
                <div style={progLabel}>Streak</div>
                <div style={progBig}>
                  {progressLoading
                    ? "…"
                    : `${fmtInt(progressSummary.streak)} ${plural(
                        fmtInt(progressSummary.streak),
                        "day",
                        "days"
                      )}`}
                </div>
                <div style={progSmall}>
                  {user?.id
                    ? "How many days in a row you’ve studied."
                    : "Sign in to track your streak."}
                </div>

                {user?.id ? (
                  <div style={progBadge} aria-label="Streak badge">
                    🔥 Streak:{" "}
                    {streakDays === null
                      ? "—"
                      : `${streakDays} ${plural(streakDays, "day", "days")}`}
                  </div>
                ) : null}
              </div>

              <div style={progCard}>
                <div style={progLabel}>Active days (30d)</div>
                <div style={progBig}>
                  {progressLoading ? "…" : `${fmtInt(progressSummary.active30d)}`}
                </div>
                <div style={progSmall}>
                  {user?.id
                    ? "How many days you were active in the last 30 days."
                    : "Sign in to see your recent activity."}
                </div>
              </div>

              <div style={progCard}>
                <div style={progLabel}>Last activity</div>
                <div style={progBig}>
                  {progressLoading
                    ? "…"
                    : progressSummary.lastStudyAt
                      ? "Seen"
                      : "—"}
                </div>
                <div style={progSmall}>
                  {progressSummary.lastStudyAt
                    ? fmtDate(progressSummary.lastStudyAt)
                    : user?.id
                      ? "No recent study yet."
                      : "Sign in to keep your study history."}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={langTag}>VI</div>
              <h3
                style={{
                  ...h3,
                  fontSize: z(16),
                  color: "rgba(0,0,0,0.66)",
                  fontWeight: 700,
                }}
              >
                Tiến độ an nhiên
              </h3>
              <div style={{ ...pVi, marginTop: 8 }}>
                {isSignedIn
                  ? "Một lát cắt nhẹ nhàng — ghi dấu hành trình bạn vừa đi qua."
                  : "Hãy đăng nhập để lưu giữ hành trình và ngắm nhìn tiến độ của mình."}
              </div>
            </div>
          </div>

          <div style={band}>
            <div style={langTag}>EN</div>
            <h2 style={blockTitle}>A Gentle Companion for Your Whole Life</h2>

            <p style={p}>
              Mercy Blade is a bilingual (English–Vietnamese) companion for real life — health, emotions, money,
              relationships, work, and meaning.
            </p>
            <p style={subtleNote}>
              Vietnamese support below carries the same meaning as the English above.
              <br />
              Phần tiếng Việt bên dưới diễn đạt cùng ý với phần tiếng Anh phía trên.
            </p>

            <p style={p}>
              This is not a place to rush or perform.
              <br />
              It is a place to slow down, listen, and move forward one small step at a time.
            </p>
            <p style={pVi}>
              Đây không phải nơi để vội vã hay phô diễn.
              <br />
              Mà là nơi để bạn lắng lại, lắng nghe và tiến lên từng bước vững vàng.
            </p>

            <p style={p}>
              No pressure.
              <br />
              No judgment.
              <br />
              Only clarity, compassion, and steady growth.
            </p>
            <p style={pVi}>
              Không áp lực.
              <br />
              Không phán xét.
              <br />
              Chỉ có sự sáng rõ, lòng trắc ẩn và những chuyển biến bền bỉ.
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                style={{ ...primaryBtn, minWidth: 240 }}
                onClick={goFirstRoom}
              >
                {primaryCtaEn}
              </button>

              <button
                type="button"
                style={{ ...secondaryBtn, minWidth: 240 }}
                onClick={goAccountOrSignin}
              >
                {accountCtaEn}
              </button>

              <button
                type="button"
                style={{ ...secondaryBtn, minWidth: 240 }}
                onClick={() => nav("/tiers")}
              >
                👉 See learning paths
              </button>

              <button
                type="button"
                style={{ ...secondaryBtn, minWidth: 240 }}
                onClick={() => nav(ROUTE_PRICING)}
              >
                💎 Pricing
              </button>
            </div>
          </div>

          <div style={ctaBand}>
            <h2 style={ctaTitle}>
              {isSignedIn
                ? "You’re in — continue gently, one room at a time."
                : "Start gently — one room at a time."}
            </h2>
            <div style={ctaSub}>
              {isSignedIn
                ? "Bạn đã sẵn sàng — cứ an nhiên tiếp tục, từng bước một."
                : "Bắt đầu thật nhẹ nhàng — từng căn phòng một."}
            </div>

            <div style={ctaRow}>
              <button type="button" style={primaryBtn} onClick={goFirstRoom}>
                {primaryCtaEn}
              </button>

              <button
                type="button"
                style={secondaryBtn}
                onClick={goAccountOrSignin}
              >
                {accountCtaEn}
              </button>

              <button
                type="button"
                style={secondaryBtn}
                onClick={() => nav("/tiers")}
              >
                👉 See learning paths
              </button>

              <button
                type="button"
                style={secondaryBtn}
                onClick={() => nav(ROUTE_PRICING)}
              >
                💎 Pricing
              </button>

              <button
                type="button"
                style={secondaryBtn}
                onClick={() => nav("/redeem")}
              >
                🎁&nbsp; Redeem Gift Code / Kích hoạt mã quà tặng
              </button>
            </div>
          </div>
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