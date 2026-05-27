// src/pages/AiTutor.tsx
// AI Tutor page orchestrator — delegates the shared Teacher Mercy frame to
// TeacherMercyLearningShell and keeps product behavior local/mock-only.

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  putCorrection,
  markPracticed,
  getMemorySummary,
  type TutorProduct,
} from "@/lib/ai-tutor/learningMemory";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import { useBrowserStt } from "@/lib/ai-tutor/useBrowserStt";
import { useTtsSpeaker } from "@/lib/ai-tutor/useTtsSpeaker";
import {
  MOCK_RESULTS_BY_TARGET,
  buildInputAwareCorrection,
  getTutorTargetFromSearch,
  getExplainLanguage,
  normalizeSpokenText,
  appendCleanSpeech,
} from "@/lib/ai-tutor/tutorUiCopy";
import { getTutorCopy, type TutorCopy, type TutorTarget } from "@/lib/tutor/tutorCopy";
import { getSpeechLocale, getTtsLocale } from "@/lib/tutor/languageRegistry";
import type { ExplainLanguage } from "@/lib/ai-tutor/tutorUiCopy";
import {
  buildConversationTurn,
  buildCorrectionTurn,
  getSpeakableText,
} from "@/lib/tutor/tutorEngine";
import type { TutorTurn } from "@/lib/tutor/tutorTypes";
import {
  aiTutor as aiTutorConfig,
  getSafetyLabel,
  resolveExplainLanguage,
  type TutorProductMode,
} from "@/lib/tutor/productConfigs";
import { isPlacementEntryRouteAvailable } from "@/lib/placement/availability";
import { reportRouteMountPerf } from "@/lib/monitoring/routePerf";
import {
  AI_CORRECTION_REQUIRED_MESSAGE,
  correctWithTutorRules,
} from "@/lib/tutor/correctionEngine";
import {
  diagnoseVietlishLogicWithMatch,
  type VietlishLogicDiagnosisResult,
} from "@/lib/tutor/vietlishLogicEngine";
import type { TodayLessonPlan } from "@/lib/tutor/todayLessonPlanner";
import {
  clearStudySessionState,
  loadStudySessionState,
  recordStudyPromptCompleted,
  recordStudyRetry,
  startStudySession,
  type StudySessionState,
} from "@/lib/tutor/studySessionState";
import { recordLearningEvent } from "@/lib/tutor/learningEvents";
import {
  getLocalLearningEventProgressSummary,
  type LearningEventProgressSummary,
} from "@/lib/tutor/learningEventSummary";
import CorrectionMode from "@/components/ai-tutor/CorrectionMode";
import { detectEnVnError, detectL1Error } from "@/lib/feedback";
import {
  getDetectorHint,
  hasShownHint,
  type DetectorHintContent,
} from "@/lib/ai-tutor/detectorHint";
import ConversationMode, {
  type ConversationMessage,
  type MercyConversationMessage,
} from "@/components/ai-tutor/ConversationMode";
import TutorMemoryCard, {
  TutorMemoryEmpty,
  TutorMomentumCard,
  TutorTodayLessonCard,
} from "@/components/ai-tutor/TutorMemoryCard";
import TeacherMercyLearningShell from "@/components/teacher-mercy/TeacherMercyLearningShell";

type CorrectionResult = TutorTurn & {
  grammarTip: string;
  practicePrompt: string;
};

type PracticeFeedback = {
  encouragement: string;
  tip: string;
  nextStep: string;
};

type ActiveTodayLesson = {
  plan: TodayLessonPlan;
  prompt: string;
  resumed: boolean;
};

type TutorMode = Extract<TutorProductMode, "journey" | "grammar" | "speak" | "logic">;
type ConversationTutorMode = Exclude<TutorMode, "grammar">;

const AI_TUTOR_MODES: TutorMode[] = aiTutorConfig.modes.filter(
  (mode): mode is TutorMode => mode === "journey" || mode === "grammar" || mode === "speak" || mode === "logic",
);

const MOCK_DELAY_MS = 600;
const TUTOR_PRODUCT: TutorProduct = "ai-tutor";
const MEMORY_TOPIC_BY_TARGET: Record<TutorTarget, string> = {
  en: "english-correction",
  fr: "french-correction",
  zh: "chinese-correction",
  de: "german-correction",
  ja: "japanese-correction",
  ko: "korean-correction",
  es: "spanish-correction",
  vi: "vietnamese-correction",
};

const LOGIC_STARTER_PROMPTS = [
  "Vì sao nói “I’m interested in English” mà không nói “I’m interesting in English”?",
  "Vì sao nói “I go to school” mà không nói “I go school”?",
  "Vì sao “I bought a hat yesterday” đúng hơn “I buy a hat yesterday”?",
] as const;

function createLogicOpeningMessage(explainLanguage: ExplainLanguage): MercyConversationMessage {
  const { turn } = buildConversationTurn({
    id: "mercy-logic-open-en",
    targetLanguage: "en",
    explainLanguage,
    userText: "",
    correctedText: "",
    explanation: "",
    naturalReply: explainLanguage === "vi"
      ? "Chọn một câu bên dưới hoặc nhập câu tiếng Anh/Vietlish của bạn. Mercy sẽ giải thích cấu trúc tự nhiên, lỗi dịch từng chữ, mẫu cần nhớ và ví dụ đối chiếu Việt-Anh."
      : "Choose a question below or enter an English/Vietlish sentence. Mercy will explain the natural English structure, the word-for-word Vietnamese trap, the pattern to remember, and contrast examples.",
    nextQuestion: LOGIC_STARTER_PROMPTS[0],
  });
  return { ...turn, role: "mercy" };
}

function createOpeningMessage(
  target: TutorTarget,
  explainLanguage: ExplainLanguage,
  mode: ConversationTutorMode = "journey",
): MercyConversationMessage {
  if (mode === "logic") return createLogicOpeningMessage(explainLanguage);

  const tutorCopy = getTutorCopy(target, explainLanguage);
  const { turn } = buildConversationTurn({
    id: `mercy-open-${target}`,
    targetLanguage: target,
    explainLanguage,
    userText: "",
    correctedText: "",
    explanation: "",
    naturalReply: "",
    nextQuestion: tutorCopy.starterQuestions[0] ?? "",
  });
  return { ...turn, role: "mercy" };
}

function buildLocalCorrection(
  input: string,
  target: TutorTarget,
): { ok: true; corrected: string } | { ok: false; message: string } {
  if (target === "en") {
    const result = correctWithTutorRules(input, "en");
    if (result.status === "needs_ai") {
      return { ok: false, message: result.message || AI_CORRECTION_REQUIRED_MESSAGE };
    }
    return { ok: true, corrected: result.corrected };
  }

  return { ok: true, corrected: buildInputAwareCorrection(input, target) };
}

function buildConversationReply(
  userText: string,
  target: TutorTarget,
  explainLanguage: ExplainLanguage,
  mode: TutorMode,
): MercyConversationMessage {
  if (mode === "logic") return buildLogicReply(userText, explainLanguage);

  const localCorrection = buildLocalCorrection(userText, target);
  const mock = MOCK_RESULTS_BY_TARGET[target];
  const tutorCopy = getTutorCopy(target, explainLanguage);
  const { turn } = buildConversationTurn({
    id: `mercy-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    targetLanguage: target,
    explainLanguage,
    userText,
    correctedText: localCorrection.ok ? localCorrection.corrected : "",
    explanation: localCorrection.ok ? mock.explanation[explainLanguage] : localCorrection.message,
    naturalReply: localCorrection.ok
      ? tutorCopy.naturalReplies[0] ?? tutorCopy.ui.emptyConversation
      : tutorCopy.ui.conversationFallback,
    nextQuestion: tutorCopy.nextQuestionTemplates[0] ?? "",
  });
  return { ...turn, role: "mercy" };
}

function buildLogicReply(userText: string, explainLanguage: ExplainLanguage): MercyConversationMessage {
  const diagnosis = diagnoseVietlishLogicWithMatch(userText);
  const fallbackPrefix = diagnosis.fallbackMessage ? `${diagnosis.fallbackMessage} ` : "";
  const explanation = explainLanguage === "vi"
    ? `${fallbackPrefix}Cách nghĩ tiếng Việt: ${diagnosis.vietnameseThinking} Logic tiếng Anh: ${diagnosis.englishLogic}`
    : `${fallbackPrefix}Vietnamese thinking: ${diagnosis.vietnameseThinking} English logic: ${diagnosis.englishLogic}`;
  const naturalReply = explainLanguage === "vi"
    ? `Mẫu cần nhớ: ${diagnosis.rememberRule}`
    : `Remember rule: ${diagnosis.rememberRule}`;

  const { turn } = buildConversationTurn({
    id: `mercy-logic-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    targetLanguage: "en",
    explainLanguage,
    userText,
    correctedText: diagnosis.correctedExample,
    explanation,
    naturalReply,
    nextQuestion: diagnosis.retryPrompt,
  });
  return { ...turn, role: "mercy", logicDiagnosis: diagnosis };
}

function buildTodayLessonPrompt(plan: TodayLessonPlan, target: TutorTarget): string {
  if (plan.suggestedMode === "logic") {
    return "Try this sentence: I go school.";
  }
  if (plan.suggestedMode === "speak") {
    return `Type one clean ${target.toUpperCase()} sentence about ${plan.nextFocus}, then practice saying it once.`;
  }
  if (plan.suggestedMode === "journey") {
    return `Answer in one short ${target.toUpperCase()} sentence: What did you do today?`;
  }
  if (plan.nextFocus.toLowerCase().includes("past")) {
    return "Write one sentence about yesterday. Example idea: I buy a hat yesterday.";
  }
  return `Write one short ${target.toUpperCase()} sentence about ${plan.nextFocus}.`;
}

function displaySafeTopic(topicId: string): string {
  return topicId.replace(/-/g, " ").trim() || "starter sentence";
}

function buildResumedTodayLesson(state: StudySessionState, target: TutorTarget): ActiveTodayLesson {
  const focus = displaySafeTopic(state.suggestedNextFocus || state.lastSafeTopicTag);
  const plan: TodayLessonPlan = {
    lessonTitle: `Continue ${focus} today`,
    targetSkill: focus,
    reason: "Resumed from local Today’s Lesson session state.",
    steps: [
      "Continue the current prompt.",
      "Review Mercy's correction or explanation.",
      "Retry the mistake once.",
      "Apply one pattern in a new example.",
      "Save the next focus.",
    ],
    estimatedMinutes: state.recommendedMode === "journey" ? 8 : 7,
    suggestedMode: state.recommendedMode,
    nextFocus: focus,
  };

  return {
    plan,
    prompt: buildTodayLessonPrompt(plan, target),
    resumed: true,
  };
}

function getLatestMercyMessage(messages: ConversationMessage[]): MercyConversationMessage | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "mercy" && message.userText) return message;
  }
  return null;
}

type TodayLessonLoopPanelProps = {
  lesson: ActiveTodayLesson;
  mode: TutorMode;
  result: CorrectionResult | null;
  practiceFeedback: PracticeFeedback | null;
  latestMercyMessage: MercyConversationMessage | null;
  logicInsight: VietlishLogicDiagnosisResult | null;
  sessionState: StudySessionState | null;
  memory: MemorySummary | null;
  onRestart: () => void;
};

function TodayLessonLoopPanel({
  lesson,
  mode,
  result,
  practiceFeedback,
  latestMercyMessage,
  logicInsight,
  sessionState,
  memory,
  onRestart,
}: TodayLessonLoopPanelProps) {
  const hasFeedback = Boolean(result || latestMercyMessage);
  const retryPrompt = result?.practicePrompt || latestMercyMessage?.nextQuestion || lesson.plan.steps[2];
  const nextFocus = memory?.suggestedNextFocus || memory?.nextRecommendedFocus || lesson.plan.nextFocus;

  return (
    <section
      data-testid="ai-tutor-lesson-loop"
      className="mx-auto mb-4 w-full max-w-3xl rounded-[16px] border border-emerald-200 bg-white px-4 py-4 shadow-sm"
      style={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase text-emerald-700">
            {lesson.resumed ? "Continue today's lesson" : "5-minute lesson loop"} · {mode}
          </div>
          <h2 className="mt-1 text-lg font-black leading-6 text-slate-950" style={{ overflowWrap: "break-word" }}>
            {lesson.plan.lessonTitle}
          </h2>
          <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold leading-6 text-emerald-900" style={{ overflowWrap: "break-word" }}>
            Prompt: {lesson.prompt}
          </p>
        </div>
        <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase text-slate-600">
          {lesson.plan.estimatedMinutes} min
        </span>
      </div>
      {lesson.resumed && (
        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900">
          Resume lesson: your local progress is restored.
        </div>
      )}

      {sessionState && (
        <div
          data-testid="ai-tutor-study-session-state"
          className="mt-3 flex flex-wrap gap-2 text-[11px] font-black uppercase text-slate-600"
        >
          <span className="rounded-full bg-slate-50 px-2.5 py-1">Step {sessionState.currentStep}</span>
          <span className="rounded-full bg-slate-50 px-2.5 py-1">Retries {sessionState.retryCount}</span>
          <span className="rounded-full bg-slate-50 px-2.5 py-1">Completed {sessionState.completedPromptsCount}</span>
          {sessionState.lastSafeTopicTag && (
            <span className="rounded-full bg-slate-50 px-2.5 py-1">Topic {sessionState.lastSafeTopicTag}</span>
          )}
        </div>
      )}

      <div className="mt-3 grid gap-2 text-xs font-bold text-slate-700 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          1. Answer the prompt
        </div>
        <div className={`rounded-xl border px-3 py-2 ${hasFeedback ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-slate-50"}`}>
          2. Review Mercy feedback
        </div>
        <div className={`rounded-xl border px-3 py-2 ${practiceFeedback ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-slate-50"}`}>
          3. Retry once
        </div>
      </div>

      {hasFeedback && (
        <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-sm font-bold leading-6 text-indigo-900" style={{ overflowWrap: "break-word" }}>
          Retry: {retryPrompt}
        </div>
      )}

      {logicInsight?.isKnownPattern && (
        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm font-semibold leading-6 text-amber-950" style={{ overflowWrap: "break-word" }}>
          Vietlish logic insight: {logicInsight.englishLogic}
        </div>
      )}

      {nextFocus && (
        <div className="mt-3 text-xs font-bold text-slate-500" style={{ overflowWrap: "break-word" }}>
          Memory next focus: {nextFocus}
        </div>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="mt-3 inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
      >
        Restart lesson
      </button>
    </section>
  );
}

export default function AiTutorPage() {
  // Route mount-perf observer. Captured first so the elapsed time
  // covers the full hook prologue + render. Breadcrumb-only via
  // reportRouteMountPerf; zero behavior change.
  const routeMountStartRef = useRef<number>(performance.now());
  useEffect(() => {
    reportRouteMountPerf("ai_tutor", performance.now() - routeMountStartRef.current);
  }, []);

  const shellRef = useRef<HTMLElement | null>(null);
  const resumedLessonEventRef = useRef<string | null>(null);
  const nextFocusViewedEventRef = useRef<string | null>(null);
  const { user } = useAuth();

  const [target, setTarget] = useState<TutorTarget>(() =>
    typeof window === "undefined"
      ? (aiTutorConfig.defaultTargetLanguage as TutorTarget)
      : getTutorTargetFromSearch(
        window.location.search,
        aiTutorConfig.allowedTargetLanguages,
        aiTutorConfig.defaultTargetLanguage as TutorTarget,
      ),
  );
  const [explainLanguage, setExplainLanguage] = useState<ExplainLanguage>(() =>
    resolveExplainLanguage(aiTutorConfig, getExplainLanguage(), target),
  );
  const speechLang = getSpeechLocale(target);
  const ttsLang = getTtsLocale(target);
  const stt = useBrowserStt(speechLang);
  const tts = useTtsSpeaker();

  const nickname: string | undefined =
    (user?.user_metadata as Record<string, unknown> | undefined)?.nickname as string | undefined;
  const greetingName = (nickname ?? "").trim() || undefined;

  const [mode, setMode] = useState<TutorMode>("grammar");
  const [input, setInput] = useState("");
  const [conversationInput, setConversationInput] = useState("");
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>(() => [
    createOpeningMessage(
      typeof window === "undefined"
        ? (aiTutorConfig.defaultTargetLanguage as TutorTarget)
        : getTutorTargetFromSearch(
          window.location.search,
          aiTutorConfig.allowedTargetLanguages,
          aiTutorConfig.defaultTargetLanguage as TutorTarget,
        ),
      resolveExplainLanguage(aiTutorConfig, getExplainLanguage(), typeof window === "undefined"
        ? aiTutorConfig.defaultTargetLanguage
        : getTutorTargetFromSearch(
          window.location.search,
          aiTutorConfig.allowedTargetLanguages,
          aiTutorConfig.defaultTargetLanguage as TutorTarget,
        )),
    ),
  ]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [detectorHint, setDetectorHint] = useState<DetectorHintContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<PracticeFeedback | null>(null);
  const [practiceLoading, setPracticeLoading] = useState(false);

  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const [memory, setMemory] = useState<MemorySummary | null>(null);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const [isFloatingShell, setIsFloatingShell] = useState(true);
  const [activeTodayLesson, setActiveTodayLesson] = useState<ActiveTodayLesson | null>(null);
  const [todayLessonLogicInsight, setTodayLessonLogicInsight] = useState<VietlishLogicDiagnosisResult | null>(null);
  const [studySessionState, setStudySessionState] = useState<StudySessionState | null>(null);
  const [localEventSummary, setLocalEventSummary] = useState<LearningEventProgressSummary>(() => getLocalLearningEventProgressSummary());

  const tutorCopy: TutorCopy = getTutorCopy(target, explainLanguage);
  const aiTutorTabLabels: Record<TutorMode, string> = {
    journey: tutorCopy.ui.journeyModeLabel,
    grammar: tutorCopy.ui.grammarModeLabel,
    speak: tutorCopy.ui.speakModeLabel,
    logic: tutorCopy.ui.logicModeLabel,
  };
  const modeTabs = AI_TUTOR_MODES.map((mode) => ({
    id: mode,
    label: aiTutorTabLabels[mode],
  }));
  const isCorrectionMode = mode === "grammar";
  const latestMercyMessage = getLatestMercyMessage(conversationMessages);
  const refreshLocalEventSummary = () => setLocalEventSummary(getLocalLearningEventProgressSummary());

  const recordAiTutorEvent = (
    eventType: Parameters<typeof recordLearningEvent>[0]["eventType"],
    details: Omit<Parameters<typeof recordLearningEvent>[0], "eventType" | "product" | "targetLanguage"> = {},
  ) => {
    recordLearningEvent({
      eventType,
      product: "ai_tutor",
      targetLanguage: target,
      ...details,
    });
    refreshLocalEventSummary();
  };

  const sttBaseInputRef = useRef<string>("");
  const lastCommittedSttRef = useRef<string>("");
  const wasListeningRef = useRef(false);

  useEffect(() => {
    const transcript = normalizeSpokenText(stt.transcript);
    if (stt.listening) {
      wasListeningRef.current = true;
      if (transcript) {
        const next = appendCleanSpeech(sttBaseInputRef.current, transcript);
        if (mode !== "grammar") setConversationInput(next);
        else setInput(next);
      }
      return;
    }
    if (wasListeningRef.current) {
      wasListeningRef.current = false;
      if (!transcript || transcript === lastCommittedSttRef.current) return;
      lastCommittedSttRef.current = transcript;
      const next = appendCleanSpeech(sttBaseInputRef.current, transcript);
      if (mode !== "grammar") setConversationInput(next);
      else setInput(next);
    }
  }, [mode, stt.listening, stt.transcript]);

  const handleMicToggle = () => {
    if (stt.listening) { stt.stop(); return; }
    sttBaseInputRef.current = mode !== "grammar" ? conversationInput : input;
    lastCommittedSttRef.current = "";
    stt.start();
  };

  const loadMemory = async () => {
    try { setMemory(await getMemorySummary(TUTOR_PRODUCT, target)); } catch { /* degrade */ }
    setMemoryLoaded(true);
  };

  useEffect(() => { loadMemory(); }, [target]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;
    const detectLayoutMode = () => {
      const shellWidth = shell.getBoundingClientRect().width;
      const explicitFloatingShell = Boolean(
        shell.parentElement?.closest(
          ["[data-floating-shell]", "[data-ai-tutor-floating-shell]", "[data-mercy-floating-shell]",
            ".ai-tutor-floating-shell", ".mercy-floating-shell"].join(","),
        ),
      );
      setIsFloatingShell(explicitFloatingShell || shellWidth < 1040);
    };
    detectLayoutMode();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", detectLayoutMode);
      return () => window.removeEventListener("resize", detectLayoutMode);
    }
    const observer = new ResizeObserver(detectLayoutMode);
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncTarget = () => setTarget(getTutorTargetFromSearch(
      window.location.search,
      aiTutorConfig.allowedTargetLanguages,
      aiTutorConfig.defaultTargetLanguage as TutorTarget,
    ));
    syncTarget();
    window.addEventListener("popstate", syncTarget);
    return () => window.removeEventListener("popstate", syncTarget);
  }, [target]);

  useEffect(() => {
    if (mode === "grammar") return;
    setConversationMessages([createOpeningMessage(target, explainLanguage, mode)]);
    setConversationInput("");
    setSpeakingMessageId(null);
    tts.stop();
  }, [mode, target, explainLanguage]);

  useEffect(() => {
    const savedSession = loadStudySessionState(TUTOR_PRODUCT, target);
    setActiveTodayLesson(savedSession ? buildResumedTodayLesson(savedSession, target) : null);
    setTodayLessonLogicInsight(null);
    setStudySessionState(savedSession);
    if (savedSession) {
      setMode(savedSession.recommendedMode);
      const eventKey = `${target}:${savedSession.updatedAt}:${savedSession.currentStep}`;
      if (resumedLessonEventRef.current !== eventKey) {
        resumedLessonEventRef.current = eventKey;
        recordLearningEvent({
          eventType: "lesson_resumed",
          product: "ai_tutor",
          targetLanguage: target,
          mode: savedSession.recommendedMode,
          safeTopicTag: savedSession.lastSafeTopicTag || savedSession.suggestedNextFocus,
          count: savedSession.completedPromptsCount,
          value: savedSession.retryCount,
        });
        refreshLocalEventSummary();
      }
    }
  }, [target]);

  useEffect(() => {
    if (!activeTodayLesson) return;
    const nextFocus = memory?.suggestedNextFocus || memory?.nextRecommendedFocus || activeTodayLesson.plan.nextFocus;
    if (!nextFocus) return;
    const eventKey = `${target}:${activeTodayLesson.plan.nextFocus}:${nextFocus}`;
    if (nextFocusViewedEventRef.current === eventKey) return;
    nextFocusViewedEventRef.current = eventKey;
    recordAiTutorEvent("next_focus_viewed", {
      mode,
      safeTopicTag: nextFocus,
    });
  }, [activeTodayLesson, memory, mode, target]);

  useEffect(() => {
    const syncExplain = () => setExplainLanguage(resolveExplainLanguage(aiTutorConfig, getExplainLanguage(), target));
    window.addEventListener("storage", syncExplain);
    window.addEventListener("focus", syncExplain);
    return () => {
      window.removeEventListener("storage", syncExplain);
      window.removeEventListener("focus", syncExplain);
    };
  }, []);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setError(null);
    setLoading(true);
    setResult(null);
    setDetectorHint(null);
    setPracticeAnswer("");
    setPracticeFeedback(null);

    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const next = MOCK_RESULTS_BY_TARGET[target];
    const localCorrection = buildLocalCorrection(trimmed, target);
    if (!localCorrection.ok) {
      setInput("");
      setLoading(false);
      setError(localCorrection.message);
      return;
    }
    const corrected = localCorrection.corrected;
    const { turn } = buildCorrectionTurn({
      id: `corr-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      targetLanguage: target,
      explainLanguage,
      userText: trimmed,
      correctedText: corrected,
      explanation: next.explanation[explainLanguage],
    });
    setResult({
      ...turn,
      grammarTip: next.grammarTip[explainLanguage],
      practicePrompt: next.practicePrompt[explainLanguage],
    });

    // Detector → chip surface (adult AI Tutor only; CorrectionMode is not
    // mounted in the Mercy Kids surface). Runs AFTER setResult so the LLM-
    // path response is on screen first; never blocks.
    //
    // Two direction-aware branches:
    //  - target === "en" (Axis 1, VN→EN): Vietnamese-L1 detector +
    //    chip render via getDetectorHint. Original flow, unchanged.
    //  - target === "vi" (Axis 2, EN→VN): English-L1 detector wired
    //    via detectEnVnError (PR #1188 follow-up). The chip surface
    //    for en_l1_* tags isn't built yet — getDetectorHint's tag
    //    catalog is vi_l1_*-specific — so the result is computed
    //    and discarded. The detector is exercised in production so
    //    the Axis 2 chip-render PR can land on a known-good
    //    detector path.
    if (target === "en") {
      try {
        const detection = detectL1Error({
          userAnswer: trimmed,
          expectedAnswer: corrected,
        });
        const hint = getDetectorHint(detection);
        if (hint && !hasShownHint(hint.tag)) {
          setDetectorHint(hint);
        }
      } catch {
        /* detector failure is non-fatal — response already on screen */
      }
    } else if (target === "vi") {
      try {
        // Detection result is intentionally unused here; en_l1_*
        // chip rendering lands in a follow-up PR. The call exists
        // to exercise the detector in production and surface any
        // engine-level breakage before the UI consumer ships.
        void detectEnVnError({
          userAnswer: trimmed,
          expectedAnswer: corrected,
        });
      } catch {
        /* detector failure is non-fatal — response already on screen */
      }
    }

    const lessonInsight = activeTodayLesson ? diagnoseVietlishLogicWithMatch(trimmed) : null;
    setTodayLessonLogicInsight(lessonInsight?.isKnownPattern ? lessonInsight : null);
    if (activeTodayLesson && lessonInsight?.isKnownPattern) {
      recordAiTutorEvent("logic_insight_viewed", {
        mode,
        safeTopicTag: lessonInsight.patternId,
      });
    }
    if (activeTodayLesson && studySessionState) {
      setStudySessionState(recordStudyPromptCompleted(studySessionState, {
        safeTopicTag: lessonInsight?.patternId || activeTodayLesson.plan.nextFocus,
        suggestedNextFocus: activeTodayLesson.plan.nextFocus,
      }));
    }
    setLoading(false);

    setLastSavedId(turn.id);
    putCorrection({
      id: turn.id,
      topic: MEMORY_TOPIC_BY_TARGET[target],
      cefr: "B1", createdAt: Date.now(), practiced: false,
      tutorProduct: TUTOR_PRODUCT,
      targetLanguage: target,
    }).then(() => loadMemory()).catch(() => {});
  };

  const handlePracticeSubmit = async () => {
    if (!practiceAnswer.trim()) return;
    setPracticeLoading(true);
    setPracticeFeedback(null);
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    setPracticeFeedback(MOCK_RESULTS_BY_TARGET[target].feedback);
    if (activeTodayLesson && studySessionState) {
      recordAiTutorEvent("mistake_retried", {
        mode,
        safeTopicTag: activeTodayLesson.plan.nextFocus,
        count: studySessionState.retryCount + 1,
      });
      setStudySessionState(recordStudyRetry(studySessionState, {
        safeTopicTag: activeTodayLesson.plan.nextFocus,
        suggestedNextFocus: activeTodayLesson.plan.nextFocus,
      }));
      recordAiTutorEvent("lesson_completed", {
        mode,
        safeTopicTag: activeTodayLesson.plan.nextFocus,
        count: studySessionState.completedPromptsCount,
        value: studySessionState.retryCount + 1,
      });
    }
    setPracticeLoading(false);
    if (lastSavedId) markPracticed(lastSavedId, TUTOR_PRODUCT, target).then(() => loadMemory()).catch(() => {});
  };

  const handleConversationSend = async () => {
    const trimmed = conversationInput.trim();
    if (!trimmed || conversationLoading) return;

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      role: "user",
      text: trimmed,
    };
    setConversationMessages((current) => [...current, userMessage]);
    setConversationInput("");
    setConversationLoading(true);

    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const mercyMessage = buildConversationReply(trimmed, target, explainLanguage, mode);
    setConversationMessages((current) => [...current, mercyMessage]);
    const lessonInsight = activeTodayLesson ? diagnoseVietlishLogicWithMatch(trimmed) : null;
    setTodayLessonLogicInsight(lessonInsight?.isKnownPattern ? lessonInsight : null);
    if (activeTodayLesson && lessonInsight?.isKnownPattern) {
      recordAiTutorEvent("logic_insight_viewed", {
        mode,
        safeTopicTag: lessonInsight.patternId,
      });
    }
    if (activeTodayLesson && studySessionState) {
      const update = {
        safeTopicTag: lessonInsight?.patternId || activeTodayLesson.plan.nextFocus,
        suggestedNextFocus: activeTodayLesson.plan.nextFocus,
      };
      if (studySessionState.completedPromptsCount > 0) {
        recordAiTutorEvent("mistake_retried", {
          mode,
          safeTopicTag: update.safeTopicTag,
          count: studySessionState.retryCount + 1,
        });
        recordAiTutorEvent("lesson_completed", {
          mode,
          safeTopicTag: activeTodayLesson.plan.nextFocus,
          count: studySessionState.completedPromptsCount,
          value: studySessionState.retryCount + 1,
        });
      }
      setStudySessionState(
        studySessionState.completedPromptsCount > 0
          ? recordStudyRetry(studySessionState, update)
          : recordStudyPromptCompleted(studySessionState, update),
      );
    }
    setConversationLoading(false);

    const id = `conv-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    putCorrection({
      id,
      topic: `conversation-${target}`,
      cefr: "B1",
      createdAt: Date.now(),
      practiced: true,
      tutorProduct: TUTOR_PRODUCT,
      targetLanguage: target,
    }).then(() => loadMemory()).catch(() => {});
  };

  const handleConversationSpeak = (message: MercyConversationMessage) => {
    if (mode === "logic") {
      tts.stop();
      setSpeakingMessageId(null);
      return;
    }
    if (speakingMessageId === message.id && tts.speaking) {
      tts.stop();
      setSpeakingMessageId(null);
      return;
    }
    const text = getSpeakableText(message);
    if (!text) return;
    setSpeakingMessageId(message.id);
    void tts.speak(text, ttsLang, target);
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setError(null);
    setPracticeAnswer("");
    setPracticeFeedback(null);
  };

  const handleStartTodayLesson = (plan: TodayLessonPlan) => {
    if (activeTodayLesson && studySessionState) {
      setMode(studySessionState.recommendedMode);
      return;
    }
    recordAiTutorEvent("lesson_started", {
      mode: plan.suggestedMode,
      safeTopicTag: plan.nextFocus,
    });
    setMode(plan.suggestedMode);
    setActiveTodayLesson({
      plan,
      prompt: buildTodayLessonPrompt(plan, target),
      resumed: false,
    });
    setTodayLessonLogicInsight(null);
    setInput("");
    setConversationInput("");
    setResult(null);
    setError(null);
    setPracticeAnswer("");
    setPracticeFeedback(null);
    setSpeakingMessageId(null);
    setStudySessionState(startStudySession({
      product: TUTOR_PRODUCT,
      targetLanguage: target,
      safeTopicTag: plan.nextFocus,
      suggestedNextFocus: plan.nextFocus,
      recommendedMode: plan.suggestedMode,
    }));
    tts.stop();
  };

  const handleRestartTodayLesson = () => {
    if (studySessionState || activeTodayLesson) {
      recordAiTutorEvent("lesson_restarted", {
        mode,
        safeTopicTag: studySessionState?.lastSafeTopicTag || activeTodayLesson?.plan.nextFocus,
        count: studySessionState?.completedPromptsCount,
        value: studySessionState?.retryCount,
      });
    }
    clearStudySessionState(TUTOR_PRODUCT, target);
    setActiveTodayLesson(null);
    setStudySessionState(null);
    setTodayLessonLogicInsight(null);
    setResult(null);
    setError(null);
    setPracticeAnswer("");
    setPracticeFeedback(null);
    setConversationInput("");
  };

  const handleModeChange = (nextMode: TutorMode) => {
    if (nextMode !== mode) {
      recordAiTutorEvent("mode_selected", { mode: nextMode });
    }
    setMode(nextMode);
  };

  return (
    <TeacherMercyLearningShell
      ref={shellRef}
      testId="ai-tutor-shell"
      avatarTestId="ai-tutor-mercy-avatar"
      greetingTestId="ai-tutor-greeting"
      floating={isFloatingShell}
      greetingName={greetingName}
      title={tutorCopy.ui.title}
      subtitle={tutorCopy.ui.subtitle}
      helper={tutorCopy.ui.helper}
      eyebrow={tutorCopy.ui.eyebrow}
      modeTabs={modeTabs}
      activeMode={mode}
      onModeChange={handleModeChange}
      memorySlot={aiTutorConfig.memoryEnabled ? (
        <>
          <TutorTodayLessonCard
            memoryLoaded={memoryLoaded}
            memory={memory}
            onStartLesson={handleStartTodayLesson}
            startLabel={activeTodayLesson ? "Resume lesson" : "Start today's lesson"}
          />
          <TutorMomentumCard summary={localEventSummary} />
          {isPlacementEntryRouteAvailable() ? (
            <a
              href="/placement"
              data-testid="ai-tutor-placement-cta"
              onClick={() => recordAiTutorEvent("placement_cta_clicked", { safeTopicTag: "placement" })}
              className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-between gap-3 rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-left text-sm font-bold text-sky-900 shadow-sm transition hover:border-sky-200 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <span className="min-w-0">
                <span className="block">New here? Take a placement test first.</span>
                <span className="mt-0.5 block text-xs font-semibold text-sky-700">
                  Bạn mới học? Kiểm tra trình độ trước.
                </span>
              </span>
              <span className="shrink-0 text-xs font-black uppercase text-sky-700">
                Start
              </span>
            </a>
          ) : null}
          <TutorMemoryCard memoryLoaded={memoryLoaded} memory={memory} />
        </>
      ) : undefined}
      reminderSlot={aiTutorConfig.memoryEnabled ? <TutorMemoryEmpty memoryLoaded={memoryLoaded} memory={memory} /> : undefined}
      footer={`${tutorCopy.ui.footer} ${getSafetyLabel(aiTutorConfig)}.`}
    >
      {activeTodayLesson && (
        <TodayLessonLoopPanel
          lesson={activeTodayLesson}
          mode={mode}
          result={result}
          practiceFeedback={practiceFeedback}
          latestMercyMessage={latestMercyMessage}
          logicInsight={todayLessonLogicInsight}
          sessionState={studySessionState}
          memory={memory}
          onRestart={handleRestartTodayLesson}
        />
      )}
      {mode === "grammar" ? (
        <CorrectionMode
          input={input}
          setInput={setInput}
          loading={loading}
          result={result}
          error={error}
          practiceAnswer={practiceAnswer}
          setPracticeAnswer={setPracticeAnswer}
          practiceFeedback={practiceFeedback}
          practiceLoading={practiceLoading}
          micSupported={stt.supported}
          micListening={stt.listening}
          ttsSupported={tts.supported}
          ttsSpeaking={tts.speaking}
          ttsPreparing={tts.preparing}
          ttsVoiceSource={tts.voiceSource}
          speechLang={speechLang}
          onSubmit={handleSubmit}
          onMicToggle={handleMicToggle}
          onTtsToggle={() => {
            if (!result) return;
            const text = getSpeakableText(result);
            if (!text) return;
            if (tts.speaking) {
              tts.stop();
            } else {
              void tts.speak(text, ttsLang, target);
            }
          }}
          onPracticeSubmit={handlePracticeSubmit}
          onClear={handleClear}
          tutorCopy={tutorCopy}
          detectorHint={detectorHint}
        />
      ) : (
        <ConversationMode
          messages={conversationMessages}
          input={conversationInput}
          setInput={setConversationInput}
          loading={conversationLoading}
          micSupported={stt.supported}
          micListening={stt.listening}
          ttsSupported={tts.supported}
          ttsSpeaking={tts.speaking}
          ttsPreparing={tts.preparing}
          ttsVoiceSource={tts.voiceSource}
          speakingMessageId={speakingMessageId}
          mode={mode}
          onSend={handleConversationSend}
          onMicToggle={handleMicToggle}
          onSpeak={handleConversationSpeak}
          tutorCopy={tutorCopy}
        />
      )}
    </TeacherMercyLearningShell>
  );
}
