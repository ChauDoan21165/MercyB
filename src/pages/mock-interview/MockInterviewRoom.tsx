import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  PRO_VERTICAL_LABELS,
  getProScenarioById,
  type ProInterviewScenario,
  type ProVertical,
} from "@/data/mock-interviews/professional-scenarios";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import {
  getPromptsForInterview,
  type InterviewSessionPrompt,
} from "@/lib/interviewPrompts/mixPrompts";
import {
  trackCommunityPromptsUsedInRoom,
  trackInterviewCompleted,
  trackInterviewStarted,
} from "@/lib/interviewPrompts/telemetry";
import type { InterviewPromptProfession } from "@/lib/interviewPrompts/types";
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

// Vertical → community profession map. Only software currently has a
// reasonable counterpart in the community taxonomy ("tech-worker"); the
// other verticals (university/visa/promotion/sales) have no equivalent
// and the community panel won't surface for them. When the map returns
// null we render the room exactly as before.
const VERTICAL_TO_COMMUNITY_PROFESSION: Partial<
  Record<ProVertical, InterviewPromptProfession>
> = {
  software: "tech-worker",
};

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

  const access = useUserAccess();
  const entLoading = access.isLoading;
  // Canonical entitlement path: hasPremium is derived by useUserAccess from
  // resolveEntitlementTier(), which already covers active/trialing premium.
  const isPaid = access.hasPremium;
  const isTrial = false;

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

  // Phase 2 — community-prompts integration. Default-OFF; when the
  // feature flag is off the toggle UI doesn't render and sessionPrompts
  // stays null (existing scenario.typical_questions render path is
  // preserved bit-for-bit).
  const { enabled: communityEnabled } = useFeatureFlag(
    "mock_interview_community_enabled",
  );
  const communityProfession =
    scenario && VERTICAL_TO_COMMUNITY_PROFESSION[scenario.vertical];
  const communityAvailable = !!communityProfession;
  const showCommunityPanel = communityEnabled && communityAvailable;

  const [useCommunity, setUseCommunity] = useState<boolean>(true);
  const [communityRatio, setCommunityRatio] = useState<number>(50);
  const [sessionPrompts, setSessionPrompts] = useState<
    InterviewSessionPrompt[] | null
  >(null);

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

      if (result.kind === "allowed") {
        sessionIdRef.current = result.sessionId;
        if (!isPaid && !isTrial) recordStart();
      } else {
        // Server unreachable / unexpected. Fall back to the legacy
        // localStorage gate — soft cap remains in force, no revenue
        // lost on a brief outage.
        if (!isPaid && !isTrial) recordStart();
      }

      // Phase 2 — load mixed community/hardcoded prompts when enabled.
      // Errors fall back silently to all-hardcoded inside the helper.
      const total = scenario.typical_questions.length;
      const useMix =
        showCommunityPanel && useCommunity && communityRatio > 0 && communityProfession;

      if (useMix) {
        const wantedCommunity = Math.min(
          total,
          Math.ceil((total * communityRatio) / 100),
        );
        const wantedHardcoded = total - wantedCommunity;
        const hardcoded = scenario.typical_questions.map((q) => ({
          text: q.question_en,
          textVi: q.question_vi,
        }));
        try {
          const prompts = await getPromptsForInterview({
            profession: communityProfession,
            hardcodedPrompts: hardcoded,
            hardcodedCount: wantedHardcoded,
            communityCount: wantedCommunity,
          });
          setSessionPrompts(prompts);
          const communityShown = prompts.filter(
            (p) => p.source === "community",
          ).length;
          if (communityShown > 0) {
            trackCommunityPromptsUsedInRoom({
              profession: communityProfession,
              ratio: communityRatio / 100,
              community_count: communityShown,
              total_count: prompts.length,
            });
          }
        } catch {
          // Defensive — getPromptsForInterview already swallows errors.
          setSessionPrompts(null);
        }
      } else {
        setSessionPrompts(null);
      }

      trackInterviewStarted({
        profession: communityProfession ?? scenario.vertical,
        scenarioId: scenario.id,
        useCommunity: !!useMix,
        communityRatio: useMix ? communityRatio : 0,
      });

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
        showCommunityPanel={showCommunityPanel}
        useCommunity={useCommunity}
        setUseCommunity={setUseCommunity}
        communityRatio={communityRatio}
        setCommunityRatio={setCommunityRatio}
      />
    );
  }

  if (phase === "summary") {
    return (
      <SummaryPanel
        scenario={scenario}
        answers={answers}
        sessionPrompts={sessionPrompts}
        showCommunityShareCta={
          showCommunityPanel && !!communityProfession
        }
        communityProfession={communityProfession ?? null}
        onRestart={() => {
          setQuestionIndex(0);
          setAnswers([]);
          setDraft("");
          setSessionPrompts(null);
          setPhase("intro");
        }}
        onBackToIndex={() => navigate("/mock-interview")}
      />
    );
  }

  // Source of truth for the active deck:
  //   sessionPrompts (when community mixing produced a deck)
  //   else scenario.typical_questions (existing behaviour, unchanged)
  const totalQuestions = sessionPrompts
    ? sessionPrompts.length
    : scenario.typical_questions.length;
  const sessionPrompt = sessionPrompts ? sessionPrompts[questionIndex] : null;
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
      const completed = [...answers];
      // Account for the answer just submitted (it's already in
      // `answers` after submit() ran; we just count truthy entries).
      const completedPromptCount = completed.filter(Boolean).length;
      const communityShown = sessionPrompts
        ? sessionPrompts.filter((p) => p.source === "community").length
        : 0;
      trackInterviewCompleted({
        profession: communityProfession ?? scenario.vertical,
        scenarioId: scenario.id,
        useCommunity: communityShown > 0,
        communityRatio: sessionPrompts ? communityRatio : 0,
        completedPromptCount,
        communityPromptsShown: communityShown,
      });
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
        {sessionPrompt ? (
          <>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="text-sm font-semibold text-black/90">
                {sessionPrompt.textVi ?? sessionPrompt.text}
              </div>
              {sessionPrompt.source === "hardcoded" ? (
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                    DEPTH_COLOR[currentQuestion.depth]
                  }`}
                >
                  {DEPTH_LABEL_VI[currentQuestion.depth]}
                </span>
              ) : (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap bg-violet-100 text-violet-800">
                  Cộng đồng
                </span>
              )}
            </div>
            <div className="text-sm text-black/65 italic">
              {sessionPrompt.text}
            </div>
            {sessionPrompt.source === "community" && (
              <p
                className="mt-2 text-xs text-slate-500"
                data-testid="community-attribution"
              >
                Câu hỏi từ cộng đồng —{" "}
                {sessionPrompt.submitterDisplayName ?? "Anonymous"}
                {sessionPrompt.context ? ` · ${sessionPrompt.context}` : ""}
              </p>
            )}
          </>
        ) : (
          <>
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
          </>
        )}
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
  showCommunityPanel,
  useCommunity,
  setUseCommunity,
  communityRatio,
  setCommunityRatio,
}: {
  scenario: ProInterviewScenario;
  onStart: () => void;
  onBack: () => void;
  showFreeTierBadge: boolean;
  starting: boolean;
  showCommunityPanel: boolean;
  useCommunity: boolean;
  setUseCommunity: (v: boolean) => void;
  communityRatio: number;
  setCommunityRatio: (v: number) => void;
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

      {showCommunityPanel && (
        <section
          className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 mb-4"
          data-testid="community-preflight-panel"
        >
          <h2 className="text-sm font-semibold text-violet-900 mb-2">
            Câu hỏi từ cộng đồng
          </h2>
          <p className="text-xs text-violet-900/70 italic mb-3">
            Use community-curated questions — drawn from real interviews
            shared by other Vietnamese learners.
          </p>
          <label className="flex items-center gap-2 text-sm text-black/85 mb-3">
            <input
              type="checkbox"
              checked={useCommunity}
              onChange={(e) => setUseCommunity(e.target.checked)}
              data-testid="community-toggle"
              className="h-4 w-4 accent-violet-600"
            />
            <span>Sử dụng câu hỏi từ cộng đồng?</span>
          </label>
          <div
            className={
              useCommunity
                ? "transition-opacity"
                : "transition-opacity opacity-50 pointer-events-none"
            }
          >
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={communityRatio}
              onChange={(e) => setCommunityRatio(Number(e.target.value))}
              data-testid="community-ratio-slider"
              aria-label="Tỉ lệ câu hỏi từ cộng đồng"
              className="w-full accent-violet-600"
            />
            <div className="flex justify-between text-xs text-black/60 mt-1">
              <span>Hardcoded</span>
              <span data-testid="community-ratio-value">
                {communityRatio}%
              </span>
              <span>Cộng đồng</span>
            </div>
          </div>
        </section>
      )}

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
  sessionPrompts,
  showCommunityShareCta,
  communityProfession,
  onRestart,
  onBackToIndex,
}: {
  scenario: ProInterviewScenario;
  answers: string[];
  sessionPrompts: InterviewSessionPrompt[] | null;
  showCommunityShareCta: boolean;
  communityProfession: InterviewPromptProfession | null;
  onRestart: () => void;
  onBackToIndex: () => void;
}) {
  const answered = answers.filter(Boolean).length;
  const totalCount = sessionPrompts
    ? sessionPrompts.length
    : scenario.typical_questions.length;
  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-1">Hoàn thành phỏng vấn</h1>
      <p className="text-xs text-black/55 italic mb-4">
        {scenario.title_en} — interview complete
      </p>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-4">
        <p className="text-sm text-emerald-900">
          Bạn đã trả lời {answered} / {totalCount} câu.
        </p>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4 mb-4">
        <h2 className="text-sm font-semibold text-black/90 mb-2">
          Câu trả lời của bạn
        </h2>
        {sessionPrompts ? (
          <ol className="text-sm text-black/80 space-y-3 list-decimal pl-5">
            {sessionPrompts.map((p, i) => (
              <li key={i}>
                <div className="font-medium text-black/85">
                  {p.textVi ?? p.text}
                </div>
                <div className="text-xs italic text-black/55">{p.text}</div>
                {p.source === "community" && (
                  <div className="text-[11px] text-violet-700 mt-0.5">
                    Cộng đồng — {p.submitterDisplayName ?? "Anonymous"}
                  </div>
                )}
                <div className="mt-1 whitespace-pre-wrap text-black/80">
                  {answers[i] || (
                    <span className="text-black/40 italic">Chưa trả lời</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
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
        )}
      </section>

      {showCommunityShareCta && communityProfession && (
        <section
          className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 mb-4"
          data-testid="community-share-cta"
        >
          <h2 className="text-sm font-semibold text-violet-900 mb-1">
            Bạn đã được hỏi câu này trong phỏng vấn thật?
          </h2>
          <p className="text-sm text-black/75 mb-3">
            Đóng góp cho cộng đồng để giúp người Việt khác chuẩn bị tốt hơn.
          </p>
          <Link
            to={`/mock-interview/submit-prompt?profession=${communityProfession}`}
            className="inline-block px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold"
          >
            Chia sẻ câu hỏi của bạn →
          </Link>
        </section>
      )}

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
