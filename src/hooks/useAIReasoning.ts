// src/hooks/useAIReasoning.ts
/**
 * useAIReasoning Hook
 * React hook for AI reasoning with context management
 */

import { useState, useCallback, useRef } from "react";
import {
  loadContext,
  saveContext,
  addMessage,
  initializeContext,
  detectSkillLevel,
  extractGoals,
  type Message,
  type ConversationContext,
} from "@/lib/ai/contextManager";
import {
  preprocessUserInput,
  normalizeAIOutput,
  buildSystemPrompt,
  type PromptConfig,
} from "@/lib/ai/promptBuilder";
import {
  checkInputSafety,
  checkOutputSafety,
  getSafetyResponse,
} from "@/lib/ai/safetyLayer";
import { toast } from "sonner";

export interface UseAIReasoningOptions {
  roomId: string;
  tier: string;
  domain?: string;
  roomTitle?: string;
  keywords?: string[];
  isKidsMode?: boolean;
  enableReasoning?: boolean;
}

export function useAIReasoning(options: UseAIReasoningOptions) {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext]     = useState<ConversationContext | null>(null);
  const abortControllerRef        = useRef<AbortController | null>(null);

  const initialize = useCallback(() => {
    const { roomId, tier, domain, roomTitle, keywords } = options;

    let loadedContext = loadContext(roomId);

    if (!loadedContext) {
      const promptConfig: PromptConfig = {
        tier, domain, roomTitle, keywords,
        isKidsMode: options.isKidsMode,
      };

      const systemPrompt    = buildSystemPrompt(promptConfig);
      const conversationId  = `conv_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      loadedContext = initializeContext(conversationId, roomId, tier, domain, systemPrompt);
    }

    setContext(loadedContext);
    setMessages(loadedContext.messages);
  }, [options]);

  const sendMessage = useCallback(
    async (userInput: string): Promise<void> => {
      if (!context) {
        if (import.meta.env.DEV) console.warn("[AI] Context not initialized");
        toast.error("Please initialize conversation first");
        return;
      }

      const inputSafety = checkInputSafety(userInput);
      if (!inputSafety.passed) {
        const safetyResponse = getSafetyResponse(inputSafety);
        const assistantMessage: Message = { role: "assistant", content: safetyResponse };
        const updatedContext = addMessage(context, assistantMessage);
        setContext(updatedContext);
        setMessages(updatedContext.messages);
        saveContext(updatedContext);
        return;
      }

      const cleanedInput = preprocessUserInput(userInput);
      const userMessage: Message = { role: "user", content: cleanedInput };
      let updatedContext = addMessage(context, userMessage);

      const skillLevel = detectSkillLevel(updatedContext.messages);
      const userGoals  = extractGoals(updatedContext.messages);
      updatedContext   = { ...updatedContext, skillLevel, userGoals };

      setContext(updatedContext);
      setMessages(updatedContext.messages);
      saveContext(updatedContext);
      setIsLoading(true);

      try {
        const conversationMessages = updatedContext.messages.filter((m) => m.role !== "system");

        const promptConfig: PromptConfig = {
          tier: options.tier,
          domain: options.domain,
          roomTitle: options.roomTitle,
          keywords: options.keywords,
          isKidsMode: options.isKidsMode,
          skillLevel: updatedContext.skillLevel,
          userGoals: updatedContext.userGoals,
        };

        const systemPrompt = buildSystemPrompt(promptConfig, updatedContext);
        const CHAT_URL     = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-reasoning`;

        abortControllerRef.current = new AbortController();

        const response = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ role: "system", content: systemPrompt }, ...conversationMessages],
            roomId: options.roomId,
            tier: options.tier,
            domain: options.domain,
            keywords: options.keywords,
            isKidsMode: options.isKidsMode,
            enableReasoning: options.enableReasoning,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          if (response.status === 429) { toast.error("Rate limit exceeded. Please wait a moment."); return; }
          if (response.status === 402) { toast.error("AI usage limit reached. Please contact support."); return; }
          throw new Error("AI request failed");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder     = new TextDecoder();
        let textBuffer    = "";
        let assistantContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line  = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed  = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant") {
                    return prev.map((m, i) =>
                      i === prev.length - 1 ? { ...m, content: assistantContent } : m,
                    );
                  }
                  return [...prev, { role: "assistant", content: assistantContent }];
                });
              }
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        const normalizedOutput = normalizeAIOutput(assistantContent);
        const outputSafety     = checkOutputSafety(normalizedOutput);
        const finalContent     = outputSafety.suggestion
          ? normalizedOutput + outputSafety.suggestion
          : normalizedOutput;

        const assistantMessage: Message = { role: "assistant", content: finalContent };
        const finalContext = addMessage(updatedContext, assistantMessage);
        setContext(finalContext);
        setMessages(finalContext.messages);
        saveContext(finalContext);
      } catch (error) {
        const isAbort = error instanceof Error && error.name === "AbortError";

        if (isAbort) {
          if (import.meta.env.DEV) console.log("[AI] Request aborted");
          return;
        }

        if (import.meta.env.DEV) console.warn("[AI] Error:", error);
        toast.error("Failed to get AI response. Please try again.");

        const errorMessage: Message = {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again in a moment.",
        };

        const errorContext = addMessage(updatedContext, errorMessage);
        setContext(errorContext);
        setMessages(errorContext.messages);
        saveContext(errorContext);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [context, options],
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    if (context) {
      const newContext = initializeContext(
        `conv_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        context.roomId,
        context.tier,
        context.domain,
      );
      setContext(newContext);
      setMessages(newContext.messages);
      saveContext(newContext);
    }
  }, [context]);

  return { messages, isLoading, context, initialize, sendMessage, cancel, clear };
}