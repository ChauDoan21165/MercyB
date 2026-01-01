// src/components/home/HomeHero.tsx
// MB-BLUE-100.5 — 2026-01-01 (+0700)
/**
 * HomeHero — HOME PAGE HERO (AUTHORITATIVE)
 *
 * ✅ FIX (MB-BLUE-100.5):
 * - Use the real hero image: /hero/hero_band.jpg (public/hero/hero_band.jpg)
 * - Render hero TEXT on top of the image (overlay + plate → always readable)
 * - Keep Home.tsx stable: Home can continue to render <HomeHero /> unchanged
 *
 * NOTE:
 * - This is HOME hero, not ChatHub (/room/:roomId).
 */

import React from "react";

export default function HomeHero({
  title = "English & Knowledge",
  subtitle = "Colors of Life",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section data-mb-home-hero aria-label="Home hero">
      <style>{`
        [data-mb-home-hero] .wrap{
          width: 100%;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.10);
          box-shadow: 0 18px 44px rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.70);
          position: relative;
        }

        [data-mb-home-hero] .img{
          width: 100%;
          height: clamp(170px, 26vw, 260px);
          object-fit: cover;
          display: block;
        }

        /* darker overlay → text always readable even on bright sky */
        [data-mb-home-hero] .overlay{
          position:absolute;
          inset: 0;
          background: linear-gradient(180deg,
            rgba(0,0,0,0.06) 0%,
            rgba(0,0,0,0.12) 35%,
            rgba(0,0,0,0.55) 100%);
        }

        /* text anchored (hero band feel) */
        [data-mb-home-hero] .text{
          position:absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          display:flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        /* plate guarantees readability */
        [data-mb-home-hero] .plate{
          max-width: 92%;
          padding: 14px 16px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(0,0,0,0.28);
          backdrop-filter: blur(10px);
        }

        [data-mb-home-hero] .title{
          margin: 0;
          color: rgba(255,255,255,0.98);
          text-shadow: 0 10px 28px rgba(0,0,0,0.45);
          font-weight: 950;
          letter-spacing: -0.9px;
          font-size: clamp(34px, 5.2vw, 58px);
          line-height: 1.05;
        }

        [data-mb-home-hero] .sub{
          margin-top: 8px;
          color: rgba(255,255,255,0.92);
          text-shadow: 0 8px 22px rgba(0,0,0,0.35);
          font-weight: 850;
          letter-spacing: -0.2px;
          font-size: clamp(13px, 1.6vw, 15px);
        }

        [data-mb-home-hero] .badges{
          margin-top: 10px;
          display:flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        [data-mb-home-hero] .badge{
          font-size: 12px;
          font-weight: 900;
          padding: 6px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.26);
          background: rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.92);
          white-space: nowrap;
        }
      `}</style>

      <div className="wrap">
        <img
          className="img"
          src="/hero/hero_band.jpg"
          alt="Mercy Blade hero"
          loading="eager"
        />
        <div className="overlay" />
        <div className="text">
          <div className="plate">
            <h1 className="title">{title}</h1>
            <div className="sub">{subtitle}</div>
            <div className="badges" aria-label="Hero badges">
              <span className="badge">Audio-first</span>
              <span className="badge">Bilingual</span>
              <span className="badge">Free → VIP9</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
