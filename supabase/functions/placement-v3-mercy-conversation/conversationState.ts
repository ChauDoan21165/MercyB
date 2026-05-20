import type {
  ConversationPhase,
  ConversationState,
  TranscriptTurn,
  TurnSignal,
} from "./types";

const DEFAULT_TARGET_TURN_PAIRS = 8;

export function createConversationState(input: {
  sessionId: string;
  now: Date;
  targetTurnPairs?: number;
}): ConversationState {
  return {
    sessionId: input.sessionId,
    phase: "opening",
    targetTurnPairs: clampTarget(input.targetTurnPairs),
    history: [],
    signals: [],
    startedAt: input.now.toISOString(),
    updatedAt: input.now.toISOString(),
  };
}

export function hydrateConversationState(raw: unknown): ConversationState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<ConversationState>;
  if (typeof value.sessionId !== "string") return null;
  if (!isPhase(value.phase)) return null;
  if (!Array.isArray(value.history) || !Array.isArray(value.signals)) return null;
  return {
    sessionId: value.sessionId,
    phase: value.phase,
    targetTurnPairs: clampTarget(value.targetTurnPairs),
    history: value.history.filter(isTranscriptTurn),
    signals: value.signals as TurnSignal[],
    startedAt: typeof value.startedAt === "string" ? value.startedAt : new Date(0).toISOString(),
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date(0).toISOString(),
    endedAt: typeof value.endedAt === "string" ? value.endedAt : undefined,
  };
}

export function appendMercyTurn(
  state: ConversationState,
  text: string,
  phase: ConversationPhase,
  now: Date,
): ConversationState {
  return {
    ...state,
    phase,
    history: [
      ...state.history,
      {
        speaker: "mercy",
        text,
        timestamp_seconds: secondsSince(state.startedAt, now),
        language_marker: detectLanguageMarker(text),
      },
    ],
    updatedAt: now.toISOString(),
    endedAt: phase === "complete" || phase === "wrap" ? now.toISOString() : state.endedAt,
  };
}

export function appendUserTurn(
  state: ConversationState,
  text: string,
  signal: TurnSignal,
  now: Date,
): ConversationState {
  return {
    ...state,
    history: [
      ...state.history,
      {
        speaker: "user",
        text,
        timestamp_seconds: secondsSince(state.startedAt, now),
        language_marker: detectLanguageMarker(text),
      },
    ],
    signals: [...state.signals, signal],
    updatedAt: now.toISOString(),
  };
}

export function countTurnPairs(history: TranscriptTurn[]): number {
  return history.filter((t) => t.speaker === "user").length;
}

export function detectLanguageMarker(text: string): "en" | "vi" | "code-switch" | "unknown" {
  const normalized = text.toLowerCase();
  const hasVietnameseDiacritics = /[ăâêôơưđáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(text);
  const viWords = /\b(em|chị|anh|cô|thầy|không|rồi|ạ|dạ|vâng|tiếng|việt|hơi|khó)\b/.test(normalized);
  const enWords = /\b(i|you|the|and|because|work|study|school|english|think|want|can|would|have)\b/.test(normalized);
  if ((hasVietnameseDiacritics || viWords) && enWords) return "code-switch";
  if (hasVietnameseDiacritics || viWords) return "vi";
  if (enWords || /[a-z]/i.test(text)) return "en";
  return "unknown";
}

function secondsSince(startedAt: string, now: Date): number {
  const start = Date.parse(startedAt);
  if (!Number.isFinite(start)) return 0;
  return Math.max(0, Math.round((now.getTime() - start) / 1000));
}

function clampTarget(target?: number): number {
  if (typeof target !== "number" || !Number.isFinite(target)) return DEFAULT_TARGET_TURN_PAIRS;
  return Math.max(5, Math.min(12, Math.round(target)));
}

function isPhase(value: unknown): value is ConversationPhase {
  return value === "opening" || value === "probe" || value === "targeted" ||
    value === "comfort" || value === "wrap" || value === "complete";
}

function isTranscriptTurn(value: unknown): value is TranscriptTurn {
  if (!value || typeof value !== "object") return false;
  const v = value as TranscriptTurn;
  return (v.speaker === "mercy" || v.speaker === "user") && typeof v.text === "string";
}
