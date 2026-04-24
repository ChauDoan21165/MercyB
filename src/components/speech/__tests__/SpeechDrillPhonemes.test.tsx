// src/components/speech/__tests__/SpeechDrillPhonemes.test.tsx
//
// Covers the new "Phonemes to practice" section on SpeechDrill:
// - renders when ScoreResult.phonemeFeedback has entries
// - hides when phonemeFeedback is empty
// - shows bilingual articulation tips inside expanded cards
// - practice-word chips render; tapping a chip fires onPracticeWord
//   only when the callback is provided (otherwise chips, not buttons)

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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
import { scorePronunciation } from '@/lib/pronunciation/scorer';
import type { ScoreResult, PhonemeTip } from '@/lib/pronunciation/scorer';

import { SpeechDrill } from '../SpeechDrill';

const TARGET = 'I think she is fine.';

const TH_TIP: PhonemeTip = {
  phoneme: 'th-voiceless',
  vnConfusion: 'Tiếng Việt không có âm "th".',
  articulation: {
    en: 'Tongue between teeth, blow air.',
    vi: 'Đặt lưỡi giữa hai hàm răng rồi thổi hơi.',
  },
  practiceWords: ['think', 'thank', 'three'],
  commonErrors: ['tink', 'tank', 'tree'],
};

const SH_TIP: PhonemeTip = {
  phoneme: 'sh',
  vnConfusion: '"sh" thường bị đọc thành "s".',
  articulation: {
    en: 'Round lips, pull tongue back.',
    vi: 'Tròn môi và kéo lưỡi về sau.',
  },
  practiceWords: ['she', 'ship', 'fish'],
  commonErrors: ['se', 'sip', 'fis'],
};

function scoreResult(overall: number, tips: PhonemeTip[]): ScoreResult {
  return {
    overallScore: overall,
    wordScores: [
      { word: 'I',     heard: 'I',    score: 100, status: 'correct' },
      { word: 'think', heard: 'tink', score: 75,  status: 'close' },
      { word: 'she',   heard: 'se',   score: 70,  status: 'close' },
      { word: 'is',    heard: 'is',   score: 100, status: 'correct' },
      { word: 'fine',  heard: 'fine', score: 100, status: 'correct' },
    ],
    feedback: { en: 'Good effort', vi: 'Tốt lắm' },
    phonemeFeedback: tips,
  };
}

beforeEach(() => {
  vi.mocked(isSpeechRecognitionSupported).mockReturnValue(true);
  vi.mocked(recognizeOnce).mockReset();
  vi.mocked(scorePronunciation).mockReset();
});

async function runOnce() {
  vi.mocked(recognizeOnce).mockResolvedValue({
    transcript: 'I tink se is fine',
    confidence: 0.7,
    wordTimings: [],
    durationSec: 2,
  });
  const user = userEvent.setup();
  render(<SpeechDrill targetSentence={TARGET} />);
  await user.click(screen.getByRole('button', { name: /start recording/i }));
  return user;
}

describe('SpeechDrill phoneme feedback section', () => {
  it('renders when phonemeFeedback is non-empty', async () => {
    vi.mocked(scorePronunciation).mockReturnValue(scoreResult(70, [TH_TIP, SH_TIP]));
    await runOnce();
    await screen.findByLabelText(/overall score 70/i);

    const section = screen.getByLabelText('Phonemes to practice');
    expect(section).toBeInTheDocument();
    // Bilingual heading
    expect(within(section).getByText(/Phonemes to practice/i)).toBeInTheDocument();
    expect(within(section).getByText(/Âm cần luyện/)).toBeInTheDocument();
  });

  it('hides the section entirely when phonemeFeedback is empty', async () => {
    vi.mocked(scorePronunciation).mockReturnValue(scoreResult(92, []));
    await runOnce();
    await screen.findByLabelText(/overall score 92/i);

    expect(screen.queryByLabelText('Phonemes to practice')).toBeNull();
  });

  it('renders one card per tip, each with bilingual articulation copy', async () => {
    vi.mocked(scorePronunciation).mockReturnValue(scoreResult(62, [TH_TIP, SH_TIP]));
    await runOnce();
    await screen.findByLabelText(/overall score 62/i);

    const section = screen.getByLabelText('Phonemes to practice');
    // Cards carry data-phoneme attribute for easy targeting.
    const cards = section.querySelectorAll('details[data-phoneme]');
    expect(cards.length).toBe(2);
    expect(cards[0].getAttribute('data-phoneme')).toBe('th-voiceless');
    expect(cards[1].getAttribute('data-phoneme')).toBe('sh');

    // Expand both (native <details> needs the attribute)
    cards.forEach((c) => c.setAttribute('open', 'true'));

    expect(within(section).getByText(TH_TIP.articulation.en)).toBeInTheDocument();
    expect(within(section).getByText(TH_TIP.articulation.vi)).toBeInTheDocument();
    expect(within(section).getByText(SH_TIP.articulation.en)).toBeInTheDocument();
  });

  it('renders practice words as interactive buttons when onPracticeWord is provided', async () => {
    const onPracticeWord = vi.fn();

    vi.mocked(scorePronunciation).mockReturnValue(scoreResult(58, [TH_TIP]));
    vi.mocked(recognizeOnce).mockResolvedValue({
      transcript: 'I tink se is fine',
      confidence: 0.7,
      wordTimings: [],
      durationSec: 2,
    });
    const user = userEvent.setup();
    render(
      <SpeechDrill targetSentence={TARGET} onPracticeWord={onPracticeWord} />,
    );
    await user.click(screen.getByRole('button', { name: /start recording/i }));
    await screen.findByLabelText(/overall score 58/i);

    const section = screen.getByLabelText('Phonemes to practice');
    section.querySelectorAll('details').forEach((c) => c.setAttribute('open', 'true'));

    const thinkBtn = within(section).getByRole('button', { name: /Try the word think/i });
    await user.click(thinkBtn);
    expect(onPracticeWord).toHaveBeenCalledWith('think');
  });

  it('renders practice words as static chips (not buttons) when onPracticeWord is absent', async () => {
    vi.mocked(scorePronunciation).mockReturnValue(scoreResult(58, [TH_TIP]));
    await runOnce();
    await screen.findByLabelText(/overall score 58/i);

    const section = screen.getByLabelText('Phonemes to practice');
    section.querySelectorAll('details').forEach((c) => c.setAttribute('open', 'true'));

    // No "Try the word" buttons.
    expect(
      within(section).queryByRole('button', { name: /Try the word/i }),
    ).toBeNull();
    // But the word text is still rendered somewhere in the section.
    expect(within(section).getByText('think')).toBeInTheDocument();
    expect(within(section).getByText('thank')).toBeInTheDocument();
  });
});
