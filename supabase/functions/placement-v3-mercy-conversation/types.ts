export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ConversationPhase = "opening" | "probe" | "targeted" | "comfort" | "wrap" | "complete";
export type Speaker = "mercy" | "user";
export type LanguageMarker = "en" | "vi" | "code-switch" | "unknown";
export type Subskill = "grammar" | "vocab" | "fluency" | "comprehension";
export type AdaptiveDecision = "ADVANCE" | "HOLD" | "BACKOFF" | "TARGET" | "COMFORT" | "WRAP";
export type ConversationAction = "start" | "turn" | "grade";

export interface TranscriptTurn {
  speaker: Speaker;
  text: string;
  timestamp_seconds?: number;
  language_marker?: LanguageMarker;
}

export interface L1InterferenceFlag {
  patternId: string;
  label: string;
  evidence: string;
}

export interface SubskillSignal {
  level: CefrLevel;
  score: number;
  confidence: number;
  evidence: string[];
}

export interface TurnSignal {
  estimated_cefr_this_turn: CefrLevel;
  numericLevel: number;
  confidence: number;
  observed_subskills: Record<Subskill, SubskillSignal>;
  l1_interference_flags: L1InterferenceFlag[];
  notable_strengths: string[];
  notable_gaps: string[];
  code_switch_detected: boolean;
  off_topic: boolean;
  insufficient_signal: boolean;
  safety_flag?: "abusive" | "self_harm" | "none";
}

export interface SignalSummary {
  turnCount: number;
  runningLevel: CefrLevel;
  runningNumeric: number;
  confidence: number;
  strengths: string[];
  gaps: string[];
  l1Flags: L1InterferenceFlag[];
  subskillCoverage: Record<Subskill, number>;
  subskillLevels: Record<Subskill, CefrLevel>;
  recentSignals: TurnSignal[];
  wrongLanguageTurns: number;
  abusiveTurns: number;
}

export interface AdaptiveContext {
  phase: ConversationPhase;
  targetTurnPairs: number;
  turnPairs: number;
  signals: SignalSummary;
  lastSignal?: TurnSignal;
}

export interface AdaptiveDecisionResult {
  decision: AdaptiveDecision;
  nextPhase: ConversationPhase;
  targetCefr: CefrLevel;
  targetSubskill?: Subskill;
  reason: string;
}

export interface TurnGenerationInput {
  history: TranscriptTurn[];
  phase: ConversationPhase;
  signals?: SignalSummary;
  targetTurnPairs?: number;
  learnerName?: string;
}

export interface MercyTurn {
  text: string;
  phase: ConversationPhase;
  targetCefr: CefrLevel;
  targetSubskill?: Subskill;
  internal_note: string;
  shouldEndSession: boolean;
}

export interface CEFRAssessment {
  cefr: CefrLevel;
  numericLevel: number;
  confidence: number;
  perSkill: Record<Subskill, { cefr: CefrLevel; score: number; confidence: number }>;
  strengths: string[];
  gaps: string[];
  l1Interference: L1InterferenceFlag[];
  trajectory: {
    pattern: "steady" | "improving" | "declining" | "mixed" | "insufficient";
    note: string;
  };
  interaction: {
    comprehension: "strong" | "adequate" | "fragile" | "insufficient";
    miscommunicationTurns: number;
    codeSwitchTurns: number;
  };
  robustness: {
    persistentErrors: string[];
    selfCorrections: number;
    rangeNote: string;
  };
  recommendedFocus: string[];
  holisticNotAverage: boolean;
}

export interface ConversationState {
  sessionId: string;
  phase: ConversationPhase;
  targetTurnPairs: number;
  history: TranscriptTurn[];
  signals: TurnSignal[];
  startedAt: string;
  updatedAt: string;
  endedAt?: string;
}

export interface AiJsonCallInput {
  systemPrompt: string;
  userMessage: string;
  messages?: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  maxTokens: number;
  temperature: number;
}

export interface AiJsonCallResult {
  ok: boolean;
  json: Record<string, unknown>;
  raw: string;
}

export interface Deps {
  getUserFromAuthHeader: (req: Request) => Promise<{ id: string } | null>;
  callAi: (input: AiJsonCallInput) => Promise<AiJsonCallResult>;
  now?: () => Date;
  makeSessionId?: () => string;
}

export interface StartResponse {
  ok: true;
  state: ConversationState;
  mercyTurn: MercyTurn;
}

export interface TurnResponse {
  ok: true;
  state: ConversationState;
  userSignal: TurnSignal;
  mercyTurn: MercyTurn;
}

export interface GradeResponse {
  ok: true;
  assessment: CEFRAssessment;
}

export const CEFR_ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
