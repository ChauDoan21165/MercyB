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
  TARGET_COPY,
  UI_COPY,
  MOCK_RESULTS_BY_TARGET,
  buildInputAwareCorrection,
  getTutorTargetFromSearch,
  getExplainLanguage,
  normalizeSpokenText,
  appendCleanSpeech,
} from "@/lib/ai-tutor/tutorUiCopy";
import { getTutorCopy } from "@/lib/tutor/tutorCopy";
import { getSpeechLocale, getTtsLocale } from "@/lib/tutor/languageRegistry";
import type {
  TutorTarget,
  ExplainLanguage,
  TutorTargetCopy,
  UiCopy,
} from "@/lib/ai-tutor/tutorUiCopy";
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
import TutorMemoryCard, { TutorMemoryEmpty } from "@/components/ai-tutor/TutorMemoryCard";
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

type TutorMode = Extract<TutorProductMode, "conversation" | "grammar" | "speak" | "logic">;

const AI_TUTOR_MODES: TutorMode[] = ["conversation", "grammar", "speak", "logic"];

const MOCK_DELAY_MS = 600;
const TUTOR_PRODUCT: TutorProduct = "ai-tutor";

function createOpeningMessage(target: TutorTarget, explainLanguage: ExplainLanguage): MercyConversationMessage {
  const tutorCopy = getTutorCopy(target, explainLanguage);
  const { turn } = buildConversationTurn({
    id: `mercy-open-${target}`,
    targetLanguage: target,
    explainLanguage,
    userText: "",
    correctedText: "",
    explanation: "",
    naturalReply: tutorCopy.ui.emptyConversation,
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
): MercyConversationMessage {
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
      : "I can still help you practice. Try a simpler sentence, or use the AI correction engine when it is available.",
    nextQuestion: tutorCopy.nextQuestionTemplates[0] ?? "",
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

  const targetCopy: TutorTargetCopy = TARGET_COPY[target];
  const uiCopy: UiCopy = UI_COPY[explainLanguage];
  const modeTabs = AI_TUTOR_MODES.map((mode) => ({
    id: mode,
    label: mode === "conversation"
      ? "Journey"
      : mode === "grammar"
        ? "Grammar"
        : mode === "speak"
          ? "Speak"
          : "Logic",
  }));

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
    setConversationMessages([createOpeningMessage(target, explainLanguage)]);
    setConversationInput("");
    setSpeakingMessageId(null);
    tts.stop();
  }, [target, explainLanguage]);

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
      topic: next.grammarTip[explainLanguage].slice(0, 60),
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

    const mercyMessage = buildConversationReply(trimmed, target, explainLanguage);
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
      title={explainLanguage === "en" ? targetCopy.title : uiCopy.title(targetCopy, target)}
      subtitle={uiCopy.subtitle(targetCopy)}
      helper={uiCopy.helper(targetCopy)}
      eyebrow={targetCopy.eyebrow}
      badge="Mock"
      modeTabs={modeTabs}
      activeMode={mode}
      onModeChange={setMode}
      memorySlot={aiTutorConfig.memoryEnabled ? <TutorMemoryCard memoryLoaded={memoryLoaded} memory={memory} /> : undefined}
      reminderSlot={aiTutorConfig.memoryEnabled ? <TutorMemoryEmpty memoryLoaded={memoryLoaded} memory={memory} /> : undefined}
      footer={`${uiCopy.footer} ${getSafetyLabel(aiTutorConfig)}.`}
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
          ttsBrowserFallback={tts.usingBrowserFallback}
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
          targetCopy={targetCopy}
          uiCopy={uiCopy}
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
          ttsBrowserFallback={tts.usingBrowserFallback}
          ttsVoiceSource={tts.voiceSource}
          speakingMessageId={speakingMessageId}
          onSend={handleConversationSend}
          onMicToggle={handleMicToggle}
          onSpeak={handleConversationSpeak}
          targetCopy={targetCopy}
          uiCopy={uiCopy}
        />
      )}
    </TeacherMercyLearningShell>
  );
}
