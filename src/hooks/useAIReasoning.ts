/**
 * useAIReasoning Hook
 * React hook for AI reasoning with context management
 */

import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ConversationContext | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Initialize conversation context
   */
  const initialize = useCallback(() => {
    const { roomId, tier, domain, roomTitle, keywords } = options;

    // Try to load existing context
    let loadedContext = loadContext(roomId);

    if (!loadedContext) {
      // Create new context with system prompt
      const promptConfig: PromptConfig = {
        tier,
        domain,
        roomTitle,
        keywords,
        isKidsMode: options.isKidsMode,
      };

      const systemPrompt = buildSystemPrompt(promptConfig);
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      loadedContext = initializeContext(conversationId, roomId, tier, domain, systemPrompt);
    }

    setContext(loadedContext);
    setMessages(loadedContext.messages);
  }, [options]);

  /**
   * Send message with reasoning
   */
  const sendMessage = useCallback(
    async (userInput: string): Promise<void> => {
      if (!context) {
        console.error("[AI] Context not initialized");
        toast.error("Please initialize conversation first");
        return;
      }

      // Safety check on input
      const inputSafety = checkInputSafety(userInput);
      if (!inputSafety.passed) {
        const safetyResponse = getSafetyResponse(inputSafety);
        const assistantMessage: Message = {
          role: "assistant",
          content: safetyResponse,
        };

        const updatedContext = addMessage(context, assistantMessage);
        setContext(updatedContext);
        setMessages(updatedContext.messages);
        saveContext(updatedContext);
        return;
      }

      // Preprocess user input
      const cleanedInput = preprocessUserInput(userInput);

      // Add user message to context
      const userMessage: Message = { role: "user", content: cleanedInput };
      let updatedContext = addMessage(context, userMessage);

      // Detect skill level and goals
      const skillLevel = detectSkillLevel(updatedContext.messages);
      const userGoals = extractGoals(updatedContext.messages);
      updatedContext = { ...updatedContext, skillLevel, userGoals };

      setContext(updatedContext);
      setMessages(updatedContext.messages);
      saveContext(updatedContext);

      setIsLoading(true);

      try {
        // Prepare messages for AI (exclude system)
        const conversationMessages = updatedContext.messages.filter(
          (m) => m.role !== "system"
        );

        // Build prompt config
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

        // Call AI reasoning endpoint with streaming
        const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-reasoning`;

        abortControllerRef.current = new AbortController();

        const response = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              ...conversationMessages,
            ],
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
          if (response.status === 429) {
            toast.error("Rate limit exceeded. Please wait a moment.");
            return;
          }
          if (response.status === 402) {
            toast.error("AI usage limit reached. Please contact support.");
            return;
          }
          throw new Error("AI request failed");
        }

        // Process streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let textBuffer = "";
        let assistantContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;

                // Update messages with streaming content
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant") {
                    return prev.map((m, i) =>
                      i === prev.length - 1 ? { ...m, content: assistantContent } : m
                    );
                  }
                  return [...prev, { role: "assistant", content: assistantContent }];
                });
              }
            } catch {
              // Partial JSON, keep buffering
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Normalize output
        const normalizedOutput = normalizeAIOutput(assistantContent);

        // Safety check on output
        const outputSafety = checkOutputSafety(normalizedOutput);
        const finalContent = outputSafety.suggestion
          ? normalizedOutput + outputSafety.suggestion
          : normalizedOutput;

        // Add assistant message to context
        const assistantMessage: Message = {
          role: "assistant",
          content: finalContent,
        };

        const finalContext = addMessage(updatedContext, assistantMessage);
        setContext(finalContext);
        setMessages(finalContext.messages);
        saveContext(finalContext);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("[AI] Request aborted");
          return;
        }

        console.error("[AI] Error:", error);
        toast.error("Failed to get AI response. Please try again.");

        // Add error message
        const errorMessage: Message = {
          role: "assistant",
          content:
            "I apologize, but I encountered an error. Please try again in a moment.",
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
    [context, options]
  );

  /**
   * Cancel ongoing request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear conversation
   */
  const clear = useCallback(() => {
    if (context) {
      const newContext = initializeContext(
        `conv_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        context.roomId,
        context.tier,
        context.domain
      );
      setContext(newContext);
      setMessages(newContext.messages);
      saveContext(newContext);
    }
  }, [context]);

  return {
    messages,
    isLoading,
    context,
    initialize,
    sendMessage,
    cancel,
    clear,
  };
}
