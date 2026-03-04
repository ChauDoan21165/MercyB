// src/pages/AllRooms.tsx
// MB-BLUE-98.3 — 2025-12-30 (+0700)
//
// ROLE (LOCKED):
// - This is /rooms (browse rooms / utility page)
// - Home front door is / (src/pages/Home.tsx)
//
// NOTE:
// UI-only. No new deps. No data fetch (for now).
//
// PATCH (2026-03-03):
// - Remove "HOME OK (moved to /rooms)" baseline debug message.
// - Keep /rooms as a simple utility page with quick links (no fetch).

import React from "react";
import { Link } from "react-router-dom";

export default function AllRooms() {
  return (
    <div className="min-h-screen w-full" data-mb-scope="rooms">
      <style>{`
        [data-mb-scope="rooms"] .mb-shell{
          max-width: 1100px;
          margin: 0 auto;
          padding: 18px 18px 60px;
        }

        [data-mb-scope="rooms"] .mb-top{
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:12px;
          margin-bottom: 14px;
        }

        [data-mb-scope="rooms"] .mb-card{
          border-radius: 22px;
          border: 1px solid rgba(0,0,0,0.10);
          background:
            radial-gradient(1200px 600px at 10% 10%, rgba(255, 105, 180, 0.10), transparent 55%),
            radial-gradient(900px 500px at 90% 20%, rgba(0, 200, 255, 0.10), transparent 55%),
            radial-gradient(900px 500px at 30% 90%, rgba(140, 255, 120, 0.10), transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,255,255,0.88));
          box-shadow: 0 18px 55px rgba(0,0,0,0.08);
          padding: 22px;
        }

        [data-mb-scope="rooms"] .mb-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 10px 14px;
          border-radius: 14px;
          font-weight: 700;
          border: 1px solid rgba(0,0,0,0.12);
          background: rgba(255,255,255,0.85);
          text-decoration:none;
          transition: transform 120ms ease, box-shadow 120ms ease;
        }
        [data-mb-scope="rooms"] .mb-btn:hover{
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(0,0,0,0.10);
        }

        [data-mb-scope="rooms"] .mb-grid{
          display:grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
          margin-top: 14px;
        }

        [data-mb-scope="rooms"] .mb-item{
          border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.85);
          padding: 14px 14px;
        }

        [data-mb-scope="rooms"] .mb-itemTitle{
          font-weight: 800;
        }

        [data-mb-scope="rooms"] .mb-itemDesc{
          margin-top: 6px;
          font-size: 13px;
          opacity: 0.78;
          line-height: 1.45;
        }
      `}</style>

      <div className="mb-shell">
        <div className="mb-top">
          <div>
            <div className="text-xs text-muted-foreground font-semibold">Mercy Blade • Utility</div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold">Rooms</h1>
            <div className="text-sm text-muted-foreground mt-1">Browse / debug / quick entry points.</div>
          </div>

          <div className="flex gap-2">
            <Link className="mb-btn" to="/">
              Home
            </Link>
            <Link className="mb-btn" to="/pricing">
              Pricing
            </Link>
            <Link className="mb-btn" to="/tiers">
              Tier Map
            </Link>
          </div>
        </div>

        <div className="mb-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold opacity-80">Quick links</div>
              <div className="text-xs opacity-70 mt-1">This page is UI-only (no room fetch yet).</div>
            </div>

            <a href="/signin" className="text-sm underline">
              Sign in
            </a>
          </div>

          <div className="mb-grid">
            <div className="mb-item">
              <div className="mb-itemTitle">Go to Home</div>
              <div className="mb-itemDesc">Front door page (/) with hero + progress cards.</div>
              <div className="mt-3">
                <Link className="mb-btn" to="/">
                  Open Home →
                </Link>
              </div>
            </div>

            <div className="mb-item">
              <div className="mb-itemTitle">Pricing</div>
              <div className="mb-itemDesc">See subscription tiers and upgrade options.</div>
              <div className="mt-3">
                <Link className="mb-btn" to="/pricing">
                  Open Pricing →
                </Link>
              </div>
            </div>

            <div className="mb-item">
              <div className="mb-itemTitle">Tier Map</div>
              <div className="mb-itemDesc">Learning paths / tiers overview.</div>
              <div className="mt-3">
                <Link className="mb-btn" to="/tiers">
                  Explore tiers →
                </Link>
              </div>
            </div>

            <div className="mb-item">
              <div className="mb-itemTitle">All rooms</div>
              <div className="mb-itemDesc">Main browsing page (when room list UI is enabled).</div>
              <div className="mt-3">
                <Link className="mb-btn" to="/rooms">
                  Refresh /rooms →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs opacity-70">
            Note: the old “HOME OK (moved to /rooms)” debug banner was removed.
          </div>
        </div>
      </div>
    </div>
  );
}

/** New thing to learn:
 * A “front door” (/) and a “utility page” (/rooms) serve different jobs — don’t mix them. */