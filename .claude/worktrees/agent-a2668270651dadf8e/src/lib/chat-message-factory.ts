// FILE: src/lib/chat-message-factory.ts

import type { ChatMessage } from "@/types/chat";

function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function createUserMessage(content: string): ChatMessage {
  return {
    id: makeId("ui"),
    msgId: makeId("msg"),
    role: "user",
    content,
    createdAt: Date.now(),
  };
}

export function createAssistantMessage(
  content: string,
  responseId: string
): ChatMessage {
  return {
    id: makeId("ui"),
    msgId: makeId("msg"),
    responseId,
    role: "assistant",
    content,
    createdAt: Date.now(),
  };
}