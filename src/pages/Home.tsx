// src/pages/Home.tsx
// MB-BLUE-100.9 — 2026-01-01 (+0700)
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
// - ✅ HERO TEXT POSITION:
//   - Move the hero words DOWN (bottom aligned) inside the hero image
//   - Keep it centered horizontally, but sit near the bottom like your screenshot target

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BottomMusicBar from "@/components/audio/BottomMusicBar";

const PAGE_MAX = 980;

const rainbow =
  "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

const heroBg =
  "radial-gradient(900px 260px at 50% 40%, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.50) 50%, rgba(255,255,255,0.10) 100%), " +
  "linear-gradient(120deg, rgba(255,77,77,0.20), rgba(184,77,255,0.18), rgba(77,184,255,0.18), rgba(77,255,184,0.18), rgba(182,255,77,0.18), rgba(255,184,77,0.18))";

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

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "white",
  };

  // ✅ ONE centered frame: EVERYTHING must align to this
  const frame: React.CSSProperties = {
    maxWidth: PAGE_MAX,
    margin: "0 auto",
    padding: "16px 16px 220px", // space for fixed BottomMusicBar
  };

  const headerSticky: React.CSSProperties = {
    position: "sticky",
    top: 12,
    zIndex: 40,
    marginBottom: 16,
  };

  // ✅ Header is a BOX (not full-bleed)
  const headerBox: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.90)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    padding: "12px 12px",
  };

  // ✅ TRUE CENTER header: 3-column grid (left spacer | centered brand | right buttons)
  const headerGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  };

  const headerLeftSpacer: React.CSSProperties = {
    gridColumn: 1,
    minWidth: 0,
  };

  const brandCenter: React.CSSProperties = {
    gridColumn: 2,
    fontWeight: 900,
    letterSpacing: -0.8,
    display: "flex",
    alignItems: "baseline",
    gap: 10,
    userSelect: "none",
    minWidth: 0,
  };

  // ✅ doubled visual size vs old header
  const brandMercy: React.CSSProperties = {
    fontSize: 44,
    background: rainbow,
    WebkitBackgroundClip: "text",
    color: "transparent",
    whiteSpace: "nowrap",
    lineHeight: 1,
  };

  const brandBlade: React.CSSProperties = {
    fontSize: 44,
    color: "rgba(0,0,0,0.72)",
    whiteSpace: "nowrap",
    lineHeight: 1,
  };

  const headerRight: React.CSSProperties = {
    gridColumn: 3,
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

  const hero: React.CSSProperties = {
    marginTop: 0,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: heroBg,
    overflow: "hidden",
  };

  const heroInner: React.CSSProperties = {
    padding: "70px 16px",
    textAlign: "center",
  };

  const heroTitle: React.CSSProperties = {
    fontSize: 58,
    lineHeight: 1.05,
    margin: 0,
    fontWeight: 900,
    letterSpacing: -1.2,
    color: "rgba(0,0,0,0.82)",
  };

  const heroSub: React.CSSProperties = {
    marginTop: 12,
    fontSize: 22,
    color: "rgba(0,0,0,0.62)",
    fontWeight: 700,
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

  // ✅ HERO (IMAGE + CENTERED WORDS) — NO BOX / NO PLATE / NO BADGES
  const heroImgWrap: React.CSSProperties = {
    marginTop: 0,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.6)",
  };

  const heroImg: React.CSSProperties = {
    width: "100%",
    height: "clamp(170px, 22vw, 240px)",
    objectFit: "cover",
    display: "block",
  };

  // very light vignette so black text stays readable without looking like a box
  const heroOverlay: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(650px 220px at 50% 45%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 45%, rgba(0,0,0,0.14) 100%)",
    pointerEvents: "none",
  };

  // ✅ 100.9: Bottom-align the hero text block (still centered horizontally)
  const heroCenter: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "flex-end", // ⬇️ move down
    justifyContent: "center",
    textAlign: "center",
    padding: "18px",
    paddingBottom: 34, // ⬇️ tune this number if you want even lower/higher
    pointerEvents: "none",
  };

  // BLACK text, no plate; soft glow for readability
  const heroImgTitle: React.CSSProperties = {
    fontSize: 58,
    lineHeight: 1.05,
    margin: 0,
    fontWeight: 900,
    letterSpacing: -1.2,
    color: "rgba(0,0,0,0.78)",
    textShadow: "0 2px 14px rgba(255,255,255,0.55)",
  };

  const heroImgSub: React.CSSProperties = {
    marginTop: 12,
    fontSize: 22,
    color: "rgba(0,0,0,0.60)",
    fontWeight: 700,
    textShadow: "0 2px 12px rgba(255,255,255,0.55)",
  };

  return (
    <div style={wrap}>
      <div style={frame}>
        {/* BOX 1: HEADER (inside frame, no stick-out) */}
        <div style={headerSticky}>
          <div style={headerBox}>
            <div style={headerGrid}>
              <div style={headerLeftSpacer} />

              <Link to="/" style={{ textDecoration: "none" }}>
                <div style={brandCenter}>
                  <span style={brandMercy}>Mercy</span>
                  <span style={brandBlade}>Blade</span>
                </div>
              </Link>

              <div style={headerRight}>
                <button
                  type="button"
                  style={btn}
                  onClick={() => nav("/signin")}
                  aria-label="Sign in"
                >
                  Sign in / Đăng nhập
                </button>

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
        <div
          style={{
            // Chrome/Edge: zoom scales px-based design correctly
            // TS doesn’t include "zoom" in CSSProperties in strict mode → cast
            ...({ zoom: zoomScale } as any),
          }}
        >
          {/* BOX 2: HERO (REPLACED ONLY THIS BOX) */}
          <div style={heroImgWrap} aria-label="Hero band">
            <img
              src="/hero/hero_band.jpg"
              alt="Hero band"
              style={heroImg}
              loading="eager"
            />
            <div style={heroOverlay} />
            <div style={heroCenter}>
              <div>
                <h1 style={heroImgTitle}>English &amp; Knowledge</h1>
                <div style={heroImgSub}>Colors of Life</div>
              </div>
            </div>
          </div>

          {/* BOX 3: CONTENT (TEXT-ONLY) */}
          <div style={band}>
            <h2 style={blockTitle}>A Gentle Companion for Your Whole Life</h2>
            <p style={p}>
              Mercy Blade is a bilingual (English–Vietnamese) companion for real
              life: health, emotions, money, relationships, career, and meaning.
              It is designed to be calm, human, and practical — a place you
              return to when life feels noisy.
            </p>
            <p style={p}>
              No pressure. No judgment. <br />
              Just clarity, compassion, and steps you can take today.
            </p>

            <div style={{ height: 14 }} />

            <h2 style={blockTitle}>Người Đồng Hành Nhẹ Nhàng Cho Cả Cuộc Đời Bạn</h2>
            <p style={p}>
              Mercy Blade là ứng dụng song ngữ (Anh–Việt) đồng hành cùng bạn trong
              đời sống thật: sức khỏe, cảm xúc, tiền bạc, mối quan hệ, công việc
              và ý nghĩa sống. Đây là một không gian nhẹ nhàng, thực tế — nơi bạn
              quay về khi cuộc sống trở nên ồn ào.
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
              <button
                type="button"
                style={primaryBtn}
                onClick={() => nav("/rooms")}
              >
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
   If you want “move down” without changing layout size, keep the text centered (justifyContent)
   but bottom-align the flex container (alignItems: flex-end) + paddingBottom. */
