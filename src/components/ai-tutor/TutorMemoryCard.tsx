// src/components/ai-tutor/TutorMemoryCard.tsx
// M3 aggregate memory card — correction count, topic pills, review prompt.
// Extracted from AiTutor.tsx.

import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";

type Props = {
  memoryLoaded: boolean;
  memory: MemorySummary | null;
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
