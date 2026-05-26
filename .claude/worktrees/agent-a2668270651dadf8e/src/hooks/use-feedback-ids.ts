// FILE: src/hooks/use-feedback-ids.ts

import { useMemo, useRef } from "react";

const SESSION_KEY = "mb_session_id";

function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getOrCreateSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const id = makeId("sess");
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

export function useFeedbackIds(initialConversationId?: string) {
  const sessionId = useMemo(() => getOrCreateSessionId(), []);

  const conversationIdRef = useRef<string>(
    initialConversationId || makeId("conv")
  );

  const getConversationId = () => conversationIdRef.current;

  const resetConversationId = () => {
    conversationIdRef.current = makeId("conv");
    return conversationIdRef.current;
  };

  const newResponseId = () => makeId("resp");

  return {
    sessionId,
    getConversationId,
    resetConversationId,
    newResponseId,
  };
}