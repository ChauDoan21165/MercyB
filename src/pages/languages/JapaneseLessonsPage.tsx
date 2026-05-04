// src/pages/languages/JapaneseLessonsPage.tsx — /languages/japanese

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Pencil,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { lessons as JAPANESE_LESSONS } from "@/languages/japanese/lessons";
import type { ReactNode } from "react";

const HERO_VI =
  "Tiếng Nhật cho người Việt — từ hiragana đến mẫu câu giao tiếp.";
const HERO_EN =
  "Japanese for Vietnamese learners — from hiragana to conversation.";

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-rose-100 text-rose-700",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Sơ cấp",
  intermediate: "Trung cấp",
  advanced: "Cao cấp",
};

export default function JapaneseLessonsPage() {
  const levels = ["beginner", "intermediate", "advanced"];
  const grouped = levels.map((level) => ({
    level,
    lessons: JAPANESE_LESSONS.filter((l: any) => l.level === level),
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          🇯🇵 Tiếng Nhật · Japanese
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          Từ bảng chữ cái đến ngữ pháp trung cấp — giải thích theo cách người
          Việt hiểu. Có bài tập, hội thoại thực tế, và mẹo ghi nhớ.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {JAPANESE_LESSONS.length} bài · 3 cấp độ · hội thoại thực tế
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium text-amber-700 underline"
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>
      </header>

      <div className="space-y-6">
        {grouped.map(
          (group) =>
            group.lessons.length > 0 && (
              <section key={group.level}>
                <header className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    {LEVEL_LABELS[group.level] ?? group.level}
                  </h2>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_COLORS[group.level] ?? ""}`}
                  >
                    {group.lessons.length} bài
                  </span>
                </header>
                <div className="space-y-2">
                  {group.lessons.map((lesson: any) => (
                    <LessonTile key={lesson.id} lesson={lesson} />
                  ))}
                </div>
              </section>
            ),
        )}
      </div>
    </div>
  );
}

function LessonTile({ lesson }: { lesson: any }) {
  const [open, setOpen] = useState(false);
  const hasVocabulary =
    Array.isArray(lesson.vocabulary) && lesson.vocabulary.length > 0;
  const hasGrammar = Array.isArray(lesson.grammar) && lesson.grammar.length > 0;
  const hasExamples = Array.isArray(lesson.examples) && lesson.examples.length > 0;
  const hasDialogue = Array.isArray(lesson.dialogue) && lesson.dialogue.length > 0;
  const hasExercises =
    Array.isArray(lesson.exercises) && lesson.exercises.length > 0;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              #{lesson.id}
            </span>
            <p className="text-sm font-medium text-slate-900">
              {lesson.title_vi || lesson.title}
            </p>
            {lesson.level && (
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${LEVEL_COLORS[lesson.level] ?? ""}`}
              >
                {LEVEL_LABELS[lesson.level] ?? lesson.level}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
            {hasVocabulary && (
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {lesson.vocabulary.length} từ
              </span>
            )}
            {hasExamples && (
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {lesson.examples.length} câu
              </span>
            )}
            {hasDialogue && (
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Hội thoại
              </span>
            )}
            {hasExercises && (
              <span className="inline-flex items-center gap-1">
                <Pencil className="h-3 w-3" />
                Bài tập
              </span>
            )}
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 space-y-4">
          {/* Vocabulary */}
          {hasVocabulary && (
            <div>
              <Label icon={<BookOpen className="h-3.5 w-3.5" />} color="text-sky-600">
                Từ vựng
              </Label>
              <div className="mt-1.5 grid grid-cols-2 gap-1">
                {lesson.vocabulary.map((v: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-1.5 rounded bg-white px-2 py-1 border border-slate-100 text-xs"
                  >
                    <span className="font-medium text-slate-900">
                      {v.japanese}
                    </span>
                    <span className="text-slate-400">—</span>
                    <span className="text-slate-600">{v.english}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar */}
          {hasGrammar && (
            <div>
              <Label icon={<GraduationCap className="h-3.5 w-3.5" />} color="text-violet-600">
                Ngữ pháp
              </Label>
              <ul className="mt-1.5 space-y-1.5">
                {lesson.grammar.map((g: any, i: number) => (
                  <li
                    key={i}
                    className="rounded-lg border border-violet-100 bg-violet-50/50 px-3 py-2 text-xs"
                  >
                    <p className="font-semibold text-violet-800">{g.point}</p>
                    <p className="mt-0.5 text-slate-600">{g.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Example Sentences */}
          {hasExamples && (
            <div>
              <Label icon={<MessageCircle className="h-3.5 w-3.5" />} color="text-emerald-600">
                Câu ví dụ
              </Label>
              <ul className="mt-1.5 space-y-1.5">
                {lesson.examples.map((ex: any, i: number) => (
                  <li
                    key={i}
                    className="rounded-lg border border-emerald-100 bg-white px-3 py-2 text-xs"
                  >
                    <p className="font-medium text-slate-900">
                      {ex.japanese}
                    </p>
                    <p className="mt-0.5 text-slate-500">{ex.english}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dialogue */}
          {hasDialogue && (
            <div>
              <Label icon={<Sparkles className="h-3.5 w-3.5" />} color="text-amber-600">
                Hội thoại
              </Label>
              <ul className="mt-1.5 space-y-1.5">
                {lesson.dialogue.map((d: any, i: number) => (
                  <li
                    key={i}
                    className="rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2 text-xs"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-700">
                        {d.speaker}
                      </span>
                      <span className="font-medium text-slate-900">
                        {d.japanese}
                      </span>
                    </span>
                    <p className="mt-0.5 ml-6.5 text-slate-500">{d.english}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exercises */}
          {hasExercises && (
            <div>
              <Label icon={<Pencil className="h-3.5 w-3.5" />} color="text-rose-600">
                Bài tập
              </Label>
              <ul className="mt-1.5 space-y-2">
                {lesson.exercises.map((ex: any, i: number) => (
                  <li
                    key={i}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  >
                    <p className="font-semibold text-slate-700">
                      {ex.type === "fill-blank"
                        ? "Điền vào chỗ trống"
                        : ex.type === "matching"
                          ? "Nối cặp"
                          : ex.type === "translation"
                            ? "Dịch"
                            : ex.type}
                    </p>
                    {ex.type === "fill-blank" && (
                      <>
                        <p className="mt-1 font-mono text-slate-900">
                          {ex.question}
                        </p>
                        <p className="mt-0.5 text-emerald-600">
                          → {ex.answer}
                        </p>
                      </>
                    )}
                    {ex.type === "matching" && (
                      <>
                        <p className="mt-1 text-slate-500">{ex.instruction}</p>
                        <div className="mt-1 grid grid-cols-2 gap-1">
                          {ex.pairs?.map((p: any, pi: number) => (
                            <div
                              key={pi}
                              className="rounded bg-slate-50 px-2 py-1 border border-slate-100"
                            >
                              <span className="font-medium text-slate-800">
                                {p.japanese}
                              </span>
                              <span className="mx-1 text-slate-300">—</span>
                              <span className="text-slate-600">{p.english}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {ex.type === "translation" && (
                      <>
                        <p className="mt-1 font-medium text-slate-600">
                          🇻🇳 {ex.vietnamese}
                        </p>
                        <p className="mt-0.5 font-medium text-slate-900">
                          🇯🇵 {ex.japanese}
                        </p>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function Label({
  icon,
  color,
  children,
}: {
  icon: ReactNode;
  color: string;
  children: ReactNode;
}) {
  return (
    <p
      className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide ${color}`}
    >
      {icon}
      {children}
    </p>
  );
}
