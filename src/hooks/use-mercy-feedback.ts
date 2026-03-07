// FILE: src/hooks/use-mercy-feedback.ts

import { useCallback } from "react";
import { useFeedbackIds } from "@/hooks/use-feedback-ids";
import { sendMercyFeedback } from "@/lib/send-feedback";
import type { ChatMessage } from "@/types/chat";

type Vote = "up" | "down";

type MercyFeedbackOptions = {
  appKey?: string;
  anonId: string;
  modelName?: string | null;
  promptVersion?: string | null;
  tier?: string | null;
  lang?: string | null;
  mode?: string | null;
  getPath?: () => string;
};

type VoteArgs = {
  message: ChatMessage;
  vote: Vote;
  feedbackReason?: string | null;
};

export function useMercyFeedback({
  appKey = "mercy_blade",
  anonId,
  modelName = null,
  promptVersion = null,
  tier = "free",
  lang = "en",
  mode = "home",
  getPath = () =>
    typeof window !== "undefined" ? window.location.pathname : "/",
}: MercyFeedbackOptions) {
  const { sessionId, getConversationId, resetConversationId, newResponseId } =
    useFeedbackIds();

  const voteMessage = useCallback(
    async ({ message, vote, feedbackReason = null }: VoteArgs) => {
      if (message.role !== "assistant" || !message.responseId) {
        return {
          ok: false,
          skipped: true,
          reason: "message_not_feedback_eligible",
        };
      }

      return sendMercyFeedback({
        appKey,
        anonId,
        sessionId,
        conversationId: getConversationId(),
        responseId: message.responseId,
        msgId: message.msgId,
        vote,
        feedbackReason,
        modelName,
        promptVersion,
        tier,
        lang,
        mode,
        path: getPath(),
      });
    },
    [
      appKey,
      anonId,
      sessionId,
      getConversationId,
      modelName,
      promptVersion,
      tier,
      lang,
      mode,
      getPath,
    ]
  );

  return {
    sessionId,
    getConversationId,
    resetConversationId,
    newResponseId,
    voteMessage,
  };
}