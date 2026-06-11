// src/components/speech/__tests__/SoundPairDrillCard.scorer.test.tsx
//
// Step-7 contract tests: record→score→verdict loop.
//
// Two axes covered:
//   1. buildVerdict unit tests — pure function, fixture ScoreResult inputs.
//   2. Component rendering with a controlled pair (getDrillByCategory mocked)
//      and a controlled scoringEngine response.
//   3. Failure path (scoring-failed) — explicit error + retry shown (C1),
//      no percent score, no silent fallback.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';

// ── Static pair fixture ─────────────────────────────────────────────────
// Pin to a known pair so all rendering assertions are predictable.
const TH_PAIR = {
  target: 'three',
  contrast: 'tree',
  phoneme: 'th-voiceless',
  audioTarget: null,
  audioContrast: null,
  vnWhyConfused: 'Không có âm "th" trong tiếng Việt — dễ đọc "three" thành "tree".',
};

// ── Mocks ──────────────────────────────────────────────────────────────

vi.mock('@/lib/pronunciation/tts', () => ({
  speak: vi.fn(() => Promise.resolve({ source: 'browser', error: null })),
  cancelSpeech: vi.fn(),
  isSupported: vi.fn(() => true),
}));

vi.mock('@/lib/pronunciation/soundPairDrills', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/pronunciation/soundPairDrills')>();
  return {
    ...actual,
    getDrillByCategory: vi.fn(() => [TH_PAIR]),
  };
});

const FAKE_BLOB = new Blob(['audio'], { type: 'audio/webm' });

let mockRecorderState: {
  status: 'idle' | 'recording' | 'processing';
  audioBlob: Blob | null;
  error: string | null;
  startRecording: ReturnType<typeof vi.fn>;
  stopRecording: ReturnType<typeof vi.fn>;
  reset: ReturnType<typeof vi.fn>;
} = {
  status: 'idle',
  audioBlob: null,
  error: null,
  startRecording: vi.fn(),
  stopRecording: vi.fn(),
  reset: vi.fn(),
};

vi.mock('@/hooks/usePronunciationRecorder', () => ({
  usePronunciationRecorder: () => mockRecorderState,
}));

vi.mock('@/lib/pronunciation/scoringEngine', () => ({
  scorePronunciation: vi.fn(),
}));

// Import AFTER mocks are registered.
import { SoundPairDrillCard, buildVerdict } from '../SoundPairDrillCard';
import { scorePronunciation as engineScore } from '@/lib/pronunciation/scoringEngine';

// ── Helpers ────────────────────────────────────────────────────────────

function freshRecorder() {
  mockRecorderState = {
    status: 'idle',
    audioBlob: null,
    error: null,
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
    reset: vi.fn(),
  };
}

async function deliverBlob(rerender: (ui: React.ReactElement) => void) {
  mockRecorderState = { ...mockRecorderState, audioBlob: FAKE_BLOB };
  await act(async () => {
    rerender(<SoundPairDrillCard initialCategory="th-t" drillSize={1} />);
  });
}

// ── Unit tests: buildVerdict (pure function) ───────────────────────────

describe('buildVerdict', () => {
  it('returns correct when all words are correct', () => {
    const result = {
      overallScore: 100,
      wordScores: [{ word: 'three', heard: 'three', score: 100, status: 'correct' as const }],
      feedback: { en: '', vi: '' },
      phonemeFeedback: [],
    };
    const v = buildVerdict(result, TH_PAIR);
    expect(v.status).toBe('correct');
    expect(v.overallScore).toBe(100);
    expect(v.heardContrast).toBe(false);
  });

  it('sets heardContrast=true when heard word matches pair.contrast', () => {
    const result = {
      overallScore: 75,
      wordScores: [
        { word: 'three', heard: 'tree', score: 75, status: 'close' as const,
          hint: { en: 'th → t', vi: 'th → t (lưỡi giữa răng)' } },
      ],
      feedback: { en: '', vi: '' },
      phonemeFeedback: [],
    };
    const v = buildVerdict(result, TH_PAIR);
    expect(v.status).toBe('close');
    expect(v.heardContrast).toBe(true);
    expect(v.hint?.vi).toBe('th → t (lưỡi giữa răng)');
  });

  it('surfaces vnInterference from phonemeFeedback[0].vnConfusion', () => {
    const result = {
      overallScore: 60,
      wordScores: [{ word: 'three', heard: 'tree', score: 60, status: 'close' as const }],
      feedback: { en: '', vi: '' },
      phonemeFeedback: [
        {
          phoneme: 'th-voiceless',
          vnConfusion: 'Tiếng Việt không có âm "th".',
          articulation: { en: '', vi: '' },
          practiceWords: [],
          commonErrors: [],
        },
      ],
    };
    const v = buildVerdict(result, TH_PAIR);
    expect(v.vnInterference).toBe('Tiếng Việt không có âm "th".');
  });

  it('returns wrong for a missed word', () => {
    const result = {
      overallScore: 0,
      wordScores: [{ word: 'three', heard: '', score: 0, status: 'missed' as const }],
      feedback: { en: '', vi: '' },
      phonemeFeedback: [],
    };
    const v = buildVerdict(result, TH_PAIR);
    expect(v.status).toBe('wrong');
    expect(v.heardContrast).toBe(false);
  });
});

// ── Component rendering tests ──────────────────────────────────────────

beforeEach(() => {
  freshRecorder();
  vi.mocked(engineScore).mockReset();
});

describe('SoundPairDrillCard — verdict rendering (fixture scores)', () => {
  it('renders correct verdict chip when scorer returns perfect score', async () => {
    vi.mocked(engineScore).mockResolvedValueOnce({
      status: 'ok',
      overallScore: 100,
      transcription: 'three',   // learner said the target word exactly
      weakPhonemes: [],
      phonemeScores: [],
      referenceText: 'three',
    });

    const { rerender } = render(
      <SoundPairDrillCard initialCategory="th-t" drillSize={1} />,
    );
    await deliverBlob(rerender);

    await waitFor(() => screen.getByTestId('pair-verdict'));
    expect(screen.getByTestId('pair-verdict')).toHaveAttribute('data-status', 'correct');
    expect(screen.getByTestId('verdict-score').textContent).toMatch(/100/);
    expect(screen.queryByTestId('pair-score-error')).toBeNull();
  });

  it('renders contrast message when learner said the contrast word', async () => {
    // engineScore returns "tree" as the transcription.
    // The real textScore will classify this as 'close' with heard='tree'=contrast.
    vi.mocked(engineScore).mockResolvedValueOnce({
      status: 'ok',
      overallScore: 75,
      transcription: 'tree',   // learner said the contrast word
      weakPhonemes: ['θ'],
      phonemeScores: [],
      referenceText: 'three',
    });

    const { rerender } = render(
      <SoundPairDrillCard initialCategory="th-t" drillSize={1} />,
    );
    await deliverBlob(rerender);

    await waitFor(() => screen.getByTestId('pair-verdict'));

    // Verdict must NOT be 'correct'
    expect(screen.getByTestId('pair-verdict').getAttribute('data-status')).not.toBe('correct');

    // Contrast message names both the wrong word and the target
    const contrastMsg = screen.getByTestId('verdict-contrast-msg');
    expect(contrastMsg.textContent).toMatch(/tree/);
    expect(contrastMsg.textContent).toMatch(/three/);

    // VN interference note surfaces from the th-voiceless PhonemeTip
    const viNote = screen.getByTestId('verdict-vi-note');
    expect(viNote.textContent?.length).toBeGreaterThan(5);
  });

  it('renders a score% for any successful verdict', async () => {
    vi.mocked(engineScore).mockResolvedValueOnce({
      status: 'ok',
      overallScore: 50,
      transcription: 'tree',
      weakPhonemes: [],
      phonemeScores: [],
      referenceText: 'three',
    });

    const { rerender } = render(
      <SoundPairDrillCard initialCategory="th-t" drillSize={1} />,
    );
    await deliverBlob(rerender);

    await waitFor(() => screen.getByTestId('pair-verdict'));
    // Score shown as a percentage (not necessarily the engine's 50 — the
    // text scorer has its own value; we just check a number is present).
    expect(screen.getByTestId('verdict-score').textContent).toMatch(/\d+%/);
  });
});

describe('SoundPairDrillCard — failure path (C1 explicit error)', () => {
  it('shows error panel when engine returns scoring-failed', async () => {
    vi.mocked(engineScore).mockResolvedValueOnce({
      status: 'scoring-failed',
      overallScore: null,
      transcription: '',
      weakPhonemes: [],
      phonemeScores: [],
      referenceText: 'three',
    });

    const { rerender } = render(
      <SoundPairDrillCard initialCategory="th-t" drillSize={1} />,
    );
    await deliverBlob(rerender);

    await waitFor(() => screen.getByTestId('pair-score-error'));
    const panel = screen.getByTestId('pair-score-error');
    // Non-empty error message in Vietnamese
    expect(panel.textContent?.length).toBeGreaterThan(5);
    // C1: must NOT show 0% as a real score
    expect(panel.textContent).not.toMatch(/\d+\s*%/);
    // Retry action is present
    expect(screen.getByTestId('retry-scoring-button')).toBeTruthy();
    // No verdict alongside the error
    expect(screen.queryByTestId('pair-verdict')).toBeNull();
  });

  it('shows error panel when engine throws', async () => {
    vi.mocked(engineScore).mockRejectedValueOnce(new Error('network error'));

    const { rerender } = render(
      <SoundPairDrillCard initialCategory="th-t" drillSize={1} />,
    );
    await deliverBlob(rerender);

    await waitFor(() => screen.getByTestId('pair-score-error'));
    expect(screen.getByTestId('retry-scoring-button')).toBeTruthy();
    expect(screen.queryByTestId('pair-verdict')).toBeNull();
  });

  it('clears error and calls reset() when retry button is pressed', async () => {
    vi.mocked(engineScore).mockResolvedValueOnce({
      status: 'scoring-failed',
      overallScore: null,
      transcription: '',
      weakPhonemes: [],
      phonemeScores: [],
      referenceText: 'three',
    });

    const { rerender } = render(
      <SoundPairDrillCard initialCategory="th-t" drillSize={1} />,
    );
    await deliverBlob(rerender);
    await waitFor(() => screen.getByTestId('retry-scoring-button'));

    await act(async () => { screen.getByTestId('retry-scoring-button').click(); });

    expect(screen.queryByTestId('pair-score-error')).toBeNull();
    expect(mockRecorderState.reset).toHaveBeenCalled();
  });
});
