import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import {
  getSessionFeedback,
  type SessionFeedback,
} from "@/lib/interview/interviewSession";

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
