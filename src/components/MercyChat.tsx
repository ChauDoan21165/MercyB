// FILE: src/components/MercyChat.tsx

import { useState } from "react";
import type { ChatMessage } from "@/types/chat";
import {
  createUserMessage,
  createAssistantMessage,
} from "@/lib/chat-message-factory";
import { useMercyFeedback } from "@/hooks/use-mercy-feedback";

export function MercyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const {
    getConversationId,
    resetConversationId,
    newResponseId,
    voteMessage,
  } = useMercyFeedback({
    anonId: "anon_123",
    modelName: "gpt-4.1-mini",
    promptVersion: "mercy-host-v3",
    tier: "free",
    lang: "en",
    mode: "home",
  });

  async function sendUserMessage(text: string) {
    const userMessage = createUserMessage(text);
    setMessages((prev) => [...prev, userMessage]);

    // Replace this with your real assistant generation
    const assistantText = `Assistant reply to: ${text}`;
    const responseId = newResponseId();
    const assistantMessage = createAssistantMessage(assistantText, responseId);

    setMessages((prev) => [...prev, assistantMessage]);

    console.log("Mercy assistant message created", {
      conversationId: getConversationId(),
      responseId,
      msgId: assistantMessage.msgId,
    });
  }

  async function handleVote(
    message: ChatMessage,
    vote: "up" | "down",
    feedbackReason?: string
  ) {
    const result = await voteMessage({
      message,
      vote,
      feedbackReason: feedbackReason ?? null,
    });

    console.log("Mercy feedback result", result);
  }

  function startNewConversation() {
    resetConversationId();
    setMessages([]);
  }

  return (
    <div>
      <button onClick={startNewConversation}>New Chat</button>
      <button onClick={() => sendUserMessage("Hello Mercy")}>Send Test</button>

      <div>
        {messages.map((message) => (
          <div key={message.id} style={{ marginBottom: 16 }}>
            <div>
              <strong>{message.role}</strong>: {message.content}
            </div>

            {message.role === "assistant" && message.responseId && (
              <div style={{ marginTop: 8 }}>
                <button onClick={() => handleVote(message, "up")}>👍</button>
                <button
                  onClick={() => handleVote(message, "down", "not_helpful")}
                >
                  👎
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}