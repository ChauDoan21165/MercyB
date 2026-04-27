// src/lib/pronunciation/streamingProtocol.ts
//
// Browser mirror of supabase/functions/azure-phoneme-stream/protocol.ts.
// Same wire types, same constants. Two copies because the Supabase Deno
// bundler and Vite use different module resolution paths and we don't
// have a shared toolchain seam yet. Kept short on purpose; if either
// side drifts, the streaming protocol breaks and tests catch it via
// shape mismatches.

export type StreamingWordResult = {
  word: string;
  /** 0..100, or -1 when not yet scored. */
  accuracy: number;
  errorType?: string | null;
};

export type ServerReady = { type: "ready"; sessionId: string };

export type ServerPartial = {
  type: "partial";
  runningScore: number;
  words: StreamingWordResult[];
  elapsedMs: number;
};

export type ServerFinal = {
  type: "final";
  overallScore: number;
  words: StreamingWordResult[];
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

export const REQUIRED_SAMPLE_RATE = 16_000;
export const FIRST_PARTIAL_TARGET_MS = 1500;
export const FIRST_PARTIAL_WARN_MS = 2500;
