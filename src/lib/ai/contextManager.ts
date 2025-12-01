/**
 * AI Context Manager
 * Manages conversation context, memory, and state across sessions
 */

import { supabase } from "@/integrations/supabase/client";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ConversationContext {
  conversationId: string;
  roomId: string;
  tier: string;
  domain?: string;
  messages: Message[];
  userGoals?: string[];
  skillLevel?: "novice" | "intermediate" | "advanced";
  lastActivity: Date;
}

/**
 * Context Storage Keys
 */
const STORAGE_KEYS = {
  CONTEXT: "mercy_blade_context",
  LAST_ROOM: "mercy_blade_last_room",
  USER_GOALS: "mercy_blade_user_goals",
};

/**
 * Maximum messages to keep in context
 */
const MAX_CONTEXT_MESSAGES = 10;

/**
 * Load conversation context from localStorage
 */
export function loadContext(roomId: string): ConversationContext | null {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.CONTEXT}_${roomId}`);
    if (!stored) return null;

    const context = JSON.parse(stored);
    return {
      ...context,
      lastActivity: new Date(context.lastActivity),
      messages: context.messages.map((msg: any) => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined,
      })),
    };
  } catch (error) {
    console.error("[Context] Load error:", error);
    return null;
  }
}

/**
 * Save conversation context to localStorage
 */
export function saveContext(context: ConversationContext): void {
  try {
    const key = `${STORAGE_KEYS.CONTEXT}_${context.roomId}`;
    localStorage.setItem(key, JSON.stringify(context));
    localStorage.setItem(STORAGE_KEYS.LAST_ROOM, context.roomId);
  } catch (error) {
    console.error("[Context] Save error:", error);
  }
}

/**
 * Add message to context with automatic trimming
 */
export function addMessage(
  context: ConversationContext,
  message: Message
): ConversationContext {
  const newMessages = [
    ...context.messages,
    { ...message, timestamp: message.timestamp || new Date() },
  ];

  // Trim to last N messages (keep system prompt)
  const systemMessages = newMessages.filter((m) => m.role === "system");
  const conversationMessages = newMessages
    .filter((m) => m.role !== "system")
    .slice(-MAX_CONTEXT_MESSAGES);

  return {
    ...context,
    messages: [...systemMessages, ...conversationMessages],
    lastActivity: new Date(),
  };
}

/**
 * Clear context for a room
 */
export function clearContext(roomId: string): void {
  try {
    localStorage.removeItem(`${STORAGE_KEYS.CONTEXT}_${roomId}`);
  } catch (error) {
    console.error("[Context] Clear error:", error);
  }
}

/**
 * Initialize new context
 */
export function initializeContext(
  conversationId: string,
  roomId: string,
  tier: string,
  domain?: string,
  systemPrompt?: string
): ConversationContext {
  const context: ConversationContext = {
    conversationId,
    roomId,
    tier,
    domain,
    messages: systemPrompt
      ? [{ role: "system", content: systemPrompt }]
      : [],
    lastActivity: new Date(),
  };

  saveContext(context);
  return context;
}

/**
 * Detect user skill level from conversation history
 */
export function detectSkillLevel(messages: Message[]): "novice" | "intermediate" | "advanced" {
  const userMessages = messages.filter((m) => m.role === "user");
  
  // Simple heuristic: longer, more complex messages = higher skill
  const avgLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;
  
  if (avgLength < 50) return "novice";
  if (avgLength < 150) return "intermediate";
  return "advanced";
}

/**
 * Track user goals across messages
 */
export function extractGoals(messages: Message[]): string[] {
  const goals: string[] = [];
  const goalKeywords = ["want to", "need to", "trying to", "goal is", "hoping to"];

  messages
    .filter((m) => m.role === "user")
    .forEach((message) => {
      goalKeywords.forEach((keyword) => {
        if (message.content.toLowerCase().includes(keyword)) {
          // Extract sentence containing the goal
          const sentences = message.content.split(/[.!?]/);
          const goalSentence = sentences.find((s) =>
            s.toLowerCase().includes(keyword)
          );
          if (goalSentence) {
            goals.push(goalSentence.trim());
          }
        }
      });
    });

  return [...new Set(goals)].slice(0, 3); // Keep unique, max 3
}

/**
 * Create semantic summary of conversation
 */
export function createSummary(messages: Message[]): string {
  const conversationMessages = messages.filter((m) => m.role !== "system");
  
  if (conversationMessages.length === 0) return "";
  
  const topics = new Set<string>();
  conversationMessages.forEach((msg) => {
    // Extract key topics (simple keyword extraction)
    const words = msg.content
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 5);
    words.slice(0, 3).forEach((w) => topics.add(w));
  });

  return `Recent topics: ${Array.from(topics).slice(0, 5).join(", ")}`;
}

/**
 * Check if context is stale (> 24 hours)
 */
export function isContextStale(context: ConversationContext): boolean {
  const now = new Date();
  const hoursSinceActivity = (now.getTime() - context.lastActivity.getTime()) / (1000 * 60 * 60);
  return hoursSinceActivity > 24;
}
