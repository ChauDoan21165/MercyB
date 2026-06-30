// src/pages/languages/VietnameseLessonsPage.tsx — /languages/vietnamese

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AITutorCtaBanner from "@/components/languages/AITutorCtaBanner";
import { useLessonUiLang } from "@/components/LessonUiLangToggle";

import {
  loadVietnameseLessonsForLevel,
  type VietnameseLesson,
  type VietnameseCefrLevel,
} from "@/languages/vietnamese/lessons";
import { normalizeVietnameseLesson } from "@/languages/vietnamese/normalize";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillColors,
  cefrPillLabels,
} from "@/components/languages/lessonThemes";

const HERO_TITLE = "Vietnamese for Foreigners";
const HERO_SUBTITLE =
  "Learn Vietnamese for real life in Vietnam: survival, daily life, and practical conversations.";
const VIETNAMESE_LEVELS: VietnameseCefrLevel[] = ["A1", "B1", "B2"];

export default function VietnameseLessonsPage() {
  const [uiLang] = useLessonUiLang();
  const theme = lessonThemes.vietnamese;
  const [lessons, setLessons] = useState<VietnameseLesson[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadAll = async () => {
      try {
        const all: VietnameseLesson[] = [];
        for (const lvl of VIETNAMESE_LEVELS) {
          const batch = await loadVietnameseLessonsForLevel(lvl);
          all.push(...batch);
        }
        if (!cancelled) setLessons(all);
      } catch (err) {
        if (!cancelled) setError(String((err as Error)?.message ?? err));
      }
    };
    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const normalized = useMemo(() => {
    if (!lessons) return [];
    // Defensive: one malformed lesson row must not crash the whole level.
    type Normalized = ReturnType<typeof normalizeVietnameseLesson>;
    return lessons
      .map((lesson): Normalized | null => {
        try {
          return normalizeVietnameseLesson(lesson);
        } catch (err) {
          console.warn(
            "[VietnameseLessonsPage] skipping malformed lesson:",
            err,
          );
          return null;
        }
      })
      .filter((x): x is Normalized => x !== null);
  }, [lessons]);

  const stats = useMemo(() => {
    if (!lessons) return null;
    const phraseCount = lessons.reduce(
      (sum, lesson) => sum + (lesson.phrases?.length ?? 0),
      0,
    );
    const dialogueCount = lessons.filter(
      (lesson) => lesson.dialogue && lesson.dialogue.length > 0,
    ).length;
    const pronunciationCount = lessons.filter((lesson) =>
      lesson.title_en.startsWith("Pronunciation:"),
    ).length;
    return {
      lessonCount: lessons.length,
      phraseCount,
      dialogueCount,
      pronunciationCount,
    };
  }, [lessons]);

  const grouped = useMemo(() => {
    if (!normalized.length) return [];
    return VIETNAMESE_LEVELS.map((level) => ({
      level,
      lessons: normalized.filter((lesson) => lesson.level === level),
    }));
  }, [normalized]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header
        className="mb-6 rounded-2xl border p-5"
        style={{
          borderColor: `${theme.accent}33`,
          background: `linear-gradient(135deg, ${theme.accent}0A, ${theme.accent}05)`,
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: theme.accent }}
        >
          🇻🇳 Survival Vietnamese
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_TITLE}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          {HERO_SUBTITLE}
        </p>
        {stats && (
          <p className="mt-2 text-sm font-bold" style={{ color: theme.accent }}>
            {stats.lessonCount} lessons · {stats.phraseCount} phrases ·{" "}
            {stats.dialogueCount} dialogues · {stats.pronunciationCount} pronunciation mini-lessons
          </p>
        )}
        <p className="mt-3 text-xs text-slate-600">
          <Link
            to="/languages"
            className="font-medium underline"
            style={{ color: theme.accent }}
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>

        <AITutorCtaBanner uiLang={uiLang} target="vi" />
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-5 text-center">
          <p className="text-sm text-red-600">Failed to load lessons.</p>
          <p className="mt-1 text-xs text-slate-600">{error}</p>
        </div>
      ) : !lessons ? (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-600">
          Loading Vietnamese lessons…
        </p>
      ) : (
        <div className="space-y-6">
          {grouped.map(
            (group) =>
              group.lessons.length > 0 && (
                <section key={group.level}>
                  <header className="mb-2 flex items-baseline justify-between">
                    <h2 className="text-base font-semibold text-slate-900">
                      {cefrPillLabels[group.level] ?? group.level}
                    </h2>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cefrPillColors[group.level] ?? ""}`}
                    >
                      {group.lessons.length} lessons
                    </span>
                  </header>
                  <div className="space-y-2">
                    {group.lessons.map((lesson) => (
                      <LessonRenderer
                        key={lesson.id}
                        lesson={lesson}
                        theme={theme}
                        // Vietnamese-for-foreigners: title.vi = English
                        // lesson title, title.en = English subtitle — both
                        // the learner's language, not a UI duplicate. Keep
                        // both lines (the single-language collapse would
                        // otherwise drop the subtitle).
                        dualTitle
                      />
                    ))}
                  </div>
                </section>
              ),
          )}
        </div>
      )}
    </div>
  );
}
