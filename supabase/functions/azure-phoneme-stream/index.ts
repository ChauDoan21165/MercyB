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
// Auth + cost controls: a single pre-connection gate runs BEFORE the
// WebSocket upgrade (evaluateStreamGate in ./costControls.ts) — JWT
// identity, per-user session rate limit (mirroring azure-phoneme),
// trial/premium gate, and the shared global daily $ cap. If it denies,
// no socket is opened, so the session runs ZERO Azure passes. During
// the session every Azure pass is guarded (shouldRunStreamAzurePass:
// empty/short-audio + per-session pass cap) and logged to
// speech_analysis_logs with a `stream:` marker so streaming spend is
// distinguishable from batch and counts against the same daily cap.
// This closes the gap the C1 audit (invoice G163789098) flagged.
//
// Privacy: audio bytes are forwarded to Azure inline and discarded
// from the server buffer immediately after the final pass. No
// persistence, no Supabase Storage write. The Azure Speech Services
// region the project uses retains audio only for the duration of its
// real-time evaluation pass per Microsoft's published policy.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { rateLimit } from "../_shared/rateLimit.ts";
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
import {
  evaluateStreamGate,
  shouldRunStreamAzurePass,
  streamPassCostUsd,
  STREAM_GLOBAL_DAILY_CAP_USD_DEFAULT,
  type StreamGateDeps,
  type StreamGateReason,
  type StreamProfileRow,
} from "./costControls.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const azureRegion = Deno.env.get("AZURE_SPEECH_REGION") ?? "canadacentral";
const azureKey = Deno.env.get("AZURE_SPEECH_KEY") ?? "";
// Shared with the batch path: one env var, one daily budget over batch +
// stream Azure spend.
const globalDailyCapUsd = Number(
  Deno.env.get("AZURE_SPEECH_DAILY_CAP_USD") || String(STREAM_GLOBAL_DAILY_CAP_USD_DEFAULT),
);
const azureUrl =
  `https://${azureRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`;

const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

// ── Telemetry + gate deps (speech_analysis_logs, shared with batch) ──────

type StreamAuditStatus = "ok" | "no_speech" | "rate_limited" | "budget_exceeded" | "whisper_error";

/**
 * Best-effort write to speech_analysis_logs. `error_msg` always carries
 * a `stream:` prefix so streaming rows are distinguishable from batch
 * rows in the same table; rows with status `ok` and a real
 * `openai_cost_usd` are summed by sumGlobalCostToday (batch + stream)
 * into the shared daily cap. Never throws.
 */
async function auditStreamEvent(params: {
  userId: string;
  status: StreamAuditStatus;
  audioSeconds?: number;
  openaiCostUsd?: number;
  marker: string;
}): Promise<void> {
  try {
    const { error } = await adminClient.from("speech_analysis_logs").insert({
      user_id: params.userId,
      audio_seconds: params.audioSeconds ?? null,
      openai_cost_usd: params.openaiCostUsd ?? null,
      status: params.status,
      error_msg: `stream:${params.marker}`,
    });
    if (error) console.error("[azure-phoneme-stream] audit insert error", error);
  } catch (err) {
    console.error("[azure-phoneme-stream] audit threw", err);
  }
}

async function fetchStreamUserProfile(userId: string): Promise<StreamProfileRow | null> {
  try {
    const { data, error } = await adminClient
      .from("profiles")
      .select(
        "trial_expires_at, trial_ends_at, trial_end, premium_status, premium_expires_at, tier",
      )
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as Record<string, unknown>;
    const iso = (v: unknown): string | null =>
      typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
    return {
      trial_expires_at: iso(row.trial_expires_at),
      trial_ends_at: iso(row.trial_ends_at),
      trial_end: iso(row.trial_end),
      premium_status:
        typeof row.premium_status === "string" ? row.premium_status : null,
      premium_expires_at: iso(row.premium_expires_at),
      tier:
        typeof row.tier === "string" || typeof row.tier === "number"
          ? (row.tier as string | number)
          : null,
    };
  } catch (err) {
    console.error("[azure-phoneme-stream] fetchUserProfile threw", err);
    return null;
  }
}

async function sumGlobalCostToday(): Promise<number> {
  try {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    const { data, error } = await adminClient
      .from("speech_analysis_logs")
      .select("openai_cost_usd")
      .gte("created_at", d.toISOString())
      .eq("status", "ok");
    if (error || !Array.isArray(data)) return 0;
    return data.reduce(
      (acc, r) => acc + Number((r as { openai_cost_usd?: number }).openai_cost_usd ?? 0),
      0,
    );
  } catch (err) {
    console.error("[azure-phoneme-stream] sumGlobalCostToday threw", err);
    return 0;
  }
}

const streamGateDeps: StreamGateDeps = {
  rateLimit: (key, max, windowMs) => rateLimit(key, max, windowMs),
  fetchUserProfile: fetchStreamUserProfile,
  sumGlobalCostToday,
  globalDailyCapUsd,
};

/** Map a gate-denial reason to the HTTP status returned instead of the
 *  101 upgrade. Any non-101 makes the client's WebSocket open fail and
 *  fall back to the controlled batch path. */
function gateHttpStatus(reason: StreamGateReason): number {
  switch (reason) {
    case "rate_limited":
      return 429;
    case "trial_expired":
      return 402;
    case "global_daily_cap_reached":
      return 503;
    default:
      return 403;
  }
}

function gateAuditStatus(reason: StreamGateReason): StreamAuditStatus {
  return reason === "rate_limited" ? "rate_limited" : "budget_exceeded";
}

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
  /** Azure passes spent this session (partials + final). Bounded by
   *  STREAM_MAX_PASSES_PER_SESSION via shouldRunStreamAzurePass. */
  passesUsed: number;
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
  const accumulatedSec = pcmDurationSec(session.pcm);
  // Cost-control guard: empty/short audio, in-flight, or per-session pass
  // cap → spend no Azure pass. Partial skips are silent (the running
  // preview just doesn't update); the final pass remains the source of
  // truth. Never fabricate a number here.
  const decision = shouldRunStreamAzurePass({
    accumulatedSec,
    passesUsed: session.passesUsed,
    inFlight: session.partialInFlight,
    isFinal: false,
  });
  if (!decision.run) return;

  session.partialInFlight = true;
  session.lastPartialAt = Date.now();
  session.passesUsed += 1;
  try {
    const azureResp = await callAzure(session.pcm, session.referenceText);
    if (!azureResp || session.socket.readyState !== WebSocket.OPEN) return;
    const nbest = azureResp.NBest?.[0];
    const words = projectWordsForStreaming(nbest?.Words ?? []);
    if (words.length === 0) return; // no real speech yet — don't send a fake 0
    const runningScore = runningScoreFromWords(words);
    // Log the real spend so streaming counts against the shared daily cap.
    void auditStreamEvent({
      userId: session.userId,
      status: "ok",
      audioSeconds: accumulatedSec,
      openaiCostUsd: streamPassCostUsd(accumulatedSec),
      marker: "partial",
    });
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

  const accumulatedSec = pcmDurationSec(session.pcm);
  // Cost-control guard. Empty/too-short audio or an exhausted per-session
  // pass cap → no Azure pass and NO fabricated score. The learner is told
  // honestly and routed to the non-streaming flow.
  const decision = shouldRunStreamAzurePass({
    accumulatedSec,
    passesUsed: session.passesUsed,
    inFlight: false,
    isFinal: true,
  });
  if (!decision.run) {
    void auditStreamEvent({
      userId: session.userId,
      status: decision.reason === "session_pass_cap" ? "rate_limited" : "no_speech",
      audioSeconds: accumulatedSec,
      marker: `final_skipped:${decision.reason}`,
    });
    send(session.socket, {
      type: "error",
      code: decision.reason === "session_pass_cap" ? "rate_limited" : "invalid_audio",
      message:
        decision.reason === "session_pass_cap"
          ? "Scoring limit reached for this attempt; please use the non-streaming flow."
          : "No speech captured; please record again or use the non-streaming flow.",
    });
    try {
      session.socket.close();
    } catch {
      /* ignore */
    }
    return;
  }
  session.passesUsed += 1;

  const azureResp = await callAzure(session.pcm, session.referenceText);
  if (!azureResp || session.socket.readyState !== WebSocket.OPEN) {
    void auditStreamEvent({
      userId: session.userId,
      status: "whisper_error",
      audioSeconds: accumulatedSec,
      marker: "final_azure_unavailable",
    });
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
  // Poor / unintelligible audio → Azure returns no scored words. Send an
  // honest "no match", never a fabricated score.
  if (words.length === 0) {
    void auditStreamEvent({
      userId: session.userId,
      status: "no_speech",
      audioSeconds: accumulatedSec,
      openaiCostUsd: streamPassCostUsd(accumulatedSec),
      marker: "final_no_match",
    });
    send(session.socket, {
      type: "error",
      code: "invalid_audio",
      message: "No speech detected; please record again.",
    });
    try {
      session.socket.close();
    } catch {
      /* ignore */
    }
    return;
  }
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
  // Real score from a real attempt — log the spend so it counts against
  // the shared daily cap.
  void auditStreamEvent({
    userId: session.userId,
    status: "ok",
    audioSeconds: accumulatedSec,
    openaiCostUsd: streamPassCostUsd(accumulatedSec),
    marker: "final",
  });
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

  // Hard cost gate — runs BEFORE the upgrade. Rate limit → trial/premium
  // gate → global daily $ cap. On denial we never open the socket, so
  // the session spends ZERO Azure passes; the non-101 response makes the
  // client fall back to the controlled batch path.
  const gate = await evaluateStreamGate(streamGateDeps, userId);
  if (!gate.allowed) {
    void auditStreamEvent({
      userId,
      status: gateAuditStatus(gate.reason),
      marker: `gate_blocked:${gate.reason}`,
    });
    return new Response(gate.reason, {
      status: gateHttpStatus(gate.reason),
      headers: corsHeaders,
    });
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
    passesUsed: 0,
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
