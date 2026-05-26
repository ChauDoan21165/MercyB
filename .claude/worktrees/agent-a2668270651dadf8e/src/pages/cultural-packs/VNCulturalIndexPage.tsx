// src/pages/cultural-packs/VNCulturalIndexPage.tsx
//
// Step 10 — /culture/vn entry point. Lists the eight cultural packs
// (the original seven plus the daily-life pack added in the Option-B
// expansion). Free-tier feature, no entitlement gating — community
// building.

import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  CULTURAL_PACK_IDS,
  VN_CULTURAL_PACKS,
} from "@/data/cultural-packs/vn/culturalPackSchema";
import { Card, CardContent } from "@/components/ui/card";

const TONE_BADGES: Record<string, { label: string; classes: string }> = {
  festive: {
    label: "Festive / Vui",
    classes: "bg-amber-100 text-amber-800 border-amber-300",
  },
  sacred: {
    label: "Sacred / Trang trọng",
    classes: "bg-slate-200 text-slate-800 border-slate-400",
  },
  practical: {
    label: "Practical / Thực dụng",
    classes: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  respectful: {
    label: "Respectful / Kính trọng",
    classes: "bg-indigo-100 text-indigo-800 border-indigo-300",
  },
};

export default function VNCulturalIndexPage(): React.ReactElement {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const previous = document.title;
    document.title = "Văn hoá Việt — MercyBlade";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Văn hoá Việt — giải thích bằng tiếng Anh
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Vietnamese culture, in English — for diaspora users explaining
          their world to coworkers, neighbors, and kids' teachers.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Miễn phí cho mọi người dùng / Free for everyone.
        </p>
      </header>

      <ul className="space-y-3" aria-label="Cultural packs">
        {CULTURAL_PACK_IDS.map((id) => {
          const pack = VN_CULTURAL_PACKS[id];
          const badge = TONE_BADGES[pack.tone] ?? TONE_BADGES.respectful;
          return (
            <li key={id}>
              <Link
                to={`/culture/vn/${id}`}
                className="block focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg"
              >
                <Card className="transition hover:border-amber-300 hover:shadow-sm">
                  <CardContent className="space-y-2 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="text-base font-semibold text-slate-900">
                        {pack.title_vn}
                      </h2>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${badge.classes}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{pack.title_en}</p>
                    <p className="text-sm leading-relaxed text-slate-700">
                      {pack.summary_vn}
                    </p>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {pack.summary_en}
                    </p>
                    <p className="text-xs text-slate-400">
                      {pack.phrases.length} cụm từ · {pack.dialogues.length} hội thoại
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
