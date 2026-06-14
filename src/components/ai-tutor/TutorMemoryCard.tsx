// src/components/ai-tutor/TutorMemoryCard.tsx
// M3 aggregate memory card — correction count, topic pills, review prompt.
// Extracted from AiTutor.tsx.

import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import type { LearningEventProgressSummary } from "@/lib/tutor/learningEventSummary";
import { planTodayLesson, type TodayLessonPlan } from "@/lib/tutor/todayLessonPlanner";

type Props = {
  memoryLoaded: boolean;
  memory: MemorySummary | null;
};

type TodayLessonProps = Props & {
  onStartLesson?: (plan: TodayLessonPlan) => void;
  startLabel?: string;
  planOverride?: TodayLessonPlan | null;
};

type MomentumProps = {
  summary: LearningEventProgressSummary;
};

export default function TutorMemoryCard({ memoryLoaded, memory }: Props) {
  if (!memoryLoaded || !memory || memory.totalCorrections === 0) return null;
  const languageLabel = (memory.targetLanguage || "en").toUpperCase();
  const practiceCount = Math.max(0, memory.practicedCount);
  const totalCorrections = Math.max(0, memory.totalCorrections);
  const masteryPercent = totalCorrections > 0
    ? Math.min(100, Math.round((practiceCount / totalCorrections) * 100))
    : 0;
  const weakPattern = memory.commonMistakePatterns.find((pattern) => pattern && pattern !== memory.strongestTopic)
    || memory.topicNeedingReview
    || memory.commonMistakePatterns[0]
    || "";

  return (
    <section
      data-testid="ai-tutor-memory-card"
      className="mx-auto mb-3 w-full max-w-3xl rounded-[14px] border border-indigo-100 bg-white px-4 py-3 shadow-sm"
      style={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-black text-slate-900">
          Tiến bộ: {masteryPercent}%
        </div>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black uppercase text-indigo-700">
          {languageLabel}
        </span>
      </div>

      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
        aria-label={`Progress ${masteryPercent}%`}
        data-testid="ai-tutor-progress-meter"
      >
        <div className="h-full rounded-full bg-indigo-600" style={{ width: `${masteryPercent}%` }} />
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer text-xs font-bold text-indigo-700">
          Xem chi tiết
        </summary>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700" style={{ maxWidth: "100%", whiteSpace: "normal", overflowWrap: "break-word" }}>
            {memory.totalCorrections} câu đã sửa
          </span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700" style={{ maxWidth: "100%", whiteSpace: "normal", overflowWrap: "break-word" }}>
            {memory.practicedCount} đã luyện
          </span>
          {memory.strongestTopic && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700" style={{ maxWidth: "100%", whiteSpace: "normal", overflowWrap: "break-word" }}>
              Mạnh: {memory.strongestTopic}
            </span>
          )}
          {memory.topicNeedingReview && (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 font-bold text-amber-700" style={{ maxWidth: "100%", whiteSpace: "normal", overflowWrap: "break-word" }}>
              Cần ôn: {memory.topicNeedingReview}
            </span>
          )}
          {weakPattern && (
            <span className="rounded-full bg-rose-50 px-2.5 py-1 font-bold text-rose-700" style={{ maxWidth: "100%", whiteSpace: "normal", overflowWrap: "break-word" }}>
              Lỗi hay gặp: {weakPattern}
            </span>
          )}
          {memory.lastPracticedTopic && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600" style={{ maxWidth: "100%", whiteSpace: "normal", overflowWrap: "break-word" }}>
              Gần nhất: {memory.lastPracticedTopic}
            </span>
          )}
        </div>
        {(memory.suggestedNextFocus || memory.nextRecommendedFocus) && (
          <div className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs font-bold text-indigo-700" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
            Ôn tiếp: {memory.suggestedNextFocus || memory.nextRecommendedFocus}
          </div>
        )}
      </details>
    </section>
  );
}

export function TutorTodayLessonCard({
  memoryLoaded,
  memory,
  onStartLesson,
  startLabel = "Bắt đầu",
  planOverride,
}: TodayLessonProps) {
  if (!memoryLoaded) return null;
  const plan = planOverride ?? planTodayLesson(memory);
  const modeLabel = {
    journey: "Lộ trình",
    grammar: "Sửa câu",
    speak: "Luyện nói",
    logic: "Logic",
  }[plan.suggestedMode];

  return (
    <section
      data-testid="ai-tutor-today-lesson"
      className="mx-auto mb-3 w-full max-w-3xl rounded-[14px] border border-emerald-200 bg-emerald-50/70 px-4 py-3 shadow-sm"
      style={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-sm font-black text-emerald-950">
            <span>Bài hôm nay</span>
            <span className="text-emerald-700">· {plan.estimatedMinutes} phút</span>
            <span className="text-emerald-700">· {plan.nextFocus || "Sửa lỗi thường gặp"}</span>
          </div>
          <h2
            data-testid="ai-tutor-today-lesson-title"
            className="mt-1 text-base font-black leading-6 text-slate-950"
            style={{ overflowWrap: "break-word" }}
          >
            {plan.lessonTitle}
          </h2>
          <details className="mt-1">
            <summary className="cursor-pointer text-xs font-bold text-emerald-800">
              Xem kế hoạch
            </summary>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs font-semibold leading-5 text-slate-700">
              {plan.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </details>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <span className="w-fit rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-black uppercase text-emerald-800 shadow-sm">
            {modeLabel}
          </span>
          <button
            type="button"
            onClick={() => onStartLesson?.(plan)}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            {startLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

export function TutorMomentumCard({ summary }: MomentumProps) {
  const modeCounts = summary.modeUsageCountsToday;
  const aiTutorSignalCount = summary.lessonsStartedToday
    + summary.lessonResumesToday
    + summary.lessonsCompletedToday
    + summary.retryCountToday
    + summary.logicInsightViewsToday
    + summary.nextFocusViewsToday
    + modeCounts.journey
    + modeCounts.grammar
    + modeCounts.speak
    + modeCounts.logic;

  if (aiTutorSignalCount === 0) return null;

  const logicLabel = summary.logicInsightViewedToday
    ? `${summary.logicInsightViewsToday} lần`
    : "Chưa";
  const nextFocusLabel = summary.nextFocusViewedToday
    ? `${summary.nextFocusViewsToday} lần`
    : "Chưa";

  return (
    <section
      data-testid="ai-tutor-momentum-card"
      aria-label="Tiến bộ hôm nay"
      className="mx-auto mb-3 w-full max-w-3xl rounded-[14px] border border-slate-200 bg-white px-4 py-3 shadow-sm"
      style={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden" }}
    >
      <div className="text-sm font-black text-slate-900">
        Hôm nay: {summary.lessonsCompletedToday} bài · {summary.retryCountToday} lần luyện lại
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer text-xs font-bold text-slate-600">
          Xem chi tiết
        </summary>

        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          <div className="rounded-xl bg-emerald-50 px-3 py-2">
            <div className="text-lg font-black text-emerald-700">{summary.lessonsCompletedToday}</div>
            <div className="text-[11px] font-bold uppercase text-emerald-800">bài xong</div>
          </div>
          <div className="rounded-xl bg-amber-50 px-3 py-2">
            <div className="text-lg font-black text-amber-700">{summary.retryCountToday}</div>
            <div className="text-[11px] font-bold uppercase text-amber-800">luyện lại</div>
          </div>
          <div className="rounded-xl bg-indigo-50 px-3 py-2">
            <div className="text-sm font-black text-indigo-700">{logicLabel}</div>
            <div className="text-[11px] font-bold uppercase text-indigo-800">logic</div>
          </div>
          <div className="rounded-xl bg-sky-50 px-3 py-2">
            <div className="text-sm font-black text-sky-700">{nextFocusLabel}</div>
            <div className="text-[11px] font-bold uppercase text-sky-800">ôn tiếp</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-white px-2.5 py-1 font-black uppercase text-slate-500">
            Chế độ
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-700">
            Lộ trình {modeCounts.journey}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-700">
            Sửa câu {modeCounts.grammar}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-700">
            Nói {modeCounts.speak}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-700">
            Logic {modeCounts.logic}
          </span>
        </div>
      </details>
    </section>
  );
}

/** Empty memory state shown when no corrections exist yet. */
export function TutorMemoryEmpty({ memoryLoaded, memory }: Props) {
  if (!memoryLoaded || !memory || memory.totalCorrections !== 0) return null;
  const languageLabel = (memory.targetLanguage || "en").toUpperCase();

  return (
    <section
      data-testid="ai-tutor-memory-empty"
      className="mx-auto mb-3 w-full max-w-3xl rounded-[14px] border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-center"
    >
      <div className="text-xs font-bold text-slate-600">
        Tiến bộ: chưa có dữ liệu {languageLabel}.
      </div>
    </section>
  );
}
