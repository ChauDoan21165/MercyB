// src/lib/pronunciation/__tests__/tts.test.ts
//
// Covers the TTS wrapper. jsdom doesn't ship a SpeechSynthesis
// implementation, so we stub window.speechSynthesis and
// window.SpeechSynthesisUtterance per-test. This both exercises the
// real code paths and documents the contract the stub must satisfy.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { isSupported, speak, cancelSpeech } from '../tts';

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
  it('rejects when the API is not available', async () => {
    await expect(speak({ text: 'hi' })).rejects.toThrow(/not supported/i);
  });

  it('resolves when the utterance ends naturally', async () => {
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
    await expect(promise).resolves.toBeUndefined();
  });

  it('resolves on a cancel/interrupted error (not rejects)', async () => {
    const fake = installStub();
    const promise = speak({ text: 'Hello.' });
    await Promise.resolve();
    await Promise.resolve();
    fake.spoken[0].onerror?.({ error: 'interrupted' });
    await expect(promise).resolves.toBeUndefined();
  });

  it('rejects on a genuine engine error', async () => {
    const fake = installStub();
    const promise = speak({ text: 'Hello.' });
    await Promise.resolve();
    await Promise.resolve();
    fake.spoken[0].onerror?.({ error: 'synthesis-failed' });
    await expect(promise).rejects.toThrow(/synthesis-failed/i);
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
