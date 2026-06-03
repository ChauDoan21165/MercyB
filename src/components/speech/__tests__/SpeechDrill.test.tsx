// src/components/speech/__tests__/SpeechDrill.test.tsx
//
// Covers the four states of SpeechDrill + the unsupported fallback
// + per-range score color coding + try-again/next controls.
//
// We mock CC1's pronunciation library rather than the Web Speech
// API itself — SpeechDrill's contract is entirely against those two
// module exports, so mocking at the module boundary is the right
// seam. That also keeps this test independent of CC1's internal
// behavior changes.

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/lib/pronunciation/recognizer', () => ({
  isSpeechRecognitionSupported: vi.fn(() => true),
  recognizeOnce: vi.fn(),
}));

vi.mock('@/lib/pronunciation/scorer', () => ({
  scorePronunciation: vi.fn(),
}));

import {
  isSpeechRecognitionSupported,
  recognizeOnce,
} from '@/lib/pronunciation/recognizer';
import type { RecognitionResult } from '@/lib/pronunciation/recognizer';
import { scorePronunciation } from '@/lib/pronunciation/scorer';
import type { ScoreResult } from '@/lib/pronunciation/scorer';

import { SpeechDrill } from '../SpeechDrill';

const TARGET = 'I would like a glass of water.';

function makeScore(overallScore: number): ScoreResult {
  return {
    overallScore,
    wordScores: [
      { word: 'I',      heard: 'I',      score: 100, status: 'correct' },
      { word: 'would',  heard: 'would',  score: 100, status: 'correct' },
      { word: 'like',   heard: 'wike',   score: 60,  status: 'close' },
      { word: 'a',      heard: 'uh',     score: 40,  status: 'wrong' },
      { word: 'glass',  heard: '',       score: 0,   status: 'missed' },
      { word: 'of',     heard: 'of',     score: 100, status: 'correct' },
      { word: 'water',  heard: 'water',  score: 100, status: 'correct' },
    ],
    feedback: {
      en: 'Nice — a couple of slips but clear overall.',
      vi: 'Tốt — còn vài chỗ trượt nhưng nhìn chung rõ.',
    },
    phonemeFeedback: [],
  };
}

beforeEach(() => {
  vi.mocked(isSpeechRecognitionSupported).mockReturnValue(true);
  vi.mocked(recognizeOnce).mockReset();
  vi.mocked(scorePronunciation).mockReset();
});

describe('SpeechDrill', () => {
  it('renders idle state with target sentence and "Tap to speak"', () => {
    render(<SpeechDrill targetSentence={TARGET} />);

    expect(screen.getByText(TARGET)).toBeInTheDocument();
    expect(screen.getByText('Tap to speak')).toBeInTheDocument();
    expect(screen.getByText('Nhấn để nói')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start recording/i })).toBeEnabled();
  });

  it('shows the unsupported fallback when SpeechRecognition is absent', () => {
    vi.mocked(isSpeechRecognitionSupported).mockReturnValue(false);

    render(<SpeechDrill targetSentence={TARGET} />);

    expect(
      screen.getByText(/works best in Chrome or Safari on iOS/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/hoạt động tốt nhất trên Chrome hoặc Safari/i),
    ).toBeInTheDocument();
    // No mic button in fallback
    expect(screen.queryByRole('button', { name: /recording/i })).toBeNull();
  });

  it('transitions idle → listening → scoring → result on tap', async () => {
    const user = userEvent.setup();
    let resolveRecognition: (v: RecognitionResult) => void = () => {};
    vi.mocked(recognizeOnce).mockImplementation(
      () => new Promise((resolve) => { resolveRecognition = resolve; }),
    );
    vi.mocked(scorePronunciation).mockReturnValue(makeScore(92));

    render(<SpeechDrill targetSentence={TARGET} />);

    await user.click(screen.getByRole('button', { name: /start recording/i }));

    // Listening state
    expect(screen.getByText('Listening…')).toBeInTheDocument();
    expect(screen.getByText('Đang nghe…')).toBeInTheDocument();
    // Mic is now labelled "Listening"
    const mic = screen.getByRole('button', { name: /listening/i });
    expect(mic).toBeDisabled();

    // Resolve recognition → component moves to scoring then result
    await act(async () => {
      resolveRecognition({
        transcript: 'I would like a glass of water',
        confidence: 0.9,
        wordTimings: [],
        durationSec: 2,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('92')).toBeInTheDocument();
    });
    expect(screen.getByText('Great pronunciation!')).toBeInTheDocument();
    expect(screen.getByText('Phát âm tốt lắm!')).toBeInTheDocument();
    expect(scorePronunciation).toHaveBeenCalledWith({
      target: TARGET,
      recognized: 'I would like a glass of water',
    });
    expect(screen.queryByLabelText('Vietnamese tone feedback')).toBeNull();
  });

  it('color-codes the overall score: 85+ green', async () => {
    const user = userEvent.setup();
    vi.mocked(recognizeOnce).mockResolvedValue({
      transcript: 'ok',
      confidence: 0.9,
      wordTimings: [],
      durationSec: 1,
    });
    vi.mocked(scorePronunciation).mockReturnValue(makeScore(90));

    render(<SpeechDrill targetSentence={TARGET} />);
    await user.click(screen.getByRole('button', { name: /start recording/i }));

    const bigScore = await screen.findByLabelText(/overall score 90/i);
    expect(bigScore).toHaveStyle({ color: '#059669' });
  });

  it('color-codes the overall score: 60-84 amber', async () => {
    const user = userEvent.setup();
    vi.mocked(recognizeOnce).mockResolvedValue({
      transcript: 'ok',
      confidence: 0.9,
      wordTimings: [],
      durationSec: 1,
    });
    vi.mocked(scorePronunciation).mockReturnValue(makeScore(70));

    render(<SpeechDrill targetSentence={TARGET} />);
    await user.click(screen.getByRole('button', { name: /start recording/i }));

    const bigScore = await screen.findByLabelText(/overall score 70/i);
    expect(bigScore).toHaveStyle({ color: '#d97706' });
    expect(screen.getByText('Good — a few slips')).toBeInTheDocument();
  });

  it('color-codes the overall score: <60 red', async () => {
    const user = userEvent.setup();
    vi.mocked(recognizeOnce).mockResolvedValue({
      transcript: 'ok',
      confidence: 0.5,
      wordTimings: [],
      durationSec: 1,
    });
    vi.mocked(scorePronunciation).mockReturnValue(makeScore(42));

    render(<SpeechDrill targetSentence={TARGET} />);
    await user.click(screen.getByRole('button', { name: /start recording/i }));

    const bigScore = await screen.findByLabelText(/overall score 42/i);
    expect(bigScore).toHaveStyle({ color: '#dc2626' });
    expect(screen.getByText('Keep practicing')).toBeInTheDocument();
  });

  it('renders word pills with correct per-status color attribution', async () => {
    const user = userEvent.setup();
    vi.mocked(recognizeOnce).mockResolvedValue({
      transcript: 'ok',
      confidence: 0.9,
      wordTimings: [],
      durationSec: 1,
    });
    vi.mocked(scorePronunciation).mockReturnValue(makeScore(92));

    render(<SpeechDrill targetSentence={TARGET} />);
    await user.click(screen.getByRole('button', { name: /start recording/i }));

    await screen.findByLabelText(/overall score 92/i);

    const row = screen.getByLabelText('Word-by-word score');
    const correct = row.querySelectorAll('[data-status="correct"]');
    const close   = row.querySelectorAll('[data-status="close"]');
    const wrong   = row.querySelectorAll('[data-status="wrong"]');
    const missed  = row.querySelectorAll('[data-status="missed"]');
    expect(correct.length).toBe(4);
    expect(close.length).toBe(1);
    expect(wrong.length).toBe(1);
    expect(missed.length).toBe(1);
    // Missed gets a strike-through
    expect((missed[0] as HTMLElement).style.textDecoration).toContain('line-through');
  });

  it('"Try again" resets result state back to idle', async () => {
    const user = userEvent.setup();
    vi.mocked(recognizeOnce).mockResolvedValue({
      transcript: 'ok',
      confidence: 0.9,
      wordTimings: [],
      durationSec: 1,
    });
    vi.mocked(scorePronunciation).mockReturnValue(makeScore(78));

    render(<SpeechDrill targetSentence={TARGET} />);
    await user.click(screen.getByRole('button', { name: /start recording/i }));
    await screen.findByLabelText(/overall score 78/i);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    // Back to idle: the "Tap to speak" prompt returns
    expect(screen.getByText('Tap to speak')).toBeInTheDocument();
    // Score element is gone
    expect(screen.queryByLabelText(/overall score/i)).toBeNull();
  });

  it('"Next" calls the onNext callback', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    vi.mocked(recognizeOnce).mockResolvedValue({
      transcript: 'ok',
      confidence: 0.9,
      wordTimings: [],
      durationSec: 1,
    });
    vi.mocked(scorePronunciation).mockReturnValue(makeScore(92));

    render(<SpeechDrill targetSentence={TARGET} onNext={onNext} />);
    await user.click(screen.getByRole('button', { name: /start recording/i }));
    await screen.findByLabelText(/overall score 92/i);

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('shows friendly Vietnamese + English message on recognition failure', async () => {
    const user = userEvent.setup();
    vi.mocked(recognizeOnce).mockRejectedValue({
      supported: true,
      reason: 'no-speech',
      message: 'silent',
    });

    render(<SpeechDrill targetSentence={TARGET} />);
    await user.click(screen.getByRole('button', { name: /start recording/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/We didn't hear anything/i),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Chúng tôi chưa nghe thấy gì/i),
    ).toBeInTheDocument();
    // User can retry
    expect(screen.getByRole('button', { name: /try again/i })).toBeEnabled();
  });
});
