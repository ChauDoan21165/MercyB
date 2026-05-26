// src/lib/pronunciation/tts.ts
//
// Thin wrapper around the browser SpeechSynthesis API. Purpose: let the
// SpeechDrill UI play a model pronunciation of the target sentence (and
// of individual words) at learner-friendly speeds.
//
// Browser quirks handled here (from experience on MercyBlade's other
// TTS surfaces — see src/lib/MercySpeakTab / speakViaTTS):
//   - getVoices() returns [] before the voices-changed event; we wait
//     up to 1 s on first use.
//   - cancel() can leave the engine in a paused state in some Chrome
//     builds; we always call it before starting a new utterance and
//     treat 'interrupted' / 'canceled' onerror events as success.
//   - Rate is clamped to [0.1, 2.0] (the spec's allowed range).
//
// Out-of-scope: chunking for long utterances (SpeechDrill sentences
// cap at ~14 words, well under Chrome's ~250-char silent-fail point).
//
// Cloud upgrade: when the elevenlabs_tts feature flag is on AND the
// English voice is configured, speak() first asks the mercy-tts edge
// function for a rendered ElevenLabs mp3 and plays it. Any failure —
// flag off, no API key, daily cap hit, network blip, audio playback
// rejected — falls through to the browser SpeechSynthesis path below.
// The fallback path is intentionally untouched.

import { fetchCloudTtsUrl } from "@/lib/mercyVoice";

export type VoiceLang = 'en-US' | 'en-GB' | 'en-AU';

export interface TTSOptions {
  text: string;
  /** 0.5 = slow, 1.0 = normal. Default 0.8 (learner-friendly). Clamped 0.1..2.0. */
  rate?: number;
  /** BCP-47 language preference. Default 'en-US'. */
  voice?: VoiceLang;
}

const DEFAULT_RATE = 0.8;
const DEFAULT_VOICE: VoiceLang = 'en-US';
const MIN_RATE = 0.1;
const MAX_RATE = 2.0;
const VOICE_LOAD_TIMEOUT_MS = 1000;

function getSynth(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null;
  const s = (window as Window & { speechSynthesis?: SpeechSynthesis }).speechSynthesis;
  return s ?? null;
}

function getUtteranceCtor(): (new (text: string) => SpeechSynthesisUtterance) | null {
  if (typeof window === 'undefined') return null;
  const Ctor = (window as Window & { SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance })
    .SpeechSynthesisUtterance;
  return Ctor ?? null;
}

export function isSupported(): boolean {
  return getSynth() !== null && getUtteranceCtor() !== null;
}

function clampRate(rate: number): number {
  if (!Number.isFinite(rate)) return DEFAULT_RATE;
  return Math.max(MIN_RATE, Math.min(MAX_RATE, rate));
}

/**
 * Some browsers populate the voice list asynchronously. On the very
 * first call after page load, getVoices() may be empty; we wait for
 * the 'voiceschanged' event up to a short budget, then give up and
 * let the engine fall back to its default voice.
 */
function waitForVoices(synth: SpeechSynthesis): Promise<void> {
  if (synth.getVoices().length > 0) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      try { synth.removeEventListener('voiceschanged', onChange); } catch { /* ignore */ }
      resolve();
    }, VOICE_LOAD_TIMEOUT_MS);
    const onChange = () => {
      clearTimeout(timeout);
      try { synth.removeEventListener('voiceschanged', onChange); } catch { /* ignore */ }
      resolve();
    };
    try {
      synth.addEventListener('voiceschanged', onChange);
    } catch {
      clearTimeout(timeout);
      resolve();
    }
  });
}

function pickVoice(synth: SpeechSynthesis, lang: VoiceLang): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  if (!voices.length) return null;
  // Exact match first (e.g. 'en-US').
  const exact = voices.find((v) => v.lang === lang);
  if (exact) return exact;
  // Any English voice as fallback.
  const anyEn = voices.find((v) => typeof v.lang === 'string' && v.lang.toLowerCase().startsWith('en'));
  return anyEn ?? null;
}

export function cancelSpeech(): void {
  const synth = getSynth();
  if (!synth) return;
  try {
    synth.cancel();
  } catch {
    /* ignore — cancel() is best-effort */
  }
}

/**
 * Speak the given text. Resolves when playback ends naturally or when
 * the caller cancels it (interruption is not an error from the caller's
 * point of view). Rejects only on genuine engine errors.
 *
 * Must be called from a user gesture on browsers that require it
 * (mobile Safari); the caller is responsible for wiring this to a tap.
 */
export async function speak(opts: TTSOptions): Promise<void> {
  const synth = getSynth();
  const Utter = getUtteranceCtor();
  if (!synth || !Utter) {
    throw new Error('Speech synthesis not supported in this environment.');
  }

  const text = String(opts.text ?? '').trim();
  if (!text) return;

  const rate = clampRate(opts.rate ?? DEFAULT_RATE);
  const lang: VoiceLang = opts.voice ?? DEFAULT_VOICE;

  // Cancel anything currently playing before starting a new utterance.
  // Without this, rapid taps queue up and never play in order on Chrome.
  try { synth.cancel(); } catch { /* ignore */ }

  // Cloud path (best effort). Only attempted at the default rate, since
  // ElevenLabs has no client-side rate control — slow/long-press taps
  // still want the browser path so the rate parameter remains honored.
  if (rate === DEFAULT_RATE) {
    try {
      const cloud = await fetchCloudTtsUrl({ text, language: 'en' });
      if (cloud?.audioUrl) {
        const audio = new Audio(cloud.audioUrl);
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error('cloud audio playback failed'));
          audio.play().catch(reject);
        });
        return;
      }
    } catch (err) {
      console.warn('[pronunciation/tts] cloud path failed, falling back', err);
      // fall through to browser TTS below
    }
  }

  await waitForVoices(synth);

  return new Promise<void>((resolve, reject) => {
    const utter = new Utter(text);
    utter.rate = rate;
    utter.lang = lang;
    const picked = pickVoice(synth, lang);
    if (picked) utter.voice = picked;

    let settled = false;

    utter.onend = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    utter.onerror = (ev: SpeechSynthesisErrorEvent) => {
      if (settled) return;
      settled = true;
      const err = ev?.error ?? 'unknown';
      // Cancellation isn't an error from the caller's POV — the caller
      // either called cancelSpeech() themselves or started a new speak()
      // which implicitly cancelled.
      if (err === 'interrupted' || err === 'canceled') {
        resolve();
        return;
      }
      reject(new Error(`Speech synthesis error: ${err}`));
    };

    try {
      synth.speak(utter);
    } catch (err) {
      if (settled) return;
      settled = true;
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}
