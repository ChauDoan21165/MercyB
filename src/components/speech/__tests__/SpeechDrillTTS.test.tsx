// src/components/speech/__tests__/SpeechDrillTTS.test.tsx
//
// Covers the Listen controls on SpeechDrill:
// - Primary Listen button + "Listen slowly" ghost show when TTS is
//   supported; both disappear when tts.isSupported() returns false.
// - Tap (pointerdown+pointerup with no hold) → speak at rate 0.8
// - Long press (pointerdown, wait past the long-press threshold) →
//   speak at rate 0.5, no follow-up fast speak on release
// - "Listen slowly" ghost link always plays at rate 0.5
// - Per-word Listen icons appear in the word row for non-correct slots
//   and emit the word at rate 0.8

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/lib/pronunciation/recognizer', () => ({
  isSpeechRecognitionSupported: vi.fn(() => true),
  recognizeOnce: vi.fn(),
}));

vi.mock('@/lib/pronunciation/scorer', () => ({
  scorePronunciation: vi.fn(),
}));

vi.mock('@/lib/pronunciation/tts', () => ({
  speak: vi.fn(() => Promise.resolve()),
  cancelSpeech: vi.fn(),
  isSupported: vi.fn(() => true),
}));

import {
  isSpeechRecognitionSupported,
  recognizeOnce,
} from '@/lib/pronunciation/recognizer';
import { scorePronunciation } from '@/lib/pronunciation/scorer';
import type { ScoreResult } from '@/lib/pronunciation/scorer';
import { speak as ttsSpeak, isSupported as ttsIsSupported } from '@/lib/pronunciation/tts';

import { SpeechDrill } from '../SpeechDrill';

const TARGET = 'I think she is fine.';

function scoreResult(): ScoreResult {
  return {
    overallScore: 72,
    wordScores: [
      { word: 'I',     heard: 'I',    score: 100, status: 'correct' },
      { word: 'think', heard: 'tink', score: 75,  status: 'close' },
      { word: 'she',   heard: 'se',   score: 70,  status: 'close' },
      { word: 'is',    heard: 'is',   score: 100, status: 'correct' },
      { word: 'fine',  heard: '',     score: 0,   status: 'missed' },
    ],
    feedback: { en: 'Close', vi: 'Gần đúng' },
    phonemeFeedback: [],
  };
}

beforeEach(() => {
  vi.mocked(isSpeechRecognitionSupported).mockReturnValue(true);
  vi.mocked(recognizeOnce).mockReset();
  vi.mocked(scorePronunciation).mockReset();
  vi.mocked(ttsSpeak).mockReset();
  vi.mocked(ttsSpeak).mockResolvedValue(undefined);
  vi.mocked(ttsIsSupported).mockReturnValue(true);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('SpeechDrill · Listen controls', () => {
  it('shows the primary Listen button and "Listen slowly" ghost when TTS is supported', () => {
    render(<SpeechDrill targetSentence={TARGET} />);
    const primary = screen.getByTestId('tts-listen-primary');
    const slow = screen.getByTestId('tts-listen-slow');
    expect(primary).toBeInTheDocument();
    expect(slow).toBeInTheDocument();
    // Primary button carries "Listen" + VI · Nghe
    expect(primary.textContent).toMatch(/Listen/);
    expect(primary.textContent).toMatch(/Nghe/);
    // Ghost link carries the slow-play bilingual copy
    expect(slow.textContent).toMatch(/Listen slowly · Nghe chậm/);
  });

  it('hides all Listen controls when TTS is not supported', () => {
    vi.mocked(ttsIsSupported).mockReturnValue(false);
    render(<SpeechDrill targetSentence={TARGET} />);
    expect(screen.queryByTestId('tts-listen-primary')).toBeNull();
    expect(screen.queryByTestId('tts-listen-slow')).toBeNull();
  });

  it('calls tts.speak with rate 0.8 on a quick tap of the primary Listen button', () => {
    render(<SpeechDrill targetSentence={TARGET} />);
    const btn = screen.getByTestId('tts-listen-primary');
    fireEvent.pointerDown(btn);
    fireEvent.pointerUp(btn);
    expect(ttsSpeak).toHaveBeenCalledTimes(1);
    expect(ttsSpeak).toHaveBeenCalledWith({ text: TARGET, rate: 0.8 });
  });

  it('calls tts.speak with rate 0.5 on a long press of the primary Listen button', () => {
    vi.useFakeTimers();
    render(<SpeechDrill targetSentence={TARGET} />);
    const btn = screen.getByTestId('tts-listen-primary');

    fireEvent.pointerDown(btn);
    // Advance past the 350 ms long-press threshold.
    vi.advanceTimersByTime(400);
    fireEvent.pointerUp(btn);

    expect(ttsSpeak).toHaveBeenCalledTimes(1);
    expect(ttsSpeak).toHaveBeenCalledWith({ text: TARGET, rate: 0.5 });
  });

  it('"Listen slowly" ghost link always plays at rate 0.5', async () => {
    const user = userEvent.setup();
    render(<SpeechDrill targetSentence={TARGET} />);
    await user.click(screen.getByTestId('tts-listen-slow'));
    expect(ttsSpeak).toHaveBeenCalledWith({ text: TARGET, rate: 0.5 });
  });

  it('renders per-word Listen icons in the word row (non-correct slots only)', async () => {
    const user = userEvent.setup();
    vi.mocked(recognizeOnce).mockResolvedValue({
      transcript: 'I tink se is',
      confidence: 0.7,
      wordTimings: [],
      durationSec: 2,
    });
    vi.mocked(scorePronunciation).mockReturnValue(scoreResult());

    render(<SpeechDrill targetSentence={TARGET} />);
    await user.click(screen.getByRole('button', { name: /start recording/i }));
    await screen.findByLabelText(/overall score 72/i);

    const row = screen.getByLabelText('Word-by-word score');
    const wordListenBtns = row.querySelectorAll('button[data-word-listen]');
    // "think" (close), "she" (close), "fine" (missed) → 3 listen icons
    // (correct slots "I", "is" have no icon).
    expect(wordListenBtns.length).toBe(3);
    const words = Array.from(wordListenBtns).map((b) => b.getAttribute('data-word-listen'));
    expect(words).toEqual(['think', 'she', 'fine']);

    await user.click(wordListenBtns[0]);
    expect(ttsSpeak).toHaveBeenLastCalledWith({ text: 'think', rate: 0.8 });
  });

  it('surfaces a user-visible message when TTS playback fails entirely (no silent failure)', async () => {
    vi.mocked(ttsSpeak).mockRejectedValue(new Error('cloud null + no speechSynthesis'));
    render(<SpeechDrill targetSentence={TARGET} />);
    const btn = screen.getByTestId('tts-listen-primary');
    fireEvent.pointerDown(btn);
    fireEvent.pointerUp(btn);
    // Previously this only console.warn'd — the learner saw nothing.
    const msg = await screen.findByTestId('tts-listen-error');
    expect(msg.textContent).toMatch(/Could not play the model audio|Không phát được/i);
  });

  it('does not render per-word Listen icons when TTS is not supported', async () => {
    const user = userEvent.setup();
    vi.mocked(ttsIsSupported).mockReturnValue(false);
    vi.mocked(recognizeOnce).mockResolvedValue({
      transcript: 'I tink se is',
      confidence: 0.7,
      wordTimings: [],
      durationSec: 2,
    });
    vi.mocked(scorePronunciation).mockReturnValue(scoreResult());

    render(<SpeechDrill targetSentence={TARGET} />);
    await user.click(screen.getByRole('button', { name: /start recording/i }));
    await screen.findByLabelText(/overall score 72/i);

    const row = screen.getByLabelText('Word-by-word score');
    expect(row.querySelectorAll('button[data-word-listen]').length).toBe(0);
  });
});

describe('SpeechDrill · single-word mistake playback (by-ear only)', () => {
  async function renderScored() {
    const user = userEvent.setup();
    vi.mocked(recognizeOnce).mockResolvedValue({
      transcript: 'I tink se is',
      confidence: 0.7,
      wordTimings: [],
      durationSec: 2,
    });
    vi.mocked(scorePronunciation).mockReturnValue(scoreResult());
    render(<SpeechDrill targetSentence={TARGET} />);
    await user.click(screen.getByRole('button', { name: /start recording/i }));
    await screen.findByLabelText(/overall score 72/i);
    return user;
  }

  it('still plays the FULL model sentence (tap = 0.8x)', () => {
    render(<SpeechDrill targetSentence={TARGET} />);
    const btn = screen.getByTestId('tts-listen-primary');
    fireEvent.pointerDown(btn);
    fireEvent.pointerUp(btn);
    expect(ttsSpeak).toHaveBeenCalledWith({ text: TARGET, rate: 0.8 });
  });

  it('plays a single surfaced practice word clearly (the word the scorer flagged, nothing invented)', async () => {
    const user = await renderScored();
    const row = screen.getByLabelText('Word-by-word score');
    const wordBtns = row.querySelectorAll('button[data-word-listen]');
    // Only words the scorer surfaced as non-correct — never invented words.
    expect(Array.from(wordBtns).map((b) => b.getAttribute('data-word-listen'))).toEqual([
      'think',
      'she',
      'fine',
    ]);
    await user.click(wordBtns[1]);
    // Reads exactly that single word, by ear — no scoring re-run.
    expect(ttsSpeak).toHaveBeenLastCalledWith({ text: 'she', rate: 0.8 });
  });

  it('shows a clear message when a single-word TTS playback fails, and keeps the drill usable', async () => {
    const user = await renderScored();
    vi.mocked(ttsSpeak).mockRejectedValueOnce(new Error('cloud null + no speechSynthesis'));

    const row = screen.getByLabelText('Word-by-word score');
    const wordBtn = row.querySelector('button[data-word-listen]') as HTMLElement;
    await user.click(wordBtn);

    const msg = await screen.findByTestId('word-listen-error');
    expect(msg.textContent).toMatch(/Could not play this word|Không phát được/i);
    // Rest of the drill is still there (word row + other listen buttons usable).
    expect(screen.getByLabelText('Word-by-word score')).toBeInTheDocument();
    expect(row.querySelectorAll('button[data-word-listen]').length).toBe(3);
  });

  it('adds NO score / percent to the single-word playback feature', async () => {
    const user = await renderScored();
    // Trigger a failure too, so both the button and the message are exercised.
    vi.mocked(ttsSpeak).mockRejectedValueOnce(new Error('fail'));
    const row = screen.getByLabelText('Word-by-word score');
    const wordBtns = Array.from(
      row.querySelectorAll('button[data-word-listen]'),
    ) as HTMLElement[];
    for (const b of wordBtns) {
      const name = b.getAttribute('aria-label') ?? '';
      expect(name).toMatch(/^Listen to /); // pure by-ear label
      expect(name).not.toMatch(/\d+\s*%/);
      expect(name).not.toMatch(/score/i);
    }
    await user.click(wordBtns[0]);
    const msg = await screen.findByTestId('word-listen-error');
    expect(msg.textContent ?? '').not.toMatch(/\d+\s*%/);
    expect(msg.textContent ?? '').not.toMatch(/score/i);
  });

  it('per-word playback never re-invokes the scorer (scorer/threshold untouched)', async () => {
    const user = await renderScored();
    const callsAfterScore = vi.mocked(scorePronunciation).mock.calls.length;
    const row = screen.getByLabelText('Word-by-word score');
    const wordBtn = row.querySelector('button[data-word-listen]') as HTMLElement;
    await user.click(wordBtn);
    // Playing a word must not run any scoring again.
    expect(vi.mocked(scorePronunciation).mock.calls.length).toBe(callsAfterScore);
    expect(ttsSpeak).toHaveBeenLastCalledWith({ text: 'think', rate: 0.8 });
  });
});
