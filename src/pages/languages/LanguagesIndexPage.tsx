// src/pages/languages/LanguagesIndexPage.tsx — /languages
//
// Index page for language learning verticals. Lists available
// languages with links to their lesson pages.
// Pattern mirrors ProfessionsIndexPage.

import React from "react";
import { Link } from "react-router-dom";
import AITutorCtaBanner from "@/components/languages/AITutorCtaBanner";
import {
  Globe,
  ArrowRight,
} from "lucide-react";
import { useLessonUiLang } from "@/components/LessonUiLangToggle";

const HERO_VI = "Practical language learning";
// De-narrowed: the hub serves every audience at once and has no single
// target language, so the audience qualifier is dropped outright
// (rather than uiLang-conditional, which the per-language pages use).
const HERO_EN = "Real-life lessons in Korean, Japanese, Chinese, French, German, Portuguese & more";
const SUBTITLE_VI =
  "Learn useful phrases, pronunciation, and context. Most courses explain other languages for Vietnamese speakers; Vietnamese is a small survival-speaking MVP for foreigners in Vietnam.";
// EN-mode subtitle. SUBTITLE_VI narrows the audience ("for Vietnamese
// speakers" / "for foreigners in Vietnam") — left byte-identical so VI
// users (the default) see no change, while EN users get a de-narrowed
// rewrite that keeps the same pedagogy promise. Mirrors the #517 locked
// decision (uiLang-conditional, rewrite EN only, VI untouched); closes
// the residue #518/#519 deferred on the hub.
const SUBTITLE_EN =
  "Learn useful phrases, pronunciation, and real-world context across Korean, Japanese, Chinese, French, German, Spanish, Portuguese, and survival Vietnamese.";

type Card = {
  slug: string;
  title_vi: string;
  title_en: string;
  flag: string;
  blurb_vi: string;
  // English blurb shown when the global uiLanguage is "en". For the
  // Vietnamese-for-foreigners and Spanish cards the source blurb is
  // already English, so blurb_en is the same string (byte-identical
  // either mode).
  blurb_en: string;
  href: string;
  accent: "blue" | "red" | "crimson" | "amber" | "violet" | "green" | "rose" | "emerald" | "orange";
};

const CARDS: Card[] = [
  {
    slug: "french",
    title_vi: "Tiếng Pháp",
    title_en: "French",
    flag: "🇫🇷",
    blurb_vi:
      "50 bài: chào hỏi, số đếm, câu giao tiếp, ngữ pháp, ẩm thực, thành ngữ, tranh luận và hơn thế nữa.",
    blurb_en:
      "50 lessons: greetings, numbers, everyday phrases, grammar, food, idioms, debate, and more.",
    href: "/languages/french",
    accent: "blue",
  },
  {
    slug: "german",
    title_vi: "Tiếng Đức",
    title_en: "German",
    flag: "🇩🇪",
    blurb_vi:
      "50 bài: chào hỏi, số đếm, câu giao tiếp, cách (cases), công việc, xã hội, thành ngữ và hơn thế nữa.",
    blurb_en:
      "50 lessons: greetings, numbers, everyday phrases, cases, work, society, idioms, and more.",
    href: "/languages/german",
    accent: "red",
  },
  {
    slug: "chinese",
    title_vi: "Tiếng Trung",
    title_en: "Chinese",
    flag: "🇨🇳",
    blurb_vi:
      "50 bài: bính âm, chữ Hán cơ bản, câu giao tiếp, ngữ pháp, văn hoá Trung Quốc — A1 → B2.",
    blurb_en:
      "50 lessons: pinyin, basic characters, everyday phrases, grammar, Chinese culture — A1 → B2.",
    href: "/languages/chinese",
    accent: "crimson",
  },
  {
    slug: "japanese",
    title_vi: "Tiếng Nhật",
    title_en: "Japanese",
    flag: "🇯🇵",
    blurb_vi:
      "50 bài: hiragana, katakana, mẫu câu cơ bản, kính ngữ, văn hoá Nhật — A1 → B2.",
    blurb_en:
      "50 lessons: hiragana, katakana, core sentence patterns, honorifics, Japanese culture — A1 → B2.",
    href: "/languages/japanese",
    accent: "amber",
  },
  {
    slug: "korean",
    title_vi: "Tiếng Hàn",
    title_en: "Korean",
    flag: "🇰🇷",
    blurb_vi:
      "50 bài: hangul, ngữ pháp nền tảng, câu giao tiếp, văn hoá Hàn Quốc — A1 → B2.",
    blurb_en:
      "50 lessons: hangul, foundational grammar, everyday phrases, Korean culture — A1 → B2.",
    href: "/languages/korean",
    accent: "violet",
  },
  {
    slug: "vietnamese",
    title_vi: "Vietnamese for Foreigners",
    title_en: "Survival Vietnamese",
    flag: "🇻🇳",
    blurb_vi:
      "96 short lessons with 627 audio-backed phrase and dialogue lines, 39 dialogues, and 12 pronunciation mini-lessons for real life in Vietnam.",
    blurb_en:
      "96 short lessons with 627 audio-backed phrase and dialogue lines, 39 dialogues, and 12 pronunciation mini-lessons for real life in Vietnam.",
    href: "/languages/vietnamese",
    accent: "green",
  },
  {
    slug: "spanish",
    title_vi: "Spanish for English Speakers",
    title_en: "Español — A1 to C2",
    flag: "🇪🇸",
    blurb_vi:
      "110 lessons built for English speakers. Ser vs estar, por vs para, subjunctive — explained the way you actually need to hear them. Peninsular and Latin American variants throughout.",
    blurb_en:
      "110 lessons built for English speakers. Ser vs estar, por vs para, subjunctive — explained the way you actually need to hear them. Peninsular and Latin American variants throughout.",
    href: "/languages/spanish",
    accent: "rose",
  },
  {
    slug: "portuguese",
    title_vi: "Tiếng Bồ Đào Nha Brazil",
    title_en: "Brazilian Portuguese",
    flag: "🇧🇷",
    blurb_vi:
      "30 bài đã kiểm chứng: chào hỏi, mua sắm, công việc, thức giả định, tranh luận, văn học và diễn ngôn học thuật — A1 → C2.",
    blurb_en:
      "30 validated lessons: greetings, shopping, work, subjunctive, debate, literature, and academic discourse — A1 → C2.",
    href: "/languages/portuguese",
    accent: "emerald",
  },
  {
    slug: "arabic",
    title_vi: "Tiếng Ả Rập",
    title_en: "Arabic",
    flag: "🇸🇦",
    blurb_vi:
      "30 bài tiếng Ả Rập chuẩn hiện đại: chữ viết phải-sang-trái, chào hỏi, sinh hoạt, công việc, học thuật và văn phong trang trọng — A1 → C2.",
    blurb_en:
      "30 Modern Standard Arabic lessons: right-to-left script, greetings, daily life, work, academic language, and formal register — A1 → C2.",
    href: "/languages/arabic",
    accent: "orange",
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
  crimson: {
    border: "border-red-300",
    bg: "bg-gradient-to-br from-red-50 via-rose-50 to-pink-50",
    icon: "text-red-700",
  },
  amber: {
    border: "border-amber-200",
    bg: "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50",
    icon: "text-amber-600",
  },
  violet: {
    border: "border-violet-200",
    bg: "bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50",
    icon: "text-violet-600",
  },
  green: {
    border: "border-green-200",
    bg: "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50",
    icon: "text-green-700",
  },
  rose: {
    border: "border-rose-200",
    bg: "bg-gradient-to-br from-rose-50 via-red-50 to-amber-50",
    icon: "text-rose-600",
  },
  emerald: {
    border: "border-emerald-200",
    bg: "bg-gradient-to-br from-emerald-50 via-green-50 to-red-50",
    icon: "text-emerald-700",
  },
  orange: {
    border: "border-orange-200",
    bg: "bg-gradient-to-br from-orange-50 via-amber-50 to-stone-50",
    icon: "text-orange-700",
  },
};

export default function LanguagesIndexPage() {
  // Global gloss language (default "vi"); toggle lives in the chrome
  // band. VI keeps the page byte-identical to before this change.
  const [uiLang] = useLessonUiLang();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{HERO_VI}</h1>
        <p className="text-sm text-slate-500">{HERO_EN}</p>
        <p className="mt-3 text-sm text-slate-700">
          {uiLang === "en" ? SUBTITLE_EN : SUBTITLE_VI}
        </p>

        <AITutorCtaBanner uiLang={uiLang} target="en" />
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((card) => (
          <CardTile key={card.slug} card={card} uiLang={uiLang} />
        ))}
      </div>
    </div>
  );
}

function CardTile({
  card,
  uiLang,
}: {
  card: Card;
  uiLang: "vi" | "en";
}) {
  const accent = ACCENT_CLASSES[card.accent] ?? ACCENT_CLASSES.blue;
  const inner = (
    <article
      className={`flex h-full flex-col rounded-2xl border ${accent.border} ${accent.bg} p-4 transition hover:shadow-md cursor-pointer`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{card.flag}</span>
        {/* Eyebrow follows the active uiLang (was always-English, a
            cross-language duplicate of the localized <h2> below). In
            EN mode it mirrors the <h2> exactly as it already did. */}
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {uiLang === "en" ? card.title_en : card.title_vi}
        </p>
      </div>
      <h2 className="mt-2 text-base font-semibold text-slate-900">
        {uiLang === "en" ? card.title_en : card.title_vi}
      </h2>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-700">
        {uiLang === "en" ? card.blurb_en : card.blurb_vi}
      </p>
      <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-900">
        {uiLang === "en" ? "Start learning" : "Bắt đầu học"}
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
