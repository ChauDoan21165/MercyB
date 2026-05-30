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
import {
  getSpeakFollowUpTopicId,
  resolveSpeakFollowUpTopicId,
  selectSpeakFollowUpByTopicId,
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
import { recordL1Tag } from "@/lib/stage-3a/adapters/l1TagAdapter";
import type {
  ConversationMessage,
  MercyConversationMessage,
} from "@/components/ai-tutor/ConversationMode";
import JourneyMode from "@/components/ai-tutor/JourneyMode";
import SpeakPracticeMode, {
  isSpeakFollowUpReadAloudEligible,
} from "@/components/ai-tutor/SpeakPracticeMode";
import LogicMode from "@/components/ai-tutor/LogicMode";
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
const SPEAK_STANCE_PAUSE = "I’m sorry that happened. Let’s pause correction for a moment. Are you okay to continue?";

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
  return buildEnglishConversationExplanation(userText, correction, explainLanguage)
    || (explainLanguage === "vi"
      ? "Câu của bạn đã rõ. Mercy chỉ chỉnh dấu câu hoặc cách diễn đạt cho tự nhiên hơn."
      : "Your sentence is clear. Mercy only adjusted punctuation or phrasing.");
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
  const [grammarVoiceDraft, setGrammarVoiceDraft] = useState("");
  const [conversationInput, setConversationInput] = useState("");
  const [speakRepeatInput, setSpeakRepeatInput] = useState("");
  const [latestCorrectedSeed, setLatestCorrectedSeed] = useState<CorrectedSentenceSeed | null>(null);
  const [speakFollowUpSession, setSpeakFollowUpSession] = useState<SpeakFollowUpSession>({
    topicId: "",
    turnsOnTopic: 0,
    askedQuestions: [],
    currentQuestion: null,
    currentIsPivot: false,
  });
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
  const lastRecordedSpeakAttemptRef = useRef<string>("");
  const speakPivotTurnsRef = useRef<PivotPromptTurn[]>([]);
  const wasListeningRef = useRef(false);
  const ignoreNextSttCommitRef = useRef(false);

  const recordSpeakRepeatAttempt = (spokenText: string) => {
    const targetSentence = latestCorrectedSeed?.correctedSentence.trim();
    const spoken = normalizeSpokenText(spokenText);
    if (!targetSentence || !spoken || spoken === lastRecordedSpeakAttemptRef.current) return;
    lastRecordedSpeakAttemptRef.current = spoken;
    const salience = detectBilingualSaliencePivot(spoken);
    const stance = classifyResponseStance({
      learnerText: spoken,
      salience,
    });

    setSpeakFollowUpSession((current) => {
      if (stance.stance === "needs_pause") {
        return {
          ...current,
          currentQuestion: SPEAK_STANCE_PAUSE,
          currentIsPivot: false,
        };
      }

      if (stance.stance === "needs_clarification") {
        return {
          ...current,
          currentQuestion: SPEAK_STANCE_CLARIFICATION,
          currentIsPivot: false,
        };
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
      });
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

      return {
        topicId: pivotAwareSelection.topicId,
        turnsOnTopic: turnsOnTopic + 1,
        askedQuestions: pivotAwareSelection.isPivot ? askedQuestions : [...askedQuestions, pivotAwareSelection.question],
        currentQuestion: question,
        currentIsPivot: pivotAwareSelection.isPivot,
      };
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
      if (!transcript || transcript === lastCommittedSttRef.current) return;
      lastCommittedSttRef.current = transcript;
      if (mode === "grammar") {
        setGrammarVoiceDraft(transcript);
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
    const repeat = normalizeSpokenText(speakRepeatInput);
    if (!repeat) return;
    const timerId = window.setTimeout(() => {
      recordSpeakRepeatAttempt(repeat);
    }, 350);
    return () => window.clearTimeout(timerId);
  }, [latestCorrectedSeed?.correctedSentence, mode, speakRepeatInput]);

  const handleMicToggle = () => {
    if (stt.listening) { stt.stop(); return; }
    stt.reset();
    sttBaseInputRef.current = mode === "grammar" ? input : mode === "speak" ? "" : conversationInput;
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
    setPracticeAnswer("");
    setPracticeFeedback(null);
    setGrammarVoiceDraft("");

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
      explanation: buildGrammarExplanation(trimmed, target, localCorrection, explainLanguage),
    });
    setResult({
      ...turn,
      grammarTip: buildGrammarTip(target, localCorrection, explainLanguage),
      practicePrompt: next.practicePrompt[explainLanguage],
    });
    setLatestCorrectedSeed({
      correctedSentence: corrected,
      sourceText: trimmed,
      updatedAt: Date.now(),
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
    setSpeakRepeatInput("");
    lastRecordedSpeakAttemptRef.current = "";
    speakPivotTurnsRef.current = [];
    setSpeakFollowUpSession({
      topicId: getSpeakFollowUpTopicId(trimmed),
      turnsOnTopic: 0,
      askedQuestions: [],
      currentQuestion: null,
      currentIsPivot: false,
    });
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
    setSpeakingMessageId("speak-target");
    void tts.speak(text, ttsLang, target);
  };

  const handleReadSpeakFollowUp = () => {
    const text = speakFollowUpSession.currentQuestion?.trim() || "";
    if (!isSpeakFollowUpReadAloudEligible(text)) return;
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
        <CorrectionMode
          input={input}
          setInput={setInput}
          loading={loading}
          result={result}
          error={error}
          micSupported={stt.supported}
          micListening={stt.listening}
          voiceDraft={grammarVoiceDraft}
          speechLang={speechLang}
          onSubmit={handleSubmit}
          onMicToggle={handleMicToggle}
          onUseVoiceDraft={() => {
            setInput(grammarVoiceDraft.slice(0, 500));
            setGrammarVoiceDraft("");
          }}
          onClearVoiceDraft={() => setGrammarVoiceDraft("")}
          onSendToSpeak={handleSendCorrectedSentenceToSpeak}
          onClear={handleClear}
          tutorCopy={tutorCopy}
          detectorHint={detectorHint}
        />
      ) : mode === "speak" ? (
        <SpeakPracticeMode
          targetSentence={latestCorrectedSeed?.correctedSentence ?? null}
          repeatInput={speakRepeatInput}
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
          followUpTtsSpeaking={speakingMessageId === "speak-follow-up" && tts.speaking}
          followUpTtsPreparing={speakingMessageId === "speak-follow-up" && tts.preparing}
          onMicToggle={handleMicToggle}
          onReadTarget={handleReadSpeakTarget}
          onReadFollowUp={handleReadSpeakFollowUp}
          onRepeatInputChange={setSpeakRepeatInput}
          tutorCopy={tutorCopy}
        />
      ) : (
        <LogicMode latestCorrectedSentence={latestCorrectedSeed?.correctedSentence ?? null} />
      )}
    </TeacherMercyLearningShell>
  );
}
