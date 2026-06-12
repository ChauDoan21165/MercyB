// src/lib/pronunciation/__tests__/tts.test.ts
//
// Covers the TTS wrapper. jsdom doesn't ship a SpeechSynthesis
// implementation, so we stub window.speechSynthesis and
// window.SpeechSynthesisUtterance per-test. This both exercises the
// real code paths and documents the contract the stub must satisfy.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Force the browser-TTS path. The production `speak()` tries cloud TTS
// first at default rate; with real voice IDs in src/config/mercyVoices.ts
// (us is configured) that path would resolve via supabase.functions.invoke,
// which we don't want to exercise here — these tests are about the
// browser speechSynthesis wrapper specifically. Returning null forces
// `speak()` to fall through to the browser stub installed below.
vi.mock('@/lib/mercyVoice', () => ({
  fetchCloudTtsUrl: vi.fn().mockResolvedValue(null),
}));

import { isSupported, speak, cancelSpeech } from '../tts';
import { fetchCloudTtsUrl } from '@/lib/mercyVoice';

type OnEnd = (() => void) | null;
type OnErr = ((ev: { error: string }) => void) | null;

class FakeUtterance {
  text: string;
  rate = 1;
  lang = 'en-US';
  voice: unknown = null;
  onend: OnEnd = null;
  onerror: OnErr = null;
  constructor(text: string) { this.text = text; }
}

class FakeSynth {
  private listeners = new Map<string, Array<() => void>>();
  private voices: Array<{ lang: string }> = [];
  public spoken: FakeUtterance[] = [];
  public cancelCount = 0;

  setVoices(list: Array<{ lang: string }>) { this.voices = list; }

  getVoices() { return this.voices as unknown as SpeechSynthesisVoice[]; }

  speak(u: unknown) { this.spoken.push(u as FakeUtterance); }
  cancel() { this.cancelCount += 1; }

  addEventListener(event: string, cb: () => void) {
    const arr = this.listeners.get(event) ?? [];
    arr.push(cb);
    this.listeners.set(event, arr);
  }
  removeEventListener(event: string, cb: () => void) {
    const arr = this.listeners.get(event) ?? [];
    this.listeners.set(event, arr.filter((fn) => fn !== cb));
  }
  fire(event: string) {
    const arr = this.listeners.get(event) ?? [];
    for (const cb of arr.slice()) cb();
  }
}

function installStub(voices: Array<{ lang: string }> = [{ lang: 'en-US' }]): FakeSynth {
  const fake = new FakeSynth();
  fake.setVoices(voices);
  (window as unknown as { speechSynthesis: FakeSynth }).speechSynthesis = fake;
  (window as unknown as { SpeechSynthesisUtterance: typeof FakeUtterance }).SpeechSynthesisUtterance = FakeUtterance;
  return fake;
}

function removeStub() {
  delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
  delete (window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance;
}

beforeEach(() => {
  removeStub();
});

afterEach(() => {
  removeStub();
});

describe('isSupported', () => {
  it('returns false in a jsdom environment without the stub', () => {
    expect(isSupported()).toBe(false);
  });

  it('returns true once both speechSynthesis and SpeechSynthesisUtterance exist', () => {
    installStub();
    expect(isSupported()).toBe(true);
  });
});

describe('speak', () => {
  it('reports source "none" (does not throw) when the API is not available', async () => {
    // C1: a total failure must be OBSERVABLE, not a silent drop or a throw.
    await expect(speak({ text: 'hi' })).resolves.toEqual({
      source: 'none',
      error: 'speech_synthesis_unsupported',
    });
  });

  it('resolves source "browser" when the utterance ends naturally', async () => {
    const fake = installStub();
    const promise = speak({ text: 'Hello there.', rate: 0.8 });
    // Wait a tick so the promise can subscribe + voices can resolve.
    await Promise.resolve();
    await Promise.resolve();
    expect(fake.spoken.length).toBe(1);
    expect(fake.spoken[0].text).toBe('Hello there.');
    expect(fake.spoken[0].rate).toBe(0.8);
    expect(fake.spoken[0].lang).toBe('en-US');
    // Simulate the engine finishing playback.
    fake.spoken[0].onend?.();
    await expect(promise).resolves.toEqual({ source: 'browser', error: null });
  });

  it('extracts English from bilingual display text before browser TTS', async () => {
    const fake = installStub();
    const promise = speak({
      text: "Mercy chưa nghe rõ. Bạn nói lại nhé. I didn't catch that clearly. Can you say it again?",
      rate: 1,
    });
    await Promise.resolve();
    await Promise.resolve();

    expect(fake.spoken[0].text).toBe("I didn't catch that clearly. Can you say it again?");
    expect(fake.spoken[0].text).not.toMatch(
      /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i,
    );
    fake.spoken[0].onend?.();
    await expect(promise).resolves.toEqual({ source: 'browser', error: null });
  });

  it('treats a cancel/interrupted error as a successful browser play', async () => {
    const fake = installStub();
    const promise = speak({ text: 'Hello.' });
    await Promise.resolve();
    await Promise.resolve();
    fake.spoken[0].onerror?.({ error: 'interrupted' });
    await expect(promise).resolves.toEqual({ source: 'browser', error: null });
  });

  it('reports source "none" with an error string on a genuine engine error', async () => {
    const fake = installStub();
    const promise = speak({ text: 'Hello.' });
    await Promise.resolve();
    await Promise.resolve();
    fake.spoken[0].onerror?.({ error: 'synthesis-failed' });
    const result = await promise;
    expect(result.source).toBe('none');
    expect(result.error).toMatch(/synthesis-failed/i);
  });

  it('resolves source "cloud" when the cloud path plays (no browser fallback)', async () => {
    const fake = installStub();
    (fetchCloudTtsUrl as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      audioUrl: 'https://example.test/word.mp3',
    });
    // Stub Audio so play() resolves immediately via onended.
    class FakeAudio {
      onended: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(public src: string) {}
      play() {
        // Fire onended on the next microtask so the awaiter is subscribed.
        Promise.resolve().then(() => this.onended?.());
        return Promise.resolve();
      }
    }
    (window as unknown as { Audio: typeof FakeAudio }).Audio = FakeAudio;

    const result = await speak({ text: 'Hello.', rate: 0.8 });
    expect(result).toEqual({ source: 'cloud', error: null });
    // Browser synth must NOT be used when cloud succeeds.
    expect(fake.spoken.length).toBe(0);

    delete (window as unknown as { Audio?: unknown }).Audio;
  });

  it('clamps the rate into the 0.1–2.0 range', async () => {
    const fake = installStub();
    const p1 = speak({ text: 'too fast', rate: 10 });
    await Promise.resolve();
    await Promise.resolve();
    expect(fake.spoken[0].rate).toBe(2.0);
    fake.spoken[0].onend?.();
    await p1;

    const p2 = speak({ text: 'too slow', rate: 0.01 });
    await Promise.resolve();
    await Promise.resolve();
    const last = fake.spoken[fake.spoken.length - 1];
    expect(last.rate).toBe(0.1);
    last.onend?.();
    await p2;
  });

  it('cancels any in-flight utterance before starting a new one', async () => {
    const fake = installStub();
    const p1 = speak({ text: 'first' });
    await Promise.resolve();
    await Promise.resolve();
    // cancel is called once at the start of every speak() — including the first.
    expect(fake.cancelCount).toBeGreaterThanOrEqual(1);
    const cancelBefore = fake.cancelCount;
    const p2 = speak({ text: 'second' });
    await Promise.resolve();
    await Promise.resolve();
    expect(fake.cancelCount).toBe(cancelBefore + 1);
    // Finish both promises so they don't leak.
    fake.spoken[0].onerror?.({ error: 'interrupted' });
    fake.spoken[1].onend?.();
    await p1;
    await p2;
  });

  it('waits for voiceschanged when getVoices() is initially empty', async () => {
    const fake = installStub([]);
    const promise = speak({ text: 'hi' });
    // With no voices, the wait-for-voices promise is pending. Fire
    // voiceschanged to unblock it.
    await Promise.resolve();
    fake.setVoices([{ lang: 'en-US' }]);
    fake.fire('voiceschanged');
    // Let waitForVoices resolve, then the speak promise subscribes.
    await Promise.resolve();
    await Promise.resolve();
    expect(fake.spoken.length).toBe(1);
    fake.spoken[0].onend?.();
    await promise;
  });
});

describe('cancelSpeech', () => {
  it('is a no-op when the API is not available', () => {
    expect(() => cancelSpeech()).not.toThrow();
  });

  it('calls speechSynthesis.cancel when available', () => {
    const fake = installStub();
    cancelSpeech();
    expect(fake.cancelCount).toBe(1);
  });
});
