// src/components/mercy-guide/tabs/LanguageLessonsView.tsx
//
// Pure rendering body for the per-language lesson tabs inside the Mercy
// guide panel. Takes its language data via props so each per-language
// wrapper (FrenchLessonsTab / GermanLessonsTab) can import only the data
// it needs and ride its own lazy chunk.

import React, { useState } from "react";
import {
  Sparkles,
  Lightbulb,
  Volume2,
  ChevronDown,
  ChevronUp,
  Globe,
} from "lucide-react";

import type { FrenchVocabEntry } from "@/languages/french/vocabulary";
import type { GermanVocabEntry } from "@/languages/german/vocabulary";
import type { FrenchCategoryMeta, FrenchLesson } from "@/languages/french/lessons";
import type { GermanCategoryMeta, GermanLesson } from "@/languages/german/lessons";

export type LanguageCode = "french" | "german";

export type LanguageLessonsConfig = {
  code: LanguageCode;
  label: string;
  labelVi: string;
  flag: string;
  accent: "blue" | "red";
  vocab: ReadonlyArray<FrenchVocabEntry | GermanVocabEntry>;
  categories: ReadonlyArray<FrenchCategoryMeta | GermanCategoryMeta>;
  getLessonsByCategory: (category: string) => (FrenchLesson | GermanLesson)[];
};

const ACCENT_COLORS: Record<string, { light: string; medium: string; dark: string; border: string; bg: string }> = {
  blue: {
    light: "blue-50",
    medium: "blue-100",
    dark: "blue-700",
    border: "border-blue-200",
    bg: "bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50",
  },
  red: {
    light: "red-50",
    medium: "red-100",
    dark: "red-700",
    border: "border-red-200",
    bg: "bg-gradient-to-br from-red-50 via-rose-50 to-amber-50",
  },
};

type Props = {
  config: LanguageLessonsConfig;
};

export default function LanguageLessonsView({ config }: Props) {
  const colors = ACCENT_COLORS[config.accent];
  const [showVocab, setShowVocab] = useState(false);

  return (
    <div className="space-y-3 px-1 pt-1">
      {/* Header */}
      <div className={`rounded-xl border ${colors.border} ${colors.bg} p-3`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.flag}</span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {config.labelVi}
            </p>
            <p className="text-xs text-slate-500">{config.label}</p>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          Phát âm viết riêng cho người Việt. Âm khó, ngữ pháp, văn hoá — giải thích theo cách người Việt hiểu.
        </p>

        {/* Vocab toggle */}
        <button
          type="button"
          onClick={() => setShowVocab((v) => !v)}
          className={`mt-2 inline-flex items-center gap-1 rounded-full border ${colors.border} bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-white`}
        >
          <Globe className="h-3 w-3" />
          50 từ vựng
          {showVocab ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>

        {showVocab && (
          <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              {config.vocab.map((entry, i) => (
                <div key={i} className="flex items-baseline gap-1.5 rounded px-1.5 py-0.5 text-xs hover:bg-slate-50">
                  <span className="font-medium text-slate-900">
                    {config.code === "french"
                      ? (entry as FrenchVocabEntry).fr
                      : (entry as GermanVocabEntry).de}
                  </span>
                  <span className="text-slate-400">—</span>
                  <span className="text-slate-600">
                    {config.code === "french"
                      ? (entry as FrenchVocabEntry).vi
                      : (entry as GermanVocabEntry).vi}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lessons */}
      {config.categories.map((cat) => {
        const lessons = config.getLessonsByCategory(cat.id);
        return (
          <section key={cat.id}>
            <header className="mb-1.5 flex items-baseline justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {cat.title_vi}
              </h3>
              <span className="text-[10px] text-slate-400">
                {cat.title_en} · {lessons.length} bài
              </span>
            </header>
            <ol className="space-y-1.5">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <LessonTile lesson={lesson} colors={colors} />
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function LessonTile({
  lesson,
  colors,
}: {
  lesson: FrenchLesson | GermanLesson;
  colors: { dark: string; light: string; medium: string };
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition hover:bg-slate-50"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-900">
            {lesson.title_vi}
          </p>
          <p className="text-[10px] text-slate-500">{lesson.title_en}</p>
        </div>
        {open ? (
          <ChevronUp className="h-3 w-3 shrink-0 text-slate-400" />
        ) : (
          <ChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-3 py-2 space-y-2">
          <ol className="space-y-1.5">
            {lesson.sentences.map((s, i) => (
              <li
                key={i}
                className="rounded-lg border border-slate-200 bg-white p-2"
              >
                <p className="text-xs font-medium text-slate-900">{s.en}</p>
                <p className="mt-0.5 text-[10px] text-slate-600">{s.vi}</p>
                {s.pronunciation_focus.length > 0 && (
                  <p className={`mt-0.5 inline-flex items-center gap-1 text-[10px] text-${colors.dark}`}>
                    <Volume2 className="h-2.5 w-2.5" />
                    {s.pronunciation_focus.join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <div className={`rounded-lg border border-${colors.medium} bg-${colors.light}/60 p-2`}>
            <p className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-${colors.dark}`}>
              <Sparkles className="h-2.5 w-2.5" />
              Văn hoá
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-slate-700">
              {lesson.cultural_notes_vi}
            </p>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-2">
            <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              <Lightbulb className="h-2.5 w-2.5" />
              Mẹo học
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-slate-700">
              {lesson.tip_advice_vi}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
