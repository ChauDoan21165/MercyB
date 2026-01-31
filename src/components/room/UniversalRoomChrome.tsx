// src/components/room/UniversalRoomChrome.tsx
// MB-BLUE-99.0 — 2025-12-30 (+0700) — UNIVERSAL ROOM CHROME (Boxes 2–5)
/**
 * Applies to ALL rooms:
 * Box 2: Room header (tier + title + fav + refresh)
 * Box 3: Welcome + keyword buttons (bilingual)
 * Box 4: Stage (empty until keyword selected)
 * Box 5: Thin feedback
 *
 * NOTE:
 * - Box 1 (top app bar) belongs to AppLayout (router-level), NOT here.
 *
 * PATCH (2026-01-31):
 * - Add universal frame ruler: max-w-[980px] px-4 (matches Home / global)
 * - Add min-w-0 + overflow-hidden on box shells to prevent "sticking out"
 */

import React from "react";

export type KeywordPair = { en: string; vi: string };

export default function UniversalRoomChrome({
  titleEN,
  titleVI,
  tierLabel,
  keywords,
  activeKeywordIndex,
  onSelectKeyword,
  onToggleFavorite,
  onRefresh,
  childrenStage,
}: {
  titleEN: string;
  titleVI?: string;
  tierLabel: string; // "Free" | "VIP1"...
  keywords: KeywordPair[]; // 2–8 (you can pass more, we’ll render first 8)
  activeKeywordIndex: number | null;
  onSelectKeyword: (index: number) => void;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  childrenStage: React.ReactNode; // Box 4
}) {
  const show = keywords.slice(0, 8);

  return (
    <div className="w-full">
      {/* ✅ UNIVERSAL FRAME: prevents per-page callers from drifting */}
      <div className="mx-auto w-full max-w-[980px] px-4 min-w-0">
        {/* Box 2 — Room header */}
        <div className="mb-4 rounded-2xl border bg-white/70 backdrop-blur p-4 md:p-5 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="shrink-0">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {tierLabel}
              </span>
            </div>

            <div className="min-w-0 text-center">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight truncate">
                {titleVI ? `${titleEN} / ${titleVI}` : titleEN}
              </h1>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                aria-label="Favorite"
                onClick={onToggleFavorite}
                className="h-9 w-9 rounded-full border bg-white hover:bg-slate-50 transition grid place-items-center"
                title="Favorite"
              >
                ♡
              </button>
              <button
                type="button"
                aria-label="Refresh"
                onClick={onRefresh}
                className="h-9 w-9 rounded-full border bg-white hover:bg-slate-50 transition grid place-items-center"
                title="Refresh"
              >
                ↻
              </button>
            </div>
          </div>
        </div>

        {/* Box 3 — Welcome + keyword buttons */}
        <div className="mb-4 rounded-2xl border bg-white/70 backdrop-blur p-4 md:p-5 shadow-sm min-w-0 overflow-hidden">
          <div className="text-center text-sm md:text-base leading-relaxed">
            <div>Welcome to this room, please click a keyword to start.</div>
            <div className="mt-1">Chào mừng bạn đến với phòng này, vui lòng nhấp vào từ khóa để bắt đầu.</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center min-w-0">
            {show.map((k, i) => {
              const active = activeKeywordIndex === i;
              return (
                <button
                  key={`${k.en}__${k.vi}__${i}`}
                  type="button"
                  onClick={() => onSelectKeyword(i)}
                  className={`px-4 py-2 rounded-full border font-semibold transition ${
                    active ? "bg-black text-white border-black" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {k.vi ? `${k.en} / ${k.vi}` : k.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Box 4 — Stage */}
        <div className="rounded-2xl border bg-white/70 backdrop-blur p-4 md:p-6 shadow-sm min-h-[420px] min-w-0 overflow-hidden">
          {childrenStage}
        </div>

        {/* Box 5 — Thin feedback */}
        <div className="mt-4 rounded-2xl border bg-white/70 backdrop-blur p-2 md:p-3 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <input
              className="flex-1 bg-transparent outline-none text-sm px-2 py-2 min-w-0"
              placeholder="Feedback to admin / Phản hồi cho admin…"
            />
            <button
              type="button"
              className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 transition grid place-items-center"
              title="Send"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Teacher GPT – new thing to learn:
   If a child overflows a rounded border, add `min-w-0` and `overflow-hidden` on the box shell.
*/
