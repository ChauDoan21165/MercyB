// src/components/mercy-guide/tabs/LanguageLessonsView.tsx
//
// Pure rendering body for the per-language lesson tabs inside the Mercy
// guide panel. Takes its language data via props so each per-language
// wrapper (FrenchLessonsTab / GermanLessonsTab) can import only the data
// it needs.
//
// Lazy-load split: the view loads only the user's selected level via
// the language's per-level loader, so opening the tab no longer pulls
// every level's data eagerly.

import { useEffect, useMemo, useState } from "react";
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
import type {
  FrenchCategoryMeta,
  FrenchLesson,
  FrenchCefrLevel,
} from "@/languages/french/lessons";
import type {
  GermanCategoryMeta,
  GermanLesson,
  GermanCefrLevel,
} from "@/languages/german/lessons";

export type LanguageCode = "french" | "german";

export type LessonUiLang = "vi" | "en";

type AnyLevel = FrenchCefrLevel | GermanCefrLevel;
type AnyLesson = FrenchLesson | GermanLesson;

export type LanguageLessonsConfig = {
  code: LanguageCode;
  label: string;
  labelVi: string;
  flag: string;
  accent: "blue" | "red";
  vocab: ReadonlyArray<FrenchVocabEntry | GermanVocabEntry>;
  categories: ReadonlyArray<FrenchCategoryMeta | GermanCategoryMeta>;
  loadLessonsForLevel: (level: AnyLevel) => Promise<AnyLesson[]>;
};

const LEVELS: ReadonlyArray<AnyLevel> = ["A1", "A2", "B1", "B2", "C1", "C2"];

const ACCENT_COLORS: Record<string, { light: string; medium: string; dark: string; border: string; bg: string; activeBg: string }> = {
  blue: {
    light: "blue-50",
    medium: "blue-100",
    dark: "blue-700",
    border: "border-blue-200",
    bg: "bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50",
    activeBg: "bg-blue-600",
  },
  red: {
    light: "red-50",
    medium: "red-100",
    dark: "red-700",
    border: "border-red-200",
    bg: "bg-gradient-to-br from-red-50 via-rose-50 to-amber-50",
    activeBg: "bg-red-600",
  },
};

type Props = {
  config: LanguageLessonsConfig;
  uiLang?: LessonUiLang;
};

export default function LanguageLessonsView({ config, uiLang = "vi" }: Props) {
  const colors = ACCENT_COLORS[config.accent];
  const [showVocab, setShowVocab] = useState(false);
  const [level, setLevel] = useState<AnyLevel>("A1");
  const [lessons, setLessons] = useState<AnyLesson[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLessons(null);
    config
      .loadLessonsForLevel(level)
      .then((arr) => {
        if (!cancelled) setLessons(arr);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[LanguageLessonsView] level load failed", level, err);
          setLessons([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [config, level]);

  const lessonsByCategory = useMemo(() => {
    const map = new Map<string, AnyLesson[]>();
    if (!lessons) return map;
    for (const lesson of lessons) {
      const cat =
        (lesson as { category?: string }).category ?? "uncategorized";
      const arr = map.get(cat);
      if (arr) arr.push(lesson);
      else map.set(cat, [lesson]);
    }
    return map;
  }, [lessons]);

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

      {/* Level selector */}
      <nav
        aria-label="Chọn cấp độ"
        className="flex flex-wrap gap-1.5"
      >
        {LEVELS.map((lv) => {
          const active = lv === level;
          return (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition ${
                active
                  ? `border-transparent ${colors.activeBg} text-white`
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
              aria-pressed={active}
            >
              {lv}
            </button>
          );
        })}
      </nav>

      {/* Lessons */}
      {lessons === null ? (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs text-slate-500">
          Đang tải bài học cấp độ {level}…
        </p>
      ) : lessons.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs text-slate-500">
          Chưa có bài học cho cấp độ này.
        </p>
      ) : (
        config.categories.map((cat) => {
          const catLessons = lessonsByCategory.get(cat.id) ?? [];
          if (catLessons.length === 0) return null;
          return (
            <section key={cat.id}>
              <header className="mb-1.5 flex items-baseline justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {cat.title_vi}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {cat.title_en} · {catLessons.length} bài
                </span>
              </header>
              <ol className="space-y-1.5">
                {catLessons.map((lesson) => (
                  <li key={lesson.id}>
                    <LessonTile lesson={lesson} colors={colors} uiLang={uiLang} />
                  </li>
                ))}
              </ol>
            </section>
          );
        })
      )}
    </div>
  );
}

function FallbackBadge() {
  // Shown when uiLang === "en" but the lesson has no EN translation for
  // this section; the renderer falls back to the Vietnamese text. The
  // badge sets the right expectation rather than silently hiding the gap.
  return (
    <span className="ml-1 inline-flex items-center rounded-sm bg-slate-200 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-slate-600">
      VI
    </span>
  );
}

// EN pedagogy fields exist on the German Lesson type today (PR #439) and
// are being rolled out to French (PR #451). We read them through a narrow
// structural cast so this UI lands cleanly regardless of merge order; the
// `??` fallback below handles lessons that haven't been bilingualized yet.
type LessonEnFields = {
  cultural_notes_en?: string;
  tip_advice_en?: string;
};
type SentenceEnFields = {
  pronunciation_focus_en?: string[];
};

function LessonTile({
  lesson,
  colors,
  uiLang,
}: {
  lesson: FrenchLesson | GermanLesson;
  colors: { dark: string; light: string; medium: string };
  uiLang: LessonUiLang;
}) {
  const [open, setOpen] = useState(false);
  const isEn = uiLang === "en";
  const lessonEn = lesson as LessonEnFields;
  const culturalEn = lessonEn.cultural_notes_en;
  const tipEn = lessonEn.tip_advice_en;
  const culturalText = isEn ? (culturalEn ?? lesson.cultural_notes_vi) : lesson.cultural_notes_vi;
  const tipText = isEn ? (tipEn ?? lesson.tip_advice_vi) : lesson.tip_advice_vi;
  const culturalFallback = isEn && !culturalEn;
  const tipFallback = isEn && !tipEn;
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
            {lesson.sentences.map((s, i) => {
              const sEn = s as SentenceEnFields;
              const pronFocus = isEn
                ? (sEn.pronunciation_focus_en ?? s.pronunciation_focus)
                : s.pronunciation_focus;
              const pronFallback = isEn && !sEn.pronunciation_focus_en;
              return (
                <li
                  key={i}
                  className="rounded-lg border border-slate-200 bg-white p-2"
                >
                  <p className="text-xs font-medium text-slate-900">{s.en}</p>
                  <p className="mt-0.5 text-[10px] text-slate-600">{s.vi}</p>
                  {pronFocus.length > 0 && (
                    <p className={`mt-0.5 inline-flex items-center gap-1 text-[10px] text-${colors.dark}`}>
                      <Volume2 className="h-2.5 w-2.5" />
                      {pronFocus.join(" · ")}
                      {pronFallback && <FallbackBadge />}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>

          <div className={`rounded-lg border border-${colors.medium} bg-${colors.light}/60 p-2`}>
            <p className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-${colors.dark}`}>
              <Sparkles className="h-2.5 w-2.5" />
              {isEn ? "Culture" : "Văn hoá"}
              {culturalFallback && <FallbackBadge />}
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-slate-700">
              {culturalText}
            </p>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-2">
            <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              <Lightbulb className="h-2.5 w-2.5" />
              {isEn ? "Tip" : "Mẹo học"}
              {tipFallback && <FallbackBadge />}
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-slate-700">
              {tipText}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
