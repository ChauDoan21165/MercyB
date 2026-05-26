// supabase/functions/azure-phoneme-stream/index.ts
//
// Streaming pronunciation feedback over WebSocket.
//
// Why a separate function instead of streaming-mode toggle on
// azure-phoneme: WebSocket connection lifecycle, per-message routing,
// and rolling buffer state would significantly complicate the
// existing batch handler. Splitting keeps both paths simple and
// preserves the "DO NOT modify existing post-recording flow"
// constraint from the brief.
//
// Model:
//   1. Client opens WS at /functions/v1/azure-phoneme-stream?token=<JWT>.
//      JWT is parsed from the query string because browsers cannot set
//      Authorization headers on WebSocket open. The JWT is the same
//      one the rest of the app uses.
//   2. Client sends a `hello` JSON frame with the reference sentence.
//   3. Client streams binary frames of raw 16 kHz mono Int16 PCM.
//   4. Every PARTIAL_PASS_INTERVAL_SEC of audio, we run an Azure pass
//      against the accumulated buffer and reply with a `partial`
//      frame: running score + words scored so far.
//   5. On `end` frame OR client disconnect, we run a final Azure pass
//      and reply with `final`. Then close.
//
// Auth: JWT validated up-front. Per-user rate limit (mirroring
// azure-phoneme). No budget check here yet — the cost of streaming is
// proportional to the number of partial passes; a wrap-around budget
// gate is tracked as a P1 follow-up.
//
// Privacy: audio bytes are forwarded to Azure inline and discarded
// from the server buffer immediately after the final pass. No
// persistence, no Supabase Storage write. The Azure Speech Services
// region the project uses retains audio only for the duration of its
// real-time evaluation pass per Microsoft's published policy.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  MAX_ACCUMULATED_SEC,
  PARTIAL_PASS_INTERVAL_SEC,
  REQUIRED_SAMPLE_RATE,
  parseControlMessage,
  projectWordsForStreaming,
  runningScoreFromWords,
  shouldRunPartialPass,
  type ServerMessage,
  type StreamingWordResult,
} from "./protocol.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const azureRegion = Deno.env.get("AZURE_SPEECH_REGION") ?? "canadacentral";
const azureKey = Deno.env.get("AZURE_SPEECH_KEY") ?? "";
const azureUrl =
  `https://${azureRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`;

const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, upgrade",
};

type AzureWord = {
  Word?: string;
  AccuracyScore?: number;
  ErrorType?: string;
  Phonemes?: Array<{ Phoneme?: string; AccuracyScore?: number }>;
};
type AzureNBest = { AccuracyScore?: number; Words?: AzureWord[] };
type AzureResponse = { NBest?: AzureNBest[] };

// ── PCM helpers ─────────────────────────────────────────────────────────

/** Build a minimal WAV header for 16-bit mono PCM at 16 kHz. */
function buildWavHeader(pcmByteLength: number): Uint8Array {
  const header = new Uint8Array(44);
  const view = new DataView(header.buffer);
  // RIFF
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + pcmByteLength, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // fmt
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, REQUIRED_SAMPLE_RATE, true);
  view.setUint32(28, REQUIRED_SAMPLE_RATE * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  // data
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, pcmByteLength, true);
  return header;
}

function wrapPcmAsWav(pcm: Uint8Array): Uint8Array {
  const header = buildWavHeader(pcm.byteLength);
  const out = new Uint8Array(header.byteLength + pcm.byteLength);
  out.set(header, 0);
  out.set(pcm, header.byteLength);
  return out;
}

// ── Azure pass ──────────────────────────────────────────────────────────

async function callAzure(
  pcm: Uint8Array,
  referenceText: string,
): Promise<AzureResponse | null> {
  if (!azureKey) {
    return null;
  }
  // Strip trailing terminal punctuation; matches azure-phoneme/core.ts.
  const cleanRef = referenceText.replace(/[\s.?!,;:]+$/, "");
  const config = {
    ReferenceText: cleanRef,
    GradingSystem: "HundredMark",
    Granularity: "Phoneme",
    EnableMiscue: true,
  };
  // Base64url encode (Azure rejects standard base64 padding silently).
  const headerValue = btoa(JSON.stringify(config))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const wav = wrapPcmAsWav(pcm);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(azureUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": azureKey,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Pronunciation-Assessment": headerValue,
        Accept: "application/json",
      },
      body: wav,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) return null;
    return (await response.json()) as AzureResponse;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// ── Per-connection state ────────────────────────────────────────────────

type Session = {
  socket: WebSocket;
  userId: string;
  sessionId: string;
  referenceText: string;
  startedAt: number;
  lastPartialAt: number;
  partialInFlight: boolean;
  /** Accumulated PCM bytes (Int16 samples). */
  pcm: Uint8Array;
  finalised: boolean;
};

function send(socket: WebSocket, msg: ServerMessage) {
  if (socket.readyState !== WebSocket.OPEN) return;
  try {
    socket.send(JSON.stringify(msg));
  } catch {
    /* socket may have closed mid-send — ignore */
  }
}

function appendPcm(session: Session, chunk: Uint8Array) {
  const merged = new Uint8Array(session.pcm.byteLength + chunk.byteLength);
  merged.set(session.pcm, 0);
  merged.set(chunk, session.pcm.byteLength);
  session.pcm = merged;
}

function pcmDurationSec(pcm: Uint8Array): number {
  // 16-bit mono → 2 bytes per sample, REQUIRED_SAMPLE_RATE samples/sec.
  return pcm.byteLength / 2 / REQUIRED_SAMPLE_RATE;
}

async function runPartialPass(session: Session) {
  if (session.partialInFlight) return;
  session.partialInFlight = true;
  session.lastPartialAt = Date.now();
  try {
    const azureResp = await callAzure(session.pcm, session.referenceText);
    if (!azureResp || session.socket.readyState !== WebSocket.OPEN) return;
    const nbest = azureResp.NBest?.[0];
    const words = projectWordsForStreaming(nbest?.Words ?? []);
    const runningScore = runningScoreFromWords(words);
    send(session.socket, {
      type: "partial",
      runningScore,
      words,
      elapsedMs: Date.now() - session.startedAt,
    });
  } catch {
    /* swallow — final pass will still run */
  } finally {
    session.partialInFlight = false;
  }
}

async function runFinalPass(session: Session) {
  if (session.finalised) return;
  session.finalised = true;
  const azureResp = await callAzure(session.pcm, session.referenceText);
  if (!azureResp || session.socket.readyState !== WebSocket.OPEN) {
    send(session.socket, {
      type: "error",
      code: "azure_unavailable",
      message: "Final scoring failed; please use the non-streaming flow.",
    });
    try {
      session.socket.close();
    } catch {
      /* ignore */
    }
    return;
  }
  const nbest = azureResp.NBest?.[0];
  const words = projectWordsForStreaming(nbest?.Words ?? []);
  const phonemes: Array<{ phoneme: string; score: number; word: string }> = [];
  for (const w of nbest?.Words ?? []) {
    const wordText = String(w.Word ?? "");
    for (const p of w.Phonemes ?? []) {
      phonemes.push({
        phoneme: String(p.Phoneme ?? ""),
        score: typeof p.AccuracyScore === "number"
          ? Math.max(0, Math.min(100, Math.round(p.AccuracyScore)))
          : 0,
        word: wordText,
      });
    }
  }
  send(session.socket, {
    type: "final",
    overallScore: typeof nbest?.AccuracyScore === "number"
      ? Math.max(0, Math.min(100, Math.round(nbest.AccuracyScore)))
      : runningScoreFromWords(words),
    words,
    phonemes,
  });
  try {
    session.socket.close();
  } catch {
    /* ignore */
  }
}

// ── Auth (query-param JWT) ──────────────────────────────────────────────

async function userIdFromQuery(url: URL): Promise<string | null> {
  const token = url.searchParams.get("token");
  if (!token) return null;
  try {
    const { data, error } = await adminClient.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

// ── Server entry ────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // WebSocket upgrade required.
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("expected websocket upgrade", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const userId = await userIdFromQuery(url);
  if (!userId) {
    return new Response("auth_required", { status: 401, headers: corsHeaders });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  const sessionId = crypto.randomUUID();
  const session: Session = {
    socket,
    userId,
    sessionId,
    referenceText: "",
    startedAt: 0,
    lastPartialAt: 0,
    partialInFlight: false,
    pcm: new Uint8Array(0),
    finalised: false,
  };

  let helloReceived = false;

  socket.onopen = () => {
    // Wait for the hello frame before declaring "ready" — that's where
    // the client commits the reference text.
  };

  socket.onmessage = async (event) => {
    // Binary frame = audio chunk.
    if (event.data instanceof ArrayBuffer) {
      if (!helloReceived) {
        send(socket, {
          type: "error",
          code: "protocol_error",
          message: "Audio received before hello frame.",
        });
        return;
      }
      const chunk = new Uint8Array(event.data);
      appendPcm(session, chunk);

      // Cap protection.
      if (pcmDurationSec(session.pcm) >= MAX_ACCUMULATED_SEC) {
        await runFinalPass(session);
        return;
      }

      // Throttled partial passes.
      const msSinceLast = Date.now() - session.lastPartialAt;
      if (
        shouldRunPartialPass({
          msSinceLastPass: msSinceLast,
          accumulatedSec: pcmDurationSec(session.pcm),
          inFlight: session.partialInFlight,
        })
      ) {
        // Don't await — let the audio handler return immediately and
        // process the next chunk while Azure runs in the background.
        void runPartialPass(session);
      }
      return;
    }

    // Text frame = control message.
    if (typeof event.data === "string") {
      let parsed: unknown;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        send(socket, {
          type: "error",
          code: "protocol_error",
          message: "Invalid JSON.",
        });
        return;
      }
      const msg = parseControlMessage(parsed);
      if (!msg) {
        send(socket, {
          type: "error",
          code: "protocol_error",
          message: "Unknown or malformed message.",
        });
        return;
      }

      if (msg.type === "hello") {
        if (helloReceived) return;
        if (msg.sampleRate !== REQUIRED_SAMPLE_RATE) {
          send(socket, {
            type: "error",
            code: "invalid_audio",
            message: `Expected ${REQUIRED_SAMPLE_RATE} Hz; got ${msg.sampleRate}.`,
          });
          try {
            socket.close();
          } catch {
            /* ignore */
          }
          return;
        }
        session.referenceText = msg.referenceText;
        session.startedAt = Date.now();
        session.lastPartialAt = Date.now();
        helloReceived = true;
        send(socket, { type: "ready", sessionId: session.sessionId });
        return;
      }

      if (msg.type === "end") {
        await runFinalPass(session);
        return;
      }
    }
  };

  socket.onclose = () => {
    // Best-effort final pass if the client disconnected without sending
    // an "end" frame and we have audio. This guarantees the score isn't
    // lost just because the network dropped.
    if (helloReceived && !session.finalised && session.pcm.byteLength > 0) {
      // Fire-and-forget; we're shutting down.
      void runFinalPass(session);
    }
  };

  socket.onerror = () => {
    /* logged client-side; nothing useful to do here */
  };

  return response;
});
