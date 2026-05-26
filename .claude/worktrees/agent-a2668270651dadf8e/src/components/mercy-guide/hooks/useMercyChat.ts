/**
 * Path: src/components/mercy-guide/hooks/useMercyChat.ts
 */

import { useCallback, useRef, useState } from "react";
import type { GuideArticle } from "@/hooks/useMercyGuide";
import {
  GUIDE_ASSISTANT_TIMEOUT_MS,
  GUIDE_GENERIC_ERROR,
  GUIDE_TIMEOUT_FALLBACK,
  type Message,
  RATE_LIMIT_MESSAGE,
  SPEAK_LOCATION_REPLY,
  getAssistantVietnamese,
  getLocalMercyReply,
  isSpeakLocationIntent,
  looksIncompleteAssistantAnswer,
  sanitizeAssistantAnswer,
  splitBilingualAnswer,
} from "../shared";
import { askMercyApi } from "../api/askMercyApi";
import { useAuth } from "@/providers/AuthProvider";
import {
  buildProgressContext,
  type ProgressContext,
} from "@/lib/mercy/progressContext";
import {
  incrementMessageCounter,
  readMentionState,
  recordProgressMention,
  shouldProactivelyMentionProgress,
} from "@/lib/mercy/progressTriggers";
import {
  getPronunciationHelpReply,
  routeMercyMessage,
} from "../logic/routeMercyMessage";
import {
  isPronunciationHelpFollowUp,
  isPronunciationRepairMessage,
} from "../logic/detectMercyIntent";
import {
  getForbiddenGuideClaimType,
  getSafeGuidePolicyOverrideForViolation,
  isToddlerPolicyQuestion,
} from "../logic/mercyPolicy";

interface UseMercyChatParams {
  articles: Record<string, GuideArticle> | undefined;
  canAskQuestion: () => boolean;
  incrementQuestionCount: () => void;
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  englishLevel?: string | null;
  learningGoal?: string | null;
  onRequestSpeakTab: () => void;
  onRequestEnglishTab: () => void;
}

type AssistantReply = {
  en: string;
  vi: string;
};

type LocalReply = {
  en: string;
  vi?: string;
};

type TabAction = "open_speak" | "open_english";

export function useMercyChat({
  articles,
  canAskQuestion,
  incrementQuestionCount,
  roomId,
  roomTitle,
  tier,
  pathSlug,
  tags,
  englishLevel,
  learningGoal,
  onRequestSpeakTab,
  onRequestEnglishTab,
}: UseMercyChatParams) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const messageCounterRef = useRef(0);
  const lastContextIntentRef = useRef<string>("fallback_api");
  const activeRequestIdRef = useRef(0);

  const createMessageId = useCallback((prefix: string) => {
    messageCounterRef.current += 1;
    return `${prefix}-${Date.now()}-${messageCounterRef.current}`;
  }, []);

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const appendAssistantMessage = useCallback(
    (reply: AssistantReply, idPrefix = "assistant") => {
      appendMessage({
        id: createMessageId(idPrefix),
        type: "assistant",
        content: reply.en,
        contentVi: reply.vi,
      });
    },
    [appendMessage, createMessageId]
  );

  const normalizeAssistantReply = useCallback((reply: LocalReply): AssistantReply => {
    return {
      en: reply.en,
      vi: reply.vi ?? reply.en,
    };
  }, []);

  const openTabForAction = useCallback(
    (action: TabAction) => {
      if (action === "open_english") {
        onRequestEnglishTab();
        return;
      }
      onRequestSpeakTab();
    },
    [onRequestEnglishTab, onRequestSpeakTab]
  );

  const getUiReplyForAction = useCallback(
    (
      action?: TabAction,
      routedReply?: AssistantReply | null
    ): AssistantReply | null => {
      if (routedReply) return routedReply;

      if (action === "open_speak") {
        return {
          en: "I can help with speaking practice. I’m opening the Speak tab for you.",
          vi: "Mình có thể giúp bạn luyện nói. Mình đang mở tab Speak cho bạn nhé.",
        };
      }

      if (action === "open_english") {
        return {
          en: "I can help with English practice. I’m opening the English tab for you.",
          vi: "Mình có thể giúp bạn luyện tiếng Anh. Mình đang mở tab English cho bạn nhé.",
        };
      }

      return null;
    },
    []
  );

  const shouldUseLocalReply = useCallback(
    ({
      question,
      routedIntent,
      action,
      routedReply,
    }: {
      question: string;
      routedIntent: string;
      action?: TabAction;
      routedReply?: AssistantReply | null;
    }) => {
      if (routedIntent !== "fallback_api") return false;
      if (routedReply) return true;

      if (action === "open_speak" || action === "open_english") {
        return false;
      }

      const normalizedQuestion = question.toLowerCase().trim();
      const wordCount = normalizedQuestion.split(/\s+/).filter(Boolean).length;

      const hasQuestionSignal =
        normalizedQuestion.includes("?") ||
        /\b(can|could|would|should|do|does|did|what|why|how|when|where|which|who|help|explain|correct|fix|improve|practice|pronunciation|grammar|translate)\b/i.test(
          normalizedQuestion
        );

      const isPlainText =
        /^[a-z\s!'.,-]+$/i.test(normalizedQuestion) &&
        !/\d/.test(normalizedQuestion);

      const isSimpleLocalPrompt =
        isPlainText &&
        normalizedQuestion.length <= 24 &&
        wordCount <= 4 &&
        !hasQuestionSignal;

      return isSimpleLocalPrompt;
    },
    []
  );

  const handleQuickButton = useCallback(
    (key: string) => {
      if (!articles || !articles[key]) return;

      const article = articles[key];

      appendMessage({
        id: createMessageId("article"),
        type: "article",
        content: article.body_en,
        contentVi: article.body_vi,
      });
    },
    [articles, appendMessage, createMessageId]
  );

  const handleAskQuestion = useCallback(async () => {
    const question = inputValue.trim();
    if (!question) return;

    const routed = routeMercyMessage(question);

    const isPronunciationTutoringRequest = routed.intent === "speak_help";
    const isStandalonePronunciationRepair =
      isPronunciationRepairMessage(question);

    const isPronunciationContextFollowUp =
      routed.intent === "fallback_api" &&
      (lastContextIntentRef.current === "speak_help" ||
        isStandalonePronunciationRepair) &&
      isPronunciationHelpFollowUp(question);

    const isToddlerLocalPolicyTurn =
      routed.intent === "fallback_api" &&
      Boolean(routed.reply) &&
      isToddlerPolicyQuestion(question);

    const isImmediateLocalPronunciationTurn =
      isPronunciationTutoringRequest || isPronunciationContextFollowUp;

    const isImmediateProtectedLocalTurn =
      isImmediateLocalPronunciationTurn || isToddlerLocalPolicyTurn;

    if (isAsking && !isImmediateProtectedLocalTurn) return;

    if (!canAskQuestion() && !isImmediateProtectedLocalTurn) {
      appendMessage({
        id: createMessageId("limit"),
        type: "assistant",
        content: RATE_LIMIT_MESSAGE.en,
        contentVi: RATE_LIMIT_MESSAGE.vi,
      });
      return;
    }

    appendMessage({
      id: createMessageId("user"),
      type: "user",
      content: question,
    });

    setInputValue("");

    const isSpeakLocationRequest =
      routed.intent === "fallback_api" && isSpeakLocationIntent(question);

    const uiAction =
      routed.intent === "ui_action" ? (routed.action as TabAction) : undefined;

    const pronunciationReply = isPronunciationTutoringRequest
      ? routed.reply ?? getPronunciationHelpReply(question, "intro")
      : isPronunciationContextFollowUp
        ? getPronunciationHelpReply(question, "followup")
        : null;

    const localUiReply =
      routed.intent === "ui_action"
        ? getUiReplyForAction(uiAction, routed.reply)
        : null;

    const localFallbackReply: LocalReply | null = shouldUseLocalReply({
      question,
      routedIntent: routed.intent,
      action: uiAction,
      routedReply: routed.reply,
    })
      ? routed.reply || getLocalMercyReply(question)
      : null;

    if (pronunciationReply) {
      activeRequestIdRef.current += 1;
      setIsAsking(false);
      appendAssistantMessage(pronunciationReply, "assistant-route");
      lastContextIntentRef.current = "speak_help";
      return;
    }

    if (isToddlerLocalPolicyTurn && routed.reply) {
      activeRequestIdRef.current += 1;
      setIsAsking(false);
      appendAssistantMessage(routed.reply, "assistant-policy");
      lastContextIntentRef.current = routed.intent;
      return;
    }

    if (isSpeakLocationRequest) {
      activeRequestIdRef.current += 1;
      setIsAsking(false);
      appendAssistantMessage(SPEAK_LOCATION_REPLY, "assistant-route");
      openTabForAction("open_speak");
      lastContextIntentRef.current = "ui_action";
      return;
    }

    if (localUiReply) {
      activeRequestIdRef.current += 1;
      setIsAsking(false);
      appendAssistantMessage(localUiReply, "assistant-route");

      if (uiAction) {
        openTabForAction(uiAction);
      }

      lastContextIntentRef.current = routed.intent;
      return;
    }

    if (localFallbackReply) {
      activeRequestIdRef.current += 1;
      setIsAsking(false);
      appendAssistantMessage(
        normalizeAssistantReply(localFallbackReply),
        "assistant-local"
      );
      lastContextIntentRef.current = routed.intent;
      return;
    }

    if (!routed.apiMode) {
      activeRequestIdRef.current += 1;
      setIsAsking(false);
      lastContextIntentRef.current = routed.intent;
      return;
    }

    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;
    setIsAsking(true);

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // ── Proactive progress mention gate ────────────────────────────────
    // Build progressContext only when the user's message + cooldown
    // suggest the moment is right. The build is cheap (sessionStorage
    // cache) so a miss costs almost nothing; a hit triggers the edge
    // function to inject STUDENT_PROGRESS into Mercy's system prompt.
    let progressContext: ProgressContext | null = null;
    let referencedProgress = false;
    if (user?.id) {
      try {
        const fetched = await buildProgressContext(user.id);
        if (fetched) {
          const state = readMentionState(user.id);
          const shouldMention = shouldProactivelyMentionProgress({
            userMessage: question,
            context: fetched,
            state,
          });
          if (shouldMention) {
            progressContext = fetched;
            referencedProgress = true;
            recordProgressMention(user.id);
          }
        }
        // Always increment the message counter — it unlocks the
        // cooldown after N messages even if no mention fired.
        incrementMessageCounter(user.id);
      } catch (err) {
        // Bonus feature; never block a Mercy turn on its plumbing.
        console.warn("[useMercyChat] progress-context gate failed:", err);
      }
    }

    try {
      const invokePromise = askMercyApi({
        input: question,
        mode: routed.apiMode,
        roomId,
        roomTitle,
        tier,
        pathSlug,
        tags,
        englishLevel,
        learningGoal,
        progressContext,
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Guide assistant timeout"));
        }, GUIDE_ASSISTANT_TIMEOUT_MS);
      });

      const result = await Promise.race([invokePromise, timeoutPromise]);

      if (requestId !== activeRequestIdRef.current) return;

      const { data, error } = result as Awaited<typeof invokePromise>;

      if (error || !data?.ok || !data?.answer) {
        throw new Error(data?.error || "Failed to get response");
      }

      incrementQuestionCount();

      const splitAnswer = splitBilingualAnswer(data.answer);
      const cleanedAnswer = sanitizeAssistantAnswer(
        splitAnswer.en || data.answer
      );

      if (looksIncompleteAssistantAnswer(cleanedAnswer)) {
        throw new Error("Guide assistant returned incomplete answer");
      }

      const violationType =
        getForbiddenGuideClaimType(cleanedAnswer) ||
        getForbiddenGuideClaimType(data.answer);

      const policyOverride = violationType
        ? getSafeGuidePolicyOverrideForViolation({ violationType })
        : null;

      if (policyOverride) {
        appendMessage({
          id: createMessageId("assistant-policy"),
          type: "assistant",
          content: policyOverride.en,
          contentVi: policyOverride.vi,
        });
        lastContextIntentRef.current = routed.intent;
        return;
      }

      const fallbackVi =
        getAssistantVietnamese(data, data.answer) ||
        splitAnswer.vi ||
        "Mình đang trả lời bằng tiếng Anh trước nhé.";

      appendMessage({
        id: createMessageId("assistant"),
        type: "assistant",
        content: cleanedAnswer,
        contentVi: fallbackVi,
        referencedProgress,
      });

      lastContextIntentRef.current = routed.intent;
    } catch (err) {
      if (requestId !== activeRequestIdRef.current) return;

      console.error("Mercy assistant failed:", err);

      const isTimeoutOrIncomplete =
        err instanceof Error &&
        (err.message.includes("timeout") ||
          err.message.includes("incomplete") ||
          err.name === "AbortError");

      appendMessage({
        id: createMessageId(
          isTimeoutOrIncomplete ? "fallback" : "error"
        ),
        type: "assistant",
        content: isTimeoutOrIncomplete
          ? GUIDE_TIMEOUT_FALLBACK.en
          : GUIDE_GENERIC_ERROR.en,
        contentVi: isTimeoutOrIncomplete
          ? GUIDE_TIMEOUT_FALLBACK.vi
          : GUIDE_GENERIC_ERROR.vi,
      });

      lastContextIntentRef.current = routed.intent;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);

      if (requestId === activeRequestIdRef.current) {
        setIsAsking(false);
      }
    }
  }, [
    inputValue,
    isAsking,
    canAskQuestion,
    appendMessage,
    appendAssistantMessage,
    normalizeAssistantReply,
    createMessageId,
    roomId,
    roomTitle,
    tier,
    pathSlug,
    tags,
    englishLevel,
    learningGoal,
    incrementQuestionCount,
    getUiReplyForAction,
    openTabForAction,
    shouldUseLocalReply,
  ]);

  return {
    messages,
    inputValue,
    setInputValue,
    isAsking,
    handleQuickButton,
    handleAskQuestion,
  };
}