// src/pages/languages/GermanLessonsPage.tsx — /languages/german
//
// Landing page for the German language module. Shows all 50 lessons
// with expandable tiles for vocabulary, grammar, examples, dialogue, and exercises.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const HERO_VI =
  "Tiếng Đức cho người Việt — 50 bài từ guten Tag đến tranh luận nâng cao.";
const HERO_EN =
  "German for Vietnamese learners — 50 lessons from hallo to debating.";

interface GermanLesson {
  id: number;
  title: string;
  description?: string;
  vocabulary?: { german: string; vietnamese: string; pronunciation?: string }[];
  grammar?: string;
  examples?: { german: string; vietnamese: string }[];
  dialogue?: { speaker: string; german: string; vietnamese: string }[];
  exercises?: string[];
}

export default function GermanLessonsPage() {
  const [lessons, setLessons] = useState<GermanLesson[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/languages/german/lessons")
      .then((mod) => {
        if (!cancelled) setLessons(mod.lessons ?? mod.default ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 text-center">
        <p className="text-red-600 text-sm">Could not load lessons: {error}</p>
        <Link to="/languages" className="mt-3 inline-block text-sm font-medium text-red-700 underline">
          Back to languages
        </Link>
      </div>
    );
  }

  if (!lessons) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse">
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
          🇩🇪 Tiếng Đức · German
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p className="mt-3 text-xs text-slate-500">
          {lessons.length} bài · phát âm thực tế cho người Việt
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link to="/languages" className="font-medium text-red-700 underline">
            ← All languages / Xem ngôn ngữ khác
          </Link>
        </p>
      </header>

      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <LessonTile key={lesson.id} lesson={lesson} index={i} />
        ))}
      </div>
    </div>
  );
}

function LessonTile({ lesson, index }: { lesson: GermanLesson; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-sm font-bold text-white bg-red-600">
          {lesson.id}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-slate-900">
            {lesson.title}
          </div>
          {lesson.description && (
            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {lesson.description}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 text-slate-400">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 space-y-3">
          {lesson.vocabulary && lesson.vocabulary.length > 0 && (
            <div className="rounded-lg border border-red-100 bg-red-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-red-700">
                <Sparkles className="h-3 w-3" />
                Từ vựng
              </p>
              <ul className="mt-2 space-y-1">
                {lesson.vocabulary.map((v, vi) => (
                  <li key={vi} className="text-xs text-slate-700">
                    <span className="font-semibold">{v.german}</span> — {v.vietnamese}
                    {v.pronunciation && <span className="text-slate-400 ml-1">[{v.pronunciation}]</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lesson.grammar && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                <Lightbulb className="h-3 w-3" />
                Ngữ pháp
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-700">
                {lesson.grammar}
              </p>
            </div>
          )}

          {lesson.examples && lesson.examples.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Ví dụ
              </p>
              <ol className="space-y-1">
                {lesson.examples.map((e, ei) => (
                  <li key={ei} className="text-xs text-slate-700">
                    <span className="font-medium">{e.german}</span>
                    <span className="text-slate-500 ml-2">{e.vietnamese}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {lesson.dialogue && lesson.dialogue.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Hội thoại
              </p>
              {lesson.dialogue.map((d, di) => (
                <div key={di} className="text-xs mb-1">
                  <span className="font-bold text-red-600">{d.speaker}:</span>{" "}
                  <span className="text-slate-700">{d.german}</span>
                  <span className="text-slate-400 ml-2">({d.vietnamese})</span>
                </div>
              ))}
            </div>
          )}

          {lesson.exercises && lesson.exercises.length > 0 && (
            <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                <Lightbulb className="h-3 w-3" />
                Bài tập
              </p>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                {lesson.exercises.map((ex, ei) => (
                  <li key={ei} className="text-xs text-slate-700">{ex}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
