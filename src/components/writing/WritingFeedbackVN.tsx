// src/components/writing/WritingFeedbackVN.tsx
//
// Vietnamese-aware essay feedback panel.
// Sits next to (not in place of) `EssayFeedbackPanel`:
//   - When the `vn_writing_feedback` flag is ON, the writing page renders
//     this component instead. It shows IELTS band estimate, base rubric
//     summary, detected VN-specific patterns with excerpts + fixes, and
//     personalised half-band advice from VN_BAND_RUBRIC.
//   - When the flag is OFF, the existing `EssayFeedbackPanel` renders
//     unchanged.
//
// Bilingual VI primary, EN secondary. No Tailwind tricks the existing
// panel doesn't already use — keeps visual continuity.
//
// Pure presentational: takes the `VnEnhancedFeedback` payload and
// renders it. No data fetching, no flag checking.

import React from "react";
import {
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Target,
} from "lucide-react";
import type { VnEnhancedFeedback } from "@/lib/writing-feedback/scoreEssayVN";

interface Props {
  feedback: VnEnhancedFeedback;
}

function bandColour(band: number): string {
  if (band >= 7.5) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (band >= 6.5) return "text-sky-700 bg-sky-50 border-sky-200";
  if (band >= 5.5) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-rose-700 bg-rose-50 border-rose-200";
}

export function WritingFeedbackVN({ feedback }: Props) {
  const { baseRubric, estimatedBand, detectedPatterns, bandRubric, topRevisions } = feedback;

  const allDimensions: { label_vi: string; label_en: string; score: number }[] = [
    { label_vi: "Ngữ pháp", label_en: "Grammar", score: baseRubric.grammar.score },
    { label_vi: "Từ vựng", label_en: "Vocabulary", score: baseRubric.vocabulary.score },
    { label_vi: "Cấu trúc", label_en: "Structure", score: baseRubric.structure.score },
    { label_vi: "Chính tả", label_en: "Spelling/Punctuation", score: baseRubric.spelling_punctuation.score },
    { label_vi: "Mạch văn", label_en: "Coherence", score: baseRubric.coherence.score },
  ];

  return (
    <div className="space-y-5">
      {/* IELTS band estimate (top-line metric) */}
      <div className={`rounded-xl border p-4 ${bandColour(estimatedBand)}`}>
        <div className="flex items-center gap-2">
          <Sparkles size={16} />
          <p className="text-xs font-bold uppercase tracking-wider">
            Band ước tính · IELTS Writing Task 2
          </p>
        </div>
        <p className="mt-1 text-3xl font-extrabold">
          {estimatedBand.toFixed(1)}
          <span className="ml-2 text-sm font-medium opacity-70">/ 9.0</span>
        </p>
        <p className="mt-1 text-xs opacity-70">
          Ước tính tự động · không thay thế phần chấm bài của giáo viên thật.
        </p>
      </div>

      {/* Base rubric pips */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Điểm theo từng tiêu chí · Per-criterion scores
        </p>
        <div className="space-y-2">
          {allDimensions.map((d) => (
            <div key={d.label_en} className="flex items-center gap-3">
              <div className="w-28 shrink-0">
                <div className="text-xs font-bold text-slate-900">{d.label_vi}</div>
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{d.label_en}</div>
              </div>
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full ${
                      idx < d.score ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="w-8 shrink-0 text-right text-xs font-bold tabular-nums text-slate-700">
                {d.score}/5
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detected VN patterns */}
      {detectedPatterns.length > 0 ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-rose-700">
            <AlertTriangle size={16} />
            <p className="text-xs font-bold uppercase tracking-wider">
              Lỗi thường gặp ở người Việt · Vietnamese learner patterns detected
            </p>
          </div>
          <p className="mb-3 text-xs text-rose-900/70">
            Đây là những lỗi thường thấy trong bài viết của người Việt — không phải mẫu chung.
          </p>
          <div className="space-y-3">
            {detectedPatterns.map(({ pattern, lineHits, excerpt }) => (
              <div
                key={pattern.id}
                className="rounded-lg border border-rose-200 bg-white p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">{pattern.vi_name}</p>
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                    {pattern.ielts_band_impact.toFixed(2)} band
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{pattern.en_name}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-700">
                  {pattern.description_vi}
                </p>
                {excerpt ? (
                  <p className="mt-2 rounded bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-700">
                    “{excerpt}”
                    {lineHits.length > 0 ? (
                      <span className="ml-2 text-slate-500">
                        (line {lineHits.slice(0, 3).join(", ")}
                        {lineHits.length > 3 ? `, +${lineHits.length - 3}` : ""})
                      </span>
                    ) : null}
                  </p>
                ) : null}
                {pattern.examples[0] ? (
                  <div className="mt-2 grid grid-cols-1 gap-1 text-[11px]">
                    <p>
                      <span className="font-bold text-rose-700">Sai:</span>{" "}
                      <span className="text-slate-700">{pattern.examples[0].wrong}</span>
                    </p>
                    <p>
                      <span className="font-bold text-emerald-700">Đúng:</span>{" "}
                      <span className="text-slate-700">{pattern.examples[0].correct}</span>
                    </p>
                    <p className="mt-1 text-slate-500">{pattern.examples[0].why_vi}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
          <p className="text-sm font-bold text-emerald-800">
            Không phát hiện lỗi thường gặp ở người Việt một cách rõ ràng.
          </p>
          <p className="mt-1 text-xs text-emerald-700/80">
            No clear Vietnamese-learner patterns detected. Heuristic does not replace examiner review.
          </p>
        </div>
      )}

      {/* Next half-band advice from VN_BAND_RUBRIC */}
      {bandRubric ? (
        <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sky-700">
            <Target size={16} />
            <p className="text-xs font-bold uppercase tracking-wider">
              Để lên band tiếp theo · To reach the next band
            </p>
          </div>
          <p className="text-xs font-bold text-sky-900">
            Band hiện tại · Currently at: Band {bandRubric.band.toFixed(1)}
            {bandRubric.next_half_band_weeks > 0 ? (
              <span className="ml-2 font-normal text-sky-700">
                · ~{bandRubric.next_half_band_weeks} tuần luyện tập tập trung
              </span>
            ) : null}
          </p>
          <div className="mt-2 space-y-2 text-xs leading-relaxed text-slate-800">
            <div>
              <p className="font-bold text-slate-900">Điểm mạnh · Strengths</p>
              <p>{bandRubric.strengths_vi}</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">Cần khắc phục · Recurring errors</p>
              <p>{bandRubric.recurring_errors_vi}</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">Bước tiếp theo · Next steps</p>
              <p>{bandRubric.next_half_band_steps_vi}</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Top revision suggestions */}
      {topRevisions.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            3 điểm nên sửa trước · Top 3 revisions
          </p>
          <ol className="space-y-2 text-xs leading-relaxed text-slate-700">
            {topRevisions.map((rev, idx) => (
              <li key={idx} className="flex gap-2">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-slate-500" />
                <span>{rev.vi}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

export default WritingFeedbackVN;
