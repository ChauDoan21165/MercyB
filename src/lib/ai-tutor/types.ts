/**
 * AI Tutor — Type Definitions (Phase A — reconciled)
 *
 * TYPE-ONLY module. Zero runtime behavior. Zero imports with side effects.
 * All types describe the shape of data that will flow through the tutor
 * system once AI_TUTOR_ENABLED is flipped to true.
 *
 * Reconciliation sources:
 *   - A4: Conversation Architecture (5 modes, correction format, fallback tiers)
 *   - A5: Phase 1 Plan (feature flag, file map, mock mode)
 *   - A6: Validation Audit (failure modes, gates)
 *   - A7: Safety & Privacy Rules (data allowlist/denylist, redaction, moderation)
 *   - A8: Cost & Reliability Plan (token budgets, rate limits, provider strategy)
 *
 * Design invariants:
 *   1. AI_TUTOR_ENABLED defaults to false. No env read, no network, no storage.
 *   2. This module exports ONLY types, const flags, and pure validation functions.
 *      Tree-shaking removes all imports in production when the flag is off.
 *   3. No V4 mutation. All V4 type references are read-only consumption via
 *      `import type` — no runtime coupling to V4 modules.
 *   4. This module must not import from V5. V5 is a separate concern.
 *   5. The feature flag pattern mirrors src/lib/placement/v5/v5FeatureFlag.ts.
 *
 * Rollback notes:
 *   - To disable the entire tutor: flip AI_TUTOR_ENABLED back to false.
 *     All tutor code paths are gated behind this single constant.
 *   - To remove the tutor: delete src/lib/ai-tutor/ and the one-line
 *     flag check in MercyGuidePanel.tsx. No other V4 files are modified.
 *   - No database migration was created for Phase A. TutorSession is an
 *     in-memory construct; persistence will reuse mercy_conversations
 *     (V4, frozen) in a future phase.
 */

// ─── Feature Flag ──────────────────────────────────────────────────────

/** Master kill-switch for all AI Tutor behavior. Disabled by default. */
export const AI_TUTOR_ENABLED: boolean = false;

// ─── Re-exported V4 Types (read-only consumption) ─────────────────────

/**
 * Types consumed read-only from frozen V4 modules.
 * Re-exported here so tutor consumers have a single import surface,
 * and so a future V4 type change that breaks the tutor contract is a
 * compile error at the re-export boundary rather than a silent drift.
 *
 * The `import type` guarantees zero runtime code is pulled in.
 */
import type { LearningSupportMode } from '@/components/mercy-guide/types';
import type { ProgressContext } from '@/lib/mercy/progressContext';
import type { UserFact } from '@/lib/mercy/userFacts';
import type { GrammarApiResponse, GrammarWritingTeacherState } from '@/components/mercy-guide/tabs/grammar-writing/types';

export type {
  LearningSupportMode,
  ProgressContext,
  UserFact,
  GrammarApiResponse,
  GrammarWritingTeacherState,
};

// ─── Tutor-Specific Domain Types ──────────────────────────────────────

/**
 * The three teaching modes the tutor operates in.
 * Mirrors LearningSupportMode from V4, but scoped to the tutor surface.
 */
export type TutorMode = 'gentle' | 'guided' | 'immersion';

/**
 * How the learner entered the tutor session.
 */
export type TutorEntryPoint =
  | 'ask'           // Free-text question: "Em muốn hỏi gì?"
  | 'fix_grammar'   // Grammar correction: "Sửa câu này giúp em"
  | 'speak'         // Pronunciation practice: "Luyện nói"
  | 'resume'        // Continue previous session/lesson
  | 'direct';       // Opened directly (e.g., from Home screen CTA)

/**
 * The tier context for the current session.
 * Determines mode availability, turn limits, and feature depth.
 */
export type TutorTier = 'free' | 'paid';

/**
 * Static context loaded once when the session starts.
 * All fields are nullable — the tutor degrades gracefully when data is missing.
 */
export type TutorContext = {
  /** Learner's display name (profile.first_name or fallback). */
  learnerName: string | null;
  /** Learner's CEFR level from placement test, if completed. */
  cefrLevel: string | null;
  /** The user's tier level (0 = free, 1+ = paid). */
  tier: TutorTier;
  /** Current streak days. */
  streak: number;
  /** Last focus area from teacher memory. */
  lastFocus: string | null;
  /** The room/lesson the learner was in, if resuming. */
  resumeRoomId: string | null;
  /** The conversation ID to resume, if any. */
  resumeConversationId: string | null;
  /** Active user facts (memory layer). Null when memory loading failed. */
  activeFacts: UserFact[] | null;
  /** Progress snapshot. Null when not enough data (< 3 attempts) or fetch failed. */
  progress: ProgressContext | null;
};

// ─── Conversation Modes (A4 — Conversation Architecture §6) ──────────

/**
 * The five conversation modes the tutor operates in.
 * Each mode has a distinct trigger, behavior contract, and output format.
 * Source: A4 AI Tutor Conversation Architecture §6.
 */
export type TutorConversationMode =
  | 'general_chat'            // Default: open-ended Q&A, light correction
  | 'sentence_correction'     // Explicit correction request, structured format
  | 'writing_feedback'        // Paragraph/essay feedback, pattern-focused
  | 'pronunciation_coaching'  // Phoneme breakdown, mouth position, minimal pairs
  | 'lesson_guidance';        // Within a specific room/lesson, scoped responses

/**
 * Maps a TutorEntryPoint to the initial conversation mode it triggers.
 * Pure mapping — no side effects.
 */
export function entryPointToMode(entryPoint: TutorEntryPoint): TutorConversationMode {
  switch (entryPoint) {
    case 'ask':           return 'general_chat';
    case 'fix_grammar':   return 'sentence_correction';
    case 'speak':         return 'pronunciation_coaching';
    case 'resume':        return 'lesson_guidance';
    case 'direct':        return 'general_chat';
  }
}

// ─── Message Protocol ─────────────────────────────────────────────────

/**
 * A single message in the tutor conversation.
 * Discriminated union by `role`.
 */
export type TutorMessage =
  | TutorLearnerMessage
  | TutorMercyMessage
  | TutorSystemMessage;

/** The learner sent a message. */
export type TutorLearnerMessage = {
  role: 'learner';
  /** Unix ms timestamp. */
  ts: number;
  /** Raw text the learner typed or the entry-point trigger text. */
  content: string;
  /** Which entry point produced this message, if triggered from a button. */
  entryPoint: TutorEntryPoint | null;
  /** The active conversation mode when this message was sent. */
  mode: TutorConversationMode;
};

/** Mercy (the AI tutor) responded. */
export type TutorMercyMessage = {
  role: 'mercy';
  /** Unix ms timestamp. */
  ts: number;
  /** The structured response from the tutor. */
  response: TutorResponse;
  /** The edge function that produced this response (for debugging). */
  source: 'guide-assistant' | 'ai-chat';
  /** Request ID from the edge function for traceability. */
  requestId: string | null;
  /** The conversation mode that produced this response. */
  mode: TutorConversationMode;
};

/** System-generated message (greeting, error, budget, etc.). */
export type TutorSystemMessage = {
  role: 'system';
  /** Unix ms timestamp. */
  ts: number;
  /** The system event payload. */
  event: TutorSystemEvent;
};

// ─── Tutor Response Shape ─────────────────────────────────────────────

/**
 * Structured response from Mercy.
 * The UI renders this payload — it is the contract between the edge
 * function output and the tutor chat surface.
 *
 * The shape is mode-aware: sentence_correction mode populates
 * correctedSentence and transferErrorNote; pronunciation_coaching
 * mode populates practiceSentence; writing_feedback mode populates
 * grammarPoints and detailedExplanation.
 */
export type TutorResponse = {
  /** Mercy's Vietnamese commentary. Always present. */
  vi: string;
  /** English reference. Omitted when mode is vi_only. */
  en?: string;
  /** The corrected version of the learner's sentence. Present after grammar fix. */
  correctedSentence?: string;
  /** The enhanced/natural version of the learner's sentence. */
  enhancedSentence?: string;
  /** Grammar points addressed in this response. Max 6. */
  grammarPoints?: string[];
  /** Vietnamese-L1 transfer-error explanation, when applicable. */
  transferErrorNote?: string;
  /** Detailed grammar explanation (shown when learner taps "Why?"). */
  detailedExplanation?: string;
  /** Suggested next actions. Max 3. */
  nextSteps: TutorNextStep[];
  /** Phrases the learner can save to their notebook. */
  saveTargets: TutorSaveTarget[];
  /**
   * A practice sentence the learner should try speaking.
   * When present, the UI shows a "Luyện nói câu này" button.
   */
  practiceSentence?: string;
};

/**
 * A contextual next-step suggestion.
 * Rendered as a tappable chip below Mercy's response.
 */
export type TutorNextStep = {
  /** Vietnamese label on the chip. */
  labelVi: string;
  /** The action to perform when tapped. */
  action: TutorNextStepAction;
  /** Data payload for the action. */
  payload: string;
};

export type TutorNextStepAction =
  | 'speak'    // Open MercySpeakTab with payload as initialPracticeLine
  | 'logic'    // Open EnglishLogicTab with payload as sentence
  | 'write'    // Open GrammarWritingTab with payload as prefill
  | 'room'     // Navigate to /room/{payload}
  | 'drill';   // Start a pronunciation drill for phoneme {payload}

/**
 * A phrase the learner can save to their notebook.
 */
export type TutorSaveTarget = {
  /** The English text to save. */
  phrase: string;
  /** Category for notebook organization. */
  type: 'vocabulary' | 'grammar' | 'sentence';
};

// ─── System Events ────────────────────────────────────────────────────

/**
 * System-generated events that are not learner or Mercy messages.
 */
export type TutorSystemEvent =
  | TutorGreetingEvent
  | TutorErrorEvent
  | TutorBudgetExceededEvent
  | TutorSessionEndedEvent
  | TutorSafetyEvent
  | TutorFallbackEvent;

export type TutorGreetingEvent = {
  kind: 'greeting';
  /** Learner's name (or fallback). */
  name: string;
  /** 1-line context in Vietnamese. */
  contextVi: string;
  /** Available entry points for this session. */
  entryPoints: TutorEntryPoint[];
};

export type TutorErrorEvent = {
  kind: 'error';
  /** Vietnamese error message. */
  messageVi: string;
  /** Whether the learner can retry. */
  retryable: boolean;
  /** Machine-readable error category for logging. */
  errorKind: TutorErrorKind;
};

export type TutorErrorKind =
  | 'provider_5xx'
  | 'provider_timeout'
  | 'provider_rate_limited'
  | 'network_failure'
  | 'budget_exceeded'
  | 'trial_expired'
  | 'safety_blocked'
  | 'invalid_input'
  | 'empty_response'
  | 'unknown';

export type TutorBudgetExceededEvent = {
  kind: 'budget_exceeded';
  /** Vietnamese explanation + link to pricing. */
  messageVi: string;
  /** When the budget resets (ISO timestamp). */
  resetsAt: string | null;
  /** Which budget was exceeded. */
  budgetType: 'daily_turns' | 'daily_tokens' | 'daily_cost' | 'monthly_cost';
};

export type TutorSessionEndedEvent = {
  kind: 'session_ended';
  /** Vietnamese summary. */
  messageVi: string;
  /** Total turns in this session. */
  totalTurns: number;
  /** Items saved to notebook in this session. */
  itemsSaved: number;
};

/**
 * Safety-related system event.
 * Source: A7 §3 — Input Moderation, Output Moderation.
 */
export type TutorSafetyEvent = {
  kind: 'safety';
  /** What was detected. */
  safetyKind: TutorSafetyKind;
  /** Vietnamese message shown to the learner. */
  messageVi: string;
  /** Whether the session can continue after this event. */
  sessionContinues: boolean;
};

export type TutorSafetyKind =
  | 'profanity'
  | 'hate_speech'
  | 'self_harm'
  | 'pii_detected'
  | 'prompt_injection'
  | 'off_topic'
  | 'hallucinated_pii'
  | 'model_impersonation';

/**
 * Fallback event when the tutor cannot produce an AI response.
 * Source: A4 §5 — Fallback Tiers.
 */
export type TutorFallbackEvent = {
  kind: 'fallback';
  /** Which fallback tier was triggered. */
  tier: TutorFallbackTier;
  /** Vietnamese fallback message. */
  messageVi: string;
};

export type TutorFallbackTier = 1 | 2 | 3 | 4 | 5 | 6;

// ─── Session State ────────────────────────────────────────────────────

/**
 * The full state of a tutor session.
 * This is the shape consumed by the UI and the dispatch hook.
 */
export type TutorSession = {
  /** Unique session ID (client-generated UUID). */
  sessionId: string;
  /** The learner's user ID (null for anonymous preview). */
  userId: string | null;
  /** Current teaching mode. */
  mode: TutorMode;
  /** Available modes for this tier. */
  availableModes: TutorMode[];
  /** Active conversation mode. */
  conversationMode: TutorConversationMode;
  /** Static context loaded at session start. */
  context: TutorContext;
  /** Ordered list of all messages in this session. */
  messages: TutorMessage[];
  /** The current conversation ID for persistence (V4 mercy_conversations). */
  conversationId: string | null;
  /** How the learner entered this session. */
  entryPoint: TutorEntryPoint;
  /** Whether the session is active (accepting input). */
  isActive: boolean;
  /** Whether an LLM call is currently in flight. */
  isLoading: boolean;
  /** Remaining AI turns for today (null = unlimited for paid tier). */
  turnsRemaining: number | null;
  /** Count of items saved to notebook in this session. */
  savedItemCount: number;
  /** Count of safety events triggered in this session. */
  safetyEventCount: number;
  /** Unix ms when the session was created. */
  createdAt: number;
  /** Unix ms of the last activity (message sent or received). */
  lastActivityAt: number;
};

// ─── Tutor State Machine ──────────────────────────────────────────────

/**
 * The finite states of a tutor session.
 */
export type TutorState =
  | 'idle'           // Session created, no messages yet
  | 'greeting'       // Showing greeting card
  | 'ready'          // Awaiting learner input
  | 'thinking'       // LLM call in flight
  | 'responding'     // Streaming response from Mercy
  | 'suggesting'     // Response complete, showing next steps
  | 'error'          // Error state (retryable or not)
  | 'budget_exceeded' // Daily AI budget exhausted
  | 'safety_blocked' // Input or output blocked by safety filter
  | 'ended';         // Session concluded

// ─── Tutor Events ─────────────────────────────────────────────────────

/**
 * Events that drive the tutor state machine.
 * Each event carries the data needed for the state transition.
 */
export type TutorEvent =
  | TutorEvent_SessionStart
  | TutorEvent_ContextLoaded
  | TutorEvent_GreetingDismissed
  | TutorEvent_EntryPointSelected
  | TutorEvent_LearnerMessageSent
  | TutorEvent_ThinkingStarted
  | TutorEvent_ResponseReceived
  | TutorEvent_NextStepSelected
  | TutorEvent_ModeChanged
  | TutorEvent_ConversationModeChanged
  | TutorEvent_ErrorOccurred
  | TutorEvent_RetryRequested
  | TutorEvent_BudgetExceeded
  | TutorEvent_SafetyTriggered
  | TutorEvent_FallbackTriggered
  | TutorEvent_SessionEnded;

export type TutorEvent_SessionStart = {
  type: 'SESSION_START';
  sessionId: string;
  userId: string | null;
  tier: TutorTier;
  entryPoint: TutorEntryPoint;
};

export type TutorEvent_ContextLoaded = {
  type: 'CONTEXT_LOADED';
  context: TutorContext;
};

export type TutorEvent_GreetingDismissed = {
  type: 'GREETING_DISMISSED';
};

export type TutorEvent_EntryPointSelected = {
  type: 'ENTRY_POINT_SELECTED';
  entryPoint: TutorEntryPoint;
  /** Pre-filled text if the entry point carries content. */
  prefillText?: string;
};

export type TutorEvent_LearnerMessageSent = {
  type: 'LEARNER_MESSAGE_SENT';
  content: string;
  entryPoint: TutorEntryPoint | null;
  mode: TutorConversationMode;
};

export type TutorEvent_ThinkingStarted = {
  type: 'THINKING_STARTED';
};

export type TutorEvent_ResponseReceived = {
  type: 'RESPONSE_RECEIVED';
  message: TutorMercyMessage;
  turnsRemaining: number | null;
};

export type TutorEvent_NextStepSelected = {
  type: 'NEXT_STEP_SELECTED';
  action: TutorNextStepAction;
  payload: string;
};

export type TutorEvent_ModeChanged = {
  type: 'MODE_CHANGED';
  mode: TutorMode;
};

export type TutorEvent_ConversationModeChanged = {
  type: 'CONVERSATION_MODE_CHANGED';
  conversationMode: TutorConversationMode;
};

export type TutorEvent_ErrorOccurred = {
  type: 'ERROR_OCCURRED';
  messageVi: string;
  retryable: boolean;
  errorKind: TutorErrorKind;
};

export type TutorEvent_RetryRequested = {
  type: 'RETRY_REQUESTED';
};

export type TutorEvent_BudgetExceeded = {
  type: 'BUDGET_EXCEEDED';
  messageVi: string;
  resetsAt: string | null;
  budgetType: TutorBudgetExceededEvent['budgetType'];
};

export type TutorEvent_SafetyTriggered = {
  type: 'SAFETY_TRIGGERED';
  safetyKind: TutorSafetyKind;
  messageVi: string;
  sessionContinues: boolean;
};

export type TutorEvent_FallbackTriggered = {
  type: 'FALLBACK_TRIGGERED';
  tier: TutorFallbackTier;
  messageVi: string;
};

export type TutorEvent_SessionEnded = {
  type: 'SESSION_ENDED';
  totalTurns: number;
  itemsSaved: number;
};

// ─── Tutor Goal (What the Tutor is Trying to Accomplish) ──────────────

/**
 * The active teaching goal for the current turn.
 * Determined by the tutor's dispatch logic based on entry point,
 * message content, conversation mode, and session history.
 */
export type TutorGoal =
  | TutorGoal_AnswerQuestion
  | TutorGoal_FixGrammar
  | TutorGoal_PracticePronunciation
  | TutorGoal_ResumeLesson
  | TutorGoal_ContinueConversation
  | TutorGoal_ProvideWritingFeedback;

export type TutorGoal_AnswerQuestion = {
  intent: 'answer_question';
  /** The learner's question, normalized. */
  question: string;
};

export type TutorGoal_FixGrammar = {
  intent: 'fix_grammar';
  /** The sentence to correct. */
  sentence: string;
  /** Optional writing mode context. */
  writingMode?: string;
};

export type TutorGoal_PracticePronunciation = {
  intent: 'practice_pronunciation';
  /** The word or sentence to practice. */
  target: string;
};

export type TutorGoal_ResumeLesson = {
  intent: 'resume_lesson';
  /** The room ID to resume. */
  roomId: string;
  /** The conversation ID to continue. */
  conversationId: string;
};

export type TutorGoal_ContinueConversation = {
  intent: 'continue_conversation';
  /** The last Mercy message, for context. */
  lastResponse: TutorMercyMessage | null;
};

export type TutorGoal_ProvideWritingFeedback = {
  intent: 'provide_writing_feedback';
  /** The paragraph or longer text to review. */
  text: string;
  /** Word count of the submitted text. */
  wordCount: number;
};

// ─── Privacy: Data Allowlist & Denylist (A7 §1-2) ────────────────────

/**
 * Fields that MAY be sent to the AI model in the prompt context.
 * Source: A7 §1 — What Learner Data CAN Be Sent to the AI Model.
 *
 * This is an allowlist: fields not listed here MUST be excluded
 * from the prompt assembly. The adapter layer enforces this.
 */
export type TutorPromptAllowlistField =
  | 'learnerKey'             // Opaque hash, not PII
  | 'cefrLevel'              // Overall + per-skill CEFR
  | 'l1InterferenceFlags'    // Pattern IDs only, not full L1 profile
  | 'currentPracticeText'    // The sentence being practiced
  | 'correctionTarget'       // correctedText, enhancedText
  | 'pronunciationScore'     // Score + weak phonemes
  | 'recentLessonIds'        // Lesson IDs only, not lesson content
  | 'troubleWords'           // List of words
  | 'grammarQuestion'        // Learner's grammar query
  | 'selectedTopic'          // What the learner wants to learn
  | 'curriculumFocus'        // Skill + day from sequencer
  | 'conversationHistory'    // Last N messages (current session only)
  | 'conversationMode'       // Active mode
  | 'learnerDisplayName';    // Display name, not real name

/**
 * Fields that MUST NEVER be sent to the AI model.
 * Source: A7 §2 — What MUST NEVER Be Sent to the AI Model.
 *
 * The prompt assembly function must strip these before any provider call.
 */
export type TutorPromptDenylistField =
  | 'email'
  | 'fullName'
  | 'phoneNumber'
  | 'profileId'              // Raw UUID — use learnerKey instead
  | 'ipAddress'
  | 'deviceId'
  | 'sessionToken'
  | 'serviceRoleKey'
  | 'apiKey'
  | 'paymentData'
  | 'subscriptionTier'
  | 'adminLevel'
  | 'otherLearnerData'
  | 'fullConversationHistory' // Beyond current session
  | 'rawAudioRecording';

// ─── Privacy: Logging Redaction Contract (A7 §6) ─────────────────────

/**
 * A redaction rule applied to all tutor log output.
 * Source: A7 §6 — Logging Redaction Rules.
 *
 * Every logging path (telemetry events, decision records, error reports)
 * must apply these redactions before persistence.
 */
export type TutorLogRedactionRule = {
  /** Regex pattern that matches sensitive content. */
  pattern: string;
  /** What to replace matched content with. */
  replacement: string;
  /** Human-readable label for audit. */
  label: string;
};

/**
 * Canonical redaction rules for AI Tutor logging.
 * Mirror the existing V4 SECRET_KEY_PATTERN / SECRET_VALUE_PATTERN
 * from providerRegistry.ts, extended per A7 §6.
 */
export const TUTOR_LOG_REDACTION_RULES: readonly TutorLogRedactionRule[] = [
  { pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', replacement: '[EMAIL]',       label: 'email' },
  { pattern: '(?:\\+84|0)[0-9]{9,10}',                                 replacement: '[PHONE]',       label: 'phone_vn' },
  { pattern: '\\b[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}\\b',              replacement: '[PHONE]',       label: 'phone_intl' },
  { pattern: 'eyJ[a-zA-Z0-9_-]{8,}',                                   replacement: '[JWT]',         label: 'jwt' },
  { pattern: 'sk-[a-zA-Z0-9_-]{8,}',                                   replacement: '[API_KEY]',     label: 'api_key' },
  { pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',                  replacement: '[IP]',          label: 'ip' },
] as const;

// ─── Cost & Reliability: Budget Types (A8 §2-3) ──────────────────────

/**
 * Token budget configuration per request type.
 * Source: A8 §2 — Token Budgets & Rate Limits.
 */
export type TutorTokenBudget = {
  /** Human-readable label for this budget. */
  label: string;
  /** Maximum input tokens allowed. */
  maxInputTokens: number;
  /** Maximum output tokens allowed. */
  maxOutputTokens: number;
  /** Total token ceiling (input + output). */
  maxTotalTokens: number;
};

/**
 * Per-request-type token budgets.
 * Source: A8 §2 table.
 */
export const TUTOR_TOKEN_BUDGETS: Record<string, TutorTokenBudget> = {
  grammar_correction:    { label: 'Grammar Correction',     maxInputTokens: 500,  maxOutputTokens: 300,  maxTotalTokens: 800 },
  speaking_practice:     { label: 'Speaking Practice',      maxInputTokens: 200,  maxOutputTokens: 400,  maxTotalTokens: 600 },
  translation:           { label: 'Translation (VI↔EN)',    maxInputTokens: 1000, maxOutputTokens: 1000, maxTotalTokens: 2000 },
  tutoring_explanation:  { label: 'Tutoring Explanation',   maxInputTokens: 800,  maxOutputTokens: 600,  maxTotalTokens: 1400 },
  pronunciation_feedback:{ label: 'Pronunciation Feedback', maxInputTokens: 300,  maxOutputTokens: 200,  maxTotalTokens: 500 },
  lesson_generation:     { label: 'Lesson Generation',      maxInputTokens: 2000, maxOutputTokens: 1500, maxTotalTokens: 3500 },
  general_chat:          { label: 'General Chat',           maxInputTokens: 1000, maxOutputTokens: 800,  maxTotalTokens: 1800 },
} as const;

/**
 * Per-tier rate limits and token budgets.
 * Source: A8 §2 — Per-user rate limits.
 */
export type TutorTierLimits = {
  requestsPerMinute: number;
  requestsPerDay: number;
  tokensPerDay: number;
  maxCostPerDayUsd: number;
};

export const TUTOR_TIER_LIMITS: Record<TutorTier, TutorTierLimits> = {
  free: {
    requestsPerMinute: 3,
    requestsPerDay: 30,
    tokensPerDay: 15_000,
    maxCostPerDayUsd: 0.05,
  },
  paid: {
    requestsPerMinute: 10,
    requestsPerDay: 200,
    tokensPerDay: 100_000,
    maxCostPerDayUsd: 0.50,
  },
} as const;

// ─── Cost & Reliability: Provider Descriptor (A8 §1) ─────────────────

/**
 * Metadata about an AI provider available for tutor responses.
 * Source: A8 §1 — Provider Options.
 *
 * This is a type-only descriptor. The actual provider selection
 * uses V4's providerRegistry — this type documents what the tutor
 * expects from a provider descriptor.
 */
export type TutorProviderDescriptor = {
  /** Provider identifier (matches V4 providerRegistry key). */
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek';
  /** Model identifier. */
  model: string;
  /** Cost per 1M input tokens (USD). */
  inputPricePer1M: number;
  /** Cost per 1M output tokens (USD). */
  outputPricePer1M: number;
  /** Estimated p50 latency in ms. */
  latencyMsP50: number;
  /** Vietnamese language quality assessment. */
  vietnameseQuality: 'excellent' | 'good' | 'adequate' | 'poor';
};

/**
 * Phase 1 recommended provider configuration.
 * Source: A8 §1 recommendation.
 */
export const TUTOR_PHASE1_PROVIDER: TutorProviderDescriptor = {
  provider: 'deepseek',
  model: 'deepseek-v3',
  inputPricePer1M: 0.14,
  outputPricePer1M: 0.28,
  latencyMsP50: 1500,
  vietnameseQuality: 'excellent',
} as const;

// ─── Cost & Reliability: Timeout Configuration (A8 §3) ────────────────

export type TutorTimeoutConfig = {
  providerApiMs: number;
  streamingFirstByteMs: number;
  totalRequestMs: number;
  maxRetries: number;
  retryBackoffMs: number;
};

export const TUTOR_TIMEOUT_CONFIG: TutorTimeoutConfig = {
  providerApiMs: 15_000,
  streamingFirstByteMs: 5_000,
  totalRequestMs: 25_000,
  maxRetries: 2,
  retryBackoffMs: 1_000,
} as const;

// ─── Phase A Validation ───────────────────────────────────────────────

/**
 * Type guard: returns true if the value is a valid TutorMode.
 */
export function isValidTutorMode(value: unknown): value is TutorMode {
  return value === 'gentle' || value === 'guided' || value === 'immersion';
}

/**
 * Type guard: returns true if the value is a valid TutorEntryPoint.
 */
export function isValidTutorEntryPoint(value: unknown): value is TutorEntryPoint {
  return (
    value === 'ask' ||
    value === 'fix_grammar' ||
    value === 'speak' ||
    value === 'resume' ||
    value === 'direct'
  );
}

/**
 * Type guard: returns true if the value is a valid TutorConversationMode.
 */
export function isValidConversationMode(value: unknown): value is TutorConversationMode {
  return (
    value === 'general_chat' ||
    value === 'sentence_correction' ||
    value === 'writing_feedback' ||
    value === 'pronunciation_coaching' ||
    value === 'lesson_guidance'
  );
}

/**
 * Returns the available modes for a given tier.
 * Pure function — no side effects, no I/O.
 */
export function getAvailableModesForTier(tier: TutorTier): TutorMode[] {
  switch (tier) {
    case 'free':
      return ['gentle'];
    case 'paid':
      return ['gentle', 'guided', 'immersion'];
  }
}

/**
 * Returns the daily AI turn limit for a given tier.
 * Pure function — no side effects, no I/O.
 */
export function getTurnLimitForTier(tier: TutorTier): number | null {
  switch (tier) {
    case 'free':
      return TUTOR_TIER_LIMITS.free.requestsPerDay;
    case 'paid':
      return TUTOR_TIER_LIMITS.paid.requestsPerDay;
  }
}

/**
 * Phase A validation checklist — to be verified by A10, A6, A7, A8, and A1:
 *
 * ☐ No runtime behavior — all exports are types, const flags, or pure functions
 * ☐ No AI calls — zero imports from edge functions or provider modules
 * ☐ No Supabase migrations — no .sql files, no schema references
 * ☐ No V5 imports — V5 is a separate concern
 * ☐ V5_ENABLED unchanged — this module does not touch V5
 * ☐ V4 consumption is import type only — no runtime coupling
 * ☐ AI_TUTOR_ENABLED defaults to false — tree-shakeable by bundler
 * ☐ No circular imports — this module imports types from V4, never vice versa
 * ☐ TypeScript compiles without errors when AI_TUTOR_ENABLED is false
 * ☐ All V4 re-exports use `export type` — no value exports
 * ☐ A4: 5 conversation modes defined with entryPointToMode mapping
 * ☐ A7: Prompt allowlist/denylist types defined
 * ☐ A7: Log redaction rules defined as const array
 * ☐ A8: Token budgets, tier limits, provider descriptor, timeout config defined
 * ☐ A7: Safety events + fallback events integrated into TutorSystemEvent union
 * ☐ A6: TutorErrorKind enum covers all failure modes in validation audit
 */
