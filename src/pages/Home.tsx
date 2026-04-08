// PATH: src/pages/Home.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomMusicBar from "@/components/audio/BottomMusicBar";
import { MercyGuide } from "@/components/MercyGuide";
import { useAuth } from "@/providers/AuthProvider";

const PAGE_MAX = 980;
const softPanel = "rgba(230, 244, 255, 0.85)";
const LS_ZOOM = "mb.ui.zoom";
const HOME_TZ = "Asia/Ho_Chi_Minh";
const ROUTE_PRICING = "/pricing";
const HERO_SRC = "/hero/hero_band.jpg";

const VN_DT_FMT = new Intl.DateTimeFormat("vi-VN", {
  timeZone: HOME_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

type SupabaseClientType = typeof import("@/lib/supabaseClient")["supabase"];

let supabaseClientPromise: Promise<SupabaseClientType> | null = null;

async function getSupabaseClient(): Promise<SupabaseClientType> {
  if (!supabaseClientPromise) {
    supabaseClientPromise = import("@/lib/supabaseClient").then((mod) => mod.supabase);
  }
  return supabaseClientPromise;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function readZoomPct(): number {
  try {
    const attr = document.documentElement.getAttribute("data-mb-zoom");
    const fromAttr = attr ? Number(attr) : NaN;
    if (Number.isFinite(fromAttr)) return clamp(Math.round(fromAttr), 60, 140);
  } catch {
    // ignore
  }

  try {
    const raw = localStorage.getItem(LS_ZOOM);
    const n = raw ? Number(raw) : NaN;
    if (Number.isFinite(n)) return clamp(Math.round(n), 60, 140);
  } catch {
    // ignore
  }

  return 100;
}

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

export default function Home() {
  const nav = useNavigate();
  const { user, isLoading } = useAuth();

  const [zoomPct, setZoomPct] = useState<number>(100);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressErr, setProgressErr] = useState<string | null>(null);
  const [progressRow, setProgressRow] = useState<ProgressSummaryRow | null>(null);
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [firstRoomId, setFirstRoomId] = useState<string | null>(null);
  const [howOpen, setHowOpen] = useState<boolean>(true);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );

  useEffect(() => {
    const apply = () => setZoomPct(readZoomPct());
    apply();

    const obs = new MutationObserver(() => apply());
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mb-zoom"],
    });

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();

    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const zoomScale = useMemo(() => clamp(zoomPct / 100, 0.6, 1.4), [zoomPct]);
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

        const supabase = await getSupabaseClient();
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

        const supabase = await getSupabaseClient();
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
        const supabase = await getSupabaseClient();

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
  const primaryCtaVi = isSignedIn ? "👉 Tiếp tục hành trình" : "👉 Bắt đầu nhẹ nhàng";
  const accountCtaEn = isSignedIn ? "👤 Account" : "🔐 Sign in";
  const accountCtaVi = isSignedIn ? "👤 Tài khoản" : "🔐 Đăng nhập";

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
    background: "white",
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
      ? "linear-gradient(180deg, rgba(236,253,245,0.92), rgba(255,255,255,0.96))"
      : "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,248,255,0.92))",
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
    fontSize: 12,
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
    margin: "6px 0 0",
    fontSize: isDesktopTop ? 28 : 22,
    fontWeight: 950,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -0.55,
    lineHeight: 1.08,
  };

  const authSub: React.CSSProperties = {
    marginTop: 4,
    marginBottom: 0,
    fontSize: 14,
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
    fontSize: 11,
    fontWeight: 900,
    color: "rgba(0,0,0,0.74)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const lessonCard: React.CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,248,255,0.92))",
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
    fontSize: 12,
    fontWeight: 900,
    color: "rgba(0,0,0,0.52)",
    letterSpacing: 0.2,
  };

  const lessonTitle: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: isDesktopTop ? 28 : 23,
    fontWeight: 950,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -0.6,
    lineHeight: 1.08,
  };

  const lessonSub: React.CSSProperties = {
    marginTop: 6,
    marginBottom: 0,
    fontSize: 14,
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
    fontSize: 13,
    lineHeight: 1.2,
    minHeight: 0,
  };

  const heroCard: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(235,247,255,0.88))",
    padding: isDesktopTop ? "28px 22px" : "26px 18px",
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
      "linear-gradient(135deg, rgba(247,252,255,0.96), rgba(239,247,255,0.92), rgba(248,244,255,0.90))",
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
    background: "rgba(255,255,255,0.88)",
    padding: "16px 16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  };

  const hostName: React.CSSProperties = {
    margin: 0,
    fontSize: 24,
    fontWeight: 950,
    color: "rgba(0,0,0,0.88)",
    letterSpacing: -0.4,
  };

  const hostQuote: React.CSSProperties = {
    marginTop: 12,
    marginBottom: 0,
    fontSize: 18,
    lineHeight: 1.7,
    color: "rgba(0,0,0,0.78)",
    fontWeight: 700,
  };

  const hostMeta: React.CSSProperties = {
    marginTop: 10,
    fontSize: 13,
    color: "rgba(0,0,0,0.54)",
    fontWeight: 800,
  };

  const band: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: softPanel,
    padding: "26px 16px",
  };

  const section: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.72)",
    padding: "22px 16px",
  };

  const studyFlowSection: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,248,255,0.92))",
    padding: isDesktopTop ? "24px 20px" : "20px 16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
  };

  const blockTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
    color: "rgba(15,15,15,0.90)",
    letterSpacing: -0.4,
  };

  const heroTitle: React.CSSProperties = {
    margin: 0,
    fontSize: isDesktopTop ? 36 : 32,
    fontWeight: 950,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -0.8,
    lineHeight: 1.1,
  };

  const heroSub: React.CSSProperties = {
    marginTop: 12,
    fontSize: isDesktopTop ? 18 : 17,
    color: "rgba(0,0,0,0.68)",
    fontWeight: 700,
    lineHeight: 1.6,
  };

  const h3: React.CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
    color: "rgba(0,0,0,0.82)",
    letterSpacing: -0.2,
  };

  const p: React.CSSProperties = {
    marginTop: 12,
    marginBottom: 0,
    color: "rgba(0,0,0,0.70)",
    fontSize: 16,
    lineHeight: 1.65,
  };

  const langTag: React.CSSProperties = {
    marginTop: 10,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "rgba(0,0,0,0.45)",
  };

  const ctaBand: React.CSSProperties = {
    marginTop: 22,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(90deg, rgba(77,255,184,0.25), rgba(77,184,255,0.22), rgba(184,77,255,0.20), rgba(255,184,77,0.22))",
    padding: "34px 16px",
    textAlign: "center",
  };

  const ctaTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 42,
    fontWeight: 900,
    color: "rgba(0,0,0,0.86)",
    letterSpacing: -0.8,
  };

  const ctaSub: React.CSSProperties = {
    marginTop: 10,
    fontSize: 18,
    color: "rgba(0,0,0,0.65)",
    fontWeight: 800,
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
    fontSize: 13,
    color: "rgba(0,0,0,0.55)",
    fontWeight: 800,
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
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "rgba(0,0,0,0.45)",
    textTransform: "uppercase",
  };

  const progBig: React.CSSProperties = {
    marginTop: 6,
    fontSize: 28,
    fontWeight: 900,
    color: "rgba(0,0,0,0.86)",
    letterSpacing: -0.6,
  };

  const progSmall: React.CSSProperties = {
    marginTop: 6,
    fontSize: 13,
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
    fontSize: 12,
    fontWeight: 900,
    color: "rgba(0,0,0,0.70)",
  };

  return (
    <div style={wrap}>
      <div style={frame}>
        <div style={{ ...({ zoom: zoomScale } as unknown as React.CSSProperties) }}>
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
                      ? "Đang kết nối..."
                      : isSignedIn
                      ? "Đã sẵn sàng"
                      : "Chưa đăng nhập"}
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
                <p style={authSub}>Chúng tôi đang chuẩn bị không gian cho bạn.</p>
              ) : isSignedIn ? (
                <>
                  <h2 style={authTitle}>Mừng bạn trở lại, {displayName}.</h2>
                  <p style={authSub}>
                    Mọi thứ đã sẵn sàng để bạn tiếp tục bước đi trong sự tĩnh tại.
                  </p>
                </>
              ) : (
                <>
                  <h2 style={authTitle}>Khởi đầu nhẹ nhàng.</h2>
                  <p style={authSub}>
                    Bạn có thể trải nghiệm ngay, hoặc đăng nhập để lưu giữ những dấu ấn cá nhân.
                  </p>
                </>
              )}
            </div>

            <div style={lessonCard} aria-label="Today lesson">
              <div style={lessonTop}>
                <div style={langTag}>DÀNH CHO HÔM NAY</div>
                <div style={lessonMeta}>Bài 4 · 3 phút</div>
              </div>

              <h2 style={lessonTitle}>Tiếp tục bước chân nhỏ</h2>
              <p style={lessonSub}>
                {isSignedIn
                  ? "Trở lại với không gian học gần nhất của bạn."
                  : "Bắt đầu với một căn phòng ngắn — chỉ khoảng 2 phút."}
              </p>

              <div style={lessonActionsWrap}>
                <div style={lessonPrimaryCol}>
                  <button type="button" style={{ ...primaryBtn, width: "100%", minWidth: 0 }} onClick={goFirstRoom}>
                    {isSignedIn ? "👉 Học tiếp" : "👉 Thử ngay"}
                  </button>
                </div>

                <div style={lessonSecondaryCol}>
                  <button
                    type="button"
                    style={compactActionBtn}
                    onClick={goFirstRoom}
                  >
                    🎙️ Luyện nói
                  </button>

                  <button
                    type="button"
                    style={compactActionBtn}
                    onClick={() => nav("/tiers")}
                  >
                    📚 Lộ trình
                  </button>

                  <button
                    type="button"
                    style={compactActionBtn}
                    onClick={() => nav(ROUTE_PRICING)}
                  >
                    💎 Gói học
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

            <div style={{ ...langTag, marginTop: 24 }}>VI</div>
            <h2 style={{ ...heroTitle, fontSize: isDesktopTop ? 30 : 28 }}>
              Suy nghĩ bằng tiếng Anh. Một cách tĩnh tại.
            </h2>
            <div style={heroSub}>
              Mercy Blade là khoảng lặng để bạn tập cảm nhận cuộc sống bằng tiếng Anh.
              <br />
              Không áp lực điểm số. Không lý thuyết khô khan. Không ồn ào.
              <br />
              Chỉ một phòng, một suy ngẫm, một bước tiến nhỏ mỗi ngày.
            </div>

            <div style={heroCtaHint}>
              {isSignedIn
                ? "Bạn đã đăng nhập — tiếp tục với một phòng ngắn."
                : "Bắt đầu với một phòng ngắn — khoảng 2 phút."}
            </div>
          </div>

          <div style={mercyGuideWrap}>
            <MercyGuide />
          </div>

          <div style={hostSpotlight} aria-label="Mercy Host spotlight">
            <div style={hostPanelGrid}>
              <div style={hostBubble}>
                <div style={langTag}>EN</div>
                <h2 style={hostName}>Mercy Host</h2>
                <p style={hostQuote}>“Would you like a quiet thought for today?”</p>
                <div style={hostMeta}>A gentle guide for reflection — not a noisy chatbot.</div>
                <p style={p}>
                  Mercy Host helps you enter the experience softly.
                  <br />
                  It invites you to pause, reflect, and continue with calm focus.
                </p>
                <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" style={{ ...primaryBtn, minWidth: 220 }} onClick={goFirstRoom}>
                    {isSignedIn ? "🌿 Continue with Mercy Host" : "🌿 Enter with Mercy Host"}
                  </button>
                </div>
              </div>

              <div style={hostBubble}>
                <div style={langTag}>VI</div>
                <h2 style={hostName}>Mercy Host</h2>
                <p style={hostQuote}>“Bạn có muốn dành một chút lặng cho hôm nay?”</p>
                <div style={hostMeta}>Người dẫn đường dịu dàng — không phải chatbot vô hồn.</div>
                <p style={p}>
                  Mercy Host dẫn dắt bạn bước vào trải nghiệm một cách mềm mại nhất.
                  <br />
                  Mời bạn dừng lại một nhịp, lắng nghe, và tiến bước với sự tập trung thuần khiết.
                </p>
                <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" style={{ ...secondaryBtn, minWidth: 220 }} onClick={goFirstRoom}>
                    {isSignedIn ? "🌿 Đi cùng Mercy Host" : "🌿 Bắt đầu cùng Mercy Host"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={section}>
            <div style={langTag}>EN</div>
            <h3 style={h3}>Mercy Host — A Caring Presence</h3>
            <p style={p}>Mercy Host is a quiet guide that stays with you.</p>
            <p style={p}>
              It knows which room you are in.
              <br />
              It knows what you are practicing.
              <br />
              It helps you slow down — or continue — when the moment is right.
            </p>
            <p style={p}>
              Over time, Mercy Host remembers your journey and supports your progress.
            </p>

            <div style={{ ...langTag, marginTop: 16 }}>VI</div>
            <h3 style={h3}>Mercy Host — Sự hiện diện thầm lặng</h3>
            <p style={p}>Mercy Host không chỉ là công cụ, mà là người bạn đồng hành luôn ở đó.</p>
            <p style={p}>
              Thấu hiểu bạn đang ở đâu, thấu hiểu điều bạn đang rèn luyện.
              <br />
              Giúp bạn chậm lại khi cần, và tiếp thêm động lực đúng lúc.
            </p>
            <p style={p}>
              Theo thời gian, Mercy Host ghi nhớ hành trình để nâng đỡ từng bước tiến của bạn.
            </p>
          </div>

          <div style={studyFlowSection} aria-label="Mercy study flow">
            <div style={langTag}>EN</div>
            <h3 style={h3}>The Mercy study flow</h3>
            <p style={p}>
              Mercy begins with a real sentence from the learner.
            </p>
            <p style={p}>
              It improves that sentence naturally.
              <br />
              It helps the learner say it aloud.
              <br />
              It explains the difference between English thinking and Vietnamese thinking.
              <br />
              Then it remembers useful patterns over time.
            </p>
            <p style={p}>
              The goal is not to study disconnected fragments.
              <br />
              The goal is to turn one living sentence into a repeatable learning loop.
            </p>

            <div style={{ ...langTag, marginTop: 16 }}>VI</div>
            <h3 style={h3}>Dòng chảy Mercy</h3>
            <p style={p}>
              Mọi thứ bắt đầu từ chính suy nghĩ thực của bạn.
            </p>
            <p style={p}>
              Chúng tôi giúp câu nói của bạn trở nên tự nhiên hơn, giúp bạn cất lời thành tiếng.
              <br />
              Làm rõ sự khác biệt giữa tư duy Anh - Việt, rồi lưu giữ những tinh hoa đó vào ký ức.
              <br />
              Mọi mẫu câu hữu ích sẽ được ghi nhớ theo thời gian.
            </p>
            <p style={p}>
              Mục tiêu không phải là những mảnh vụn kiến thức rời rạc.
              <br />
              Mục tiêu là biến mỗi câu sống động thành một vòng lặp cảm xúc và ghi nhớ lâu dài.
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
                💎 See plans
              </button>
            </div>
          </div>

          <div style={section}>
            <div style={langTag}>EN</div>
            <h3 style={h3}>The Quiet Hour</h3>
            <p style={p}>When life feels loud, Mercy Blade offers a simple ritual:</p>
            <p style={p}>
              One minute.
              <br />
              One bilingual card.
              <br />
              One calm breath.
            </p>
            <p style={p}>
              You don’t force learning.
              <br />
              You let understanding arrive.
            </p>

            <div style={{ ...langTag, marginTop: 16 }}>VI</div>
            <h3 style={h3}>Giờ Lặng</h3>
            <p style={p}>
              Khi thế giới bên ngoài quá ồn ào, Mercy Blade tặng bạn một nghi thức nhỏ:
            </p>
            <p style={p}>
              Một phút.
              <br />
              Một thông điệp song ngữ.
              <br />
              Một hơi thở sâu.
            </p>
            <p style={p}>
              Đừng ép mình phải học.
              <br />
              Hãy để sự hiểu biết tự tìm đến bạn.
            </p>
          </div>

          {!phase3Hide ? (
            <div style={band}>
              <div style={langTag}>TIẾN TRÌNH</div>
              <h2 style={blockTitle}>Nhật ký của sự kiên trì</h2>
              <p style={p}>
                Tiến bộ không đến từ áp lực.
                <br />
                Nó đến từ những lần trở lại nhẹ nhàng, bền bỉ.
              </p>

              <div style={progGrid}>
                <div style={progCard}>
                  <div style={progLabel}>Chuỗi ngày hiện tại</div>
                  <div style={progBig}>
                    {progressLoading ? "…" : fmtInt(progressSummary.streak)}{" "}
                    ngày
                  </div>
                  <div style={progSmall}>
                    Sự bền bỉ quan trọng hơn cường độ.
                  </div>
                </div>

                <div style={progCard}>
                  <div style={progLabel}>Hoạt động trong tháng</div>
                  <div style={progBig}>
                    {progressLoading ? "…" : fmtInt(progressSummary.active30d)}{" "}
                    ngày
                  </div>
                  <div style={progSmall}>
                    Lặp lại nhẹ nhàng tạo nên sự tự tin.
                  </div>
                </div>

                <div style={progCard}>
                  <div style={progLabel}>Lần học cuối</div>
                  <div style={progBig}>
                    {progressLoading
                      ? "…"
                      : progressSummary.lastStudyAt
                      ? fmtDate(progressSummary.lastStudyAt)
                      : "Mới bắt đầu"}
                  </div>
                  <div style={progSmall}>
                    Cánh cửa Mercy luôn rộng mở đón bạn trở lại.
                  </div>
                </div>
              </div>

              {progressErr ? (
                <div style={progBadge}>Hiện tại chưa cập nhật được tiến trình.</div>
              ) : isSignedIn ? (
                <div style={progBadge}>
                  {howOpen
                    ? "Bạn đang xây dựng một nền tảng vững chắc."
                    : "Một nhịp độ thầm lặng đang dần hình thành."}
                </div>
              ) : (
                <div style={progBadge}>
                  Đăng nhập để lưu giữ những bước tiến của bạn.
                </div>
              )}
            </div>
          ) : null}

          <div style={ctaBand}>
            <h2 style={ctaTitle}>Sẵn lòng cho một bước tiếp theo?</h2>
            <div style={ctaSub}>
              Start with one room. One sentence. One quiet return.
            </div>

            <div style={ctaRow}>
              <button type="button" style={primaryBtn} onClick={goFirstRoom}>
                {primaryCtaEn}
              </button>

              <button type="button" style={secondaryBtn} onClick={goAccountOrSignin}>
                {accountCtaEn}
              </button>

              <button type="button" style={secondaryBtn} onClick={() => nav("/tiers")}>
                📚 Learning paths
              </button>

              <button type="button" style={secondaryBtn} onClick={() => nav(ROUTE_PRICING)}>
                💎 Pricing
              </button>
            </div>

            <div style={{ ...langTag, marginTop: 24 }}>VI</div>
            <div style={{ ...ctaSub, marginTop: 8 }}>
              Bắt đầu với một phòng. Một câu. Một lần quay lại nhẹ nhàng.
            </div>

            <div style={ctaRow}>
              <button type="button" style={primaryBtn} onClick={goFirstRoom}>
                {primaryCtaVi}
              </button>

              <button type="button" style={secondaryBtn} onClick={goAccountOrSignin}>
                {accountCtaVi}
              </button>

              <button type="button" style={secondaryBtn} onClick={() => nav("/tiers")}>
                👉 Khám phá lộ trình
              </button>

              <button type="button" style={secondaryBtn} onClick={() => nav(ROUTE_PRICING)}>
                💎 Bảng giá
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={bottomDockOuter}>
        <div style={bottomDockInner}>
          <BottomMusicBar />
        </div>
      </div>
    </div>
  );
}