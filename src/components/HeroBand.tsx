// src/components/HeroBand.tsx
// MB-BLUE-100.9 — 2026-01-02 (+0700)
/**
 * HERO BAND (LOCKED VISUAL):
 * - Background image: /hero/hero_band.jpg
 * - NO left overlay card / NO extra UI blocks inside the band.
 * - Center slogan (two lines):
 *     English & Knowledge
 *     Colors of Life
 * - Keep rounded corners + soft border/shadow.
 *
 * This component controls ONLY the hero band layout + text.
 * ChatHub/Home decide WHERE it is mounted (page ownership).
 *
 * ✅ FIX (100.9):
 * - Lower the centered slogan slightly (more top padding, less bottom padding)
 *   without breaking centering/responsiveness.
 */

import React from "react";

export default function HeroBand() {
  return (
    <section data-mb-hero className="mb-6">
      <style>{`
        [data-mb-hero]{
          width: 100%;
        }

        [data-mb-hero] .mb-heroShell{
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 26px;
          border: 1px solid rgba(0,0,0,0.10);
          box-shadow: 0 14px 34px rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.60);
        }

        /* background image */
        [data-mb-hero] .mb-heroBg{
          position: absolute;
          inset: 0;
          background-image: url("/hero/hero_band.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform: translateZ(0);
          filter: saturate(1.04);
        }

        /* subtle glass haze so text stays readable on all crops */
        [data-mb-hero] .mb-heroHaze{
          position: absolute;
          inset: 0;
          background:
            radial-gradient(900px 420px at 50% 50%, rgba(255,255,255,0.28), rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.00)),
            linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08));
          pointer-events: none;
        }

        /* content */
        [data-mb-hero] .mb-heroInner{
          position: relative;
          display: grid;
          place-items: center;
          text-align: center;

          /* ✅ push slogan slightly LOWER */
          padding: 56px 18px 34px;

          min-height: 168px;
        }

        [data-mb-hero] .mb-heroTitle{
          font-weight: 900;
          letter-spacing: -0.02em;
          color: rgba(10, 18, 35, 0.92);
          font-size: clamp(34px, 4.2vw, 56px);
          line-height: 1.08;
          margin: 0;
        }

        [data-mb-hero] .mb-heroSub{
          margin-top: 14px;
          font-weight: 800;
          color: rgba(10, 18, 35, 0.78);
          font-size: clamp(16px, 2.0vw, 28px);
          line-height: 1.2;
        }

        @media (max-width: 640px){
          [data-mb-hero] .mb-heroInner{
            /* ✅ keep the same "lower" feeling on mobile */
            padding: 42px 14px 24px;
            min-height: 140px;
          }
          [data-mb-hero] .mb-heroSub{
            margin-top: 10px;
          }
        }
      `}</style>

      <div className="mb-heroShell">
        <div className="mb-heroBg" aria-hidden="true" />
        <div className="mb-heroHaze" aria-hidden="true" />

        {/* ✅ Center slogan only (no left square / no extra blocks) */}
        <div className="mb-heroInner">
          <div>
            <h2 className="mb-heroTitle">English &amp; Knowledge</h2>
            <div className="mb-heroSub">Colors of Life</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* New thing to learn:
   If a band is “brand only”, keep it pure: background + centered text.
   Put all other UI (cards/controls) outside the band to avoid layout fights. */
