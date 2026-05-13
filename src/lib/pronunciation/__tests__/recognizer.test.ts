import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isSpeechRecognitionSupported,
  recognizeOnce,
  type RecognitionResult,
} from '../recognizer';

// ─────────────────────────────────────────────────────────────────────────
// Fake SpeechRecognition — gives us full control over the event sequence.
// Exposes trigger* helpers so tests can drive the lifecycle deterministically.
// ─────────────────────────────────────────────────────────────────────────

type Handlers = {
  onresult: ((ev: any) => void) | null;
  onerror: ((ev: any) => void) | null;
  onend: (() => void) | null;
  onaudiostart: (() => void) | null;
};

class FakeRecognition implements Handlers {
  static created: FakeRecognition[] = [];

  lang = '';
  continuous = false;
  interimResults = false;
  maxAlternatives = 1;

  onresult: Handlers['onresult'] = null;
  onerror: Handlers['onerror'] = null;
  onend: Handlers['onend'] = null;
  onaudiostart: Handlers['onaudiostart'] = null;

  started = false;
  stopped = false;
  aborted = false;

  constructor() { FakeRecognition.created.push(this); }

  start() { this.started = true; }
  stop()  { this.stopped = true; }
  abort() { this.aborted = true; }

  // Test helpers ──────────────────────────────────────────────────────────

  fireAudioStart() { this.onaudiostart?.(); }

  fireResult(transcript: string, confidence = 0.9) {
    const ev = {
      resultIndex: 0,
      results: {
        length: 1,
        0: {
          isFinal: true,
          length: 1,
          0: { transcript, confidence },
        },
      },
    };
    this.onresult?.(ev);
  }

  fireError(error: string, message = '') { this.onerror?.({ error, message }); }
  fireEnd() { this.onend?.(); }
}

function makeFakeWindow() {
  return {
    SpeechRecognition: FakeRecognition,
  } as unknown as Window & typeof globalThis;
}

beforeEach(() => { FakeRecognition.created = []; });
afterEach(() => { vi.useRealTimers(); });

describe('isSpeechRecognitionSupported', () => {
  it('true when SpeechRecognition constructor exists', () => {
    expect(isSpeechRecognitionSupported(makeFakeWindow())).toBe(true);
  });

  it('true when webkitSpeechRecognition is present', () => {
    const w = { webkitSpeechRecognition: FakeRecognition } as unknown as Window & typeof globalThis;
    expect(isSpeechRecognitionSupported(w)).toBe(true);
  });

  it('false when neither is present', () => {
    const w = {} as unknown as Window & typeof globalThis;
    expect(isSpeechRecognitionSupported(w)).toBe(false);
  });
});

describe('recognizeOnce', () => {
  it('rejects with supported:false on unsupported browsers', async () => {
    const w = {} as unknown as Window & typeof globalThis;
    await expect(recognizeOnce({ win: w })).rejects.toMatchObject({
      supported: false,
      reason: 'unsupported',
    });
  });

  it('resolves with transcript + confidence on a clean lifecycle', async () => {
    const w = makeFakeWindow();
    const promise = recognizeOnce({ win: w });
    // Allow the promise to install its handlers before we fire events.
    await Promise.resolve();
    const recog = FakeRecognition.created[0];
    recog.fireAudioStart();
    recog.fireResult('hello world', 0.85);
    recog.fireEnd();
    const result: RecognitionResult = await promise;
    expect(result.transcript).toBe('hello world');
    expect(result.confidence).toBeCloseTo(0.85);
    expect(result.wordTimings).toHaveLength(2);
    expect(result.wordTimings[0].word).toBe('hello');
    expect(result.wordTimings[1].word).toBe('world');
  });

  it('trims whitespace off the final transcript', async () => {
    const w = makeFakeWindow();
    const promise = recognizeOnce({ win: w });
    await Promise.resolve();
    const recog = FakeRecognition.created[0];
    recog.fireResult('   hi there   ', 0.9);
    recog.fireEnd();
    const r = await promise;
    expect(r.transcript).toBe('hi there');
  });

  it('rejects with no-speech when end fires without any final result', async () => {
    const w = makeFakeWindow();
    const promise = recognizeOnce({ win: w });
    await Promise.resolve();
    const recog = FakeRecognition.created[0];
    recog.fireEnd();
    await expect(promise).rejects.toMatchObject({
      supported: true,
      reason: 'no-speech',
    });
  });

  it('maps known SpeechRecognition errors to structured reasons', async () => {
    const w = makeFakeWindow();
    const promise = recognizeOnce({ win: w });
    await Promise.resolve();
    const recog = FakeRecognition.created[0];
    recog.fireError('not-allowed', 'Permission denied');
    await expect(promise).rejects.toMatchObject({
      supported: true,
      reason: 'not-allowed',
      message: 'Permission denied',
    });
  });

  it('normalises unknown error codes to reason:"unknown"', async () => {
    const w = makeFakeWindow();
    const promise = recognizeOnce({ win: w });
    await Promise.resolve();
    const recog = FakeRecognition.created[0];
    recog.fireError('some-weird-new-code', '');
    await expect(promise).rejects.toMatchObject({
      supported: true,
      reason: 'unknown',
    });
  });

  it('honours lang option', async () => {
    const w = makeFakeWindow();
    const promise = recognizeOnce({ win: w, lang: 'en-GB' });
    await Promise.resolve();
    const recog = FakeRecognition.created[0];
    expect(recog.lang).toBe('en-GB');
    recog.fireResult('ok', 0.9);
    recog.fireEnd();
    await promise;
  });

  it('times out when no audio or results arrive', async () => {
    vi.useFakeTimers();
    const w = makeFakeWindow();
    const promise = recognizeOnce({ win: w, timeoutMs: 100 });
    await Promise.resolve();
    vi.advanceTimersByTime(150);
    await expect(promise).rejects.toMatchObject({
      supported: true,
      reason: 'no-speech',
    });
    const recog = FakeRecognition.created[0];
    expect(recog.aborted).toBe(true);
  });

  it('synthesises word timings evenly across duration', async () => {
    const w = makeFakeWindow();
    const promise = recognizeOnce({ win: w });
    await Promise.resolve();
    const recog = FakeRecognition.created[0];
    recog.fireAudioStart();
    recog.fireResult('one two three four', 0.9);
    recog.fireEnd();
    const r = await promise;
    expect(r.wordTimings).toHaveLength(4);
    for (let i = 1; i < r.wordTimings.length; i++) {
      expect(r.wordTimings[i].startSec).toBeGreaterThanOrEqual(r.wordTimings[i - 1].startSec);
      expect(r.wordTimings[i].endSec).toBeGreaterThanOrEqual(r.wordTimings[i].startSec);
    }
  });

  it('ignores non-final results and uses only the final transcript', async () => {
    const w = makeFakeWindow();
    const promise = recognizeOnce({ win: w });
    await Promise.resolve();
    const recog = FakeRecognition.created[0];

    // Fire an interim-style result (isFinal:false) first — should be ignored.
    const interimEv = {
      resultIndex: 0,
      results: {
        length: 1,
        0: {
          isFinal: false,
          length: 1,
          0: { transcript: 'hel', confidence: 0.3 },
        },
      },
    };
    recog.onresult?.(interimEv);

    // Then fire a final result.
    recog.fireResult('hello', 0.9);
    recog.fireEnd();
    const r = await promise;
    expect(r.transcript).toBe('hello');
  });
});
