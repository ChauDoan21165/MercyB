// src/pages/languages/FrenchLessonsPage.tsx — /languages/french
//
// Landing page for the French language module. Shows all 50 lessons
// with expandable tiles for vocabulary, examples, dialogue, and exercises.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const HERO_VI =
  "Tiếng Pháp cho người Việt — từ chào hỏi đến tranh luận nâng cao.";
const HERO_EN =
  "French for Vietnamese learners — 50 lessons from bonjour to debating.";

interface FrenchLesson {
  id: number;
  title: string;
  content?: string;
}

export default function FrenchLessonsPage() {
  const [lessons, setLessons] = useState<FrenchLesson[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/languages/french/lessons")
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
        <Link to="/languages" className="mt-3 inline-block text-sm font-medium text-blue-700 underline">
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
      <header className="mb-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          🇫🇷 Tiếng Pháp · French
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p className="mt-3 text-xs text-slate-500">
          {lessons.length} bài · phát âm thực tế cho người Việt
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link to="/languages" className="font-medium text-blue-700 underline">
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

function LessonTile({ lesson, index }: { lesson: FrenchLesson; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-sm font-bold text-white bg-blue-600">
          {lesson.id}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-slate-900">
            {lesson.title}
          </div>
        </div>
        <div className="flex-shrink-0 text-slate-400">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-100">
          {lesson.content && (
            <div className="mt-3 p-3 rounded-lg bg-slate-50">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {lesson.content}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
