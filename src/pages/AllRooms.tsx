// src/pages/AllRooms.tsx
// MB-BLUE-97.9 — 2025-12-29 (+0700)
//
// HOME RULE (LOCKED):
// - Home must not be "blank debug text only".
// - Add HERO BAND (Mercy Blade rainbow wash + title + tagline + CTA).
// - Keep baseline HOME OK block below (so you can still verify routing stability fast).
//
// NOTE:
// This is UI-only. No new deps. No data fetch.

import React from "react";
import { Link } from "react-router-dom";

export default function AllRooms() {
  return (
    <div className="min-h-screen w-full" data-mb-scope="home">
      {/* Mercy Blade HERO BAND (scoped, no global CSS risk) */}
      <style>{`
        [data-mb-scope="home"] .mb-hero{
          position: relative;
          overflow: hidden;
          border-radius: 26px;
          padding: 34px 18px;
          margin: 18px auto 18px;
          max-width: 1100px;
          background:
            radial-gradient(1200px 700px at 12% 18%, rgba(255, 105, 180, 0.18), transparent 55%),
            radial-gradient(900px 520px at 88% 22%, rgba(0, 200, 255, 0.18), transparent 55%),
            radial-gradient(900px 520px at 28% 88%, rgba(140, 255, 120, 0.18), transparent 55%),
            radial-gradient(700px 420px at 70% 72%, rgba(255, 215, 0, 0.14), transparent 58%),
            linear-gradient(180deg, rgba(15, 20, 30, 0.82), rgba(15, 20, 30, 0.74));
          box-shadow: 0 24px 70px rgba(0,0,0,0.22);
          backdrop-filter: blur(10px);
        }

        [data-mb-scope="home"] .mb-hero::before{
          content: "";
          position: absolute;
          inset: -2px;
          background: radial-gradient(900px 400px at 50% 35%, rgba(255,255,255,0.20), transparent 60%);
          pointer-events: none;
        }

        [data-mb-scope="home"] .mb-brand{
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
        }

        [data-mb-scope="home"] .mb-brand span{
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-image: linear-gradient(90deg,#ff3b3b,#ffd700,#00d084,#00c2ff,#6f5bff,#ff4fd8);
          text-shadow: 0 10px 35px rgba(0,0,0,0.25);
        }

        [data-mb-scope="home"] .mb-hero-sub{
          color: rgba(255,255,255,0.88);
          max-width: 720px;
        }

        [data-mb-scope="home"] .mb-chip{
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.90);
          font-size: 12px;
          font-weight: 600;
        }

        [data-mb-scope="home"] .mb-ctaRow{
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        [data-mb-scope="home"] .mb-btn{
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 14px;
          border-radius: 14px;
          font-weight: 700;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.10);
          color: white;
          text-decoration: none;
          transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
        }

        [data-mb-scope="home"] .mb-btn:hover{
          transform: translateY(-1px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.22);
          background: rgba(255,255,255,0.14);
        }

        [data-mb-scope="home"] .mb-btnPrimary{
          border: none;
          background-image: linear-gradient(90deg,#ff3b3b,#ffd700,#00d084,#00c2ff,#6f5bff,#ff4fd8);
          color: rgba(10,12,16,0.92);
        }

        [data-mb-scope="home"] .mb-shell{
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 18px 50px;
        }

        [data-mb-scope="home"] .mb-baseline{
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 18px 40px;
        }

        [data-mb-scope="home"] .mb-baselineCard{
          border-radius: 22px;
          border: 1px solid rgba(0,0,0,0.10);
          background:
            radial-gradient(1200px 600px at 10% 10%, rgba(255, 105, 180, 0.10), transparent 55%),
            radial-gradient(900px 500px at 90% 20%, rgba(0, 200, 255, 0.10), transparent 55%),
            radial-gradient(900px 500px at 30% 90%, rgba(140, 255, 120, 0.10), transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.88));
          box-shadow: 0 18px 55px rgba(0,0,0,0.08);
          padding: 22px;
        }
      `}</style>

      <div className="mb-shell">
        <section className="mb-hero">
          <div className="relative">
            <div className="mb-chip">Mercy Blade • Colors of Life</div>

            <h1 className="mb-brand text-4xl md:text-6xl mt-4">
              <span>Mercy</span>{" "}
              <span>Blade</span>
            </h1>

            <p className="mb-hero-sub text-base md:text-lg mt-4">
              English & Knowledge — room-based learning + guidance.
              <br />
              Audio-first. Bilingual. Built for memory, not scrolling.
            </p>

            <div className="mb-ctaRow">
              <Link className="mb-btn mb-btnPrimary" to="/tiers">
                Explore tiers map
              </Link>

              <Link className="mb-btn" to="/room/english_writing_free">
                Try a room
              </Link>

              <a className="mb-btn" href="/signin">
                Sign in
              </a>
            </div>

            <div className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.72)" }}>
              Tip: The real “hero file” you showed (mercyblade.link) is a separate UI.
              This hero band recreates that vibe inside GitHub/Vercel app without importing extra assets.
            </div>
          </div>
        </section>
      </div>

      {/* Keep your baseline debug card (so you can still sanity-check routing fast) */}
      <div className="mb-baseline">
        <div className="mb-baselineCard">
          <a href="/signin" className="text-sm underline">
            Sign in
          </a>

          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-3">
            Mercy Blade — HOME OK
          </h2>

          <p className="mt-2 text-base">
            If you see this, React + routing are stable.
          </p>

          <div className="mt-3 text-sm opacity-80">Home v2025-12-25-BASELINE</div>
        </div>
      </div>
    </div>
  );
}

/** New thing to learn:
 * “Hero band” isn’t decoration—it's orientation: it tells users what system they’re in before they click anything. */
