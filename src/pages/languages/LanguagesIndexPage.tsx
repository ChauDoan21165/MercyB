// src/pages/languages/LanguagesIndexPage.tsx — /languages
//
// Index page for language learning verticals. Lists available
// languages (French, German) with links to their lesson pages.
// Pattern mirrors ProfessionsIndexPage.

import React from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  ArrowRight,
} from "lucide-react";

const HERO_VI = "Học ngoại ngữ cho người Việt";
const HERO_EN = "Language learning for Vietnamese speakers";
const SUBTITLE_VI =
  "Mỗi ngôn ngữ được thiết kế cho người Việt — phát âm, ngữ pháp, văn hoá, tất cả giải thích theo cách người Việt hiểu.";

type Card = {
  slug: string;
  title_vi: string;
  title_en: string;
  flag: string;
  blurb_vi: string;
  href: string;
  accent: "blue" | "red";
};

const CARDS: Card[] = [
  {
    slug: "french",
    title_vi: "Tiếng Pháp",
    title_en: "French",
    flag: "🇫🇷",
    blurb_vi:
      "50 bài: chào hỏi, số đếm, câu giao tiếp, ngữ pháp, ẩm thực, thành ngữ, tranh luận và hơn thế nữa.",
    href: "/languages/french",
    accent: "blue",
  },
  {
    slug: "german",
    title_vi: "Tiếng Đức",
    title_en: "German",
    flag: "🇩🇪",
    blurb_vi:
      "50 bài: chào hỏi, số đếm, câu giao tiếp, cách (cases), ẩm thực, thành ngữ, tranh luận và hơn thế nữa.",
    href: "/languages/german",
    accent: "red",
  },
];

const ACCENT_CLASSES: Record<string, { border: string; bg: string; icon: string }> = {
  blue: {
    border: "border-blue-200",
    bg: "bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50",
    icon: "text-blue-600",
  },
  red: {
    border: "border-red-200",
    bg: "bg-gradient-to-br from-red-50 via-rose-50 to-amber-50",
    icon: "text-red-600",
  },
};

export default function LanguagesIndexPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{HERO_VI}</h1>
        <p className="text-sm text-slate-500">{HERO_EN}</p>
        <p className="mt-3 text-sm text-slate-700">{SUBTITLE_VI}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((card) => (
          <CardTile key={card.slug} card={card} />
        ))}
      </div>
    </div>
  );
}

function CardTile({ card }: { card: Card }) {
  const accent = ACCENT_CLASSES[card.accent] ?? ACCENT_CLASSES.blue;
  const inner = (
    <article
      className={`flex h-full flex-col rounded-2xl border ${accent.border} ${accent.bg} p-4 transition hover:shadow-md cursor-pointer`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{card.flag}</span>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {card.title_en}
        </p>
      </div>
      <h2 className="mt-2 text-base font-semibold text-slate-900">
        {card.title_vi}
      </h2>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-700">
        {card.blurb_vi}
      </p>
      <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-900">
        Bắt đầu học
        <ArrowRight className="h-3 w-3" />
      </p>
    </article>
  );

  return (
    <Link to={card.href} className="block focus:outline-none focus:ring-2 focus:ring-blue-300">
      {inner}
    </Link>
  );
}
