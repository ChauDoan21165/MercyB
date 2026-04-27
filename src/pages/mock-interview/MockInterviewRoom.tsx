import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  PRO_VERTICAL_LABELS,
  getProScenarioById,
  type ProInterviewScenario,
} from "@/data/mock-interviews/professional-scenarios";
import { useEntitlements } from "@/lib/useEntitlements";
import {
  checkGate,
  recordStart,
  type GateStatus,
} from "@/lib/mock-interview/rateLimit";
import {
  endMockInterviewSession,
  startMockInterviewSession,
  type StartGateResult,
} from "@/lib/mock-interview/serverGate";

const DEPTH_LABEL_VI: Record<string, string> = {
  surface: "Câu mở",
  "follow-up": "Câu đào sâu",
  "stress test": "Câu thử áp lực",
};

const DEPTH_COLOR: Record<string, string> = {
  surface: "bg-emerald-100 text-emerald-800",
  "follow-up": "bg-sky-100 text-sky-800",
  "stress test": "bg-rose-100 text-rose-800",
};

type Phase = "intro" | "asking" | "review" | "summary";

export default function MockInterviewRoom() {
  const { scenarioId = "" } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const scenario = useMemo(
    () => getProScenarioById(scenarioId),
    [scenarioId],
  );

  const { ent, loading: entLoading } = useEntitlements();

  const isPaid = !!ent?.is_premium && ent?.status === "active";
  const isTrial = !!ent?.is_premium && ent?.status === "trialing";

  const [gate, setGate] = useState<GateStatus | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [serverBlock, setServerBlock] = useState<{
    messageVi: string;
    messageEn: string;
    resetsAt: string;
    usedThisPeriod: number;
    limit: number;
  } | null>(null);
  const [starting, setStarting] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  // Compute the local soft-gate the moment entitlements settle. Server
  // gate (the authoritative one) fires when the user clicks "Bắt đầu".
  useEffect(() => {
    if (entLoading) return;
    setGate(checkGate({ isPaid, isTrial }));
  }, [entLoading, isPaid, isTrial]);

  // Best-effort end-session call when the room unmounts mid-interview.
  // The server-side reaper handles this for stale rows but the explicit
  // call gives us cleaner telemetry.
  useEffect(() => {
    return () => {
      const id = sessionIdRef.current;
      if (id) {
        void endMockInterviewSession(id);
        sessionIdRef.current = null;
      }
    };
  }, []);

  if (!scenario) {
    return <NotFoundPanel onBack={() => navigate("/mock-interview")} />;
  }

  if (entLoading || !gate) {
    return (
      <div className="px-4 py-10 max-w-3xl mx-auto text-sm text-black/55">
        Đang chuẩn bị phỏng vấn…
      </div>
    );
  }

  // Server gate (authoritative) takes precedence over the localStorage
  // soft gate. If the server says blocked, render the bilingual upgrade
  // panel from its message; otherwise fall back to the localStorage
  // gate while in transition (per the brief, localStorage stays as a
  // backstop until the server-side path soaks for a week).
  if (serverBlock && phase === "intro") {
    return (
      <ServerGateLockedPanel
        scenario={scenario}
        block={serverBlock}
        onBack={() => navigate("/mock-interview")}
      />
    );
  }
  if (!gate.allowed && phase === "intro") {
    return (
      <GateLockedPanel
        scenario={scenario}
        gate={gate}
        onBack={() => navigate("/mock-interview")}
      />
    );
  }

  const handleStart = async () => {
    if (starting) return;
    setStarting(true);
    try {
      const result: StartGateResult = await startMockInterviewSession(
        scenario.id,
      );
      if (result.kind === "allowed") {
        sessionIdRef.current = result.sessionId;
        // Keep the localStorage soft-counter in sync so the legacy gate
        // remains accurate during the transition window.
        if (!isPaid && !isTrial) recordStart();
        setPhase("asking");
        return;
      }
      if (result.kind === "blocked") {
        setServerBlock({
          messageVi: result.messageVi,
          messageEn: result.messageEn,
          resetsAt: result.resetsAt,
          usedThisPeriod: result.usedThisPeriod,
          limit: result.limit,
        });
        return;
      }
      // Server unreachable / unexpected. Fall back to the legacy
      // localStorage gate — soft cap remains in force, no revenue lost
      // on a brief outage. recordStart updates the local counter.
      if (!isPaid && !isTrial) recordStart();
      setPhase("asking");
    } finally {
      setStarting(false);
    }
  };

  if (phase === "intro") {
    return (
      <IntroPanel
        scenario={scenario}
        showFreeTierBadge={!isPaid && !isTrial}
        onStart={handleStart}
        starting={starting}
        onBack={() => navigate("/mock-interview")}
      />
    );
  }

  if (phase === "summary") {
    return (
      <SummaryPanel
        scenario={scenario}
        answers={answers}
        onRestart={() => {
          setQuestionIndex(0);
          setAnswers([]);
          setDraft("");
          setPhase("intro");
        }}
        onBackToIndex={() => navigate("/mock-interview")}
      />
    );
  }

  const totalQuestions = scenario.typical_questions.length;
  const currentQuestion = scenario.typical_questions[questionIndex];
  const isLastQuestion = questionIndex === totalQuestions - 1;

  const submit = () => {
    if (!draft.trim()) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = draft.trim();
      return next;
    });
    setPhase("review");
  };

  const advance = () => {
    setDraft("");
    if (isLastQuestion) {
      setPhase("summary");
      return;
    }
    setQuestionIndex((i) => i + 1);
    setPhase("asking");
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <Header
        scenario={scenario}
        questionIndex={questionIndex}
        total={totalQuestions}
        onBack={() => navigate("/mock-interview")}
      />

      <section className="rounded-xl border border-black/10 bg-white p-4 mb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="text-sm font-semibold text-black/90">
            {currentQuestion.question_vi}
          </div>
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
              DEPTH_COLOR[currentQuestion.depth]
            }`}
          >
            {DEPTH_LABEL_VI[currentQuestion.depth]}
          </span>
        </div>
        <div className="text-sm text-black/65 italic">
          {currentQuestion.question_en}
        </div>
      </section>

      {phase === "asking" && (
        <AnswerForm
          draft={draft}
          setDraft={setDraft}
          onSubmit={submit}
          isLastQuestion={isLastQuestion}
        />
      )}

      {phase === "review" && (
        <ReviewBlock
          scenario={scenario}
          questionIndex={questionIndex}
          userAnswer={answers[questionIndex] ?? ""}
          onAdvance={advance}
          isLastQuestion={isLastQuestion}
        />
      )}
    </div>
  );
}

function Header({
  scenario,
  questionIndex,
  total,
  onBack,
}: {
  scenario: ProInterviewScenario;
  questionIndex: number;
  total: number;
  onBack: () => void;
}) {
  return (
    <header className="mb-4">
      <button
        onClick={onBack}
        className="text-xs text-black/50 hover:text-black/80"
      >
        ← Tất cả kịch bản
      </button>
      <h1 className="text-xl font-bold mt-2">{scenario.title_vi}</h1>
      <p className="text-xs text-black/55 italic">{scenario.title_en}</p>
      <div className="text-xs text-black/55 mt-2">
        Câu {questionIndex + 1} / {total} ·{" "}
        {PRO_VERTICAL_LABELS[scenario.vertical].vi}
      </div>
    </header>
  );
}

function IntroPanel({
  scenario,
  onStart,
  onBack,
  showFreeTierBadge,
  starting,
}: {
  scenario: ProInterviewScenario;
  onStart: () => void;
  onBack: () => void;
  showFreeTierBadge: boolean;
  starting: boolean;
}) {
  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="text-xs text-black/50 hover:text-black/80"
      >
        ← Tất cả kịch bản
      </button>
      <h1 className="text-xl font-bold mt-2">{scenario.title_vi}</h1>
      <p className="text-xs text-black/55 italic mb-4">{scenario.title_en}</p>
      {showFreeTierBadge ? (
        <div
          className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-900"
          data-testid="mock-interview-free-tier-badge"
        >
          <span className="font-semibold">Free</span>
          <span>1 phỏng vấn / tuần · 1 mock interview / week</span>
        </div>
      ) : null}

      <section className="rounded-xl border border-black/10 bg-white p-4 mb-4">
        <h2 className="text-sm font-semibold text-black/90 mb-1">
          Bối cảnh phỏng vấn
        </h2>
        <p className="text-sm text-black/75 leading-relaxed">
          {scenario.context}
        </p>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-4">
        <h2 className="text-sm font-semibold text-amber-900 mb-2">
          Lỗi người Việt hay mắc trong kịch bản này
        </h2>
        <ul className="text-sm text-black/80 list-disc pl-5 space-y-1">
          {scenario.vietnamese_speaker_pitfalls.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4 mb-6">
        <h2 className="text-sm font-semibold text-black/90 mb-1">
          Mercy sẽ đóng vai
        </h2>
        <p className="text-sm text-black/70 italic">
          {scenario.interviewer_system_prompt}
        </p>
      </section>

      <button
        onClick={onStart}
        disabled={starting}
        className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50"
      >
        {starting ? "Đang chuẩn bị…" : `Bắt đầu phỏng vấn — ${scenario.typical_questions.length} câu, ~${scenario.estimated_time_minutes} phút`}
      </button>
    </div>
  );
}

function AnswerForm({
  draft,
  setDraft,
  onSubmit,
  isLastQuestion,
}: {
  draft: string;
  setDraft: (s: string) => void;
  onSubmit: () => void;
  isLastQuestion: boolean;
}) {
  return (
    <section>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Trả lời bằng tiếng Anh — tự nhiên, đủ ý. Bạn có thể dùng tab Speak để luyện phát âm câu trả lời này trước khi gửi."
        className="w-full min-h-32 p-3 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={onSubmit}
          disabled={!draft.trim()}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-40"
        >
          {isLastQuestion ? "Gửi và xem tổng kết" : "Gửi và xem góp ý"}
        </button>
        <span className="text-xs text-black/50">
          Có thể luyện phát âm trước khi gửi qua tab Speak
        </span>
      </div>
    </section>
  );
}

function ReviewBlock({
  scenario,
  questionIndex,
  userAnswer,
  onAdvance,
  isLastQuestion,
}: {
  scenario: ProInterviewScenario;
  questionIndex: number;
  userAnswer: string;
  onAdvance: () => void;
  isLastQuestion: boolean;
}) {
  // For follow-up questions we still surface the scenario-level coaching
  // because each question shares the same Vietnamese-speaker context.
  const isHeadline = questionIndex === 0;

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <h3 className="text-sm font-semibold text-emerald-900 mb-1">
          Câu trả lời của bạn
        </h3>
        <p className="text-sm text-black/85 whitespace-pre-wrap">{userAnswer}</p>
      </div>

      {isHeadline && (
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h3 className="text-sm font-semibold text-black/90 mb-2">
            Mẫu câu trả lời mạnh (band 7+)
          </h3>
          <p className="text-sm text-black/85 leading-relaxed">
            {scenario.sample_strong_answer}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
        <h3 className="text-sm font-semibold text-rose-900 mb-2">
          Tránh nói thế này
        </h3>
        <ul className="text-sm text-black/85 space-y-3">
          {scenario.common_weak_phrasings.map((wp, i) => (
            <li key={i}>
              <div className="text-rose-800">
                <span className="font-medium">✗</span> {wp.what_not_to_say}
              </div>
              <div className="text-xs text-black/60 mt-0.5 italic">
                {wp.why}
              </div>
              <div className="text-emerald-800 mt-0.5">
                <span className="font-medium">✓</span> {wp.better_alternative}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={onAdvance}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold"
        >
          {isLastQuestion ? "Xem tổng kết" : "Câu tiếp theo →"}
        </button>
      </div>
    </section>
  );
}

function SummaryPanel({
  scenario,
  answers,
  onRestart,
  onBackToIndex,
}: {
  scenario: ProInterviewScenario;
  answers: string[];
  onRestart: () => void;
  onBackToIndex: () => void;
}) {
  const answered = answers.filter(Boolean).length;
  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-1">Hoàn thành phỏng vấn</h1>
      <p className="text-xs text-black/55 italic mb-4">
        {scenario.title_en} — interview complete
      </p>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-4">
        <p className="text-sm text-emerald-900">
          Bạn đã trả lời {answered} / {scenario.typical_questions.length} câu.
        </p>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4 mb-4">
        <h2 className="text-sm font-semibold text-black/90 mb-2">
          Câu trả lời của bạn
        </h2>
        <ol className="text-sm text-black/80 space-y-3 list-decimal pl-5">
          {scenario.typical_questions.map((q, i) => (
            <li key={i}>
              <div className="font-medium text-black/85">{q.question_vi}</div>
              <div className="text-xs italic text-black/55">{q.question_en}</div>
              <div className="mt-1 whitespace-pre-wrap text-black/80">
                {answers[i] || (
                  <span className="text-black/40 italic">Chưa trả lời</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRestart}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
        >
          Luyện lại kịch bản này
        </button>
        <button
          onClick={onBackToIndex}
          className="px-4 py-2 rounded-lg border border-black/15 text-sm font-semibold"
        >
          Chọn kịch bản khác
        </button>
      </div>
    </div>
  );
}

function GateLockedPanel({
  scenario,
  gate,
  onBack,
}: {
  scenario: ProInterviewScenario;
  gate: GateStatus;
  onBack: () => void;
}) {
  // Only called when allowed === false; narrow the type.
  if (gate.allowed) return null;

  const resetDate = new Date(gate.resetsAt);
  const dateLabel = resetDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="text-xs text-black/50 hover:text-black/80"
      >
        ← Tất cả kịch bản
      </button>
      <h1 className="text-xl font-bold mt-2">{scenario.title_vi}</h1>
      <p className="text-xs text-black/55 italic mb-4">{scenario.title_en}</p>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-base font-semibold text-amber-900 mb-1">
          Bạn đã dùng hết phỏng vấn miễn phí của tuần này
        </h2>
        <p className="text-sm text-black/80">
          Free tier: 1 phỏng vấn / tuần. Có thể luyện tiếp vào ngày{" "}
          <strong>{dateLabel}</strong>, hoặc nâng cấp để luyện không giới hạn.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <a
            href="/pricing"
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
          >
            Nâng cấp gói trả phí
          </a>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-black/15 text-sm font-semibold"
          >
            Quay lại danh sách
          </button>
        </div>
      </section>
    </div>
  );
}

function ServerGateLockedPanel({
  scenario,
  block,
  onBack,
}: {
  scenario: ProInterviewScenario;
  block: {
    messageVi: string;
    messageEn: string;
    resetsAt: string;
    usedThisPeriod: number;
    limit: number;
  };
  onBack: () => void;
}) {
  const resetLabel = block.resetsAt
    ? new Date(block.resetsAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="text-xs text-black/50 hover:text-black/80"
      >
        ← Tất cả kịch bản
      </button>
      <h1 className="text-xl font-bold mt-2">{scenario.title_vi}</h1>
      <p className="text-xs text-black/55 italic mb-4">{scenario.title_en}</p>

      <section
        className="rounded-xl border border-amber-200 bg-amber-50 p-5"
        data-testid="mock-interview-server-block-panel"
      >
        <h2 className="text-base font-semibold text-amber-900 mb-1">
          Đã hết lượt mock interview tuần này
        </h2>
        <p className="text-xs text-amber-800/80 italic mb-3">
          Out of mock interviews this week
        </p>
        <p className="text-sm text-black/80">{block.messageVi}</p>
        <p className="text-xs text-black/55 italic mt-1">{block.messageEn}</p>
        <p className="text-xs text-black/60 mt-3">
          Đã dùng: {block.usedThisPeriod} / {block.limit} tuần này
          {resetLabel ? ` · Tuần mới bắt đầu ${resetLabel}` : ""}.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <a
            href="/pricing"
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
          >
            Bắt đầu trial 3 ngày · Start 3-day trial
          </a>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-black/15 text-sm font-semibold"
          >
            Quay lại danh sách
          </button>
        </div>
      </section>
    </div>
  );
}

function NotFoundPanel({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-4 py-10 max-w-3xl mx-auto text-sm text-black/60">
      <p>Không tìm thấy kịch bản này.</p>
      <button
        onClick={onBack}
        className="mt-3 text-emerald-700 underline"
      >
        ← Quay lại danh sách
      </button>
    </div>
  );
}
