// src/pages/AiTutor.tsx
// AI Tutor page orchestrator — delegates the shared Teacher Mercy frame to
// TeacherMercyLearningShell and keeps product behavior local/mock-only.

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  putCorrection,
  markPracticed,
  getMemorySummary,
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
  getTutorSpeechLang,
  getExplainLanguage,
  normalizeSpokenText,
  appendCleanSpeech,
} from "@/lib/ai-tutor/tutorUiCopy";
import type {
  TutorTarget,
  ExplainLanguage,
  TutorTargetCopy,
  UiCopy,
} from "@/lib/ai-tutor/tutorUiCopy";
import CorrectionMode from "@/components/ai-tutor/CorrectionMode";
import ConversationMode, { type ConversationMessage } from "@/components/ai-tutor/ConversationMode";
import TutorMemoryCard, { TutorMemoryEmpty } from "@/components/ai-tutor/TutorMemoryCard";
import TeacherMercyLearningShell from "@/components/teacher-mercy/TeacherMercyLearningShell";
import { getSpeakableText } from "@/lib/teacher-mercy/voiceEngine";

type CorrectionResult = {
  corrected: string;
  explanation: string;
  grammarTip: string;
  practicePrompt: string;
};

type PracticeFeedback = {
  encouragement: string;
  tip: string;
  nextStep: string;
};

type TutorMode = "correction" | "conversation";

const AI_TUTOR_MODE_TABS: Array<{ id: TutorMode; label: string }> = [
  { id: "correction", label: "Correct one sentence" },
  { id: "conversation", label: "Conversation with Mercy" },
];

const AI_TUTOR_PILLAR_TABS = [
  { id: "journey", label: "Journey", active: true },
  { id: "grammar", label: "Grammar" },
  { id: "speak", label: "Speak" },
  { id: "logic", label: "Logic" },
] as const;

const MOCK_DELAY_MS = 600;

const CONVERSATION_STARTERS: Record<TutorTarget, string> = {
  en: "What do you usually do in the morning?",
  fr: "Qu'est-ce que tu fais le matin ?",
  zh: "你早上通常做什么？",
  de: "Was machst du morgens normalerweise?",
  ja: "朝、たいてい何をしますか？",
  ko: "아침에 보통 무엇을 해요?",
  es: "¿Qué haces normalmente por la mañana?",
  vi: "Buổi sáng bạn thường làm gì?",
};

const CONVERSATION_REPLIES: Record<TutorTarget, { reply: string; nextQuestion: string }> = {
  en: {
    reply: "Nice. That sounds like a clear morning routine.",
    nextQuestion: "What do you do after that?",
  },
  fr: {
    reply: "Très bien. Ta routine du matin est claire.",
    nextQuestion: "Qu'est-ce que tu fais après ça ?",
  },
  zh: {
    reply: "很好。你的早上习惯很清楚。",
    nextQuestion: "然后你做什么？",
  },
  de: {
    reply: "Gut. Deine Morgenroutine ist klar.",
    nextQuestion: "Was machst du danach?",
  },
  ja: {
    reply: "いいですね。朝の習慣がよく分かります。",
    nextQuestion: "その後、何をしますか？",
  },
  ko: {
    reply: "좋아요. 아침 습관이 잘 보여요.",
    nextQuestion: "그다음에 무엇을 해요?",
  },
  es: {
    reply: "Muy bien. Tu rutina de la mañana está clara.",
    nextQuestion: "¿Qué haces después de eso?",
  },
  vi: {
    reply: "Tốt lắm. Câu trả lời của bạn rõ và tự nhiên.",
    nextQuestion: "Sau đó bạn thường làm gì?",
  },
};

function createOpeningMessage(target: TutorTarget): ConversationMessage {
  return {
    id: `mercy-open-${target}`,
    role: "mercy",
    text: "Mercy will ask one easy question.",
    nextQuestion: CONVERSATION_STARTERS[target],
  };
}

function buildConversationReply(
  userText: string,
  target: TutorTarget,
  explainLanguage: ExplainLanguage,
): ConversationMessage {
  const corrected = buildInputAwareCorrection(userText, target);
  const mock = MOCK_RESULTS_BY_TARGET[target];
  const reply = CONVERSATION_REPLIES[target];
  return {
    id: `mercy-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    role: "mercy",
    text: "Good. Mercy will keep it simple.",
    correction: corrected,
    explanation: mock.explanation[explainLanguage],
    reply: reply.reply,
    nextQuestion: reply.nextQuestion,
  };
}

function conversationSpeakText(message: ConversationMessage): string {
  return getSpeakableText(message);
}

export default function AiTutorPage() {
  const shellRef = useRef<HTMLElement | null>(null);
  const { user } = useAuth();

  const [target, setTarget] = useState<TutorTarget>(() =>
    typeof window === "undefined" ? "en" : getTutorTargetFromSearch(window.location.search),
  );
  const [explainLanguage, setExplainLanguage] = useState<ExplainLanguage>(() => getExplainLanguage());
  const speechLang = getTutorSpeechLang(target);
  const stt = useBrowserStt(speechLang);
  const tts = useTtsSpeaker();

  const nickname: string | undefined =
    (user?.user_metadata as Record<string, unknown> | undefined)?.nickname as string | undefined;
  const greetingName = (nickname ?? "").trim() || undefined;

  const [mode, setMode] = useState<TutorMode>("correction");
  const [input, setInput] = useState("");
  const [conversationInput, setConversationInput] = useState("");
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>(() => [
    createOpeningMessage(typeof window === "undefined" ? "en" : getTutorTargetFromSearch(window.location.search)),
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

  const sttBaseInputRef = useRef<string>("");
  const lastCommittedSttRef = useRef<string>("");
  const wasListeningRef = useRef(false);

  useEffect(() => {
    const transcript = normalizeSpokenText(stt.transcript);
    if (stt.listening) {
      wasListeningRef.current = true;
      if (transcript) {
        const next = appendCleanSpeech(sttBaseInputRef.current, transcript);
        if (mode === "conversation") setConversationInput(next);
        else setInput(next);
      }
      return;
    }
    if (wasListeningRef.current) {
      wasListeningRef.current = false;
      if (!transcript || transcript === lastCommittedSttRef.current) return;
      lastCommittedSttRef.current = transcript;
      const next = appendCleanSpeech(sttBaseInputRef.current, transcript);
      if (mode === "conversation") setConversationInput(next);
      else setInput(next);
    }
  }, [mode, stt.listening, stt.transcript]);

  const handleMicToggle = () => {
    if (stt.listening) { stt.stop(); return; }
    sttBaseInputRef.current = mode === "conversation" ? conversationInput : input;
    lastCommittedSttRef.current = "";
    stt.start();
  };

  const loadMemory = async () => {
    try { setMemory(await getMemorySummary()); } catch { /* degrade */ }
    setMemoryLoaded(true);
  };

  useEffect(() => { loadMemory(); }, []);

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
    const syncTarget = () => setTarget(getTutorTargetFromSearch(window.location.search));
    syncTarget();
    window.addEventListener("popstate", syncTarget);
    return () => window.removeEventListener("popstate", syncTarget);
  }, []);

  useEffect(() => {
    setConversationMessages([createOpeningMessage(target)]);
    setConversationInput("");
    setSpeakingMessageId(null);
    tts.stop();
  }, [target]);

  useEffect(() => {
    const syncExplain = () => setExplainLanguage(getExplainLanguage());
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
    const corrected = buildInputAwareCorrection(trimmed, target);
    setResult({
      corrected,
      explanation: next.explanation[explainLanguage],
      grammarTip: next.grammarTip[explainLanguage],
      practicePrompt: next.practicePrompt[explainLanguage],
    });
    setLoading(false);

    const id = `corr-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    setLastSavedId(id);
    putCorrection({
      id, original: trimmed, corrected,
      topic: next.grammarTip[explainLanguage].slice(0, 60),
      cefr: "B1", createdAt: Date.now(), practiced: false,
    }).then(() => loadMemory()).catch(() => {});
  };

  const handlePracticeSubmit = async () => {
    if (!practiceAnswer.trim()) return;
    setPracticeLoading(true);
    setPracticeFeedback(null);
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    setPracticeFeedback(MOCK_RESULTS_BY_TARGET[target].feedback);
    setPracticeLoading(false);
    if (lastSavedId) markPracticed(lastSavedId).then(() => loadMemory()).catch(() => {});
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
      original: "",
      corrected: "",
      topic: `conversation-${target}`,
      cefr: "B1",
      createdAt: Date.now(),
      practiced: true,
    }).then(() => loadMemory()).catch(() => {});
  };

  const handleConversationSpeak = (message: ConversationMessage) => {
    if (speakingMessageId === message.id && tts.speaking) {
      tts.stop();
      setSpeakingMessageId(null);
      return;
    }
    const text = conversationSpeakText(message);
    if (!text) return;
    setSpeakingMessageId(message.id);
    void tts.speak(text, speechLang, target);
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
      title={uiCopy.title(targetCopy, target)}
      subtitle={uiCopy.subtitle(targetCopy)}
      helper={uiCopy.helper(targetCopy)}
      eyebrow={targetCopy.eyebrow}
      badge="Mock"
      modeTabs={AI_TUTOR_MODE_TABS}
      activeMode={mode}
      onModeChange={setMode}
      pillarTabs={AI_TUTOR_PILLAR_TABS}
      memorySlot={<TutorMemoryCard memoryLoaded={memoryLoaded} memory={memory} />}
      reminderSlot={<TutorMemoryEmpty memoryLoaded={memoryLoaded} memory={memory} />}
      footer={uiCopy.footer}
    >
      {mode === "correction" ? (
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
            const corrected = result?.corrected;
            if (!corrected) return;
            if (tts.speaking) {
              tts.stop();
            } else {
              void tts.speak(corrected, speechLang, target);
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
