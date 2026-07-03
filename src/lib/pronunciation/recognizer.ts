/**
 * Thin wrapper around the browser Web Speech API.
 *
 * Scope:
 *   - Chrome/Edge: uses `webkitSpeechRecognition` (the original Google impl).
 *   - Safari 14.5+: uses the now-standard `SpeechRecognition`.
 *   - Firefox / older mobile Safari: returns `{ supported: false }` so
 *     callers can fall back gracefully (e.g. "speak-and-listen only,
 *     no scoring on this browser").
 *
 * The Web Speech API is free + ships today but has real limits:
 *   - Word-level timings are NOT exposed by most implementations. We
 *     return a best-effort `wordTimings` array synthesised from the final
 *     transcript (equal spacing across the utterance duration).
 *   - Confidence scores are often binary (0 or ~0.9) in Chrome.
 *   - Mobile Safari sometimes drops `end` events — we guard with a hard
 *     timeout so callers never hang forever.
 *
 * Upgrade path: swap this module for an Azure/Speechace bridge later
 * without changing the scorer's interface. The `RecognitionResult` shape
 * is stable.
 */

export type WordTiming = {
  word: string;
  /** Seconds from utterance start. Synthetic when the API doesn't provide it. */
  startSec: number;
  endSec: number;
};

export type RecognitionResult = {
  transcript: string;
  /** 0..1 — provider's self-reported confidence, coerced from whatever the API gave us. */
  confidence: number;
  wordTimings: WordTiming[];
  /** Total wall-clock duration of the recognition session, in seconds. */
  durationSec: number;
};

export type RecognitionFailure = {
  supported: boolean;
  reason:
    | 'unsupported'
    | 'no-speech'
    | 'aborted'
    | 'audio-capture'
    | 'not-allowed'
    | 'network'
    | 'service-not-allowed'
    | 'bad-grammar'
    | 'language-not-supported'
    | 'unknown';
  message: string;
};

export type RecognizeOptions = {
  /** BCP-47 language tag (default 'en-US'). */
  lang?: string;
  /** Max ms to wait after start() before giving up (default 15_000). */
  timeoutMs?: number;
  /** Provide your own global (for testing). Defaults to window. */
  win?: Window & typeof globalThis;
};

/** Minimal subset of the SpeechRecognition constructor surface we touch. */
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onaudiostart: (() => void) | null;
};

type SpeechRecognitionAlternativeLike = { transcript: string; confidence: number };
type SpeechRecognitionResultLike = {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: { length: number;[index: number]: SpeechRecognitionResultLike };
};
type SpeechRecognitionErrorEventLike = { error: string; message?: string };
type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;
type SpeechRecognitionWindow = Window & typeof globalThis & {
  SpeechRecognition?: SpeechRecognitionConstructorLike;
  webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
};

export function isSpeechRecognitionSupported(win?: Window & typeof globalThis): boolean {
  const w = (win ?? (typeof window !== 'undefined' ? window : undefined)) as
    | SpeechRecognitionWindow
    | undefined;
  if (!w) return false;
  return typeof w.SpeechRecognition === 'function'
    || typeof w.webkitSpeechRecognition === 'function';
}

function getCtor(win: Window & typeof globalThis): SpeechRecognitionConstructorLike | null {
  const speechWindow = win as SpeechRecognitionWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

/**
 * Distribute word timings evenly across the total duration. Crude but
 * predictable — callers that need real phoneme timings should upgrade
 * to Azure Speech / Speechace, which the scorer can consume without
 * change.
 */
function synthesizeTimings(transcript: string, durationSec: number): WordTiming[] {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  // When the real duration is zero or unknown (fake timers in tests,
  // providers that don't fire onaudiostart, clock skew on mobile Safari),
  // fall back to a nominal 0.3 s per word so downstream UIs still get a
  // monotonically-increasing timeline to animate against.
  const effective = durationSec > 0 ? durationSec : words.length * 0.3;
  const per = effective / words.length;
  return words.map((w, i) => ({
    word: w,
    startSec: +(i * per).toFixed(3),
    endSec: +((i + 1) * per).toFixed(3),
  }));
}

/**
 * Start a one-shot recognition session. Resolves with the final transcript
 * when the engine fires its `end` event, or rejects with a structured
 * failure. Does not require user gesture by itself — the caller must
 * invoke this inside a click/tap handler per browser security rules.
 */
export function recognizeOnce(
  opts: RecognizeOptions = {},
): Promise<RecognitionResult> {
  const win =
    opts.win ?? (typeof window !== 'undefined' ? (window as Window & typeof globalThis) : undefined);

  if (!win || !isSpeechRecognitionSupported(win)) {
    const fail: RecognitionFailure = {
      supported: false,
      reason: 'unsupported',
      message: 'SpeechRecognition is not available in this browser.',
    };
    return Promise.reject(fail);
  }

  const Ctor = getCtor(win);
  if (!Ctor) {
    const fail: RecognitionFailure = {
      supported: false,
      reason: 'unsupported',
      message: 'SpeechRecognition constructor missing.',
    };
    return Promise.reject(fail);
  }

  const timeoutMs = opts.timeoutMs ?? 15_000;
  const lang = opts.lang ?? 'en-US';

  return new Promise<RecognitionResult>((resolve, reject) => {
    const recog = new Ctor();
    recog.lang = lang;
    recog.continuous = false;
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    let finalTranscript = '';
    let finalConfidence = 0;
    let startedAt = Date.now();
    let settled = false;

    const hardTimeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { recog.abort(); } catch { /* ignore */ }
      const fail: RecognitionFailure = {
        supported: true,
        reason: 'no-speech',
        message: 'Recognition timed out waiting for speech.',
      };
      reject(fail);
    }, timeoutMs);

    recog.onaudiostart = () => {
      startedAt = Date.now();
    };

    recog.onresult = (ev) => {
      // Walk all final results from resultIndex forward. We ask for
      // interimResults:false, so typically there's just one final entry.
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const result = ev.results[i];
        if (!result.isFinal) continue;
        const alt = result[0];
        if (!alt) continue;
        finalTranscript = alt.transcript.trim();
        finalConfidence = Number.isFinite(alt.confidence) ? alt.confidence : 0;
      }
    };

    recog.onerror = (ev) => {
      if (settled) return;
      settled = true;
      clearTimeout(hardTimeout);
      const known: RecognitionFailure['reason'][] = [
        'no-speech', 'aborted', 'audio-capture', 'not-allowed', 'network',
        'service-not-allowed', 'bad-grammar', 'language-not-supported',
      ];
      const reason = (known as string[]).includes(ev.error)
        ? (ev.error as RecognitionFailure['reason'])
        : 'unknown';
      reject({
        supported: true,
        reason,
        message: ev.message || ev.error || 'Speech recognition error',
      } satisfies RecognitionFailure);
    };

    recog.onend = () => {
      if (settled) return;
      settled = true;
      clearTimeout(hardTimeout);
      const durationSec = Math.max(0, (Date.now() - startedAt) / 1000);
      if (!finalTranscript) {
        reject({
          supported: true,
          reason: 'no-speech',
          message: 'No speech was detected before the session ended.',
        } satisfies RecognitionFailure);
        return;
      }
      resolve({
        transcript: finalTranscript,
        confidence: finalConfidence,
        wordTimings: synthesizeTimings(finalTranscript, durationSec),
        durationSec,
      });
    };

    try {
      recog.start();
    } catch (err) {
      if (settled) return;
      settled = true;
      clearTimeout(hardTimeout);
      reject({
        supported: true,
        reason: 'unknown',
        message: err instanceof Error ? err.message : 'Failed to start recognition',
      } satisfies RecognitionFailure);
    }
  });
}
