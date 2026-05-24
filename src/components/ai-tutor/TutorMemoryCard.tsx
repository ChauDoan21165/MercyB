// src/components/ai-tutor/TutorMemoryCard.tsx
// M3 aggregate memory card — correction count, topic pills, review prompt.
// Extracted from AiTutor.tsx.

import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import { planTodayLesson } from "@/lib/tutor/todayLessonPlanner";

type Props = {
  memoryLoaded: boolean;
  memory: MemorySummary | null;
};

type TodayLessonProps = Props & {
  onStartLesson?: (mode: ReturnType<typeof planTodayLesson>["suggestedMode"]) => void;
};

export default function TutorMemoryCard({ memoryLoaded, memory }: Props) {
  if (!memoryLoaded || !memory || memory.totalCorrections === 0) return null;
  const languageLabel = (memory.targetLanguage || "en").toUpperCase();

  return (
    <section
      data-testid="ai-tutor-memory-card"
      className="mx-auto mb-4 w-full max-w-3xl rounded-[14px] border border-indigo-100 bg-indigo-50/45 px-4 py-3 shadow-sm"
      style={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden" }}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="text-xs font-black uppercase text-indigo-500">
          Học tập gần đây · {languageLabel}
        </div>
        <span className="text-xs font-bold text-slate-700" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
          {memory.totalCorrections} câu đã sửa
        </span>
        <span className="text-xs font-medium text-slate-500">
          {memory.practicedCount} đã luyện tập
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
        {memory.strongestTopic && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700" style={{ maxWidth: "100%", whiteSpace: "normal", overflowWrap: "break-word" }}>
            Mạnh nhất: {memory.strongestTopic}
          </span>
        )}
        {memory.topicNeedingReview && (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 font-bold text-amber-700" style={{ maxWidth: "100%", whiteSpace: "normal", overflowWrap: "break-word" }}>
            Cần ôn: {memory.topicNeedingReview}
          </span>
        )}
        {memory.lastPracticedTopic && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600" style={{ maxWidth: "100%", whiteSpace: "normal", overflowWrap: "break-word" }}>
            Gần nhất: {memory.lastPracticedTopic}
          </span>
        )}
      </div>
      {memory.suggestedNextFocus && (
        <div className="mt-2 text-xs font-medium text-indigo-600" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
          Gợi ý tiếp theo: {memory.suggestedNextFocus}
        </div>
      )}
    </section>
  );
}

export function TutorTodayLessonCard({ memoryLoaded, memory, onStartLesson }: TodayLessonProps) {
  if (!memoryLoaded) return null;
  const plan = planTodayLesson(memory);
  const modeLabel = {
    journey: "Journey",
    grammar: "Grammar",
    speak: "Speak",
    logic: "Logic",
  }[plan.suggestedMode];

  return (
    <section
      data-testid="ai-tutor-today-lesson"
      className="mx-auto mb-4 w-full max-w-3xl rounded-[18px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-4 py-4 shadow-sm"
      style={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden" }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs font-black uppercase text-emerald-700">
              Today's lesson
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black uppercase text-emerald-700 shadow-sm">
              {plan.estimatedMinutes} min
            </span>
          </div>
          <h2 className="mt-2 text-lg font-black leading-6 text-slate-950" style={{ overflowWrap: "break-word" }}>
            {plan.lessonTitle}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700" style={{ overflowWrap: "break-word" }}>
            {plan.reason}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <span className="w-fit rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-black uppercase text-emerald-800 shadow-sm">
            {modeLabel}
          </span>
          <button
            type="button"
            onClick={() => onStartLesson?.(plan.suggestedMode)}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Start today's lesson
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(160px,0.45fr)]">
        <div className="rounded-xl border border-slate-100 bg-white/80 p-3">
          <div className="text-[11px] font-black uppercase text-slate-500">
            Practice today
          </div>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs font-semibold leading-5 text-slate-700">
            {plan.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
          <div className="text-[11px] font-black uppercase text-emerald-700">
            Next focus
          </div>
          <div className="mt-2 text-sm font-black text-slate-900" style={{ overflowWrap: "break-word" }}>
            {plan.nextFocus}
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-600">
            Mercy will use this to recommend your next lesson.
          </div>
        </div>
      </div>
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
      className="mx-auto mb-5 w-full max-w-[720px] rounded-[16px] border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center"
    >
      <div className="text-xs font-medium text-slate-400">
        Chưa có lịch sử sửa câu cho {languageLabel}. Gửi câu đầu tiên để bắt đầu!
      </div>
    </section>
  );
}
