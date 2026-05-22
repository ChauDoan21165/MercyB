/**
 * PB1 Session Runtime — pure reducer/state machine for AI Tutor.
 *
 * Phase B — pure functions only. No I/O, no provider calls, no Supabase,
 * no V5, no persistence, no streaming, no Date.now, no Math.random.
 *
 * The reducer produces TutorEffect descriptors that the caller executes.
 * The reducer NEVER executes effects itself.
 *
 * AI_TUTOR_ENABLED=false — this module is tree-shaken in production.
 */

import type {
  TutorSession,
  TutorState,
  TutorEvent,
  TutorMessage,
  TutorLearnerMessage,
  TutorMercyMessage,
  TutorSystemMessage,
  TutorSystemEvent,
  TutorResponse,
  TutorConversationMode,
  TutorEntryPoint,
  TutorMode,
  TutorTier,
  TutorContext,
  TutorGoal,
  TutorErrorKind,
  TutorFallbackTier,
  TutorNextStepAction,
  TutorNextStep,
} from "./types";
import {
  entryPointToMode,
  isValidTutorMode,
  isValidTutorEntryPoint,
  isValidConversationMode,
  getAvailableModesForTier,
  getTurnLimitForTier,
  TUTOR_TIMEOUT_CONFIG,
  TUTOR_TIER_LIMITS,
} from "./types";

// ─── Effect Descriptors (pure — never executed by reducer) ────────────

export type TutorEffect =
  | { kind: "call_edge_function"; payload: TutorEdgeFunctionRequest }
  | { kind: "load_context"; userId: string | null }
  | { kind: "decrement_turns"; newCount: number }
  | { kind: "log_safety_event"; safetyKind: string; sessionId: string }
  | { kind: "log_cost"; requestId: string; tokens: number; costUsd: number }
  | { kind: "persist_session"; session: TutorSession }
  | { kind: "none" };

export type TutorEdgeFunctionRequest = {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  conversationMode: TutorConversationMode;
  goal: TutorGoal;
  cefrLevel: string | null;
  learnerName: string | null;
  requestId: string;
};

// ─── Dispatch Types ───────────────────────────────────────────────────

export type TutorDispatchError =
  | "invalid_event"
  | "invalid_transition"
  | "invariant_violation"
  | "session_ended";

export type DispatchResult =
  | { ok: true; session: TutorSession; effects: TutorEffect[] }
  | { ok: false; error: TutorDispatchError; detail?: string };

// ─── Session Creation ─────────────────────────────────────────────────

export function createTutorSession(config: {
  sessionId: string;
  userId: string | null;
  tier: TutorTier;
  entryPoint: TutorEntryPoint;
  nowMs: number;
}): TutorSession {
  return {
    sessionId: config.sessionId,
    userId: config.userId,
    mode: "gentle",
    availableModes: getAvailableModesForTier(config.tier),
    conversationMode: entryPointToMode(config.entryPoint),
    context: emptyContext(config.tier),
    messages: [],
    conversationId: null,
    entryPoint: config.entryPoint,
    isActive: true,
    isLoading: false,
    turnsRemaining: getTurnLimitForTier(config.tier),
    savedItemCount: 0,
    safetyEventCount: 0,
    createdAt: config.nowMs,
    lastActivityAt: config.nowMs,
    _state: "idle",
  } as TutorSession & { _state: TutorState };
}

function emptyContext(tier: TutorTier): TutorContext {
  return {
    learnerName: null,
    cefrLevel: null,
    tier,
    streak: 0,
    lastFocus: null,
    resumeRoomId: null,
    resumeConversationId: null,
    activeFacts: null,
    progress: null,
  };
}

// ─── Event Type Guards ────────────────────────────────────────────────

export function isTutorEvent(value: unknown): value is TutorEvent {
  if (!value || typeof value !== "object") return false;
  const t = (value as Record<string, unknown>).type;
  return typeof t === "string" && EVENT_TYPES.has(t);
}

const EVENT_TYPES = new Set([
  "SESSION_START", "CONTEXT_LOADED", "GREETING_DISMISSED",
  "ENTRY_POINT_SELECTED", "LEARNER_MESSAGE_SENT", "THINKING_STARTED",
  "RESPONSE_RECEIVED", "NEXT_STEP_SELECTED", "MODE_CHANGED",
  "CONVERSATION_MODE_CHANGED", "ERROR_OCCURRED", "RETRY_REQUESTED",
  "BUDGET_EXCEEDED", "SAFETY_TRIGGERED", "FALLBACK_TRIGGERED",
  "SESSION_ENDED",
]);

export function validateEvent(event: TutorEvent): DispatchResult | null {
  // Returns null if valid, or an error DispatchResult if invalid
  switch (event.type) {
    case "SESSION_START":
      if (!event.sessionId) return invalid("invalid_event", "SESSION_START: sessionId required");
      if (!isValidTutorEntryPoint(event.entryPoint)) return invalid("invalid_event", "SESSION_START: invalid entryPoint");
      break;
    case "LEARNER_MESSAGE_SENT":
      if (!event.content || !event.content.trim()) return invalid("invalid_event", "LEARNER_MESSAGE_SENT: content empty");
      if (event.content.length > 2000) return invalid("invalid_event", "LEARNER_MESSAGE_SENT: content exceeds 2000 chars");
      if (!isValidConversationMode(event.mode)) return invalid("invalid_event", "LEARNER_MESSAGE_SENT: invalid mode");
      break;
    case "RESPONSE_RECEIVED":
      if (event.message.role !== "mercy") return invalid("invalid_event", "RESPONSE_RECEIVED: message must be mercy role");
      if (!event.message.response.vi) return invalid("invalid_event", "RESPONSE_RECEIVED: response.vi required");
      break;
    case "ENTRY_POINT_SELECTED":
      if (!isValidTutorEntryPoint(event.entryPoint)) return invalid("invalid_event", "ENTRY_POINT_SELECTED: invalid entryPoint");
      break;
    case "MODE_CHANGED":
      if (!isValidTutorMode(event.mode)) return invalid("invalid_event", "MODE_CHANGED: invalid mode");
      break;
    case "CONVERSATION_MODE_CHANGED":
      if (!isValidConversationMode(event.conversationMode)) return invalid("invalid_event", "CONVERSATION_MODE_CHANGED: invalid mode");
      break;
    case "ERROR_OCCURRED":
      if (!event.messageVi) return invalid("invalid_event", "ERROR_OCCURRED: messageVi required");
      break;
    case "BUDGET_EXCEEDED":
      if (!event.messageVi) return invalid("invalid_event", "BUDGET_EXCEEDED: messageVi required");
      break;
    case "SAFETY_TRIGGERED":
      if (!event.messageVi) return invalid("invalid_event", "SAFETY_TRIGGERED: messageVi required");
      break;
    case "FALLBACK_TRIGGERED":
      if (!event.messageVi) return invalid("invalid_event", "FALLBACK_TRIGGERED: messageVi required");
      break;
  }
  return null; // valid
}

function invalid(error: TutorDispatchError, detail: string): DispatchResult {
  return { ok: false, error, detail };
}

// ─── State Machine — Transition Table ─────────────────────────────────

type State = TutorState;

const TRANSITIONS: Record<State, Partial<Record<TutorEvent["type"], State>>> = {
  idle: { SESSION_START: "greeting" },
  greeting: {
    CONTEXT_LOADED: "greeting",
    GREETING_DISMISSED: "ready",
    ENTRY_POINT_SELECTED: "ready",
    LEARNER_MESSAGE_SENT: "thinking",
    ERROR_OCCURRED: "error",
    SESSION_ENDED: "ended",
  },
  ready: {
    CONTEXT_LOADED: "ready",
    LEARNER_MESSAGE_SENT: "thinking",
    ENTRY_POINT_SELECTED: "ready",
    MODE_CHANGED: "ready",
    CONVERSATION_MODE_CHANGED: "ready",
    SAFETY_TRIGGERED: "safety_blocked",
    SESSION_ENDED: "ended",
  },
  thinking: {
    RESPONSE_RECEIVED: "suggesting",
    ERROR_OCCURRED: "error",
    BUDGET_EXCEEDED: "budget_exceeded",
    SAFETY_TRIGGERED: "safety_blocked",
    FALLBACK_TRIGGERED: "suggesting",
    SESSION_ENDED: "ended",
  },
  responding: {
    RESPONSE_RECEIVED: "suggesting",
    ERROR_OCCURRED: "error",
    SAFETY_TRIGGERED: "safety_blocked",
    SESSION_ENDED: "ended",
  },
  suggesting: {
    NEXT_STEP_SELECTED: "ready",
    LEARNER_MESSAGE_SENT: "thinking",
    MODE_CHANGED: "suggesting",
    SESSION_ENDED: "ended",
  },
  error: {
    RETRY_REQUESTED: "thinking",
    LEARNER_MESSAGE_SENT: "thinking",
    FALLBACK_TRIGGERED: "suggesting",
    SESSION_ENDED: "ended",
  },
  budget_exceeded: {
    SESSION_ENDED: "ended",
  },
  safety_blocked: {
    LEARNER_MESSAGE_SENT: "thinking",
    SAFETY_TRIGGERED: "safety_blocked",
    SESSION_ENDED: "ended",
  },
  ended: {},
};

function guardTransition(state: State, eventType: TutorEvent["type"]): State | null {
  const allowed = TRANSITIONS[state];
  if (!allowed) return null;
  return allowed[eventType] ?? null;
}

// ─── Pure Reducer ─────────────────────────────────────────────────────

export function tutorSessionReducer(
  session: TutorSession,
  event: TutorEvent,
): { session: TutorSession; effects: TutorEffect[] } {
  const nextState = guardTransition(sessionState(session), event.type);
  if (!nextState) {
    // Invalid transition — return unchanged session with no effects
    return { session, effects: [] };
  }

  const effects: TutorEffect[] = [];
  let s = { ...session, lastActivityAt: nowFromEvent(event, session.lastActivityAt) };

  switch (event.type) {
    case "SESSION_START":
      s = { ...s, isActive: true };
      (s as TutorSession & { _state?: TutorState })._state = "greeting";
      effects.push({ kind: "load_context", userId: s.userId });
      break;

    case "CONTEXT_LOADED":
      s = { ...s, context: event.context };
      (s as TutorSession & { _state?: TutorState })._state = nextState;
      break;

    case "GREETING_DISMISSED":
      (s as TutorSession & { _state?: TutorState })._state = "ready";
      break;

    case "ENTRY_POINT_SELECTED":
      s = { ...s, entryPoint: event.entryPoint, conversationMode: entryPointToMode(event.entryPoint) };
      (s as TutorSession & { _state?: TutorState })._state = nextState;
      break;

    case "LEARNER_MESSAGE_SENT": {
      s = { ...s, isLoading: true, conversationMode: event.mode };
      (s as TutorSession & { _state?: TutorState })._state = "thinking";
      const learnerMsg = buildLearnerMessageInternal(event.content, s, event.entryPoint, event.mode);
      s = { ...s, messages: appendMessage(s.messages, learnerMsg) };
      const goal = deriveGoal(event.content, event.mode, event.entryPoint ?? s.entryPoint, s);
      effects.push({
        kind: "call_edge_function",
        payload: {
          messages: serializeMessagesForProvider(s.messages, 20),
          conversationMode: event.mode,
          goal,
          cefrLevel: s.context.cefrLevel,
          learnerName: s.context.learnerName,
          requestId: generateRequestId(s.sessionId, s.messages.length),
        },
      });
      break;
    }

    case "THINKING_STARTED":
      s = { ...s, isLoading: true };
      (s as TutorSession & { _state?: TutorState })._state = "thinking";
      break;

    case "RESPONSE_RECEIVED": {
      s = { ...s, isLoading: false };
      (s as TutorSession & { _state?: TutorState })._state = "suggesting";
      const mercyMsg = event.message;
      s = { ...s, messages: appendMessage(s.messages, mercyMsg) };
      const newTurns = s.turnsRemaining !== null ? Math.max(0, s.turnsRemaining - 1) : null;
      s = { ...s, turnsRemaining: newTurns };
      if (event.turnsRemaining !== undefined) {
        s = { ...s, turnsRemaining: event.turnsRemaining };
      }
      effects.push({ kind: "log_cost", requestId: mercyMsg.requestId ?? "", tokens: 0, costUsd: 0 });
      if (newTurns !== null) {
        effects.push({ kind: "decrement_turns", newCount: newTurns });
      }
      break;
    }

    case "NEXT_STEP_SELECTED":
      (s as TutorSession & { _state?: TutorState })._state = nextState;
      break;

    case "MODE_CHANGED":
      if (isValidTutorMode(event.mode)) {
        s = { ...s, mode: event.mode };
      }
      (s as TutorSession & { _state?: TutorState })._state = nextState;
      break;

    case "CONVERSATION_MODE_CHANGED":
      if (isValidConversationMode(event.conversationMode)) {
        s = { ...s, conversationMode: event.conversationMode };
      }
      (s as TutorSession & { _state?: TutorState })._state = nextState;
      break;

    case "ERROR_OCCURRED": {
      (s as TutorSession & { _state?: TutorState })._state = "error";
      const sysMsg = buildSystemMessage({
        kind: "error",
        messageVi: event.messageVi,
        retryable: event.retryable,
        errorKind: event.errorKind,
      }, s.lastActivityAt);
      s = { ...s, isLoading: false, messages: appendMessage(s.messages, sysMsg) };
      break;
    }

    case "RETRY_REQUESTED":
      s = { ...s, isLoading: true };
      (s as TutorSession & { _state?: TutorState })._state = nextState;
      break;

    case "BUDGET_EXCEEDED": {
      (s as TutorSession & { _state?: TutorState })._state = "budget_exceeded";
      const sysMsg = buildSystemMessage({
        kind: "budget_exceeded",
        messageVi: event.messageVi,
        resetsAt: event.resetsAt,
        budgetType: event.budgetType,
      }, s.lastActivityAt);
      s = { ...s, isLoading: false, messages: appendMessage(s.messages, sysMsg) };
      break;
    }

    case "SAFETY_TRIGGERED": {
      s = { ...s, safetyEventCount: s.safetyEventCount + 1 };
      (s as TutorSession & { _state?: TutorState })._state = event.sessionContinues ? "safety_blocked" : "ended";
      effects.push({ kind: "log_safety_event", safetyKind: event.safetyKind, sessionId: s.sessionId });
      const sysMsg = buildSystemMessage({
        kind: "safety",
        safetyKind: event.safetyKind,
        messageVi: event.messageVi,
        sessionContinues: event.sessionContinues,
      }, s.lastActivityAt);
      s = { ...s, messages: appendMessage(s.messages, sysMsg) };
      if (s.safetyEventCount >= 3) {
        // Auto-end session after 3 safety events
        effects.push({ kind: "none" }); // placeholder for auto-end
      }
      if (!event.sessionContinues) {
        s = { ...s, isActive: false };
      }
      break;
    }

    case "FALLBACK_TRIGGERED": {
      (s as TutorSession & { _state?: TutorState })._state = "suggesting";
      const sysMsg = buildSystemMessage({
        kind: "fallback",
        tier: event.tier,
        messageVi: event.messageVi,
      }, s.lastActivityAt);
      s = { ...s, isLoading: false, messages: appendMessage(s.messages, sysMsg) };
      break;
    }

    case "SESSION_ENDED": {
      (s as TutorSession & { _state?: TutorState })._state = "ended";
      const endMsg = buildSystemMessage({
        kind: "session_ended",
        messageVi: "Phiên học đã kết thúc.",
        totalTurns: event.totalTurns ?? countLearnerMessages(s.messages),
        itemsSaved: event.itemsSaved ?? s.savedItemCount,
      }, s.lastActivityAt);
      s = { ...s, isActive: false, messages: appendMessage(s.messages, endMsg) };
      effects.push({ kind: "persist_session", session: s });
      break;
    }
  }

  return { session: s, effects };
}

// ─── Dispatch ─────────────────────────────────────────────────────────

export function dispatchTutorEvent(
  session: TutorSession,
  event: TutorEvent,
): DispatchResult {
  // Reject events on ended sessions
  if (sessionState(session) === "ended") {
    return { ok: false, error: "session_ended", detail: "Cannot dispatch on ended session" };
  }

  // Reject LEARNER_MESSAGE_SENT while thinking/responding
  if (event.type === "LEARNER_MESSAGE_SENT") {
    const st = sessionState(session);
    if (st === "thinking" || st === "responding") {
      return { ok: false, error: "invalid_transition", detail: "Learner message blocked while thinking/responding" };
    }
  }

  // Validate event payload
  const validationError = validateEvent(event);
  if (validationError) return validationError;

  // Check transition guard
  const nextState = guardTransition(sessionState(session), event.type);
  if (!nextState) {
    return { ok: false, error: "invalid_transition", detail: `No transition from ${sessionState(session)} via ${event.type}` };
  }

  // Invoke pure reducer
  const { session: next, effects } = tutorSessionReducer(session, event);

  return { ok: true, session: next, effects };
}

// ─── Message Constructors ─────────────────────────────────────────────

export function buildLearnerMessage(
  content: string,
  session: TutorSession,
  entryPoint: TutorEntryPoint | null = null,
  nowMs?: number,
): TutorLearnerMessage {
  return buildLearnerMessageInternal(content, session, entryPoint, session.conversationMode, nowMs);
}

function buildLearnerMessageInternal(
  content: string,
  session: TutorSession,
  entryPoint: TutorEntryPoint | null,
  mode: TutorConversationMode,
  nowMs?: number,
): TutorLearnerMessage {
  return {
    role: "learner",
    ts: nowMs ?? session.lastActivityAt,
    content: content.length > 2000 ? content.slice(0, 2000) : content,
    entryPoint: entryPoint ?? session.entryPoint,
    mode,
  };
}

export function buildMercyMessage(
  response: TutorResponse,
  source: "guide-assistant" | "ai-chat",
  requestId: string | null,
  session: TutorSession,
  nowMs?: number,
): TutorMercyMessage {
  return {
    role: "mercy",
    ts: nowMs ?? session.lastActivityAt,
    response,
    source,
    requestId,
    mode: session.conversationMode,
  };
}

export function buildSystemMessage(
  event: TutorSystemEvent,
  nowMs: number,
): TutorSystemMessage {
  return {
    role: "system",
    ts: nowMs,
    event,
  };
}

// ─── Mode Detection ───────────────────────────────────────────────────

export function detectConversationMode(
  content: string,
  currentMode: TutorConversationMode,
  entryPoint: TutorEntryPoint | null,
): TutorConversationMode {
  // Rule 1: long text (>50 words) → writing_feedback
  if (content.split(/\s+/).length > 50) return "writing_feedback";

  // Rule 2: explicit correction request
  if (/sửa|câu này|correct this|fix this|grammar|check.*sentence/i.test(content)) {
    return "sentence_correction";
  }

  // Rule 3: pronunciation request
  if (/phát âm|pronounce|pronunciation|luyện nói|how.*(say|pronounce)/i.test(content)) {
    return "pronunciation_coaching";
  }

  // Rule 4–6: entry point override
  if (entryPoint === "speak") return "pronunciation_coaching";
  if (entryPoint === "fix_grammar") return "sentence_correction";
  if (entryPoint === "resume") return "lesson_guidance";

  // Rule 7: explicit mode command
  const modeMatch = content.match(/^mercy:mode\s+(\w+)/i);
  if (modeMatch) {
    const requested = modeMatch[1].toLowerCase();
    if (isValidConversationMode(requested)) return requested as TutorConversationMode;
  }

  // Rule 8: default
  return currentMode === "general_chat" ? "general_chat" : currentMode;
}

// ─── Retry Strategy ───────────────────────────────────────────────────

export function computeRetryStrategy(
  errorKind: TutorErrorKind,
  retryCount: number,
): { shouldRetry: boolean; delayMs: number; fallbackTier: TutorFallbackTier | null } {
  const MAX_RETRIES = TUTOR_TIMEOUT_CONFIG.maxRetries;
  const BASE_DELAY = TUTOR_TIMEOUT_CONFIG.retryBackoffMs;

  switch (errorKind) {
    case "provider_5xx":
      return {
        shouldRetry: retryCount < MAX_RETRIES,
        delayMs: BASE_DELAY * Math.pow(2, retryCount),
        fallbackTier: retryCount >= MAX_RETRIES ? 5 : null,
      };
    case "provider_timeout":
      return {
        shouldRetry: retryCount < 1,
        delayMs: BASE_DELAY * 2,
        fallbackTier: retryCount >= 1 ? 5 : null,
      };
    case "provider_rate_limited":
      return {
        shouldRetry: retryCount < 1,
        delayMs: 5000,
        fallbackTier: 5,
      };
    case "network_failure":
      return {
        shouldRetry: retryCount < MAX_RETRIES,
        delayMs: BASE_DELAY * Math.pow(2, retryCount),
        fallbackTier: retryCount >= MAX_RETRIES ? 5 : null,
      };
    case "empty_response":
      return { shouldRetry: false, delayMs: 0, fallbackTier: 6 };
    case "budget_exceeded":
      return { shouldRetry: false, delayMs: 0, fallbackTier: null };
    case "trial_expired":
      return { shouldRetry: false, delayMs: 0, fallbackTier: null };
    case "safety_blocked":
      return { shouldRetry: false, delayMs: 0, fallbackTier: 4 };
    case "invalid_input":
      return { shouldRetry: false, delayMs: 0, fallbackTier: 3 };
    default:
      return {
        shouldRetry: retryCount < 1,
        delayMs: BASE_DELAY,
        fallbackTier: retryCount >= 1 ? 5 : null,
      };
  }
}

// ─── Goal Derivation ──────────────────────────────────────────────────

export function deriveGoal(
  content: string,
  mode: TutorConversationMode,
  entryPoint: TutorEntryPoint,
  session: TutorSession,
): TutorGoal {
  switch (mode) {
    case "sentence_correction":
      return { intent: "fix_grammar", sentence: content };

    case "pronunciation_coaching":
      return { intent: "practice_pronunciation", target: content };

    case "writing_feedback":
      return {
        intent: "provide_writing_feedback",
        text: content,
        wordCount: content.split(/\s+/).length,
      };

    case "lesson_guidance":
      return {
        intent: "resume_lesson",
        roomId: session.context.resumeRoomId ?? "",
        conversationId: session.context.resumeConversationId ?? "",
      };

    case "general_chat":
    default: {
      if (content.includes("?")) {
        return { intent: "answer_question", question: content };
      }
      const lastMercy = session.messages
        .filter((m) => m.role === "mercy")
        .pop() as TutorMercyMessage | undefined;
      return {
        intent: "continue_conversation",
        lastResponse: lastMercy ?? null,
      };
    }
  }
}

// ─── History Compression ──────────────────────────────────────────────

export function compressHistory(
  session: TutorSession,
  maxTokens: number,
): string {
  const recent = session.messages.slice(-20);
  const older = session.messages.slice(0, -20);

  if (older.length === 0) {
    return serializeMessagesForPrompt(recent);
  }

  // Build a summary of older messages
  const topics = extractTopics(older);
  const skills = extractSkills(older);
  const summary = [
    `[Earlier in this session: you discussed ${topics}, practiced ${skills},`,
    ` and covered ${older.length} messages. The learner is now continuing.]`,
  ].join("");

  const serialized = summary + "\n" + serializeMessagesForPrompt(recent);

  // Rough token count estimation: ~4 chars per token
  if (serialized.length > maxTokens * 4) {
    return summary + "\n" + serializeMessagesForPrompt(recent.slice(-10));
  }

  return serialized;
}

function extractTopics(messages: TutorMessage[]): string {
  // Deterministic keyword extraction from message content
  const learnerMsgs = messages.filter((m) => m.role === "learner") as TutorLearnerMessage[];
  const words = learnerMsgs.flatMap((m) => m.content.toLowerCase().split(/\s+/));
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (w.length > 3) freq[w] = (freq[w] ?? 0) + 1;
  }
  const top = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([w]) => w);
  return top.length ? top.join(", ") : "various topics";
}

function extractSkills(messages: TutorMessage[]): string {
  const mercyMsgs = messages.filter((m) => m.role === "mercy") as TutorMercyMessage[];
  const grammar = mercyMsgs.flatMap((m) => m.response.grammarPoints ?? []);
  const unique = [...new Set(grammar)].slice(0, 3);
  return unique.length ? unique.join(", ") : "English skills";
}

function serializeMessagesForPrompt(messages: TutorMessage[]): string {
  return messages
    .map((m) => {
      if (m.role === "learner") return `Learner: ${(m as TutorLearnerMessage).content}`;
      if (m.role === "mercy") return `Mercy: ${(m as TutorMercyMessage).response.vi}`;
      if (m.role === "system") {
        const ev = (m as TutorSystemMessage).event;
        if (ev.kind === "greeting") return `System: greeting`;
        if (ev.kind === "safety") return `System: safety notice`;
        return "";
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

// ─── Internal Helpers ─────────────────────────────────────────────────

function sessionState(session: TutorSession): TutorState {
  // Use explicit state if available (set by reducer)
  const explicit = (session as TutorSession & { _state?: TutorState })._state;
  if (explicit) return explicit;

  if (!session.isActive && session.messages.length > 0) return "ended";
  if (session.isLoading) return session.messages.length > 0 ? "thinking" : "idle";
  if (session.messages.length === 0) return session.isActive ? "greeting" : "idle";

  const lastMsg = session.messages[session.messages.length - 1];
  if (lastMsg.role === "system") {
    const ev = (lastMsg as TutorSystemMessage).event;
    if (ev.kind === "greeting") return "greeting";
    if (ev.kind === "error") return "error";
    if (ev.kind === "budget_exceeded") return "budget_exceeded";
    if (ev.kind === "safety") return session.isActive ? "safety_blocked" : "ended";
    if (ev.kind === "session_ended") return "ended";
    if (ev.kind === "fallback") return "suggesting";
  }
  if (lastMsg.role === "mercy") return "suggesting";
  return "ready";
}

function appendMessage(messages: TutorMessage[], msg: TutorMessage): TutorMessage[] {
  // Enforce 100-message cap — drop oldest non-system pair
  let updated = [...messages, msg];
  while (updated.length > 100) {
    // Find first non-system message to drop
    const firstNonSystem = updated.findIndex((m) => m.role !== "system");
    if (firstNonSystem >= 0) {
      updated = [...updated.slice(0, firstNonSystem), ...updated.slice(firstNonSystem + 1)];
    } else {
      updated = updated.slice(1); // fallback: drop oldest
    }
  }
  return updated;
}

function countLearnerMessages(messages: TutorMessage[]): number {
  return messages.filter((m) => m.role === "learner").length;
}

function serializeMessagesForProvider(
  messages: TutorMessage[],
  maxMessages: number,
): Array<{ role: "user" | "assistant"; content: string }> {
  return messages
    .slice(-maxMessages)
    .filter((m) => m.role === "learner" || m.role === "mercy")
    .map((m) => {
      if (m.role === "learner") {
        return { role: "user" as const, content: (m as TutorLearnerMessage).content };
      }
      return { role: "assistant" as const, content: (m as TutorMercyMessage).response.vi };
    });
}

function nowFromEvent(event: TutorEvent, fallback: number): number {
  // Check for timestamp in event payload
  const e = event as Record<string, unknown>;
  if (typeof e.ts === "number") return e.ts;
  if (typeof e.timestampMs === "number") return e.timestampMs;
  return fallback;
}

function generateRequestId(sessionId: string, msgIndex: number): string {
  // Deterministic request ID — no Date.now(), no Math.random()
  let hash = 0x811c9dc5;
  const input = `${sessionId}|${msgIndex}`;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `req_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

// ─── Public API ───────────────────────────────────────────────────────

export type { TutorSession, TutorEvent, TutorState, TutorMessage, TutorLearnerMessage, TutorGoal };
export type { TutorConversationMode, TutorEntryPoint, TutorMode, TutorTier };
