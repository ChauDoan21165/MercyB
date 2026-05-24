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
import {
  AI_CORRECTION_REQUIRED_MESSAGE,
  correctWithTutorRules,
} from "@/lib/tutor/correctionEngine";
import CorrectionMode from "@/components/ai-tutor/CorrectionMode";
import ConversationMode, {
  type ConversationMessage,
  type MercyConversationMessage,
} from "@/components/ai-tutor/ConversationMode";
import TutorMemoryCard, {
  TutorMemoryEmpty,
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
  const normalized = userText.toLowerCase();
  const isInterested = normalized.includes("interested") || normalized.includes("interesting");
  const isGoSchool = normalized.includes("go school") || normalized.includes("go to school");
  const isPastTense = normalized.includes("yesterday") || normalized.includes("bought") || normalized.includes("buy a hat");

  let explanation: string;
  let naturalReply: string;
  let nextQuestion: string = LOGIC_STARTER_PROMPTS[1];

  if (isInterested) {
    explanation = explainLanguage === "vi"
      ? "Logic tiếng Anh: “interested” mô tả cảm giác của người nhận tác động, còn “interesting” mô tả thứ gây ra cảm giác đó. Vì vậy “I’m interested in English” nghĩa là tôi có hứng thú với tiếng Anh; “I’m interesting in English” lại nghe như tôi là người thú vị ở trong tiếng Anh."
      : "English logic: “interested” describes the person who feels something, while “interesting” describes the thing that causes the feeling. “I’m interested in English” means I feel interest in English; “I’m interesting in English” makes the speaker sound like the interesting object.";
    naturalReply = explainLanguage === "vi"
      ? "Cách nghĩ tiếng Việt: “tôi thấy tiếng Anh thú vị.” Cách nghĩ tiếng Anh: người cảm nhận dùng “interested”, vật gây cảm giác dùng “interesting”. Mẫu cần nhớ: I am interested in + noun; English is interesting."
      : "Vietnamese thinking says “I find English interesting.” English separates the experiencer from the cause: I am interested in English; English is interesting. Pattern: person + be interested in; thing + be interesting.";
    nextQuestion = LOGIC_STARTER_PROMPTS[1];
  } else if (isGoSchool) {
    explanation = explainLanguage === "vi"
      ? "Logic tiếng Anh: “go” thường cần giới từ để nối tới nơi đến. “School” là nơi/institution, nên cấu trúc tự nhiên là “go to school”. Tiếng Việt có thể nói “đi học/đi trường” mà không cần một từ như “to”, nhưng tiếng Anh cần cầu nối đó."
      : "English logic: “go” normally needs a preposition to connect it to a destination. “School” works as a place or institution, so natural English says “go to school.” Vietnamese can omit this bridge, but English usually keeps it.";
    naturalReply = explainLanguage === "vi"
      ? "Cách nghĩ tiếng Việt: động từ + nơi đến. Cách nghĩ tiếng Anh: go + to + destination. Mẫu cần nhớ: go to school, go to work, go to the market."
      : "Vietnamese thinking can be verb + place. English thinking is go + to + destination. Pattern: go to school, go to work, go to the market.";
    nextQuestion = LOGIC_STARTER_PROMPTS[2];
  } else if (isPastTense) {
    explanation = explainLanguage === "vi"
      ? "Logic tiếng Anh: khi câu nói về quá khứ, thời gian phải hiện trên động từ. “Yesterday” báo hiệu quá khứ, nên “buy” đổi thành “bought”. Tiếng Việt thường dùng từ thời gian như “hôm qua” mà không đổi động từ, nhưng tiếng Anh bắt buộc đổi dạng động từ."
      : "English logic: when the sentence is about the past, the verb must show past time. “Yesterday” signals the past, so “buy” becomes “bought.” Vietnamese can keep the verb unchanged and rely on the time word; English marks time on the verb.";
    naturalReply = explainLanguage === "vi"
      ? "Cách nghĩ tiếng Việt: “hôm qua” đủ để hiểu quá khứ. Cách nghĩ tiếng Anh: trạng từ thời gian chưa đủ, động từ cũng phải đổi. Mẫu cần nhớ: yesterday/last week/ago + past verb."
      : "Vietnamese thinking uses the time word to carry the past meaning. English thinking requires both the time word and the past verb. Pattern: yesterday/last week/ago + past verb.";
    nextQuestion = LOGIC_STARTER_PROMPTS[0];
  } else {
    explanation = explainLanguage === "vi"
      ? "Mercy sẽ nhìn câu theo logic tiếng Anh: phần nào là chủ ngữ, động từ chính ở đâu, thời gian nằm ở động từ hay trạng từ, và tiếng Việt đang khiến bạn dịch từng chữ ở điểm nào."
      : "Mercy will read the sentence through English logic: where the subject is, where the main verb is, whether time belongs on the verb or an adverb, and where word-for-word Vietnamese translation makes the sentence unnatural.";
    naturalReply = explainLanguage === "vi"
      ? "Mẫu cần nhớ: đừng dịch từng chữ. Hãy hỏi tiếng Anh cần thành phần nào để câu đủ tự nhiên, rồi so sánh với cách tiếng Việt rút gọn ý."
      : "Pattern to remember: do not translate word by word. Ask what English requires to sound complete, then compare it with what Vietnamese can leave implicit.";
  }

  const { turn } = buildConversationTurn({
    id: `mercy-logic-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    targetLanguage: "en",
    explainLanguage,
    userText,
    correctedText: "",
    explanation,
    naturalReply,
    nextQuestion,
  });
  return { ...turn, role: "mercy" };
}

export default function AiTutorPage() {
  const shellRef = useRef<HTMLElement | null>(null);
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
  const [error, setError] = useState<string | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<PracticeFeedback | null>(null);
  const [practiceLoading, setPracticeLoading] = useState(false);

  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const [memory, setMemory] = useState<MemorySummary | null>(null);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const [isFloatingShell, setIsFloatingShell] = useState(true);

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
      onModeChange={setMode}
      memorySlot={aiTutorConfig.memoryEnabled ? (
        <>
          <TutorTodayLessonCard
            memoryLoaded={memoryLoaded}
            memory={memory}
            onStartLesson={(suggestedMode) => setMode(suggestedMode)}
          />
          <TutorMemoryCard memoryLoaded={memoryLoaded} memory={memory} />
        </>
      ) : undefined}
      reminderSlot={aiTutorConfig.memoryEnabled ? <TutorMemoryEmpty memoryLoaded={memoryLoaded} memory={memory} /> : undefined}
      footer={`${tutorCopy.ui.footer} ${getSafetyLabel(aiTutorConfig)}.`}
    >
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
