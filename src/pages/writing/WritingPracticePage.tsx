// src/pages/writing/WritingPracticePage.tsx
//
// /writing — list page for the real-life writing practice library.
// Static dataset (40 prompts) shipped with the bundle. Filters:
// category (multi-select), difficulty (multi-select), completed
// (toggle). Tap a prompt → /writing/:promptId.

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { listCompletedPromptIds } from "@/lib/writing/submissions";
import {
  ALL_CATEGORIES,
  ALL_DIFFICULTIES,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  type WritingPromptCategory,
  type WritingPromptDifficulty,
} from "@/lib/writing/types";
import { WRITING_PROMPTS } from "@/data/writing-prompts/prompts";

type CompletedFilter = "all" | "todo" | "done";

export default function WritingPracticePage() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [selectedCategories, setSelectedCategories] = useState<
    Set<WritingPromptCategory>
  >(() => new Set(ALL_CATEGORIES));
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    Set<WritingPromptDifficulty>
  >(() => new Set(ALL_DIFFICULTIES));
  const [completedFilter, setCompletedFilter] =
    useState<CompletedFilter>("all");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loadingCompleted, setLoadingCompleted] = useState(false);

  useEffect(() => {
    if (!userId) {
      setCompletedIds(new Set());
      return;
    }
    let cancelled = false;
    setLoadingCompleted(true);
    void listCompletedPromptIds(userId).then((ids) => {
      if (cancelled) return;
      setCompletedIds(ids);
      setLoadingCompleted(false);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const visiblePrompts = useMemo(() => {
    return WRITING_PROMPTS.filter((p) => {
      if (!selectedCategories.has(p.category)) return false;
      if (!selectedDifficulties.has(p.difficulty)) return false;
      const isDone = completedIds.has(p.id);
      if (completedFilter === "todo" && isDone) return false;
      if (completedFilter === "done" && !isDone) return false;
      return true;
    });
  }, [selectedCategories, selectedDifficulties, completedFilter, completedIds]);

  const toggleCategory = (cat: WritingPromptCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const toggleDifficulty = (d: WritingPromptDifficulty) => {
    setSelectedDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(d)) {
        next.delete(d);
      } else {
        next.add(d);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-[#FFFDFC] to-[#F7FAFF]">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
        <header className="mb-5 md:mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Luyện viết · Writing practice
          </h1>
          <p className="mt-1 text-sm text-slate-600 md:text-base">
            40 tình huống thực tế: email công việc, khiếu nại, hồ sơ hẹn hò,
            mạng xã hội, và nhiều hơn. ·{" "}
            <span className="italic">
              Real-life prompts: workplace email, complaints, dating profile,
              social media, and more.
            </span>
          </p>
        </header>

        <section
          aria-label="Filters"
          className="mb-5 space-y-3 rounded-2xl border border-white/80 bg-white/80 p-3 shadow-sm md:p-4"
        >
          {/* Category chips */}
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Chủ đề · Category
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CATEGORIES.map((cat) => {
                const active = selectedCategories.has(cat);
                const meta = CATEGORY_LABELS[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                      active
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span aria-hidden="true">{meta.emoji}</span>
                    <span>{meta.vi}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty chips */}
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Độ khó · Difficulty
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_DIFFICULTIES.map((d) => {
                const active = selectedDifficulties.has(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDifficulty(d)}
                    aria-pressed={active}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                      active
                        ? "border-amber-300 bg-amber-50 text-amber-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {DIFFICULTY_LABELS[d].vi}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Completed toggle */}
          {userId ? (
            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Trạng thái · Status
              </p>
              <div className="flex gap-1.5">
                {(["all", "todo", "done"] as const).map((opt) => {
                  const active = completedFilter === opt;
                  const labels: Record<CompletedFilter, string> = {
                    all: "Tất cả",
                    todo: "Chưa làm",
                    done: "Đã làm",
                  };
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCompletedFilter(opt)}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                        active
                          ? "border-sky-300 bg-sky-50 text-sky-800"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {labels[opt]}
                    </button>
                  );
                })}
              </div>
              {loadingCompleted ? (
                <p className="mt-1 text-[10px] italic text-slate-400">
                  Đang tải lịch sử...
                </p>
              ) : null}
            </div>
          ) : null}
        </section>

        {/* Prompt grid */}
        <section
          aria-label="Writing prompts"
          className="grid gap-2.5 sm:grid-cols-2"
        >
          {visiblePrompts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              Không có đề bài nào khớp với bộ lọc. ·{" "}
              <span className="italic">
                No prompts match these filters.
              </span>
            </div>
          ) : (
            visiblePrompts.map((p) => {
              const isDone = completedIds.has(p.id);
              const cat = CATEGORY_LABELS[p.category];
              return (
                <Link
                  key={p.id}
                  to={`/writing/${p.id}`}
                  className="group rounded-2xl border border-white/80 bg-white p-3.5 shadow-sm transition hover:border-emerald-200 hover:shadow-md md:p-4"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      <span aria-hidden="true">{cat.emoji}</span>
                      <span>{cat.vi}</span>
                    </span>
                    {isDone ? (
                      <span
                        className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800"
                        aria-label="Completed"
                      >
                        ✓ Đã làm
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800 md:text-base">
                    {p.title_vi}
                  </h3>
                  <p className="mt-0.5 text-[11px] italic text-slate-500">
                    {p.title_en}
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs leading-snug text-slate-600">
                    {p.scenario_vi}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-500">
                    {p.target_words_min}–{p.target_words_max} từ ·{" "}
                    <span className="italic">
                      {DIFFICULTY_LABELS[p.difficulty].en}
                    </span>
                  </p>
                </Link>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
