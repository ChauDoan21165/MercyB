// src/pages/TierMapPage.tsx
// MB-BLUE-98.2 — 2025-12-29 (+0700)
/**
 * TierMapPage (AUTHORITATIVE)
 * Shows tiers Free → VIP9 and lists rooms belonging to each tier.
 *
 * UI UPGRADE (LOCKED INTENT):
 * - Keep “control panel” scannable feel.
 * - Add Mercy Blade “hero band” at top (like your homepage).
 * - Add quick search + per-tier expand.
 * - Keep registry as truth (getRoomList()).
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getRoomList, type RoomMeta as FetcherRoomMeta } from "@/lib/roomFetcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type TierId =
  | "free"
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip7"
  | "vip8"
  | "vip9";

const TIERS: { id: TierId; label: string; hint?: string }[] = [
  { id: "free", label: "FREE", hint: "Core" },
  { id: "vip1", label: "VIP1", hint: "Core extension" },
  { id: "vip2", label: "VIP2", hint: "Core extension" },
  { id: "vip3", label: "VIP3", hint: "Core deep" },
  { id: "vip4", label: "VIP4", hint: "Career choosing" },
  { id: "vip5", label: "VIP5", hint: "Advanced English writing" },
  { id: "vip6", label: "VIP6", hint: "Psychology" },
  { id: "vip7", label: "VIP7", hint: "Reserved" },
  { id: "vip8", label: "VIP8", hint: "Reserved" },
  { id: "vip9", label: "VIP9", hint: "Strategy mindset" },
];

function normTier(t: any): TierId {
  const x = String(t || "free").toLowerCase().trim();
  if (x === "free") return "free";
  if (x === "vip1") return "vip1";
  if (x === "vip2") return "vip2";
  if (x === "vip3") return "vip3";
  if (x === "vip4") return "vip4";
  if (x === "vip5") return "vip5";
  if (x === "vip6") return "vip6";
  if (x === "vip7") return "vip7";
  if (x === "vip8") return "vip8";
  if (x === "vip9") return "vip9";
  return "free";
}

function titleOf(r: any) {
  return r?.title_en || r?.title_vi || r?.title || r?.id || "Untitled";
}

function matchRoom(r: FetcherRoomMeta, qRaw: string) {
  const q = String(qRaw || "").trim().toLowerCase();
  if (!q) return true;
  const hay = [
    String((r as any)?.id || ""),
    String(titleOf(r)),
    String((r as any)?.title_en || ""),
    String((r as any)?.title_vi || ""),
    Array.isArray((r as any)?.keywords_en) ? (r as any).keywords_en.join(" ") : "",
    Array.isArray((r as any)?.keywords_vi) ? (r as any).keywords_vi.join(" ") : "",
  ]
    .join(" • ")
    .toLowerCase();
  return hay.includes(q);
}

export default function TierMapPage() {
  const [rooms, setRooms] = useState<FetcherRoomMeta[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<TierId, boolean>>({
    free: true,
    vip1: false,
    vip2: false,
    vip3: false,
    vip4: false,
    vip5: false,
    vip6: false,
    vip7: false,
    vip8: false,
    vip9: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await getRoomList();
        if (!cancelled) setRooms(Array.isArray(list) ? list : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const map: Record<TierId, FetcherRoomMeta[]> = {
      free: [],
      vip1: [],
      vip2: [],
      vip3: [],
      vip4: [],
      vip5: [],
      vip6: [],
      vip7: [],
      vip8: [],
      vip9: [],
    };

    for (const r of rooms) {
      const tier = normTier((r as any)?.tier);
      map[tier].push(r);
    }

    for (const k of Object.keys(map) as TierId[]) {
      map[k].sort((a, b) => String(titleOf(a)).localeCompare(String(titleOf(b))));
    }

    return map;
  }, [rooms]);

  const filteredGrouped = useMemo(() => {
    const out: Record<TierId, FetcherRoomMeta[]> = {
      free: [],
      vip1: [],
      vip2: [],
      vip3: [],
      vip4: [],
      vip5: [],
      vip6: [],
      vip7: [],
      vip8: [],
      vip9: [],
    };

    for (const t of TIERS) {
      out[t.id] = grouped[t.id].filter((r) => matchRoom(r, query));
    }

    return out;
  }, [grouped, query]);

  const totalVisible = useMemo(() => {
    let n = 0;
    for (const t of TIERS) n += filteredGrouped[t.id].length;
    return n;
  }, [filteredGrouped]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <style>{`
        /* HERO BAND — matches your homepage vibe (soft rainbow, centered title) */
        .mb-hero {
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.10);
          background:
            radial-gradient(900px 520px at 15% 25%, rgba(255, 105, 180, 0.16), transparent 55%),
            radial-gradient(900px 520px at 85% 30%, rgba(0, 200, 255, 0.16), transparent 55%),
            radial-gradient(900px 520px at 30% 90%, rgba(140, 255, 120, 0.16), transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.82));
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          backdrop-filter: blur(10px);
        }
        .mb-hero-inner{
          padding: 26px 18px;
        }
        @media (min-width: 768px){
          .mb-hero-inner{ padding: 34px 26px; }
        }
        .mb-hero-title{
          font-size: 34px;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        @media (min-width: 768px){
          .mb-hero-title{ font-size: 46px; }
        }
        .mb-hero-sub{
          color: rgba(0,0,0,0.60);
        }

        /* CONTROL STRIP */
        .mb-controls{
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .mb-search{
          flex: 1 1 340px;
          min-width: 240px;
          border: 1px solid rgba(0,0,0,0.14);
          background: rgba(255,255,255,0.70);
          border-radius: 999px;
          padding: 10px 14px;
          outline: none;
        }
        .mb-search:focus{
          border-color: rgba(0,0,0,0.25);
          box-shadow: 0 10px 26px rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.92);
        }
        .mb-pill{
          border: 1px solid rgba(0,0,0,0.12);
          background: rgba(255,255,255,0.70);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          color: rgba(0,0,0,0.70);
        }
        .mb-btn{
          border: 1px solid rgba(0,0,0,0.14);
          background: rgba(255,255,255,0.78);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
        }
        .mb-btn:hover{
          transform: translateY(-1px);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 14px 30px rgba(0,0,0,0.08);
          border-color: rgba(0,0,0,0.24);
        }

        /* TIER CARD polish */
        .mb-tier-card{
          border-radius: 26px;
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.66);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }
        .mb-tier-head{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 14px 14px 10px;
        }
        .mb-tier-title{
          display: flex;
          gap: 10px;
          align-items: baseline;
        }
        .mb-tier-count{
          font-size: 12px;
          color: rgba(0,0,0,0.60);
        }
        .mb-tier-hint{
          font-size: 12px;
          color: rgba(0,0,0,0.55);
          margin-top: 1px;
        }
        .mb-tier-body{
          padding: 0 14px 14px;
        }
        .mb-room-link{
          display: block;
          border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.70);
          padding: 10px 12px;
          transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease, background 120ms ease;
        }
        .mb-room-link:hover{
          transform: translateY(-1px);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 12px 26px rgba(0,0,0,0.08);
          border-color: rgba(0,0,0,0.22);
        }
      `}</style>

      {/* HERO BAND (like homepage) */}
      <div className="mb-hero">
        <div className="mb-hero-inner">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-semibold mb-2 text-muted-foreground">
                Tier Map • Bản đồ cấp độ
              </div>
              <h1 className="mb-hero-title font-serif font-bold tracking-tight">
                Mercy Blade — Tier Map
              </h1>
              <p className="mt-3 text-sm mb-hero-sub">
                A structured view of your rooms: Free → VIP9. Click any room to open.
              </p>
            </div>

            {/* Keep your existing toggle (top-right vibe) */}
            <ThemeToggle />
          </div>

          <div className="mb-controls">
            <input
              className="mb-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rooms… (title, id, keywords)"
              aria-label="Search rooms"
            />

            <span className="mb-pill">
              Showing <b>{loading ? "…" : totalVisible}</b> room
              {totalVisible === 1 ? "" : "s"}
            </span>

            <button
              type="button"
              className="mb-btn"
              onClick={() =>
                setExpanded((prev) => {
                  const next: Record<TierId, boolean> = { ...prev };
                  for (const
