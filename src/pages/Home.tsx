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

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomMusicBar from "@/components/audio/BottomMusicBar";
import { useAuth } from "@/providers/AuthProvider";

const PAGE_MAX = 980;
const softPanel = "rgba(230, 244, 255, 0.85)";

// ✅ must match BottomMusicBar key (LOCKED)
const LS_ZOOM = "mb.ui.zoom";

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
  // Put the intended file in ONE of these:
  // - public/hero/hero_mercyblade_brand.jpg
  // - public/hero_mercyblade_brand.jpg
  // - public/hero/hero_mercyblade_brand.png (etc)
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

  const headerSticky: React.CSSProperties = {
    position: "sticky",
    top: 10,
    zIndex: 40,
    marginBottom: 12,
  };

  // ✅ Header is THIN (no Home button, no email text)
  const headerBox: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.90)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
    padding: "8px 10px",
  };

  // ✅ Simple header grid: left spacer | right actions (keeps it thin)
  const headerGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  };

  const headerRight: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    minWidth: 0,
    flexWrap: "wrap",
  };

  const btn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "white",
    cursor: "pointer",
    fontWeight: 800,
    flex: "0 0 auto",
    whiteSpace: "nowrap",
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
  // - Hero image already contains "Mercy Blade / English & Knowledge / Colors of Life"
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

  return (
    <div style={wrap}>
      <div style={frame}>
        {/* BOX 1: HEADER (THIN, NO HOME BUTTON, NO EMAIL TEXT) */}
        <div style={headerSticky}>
          <div style={headerBox}>
            <div style={headerGrid}>
              <div /> {/* left spacer */}

              <div style={headerRight}>
                {!isLoading && user ? (
                  <button
                    type="button"
                    style={btn}
                    onClick={handleSignOut}
                    aria-label="Sign out"
                  >
                    Sign out / Đăng xuất
                  </button>
                ) : (
                  <button
                    type="button"
                    style={btn}
                    onClick={() => nav("/signin")}
                    aria-label="Sign in"
                    disabled={isLoading}
                    title={isLoading ? "Loading..." : undefined}
                  >
                    Sign in / Đăng nhập
                  </button>
                )}

                <button
                  type="button"
                  style={btn}
                  onClick={() => nav("/tiers")}
                  aria-label="Tier Map"
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 9999,
                      background: "rgba(0,0,0,0.65)",
                    }}
                  />
                  Tier Map / Bản đồ app
                </button>
              </div>
            </div>
          </div>
        </div>

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

          {/* BOX 3: CONTENT (TEXT-ONLY) */}
          <div style={band}>
            <h2 style={blockTitle}>A Gentle Companion for Your Whole Life</h2>
            <p style={p}>
              Mercy Blade is a bilingual (English–Vietnamese) companion for real
              life: health, emotions, money, relationships, career, and meaning. It
              is designed to be calm, human, and practical — a place you return to
              when life feels noisy.
            </p>
            <p style={p}>
              No pressure. No judgment. <br />
              Just clarity, compassion, and steps you can take today.
            </p>

            <div style={{ height: 14 }} />

            <h2 style={blockTitle}>Người Đồng Hành Nhẹ Nhàng Cho Cả Cuộc Đời Bạn</h2>
            <p style={p}>
              Mercy Blade là ứng dụng song ngữ (Anh–Việt) đồng hành cùng bạn trong
              đời sống thật: sức khỏe, cảm xúc, tiền bạc, mối quan hệ, công việc và
              ý nghĩa sống. Đây là một không gian nhẹ nhàng, thực tế — nơi bạn quay
              về khi cuộc sống trở nên ồn ào.
            </p>
            <p style={p}>
              Không áp lực. Không phán xét. <br />
              Chỉ là sự rõ ràng, dịu dàng và những bước bạn có thể làm ngay.
            </p>
          </div>

          <div style={section}>
            <div style={langTag}>EN</div>
            <h3 style={h3}>How Mercy Blade Works</h3>
            <p style={p}>
              You enter <b>rooms</b> (sleep, anxiety, money, relationships, work…).
              Inside each room are small bilingual cards. You read first. When
              ready, you listen <b>inside the room</b>. Learning English and caring
              for yourself happen at the same time.
            </p>
            <p style={p}>One card. One breath. One step.</p>

            <div style={{ ...langTag, marginTop: 16 }}>VI</div>
            <h3 style={h3}>Cách Mercy Blade Hoạt Động</h3>
            <p style={p}>
              Bạn đi vào các <b>phòng</b> (giấc ngủ, lo âu, tiền bạc, mối quan hệ…).
              Mỗi phòng có các thẻ song ngữ nhỏ. Bạn đọc trước. Khi sẵn sàng, bạn
              nghe <b>bên trong phòng</b>. Học tiếng Anh và chăm sóc bản thân diễn
              ra song song.
            </p>
            <p style={p}>Một thẻ. Một hơi thở. Một bước nhỏ.</p>
          </div>

          <div style={section}>
            <div style={langTag}>EN</div>
            <h3 style={h3}>The Quiet Hour</h3>
            <p style={p}>
              When life feels loud, Mercy Blade offers a simple ritual: one minute,
              one bilingual card, one breath — and you come back to yourself.
            </p>
            <p style={p}>
              Over time, these small moments become steady habits: clearer thinking,
              kinder inner talk, and English that grows naturally with emotional
              understanding.
            </p>

            <div style={{ ...langTag, marginTop: 16 }}>VI</div>
            <h3 style={h3}>Giờ Lặng</h3>
            <p style={p}>
              Khi cuộc sống trở nên quá ồn, Mercy Blade mang đến một nghi thức rất
              đơn giản: một phút, một thẻ song ngữ, một hơi thở — và bạn trở về với
              chính mình.
            </p>
            <p style={p}>
              Theo thời gian, những khoảnh khắc nhỏ này tạo nên thói quen vững vàng:
              suy nghĩ sáng hơn, tự nói với mình dịu dàng hơn, và tiếng Anh phát
              triển một cách tự nhiên.
            </p>
          </div>

          {/* CTA BAND */}
          <div style={ctaBand}>
            <h2 style={ctaTitle}>Ready to begin your journey?</h2>
            <div style={ctaSub}>Sẵn sàng bắt đầu hành trình của bạn?</div>

            <div style={ctaRow}>
              <button type="button" style={primaryBtn} onClick={() => nav("/rooms")}>
                Get Started &nbsp; →
              </button>

              <button
                type="button"
                style={secondaryBtn}
                onClick={() => nav("/redeem")}
              >
                🎁&nbsp; Redeem Gift Code / Nhập Mã Quà Tặng
              </button>
            </div>
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

/* New thing to learn:
   If you see broken-icon + alt text, it’s a 404 path. This file auto-tries a list of common paths,
   and ALWAYS falls back to /hero/hero_band.jpg so you never get a blank hero. */