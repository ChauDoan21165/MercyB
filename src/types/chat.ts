// FILE: src/types/chat.ts

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string; // local UI id
  msgId: string; // stable id for feedback
  responseId?: string; // only assistant messages
  role: ChatRole;
  content: string;
  createdAt: number;
};