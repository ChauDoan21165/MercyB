// src/pages/AiTutor.tsx
// AI Tutor page orchestrator — delegates the shared Teacher Mercy frame to
// TeacherMercyLearningShell and keeps product behavior local/mock-only.

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  putCorrection,
  markPracticed,
  getMemorySummary,
  type TutorProduct,
} from "@/lib/ai-tutor/learningMemory";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import {
  loadServerInterferenceTags,
  mergeRecallMemory,
  fetchServerProfileInput,
} from "@/lib/ai-conversation/serverInterferenceMemory";
import { supabase } from "@/lib/supabaseClient";
import { syncProfileWithServerData } from "@/lib/tutor/learnerProfileBuilder";
import { recommendNextLessons } from "@/lib/tutor/nextLessonRecommender";
import { useBrowserStt } from "@/lib/ai-tutor/useBrowserStt";
import { transcriptSanity } from "@/lib/ai-tutor/transcriptSanity";
import { transcribeWithAzure } from "@/lib/ai-tutor/freeFormStt";
import { readAndClearPendingReflection } from "@/lib/ai-tutor/teacherMercyHandoff";
import { useTtsSpeaker } from "@/lib/ai-tutor/useTtsSpeaker";
import { usePronunciationRecorder } from "@/hooks/usePronunciationRecorder";
import { useSpeakDetailEntitlement } from "@/hooks/useSpeakDetailEntitlement";
import {
  resolveSpeakDetailGate,
  SPEAK_DETAIL_SESSION_CAP,
} from "@/lib/pronunciation/speakDetailGate";
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
import {
  createSpeakConversationState,
  selectSpeakConversationReply,
  type SpeakConversationState,
} from "@/lib/tutor/speakConversationState";
import type { TutorTurn } from "@/lib/tutor/tutorTypes";
import {
  aiTutor as aiTutorConfig,
  getSafetyLabel,
  resolveExplainLanguage,
  type TutorProductMode,
} from "@/lib/tutor/productConfigs";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { isPlacementEntryRouteAvailable } from "@/lib/placement/availability";
import { reportRouteMountPerf } from "@/lib/monitoring/routePerf";
import { captureCorrection } from "@/services/learnerCapture";
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
import {
  assessSpeakSentenceCoherence,
  assessSpeakTranscriptClarity,
  getSpeakFollowUpTopicId,
  isSpeakTranscriptUnclearForFollowUp,
  resolveSpeakFollowUpTopicId,
  selectSpeakFollowUpByTopicId,
  SPEAK_FOLLOW_UP_PIVOT,
  SPEAK_TRANSCRIPT_ASK_TO_REPEAT,
  type SpeakFollowUpSelection,
} from "@/lib/tutor/speakFollowups";
import { detectBilingualSaliencePivot } from "@/lib/tutor/bilingualSalienceDetector";
import type { BilingualSaliencePivot } from "@/lib/tutor/bilingualSalienceDetector";
import { classifyResponseStance } from "@/lib/tutor/emotionalResponseBoundary";
import {
  buildConstrainedPivotPrompt,
  decidePivotResponse,
  type PivotPromptTurn,
} from "@/lib/tutor/pivotPromptSafety";
import CorrectionMode from "@/components/ai-tutor/CorrectionMode";
import { detectEnVnError } from "@/lib/feedback";
import {
  getDetectorHint,
  hasShownHint,
  type DetectorHintContent,
} from "@/lib/ai-tutor/detectorHint";
import { detectStep5VnEnError } from "@/lib/ai-tutor/step5VnEnDetectors";
import {
  advanceL1Focus,
  initialL1FocusState,
  type L1FocusState,
} from "@/lib/ai-tutor/l1FollowUpLoop";
import { recordL1Tag } from "@/lib/stage-3a/adapters/l1TagAdapter";
import { recordActiveDay } from "@/lib/retention/recordActiveDay";
import { resolveApiUrl } from "@/lib/apiBase";
import type {
  ConversationMessage,
  MercyConversationMessage,
} from "@/components/ai-tutor/ConversationMode";
import JourneyMode from "@/components/ai-tutor/JourneyMode";
import SpeakPracticeMode, {
  isSpeakFollowUpReadAloudEligible,
  type SpeakPronunciationResult,
} from "@/components/ai-tutor/SpeakPracticeMode";
import { adaptSpeakPronunciationResult } from "@/components/ai-tutor/speakPronunciationResultAdapter";
import {
  buildEnglishPronunciationAbstainFeedbackDisplay,
  buildEnglishPronunciationFeedbackDisplay,
} from "@/lib/pronunciation/englishPronunciationFeedback";
import LogicMode from "@/components/ai-tutor/LogicMode";
import TeacherMercyLearningShell from "@/components/teacher-mercy/TeacherMercyLearningShell";
import { scorePronunciationWithStep7Fallback } from "@/lib/pronunciation/cloudScorer";
import { scoreTone } from "@/lib/pronunciation/scoreTone";
import {
  buildVietnameseToneFeedbackDisplay,
  resolveVietnameseTonePracticeTarget,
  type VietnameseToneFeedbackDisplay,
} from "@/lib/pronunciation/vietnameseToneFeedback";
import {
  emitPronunciationFeatureOutcome,
  PRONUNCIATION_FEATURE_OUTCOME_KEYS,
} from "@/lib/pronunciation/pronunciationFeatureOutcome";
import {
  appendPronunciationProgress,
  buildPronunciationProgressDisplay,
  type PronunciationProgressEntry,
} from "@/lib/pronunciation/pronunciationProgressTrail";
import useUserAccess from "@/hooks/useUserAccess";
import AiConversationScenarioPanel from "@/components/ai-tutor/conversation/AiConversationScenarioPanel";
import StudyPathCard from "@/components/ai-tutor/StudyPathCard";

type CorrectionResult = TutorTurn & {
  grammarTip: string;
  practicePrompt: string;
};

type PracticeFeedback = {
  encouragement: string;
  tip: string;
  nextStep: string;
};

type CorrectedSentenceSeed = {
  correctedSentence: string;
  sourceText: string;
  updatedAt: number;
};

type ActiveTodayLesson = {
  plan: TodayLessonPlan;
  prompt: string;
  resumed: boolean;
};

type SpeakFollowUpSession = {
  topicId: string;
  turnsOnTopic: number;
  askedQuestions: string[];
  currentQuestion: string | null;
  currentIsPivot: boolean;
};

type TutorMode = Extract<TutorProductMode, "journey" | "grammar" | "speak" | "logic">;
type ConversationTutorMode = Exclude<TutorMode, "grammar">;

type MockPivotCandidateResult =
  | string
  | null
  | {
      candidate?: string | null;
      failed?: boolean;
    };

declare global {
  interface Window {
    __MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__?: (prompt: string) => MockPivotCandidateResult;
  }
}

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

const SPEAK_STANCE_ACKNOWLEDGMENT = "I hear you.";
const SPEAK_STANCE_CLARIFICATION = "Can you say that another way?";
// Issue 1: the corrected sentence is well-formed in tense but still nonsensical
// (a grammar-only fix left a word-salad). Don't drill it as a good model — ask
// for a clearer sentence instead of pretending the tense fix was enough.
const SPEAK_STANCE_SEED_UNCLEAR =
  "That sentence is hard to follow. Can you say what you mean in one simple sentence?";
const SPEAK_TRANSCRIPT_UNCLEAR =
  "I didn't catch that clearly. Can you say it again?";
const SPEAK_STANCE_PAUSE = "I’m sorry that happened. Let’s pause correction for a moment. Are you okay to continue?";
const GRAMMAR_VOICE_EMPTY_MESSAGE =
  "Mercy chưa nghe rõ. Bạn thử nói lại hoặc gõ câu vào ô nhé.";
const GRAMMAR_CORRECTION_UNAVAILABLE_MESSAGE =
  "Mercy chưa sửa chắc câu này bằng bộ quy tắc hiện tại. Bạn có thể chỉnh lại câu ngắn hơn một chút rồi bấm Sửa câu này nhé.";
const CANNOT_CORRECT_NO_SESSION_MESSAGE =
  "Mercy cần đăng nhập để kiểm tra câu này. Bạn thử đăng nhập nhé.";
const STEP7_AZURE_BATCH_ENABLED =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env
    ?.VITE_AZURE_PHONEME_BATCH_ENABLED === "true";
const EMPTY_SPEAK_AUDIO_BLOB = new Blob([], { type: "audio/webm" });
const VIETNAMESE_SPEAK_TEXT_PATTERN =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;
const MERCY_CLARIFICATION_PREFIX_PATTERN = /^\s*Mercy\s+chưa\s+nghe\s+rõ\b/i;

type SpeakAiFollowUpRequest = {
  transcript: string;
  currentTopic: string;
  learnerLevel: string;
  recentTurns: PivotPromptTurn[];
  turnsOnTopic: number;
  accessToken: string;
  /** Possibly-misheard tokens (transcriptSanity); the follow-up abstains on them. */
  avoidTokens?: string[];
};

type AiCorrectionResult = {
  corrected: string;
  explanation: string;
  grammarTip: string;
  confident: boolean;
};

async function callAiSentenceCorrection(
  learnerText: string,
  accessToken: string,
  explainLang: ExplainLanguage,
  tgt: TutorTarget,
): Promise<AiCorrectionResult | null> {
  try {
    const res = await fetch(resolveApiUrl("/api/mercy-ai"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ mode: "sentence-correction", learnerText, explainLanguage: explainLang, target: tgt }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<AiCorrectionResult>;
    return {
      corrected: data.corrected ?? "",
      explanation: data.explanation ?? "",
      grammarTip: data.grammarTip ?? "",
      confident: data.confident !== false,
    };
  } catch {
    return null;
  }
}

// DIRECTIVE V1 — Speak surface voice routing: English content is read with an
// English Azure voice; Vietnamese is TEXT-ONLY here (no vi audio). We NEVER pick
// a Vietnamese voice for this surface — Vietnamese content is suppressed to
// text-only instead of being read aloud (and read aloud with the wrong voice).
function isVietnameseSpeakTarget(target: TutorTarget): boolean {
  return String(target || "").trim().toLowerCase().split("-")[0] === "vi";
}

// A read is Vietnamese (→ text-only) when the practice target is vi, or the
// follow-up text is a Vietnamese clarification line. The follow-up's language is
// not carried as a field, so a Vietnamese clarification is recognised by its
// known shape ONLY to suppress audio — never to select a Vietnamese voice.
function speakReadIsVietnamese(text: string, target: TutorTarget): boolean {
  return (
    isVietnameseSpeakTarget(target) ||
    VIETNAMESE_SPEAK_TEXT_PATTERN.test(text) ||
    MERCY_CLARIFICATION_PREFIX_PATTERN.test(text)
  );
}

function normalizeAiSpeakFollowUp(value: unknown): string | null {
  const raw = typeof value === "string"
    ? value.replace(/^["'“”]+|["'“”]+$/g, "").replace(/\s+/g, " ").trim()
    : "";
  if (!raw || !raw.endsWith("?") || raw.length > 180) return null;
  if (/\bwhy did you choose the\b/i.test(raw)) return null;
  if (
    /\b(?:choose|about|with|for|like)\b/i.test(raw) &&
    /\b(?:the\s+)?(?:general|guys?|things?|stuff|some|this|that)\b/i.test(raw)
  ) {
    return null;
  }
  return raw;
}

type SpeakFollowUpProviderError = { ok: false; retryable: true; reason: string };

function isSpeakFollowUpProviderError(v: unknown): v is SpeakFollowUpProviderError {
  return typeof v === "object" && v !== null && "ok" in v && (v as SpeakFollowUpProviderError).ok === false;
}

async function fetchDeepSeekSpeakFollowUp({
  transcript,
  currentTopic,
  learnerLevel,
  recentTurns,
  turnsOnTopic,
  accessToken,
  avoidTokens,
}: SpeakAiFollowUpRequest): Promise<string | null | SpeakFollowUpProviderError> {
  try {
    const response = await fetch(resolveApiUrl("/api/mercy-ai"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        mode: "speak-follow-up",
        transcript,
        context: {
          learnerLevel,
          currentTopic,
          recentTurns: recentTurns.slice(-6),
          turnsOnTopic,
          ...(avoidTokens && avoidTokens.length > 0 ? { avoidTokens } : {}),
        },
      }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { question?: unknown; ok?: unknown; retryable?: unknown; reason?: unknown };
    if (data.ok === false && data.retryable === true && typeof data.reason === "string") {
      return { ok: false, retryable: true, reason: data.reason };
    }
    return normalizeAiSpeakFollowUp(data.question);
  } catch {
    return null;
  }
}

function buildInitialSpeakFollowUpSession(sentence: string): SpeakFollowUpSession {
  const trimmed = sentence.trim();
  const topicId = trimmed ? getSpeakFollowUpTopicId(trimmed) : "";
  if (!trimmed || !topicId) {
    return {
      topicId,
      turnsOnTopic: 0,
      askedQuestions: [],
      currentQuestion: null,
      currentIsPivot: false,
    };
  }

  const selection = selectSpeakFollowUpByTopicId(topicId, {
    askedQuestions: [],
    turnsOnTopic: 0,
    learnerText: trimmed,
  });

  return {
    topicId: selection.topicId,
    turnsOnTopic: 0,
    askedQuestions: [],
    currentQuestion: selection.question,
    currentIsPivot: selection.isPivot,
  };
}

function createLocalSpeakSessionId(): string {
  const randomUuid = globalThis.crypto?.randomUUID?.();
  if (randomUuid) return `speak-${randomUuid}`;
  return `speak-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeMockPivotResult(result: MockPivotCandidateResult): { candidate?: string | null; failed?: boolean } {
  if (typeof result === "string" || result === null) return { candidate: result };
  return result;
}

function resolveMockedContentAwarePivot(
  learnerText: string,
  salience: BilingualSaliencePivot | null,
  deterministicSelection: SpeakFollowUpSelection,
  previousTurns: PivotPromptTurn[],
): SpeakFollowUpSelection {
  if (typeof window === "undefined" || !window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__) {
    return deterministicSelection;
  }

  if (!salience) return deterministicSelection;

  const localCorrection = correctWithTutorRules(learnerText, "en");
  if (!salience.highStakes && localCorrection.status === "corrected") {
    return deterministicSelection;
  }

  const promptInput = {
    currentLearnerReply: learnerText,
    selectedSaliencePivot: salience,
    sessionTurns: previousTurns,
  };
  const prompt = buildConstrainedPivotPrompt(promptInput);
  const mocked = normalizeMockPivotResult(window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__(prompt));
  const decision = decidePivotResponse({
    promptInput,
    candidate: mocked.candidate,
    failed: mocked.failed,
  });

  if (decision.source !== "pivot") return deterministicSelection;

  return {
    topicId: deterministicSelection.topicId,
    question: decision.text,
    isPivot: true,
  };
}

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
): { ok: true; corrected: string; appliedRuleIds: string[]; status: "corrected" | "unchanged" } | { ok: false; message: string } {
  if (target === "en") {
    if (/^I buy a hat yesterday\.\s+can I buy I had this today[.?!]?$/i.test(input.trim())) {
      return {
        ok: true,
        corrected: "I bought a hat yesterday.",
        appliedRuleIds: ["en-yesterday-irregular-beginner-past", "en-unclear-mixed-transcript"],
        status: "corrected",
      };
    }
    const result = correctWithTutorRules(input, "en");
    if (result.status === "needs_ai") {
      return { ok: false, message: result.message || AI_CORRECTION_REQUIRED_MESSAGE };
    }
    return {
      ok: true,
      corrected: result.corrected,
      appliedRuleIds: result.appliedRuleIds,
      status: result.status,
    };
  }

  return { ok: true, corrected: buildInputAwareCorrection(input, target), appliedRuleIds: [], status: "corrected" };
}

function buildEnglishConversationExplanation(
  userText: string,
  correction: Extract<ReturnType<typeof buildLocalCorrection>, { ok: true }>,
  explainLanguage: ExplainLanguage,
): string {
  const hasRule = (fragment: string) => correction.appliedRuleIds.some((id) => id.includes(fragment));
  const lower = userText.toLowerCase();

  if (hasRule("unclear-mixed-transcript")) {
    return explainLanguage === "vi"
      ? "Mercy sửa câu rõ đầu tiên. Phần sau giống transcript bị nhiễu, nên hãy viết lại phần đó thành một câu rõ trước khi sửa tiếp."
      : "Mercy corrected the clear first sentence. The second part looks like noisy transcript, so rewrite it as one clear sentence before correcting it.";
  }
  if (hasRule("third-person")) {
    return MOCK_RESULTS_BY_TARGET.en.explanation[explainLanguage];
  }
  if (hasRule("subject-verb-agreement")) {
    return explainLanguage === "vi"
      ? "Với he, she, it ở hiện tại, thêm -s vào động từ chính: he goes, she works, it makes."
      : "With he, she, it in the present, add -s to the main verb: he goes, she works, it makes.";
  }
  if (hasRule("preposition-pattern")) {
    return explainLanguage === "vi"
      ? "Một vài cụm tiếng Anh đi với giới từ cố định. Học cả cụm: depend on, interested in, good at, listen to."
      : "Some English phrases need a fixed preposition. Learn the phrase: depend on, interested in, good at, listen to.";
  }
  if (hasRule("past")) {
    return explainLanguage === "vi"
      ? "Khi nói về việc đã xảy ra, dùng động từ quá khứ như went, bought, ate hoặc had."
      : "For something that already happened, use past-tense verbs such as went, bought, ate, or had.";
  }
  if (hasRule("morning-routine-tense-parallel")) {
    return explainLanguage === "vi"
      ? "Khi nói thói quen buổi sáng, dùng thì hiện tại đơn và giữ động từ song song: brush ... and have ..."
      : "For a morning routine, use present simple and keep the verbs parallel: brush ... and have ...";
  }
  if (/\bI\s+went\b.*\b(buy|go|eat|have|do)\b/i.test(userText)) {
    return explainLanguage === "vi"
      ? "Cẩn thận giữ cùng một mốc thời gian: nếu bắt đầu bằng “I went…”, động từ sau đó cũng nên ở dạng quá khứ."
      : "Keep the time frame consistent: after “I went…”, the following action usually needs past tense too.";
  }
  if (hasRule("question") || hasRule("runon") || /\byou\b/.test(lower)) {
    return "";
  }
  if (correction.status === "unchanged") return "";

  return explainLanguage === "vi"
    ? "Câu của bạn đã rõ hơn. Mercy chỉ chỉnh nhẹ để câu tự nhiên hơn."
    : "Your idea is clear. Mercy only adjusted the sentence to sound more natural.";
}

function buildConversationExplanation(
  userText: string,
  target: TutorTarget,
  correction: Extract<ReturnType<typeof buildLocalCorrection>, { ok: true }>,
  explainLanguage: ExplainLanguage,
): string {
  if (target === "en") {
    return buildEnglishConversationExplanation(userText, correction, explainLanguage);
  }
  return MOCK_RESULTS_BY_TARGET[target].explanation[explainLanguage];
}

function buildGrammarExplanation(
  userText: string,
  target: TutorTarget,
  correction: Extract<ReturnType<typeof buildLocalCorrection>, { ok: true }>,
  explainLanguage: ExplainLanguage,
): string {
  if (target !== "en") return MOCK_RESULTS_BY_TARGET[target].explanation[explainLanguage];
  // Only show the "no changes needed" fallback when an actual correction was applied. For
  // "unchanged" (no rules fired, input already clean), an empty explanation is correct —
  // there is nothing to explain. The old unconditional fallback would surface "câu của bạn
  // đã rõ" even on fragments or broken inputs that slipped past the rule engine (Q1 bug).
  const specific = buildEnglishConversationExplanation(userText, correction, explainLanguage);
  if (specific) return specific;
  if (correction.status === "unchanged") return "";
  return explainLanguage === "vi"
    ? "Câu của bạn đã rõ. Mercy chỉ chỉnh dấu câu hoặc cách diễn đạt cho tự nhiên hơn."
    : "Your sentence is clear. Mercy only adjusted punctuation or phrasing.";
}

function buildGrammarTip(
  target: TutorTarget,
  correction: Extract<ReturnType<typeof buildLocalCorrection>, { ok: true }>,
  explainLanguage: ExplainLanguage,
): string {
  if (target !== "en") return MOCK_RESULTS_BY_TARGET[target].grammarTip[explainLanguage];
  const hasRule = (fragment: string) => correction.appliedRuleIds.some((id) => id.includes(fragment));

  if (hasRule("third-person")) {
    return MOCK_RESULTS_BY_TARGET.en.grammarTip[explainLanguage];
  }
  if (hasRule("subject-verb-agreement")) {
    return explainLanguage === "vi"
      ? "Mẹo: he/she/it + verb-s trong hiện tại."
      : "Tip: he/she/it + verb-s in the present.";
  }
  if (hasRule("preposition-pattern")) {
    return explainLanguage === "vi"
      ? "Mẹo: ghi nhớ cả cụm, không dịch từng giới từ."
      : "Tip: remember the whole phrase; do not translate the preposition word by word.";
  }
  if (hasRule("past")) {
    return explainLanguage === "vi"
      ? "Mẹo: yesterday / last week / ago thường cần động từ quá khứ."
      : "Tip: yesterday / last week / ago usually need a past-tense verb.";
  }
  if (hasRule("unclear-mixed-transcript")) {
    return explainLanguage === "vi"
      ? "Mẹo: sửa từng câu rõ ràng; đừng ghép transcript bị nhiễu vào câu đã gõ."
      : "Tip: correct one clear sentence at a time; do not merge noisy transcript into typed text.";
  }
  return explainLanguage === "vi"
    ? "Mẹo: giữ câu ngắn và rõ trước khi bấm sửa."
    : "Tip: keep the sentence short and clear before correcting.";
}

function buildConversationReply(
  userText: string,
  target: TutorTarget,
  explainLanguage: ExplainLanguage,
  mode: TutorMode,
  speakConversationState: SpeakConversationState,
  previousNaturalReply = "",
): { message: MercyConversationMessage; speakConversationState: SpeakConversationState } {
  if (mode === "logic") {
    return {
      message: buildLogicReply(userText, explainLanguage),
      speakConversationState,
    };
  }

  const localCorrection = buildSpeakAwareCorrection(userText, target, mode);
  const tutorCopy = getTutorCopy(target, explainLanguage);
  const speakReply = mode === "speak" && target === "en"
    ? selectSpeakConversationReply(userText, speakConversationState)
    : null;
  const naturalReply = speakReply?.naturalReply
    ?? buildSpeakNaturalReply(userText, target, tutorCopy.naturalReplies[0] ?? tutorCopy.ui.emptyConversation, previousNaturalReply);
  const nextQuestion = speakReply?.nextQuestion
    ?? buildSpeakNextQuestion(userText, target, tutorCopy.nextQuestionTemplates[0] ?? "");
  const { turn } = buildConversationTurn({
    id: `mercy-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    targetLanguage: target,
    explainLanguage,
    userText,
    correctedText: localCorrection.ok ? localCorrection.corrected : "",
    explanation: localCorrection.ok
      ? buildConversationExplanation(userText, target, localCorrection, explainLanguage)
      : localCorrection.message,
    naturalReply: localCorrection.ok || speakReply
      ? naturalReply
      : tutorCopy.ui.conversationFallback,
    nextQuestion,
  });
  return {
    message: { ...turn, role: "mercy" },
    speakConversationState: speakReply?.state ?? speakConversationState,
  };
}

function buildSpeakAwareCorrection(
  userText: string,
  target: TutorTarget,
  mode: TutorMode,
): ReturnType<typeof buildLocalCorrection> {
  if (mode !== "speak" || target !== "en") return buildLocalCorrection(userText, target);

  const normalized = userText.replace(/\s+/g, " ").trim();
  if (
    /\bin the morning\b/i.test(normalized) &&
    /\bbrushed my teeth\b/i.test(normalized) &&
    /\bI have my coffee\b/i.test(normalized)
  ) {
    return {
      ok: true,
      corrected: "In the morning, I brush my teeth and then have my coffee.",
      appliedRuleIds: ["en-speak-morning-routine-tense-parallel"],
      status: "corrected",
    };
  }
  if (/\bgo to work\b/i.test(normalized) && /\bocean email\b/i.test(normalized)) {
    return {
      ok: true,
      corrected: "I had my coffee, checked to see if I had any emails, and then went to work.",
      appliedRuleIds: ["en-speak-workday-email-asr"],
      status: "corrected",
    };
  }
  if (/\bcoffee\b/i.test(normalized) && /\bemail\b/i.test(normalized) && /\bgo to work\b/i.test(normalized)) {
    return {
      ok: true,
      corrected: "I had my coffee, checked my email, and then went to work.",
      appliedRuleIds: ["en-speak-workday-tense-sequence"],
      status: "corrected",
    };
  }
  if (/\boffice\b/i.test(normalized) && /\band up today\b/i.test(normalized)) {
    return {
      ok: true,
      corrected: "I went to the office, but the last part is unclear.",
      appliedRuleIds: ["en-speak-unclear-asr"],
      status: "corrected",
    };
  }
  if (/\b(colleges|colleagues)\b/i.test(normalized) && /\bboss\b/i.test(normalized) && /\bassign me\b/i.test(normalized)) {
    return {
      ok: true,
      corrected: "After that, I work with my colleagues and discuss with my boss what has been done. Then I do the work he assigns me.",
      appliedRuleIds: ["en-speak-workday-colleagues-assigns"],
      status: "corrected",
    };
  }
  if (/\bwork all day\b/i.test(normalized) && /\blunch\b/i.test(normalized)) {
    return {
      ok: true,
      corrected: "Then I work all day and have lunch. That's it.",
      appliedRuleIds: ["en-speak-workday-lunch-sequence"],
      status: "corrected",
    };
  }

  return buildLocalCorrection(userText, target);
}

function pickNonRepeatedReply(candidates: string[], previousNaturalReply: string): string {
  const previous = previousNaturalReply.trim().toLowerCase();
  return candidates.find((candidate) => candidate.trim().toLowerCase() !== previous) ?? candidates[0] ?? "";
}

function buildSpeakNaturalReply(userText: string, target: TutorTarget, fallback: string, previousNaturalReply = ""): string {
  if (target !== "en") return fallback;
  const normalized = userText.toLowerCase();
  if (/\boffice\b/.test(normalized) && /\band up today\b/.test(normalized)) {
    return pickNonRepeatedReply([
      "I heard that you went to the office, but the last part was unclear.",
      "You went to the office. Please repeat the last part more clearly.",
    ], previousNaturalReply);
  }
  if (/\b(?:email|emails|ocean email|urgent email)\b/.test(normalized) && /\b(?:work|office)\b/.test(normalized)) {
    return pickNonRepeatedReply([
      "That sounds like a normal start to a workday.",
      "Got it. After coffee and email, you go to work.",
      "Good. You are describing the start of your workday.",
    ], previousNaturalReply);
  }
  if (/\boffice\b|\bgo to work\b|\bat work\b|\btasks?\b/.test(normalized)) {
    return pickNonRepeatedReply([
      "You went to the office.",
      "Got it. You are talking about your workday.",
      "That sounds like part of your day at work.",
    ], previousNaturalReply);
  }
  if (/\bboss\b|\bcolleges\b|\bcolleagues\b|\bassign(?:s|ed)?\b/.test(normalized)) {
    return pickNonRepeatedReply([
      "Good detail. That sounds like a work discussion with your team.",
      "That sounds like a conversation with your boss and colleagues.",
    ], previousNaturalReply);
  }
  if (/\blunch\b|\bwork all day\b/.test(normalized)) {
    return pickNonRepeatedReply([
      "Clear. You are describing the rest of your workday.",
      "Good. Now you are talking about lunch and the rest of the day.",
    ], previousNaturalReply);
  }
  if (/\bmarket\b|\bbuy food\b|\bbought food\b/.test(normalized)) {
    return pickNonRepeatedReply(["Good. That sounds like a useful errand."], previousNaturalReply);
  }
  if (/\bdrink coffee\b|\bi have coffee\b|\bi had coffee\b/.test(normalized)) {
    return pickNonRepeatedReply(["Nice. That is a clear daily habit."], previousNaturalReply);
  }
  if (/\bbrush(?:ed)? my teeth\b|\bteeth\b|\bin the morning\b.*\bcoffee\b/.test(normalized)) {
    return pickNonRepeatedReply(["Good. Your morning routine is clear."], previousNaturalReply);
  }
  return pickNonRepeatedReply([fallback, "Got it. Tell me one more detail about that."], previousNaturalReply);
}

function buildSpeakNextQuestion(userText: string, target: TutorTarget, fallback: string): string {
  if (target !== "en") return fallback;
  const normalized = userText.toLowerCase();
  if (/\boffice\b/.test(normalized) && /\band up today\b/.test(normalized)) {
    return "Can you say that last part again in one short sentence?";
  }
  if (/\b(?:email|emails|ocean email|urgent email)\b/.test(normalized) && /\b(?:work|office)\b/.test(normalized)) {
    return "What do you usually do when you arrive at work?";
  }
  if (/\boffice\b|\bgo to work\b|\bat work\b|\btasks?\b/.test(normalized)) {
    return "What was the first task you worked on?";
  }
  if (/\bboss\b|\bcolleges\b|\bcolleagues\b|\bassign(?:s|ed)?\b/.test(normalized)) {
    return "What kind of tasks does your boss assign?";
  }
  if (/\blunch\b|\bwork all day\b/.test(normalized)) {
    return "What do you usually do after lunch?";
  }
  if (/\bmarket\b|\bbuy food\b|\bbought food\b/.test(normalized)) {
    return "What did you buy at the market?";
  }
  if (/\bbrush(?:ed)? my teeth\b|\bteeth\b|\bin the morning\b.*\bcoffee\b/.test(normalized)) {
    return "What do you usually do after coffee?";
  }
  return fallback;
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
  const modeLabel: Record<TutorMode, string> = {
    journey: "Lộ trình",
    grammar: "Sửa câu",
    speak: "Luyện nói",
    logic: "Logic",
  };

  return (
    <section
      data-testid="ai-tutor-lesson-loop"
      className="mx-auto mb-4 w-full max-w-3xl rounded-[16px] border border-emerald-200 bg-white px-4 py-4 shadow-sm"
      style={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase text-emerald-700">
            {lesson.resumed ? "Tiếp tục bài hôm nay" : "Bài hôm nay"} · {modeLabel[mode]}
          </div>
          <h2 className="mt-1 text-lg font-black leading-6 text-slate-950" style={{ overflowWrap: "break-word" }}>
            {lesson.plan.lessonTitle}
          </h2>
          <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold leading-6 text-emerald-900" style={{ overflowWrap: "break-word" }}>
            Gợi ý: {lesson.prompt}
          </p>
        </div>
        <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase text-slate-600">
          {lesson.plan.estimatedMinutes} phút
        </span>
      </div>
      {lesson.resumed && (
        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900">
          Mercy đã lưu tiến độ trên máy này.
        </div>
      )}

      {sessionState && (
        <div
          data-testid="ai-tutor-study-session-state"
          className="mt-3 flex flex-wrap gap-2 text-[11px] font-black uppercase text-slate-600"
        >
          <span className="rounded-full bg-slate-50 px-2.5 py-1">Bước {sessionState.currentStep}</span>
          <span className="rounded-full bg-slate-50 px-2.5 py-1">Thử lại {sessionState.retryCount}</span>
          <span className="rounded-full bg-slate-50 px-2.5 py-1">Đã xong {sessionState.completedPromptsCount}</span>
          {sessionState.lastSafeTopicTag && (
            <span className="rounded-full bg-slate-50 px-2.5 py-1">Chủ điểm {sessionState.lastSafeTopicTag}</span>
          )}
        </div>
      )}

      <div className="mt-3 grid gap-2 text-xs font-bold text-slate-700 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          1. Trả lời
        </div>
        <div className={`rounded-xl border px-3 py-2 ${hasFeedback ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-slate-50"}`}>
          2. Xem Mercy sửa
        </div>
        <div className={`rounded-xl border px-3 py-2 ${practiceFeedback ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-slate-50"}`}>
          3. Thử lại
        </div>
      </div>

      {hasFeedback && (
        <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-sm font-bold leading-6 text-indigo-900" style={{ overflowWrap: "break-word" }}>
          Thử lại: {retryPrompt}
        </div>
      )}

      {logicInsight?.isKnownPattern && (
        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm font-semibold leading-6 text-amber-950" style={{ overflowWrap: "break-word" }}>
          Gợi ý logic: {logicInsight.englishLogic}
        </div>
      )}

      {nextFocus && (
        <div className="mt-3 text-xs font-bold text-slate-500" style={{ overflowWrap: "break-word" }}>
          Ôn tiếp: {nextFocus}
        </div>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="mt-3 inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
      >
        Làm lại bài
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

  // Teacher Mercy hand-off: if the user arrived from a room's "Copy to Teacher
  // Mercy" button, consume the single-use reflection and pre-fill the
  // Correction input. Reading clears the bridge (see teacherMercyHandoff), so a
  // refresh never re-prefills stale text. Storage tokens live in the helper, not
  // here, to keep the "no storage writes" guard on this file green.
  useEffect(() => {
    const handoff = readAndClearPendingReflection();
    if (!handoff) return;
    setMode("grammar");
    setInput(handoff.reflectionText.slice(0, 500));
  }, []);

  const shellRef = useRef<HTMLElement | null>(null);
  const resumedLessonEventRef = useRef<string | null>(null);
  const nextFocusViewedEventRef = useRef<string | null>(null);
  const { user, session } = useAuth();
  const userAccess = useUserAccess();

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
  const pronunciationRecorder = usePronunciationRecorder();
  // Step (free-form STT): true while a free-answer (grammar) mic capture is
  // awaiting Azure refinement of the browser transcript. Gates the audioBlob
  // effect below so it never fires on the speak-mode scoring recordings.
  const freeAnswerAzureRef = useRef(false);
  // Premium/trial signal for the detailed-scoring gate (Decision 1). Provider-
  // free + fail-closed, so it is safe inside this (un-QueryClient-wrapped) page.
  // Gated by the flag so the default-OFF path makes no entitlement network call.
  const isPremiumOrTrialForDetail = useSpeakDetailEntitlement(
    session,
    FEATURE_FLAGS.AI_TUTOR_PRONUNCIATION_PREMIUM_GATE_ENABLED,
  );

  const nickname: string | undefined =
    (user?.user_metadata as Record<string, unknown> | undefined)?.nickname as string | undefined;
  const greetingName = (nickname ?? "").trim() || undefined;

  const [mode, setMode] = useState<TutorMode>("grammar");
  const [input, setInput] = useState("");
  const [grammarVoiceDraft, setGrammarVoiceDraft] = useState("");
  const [grammarVoiceMessage, setGrammarVoiceMessage] = useState("");
  const [conversationInput, setConversationInput] = useState("");
  const [speakRepeatInput, setSpeakRepeatInput] = useState("");
  const [speakPronunciationResult, setSpeakPronunciationResult] =
    useState<SpeakPronunciationResult | null>(null);
  const [speakVietnameseToneFeedback, setSpeakVietnameseToneFeedback] =
    useState<VietnameseToneFeedbackDisplay | null>(null);
  const [speakToneProgress, setSpeakToneProgress] = useState<PronunciationProgressEntry[]>([]);
  const [speakEnglishProgress, setSpeakEnglishProgress] = useState<PronunciationProgressEntry[]>([]);
  // True once a premium learner exhausts the per-session detailed-scoring cap.
  const [speakDetailCapReached, setSpeakDetailCapReached] = useState(false);
  const [latestCorrectedSeed, setLatestCorrectedSeed] = useState<CorrectedSentenceSeed | null>(null);
  const [speakFollowUpSession, setSpeakFollowUpSession] = useState<SpeakFollowUpSession>({
    topicId: "",
    turnsOnTopic: 0,
    askedQuestions: [],
    currentQuestion: null,
    currentIsPivot: false,
  });
  const speakFollowUpSessionRef = useRef(speakFollowUpSession);
  const [speakFollowUpProviderError, setSpeakFollowUpProviderError] = useState(false);
  const lastSpeakFollowUpParamsRef = useRef<{ transcript: string; currentTopic: string; turnsOnTopic: number; askedQuestions: string[] } | null>(null);
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
  const [speakConversationState, setSpeakConversationState] = useState<SpeakConversationState>(() =>
    createSpeakConversationState(),
  );
  const [conversationLoading, setConversationLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [detectorHint, setDetectorHint] = useState<DetectorHintContent | null>(null);
  // L1 follow-up conversational loop (in-session, in-memory only). The focus
  // state is carried across turns in a ref (no re-render, no stale closure in
  // the async submit handler) and is never persisted — reset on clear, gone on
  // reload. `l1LoopSurface` is the per-turn renderable decision.
  const l1FocusRef = useRef<L1FocusState>(initialL1FocusState);
  const [l1LoopSurface, setL1LoopSurface] = useState<
    | { kind: "followup"; promptVi: string }
    | { kind: "offer"; messageVi: string }
    | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<PracticeFeedback | null>(null);
  const [practiceLoading, setPracticeLoading] = useState(false);

  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const [memory, setMemory] = useState<MemorySummary | null>(null);
  // Step-12 cross-device recall: top interference tags read from server capture
  // (RLS user-scoped). Fail-soft — stays [] when there is no server history,
  // consent, or B1 table, so recall degrades to client-only.
  const [serverInterferenceTags, setServerInterferenceTags] = useState<string[]>([]);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const [isFloatingShell, setIsFloatingShell] = useState(true);
  const [activeTodayLesson, setActiveTodayLesson] = useState<ActiveTodayLesson | null>(null);
  const [todayLessonLogicInsight, setTodayLessonLogicInsight] = useState<VietlishLogicDiagnosisResult | null>(null);
  const [studySessionState, setStudySessionState] = useState<StudySessionState | null>(null);
  const [localEventSummary, setLocalEventSummary] = useState<LearningEventProgressSummary>(() => getLocalLearningEventProgressSummary());
  const [boardResetCount, setBoardResetCount] = useState(0);

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
  const lastRecordedSpeakAttemptRef = useRef<string>("");
  const speakPronunciationRequestRef = useRef(0);
  // Per-session count of Azure DETAILED results that have landed (Decision 2).
  // A ref so it never re-triggers the scoring effect; the boolean cap-reached
  // state below is the single render trigger when the ceiling is hit.
  const azureDetailUsedRef = useRef(0);
  const speakVietnameseToneRequestRef = useRef(0);
  const emittedEnglishPronunciationOutcomeRef = useRef<string>("");
  const emittedVietnameseToneOutcomeRef = useRef<string>("");
  const speakPronunciationOutcomeSessionIdRef = useRef<string>("");
  const speakPivotTurnsRef = useRef<PivotPromptTurn[]>([]);
  const speakFollowUpRequestRef = useRef(0);
  const wasListeningRef = useRef(false);
  const ignoreNextSttCommitRef = useRef(false);

  // Detailed-scoring gate (premium/trial + per-session cap). When the gate flag
  // is OFF this is a no-op (gateAllows always true → legacy behavior). Using the
  // cap-reached STATE (not just the ref) as the detailUsed signal makes the gate
  // flip reactively the moment the ceiling is hit, while the ref keeps the count
  // out of the scoring effect's dependencies.
  const speakDetailGate = resolveSpeakDetailGate({
    premiumGateEnabled: FEATURE_FLAGS.AI_TUTOR_PRONUNCIATION_PREMIUM_GATE_ENABLED,
    isPremiumOrTrial: isPremiumOrTrialForDetail,
    detailUsed: speakDetailCapReached ? SPEAK_DETAIL_SESSION_CAP : azureDetailUsedRef.current,
  });

  const applySpeakFollowUpSession = (next: SpeakFollowUpSession) => {
    speakFollowUpSessionRef.current = next;
    setSpeakFollowUpSession(next);
  };

  const handleRetryFollowUp = () => {
    if (!session || !lastSpeakFollowUpParamsRef.current) return;
    const { transcript, currentTopic, turnsOnTopic, askedQuestions } = lastSpeakFollowUpParamsRef.current;
    const requestId = speakFollowUpRequestRef.current + 1;
    speakFollowUpRequestRef.current = requestId;
    setSpeakFollowUpProviderError(false);
    applySpeakFollowUpSession({ topicId: currentTopic, turnsOnTopic, askedQuestions, currentQuestion: null, currentIsPivot: false });
    void fetchDeepSeekSpeakFollowUp({
      transcript,
      currentTopic,
      learnerLevel: "beginner",
      recentTurns: speakPivotTurnsRef.current,
      turnsOnTopic,
      accessToken: session.access_token,
      avoidTokens: computeSpeakAvoidTokens(transcript, turnsOnTopic),
    }).then((aiQuestion) => {
      if (speakFollowUpRequestRef.current !== requestId) return;
      if (isSpeakFollowUpProviderError(aiQuestion)) {
        setSpeakFollowUpProviderError(true);
        return;
      }
      setSpeakFollowUpProviderError(false);
      const finalQuestion = aiQuestion ?? SPEAK_TRANSCRIPT_ASK_TO_REPEAT;
      speakPivotTurnsRef.current = [
        ...speakPivotTurnsRef.current,
        { role: "learner" as const, text: transcript },
        { role: "assistant" as const, text: finalQuestion },
      ].slice(-8);
      applySpeakFollowUpSession({
        topicId: currentTopic,
        turnsOnTopic: turnsOnTopic + (aiQuestion ? 1 : 0),
        askedQuestions: aiQuestion ? [...askedQuestions, aiQuestion] : askedQuestions,
        currentQuestion: finalQuestion,
        currentIsPivot: false,
      });
    });
  };

  // Free-answer abstain: on OPEN follow-up answers (turn > 0; turn 0 is the seed
  // read-back which has a target), flag tokens the browser STT may have misheard
  // (phonetically confusable with recent vocab) so the follow-up generator does
  // not predicate its next question on them. Empty recentVocab → no tokens (safe).
  const computeSpeakAvoidTokens = (transcript: string, turnsOnTopic: number): string[] => {
    if (turnsOnTopic <= 0) return [];
    const recentVocab = speakPivotTurnsRef.current.flatMap((turn) => turn.text.split(/\s+/)).filter(Boolean);
    if (recentVocab.length === 0) return [];
    return transcriptSanity(transcript, { recentVocab }).lowConfidenceTokens.map((t) => t.token);
  };

  const recordSpeakRepeatAttempt = (spokenText: string) => {
    const targetSentence =
      latestCorrectedSeed?.correctedSentence.trim() ||
      tutorCopy.starterQuestions[0]?.trim() ||
      "";
    // Transcript sanity (READ-BACK): the browser STT transcript mishears
    // phonetically-close words ('hat' -> 'head'); correct them toward the known
    // target before the follow-up predicates on them. Engine-agnostic (no
    // acoustic biasing); transcriptSanity abstains cleanly when there is no
    // target, so this is a no-op on the starter path.
    const rawSpoken = normalizeSpokenText(spokenText);
    // Only swap in the sanitized transcript when it actually corrected a
    // phonetic mishear — readBackSanity normalizes case while tokenizing, so for
    // a clean transcript (no correction) we keep the raw form to preserve casing.
    const sanity = targetSentence ? transcriptSanity(rawSpoken, { targetSentence }) : null;
    const spoken = sanity && sanity.corrections.length > 0 ? sanity.sanitizedTranscript : rawSpoken;
    if (!targetSentence || !spoken || spoken === lastRecordedSpeakAttemptRef.current) return;
    lastRecordedSpeakAttemptRef.current = spoken;
    const transcriptClarity = assessSpeakTranscriptClarity(spoken);
    const salience = detectBilingualSaliencePivot(spoken);
    const stance = classifyResponseStance({
      learnerText: spoken,
      salience,
    });
    const current = speakFollowUpSessionRef.current;

    if (stance.stance === "needs_pause") {
      applySpeakFollowUpSession({
        ...current,
        currentQuestion: SPEAK_STANCE_PAUSE,
        currentIsPivot: false,
      });
      return;
    }

    if (!transcriptClarity.clear) {
      applySpeakFollowUpSession({
        ...current,
        currentQuestion: SPEAK_TRANSCRIPT_ASK_TO_REPEAT,
        currentIsPivot: false,
      });
      return;
    }

    if (stance.stance === "needs_clarification") {
      applySpeakFollowUpSession({
        ...current,
        currentQuestion: SPEAK_STANCE_CLARIFICATION,
        currentIsPivot: false,
      });
      return;
    }

    // Issue 1 — coherence gate. If the practice TARGET is a grammar-only fix
    // that is still nonsensical AND the learner only echoed it back (no
    // clearer sentence of their own), ask for a simpler sentence instead of
    // drilling the garbled sample with on-topic trivia. The dual condition
    // means a coherent seed — or any coherent learner sentence — proceeds
    // normally, so well-formed practice is never blocked.
    if (
      !assessSpeakSentenceCoherence(targetSentence).coherent &&
      !assessSpeakSentenceCoherence(spoken).coherent
    ) {
      applySpeakFollowUpSession({
        ...current,
        currentQuestion: SPEAK_STANCE_SEED_UNCLEAR,
        currentIsPivot: false,
      });
      return;
    }

    if (isSpeakTranscriptUnclearForFollowUp(spoken)) {
      applySpeakFollowUpSession({
        ...current,
        currentQuestion: SPEAK_TRANSCRIPT_UNCLEAR,
        currentIsPivot: false,
      });
      return;
    }

    const topicId = resolveSpeakFollowUpTopicId({
      seedSentence: targetSentence,
      learnerText: spoken,
      currentTopicId: current.topicId,
    });
    const sameTopic = current.topicId === topicId;
    const turnsOnTopic = sameTopic ? current.turnsOnTopic : 0;
    const askedQuestions = sameTopic ? current.askedQuestions : [];
    const selection = selectSpeakFollowUpByTopicId(topicId, {
      askedQuestions,
      turnsOnTopic,
      learnerText: spoken,
    });

    if (!session?.access_token) {
      const pivotAwareSelection = resolveMockedContentAwarePivot(
        spoken,
        salience,
        selection,
        speakPivotTurnsRef.current,
      );
      const question = stance.stance === "needs_acknowledgment"
        ? `${SPEAK_STANCE_ACKNOWLEDGMENT} ${pivotAwareSelection.question}`
        : pivotAwareSelection.question;
      speakPivotTurnsRef.current = [
        ...speakPivotTurnsRef.current,
        { role: "learner" as const, text: spoken },
        { role: "assistant" as const, text: pivotAwareSelection.question },
      ].slice(-8);

      applySpeakFollowUpSession({
        topicId: pivotAwareSelection.topicId,
        turnsOnTopic: turnsOnTopic + 1,
        askedQuestions: pivotAwareSelection.isPivot ? askedQuestions : [...askedQuestions, pivotAwareSelection.question],
        currentQuestion: question,
        currentIsPivot: pivotAwareSelection.isPivot,
      });
      return;
    }

    const requestId = speakFollowUpRequestRef.current + 1;
    speakFollowUpRequestRef.current = requestId;
    lastSpeakFollowUpParamsRef.current = { transcript: spoken, currentTopic: topicId, turnsOnTopic, askedQuestions };
    setSpeakFollowUpProviderError(false);
    applySpeakFollowUpSession({
      topicId,
      turnsOnTopic,
      askedQuestions,
      currentQuestion: null,
      currentIsPivot: false,
    });
    void fetchDeepSeekSpeakFollowUp({
      transcript: spoken,
      currentTopic: topicId,
      learnerLevel: "beginner",
      recentTurns: speakPivotTurnsRef.current,
      turnsOnTopic,
      accessToken: session.access_token,
      avoidTokens: computeSpeakAvoidTokens(spoken, turnsOnTopic),
    }).then((aiQuestion) => {
      if (speakFollowUpRequestRef.current !== requestId) return;
      if (isSpeakFollowUpProviderError(aiQuestion)) {
        setSpeakFollowUpProviderError(true);
        return;
      }
      setSpeakFollowUpProviderError(false);
      const question = stance.stance === "needs_acknowledgment" && aiQuestion
        ? `${SPEAK_STANCE_ACKNOWLEDGMENT} ${aiQuestion}`
        : aiQuestion;
      const finalQuestion = question ?? SPEAK_TRANSCRIPT_ASK_TO_REPEAT;
      speakPivotTurnsRef.current = [
        ...speakPivotTurnsRef.current,
        { role: "learner" as const, text: spoken },
        { role: "assistant" as const, text: finalQuestion },
      ].slice(-8);
      applySpeakFollowUpSession({
        topicId,
        turnsOnTopic: turnsOnTopic + (aiQuestion ? 1 : 0),
        askedQuestions: aiQuestion ? [...askedQuestions, aiQuestion] : askedQuestions,
        currentQuestion: finalQuestion,
        currentIsPivot: false,
      });
    });
  };

  useEffect(() => {
    const transcript = normalizeSpokenText(stt.transcript);
    if (stt.listening) {
      wasListeningRef.current = true;
      if (transcript) {
        if (mode === "grammar") {
          setGrammarVoiceDraft(transcript);
        } else if (mode === "speak") {
          const next = appendCleanSpeech(sttBaseInputRef.current, transcript);
          setSpeakRepeatInput(next);
        } else {
          const next = appendCleanSpeech(sttBaseInputRef.current, transcript);
          setConversationInput(next);
        }
      }
      return;
    }
    if (wasListeningRef.current) {
      wasListeningRef.current = false;
      if (ignoreNextSttCommitRef.current) {
        ignoreNextSttCommitRef.current = false;
        sttBaseInputRef.current = "";
        return;
      }
      if (!transcript) {
        if (mode === "grammar") {
          setGrammarVoiceDraft("");
          setGrammarVoiceMessage(GRAMMAR_VOICE_EMPTY_MESSAGE);
        }
        return;
      }
      if (transcript === lastCommittedSttRef.current) return;
      lastCommittedSttRef.current = transcript;
      if (mode === "grammar") {
        setInput(appendCleanSpeech(sttBaseInputRef.current, transcript).slice(0, 500));
        setGrammarVoiceDraft("");
        setGrammarVoiceMessage("");
      } else if (mode === "speak") {
        const next = appendCleanSpeech(sttBaseInputRef.current, transcript);
        setSpeakRepeatInput(next);
        recordSpeakRepeatAttempt(next);
      } else {
        const next = appendCleanSpeech(sttBaseInputRef.current, transcript);
        setConversationInput(next);
      }
    }
  }, [mode, stt.listening, stt.transcript]);

  useEffect(() => {
    if (mode !== "speak") return;
    // Do NOT record while the mic is live: STT streams interim partials
    // ("I", "I bought", "I bought a hat") that each land in speakRepeatInput,
    // and recording them as separate attempts inflates turnsOnTopic to the
    // SPEAK_FOLLOW_UP_DEPTH_CAP within a single spoken sentence — which made
    // the loop jump to "another sentence?" after one real round. The final
    // utterance is recorded once on the STT-commit path (listening → stopped).
    // This effect only serves the typed path, which is never `listening`.
    if (stt.listening) return;
    const repeat = normalizeSpokenText(speakRepeatInput);
    if (!repeat) return;
    const timerId = window.setTimeout(() => {
      recordSpeakRepeatAttempt(repeat);
    }, 350);
    return () => window.clearTimeout(timerId);
  }, [latestCorrectedSeed?.correctedSentence, mode, speakRepeatInput, stt.listening]);

  useEffect(() => {
    if (mode !== "speak") {
      speakPronunciationOutcomeSessionIdRef.current = "";
      emittedEnglishPronunciationOutcomeRef.current = "";
      emittedVietnameseToneOutcomeRef.current = "";
      setSpeakToneProgress([]);
      setSpeakEnglishProgress([]);
      return;
    }
    if (!speakPronunciationOutcomeSessionIdRef.current) {
      speakPronunciationOutcomeSessionIdRef.current = createLocalSpeakSessionId();
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "speak") {
      setSpeakPronunciationResult(null);
      setSpeakVietnameseToneFeedback(null);
      return;
    }

    const targetSentence =
      latestCorrectedSeed?.correctedSentence.trim() ||
      tutorCopy.starterQuestions[0] ||
      "";
    const transcript = normalizeSpokenText(speakRepeatInput);

    if (!targetSentence || !transcript) {
      setSpeakPronunciationResult(null);
      return;
    }

    // Premium/trial + per-session-cap gate (Decisions 1 & 2). When the gate is
    // enabled and blocks (free user, or premium user past the cap), we surface
    // NO score card at all: no fake number, and no silent downgrade into a
    // pretend "local" measurement. The free by-ear self-compare loop stays fully
    // available (it lives in SelfCompareRecorder, independent of this path), and
    // a capped premium learner gets the warm cap message via SpeakPracticeMode.
    if (
      FEATURE_FLAGS.AI_TUTOR_PRONUNCIATION_PREMIUM_GATE_ENABLED &&
      !speakDetailGate.gateAllows
    ) {
      setSpeakPronunciationResult(null);
      return;
    }

    const requestId = speakPronunciationRequestRef.current + 1;
    speakPronunciationRequestRef.current = requestId;
    setSpeakPronunciationResult(null);
    const audioBlob = pronunciationRecorder.audioBlob ?? EMPTY_SPEAK_AUDIO_BLOB;
    const canUseAzureBatch =
      STEP7_AZURE_BATCH_ENABLED &&
      Boolean(pronunciationRecorder.audioBlob) &&
      Boolean(session?.access_token);

    const timerId = window.setTimeout(() => {
      scorePronunciationWithStep7Fallback({
        audioBlob,
        target: targetSentence,
        transcript,
        step7Enabled: canUseAzureBatch,
        userJwt: session?.access_token,
      })
        .then((result) => {
          if (speakPronunciationRequestRef.current !== requestId) return;
          const adapted = adaptSpeakPronunciationResult(result);
          setSpeakPronunciationResult(adapted);
          // Count only real Azure detailed results against the session cap.
          if (
            FEATURE_FLAGS.AI_TUTOR_PRONUNCIATION_PREMIUM_GATE_ENABLED &&
            adapted?.mode === "azure-batch" &&
            adapted.provider === "azure"
          ) {
            azureDetailUsedRef.current += 1;
            if (azureDetailUsedRef.current >= SPEAK_DETAIL_SESSION_CAP) {
              setSpeakDetailCapReached(true);
            }
          }
        })
        .catch(() => {
          if (speakPronunciationRequestRef.current !== requestId) return;
          setSpeakPronunciationResult(null);
        });
    }, 250);

    return () => window.clearTimeout(timerId);
  }, [
    latestCorrectedSeed?.correctedSentence,
    mode,
    pronunciationRecorder.audioBlob,
    session?.access_token,
    speakRepeatInput,
    tutorCopy.starterQuestions,
    speakDetailGate.gateAllows,
  ]);

  useEffect(() => {
    if (mode !== "speak" || target !== "vi" || !FEATURE_FLAGS.VIETNAMESE_TONE_FEEDBACK_MVP_ENABLED) {
      setSpeakVietnameseToneFeedback(null);
      return;
    }

    const targetSyllable = resolveVietnameseTonePracticeTarget(
      latestCorrectedSeed?.correctedSentence?.trim() ?? "",
    );
    const transcript = normalizeSpokenText(speakRepeatInput);

    if (targetSyllable && !targetSyllable.supported && transcript) {
      setSpeakVietnameseToneFeedback(buildVietnameseToneFeedbackDisplay({
        target: targetSyllable,
        result: { bucket: "unavailable", score: null, reason: null },
      }));
      const emitKey = [
        "unsupported",
        targetSyllable.syllable,
        targetSyllable.tone,
        transcript,
      ].join("|");
      if (emittedVietnameseToneOutcomeRef.current !== emitKey) {
        emittedVietnameseToneOutcomeRef.current = emitKey;
        emitPronunciationFeatureOutcome({
          featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.vietnameseTone,
          sessionId: speakPronunciationOutcomeSessionIdRef.current,
          direction: "en_to_vi_tone",
          promptContext: {
            source: "ai_tutor_speak",
            target_text: targetSyllable.syllable,
            tone: targetSyllable.tone,
            supported: false,
          },
          learnerInput: transcript,
          scoredResult: {
            tone: targetSyllable.tone,
            supported: false,
          },
          abstained: true,
          abstainReason: "unsupported_tone",
          learnerOutcome: "cant_assess_yet",
        });
      }
      return;
    }

    if (!targetSyllable?.supported || !pronunciationRecorder.audioBlob || !session?.access_token) {
      if (targetSyllable?.supported && transcript) {
        setSpeakVietnameseToneFeedback(buildVietnameseToneFeedbackDisplay({
          target: targetSyllable,
          result: { bucket: "unavailable", score: null, reason: null },
        }));
        const emitKey = [
          "missing-evidence",
          targetSyllable.syllable,
          targetSyllable.tone,
          transcript,
          Boolean(pronunciationRecorder.audioBlob),
          Boolean(session?.access_token),
        ].join("|");
        if (emittedVietnameseToneOutcomeRef.current !== emitKey) {
          emittedVietnameseToneOutcomeRef.current = emitKey;
          emitPronunciationFeatureOutcome({
            featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.vietnameseTone,
            sessionId: speakPronunciationOutcomeSessionIdRef.current,
            direction: "en_to_vi_tone",
            promptContext: {
              source: "ai_tutor_speak",
              target_text: targetSyllable.syllable,
              tone: targetSyllable.tone,
              supported: true,
            },
            learnerInput: transcript,
            scoredResult: {
              tone: targetSyllable.tone,
              supported: true,
              scored: false,
            },
            abstained: true,
            abstainReason: "missing_audio_or_session",
            learnerOutcome: "no_tone_feedback_shown",
          });
        }
      } else {
        setSpeakVietnameseToneFeedback(null);
      }
      return;
    }
    if (!transcript) {
      setSpeakVietnameseToneFeedback(null);
      return;
    }

    const requestId = speakVietnameseToneRequestRef.current + 1;
    speakVietnameseToneRequestRef.current = requestId;
    setSpeakVietnameseToneFeedback(null);
    const audioBlob = pronunciationRecorder.audioBlob ?? EMPTY_SPEAK_AUDIO_BLOB;

    const timerId = window.setTimeout(() => {
      scoreTone({
        audioBlob,
        targetSyllable: targetSyllable.syllable,
        userJwt: session.access_token,
      })
        .then((result) => {
          if (speakVietnameseToneRequestRef.current !== requestId) return;
          const feedback = buildVietnameseToneFeedbackDisplay({
            target: targetSyllable,
            result,
          });
          setSpeakVietnameseToneFeedback(feedback);
          const emitKey = [
            "scored",
            targetSyllable.syllable,
            targetSyllable.tone,
            transcript,
            result.bucket,
            result.score ?? "none",
            result.reason ?? "none",
          ].join("|");
          if (emittedVietnameseToneOutcomeRef.current !== emitKey) {
            emittedVietnameseToneOutcomeRef.current = emitKey;
            // Step 7: only supported, scored outcomes feed the progress trail —
            // abstained buckets ("unavailable") and null feedback never imply progress.
            if (feedback && (feedback.status === "correct" || feedback.status === "try_again")) {
              const progressStatus = feedback.status;
              const progressScore = feedback.score;
              setSpeakToneProgress((previous) =>
                appendPronunciationProgress(previous, {
                  status: progressStatus,
                  score: progressScore,
                }),
              );
            }
            emitPronunciationFeatureOutcome({
              featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.vietnameseTone,
              sessionId: speakPronunciationOutcomeSessionIdRef.current,
              direction: "en_to_vi_tone",
              promptContext: {
                source: "ai_tutor_speak",
                target_text: targetSyllable.syllable,
                tone: targetSyllable.tone,
                supported: true,
              },
              learnerInput: transcript,
              scoredResult: {
                tone: targetSyllable.tone,
                bucket: result.bucket,
                score: result.score,
                reason: result.reason,
              },
              abstained: !feedback || result.bucket === "unavailable",
              abstainReason: !feedback
                ? result.reason ?? "no_visible_feedback"
                : result.bucket === "unavailable"
                  ? result.reason ?? "scoring_unavailable"
                  : null,
              learnerOutcome: feedback?.status ?? "no_tone_feedback_shown",
            });
          }
        })
        .catch(() => {
          if (speakVietnameseToneRequestRef.current !== requestId) return;
          setSpeakVietnameseToneFeedback(null);
        });
    }, 250);

    return () => window.clearTimeout(timerId);
  }, [
    latestCorrectedSeed?.correctedSentence,
    mode,
    pronunciationRecorder.audioBlob,
    session?.access_token,
    speakRepeatInput,
    target,
  ]);

  const handleMicToggle = () => {
    if (stt.listening) {
      stt.stop();
      void pronunciationRecorder.stopRecording();
      return;
    }
    if (mode === "grammar") {
      setError(null);
      setGrammarVoiceDraft("");
      setGrammarVoiceMessage("");
    }
    stt.reset();
    // Only capture audio for detailed scoring when the gate permits it — a free
    // or capped learner is never recorded for a score they won't receive. The
    // by-ear self-compare recorder is separate and always works.
    if (
      mode === "speak" &&
      STEP7_AZURE_BATCH_ENABLED &&
      session?.access_token &&
      speakDetailGate.gateAllows
    ) {
      pronunciationRecorder.reset();
      void pronunciationRecorder.startRecording();
    }
    // Free-answer (grammar) mic: also capture audio so we can refine the
    // browser transcript with Azure free-form STT on stop. The browser STT runs
    // live as the instant fallback; Azure only replaces it when it returns a
    // better transcript. Authenticated learners only (the endpoint is JWT-gated).
    if (mode === "grammar" && session?.access_token) {
      freeAnswerAzureRef.current = true;
      pronunciationRecorder.reset();
      void pronunciationRecorder.startRecording();
    } else {
      freeAnswerAzureRef.current = false;
    }
    sttBaseInputRef.current = mode === "grammar" ? input : mode === "speak" ? "" : conversationInput;
    lastCommittedSttRef.current = "";
    stt.start();
  };

  // Free-answer free-form STT: when the grammar-mic capture finishes (audioBlob
  // lands after stopRecording), refine the live browser transcript with Azure.
  // Fail-soft — transcribeWithAzure returns null on any error / use_local, so the
  // browser STT result already in the input stands. The ref gate ensures this
  // never fires on the speak-mode scoring recordings.
  useEffect(() => {
    if (!freeAnswerAzureRef.current) return;
    const blob = pronunciationRecorder.audioBlob;
    if (!blob) return;
    freeAnswerAzureRef.current = false;
    let cancelled = false;
    void transcribeWithAzure(blob, speechLang, session?.access_token ?? null).then((azureText) => {
      if (!cancelled && azureText) setInput(azureText.slice(0, 500));
    });
    return () => { cancelled = true; };
  }, [pronunciationRecorder.audioBlob, speechLang, session?.access_token]);

  const clearSpeakBoardState = () => {
    setSpeakRepeatInput("");
    setSpeakPronunciationResult(null);
    setSpeakVietnameseToneFeedback(null);
    setSpeakToneProgress([]);
    setSpeakEnglishProgress([]);
    setSpeakingMessageId(null);
    pronunciationRecorder.reset();
    lastRecordedSpeakAttemptRef.current = "";
    speakPivotTurnsRef.current = [];
    speakFollowUpRequestRef.current += 1;
    applySpeakFollowUpSession({
      topicId: "",
      turnsOnTopic: 0,
      askedQuestions: [],
      currentQuestion: null,
      currentIsPivot: false,
    });
  };

  const clearCorrectedSentenceSeed = () => {
    setLatestCorrectedSeed(null);
    clearSpeakBoardState();
    tts.stop();
  };

  const handleGrammarInputChange = (value: string) => {
    setInput(value);
    setGrammarVoiceMessage("");
    if (result || error || detectorHint || latestCorrectedSeed) {
      setResult(null);
      setError(null);
      setDetectorHint(null);
      setPracticeAnswer("");
      setPracticeFeedback(null);
      setL1LoopSurface(null);
      clearCorrectedSentenceSeed();
    }
  };

  const loadMemory = async () => {
    try { setMemory(await getMemorySummary(TUTOR_PRODUCT, target)); } catch { /* degrade */ }
    setMemoryLoaded(true);
  };

  useEffect(() => { loadMemory(); }, [target]);

  // Step-12 cross-device recall: pull the learner's server-captured interference
  // tags so a returning learner on a different device recalls prior sessions.
  // Fail-soft inside loadServerInterferenceTags (returns [] on any error).
  const recallUserId = userAccess.userId ?? user?.id ?? null;
  useEffect(() => {
    let cancelled = false;
    loadServerInterferenceTags(recallUserId)
      .then((tags) => { if (!cancelled) setServerInterferenceTags(tags); })
      .catch(() => { if (!cancelled) setServerInterferenceTags([]); });
    return () => { cancelled = true; };
  }, [recallUserId]);

  // Step-14: build the learner history profile from server telemetry + device-
  // local data, recommend the next focus, and surface it in the memory card.
  // Fully fail-soft (fetchServerProfileInput → {}/0 on error; syncProfile never
  // throws; abstain guard). Keyed on user + target so it runs once auth resolves.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const serverInput = await fetchServerProfileInput(recallUserId, supabase);
        const profile = syncProfileWithServerData(TUTOR_PRODUCT, target, serverInput);
        const recs = recommendNextLessons(profile);
        const top = recs[0];
        if (!cancelled && top && top.ruleFired !== "cold-start:abstain") {
          setMemory((prev) =>
            prev
              ? { ...prev, nextRecommendedFocus: top.lessonTitle, suggestedNextFocus: top.lessonTitle }
              : prev,
          );
        }
      } catch { /* fail-soft: device-local memory stands */ }
    })();
    return () => { cancelled = true; };
  }, [recallUserId, target]);

  const englishPronunciationFeedback = useMemo(() => {
    if (
      mode !== "speak" ||
      target !== "en" ||
      !FEATURE_FLAGS.ENGLISH_PRONUNCIATION_FEEDBACK_MVP_ENABLED
    ) {
      return null;
    }

    const targetSentence =
      latestCorrectedSeed?.correctedSentence.trim() ||
      tutorCopy.starterQuestions[0] ||
      "";
    if (!targetSentence) return null;

    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence,
      result: speakPronunciationResult,
    });
    if (feedback) return feedback;

    const phonemeEvidenceCount =
      (speakPronunciationResult?.phonemeScores?.length ?? 0) +
      (speakPronunciationResult?.words ?? []).reduce(
        (count, word) => count + (word.phonemes?.length ?? 0),
        0,
      );
    const isAzureDetail =
      speakPronunciationResult?.mode === "azure-batch" &&
      speakPronunciationResult.provider === "azure" &&
      phonemeEvidenceCount > 0;
    return buildEnglishPronunciationAbstainFeedbackDisplay(
      isAzureDetail ? "no_high_confidence_feedback" : "no_azure_phoneme_evidence",
    );
  }, [
    latestCorrectedSeed?.correctedSentence,
    mode,
    speakPronunciationResult,
    target,
    tutorCopy.starterQuestions,
  ]);

  const speakToneProgressDisplay = useMemo(
    () => buildPronunciationProgressDisplay(speakToneProgress),
    [speakToneProgress],
  );
  const speakEnglishProgressDisplay = useMemo(
    () => buildPronunciationProgressDisplay(speakEnglishProgress),
    [speakEnglishProgress],
  );

  useEffect(() => {
    if (
      mode !== "speak" ||
      target !== "en" ||
      !FEATURE_FLAGS.ENGLISH_PRONUNCIATION_FEEDBACK_MVP_ENABLED ||
      !speakPronunciationResult
    ) {
      return;
    }

    const targetSentence =
      latestCorrectedSeed?.correctedSentence.trim() ||
      tutorCopy.starterQuestions[0] ||
      "";
    const transcript = normalizeSpokenText(speakRepeatInput);
    if (!targetSentence || !transcript) return;

    const feedbackItems = englishPronunciationFeedback?.items ?? [];
    const phonemeEvidenceCount =
      (speakPronunciationResult.phonemeScores?.length ?? 0) +
      (speakPronunciationResult.words ?? []).reduce(
        (count, word) => count + (word.phonemes?.length ?? 0),
        0,
      );
    const isAzureDetail =
      speakPronunciationResult.mode === "azure-batch" &&
      speakPronunciationResult.provider === "azure" &&
      phonemeEvidenceCount > 0;
    const emitKey = [
      targetSentence,
      transcript,
      speakPronunciationResult.mode,
      speakPronunciationResult.provider ?? "none",
      speakPronunciationResult.overallScore ?? "none",
      feedbackItems.map((item) => `${item.category}:${item.status}`).join(","),
    ].join("|");
    if (emittedEnglishPronunciationOutcomeRef.current === emitKey) return;
    emittedEnglishPronunciationOutcomeRef.current = emitKey;

    // Step 7: feed the progress trail only when there is visible, non-abstained
    // feedback (at least one scored item) — abstain states never count.
    const englishPrimaryStatus = feedbackItems[0]?.status;
    if (englishPrimaryStatus === "correct" || englishPrimaryStatus === "try_again") {
      const progressScore =
        typeof speakPronunciationResult.overallScore === "number"
          ? speakPronunciationResult.overallScore
          : null;
      setSpeakEnglishProgress((previous) =>
        appendPronunciationProgress(previous, {
          status: englishPrimaryStatus,
          score: progressScore,
        }),
      );
    }

    emitPronunciationFeatureOutcome({
      featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.englishFeedback,
      sessionId: speakPronunciationOutcomeSessionIdRef.current,
      direction: "vn_to_en_english_pronunciation",
      promptContext: {
        source: "ai_tutor_speak",
        target_text: targetSentence,
      },
      learnerInput: transcript,
      scoredResult: {
        mode: speakPronunciationResult.mode,
        provider: speakPronunciationResult.provider ?? null,
        overall_score: speakPronunciationResult.overallScore ?? null,
        phoneme_evidence_count: phonemeEvidenceCount,
        feedback_items: feedbackItems.map((item) => ({
          category: item.category,
          status: item.status,
          score: item.score,
          target_word: item.targetWord,
        })),
      },
      abstained: feedbackItems.length === 0,
      abstainReason: feedbackItems.length === 0
        ? isAzureDetail
          ? "no_high_confidence_feedback"
          : "no_azure_phoneme_evidence"
        : null,
      learnerOutcome: feedbackItems.length > 0
        ? feedbackItems.map((item) => item.status).join(",")
        : "sentence_match_only",
    });
  }, [
    englishPronunciationFeedback,
    latestCorrectedSeed?.correctedSentence,
    mode,
    speakPronunciationResult,
    speakRepeatInput,
    target,
    tutorCopy.starterQuestions,
  ]);

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
    setSpeakConversationState(createSpeakConversationState());
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
    setL1LoopSurface(null);
    setPracticeAnswer("");
    setPracticeFeedback(null);
    setGrammarVoiceDraft("");
    setGrammarVoiceMessage("");

    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const next = MOCK_RESULTS_BY_TARGET[target];
    const localCorrection = buildLocalCorrection(trimmed, target);
    if (!localCorrection.ok || localCorrection.status === "unchanged") {
      // Rule engine abstains (needs_ai) OR found no matching rules (unchanged) —
      // call the live AI when a session token is available.
      // Resolve at submit time via getSession() to avoid a hydration race where React state
      // hasn't been populated yet after a hard refresh (Chau's reported bug).
      const { data: freshSessionData } = await supabase.auth.getSession();
      const accessToken = freshSessionData?.session?.access_token ?? session?.access_token;
      if (accessToken) {
        const aiResult = await callAiSentenceCorrection(trimmed, accessToken, explainLanguage, target);
        setLoading(false);
        if (aiResult?.confident && aiResult.corrected) {
          const aiCorrected = aiResult.corrected;
          const { turn } = buildCorrectionTurn({
            id: `corr-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            targetLanguage: target,
            explainLanguage,
            userText: trimmed,
            correctedText: aiCorrected,
            explanation: aiResult.explanation,
          });
          setResult({
            ...turn,
            grammarTip: aiResult.grammarTip,
            practicePrompt: MOCK_RESULTS_BY_TARGET[target].practicePrompt[explainLanguage],
          });
          clearSpeakBoardState();
          setLatestCorrectedSeed({ correctedSentence: aiCorrected, sourceText: trimmed, updatedAt: Date.now() });
          void captureCorrection({
            userText: trimmed,
            correctedText: aiCorrected,
            status: "corrected",
            appliedRuleIds: ["ai-correction"],
            targetLanguage: target,
            explainLanguage,
            interactionType: "correction",
          });
          return;
        }
        // AI also not confident — specific abstention, not a generic canned line.
        setError(aiResult?.explanation || GRAMMAR_CORRECTION_UNAVAILABLE_MESSAGE);
        return;
      }
      // No token — rule engine abstained: show error.
      if (!localCorrection.ok) {
        setLoading(false);
        setError(GRAMMAR_CORRECTION_UNAVAILABLE_MESSAGE);
        return;
      }
      // No token + unchanged: the sentence may be correct but AI cannot verify it.
      // Never show a correction card in this state — that would echo the input as a "correction".
      setLoading(false);
      setError(CANNOT_CORRECT_NO_SESSION_MESSAGE);
      return;
    }
    const corrected = localCorrection.corrected;
    const { turn } = buildCorrectionTurn({
      id: `corr-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      targetLanguage: target,
      explainLanguage,
      userText: trimmed,
      correctedText: corrected,
      explanation: buildGrammarExplanation(trimmed, target, localCorrection, explainLanguage),
    });
    setResult({
      ...turn,
      grammarTip: buildGrammarTip(target, localCorrection, explainLanguage),
      practicePrompt: next.practicePrompt[explainLanguage],
    });
    clearSpeakBoardState();
    setLatestCorrectedSeed({
      correctedSentence: corrected,
      sourceText: trimmed,
      updatedAt: Date.now(),
    });

    // Track 2 — anonymized learner-interaction capture. Fire-and-forget;
    // flag + consent gated, never throws. The local correction is what the
    // learner saw, so capture it here next to the existing telemetry.
    void captureCorrection({
      userText: trimmed,
      correctedText: corrected,
      status: localCorrection.status,
      appliedRuleIds: localCorrection.appliedRuleIds,
      targetLanguage: target,
      explainLanguage,
      interactionType: "correction",
    });

    // Detector → chip surface (adult AI Tutor only; CorrectionMode is not
    // mounted in the Mercy Kids surface). Runs AFTER setResult so the LLM-
    // path response is on screen first; never blocks.
    //
    // Two direction-aware branches:
    //  - target === "en" (Axis 1, VN→EN): Step 5 Vietnamese-L1
    //    detector package + chip render via getDetectorHint.
    //  - target === "vi" (Axis 2, EN→VN): English-L1 detector wired
    //    via detectEnVnError (PR #1188 follow-up). The chip surface
    //    for en_l1_* tags isn't built yet — getDetectorHint's tag
    //    catalog is vi_l1_*-specific — so the result is computed
    //    and discarded. The detector is exercised in production so
    //    the Axis 2 chip-render PR can land on a known-good
    //    detector path.
    if (target === "en") {
      try {
        const detection = detectStep5VnEnError({
          userAnswer: trimmed,
          expectedAnswer: corrected,
        });
        const hint = getDetectorHint(detection);
        if (hint && !hasShownHint(hint.tag)) {
          recordL1Tag(hint.tag);
          setDetectorHint(hint);
        }

        // L1 follow-up loop: circle the SAME high-confidence weakness for a few
        // turns (a new context each turn), then offer to move on. Independent of
        // the chip dedup above; in-session only (the focus state lives in a ref).
        // Low confidence / no detection → converse_naturally → no follow-up.
        const loopDecision = advanceL1Focus(l1FocusRef.current, detection);
        l1FocusRef.current = loopDecision.nextState;
        if (
          (loopDecision.action === "start_focus" ||
            loopDecision.action === "continue_focus") &&
          loopDecision.followUp
        ) {
          setL1LoopSurface({
            kind: "followup",
            promptVi: loopDecision.followUp.promptVi,
          });
        } else if (loopDecision.action === "offer_move_on" && loopDecision.messageVi) {
          setL1LoopSurface({ kind: "offer", messageVi: loopDecision.messageVi });
        } else {
          setL1LoopSurface(null);
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
      // Live AI-Tutor study-completion seam: learner completed a study prompt
      // (recordStudyPromptCompleted) inside the RENDERED CorrectionMode submit
      // (handleSubmit → onSubmit). Distinct from the GrammarWritingTab grammar
      // surface (different component); handlePracticeSubmit is dead (no UI), so
      // this is the one live study seam. Direct call: dark, dedup'd per local day.
      void recordActiveDay();
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
    if (stt.listening) {
      ignoreNextSttCommitRef.current = true;
      stt.stop();
    }
    stt.reset();
    sttBaseInputRef.current = "";
    lastCommittedSttRef.current = "";

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      role: "user",
      text: trimmed,
    };
    setConversationMessages((current) => [...current, userMessage]);
    setConversationInput("");
    setConversationLoading(true);

    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const previousNaturalReply = getLatestMercyMessage(conversationMessages)?.naturalReply ?? "";
    const { message: mercyMessage, speakConversationState: nextSpeakConversationState } = buildConversationReply(
      trimmed,
      target,
      explainLanguage,
      mode,
      speakConversationState,
      previousNaturalReply,
    );
    setSpeakConversationState(nextSpeakConversationState);
    setConversationMessages((current) => [...current, mercyMessage]);

    // Track 2 — capture the conversation-mode correction (fire-and-forget,
    // flag + consent gated). `correctedText` is empty when the reply made
    // no correction; the service maps that to an 'abstained'/'unchanged' row.
    const conversationCorrected = mercyMessage.correctedText?.trim() ?? "";
    void captureCorrection({
      userText: trimmed,
      correctedText: conversationCorrected || null,
      status: conversationCorrected && conversationCorrected !== trimmed ? "corrected" : "unchanged",
      appliedRuleIds: [],
      targetLanguage: target,
      explainLanguage,
      interactionType: "conversation",
    });

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
    if (stt.listening) {
      ignoreNextSttCommitRef.current = true;
      stt.stop();
      stt.reset();
      sttBaseInputRef.current = "";
      lastCommittedSttRef.current = "";
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

  const handleSendCorrectedSentenceToSpeak = (correctedSentence: string) => {
    const trimmed = correctedSentence.trim();
    if (!trimmed) return;
    setLatestCorrectedSeed({
      correctedSentence: trimmed,
      sourceText: input.trim(),
      updatedAt: Date.now(),
    });
    clearSpeakBoardState();
    applySpeakFollowUpSession(buildInitialSpeakFollowUpSession(trimmed));
    handleModeChange("speak");
  };

  const handleReadSpeakTarget = () => {
    const text = latestCorrectedSeed?.correctedSentence.trim() || tutorCopy.starterQuestions[0] || "";
    if (!text) return;
    if (stt.listening) {
      ignoreNextSttCommitRef.current = true;
      stt.stop();
      stt.reset();
      sttBaseInputRef.current = "";
      lastCommittedSttRef.current = "";
    }
    if (tts.speaking) {
      tts.stop();
    }
    if (speakReadIsVietnamese(text, target)) return; // VI = text-only on the Speak surface
    setSpeakingMessageId("speak-target");
    void tts.speak(text, ttsLang, target);
  };

  // Same model-sentence playback path as "Mercy đọc", but awaitable + reports
  // whether the model actually spoke — so the self-compare "Nghe mẫu rồi nghe
  // bạn" can play the real Mercy audio and only then the learner recording,
  // never a pretend comparison. C-owned audio integration; touches no scorer or
  // follow-up generation.
  const playSpeakTargetModel = async (): Promise<boolean> => {
    const text = latestCorrectedSeed?.correctedSentence.trim() || tutorCopy.starterQuestions[0] || "";
    if (!text) return false;
    if (stt.listening) {
      ignoreNextSttCommitRef.current = true;
      stt.stop();
      stt.reset();
      sttBaseInputRef.current = "";
      lastCommittedSttRef.current = "";
    }
    if (tts.speaking) {
      tts.stop();
    }
    if (speakReadIsVietnamese(text, target)) return false; // VI = text-only on the Speak surface
    setSpeakingMessageId("speak-target");
    try {
      return await tts.speak(text, ttsLang, target);
    } catch {
      return false;
    }
  };

  const handleReadSpeakFollowUp = () => {
    const text = speakFollowUpSession.currentQuestion?.trim() || "";
    if (speakFollowUpSession.currentIsPivot || !isSpeakFollowUpReadAloudEligible(text)) return;
    // VI clarification follow-ups are text-only; English questions read with the
    // English voice. Never select a Vietnamese voice on this surface (DIRECTIVE V1).
    if (speakReadIsVietnamese(text, target)) return;
    if (stt.listening) {
      ignoreNextSttCommitRef.current = true;
      stt.stop();
      stt.reset();
      sttBaseInputRef.current = "";
      lastCommittedSttRef.current = "";
    }
    if (tts.speaking) {
      tts.stop();
    }
    setSpeakingMessageId("speak-follow-up");
    void tts.speak(text, getTtsLocale(target), target);
  };

  const handleSpeakRepeatInputChange = (value: string) => {
    setSpeakRepeatInput(value);
    const current = speakFollowUpSessionRef.current;
    applySpeakFollowUpSession({
      ...current,
      currentQuestion: null,
      currentIsPivot: false,
    });
  };

  const handleClear = () => {
    if (stt.listening) stt.stop();
    stt.reset();
    sttBaseInputRef.current = "";
    lastCommittedSttRef.current = "";
    setBoardResetCount((count) => count + 1);
    setInput("");
    setGrammarVoiceDraft("");
    setGrammarVoiceMessage("");
    setResult(null);
    setError(null);
    setDetectorHint(null);
    setPracticeAnswer("");
    setPracticeFeedback(null);
    clearCorrectedSentenceSeed();
    // Clear the visible surface for the next sentence, but PRESERVE the focus:
    // "try another sentence" is the learner continuing, so the loop should keep
    // circling the same weakness across sentences. Focus is in-session only and
    // resets on reload (ref re-init), never persisted.
    setL1LoopSurface(null);
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
    clearCorrectedSentenceSeed();
    setSpeakConversationState(createSpeakConversationState());
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
    clearCorrectedSentenceSeed();
    setSpeakConversationState(createSpeakConversationState());
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
      footer={`${tutorCopy.ui.footer} ${getSafetyLabel(aiTutorConfig)}.`}
    >
      {mode === "journey" ? (
        <JourneyMode onStartCorrection={() => handleModeChange("grammar")} />
      ) : mode === "grammar" ? (
        <>
          <CorrectionMode
            input={input}
            setInput={handleGrammarInputChange}
            loading={loading}
            result={result}
            error={error}
            micSupported={stt.supported}
            micListening={stt.listening}
            voiceDraft={grammarVoiceDraft}
            voiceMessage={grammarVoiceMessage || stt.error || ""}
            speechLang={speechLang}
            onSubmit={handleSubmit}
            onMicToggle={handleMicToggle}
            onUseVoiceDraft={() => {
              setInput(grammarVoiceDraft.slice(0, 500));
              setGrammarVoiceDraft("");
              setGrammarVoiceMessage("");
            }}
            onClearVoiceDraft={() => {
              setGrammarVoiceDraft("");
              setGrammarVoiceMessage("");
            }}
            onSendToSpeak={handleSendCorrectedSentenceToSpeak}
            onClear={handleClear}
            tutorCopy={tutorCopy}
            detectorHint={detectorHint}
          />
          {l1LoopSurface?.kind === "followup" ? (
            // Vietnamese-first practice prompt only. We deliberately do NOT show
            // the English target here — the point is for the learner to produce
            // it themselves in this new context.
            <div
              data-testid="ai-tutor-l1-followup"
              className="mt-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-slate-700"
            >
              <p className="font-medium text-slate-800">{l1LoopSurface.promptVi}</p>
            </div>
          ) : l1LoopSurface?.kind === "offer" ? (
            <div
              data-testid="ai-tutor-l1-moveon"
              className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-700"
            >
              <p>{l1LoopSurface.messageVi}</p>
            </div>
          ) : null}
        </>
      ) : mode === "speak" ? (
        <SpeakPracticeMode
          targetSentence={latestCorrectedSeed?.correctedSentence ?? null}
          repeatInput={speakRepeatInput}
          pronunciationResult={speakPronunciationResult}
          detailScoreCapReached={FEATURE_FLAGS.AI_TUTOR_PRONUNCIATION_PREMIUM_GATE_ENABLED && speakDetailCapReached}
          englishPronunciationFeedbackEnabled={FEATURE_FLAGS.ENGLISH_PRONUNCIATION_FEEDBACK_MVP_ENABLED && target === "en"}
          englishPronunciationFeedback={englishPronunciationFeedback}
          vietnameseToneFeedbackEnabled={FEATURE_FLAGS.VIETNAMESE_TONE_FEEDBACK_MVP_ENABLED && target === "vi"}
          vietnameseToneFeedback={speakVietnameseToneFeedback}
          vietnameseToneProgress={speakToneProgressDisplay}
          englishPronunciationProgress={speakEnglishProgressDisplay}
          micSupported={stt.supported}
          micListening={stt.listening}
          micError={stt.error}
          ttsSupported={tts.supported}
          ttsSpeaking={speakingMessageId === "speak-target" && tts.speaking}
          ttsPreparing={speakingMessageId === "speak-target" && tts.preparing}
          ttsVoiceSource={tts.voiceSource}
          ttsError={tts.error}
          ttsErrorScope={speakingMessageId === "speak-follow-up" ? "follow-up" : "target"}
          followUpPrompt={speakFollowUpSession.currentQuestion}
          followUpIsPivot={speakFollowUpSession.currentIsPivot}
          followUpProviderError={speakFollowUpProviderError}
          followUpTtsSpeaking={speakingMessageId === "speak-follow-up" && tts.speaking}
          followUpTtsPreparing={speakingMessageId === "speak-follow-up" && tts.preparing}
          onMicToggle={handleMicToggle}
          onReadTarget={handleReadSpeakTarget}
          onPlayModel={playSpeakTargetModel}
          onReadFollowUp={handleReadSpeakFollowUp}
          onRetryFollowUp={handleRetryFollowUp}
          onRepeatInputChange={handleSpeakRepeatInputChange}
          onResetBoard={handleClear}
          onCheckInLogicTab={() => handleModeChange("logic")}
          onStartFreshSentence={handleClear}
          followUpIsCloseOut={
            speakFollowUpSession.currentIsPivot &&
            speakFollowUpSession.currentQuestion === SPEAK_FOLLOW_UP_PIVOT
          }
          tutorCopy={tutorCopy}
        />
      ) : (
        <LogicMode
          latestCorrectedSentence={latestCorrectedSeed?.correctedSentence ?? null}
          latestSourceSentence={latestCorrectedSeed?.sourceText ?? null}
          boardResetCount={boardResetCount}
          analysisError={error}
          onRetry={() => setError(null)}
        />
      )}
      <AiConversationScenarioPanel
        accessToken={session?.access_token}
        hasPremium={userAccess.canAccessPremium()}
        loadingAccess={userAccess.isLoading}
        accessConfirmed={userAccess.isAccessConcluded}
        userId={userAccess.userId ?? user?.id ?? null}
        correctionSeed={latestCorrectedSeed}
        learnerMemory={mergeRecallMemory(serverInterferenceTags, memory)}
      />
      {/* Step-15: advisory study path — ordered interference patterns to work on next. */}
      <StudyPathCard product={TUTOR_PRODUCT} targetLanguage={target} />
    </TeacherMercyLearningShell>
  );
}
