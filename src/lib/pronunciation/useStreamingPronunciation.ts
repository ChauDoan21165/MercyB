// src/lib/pronunciation/useStreamingPronunciation.ts
//
// Thin React hook around `createPronunciationStream`. Owns:
//   - the WebSocket lifecycle (open on `start`, close on `stop`)
//   - the AudioWorklet that converts the live mic stream into 16 kHz
//     mono Int16 chunks and forwards them via pushAudioChunk
//   - the partial-result state the UI renders
//   - fallback decision: if the stream can't open or doesn't produce
//     a first partial within FIRST_PARTIAL_WARN_MS × 2, flip into
//     fallback mode and stop trying to push audio
//
// Hook contract:
//   const stream = useStreamingPronunciation({ enabled, referenceText, authToken });
//   await stream.start(mediaStream);   // begin pushing audio
//   stream.stop();                     // finalise + close
//   stream.partial                     // latest partial result (null until first arrives)
//   stream.final                       // final result (null until end completes)
//   stream.fallback                    // truthy when the stream gave up and caller should use post-recording path
//   stream.error                       // last error message, if any
//
// Falsy `enabled` means the hook is a no-op — start() resolves with
// `{ kind: "fallback", reason: "disabled" }` without opening a socket.
// Caller treats that as "use the existing post-recording flow."

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createPronunciationStream,
  float32ToInt16Pcm,
  REQUIRED_SAMPLE_RATE,
  type StreamingFinalResult,
  type StreamingPartialResult,
} from "./streamingScorer";
import { breadcrumbStreamingPronunciation } from "@/lib/monitoring/breadcrumbs";

export type StreamingHookArgs = {
  /** Master switch — usually wired to the `pronunciation_streaming_enabled` flag. */
  enabled: boolean;
  /** Reference sentence the learner is reading. Required at start(). */
  referenceText: string;
  /** Override WebSocket URL — used by tests + dev. */
  wsUrl?: string;
};

export type StreamingStartArgs = {
  mediaStream: MediaStream;
  /**
   * Supabase access token (JWT) — passed as a query param to the
   * streaming endpoint. Caller fetches fresh per recording so an
   * expired token gets caught at session-open time, not mid-stream.
   */
  authToken: string;
};

export type StreamingHookValue = {
  start: (
    args: StreamingStartArgs,
  ) => Promise<{ kind: "stream" } | { kind: "fallback"; reason: string }>;
  stop: () => void;
  partial: StreamingPartialResult | null;
  final: StreamingFinalResult | null;
  fallback: { reason: string } | null;
  error: string | null;
  isActive: boolean;
};

/**
 * Inline AudioWorklet processor source. Converts the input Float32 buffer
 * into a transferable copy and posts it to the main thread. Kept
 * minimal — actual PCM conversion (Float32 → Int16) happens in the
 * main thread to keep this string short and easy to audit.
 */
const WORKLET_SOURCE = `
class StreamingPcmProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const channel = input[0];
    if (!channel || channel.length === 0) return true;
    // Copy because the underlying buffer is reused by the engine.
    const copy = new Float32Array(channel.length);
    copy.set(channel);
    this.port.postMessage(copy, [copy.buffer]);
    return true;
  }
}
registerProcessor('streaming-pcm-processor', StreamingPcmProcessor);
`;

let cachedWorkletUrl: string | null = null;
function getWorkletUrl(): string {
  if (cachedWorkletUrl) return cachedWorkletUrl;
  const blob = new Blob([WORKLET_SOURCE], { type: "application/javascript" });
  cachedWorkletUrl = URL.createObjectURL(blob);
  return cachedWorkletUrl;
}

export function useStreamingPronunciation(
  args: StreamingHookArgs,
): StreamingHookValue {
  const [partial, setPartial] = useState<StreamingPartialResult | null>(null);
  const [final, setFinal] = useState<StreamingFinalResult | null>(null);
  const [fallback, setFallback] = useState<{ reason: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Refs hold transport state so start/stop don't race re-renders.
  type Transport = {
    audioContext: AudioContext | null;
    workletNode: AudioWorkletNode | null;
    sourceNode: MediaStreamAudioSourceNode | null;
    stream: ReturnType<typeof createPronunciationStream> extends Promise<infer T>
      ? Extract<T, { kind: "stream" }> | null
      : never;
  };
  const transportRef = useRef<Transport>({
    audioContext: null,
    workletNode: null,
    sourceNode: null,
    stream: null,
  });

  const cleanupTransport = useCallback(() => {
    const t = transportRef.current;
    try {
      t.workletNode?.disconnect();
    } catch {
      /* ignore */
    }
    try {
      t.sourceNode?.disconnect();
    } catch {
      /* ignore */
    }
    if (t.audioContext && t.audioContext.state !== "closed") {
      void t.audioContext.close().catch(() => undefined);
    }
    transportRef.current = {
      audioContext: null,
      workletNode: null,
      sourceNode: null,
      stream: null,
    };
  }, []);

  const start = useCallback(
    async (
      startArgs: StreamingStartArgs,
    ): Promise<{ kind: "stream" } | { kind: "fallback"; reason: string }> => {
      setPartial(null);
      setFinal(null);
      setFallback(null);
      setError(null);

      if (!args.enabled) {
        const reason = "disabled";
        setFallback({ reason });
        breadcrumbStreamingPronunciation("fallback", { reason });
        return { kind: "fallback", reason };
      }
      if (!startArgs.authToken) {
        const reason = "no_token";
        setFallback({ reason });
        breadcrumbStreamingPronunciation("fallback", { reason });
        return { kind: "fallback", reason };
      }
      if (typeof window === "undefined" || typeof AudioContext === "undefined") {
        const reason = "no_audio_context";
        setFallback({ reason });
        breadcrumbStreamingPronunciation("fallback", { reason });
        return { kind: "fallback", reason };
      }

      breadcrumbStreamingPronunciation("start");

      // Open the streaming session BEFORE the AudioContext so we can
      // bail out early on a connect timeout without tearing audio down.
      const stream = await createPronunciationStream({
        referenceText: args.referenceText,
        authToken: startArgs.authToken,
        wsUrl: args.wsUrl,
      });
      if (stream.kind === "fallback") {
        setFallback({ reason: stream.reason });
        breadcrumbStreamingPronunciation("fallback", { reason: stream.reason });
        return { kind: "fallback", reason: stream.reason };
      }

      stream.onPartial((p) => setPartial(p));
      stream.onFinal((f) => setFinal(f));
      stream.onError((m) => setError(m));

      // Set up the AudioContext at the required sample rate. Most
      // mobile browsers will resample silently if the device default
      // doesn't match — that's acceptable; Azure cares about the rate
      // we DECLARE in the WAV header, which is REQUIRED_SAMPLE_RATE.
      const audioContext = new AudioContext({ sampleRate: REQUIRED_SAMPLE_RATE });
      try {
        await audioContext.audioWorklet.addModule(getWorkletUrl());
      } catch (err) {
        cleanupTransport();
        stream.abort("worklet_load_failed");
        const reason = "worklet_load_failed";
        setFallback({ reason });
        setError(err instanceof Error ? err.message : String(err));
        return { kind: "fallback", reason };
      }

      const sourceNode = audioContext.createMediaStreamSource(startArgs.mediaStream);
      const workletNode = new AudioWorkletNode(
        audioContext,
        "streaming-pcm-processor",
      );
      workletNode.port.onmessage = (event) => {
        const float = event.data;
        if (!(float instanceof Float32Array) || float.length === 0) return;
        const int16 = float32ToInt16Pcm(float);
        stream.pushAudioChunk(int16.buffer as ArrayBuffer);
      };
      sourceNode.connect(workletNode);
      // We never connect to destination — we don't want playback,
      // just the worklet's onmessage to fire.

      transportRef.current = {
        audioContext,
        workletNode,
        sourceNode,
        stream,
      };
      setIsActive(true);
      return { kind: "stream" };
    },
    [args.enabled, args.referenceText, args.wsUrl, cleanupTransport],
  );

  const stop = useCallback(() => {
    const t = transportRef.current;
    if (t.stream) {
      try {
        t.stream.end();
      } catch {
        /* ignore */
      }
    }
    cleanupTransport();
    setIsActive(false);
  }, [cleanupTransport]);

  // Belt-and-braces: on unmount, drop the connection so we don't leak
  // a WebSocket if the user navigates mid-recording.
  useEffect(() => {
    return () => {
      const t = transportRef.current;
      if (t.stream) {
        try {
          t.stream.abort("unmount");
        } catch {
          /* ignore */
        }
      }
      cleanupTransport();
    };
  }, [cleanupTransport]);

  return useMemo(
    () => ({ start, stop, partial, final, fallback, error, isActive }),
    [start, stop, partial, final, fallback, error, isActive],
  );
}
