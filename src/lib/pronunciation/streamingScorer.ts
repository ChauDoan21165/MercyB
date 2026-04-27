// src/lib/pronunciation/streamingScorer.ts
//
// Browser-side WebSocket client for the azure-phoneme-stream edge fn.
//
// API:
//   const stream = await createPronunciationStream({ referenceText });
//   stream.onPartial(p => …);
//   stream.onFinal(f => …);
//   stream.pushAudioChunk(int16Pcm.buffer);   // raw PCM 16k mono
//   stream.end();
//
// Lifecycle:
//   1. createPronunciationStream() opens the WebSocket and waits up to
//      `connectTimeoutMs` for the server's `ready` frame. If that
//      doesn't arrive in time, the call resolves with `{ kind: "fallback",
//      reason }` and the caller must fall back to the existing post-
//      recording flow.
//   2. After ready, the client sends raw PCM chunks via pushAudioChunk.
//      The server returns `partial` frames every ~1.2 s with a running
//      score + words scored so far.
//   3. On end(), the server runs a final pass and replies with `final`.
//      The connection closes.
//
// All Azure scoring is done server-side. This file only owns transport
// and the running latency-budget heuristic that lets the UI flag a
// "Connection slow — switching to non-streaming mode" message when
// the first partial doesn't arrive within FIRST_PARTIAL_WARN_MS.

import {
  FIRST_PARTIAL_TARGET_MS,
  FIRST_PARTIAL_WARN_MS,
  REQUIRED_SAMPLE_RATE,
  type ServerFinal,
  type ServerMessage,
  type ServerPartial,
} from "./streamingProtocol";

// Re-export the wire types so consumers don't import from the protocol
// file directly — keeps the import surface stable.
export type {
  ServerFinal as StreamingFinalResult,
  ServerPartial as StreamingPartialResult,
  StreamingWordResult,
} from "./streamingProtocol";
export {
  FIRST_PARTIAL_TARGET_MS,
  FIRST_PARTIAL_WARN_MS,
  REQUIRED_SAMPLE_RATE,
} from "./streamingProtocol";

export type StreamFallbackReason =
  | "no_token"
  | "no_websocket"
  | "connect_timeout"
  | "connect_error"
  | "server_error"
  | "auth_required";

export type StreamHandle = {
  kind: "stream";
  /** Append raw PCM (Int16 mono 16 kHz). Pass `.buffer` of an Int16Array. */
  pushAudioChunk: (chunk: ArrayBuffer | ArrayBufferView) => void;
  /** Tell the server we're done; final result will arrive via onFinal. */
  end: () => void;
  /** Force-close the connection without waiting for a final result. */
  abort: (reason?: string) => void;
  /** Subscribe to interim partial results (idempotent — last cb wins). */
  onPartial: (cb: (p: ServerPartial) => void) => void;
  /** Subscribe to the final result (called once). */
  onFinal: (cb: (f: ServerFinal) => void) => void;
  /** Subscribe to errors and connection drops. */
  onError: (cb: (msg: string) => void) => void;
  /**
   * Latency snapshot for the UI warning. `firstPartialMs` is null until
   * the first partial frame arrives.
   */
  getLatency: () => { firstPartialMs: number | null; warnSlow: boolean };
};

export type StreamFallback = {
  kind: "fallback";
  reason: StreamFallbackReason;
};

export type CreateStreamArgs = {
  referenceText: string;
  /** Supabase access token (JWT). Required — passed as ?token=. */
  authToken: string;
  /** Override the WebSocket URL (used by tests + dev). */
  wsUrl?: string;
  /** Connection timeout in ms (default 1500). */
  connectTimeoutMs?: number;
  /** Inject a constructor for tests. Defaults to globalThis.WebSocket. */
  webSocketImpl?: typeof WebSocket;
};

const DEFAULT_CONNECT_TIMEOUT_MS = 1500;

/**
 * Open a streaming pronunciation session. Resolves with either a
 * `StreamHandle` (success) or a `StreamFallback` (caller should fall
 * back to the existing batch flow).
 */
export async function createPronunciationStream(
  args: CreateStreamArgs,
): Promise<StreamHandle | StreamFallback> {
  if (!args.authToken) {
    return { kind: "fallback", reason: "no_token" };
  }

  const Ctor = args.webSocketImpl ?? globalThis.WebSocket;
  if (typeof Ctor === "undefined") {
    return { kind: "fallback", reason: "no_websocket" };
  }

  const wsUrl = args.wsUrl ?? defaultWsUrl(args.authToken);
  let socket: WebSocket;
  try {
    socket = new Ctor(wsUrl);
    socket.binaryType = "arraybuffer";
  } catch {
    return { kind: "fallback", reason: "connect_error" };
  }

  // Per-instance callbacks (last subscription wins; matches StreamHandle docs).
  let partialCb: ((p: ServerPartial) => void) | null = null;
  let finalCb: ((f: ServerFinal) => void) | null = null;
  let errorCb: ((m: string) => void) | null = null;
  let firstPartialMs: number | null = null;
  let connectStart = Date.now();
  let ended = false;

  // Wait for `ready`.
  const ready = await waitForReady(socket, args.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS, args.referenceText);
  if (ready.kind === "fallback") {
    return ready;
  }

  // After ready, route subsequent messages.
  socket.onmessage = (event) => {
    if (typeof event.data !== "string") return;
    let msg: ServerMessage | null;
    try {
      msg = JSON.parse(event.data) as ServerMessage;
    } catch {
      return;
    }
    if (msg.type === "partial") {
      if (firstPartialMs === null) {
        firstPartialMs = Date.now() - connectStart;
      }
      partialCb?.(msg);
      return;
    }
    if (msg.type === "final") {
      finalCb?.(msg);
      return;
    }
    if (msg.type === "error") {
      errorCb?.(`${msg.code}: ${msg.message}`);
      return;
    }
  };

  socket.onclose = () => {
    if (!ended) {
      errorCb?.("connection_closed");
    }
  };

  socket.onerror = () => {
    errorCb?.("websocket_error");
  };

  return {
    kind: "stream",
    pushAudioChunk(chunk) {
      if (socket.readyState !== WebSocket.OPEN) return;
      // Normalise to ArrayBuffer.
      const buffer =
        chunk instanceof ArrayBuffer
          ? chunk
          : (chunk.buffer.slice(
              chunk.byteOffset,
              chunk.byteOffset + chunk.byteLength,
            ) as ArrayBuffer);
      try {
        socket.send(buffer);
      } catch {
        /* socket closed mid-push */
      }
    },
    end() {
      if (ended) return;
      ended = true;
      try {
        socket.send(JSON.stringify({ type: "end" }));
      } catch {
        /* ignore */
      }
    },
    abort(reason) {
      if (ended) return;
      ended = true;
      try {
        socket.close(1000, reason ?? "client_abort");
      } catch {
        /* ignore */
      }
    },
    onPartial(cb) {
      partialCb = cb;
    },
    onFinal(cb) {
      finalCb = cb;
    },
    onError(cb) {
      errorCb = cb;
    },
    getLatency() {
      return {
        firstPartialMs,
        warnSlow:
          firstPartialMs === null
            ? Date.now() - connectStart > FIRST_PARTIAL_WARN_MS
            : firstPartialMs > FIRST_PARTIAL_WARN_MS,
      };
    },
  };
}

/**
 * Resolve once the server replies with `ready` OR the connect timeout
 * elapses. Sends the `hello` frame as soon as the socket opens.
 */
function waitForReady(
  socket: WebSocket,
  timeoutMs: number,
  referenceText: string,
): Promise<{ kind: "ok" } | StreamFallback> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: { kind: "ok" } | StreamFallback) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const timer = setTimeout(() => {
      // Settle first; close second. Otherwise socket.close() triggers
      // onclose synchronously and the close handler races us with a
      // misleading `connect_error`.
      finish({ kind: "fallback", reason: "connect_timeout" });
      try {
        socket.close();
      } catch {
        /* ignore */
      }
    }, timeoutMs);

    socket.onopen = () => {
      try {
        socket.send(
          JSON.stringify({
            type: "hello",
            referenceText,
            sampleRate: REQUIRED_SAMPLE_RATE,
          }),
        );
      } catch {
        clearTimeout(timer);
        finish({ kind: "fallback", reason: "connect_error" });
      }
    };

    socket.onmessage = (event) => {
      if (typeof event.data !== "string") return;
      let parsed: ServerMessage | null;
      try {
        parsed = JSON.parse(event.data) as ServerMessage;
      } catch {
        return;
      }
      if (parsed.type === "ready") {
        clearTimeout(timer);
        finish({ kind: "ok" });
        return;
      }
      if (parsed.type === "error") {
        clearTimeout(timer);
        finish({
          kind: "fallback",
          reason:
            parsed.code === "auth_required"
              ? "auth_required"
              : "server_error",
        });
      }
    };

    socket.onerror = () => {
      clearTimeout(timer);
      finish({ kind: "fallback", reason: "connect_error" });
    };

    socket.onclose = () => {
      clearTimeout(timer);
      finish({ kind: "fallback", reason: "connect_error" });
    };
  });
}

/**
 * Convenience: build the canonical edge function URL from the project's
 * Supabase URL env var. Browsers expect `wss://` for secure WS.
 */
function defaultWsUrl(token: string): string {
  // import.meta typing varies across bundlers; fall back to "" if unset.
  let supabaseUrl = "";
  try {
    supabaseUrl = String(
      (import.meta as ImportMeta | undefined)?.env?.VITE_SUPABASE_URL ?? "",
    ).trim();
  } catch {
    supabaseUrl = "";
  }
  const wsBase = supabaseUrl.replace(/^https?:/, "wss:");
  return `${wsBase}/functions/v1/azure-phoneme-stream?token=${encodeURIComponent(
    token,
  )}`;
}

// ── Pure helpers (testable without WebSocket) ───────────────────────────

/**
 * Decide whether to render the "Connection slow" warning given the
 * elapsed time since stream start and whether a first partial has
 * arrived. Pure; tested.
 */
export function isSlowConnection(args: {
  firstPartialMs: number | null;
  elapsedSinceStartMs: number;
}): boolean {
  if (args.firstPartialMs !== null) {
    return args.firstPartialMs > FIRST_PARTIAL_WARN_MS;
  }
  return args.elapsedSinceStartMs > FIRST_PARTIAL_WARN_MS;
}

/**
 * Decide whether to ABORT the stream and fall back to non-streaming.
 * Pure; tested. Triggered when no first partial within fallback budget.
 */
export function shouldAbortToFallback(args: {
  firstPartialMs: number | null;
  elapsedSinceStartMs: number;
  fallbackBudgetMs: number;
}): boolean {
  if (args.firstPartialMs !== null) return false;
  return args.elapsedSinceStartMs > args.fallbackBudgetMs;
}

/**
 * Convert a Float32Array of [-1,1] PCM samples (the AudioWorklet output)
 * into Int16 PCM bytes ready for the WebSocket. Pure; tested.
 */
export function float32ToInt16Pcm(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    const s = Math.max(-1, Math.min(1, input[i]));
    out[i] = s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff);
  }
  return out;
}
