import React from "react";

/**
 * HeroBand — UI-only
 * Uses public asset: /hero/hero_band.jpg  (file: public/hero/hero_band.jpg)
 */
export default function HeroBand({
  title = "Mercy Blade",
  subtitle = "Rooms • Audio-first • Free → VIP9",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div data-mb-hero className="mb-5">
      <style>{`
        [data-mb-hero] .hero{
          position: relative;
          width: 100%;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.10);
          box-shadow: 0 16px 40px rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.6);
        }
        [data-mb-hero] .img{
          width: 100%;
          height: clamp(130px, 22vw, 190px);
          object-fit: cover;
          display: block;
        }
        [data-mb-hero] .overlay{
          position:absolute;
          inset: 0;
          background: linear-gradient(180deg,
            rgba(0,0,0,0.10) 0%,
            rgba(0,0,0,0.22) 45%,
            rgba(0,0,0,0.55) 100%);
        }
        [data-mb-hero] .text{
          position:absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          display:flex;
          flex-direction: column;
          gap: 6px;
          align-items: flex-start;
        }
        [data-mb-hero] .plate{
          display:inline-flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(0,0,0,0.28);
          backdrop-filter: blur(10px);
          max-width: 92%;
        }
        [data-mb-hero] .title{
          color: rgba(255,255,255,0.98);
          text-shadow: 0 6px 18px rgba(0,0,0,0.45);
          font-weight: 950;
          letter-spacing: -0.8px;
          font-size: clamp(28px, 4.2vw, 44px);
          line-height: 1.05;
        }
        [data-mb-hero] .sub{
          color: rgba(255,255,255,0.92);
          text-shadow: 0 6px 18px rgba(0,0,0,0.35);
          font-weight: 850;
          letter-spacing: -0.2px;
          font-size: clamp(12px, 1.4vw, 14px);
        }
        [data-mb-hero] .badgeRow{
          margin-top: 2px;
          display:flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        [data-mb-hero] .badge{
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

      <div className="hero" aria-label="Hero band">
        <img
          className="img"
          src="/hero/hero_band.jpg"
          alt="Hero band"
          loading="eager"
        />
        <div className="overlay" />
        <div className="text">
          <div className="plate">
            <div className="title">{title}</div>
            <div className="sub">{subtitle}</div>
            <div className="badgeRow">
              <span className="badge">Audio-first</span>
              <span className="badge">Rooms</span>
              <span className="badge">Free → VIP9</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
