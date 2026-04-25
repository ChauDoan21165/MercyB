import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { getScenarioBySlug } from "@/data/mock-interviews/scenarios";
import {
  startSession,
  submitAnswer,
  type InterviewAnswer,
  type InterviewSession,
} from "@/lib/interview/interviewSession";

export default function InterviewSessionPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const scenario = getScenarioBySlug(slug);

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [lastFeedback, setLastFeedback] = useState<InterviewAnswer | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start the session as soon as auth resolves.
  useEffect(() => {
    let cancelled = false;
    if (!scenario || !user?.id) return;

    setBusy(true);
    startSession(user.id, slug).then((res) => {
      if (cancelled) return;
      setBusy(false);
      if (!res.ok) {
        setError(
          res.error === "scenario_not_found"
            ? "Không tìm thấy kịch bản."
            : "Không khởi tạo được phiên — thử lại sau.",
        );
        return;
      }
      setSession(res.session);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id, slug, scenario]);

  if (!scenario) {
    return (
      <div className="px-4 py-6 max-w-3xl mx-auto text-sm text-black/60">
        <p>Không tìm thấy kịch bản này.</p>
        <button
          onClick={() => navigate("/interview")}
          className="mt-3 text-emerald-700 underline"
        >
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  if (busy && !session) {
    return (
      <div className="px-4 py-6 max-w-3xl mx-auto text-sm text-black/50">
        Đang chuẩn bị phỏng vấn…
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 max-w-3xl mx-auto text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const totalQuestions = scenario.questions.length;
  const currentQuestion = scenario.questions[questionIndex];
  const isLastQuestion = questionIndex === totalQuestions - 1;

  const handleSubmit = async () => {
    if (!draft.trim() || busy) return;
    setBusy(true);
    setError(null);
    const res = await submitAnswer(session.id, questionIndex, draft);
    setBusy(false);
    if (!res.ok) {
      setError("Lưu câu trả lời không thành công — thử lại nhé.");
      return;
    }
    setSession(res.session);
    setLastFeedback(res.answer);
  };

  const handleNext = () => {
    setLastFeedback(null);
    setDraft("");
    if (isLastQuestion) {
      navigate(`/interview/${slug}/summary?sessionId=${session.id}`);
      return;
    }
    setQuestionIndex((i) => i + 1);
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <header className="mb-4">
        <button
          onClick={() => navigate("/interview")}
          className="text-xs text-black/50 hover:text-black/80"
        >
          ← Tất cả kịch bản
        </button>
        <h1 className="text-xl font-bold mt-2">{scenario.title_vi}</h1>
        <p className="text-xs text-black/55 italic">{scenario.title_en}</p>
        <div className="text-xs text-black/55 mt-2">
          Câu {questionIndex + 1} / {totalQuestions}
        </div>
      </header>

      <section className="rounded-xl border border-black/10 bg-white p-4 mb-4">
        <div className="text-sm font-semibold text-black/90 mb-1">
          {currentQuestion.prompt_vi}
        </div>
        <div className="text-sm text-black/60 italic">
          {currentQuestion.prompt_en}
        </div>
      </section>

      {!lastFeedback && (
        <section>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={busy}
            placeholder="Trả lời bằng tiếng Anh — tự nhiên, đủ ý, không cần hoa mỹ."
            className="w-full min-h-32 p-3 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleSubmit}
              disabled={busy || !draft.trim()}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-40"
            >
              {busy ? "Đang gửi…" : "Gửi câu trả lời"}
            </button>
            <span className="text-xs text-black/50">
              Ấn Gửi để xem góp ý ngay
            </span>
          </div>
        </section>
      )}

      {lastFeedback && (
        <FeedbackBlock
          answer={lastFeedback}
          whatToListenFor={currentQuestion.what_to_listen_for}
          commonMistakes={currentQuestion.common_mistakes_vi}
          sampleVi={currentQuestion.sample_answer_vi}
          sampleEn={currentQuestion.sample_answer_en}
          isLast={isLastQuestion}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

function FeedbackBlock({
  answer,
  whatToListenFor,
  commonMistakes,
  sampleVi,
  sampleEn,
  isLast,
  onNext,
}: {
  answer: InterviewAnswer;
  whatToListenFor: string[];
  commonMistakes: string[];
  sampleVi: string;
  sampleEn: string;
  isLast: boolean;
  onNext: () => void;
}) {
  const overallPct = Math.round(answer.score.overall * 100);

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-emerald-800">
            Góp ý của Mercy
          </span>
          <span className="text-xs font-mono text-emerald-700">
            {overallPct}/100
          </span>
        </div>
        <p className="text-sm text-black/85">{answer.score.feedback_vi}</p>
        <p className="text-xs text-black/55 italic mt-1">
          {answer.score.feedback_en}
        </p>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-semibold text-black/90 mb-2">
          Người phỏng vấn thật sẽ nghe gì
        </h3>
        <ul className="text-sm text-black/75 list-disc pl-5 space-y-1">
          {whatToListenFor.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h3 className="text-sm font-semibold text-amber-900 mb-2">
          Lỗi người Việt hay mắc ở câu này
        </h3>
        <ul className="text-sm text-black/80 list-disc pl-5 space-y-1">
          {commonMistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-semibold text-black/90 mb-2">
          Mẫu câu trả lời
        </h3>
        <p className="text-sm text-black/85">{sampleEn}</p>
        <p className="text-xs text-black/55 italic mt-1">{sampleVi}</p>
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={onNext}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold"
        >
          {isLast ? "Xem tổng kết" : "Câu tiếp theo →"}
        </button>
      </div>
    </section>
  );
}
