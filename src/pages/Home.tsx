// src/pages/Home.tsx
// MB-BLUE-100.9 — 2026-01-11 (+0700)
//
// HOME (LOCKED):
// - Home page is TEXT-ONLY (no audio players, no songs, no lyrics).
// - Music belongs ONLY in BottomMusicBar (entertainment).
// - Learning audio lives ONLY inside rooms.
//
// FIX 100.7:
// - Replace ONLY BOX 2 HERO:
//   - Use image hero: /hero/hero_band.jpg
//   - Centered title + subtitle (like old hero)
//   - Remove badges / extra words
// - DO NOT TOUCH header or content below.
//
// FIX 100.8:
// - ✅ HOME now CONSUMES global zoom from BottomMusicBar:
//   - Reads :root data-mb-zoom (percent) + localStorage("mb.ui.zoom") fallback
//   - Applies zoom to HOME content ONLY (hero + body), NOT the fixed music bar
//   - Header remains unscaled (sticky behavior preserved)
//
// FIX 100.9:
// - ✅ Header shows auth state:
//   - Signed out: "Sign in / Đăng nhập"
//   - Signed in: shows "Sign out / Đăng xuất" (calls useAuth().signOut())
// - NO CHANGES to zoom wrapper or content blocks below.
//
// NEW (MB-BLUE-100.9g):
// - BOX 1 header is THIN (no "Home" button, no email text).
// - BOX 2 hero uses ONE brand image that already includes "Mercy Blade" + tagline.
// - DO NOT put logo in header. DO NOT put any text overlay in hero.
//
// NEW (MB-BLUE-100.9i):
// - Hero path mismatch hardening:
//   - Try BOTH /hero/<file> and /<file> (common mistake when copying to /public)
//   - Try jpg/jpeg/png + case variants
//   - If all fail, fallback to existing /hero/hero_band.jpg so you never see blank.
// - Hero full-bleed inside frame (touch both sides).
//
// NEW (MB-BLUE-100.9p):
// - Add HOME Progress cards (TEXT-ONLY) using read-only view v_user_progress_current
// - Query ONLY when signed-in; safe empty/error handling; no new files
//
// PATCH (MB-BLUE-100.9q):
// - ✅ Streak is now DB-side via read-only view v_user_streak_summary (VN-normalized)
// - Home displays streak_days only — NO study_log fetch, no timezone pitfalls
//
// PATCH (MB-BLUE-100.9s):
// - ✅ Smarter First Room query (schema-safe):
//   - rooms table has ONLY: id, tier, sort_order, created_at (no area/is_published)
//   - So we must infer “core-ish” by ID + exclude kids + exclude vip*_* hybrids.
//   - Prefer sort_order (ASC) then created_at (ASC), then pick best from a ranked list.
//
// - ✅ Phase-based “How it works”:
//   - Phase 0 (new/inactive): show full + “First room” CTA
//   - Phase 2 (habit): collapsed by default, toggleable
//   - Phase 3 (established): hidden by default
//
// NOTE (2026-01-30):
// - FIXED the syntax error at FIRST_ROOM_FALLBACKS useMemo (bad commas).
//
// PATCH (2026-01-30):
// - Header alignment:
//   1) Sign out block moves to LEFT side of header (requested).
//   2) Tier Map stays on RIGHT side.
//   (Keeps header thin; no new components; no layout rewrites.)
//
// PATCH (2026-01-31):
// - Option A: Home no longer renders its own BOX 1 header strip.
// - Header actions are now owned by GlobalHeader (single source of truth).

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomMusicBar from "@/components/audio/BottomMusicBar";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

const PAGE_MAX = 980;
const softPanel = "rgba(230, 244, 255, 0.85)";

// ✅ must match BottomMusicBar key (LOCKED)
const LS_ZOOM = "mb.ui.zoom";

// ✅ VN users first — keep stable even if developer moves timezones
const HOME_TZ = "Asia/Ho_Chi_Minh";

const VN_DT_FMT = new Intl.DateTimeFormat("vi-VN", {
  timeZone: HOME_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function readZoomPct(): number {
  // Prefer :root attribute (live updates)
  try {
    const attr = document.documentElement.getAttribute("data-mb-zoom");
    const fromAttr = attr ? Number(attr) : NaN;
    if (Number.isFinite(fromAttr)) return clamp(Math.round(fromAttr), 60, 140);
  } catch {}

  // Fallback: localStorage
  try {
    const raw = localStorage.getItem(LS_ZOOM);
    const n = raw ? Number(raw) : NaN;
    if (Number.isFinite(n)) return clamp(Math.round(n), 60, 140);
  } catch {}

  return 100;
}

// ---------------------------
// HOME Progress (read-only)
// ---------------------------
// ✅ Match REAL view columns (authoritative):
// user_id uuid
// streak_days bigint
// days_active_30d bigint
// last_study_at timestamptz
type ProgressSummaryRow = {
  user_id: string | null;
  streak_days: number | null;
  days_active_30d: number | null;
  last_study_at: string | null; // timestamptz in view
};

function fmtDate(s: string | null | undefined) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return VN_DT_FMT.format(d);
}

function fmtInt(n: any, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? Math.max(0, Math.floor(v)) : fallback;
}

function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

type RoomRowLite = {
  id: string;
  tier: string | null;
  sort_order: number | null;
  created_at: string | null;
};

function isKidsRoomId(id: string) {
  return id.includes("_kids_") || id.includes("-kids-");
}

// Some legacy/hybrid rows look like vip6_freeze_response (tier=free but vip* prefix)
function isVipHybridId(id: string) {
  return /^vip\d+_/.test(id) || /^vip\d+-/.test(id);
}

export default function Home() {
  const nav = useNavigate();

  // ✅ SINGLE SOURCE OF TRUTH (AuthProvider)
  const { user, isLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      // hard reset local state / routing
      nav("/signin", { replace: true });
    }
  };

  // ✅ In-app UUID reveal + copy (NO console)
  const userUuid = user?.id ?? "";
  const [uuidCopied, setUuidCopied] = useState(false);

  const copyUuid = async () => {
    if (!userUuid) return;
    try {
      await navigator.clipboard.writeText(userUuid);
      setUuidCopied(true);
      window.setTimeout(() => setUuidCopied(false), 1200);
    } catch {
      // fallback if clipboard blocked
      const ok = window.prompt("Copy your UUID:", userUuid);
      if (ok !== null) {
        setUuidCopied(true);
        window.setTimeout(() => setUuidCopied(false), 1200);
      }
    }
  };

  // ✅ HOME zoom consumer (content only)
  const [zoomPct, setZoomPct] = useState<number>(100);

  useEffect(() => {
    const apply = () => setZoomPct(readZoomPct());
    apply();

    // Live follow BottomMusicBar updates
    const obs = new MutationObserver(() => apply());
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mb-zoom"],
    });

    return () => obs.disconnect();
  }, []);

  const zoomScale = useMemo(() => clamp(zoomPct / 100, 0.6, 1.4), [zoomPct]);

  // ✅ HERO brand image fallback chain (prevents blank hero if filename/path changes)
  const heroFallbacks = useMemo(
    () => [
      // Preferred (folder)
      "/hero/hero_mercyblade_brand.jpg",
      "/hero/hero_mercyblade_brand.jpeg",
      "/hero/hero_mercyblade_brand.png",
      "/hero/hero_mercyblade_brand.JPG",
      "/hero/hero_mercyblade_brand.JPEG",
      "/hero/hero_mercyblade_brand.PNG",

      // Common mistake (no /hero folder)
      "/hero_mercyblade_brand.jpg",
      "/hero_mercyblade_brand.jpeg",
      "/hero_mercyblade_brand.png",
      "/hero_mercyblade_brand.JPG",
      "/hero_mercyblade_brand.JPEG",
      "/hero_mercyblade_brand.PNG",

      // Safety net: old working hero (never blank)
      "/hero/hero_band.jpg",
    ],
    []
  );

  const [heroIdx, setHeroIdx] = useState(0);
  const heroSrc = heroFallbacks[heroIdx] ?? heroFallbacks[0];

  useEffect(() => {
    setHeroIdx(0);
  }, [heroFallbacks]);

  // ---------------------------
  // Progress load (read-only)
  // ---------------------------
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressErr, setProgressErr] = useState<string | null>(null);
  const [progressRow, setProgressRow] = useState<ProgressSummaryRow | null>(null);

  // ✅ Streak badge (soft; best-effort)
  const [streakDays, setStreakDays] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;

    // Only load when signed in
    if (!user?.id) {
      setProgressRow(null);
      setProgressErr(null);
      setProgressLoading(false);
      return;
    }

    (async () => {
      try {
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
          setProgressRow(((data as any) ?? null) as ProgressSummaryRow | null);
        }
      } catch (e: any) {
        if (!alive) return;
        setProgressErr(e?.message ?? String(e));
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

  // ✅ streak read (DB-side; no study_log fetch)
  useEffect(() => {
    let alive = true;

    if (!user?.id) {
      setStreakDays(null);
      return;
    }

    (async () => {
      try {
        const { data, error } = await supabase.from("v_user_streak_summary").select("streak_days").maybeSingle();

        if (!alive) return;

        if (error) {
          setStreakDays(null);
          return;
        }

        const v = data ? Number((data as any).streak_days ?? 0) : 0;
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

    return {
      streak,
      active30d,
      lastStudyAt,
    };
  }, [progressRow, streakDays]);

  // ---------------------------
  // First room target (DB-first, schema-safe preference)
  // ---------------------------
  // ✅ FIX: useMemo dependency list must be a single [] (your error was duplicate commas)
  const FIRST_ROOM_FALLBACKS = useMemo(() => ["sleep_basics", "anxiety_intro"], []);
  const [firstRoomId, setFirstRoomId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // Pull a small window of “best free rooms” by sort_order,
        // then pick a good “core-ish” first room by ranked IDs.
        const { data, error } = await supabase
          .from("rooms")
          .select("id, tier, sort_order, created_at")
          .eq("tier", "free")
          // ✅ exclude kids + vip hybrids using id patterns (since schema has no area/is_published)
          .not("id", "like", "%_kids_%")
          .not("id", "like", "%-kids-%")
          .not("id", "like", "vip%_%")
          .not("id", "like", "vip%-%")
          .order("sort_order", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: true })
          .limit(40);

        if (!alive) return;

        const rows = (Array.isArray(data) ? (data as any[]) : []).map((r) => ({
          id: String(r?.id ?? ""),
          tier: r?.tier ?? null,
          sort_order: r?.sort_order ?? null,
          created_at: r?.created_at ?? null,
        })) as RoomRowLite[];

        const clean = rows.filter((r) => r.id && !isKidsRoomId(r.id) && !isVipHybridId(r.id));

        // ✅ Your DB sample says the earliest “adult free” is career_consultant_free,
        // but we still prefer a gentle universal first room if it exists.
        const rankedPrefer = [
          // Universal, calm entry points (if present in DB)
          "sleep_basics",
          "anxiety_intro",

          // Strong “begin learning” vibes if sleep/anxiety rooms are not free / not present
          "english_foundation_ef11",
          "grammar_foundations_free",

          // Brand-intro room (nice onboarding)
          "mercy_blade_bridge_of_hearts_free",

          // Practical adult room (your current earliest by sort_order)
          "career_consultant_free",
        ];

        const byId = new Map(clean.map((r) => [r.id, r]));

        const pickRanked = rankedPrefer.find((id) => byId.has(id)) ?? null;

        // If none of our ranked IDs exist, take the earliest clean row.
        const pickEarliest = clean[0]?.id ?? null;

        // If DB failed or empty, fallback.
        const pick =
          (!error ? pickRanked || pickEarliest : null) || FIRST_ROOM_FALLBACKS[0] || "sleep_basics";

        setFirstRoomId(pick);
      } catch {
        if (!alive) return;
        setFirstRoomId(FIRST_ROOM_FALLBACKS[0] ?? "sleep_basics");
      }
    })();

    return () => {
      alive = false;
    };
  }, [FIRST_ROOM_FALLBACKS]);

  const goFirstRoom = () => {
    if (firstRoomId) nav(`/room/${firstRoomId}`);
    else nav("/rooms");
  };

  // ---------------------------
  // Onboarding visibility (How it works)
  // ---------------------------
  const phase0New = !user?.id || !progressSummary.lastStudyAt || fmtInt(progressSummary.active30d) === 0;

  const phase2Collapse = !phase0New && (fmtInt(progressSummary.active30d) >= 5 || fmtInt(progressSummary.streak) >= 3);

  const phase3Hide = !phase0New && fmtInt(progressSummary.active30d) >= 10 && fmtInt(progressSummary.streak) >= 7;

  const [howOpen, setHowOpen] = useState<boolean>(true);

  useEffect(() => {
    setHowOpen(!phase2Collapse);
  }, [phase2Collapse]);

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "white",
  };

  // ✅ ONE centered frame: EVERYTHING must align to this
  const frame: React.CSSProperties = {
    maxWidth: PAGE_MAX,
    margin: "0 auto",
    padding: "12px 16px 220px", // space for fixed BottomMusicBar
  };

  // ✅ HERO WRAP — FULL BLEED INSIDE FRAME (touch both sides)
  const heroImgWrap: React.CSSProperties = {
    marginTop: 0,

    // Full-bleed (cancel frame padding)
    marginLeft: -16,
    marginRight: -16,
    width: "calc(100% + 32px)",

    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
    background: "white",
  };

  // ✅ IMPORTANT:
  // - objectFit: "contain" to NEVER cut words
  // - background white for clean letterbox if aspect ratio differs
  const heroImg: React.CSSProperties = {
    width: "100%",
    height: "clamp(260px, 30vw, 420px)",
    objectFit: "contain",
    display: "block",
    background: "white",
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

  const blockTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
    color: "rgba(15,15,15,0.90)",
    letterSpacing: -0.4,
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

  const primaryBtn: React.CSSProperties = {
    padding: "14px 22px",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(0, 128, 120, 0.78)",
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 210,
  };

  const secondaryBtn: React.CSSProperties = {
    padding: "14px 22px",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "rgba(255,255,255,0.85)",
    color: "rgba(0,0,0,0.72)",
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 320,
  };

  // ✅ Bottom dock mount responsibility (aligned to frame width)
  const bottomDockOuter: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 12,
    zIndex: 80,
    padding: "0 16px",
    pointerEvents: "none", // outer ignores clicks
  };

  const bottomDockInner: React.CSSProperties = {
    maxWidth: PAGE_MAX,
    margin: "0 auto",
    pointerEvents: "auto", // inner receives clicks
  };

  // ---------------------------
  // Progress card styles (text-only)
  // ---------------------------
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

  const progPill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 10px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.85)",
    fontWeight: 900,
    cursor: "pointer",
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
        {/* ✅ CONTENT ZOOM WRAPPER (NOT header, NOT BottomMusicBar) */}
        <div style={{ ...({ zoom: zoomScale } as any) }}>
          {/* BOX 2: HERO (BRAND IMAGE ONLY — NO OVERLAY TEXT) */}
          <div style={heroImgWrap} aria-label="Hero band">
            <img
              src={heroSrc}
              alt="Mercy Blade — English & Knowledge — Colors of Life"
              style={heroImg}
              loading="eager"
              decoding="async"
              onError={() => {
                setHeroIdx((i) => {
                  const next = i + 1;
                  return next < heroFallbacks.length ? next : i;
                });
              }}
            />
          </div>

          {/* ✅ HOME PROGRESS (TEXT ONLY; read-only view) */}
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
                <div style={{ ...p, marginTop: 8 }}>A quiet snapshot — what you’ve practiced recently.</div>
              </div>

              {user?.id ? (
                <button
                  type="button"
                  style={progPill}
                  onClick={() => nav("/account")}
                  aria-label="Go to account"
                  title="Account"
                >
                  Open account →
                </button>
              ) : (
                <button
                  type="button"
                  style={progPill}
                  onClick={() => nav("/signin")}
                  aria-label="Sign in to see progress"
                >
                  Sign in to see →
                </button>
              )}
            </div>

            {progressErr ? (
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 14,
                  border: "1px solid rgba(255,0,0,0.25)",
                  background: "rgba(255,255,255,0.7)",
                }}
              >
                <div style={{ fontWeight: 900, color: "rgba(120,0,0,0.80)" }}>Progress error</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "rgba(0,0,0,0.65)" }}>{progressErr}</div>
              </div>
            ) : null}

            <div style={progGrid}>
              <div style={progCard}>
                <div style={progLabel}>Streak</div>
                <div style={progBig}>
                  {progressLoading
                    ? "…"
                    : `${fmtInt(progressSummary.streak)} ${plural(fmtInt(progressSummary.streak), "day", "days")}`}
                </div>
                <div style={progSmall}>
                  {user?.id ? "How many days in a row you’ve studied." : "Sign in to track your streak."}
                </div>

                {/* ✅ Streak badge (soft) */}
                {user?.id ? (
                  <div style={progBadge} aria-label="Streak badge">
                    🔥 Streak:{" "}
                    {streakDays === null ? "—" : `${streakDays} ${plural(streakDays, "day", "days")}`}
                  </div>
                ) : null}
              </div>

              <div style={progCard}>
                <div style={progLabel}>Active days (30d)</div>
                <div style={progBig}>{progressLoading ? "…" : `${fmtInt(progressSummary.active30d)}`}</div>
                <div style={progSmall}>How many days you were active in the last 30 days.</div>
              </div>

              <div style={progCard}>
                <div style={progLabel}>Last activity</div>
                <div style={progBig}>{progressLoading ? "…" : progressSummary.lastStudyAt ? "Seen" : "—"}</div>
                <div style={progSmall}>
                  {progressSummary.lastStudyAt ? fmtDate(progressSummary.lastStudyAt) : "No recent study yet."}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={langTag}>VI</div>
              <h3 style={h3}>Tiến độ của bạn</h3>
              <div style={{ ...p, marginTop: 8 }}>Một bản tóm tắt nhẹ nhàng — bạn đã luyện tập gần đây như thế nào.</div>
            </div>
          </div>

          {/* BOX 3: CONTENT (TEXT-ONLY) */}
          <div style={band}>
            <h2 style={blockTitle}>A Gentle Companion for Your Whole Life</h2>
            <p style={p}>
              Mercy Blade is a bilingual (English–Vietnamese) companion for real life — health, emotions, money,
              relationships, work, and meaning.
            </p>
            <p style={p}>
              This is not a place to rush or perform. <br />
              It is a place to slow down, listen, and move forward one small step at a time.
            </p>
            <p style={p}>
              No pressure. <br />
              No judgment. <br />
              Only clarity, compassion, and steady growth.
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={{ ...primaryBtn, minWidth: 240 }} onClick={goFirstRoom}>
                👉 Enter your first room
              </button>
              <button type="button" style={{ ...secondaryBtn, minWidth: 240 }} onClick={() => nav("/rooms")}>
                👉 Browse all rooms
              </button>
            </div>

            <div style={{ height: 18 }} />

            <h2 style={blockTitle}>Người Đồng Hành Nhẹ Nhàng Cho Cả Cuộc Đời Bạn</h2>
            <p style={p}>
              Mercy Blade là ứng dụng song ngữ (Anh–Việt) đồng hành cùng đời sống thật — sức khỏe, cảm xúc, tiền bạc, mối
              quan hệ, công việc và ý nghĩa sống.
            </p>
            <p style={p}>
              Đây không phải nơi để chạy đua hay thể hiện. <br />
              Mà là nơi để chậm lại, lắng nghe, và tiến lên từng bước nhỏ.
            </p>
            <p style={p}>
              Không áp lực. <br />
              Không phán xét. <br />
              Chỉ có sự rõ ràng, dịu dàng và tiến bộ bền vững.
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={{ ...primaryBtn, minWidth: 240 }} onClick={goFirstRoom}>
                👉 Vào phòng đầu tiên
              </button>
              <button type="button" style={{ ...secondaryBtn, minWidth: 240 }} onClick={() => nav("/rooms")}>
                👉 Xem danh sách phòng
              </button>
            </div>

            {/* OLD COPY (KEPT — DO NOT DELETE)
              <h2 style={blockTitle}>A Gentle Companion for Your Whole Life</h2>
              <p style={p}>
                Mercy Blade is a bilingual (English–Vietnamese) companion for real life: health, emotions, money,
                relationships, career, and meaning. It is designed to be calm, human, and practical — a place you return
                to when life feels noisy.
              </p>
              <p style={p}>
                No pressure. No judgment. <br />
                Just clarity, compassion, and steps you can take today.
              </p>
              ...
            */}
          </div>

          {/* HOW IT WORKS (Phase-based: show / collapse / hide) */}
          {!phase3Hide ? (
            <div style={section}>
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
                  <h3 style={h3}>How Mercy Blade Works</h3>
                </div>

                {phase2Collapse ? (
                  <button
                    type="button"
                    style={{ ...progPill, padding: "8px 12px" }}
                    onClick={() => setHowOpen((v) => !v)}
                    aria-label="Toggle how it works"
                    title="Toggle"
                  >
                    {howOpen ? "Hide ↑" : "How it works →"}
                  </button>
                ) : null}
              </div>

              {howOpen ? (
                <>
                  <p style={p}>
                    You enter <b>rooms</b> — sleep, anxiety, money, relationships, work, resilience, and more.
                  </p>

                  <p style={p} />
                  <div style={{ ...p, marginTop: 12 }}>
                    Inside each room:
                    <ul style={{ marginTop: 10, marginBottom: 0, paddingLeft: 18, color: "rgba(0,0,0,0.70)" }}>
                      <li>You <b>read first</b></li>
                      <li>When ready, you <b>listen</b></li>
                      <li>When comfortable, you <b>repeat and shadow</b></li>
                    </ul>
                  </div>

                  <p style={p}>
                    You are not “studying English”. You are <b>living with it</b>, inside real thoughts and real
                    emotions.
                  </p>
                  <p style={p}>One card. One breath. One meaningful step.</p>

                  {phase0New ? (
                    <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button type="button" style={{ ...primaryBtn, minWidth: 240 }} onClick={goFirstRoom}>
                        👉 Enter your first room
                      </button>
                      <button type="button" style={{ ...secondaryBtn, minWidth: 240 }} onClick={() => nav("/rooms")}>
                        👉 Browse all rooms
                      </button>
                    </div>
                  ) : null}

                  <div style={{ ...langTag, marginTop: 16 }}>VI</div>
                  <h3 style={h3}>Cách Mercy Blade Hoạt Động</h3>

                  <p style={p}>
                    Bạn bước vào các <b>phòng</b> — giấc ngủ, lo âu, tiền bạc, mối quan hệ, công việc, sức bền tinh
                    thần…
                  </p>

                  <div style={{ ...p, marginTop: 12 }}>
                    Trong mỗi phòng:
                    <ul style={{ marginTop: 10, marginBottom: 0, paddingLeft: 18, color: "rgba(0,0,0,0.70)" }}>
                      <li>Bạn <b>đọc trước</b></li>
                      <li>Khi sẵn sàng, bạn <b>nghe</b></li>
                      <li>Khi thoải mái, bạn <b>lặp lại và nói theo</b></li>
                    </ul>
                  </div>

                  <p style={p}>
                    Bạn không “học tiếng Anh” theo nghĩa thông thường. Bạn <b>sống cùng nó</b>, trong suy nghĩ và cảm xúc
                    thật.
                  </p>
                  <p style={p}>Một thẻ. Một hơi thở. Một bước có ý nghĩa.</p>

                  {phase0New ? (
                    <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button type="button" style={{ ...primaryBtn, minWidth: 240 }} onClick={goFirstRoom}>
                        👉 Vào phòng đầu tiên
                      </button>
                      <button type="button" style={{ ...secondaryBtn, minWidth: 240 }} onClick={() => nav("/rooms")}>
                        👉 Xem danh sách phòng
                      </button>
                    </div>
                  ) : null}

                  {/* OLD COPY (KEPT — DO NOT DELETE)
                    <p style={p}>
                      You enter <b>rooms</b> (sleep, anxiety, money, relationships, work…). Inside each room are small
                      bilingual cards. You read first. When ready, you listen <b>inside the room</b>. Learning English and
                      caring for yourself happen at the same time.
                    </p>
                    <p style={p}>One card. One breath. One step.</p>
                  */}
                </>
              ) : (
                <div style={{ ...p, marginTop: 10 }}>
                  One card. One breath. One meaningful step.{" "}
                  <span style={{ fontWeight: 800, color: "rgba(0,0,0,0.72)" }}>Open if you need a reminder.</span>
                </div>
              )}
            </div>
          ) : null}

          {/* MERCY HOST (TEXT-ONLY) */}
          <div style={section}>
            <div style={langTag}>EN</div>
            <h3 style={h3}>Mercy Host — A Caring Presence</h3>
            <p style={p}>Mercy Host is a quiet guide that stays with you.</p>
            <p style={p}>
              It knows which room you are in. <br />
              It knows what you are practicing. <br />
              It helps you slow down — or continue — when the moment is right.
            </p>
            <p style={p}>Over time, Mercy Host remembers your journey and supports your progress.</p>

            <div style={{ ...langTag, marginTop: 16 }}>VI</div>
            <h3 style={h3}>Mercy Host — Người Hướng Dẫn Dịu Dàng</h3>
            <p style={p}>Mercy Host là người hướng dẫn yên lặng nhưng luôn ở đó.</p>
            <p style={p}>
              Mercy Host biết bạn đang ở phòng nào. <br />
              Biết bạn đang luyện điều gì. <br />
              Giúp bạn chậm lại — hoặc tiếp tục — đúng lúc.
            </p>
            <p style={p}>Theo thời gian, Mercy Host ghi nhớ hành trình của bạn và nâng đỡ sự tiến bộ của bạn.</p>
          </div>

          {/* THE QUIET HOUR (TEXT-ONLY) */}
          <div style={section}>
            <div style={langTag}>EN</div>
            <h3 style={h3}>The Quiet Hour</h3>
            <p style={p}>When life feels loud, Mercy Blade offers a simple ritual:</p>
            <p style={p}>
              One minute. <br />
              One bilingual card. <br />
              One calm breath.
            </p>
            <p style={p}>
              You don’t force learning. <br />
              You let understanding arrive.
            </p>

            <div style={{ ...langTag, marginTop: 16 }}>VI</div>
            <h3 style={h3}>Giờ Lặng</h3>
            <p style={p}>Khi cuộc sống trở nên ồn ào, Mercy Blade mang đến một nghi thức đơn giản:</p>
            <p style={p}>
              Một phút. <br />
              Một thẻ song ngữ. <br />
              Một hơi thở yên tĩnh.
            </p>
            <p style={p}>
              Bạn không ép mình phải học. <br />
              Bạn để sự hiểu biết tự đến.
            </p>

            {/* OLD COPY (KEPT — DO NOT DELETE)
              <p style={p}>
                When life feels loud, Mercy Blade offers a simple ritual: one minute, one bilingual card, one breath — and
                you come back to yourself.
              </p>
              <p style={p}>
                Over time, these small moments become steady habits: clearer thinking, kinder inner talk, and English that
                grows naturally with emotional understanding.
              </p>
            */}
          </div>

          {/* FREE, AND GROWING WITH YOU (TEXT-ONLY) */}
          <div style={section}>
            <div style={langTag}>EN</div>
            <h3 style={h3}>Free, and Growing With You</h3>
            <p style={p}>Mercy Blade is free to begin.</p>
            <p style={p}>
              When you are ready to go deeper, you can choose to unlock more rooms and guidance — from <b>VIP 1</b> to{" "}
              <b>VIP 9</b>.
            </p>
            <p style={p}>
              No rush. <br />
              No obligation. <br />
              You move forward when <i>you</i> are ready.
            </p>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={{ ...primaryBtn, minWidth: 240 }} onClick={() => nav("/rooms")}>
                👉 Start free
              </button>
              <button type="button" style={{ ...secondaryBtn, minWidth: 240 }} onClick={() => nav("/tiers")}>
                👉 See learning paths
              </button>
            </div>

            <div style={{ ...langTag, marginTop: 16 }}>VI</div>
            <h3 style={h3}>Miễn Phí, và Lớn Lên Cùng Bạn</h3>
            <p style={p}>Mercy Blade miễn phí để bắt đầu.</p>
            <p style={p}>
              Khi bạn muốn đi sâu hơn, bạn có thể mở thêm phòng và sự hướng dẫn — từ <b>VIP 1</b> đến <b>VIP 9</b>.
            </p>
            <p style={p}>
              Không vội. <br />
              Không ép buộc. <br />
              Bạn tiến lên khi <i>bạn</i> sẵn sàng.
            </p>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={{ ...primaryBtn, minWidth: 240 }} onClick={() => nav("/rooms")}>
                👉 Bắt đầu miễn phí
              </button>
              <button type="button" style={{ ...secondaryBtn, minWidth: 240 }} onClick={() => nav("/tiers")}>
                👉 Xem lộ trình học
              </button>
            </div>
          </div>

          {/* CTA BAND */}
          <div style={ctaBand}>
            <h2 style={ctaTitle}>Start gently — one room at a time.</h2>
            <div style={ctaSub}>Bắt đầu nhẹ nhàng — từng phòng một.</div>

            <div style={ctaRow}>
              <button type="button" style={primaryBtn} onClick={() => nav("/rooms")}>
                👉 Start free
              </button>

              <button type="button" style={secondaryBtn} onClick={() => nav("/tiers")}>
                👉 See learning paths
              </button>

              {/* Existing CTA (KEPT) */}
              <button type="button" style={secondaryBtn} onClick={() => nav("/redeem")}>
                🎁&nbsp; Redeem Gift Code / Nhập Mã Quà Tặng
              </button>
            </div>

            {/* OLD COPY (KEPT — DO NOT DELETE)
              <h2 style={ctaTitle}>Ready to begin your journey?</h2>
              <div style={ctaSub}>Sẵn sàng bắt đầu hành trình của bạn?</div>
              <div style={ctaRow}>
                <button type="button" style={primaryBtn} onClick={() => nav("/rooms")}>
                  Get Started &nbsp; →
                </button>
                <button type="button" style={secondaryBtn} onClick={() => nav("/redeem")}>
                  🎁&nbsp; Redeem Gift Code / Nhập Mã Quà Tặng
                </button>
              </div>
            */}
          </div>
        </div>
      </div>

      {/* ✅ MUSIC (ENTERTAINMENT) — mounted FIXED but aligned to the same frame width */}
      <div style={bottomDockOuter} aria-label="Bottom music dock">
        <div style={bottomDockInner}>
          <BottomMusicBar />
        </div>
      </div>
    </div>
  );
}

/* Teacher GPT – new thing to learn:
   The fastest way to fix “one page sticks out” is to remove page-specific headers.
   One global header = one frame = no drift. */
