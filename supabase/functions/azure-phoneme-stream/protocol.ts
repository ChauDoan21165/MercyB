// supabase/functions/azure-phoneme-stream/protocol.ts
//
// Wire protocol for the streaming pronunciation endpoint. Pure types
// + tiny pure helpers — no I/O. Lives in its own file so vitest can
// import it from Node and unit-test the message-shape logic without
// spinning up a WebSocket.
//
// Transport: WebSocket. Client sends binary frames (raw 16 kHz mono
// PCM Int16) for audio plus JSON text frames for control messages.
// Server replies with JSON text frames only.

// ── Client → Server ─────────────────────────────────────────────────────

export type ClientHello = {
  type: "hello";
  /** Reference sentence the learner is reading. */
  referenceText: string;
  /** Sample rate of the upcoming PCM stream. We require 16000. */
  sampleRate: number;
};

export type ClientEnd = { type: "end" };

export type ClientControlMessage = ClientHello | ClientEnd;

// ── Server → Client ─────────────────────────────────────────────────────

export type ServerReady = {
  type: "ready";
  /** Server-assigned id; useful for log correlation. */
  sessionId: string;
};

export type StreamingWordResult = {
  word: string;
  /** Azure 0..100 accuracy. -1 means "not scored yet" (interim placeholder). */
  accuracy: number;
  errorType?: string | null;
};

export type ServerPartial = {
  type: "partial";
  /** Cumulative running score so far (0..100). */
  runningScore: number;
  /** Words that have been recognised + scored at this point. */
  words: StreamingWordResult[];
  /** Wall-clock ms since `hello`. Used to track latency budgets. */
  elapsedMs: number;
};

export type ServerFinal = {
  type: "final";
  overallScore: number;
  words: StreamingWordResult[];
  /** Detailed per-phoneme breakdown — same shape azure-phoneme returns. */
  phonemes: Array<{ phoneme: string; score: number; word: string }>;
};

export type ServerError = {
  type: "error";
  code:
    | "auth_required"
    | "rate_limited"
    | "azure_unavailable"
    | "invalid_audio"
    | "protocol_error";
  message: string;
};

export type ServerMessage = ServerReady | ServerPartial | ServerFinal | ServerError;

// ── Tunables ────────────────────────────────────────────────────────────

/** PCM sample rate the server expects from the client. Non-negotiable. */
export const REQUIRED_SAMPLE_RATE = 16_000;

/**
 * Server runs an Azure scoring pass each time accumulated audio crosses
 * this many seconds since the last pass. 1.2 s is a pragmatic balance:
 * - Short enough that "running score" feels live.
 * - Long enough that Azure's 200–500 ms round-trip doesn't dominate.
 */
export const PARTIAL_PASS_INTERVAL_SEC = 1.2;

/** Hard ceiling on accumulated audio (in seconds). Matches existing
 *  azure-phoneme 30 s practice cap. */
export const MAX_ACCUMULATED_SEC = 30;

/** Latency targets used by the client to detect "connection slow"
 *  conditions and warn the user. */
export const FIRST_PARTIAL_TARGET_MS = 1500;
export const FIRST_PARTIAL_WARN_MS = 2500;

// ── Pure helpers (testable) ─────────────────────────────────────────────

/**
 * Should we kick off an Azure pass yet? Decision is based on time since
 * the previous pass + the configured cap on accumulated audio.
 */
export function shouldRunPartialPass(args: {
  /** ms since the last partial Azure pass started. */
  msSinceLastPass: number;
  /** Total audio accumulated so far (in seconds). */
  accumulatedSec: number;
  /** Whether a partial pass is already in flight (don't double-fire). */
  inFlight: boolean;
}): boolean {
  if (args.inFlight) return false;
  if (args.accumulatedSec >= MAX_ACCUMULATED_SEC) return false;
  return args.msSinceLastPass >= PARTIAL_PASS_INTERVAL_SEC * 1000;
}

/**
 * Validate an inbound client control message. Returns the parsed message
 * or `null` (treat as protocol violation; reply with an error frame).
 */
export function parseControlMessage(raw: unknown): ClientControlMessage | null {
  if (!raw || typeof raw !== "object") return null;
  const msg = raw as Record<string, unknown>;
  if (msg.type === "hello") {
    if (typeof msg.referenceText !== "string" || msg.referenceText.trim() === "") {
      return null;
    }
    const sampleRate = Number(msg.sampleRate);
    if (!Number.isFinite(sampleRate) || sampleRate <= 0) return null;
    return {
      type: "hello",
      referenceText: msg.referenceText.trim(),
      sampleRate,
    };
  }
  if (msg.type === "end") return { type: "end" };
  return null;
}

/**
 * Convert per-word Azure shapes into the streaming word-result shape.
 * Pure; tested.
 */
export function projectWordsForStreaming(
  azureWords: Array<{
    Word?: string;
    AccuracyScore?: number;
    ErrorType?: string;
  }>,
): StreamingWordResult[] {
  return azureWords
    .map((w) => ({
      word: String(w.Word ?? "").trim(),
      accuracy: typeof w.AccuracyScore === "number" ? Math.max(0, Math.min(100, Math.round(w.AccuracyScore))) : -1,
      errorType: w.ErrorType ?? null,
    }))
    .filter((w) => w.word.length > 0);
}

/**
 * Cumulative running score from per-word accuracies. Skips words with
 * accuracy -1 (not yet scored). Returns 0 when no scored words exist.
 */
export function runningScoreFromWords(words: StreamingWordResult[]): number {
  let sum = 0;
  let count = 0;
  for (const w of words) {
    if (w.accuracy < 0) continue;
    sum += w.accuracy;
    count += 1;
  }
  if (count === 0) return 0;
  return Math.round(sum / count);
}
