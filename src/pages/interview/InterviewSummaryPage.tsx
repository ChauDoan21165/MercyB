import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import {
  getSessionFeedback,
  type SessionFeedback,
} from "@/lib/interview/interviewSession";
import type { WritingRubric } from "@/lib/writing-feedback/rubric";
import type { L1WeaknessTag } from "@/lib/feedback/l1-error-detector";

export default function InterviewSummaryPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";

  const [feedback, setFeedback] = useState<SessionFeedback | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!sessionId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getSessionFeedback(sessionId).then((res) => {
      if (cancelled) return;
      setFeedback(res);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-3xl mx-auto text-sm text-black/50">
        Đang tải tổng kết…
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="px-4 py-6 max-w-3xl mx-auto text-sm text-black/60">
        <p>Không tìm thấy phiên phỏng vấn này.</p>
        <Link to="/interview" className="mt-3 inline-block text-emerald-700 underline">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const overall = feedback.session.overall_score ?? 0;
  const overallPct = Math.round(overall * 100);
  const answeredCount = feedback.perQuestion.filter(
    (p) => p.userAnswer.trim().length > 0,
  ).length;

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <Link
          to="/interview"
          className="text-xs text-black/50 hover:text-black/80"
        >
          ← Tất cả kịch bản
        </Link>
        <h1 className="text-2xl font-bold mt-2">{feedback.scenario.title_vi}</h1>
        <p className="text-xs text-black/55 italic">{feedback.scenario.title_en}</p>
      </header>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 mb-6">
        <div className="text-xs text-emerald-800 font-semibold mb-1">
          Điểm tổng
        </div>
        <div className="text-3xl font-bold text-emerald-900">
          {overallPct}/100
        </div>
        <div className="text-xs text-black/60 mt-1">
          Đã trả lời {answeredCount} / {feedback.scenario.questions.length} câu
        </div>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4 mb-6">
        <h2 className="text-sm font-semibold text-black/90 mb-2">
          Mercy đánh giá theo
        </h2>
        <ul className="text-sm text-black/75 list-disc pl-5 space-y-1">
          {feedback.scenario.evaluation_criteria.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </section>

      {answeredCount > 0 && (
        <RubricCard rubric={feedback.aggregatedRubric} />
      )}

      {feedback.topIssues.length > 0 && (
        <PracticeCard
          tags={feedback.topIssues}
          suggestions={feedback.microLessonSuggestions}
        />
      )}

      <h2 className="text-base font-semibold text-black/90 mb-3">
        Chi tiết từng câu
      </h2>
      <div className="space-y-4">
        {feedback.perQuestion.map((p) => {
          const pct = Math.round(p.score.overall * 100);
          return (
            <article
              key={p.questionIndex}
              className="rounded-xl border border-black/10 bg-white p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-black/50">
                  Câu {p.questionIndex + 1}
                </span>
                <span className="text-xs font-mono text-emerald-700">
                  {pct}/100
                </span>
              </div>
              <div className="text-sm font-semibold text-black/90">
                {p.prompt_vi}
              </div>
              <div className="text-xs text-black/55 italic mb-3">
                {p.prompt_en}
              </div>

              {p.userAnswer.trim() ? (
                <div className="rounded-lg border border-black/10 bg-slate-50 p-3 mb-3">
                  <div className="text-xs text-black/50 mb-1">Bạn đã nói:</div>
                  <p className="text-sm text-black/85">{p.userAnswer}</p>
                </div>
              ) : (
                <div className="text-xs text-black/50 italic mb-3">
                  Chưa trả lời câu này.
                </div>
              )}

              <p className="text-sm text-black/85">{p.score.feedback_vi}</p>

              {p.score.rubric && (
                <details className="mt-3">
                  <summary className="text-xs text-emerald-700 cursor-pointer">
                    Xem rubric chi tiết
                  </summary>
                  <div className="mt-2">
                    <RubricBars rubric={p.score.rubric} compact />
                  </div>
                </details>
              )}

              <details className="mt-3">
                <summary className="text-xs text-emerald-700 cursor-pointer">
                  Xem mẫu câu trả lời
                </summary>
                <div className="mt-2 text-sm text-black/85">{p.sample_answer_en}</div>
                <div className="text-xs text-black/55 italic mt-1">
                  {p.sample_answer_vi}
                </div>
              </details>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          to={`/interview/${slug}`}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold no-underline"
        >
          Làm lại kịch bản này
        </Link>
        <Link
          to="/interview"
          className="px-4 py-2 rounded-lg border border-black/15 text-sm font-semibold no-underline text-black/85"
        >
          Chọn kịch bản khác
        </Link>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────

const DIMENSION_LABELS: Array<{
  key: keyof WritingRubric;
  label_vi: string;
  label_en: string;
}> = [
  { key: "grammar",              label_vi: "Ngữ pháp",            label_en: "Grammar" },
  { key: "vocabulary",           label_vi: "Từ vựng",             label_en: "Vocabulary" },
  { key: "structure",            label_vi: "Cấu trúc",            label_en: "Structure" },
  { key: "spelling_punctuation", label_vi: "Chính tả & dấu câu",  label_en: "Spelling & punctuation" },
  { key: "coherence",            label_vi: "Mạch văn",            label_en: "Coherence" },
];

function RubricBars({
  rubric,
  compact = false,
}: {
  rubric: WritingRubric;
  compact?: boolean;
}) {
  return (
    <ul className={`space-y-${compact ? 1 : 2}`}>
      {DIMENSION_LABELS.map(({ key, label_vi, label_en }) => {
        const dim = rubric[key];
        const score = dim.score;
        return (
          <li key={key} className="flex items-center gap-3 text-xs">
            <span className="w-32 shrink-0 text-black/70">
              {label_vi}
              <span className="text-black/40 italic ml-1">{label_en}</span>
            </span>
            <span
              className="flex gap-1"
              role="img"
              aria-label={`${label_en} score ${score} out of 5`}
            >
              {[1, 2, 3, 4, 5].map((pip) => (
                <span
                  key={pip}
                  className={`inline-block w-3 h-3 rounded-sm ${
                    pip <= score ? "bg-emerald-500" : "bg-black/10"
                  }`}
                />
              ))}
            </span>
            <span className="text-black/50 font-mono">{score}/5</span>
          </li>
        );
      })}
    </ul>
  );
}

function RubricCard({ rubric }: { rubric: WritingRubric }) {
  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 mb-6">
      <h2 className="text-sm font-semibold text-black/90 mb-3">
        Đánh giá theo rubric (trung bình toàn phiên)
      </h2>
      <RubricBars rubric={rubric} />
      <p className="text-xs text-black/55 italic mt-3">
        Mức CEFR ước tính (theo từ vựng): <strong>{rubric.vocabulary.level_estimate}</strong>.
        Đây là số tham khảo, không phải kết quả chính thức.
      </p>
    </section>
  );
}

const TAG_LABELS_VI: Partial<Record<L1WeaknessTag, string>> = {
  vi_l1_3rd_person_s: "Thiếu -s ngôi 3 (he/she/it)",
  vi_l1_past_ed: "Thiếu -ed quá khứ",
  vi_l1_plural_s: "Thiếu -s số nhiều",
  vi_l1_missing_be: "Thiếu động từ to be",
  vi_l1_question_no_aux: "Câu hỏi thiếu trợ động từ",
  vi_l1_missing_article: "Thiếu mạo từ a/an/the",
  vi_l1_can_no_infinitive: "Sau modal phải dùng động từ nguyên thể",
  vi_l1_double_past: "Thì quá khứ kép (did + V-ed)",
  vi_l1_a_vs_an_vowel: "a vs an trước nguyên âm",
  vi_l1_comparative_double: "So sánh kép (more better)",
};

function PracticeCard({
  tags,
  suggestions,
}: {
  tags: L1WeaknessTag[];
  suggestions: SessionFeedback["microLessonSuggestions"];
}) {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6">
      <h2 className="text-sm font-semibold text-amber-900 mb-2">
        3 lỗi nên luyện tiếp
      </h2>
      <ul className="text-sm text-amber-900 list-disc pl-5 space-y-1">
        {tags.map((tag) => (
          <li key={tag}>
            {TAG_LABELS_VI[tag] ?? tag}
          </li>
        ))}
      </ul>
      {suggestions.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-amber-900 mb-2">
            Gợi ý bài học ngắn:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Link
                key={s.tag}
                to={`/learn/micro/${s.tag}`}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold no-underline hover:bg-amber-100"
              >
                {s.title_vi}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
