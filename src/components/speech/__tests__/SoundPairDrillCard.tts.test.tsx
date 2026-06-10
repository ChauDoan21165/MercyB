// src/components/speech/__tests__/SoundPairDrillCard.tts.test.tsx
//
// C1 step 3: the "Play model" button must not fail silently. When
// pronunciation/tts.speak() reports source:'none' (cloud null AND no
// browser speechSynthesis), the card shows a retry message; on a normal
// play it shows nothing. The play button itself is the retry control.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/lib/pronunciation/tts', () => ({
  speak: vi.fn(() => Promise.resolve({ source: 'browser', error: null })),
  cancelSpeech: vi.fn(),
  isSupported: vi.fn(() => true),
}));

import { SoundPairDrillCard } from '../SoundPairDrillCard';
import { speak as ttsSpeak } from '@/lib/pronunciation/tts';

beforeEach(() => {
  vi.mocked(ttsSpeak).mockReset();
  vi.mocked(ttsSpeak).mockResolvedValue({ source: 'browser', error: null });
});

function getPlayButton(): HTMLElement {
  return screen.getByRole('button', { name: /Play model pronunciation of/i });
}

describe('SoundPairDrillCard — model TTS observability (C1)', () => {
  it('shows no error after a normal play (source: browser)', async () => {
    const user = userEvent.setup();
    render(<SoundPairDrillCard initialCategory="th-t" />);

    await user.click(getPlayButton());

    expect(ttsSpeak).toHaveBeenCalledWith(
      expect.objectContaining({ rate: 0.75 }),
    );
    // No silent-failure message on the happy path.
    expect(screen.queryByTestId('pair-tts-error')).toBeNull();
  });

  it('surfaces a retry message when playback reports source "none"', async () => {
    vi.mocked(ttsSpeak).mockResolvedValue({ source: 'none', error: 'speech_synthesis_unsupported' });
    const user = userEvent.setup();
    render(<SoundPairDrillCard initialCategory="th-t" />);

    await user.click(getPlayButton());

    const msg = await screen.findByTestId('pair-tts-error');
    // Vietnamese-primary, bilingual, mentions retry — never a score/percent claim.
    expect(msg.textContent ?? '').toMatch(/Bấm lại|retry/i);
    expect(msg.textContent ?? '').not.toMatch(/\d+\s*%/);
  });

  it('clears the message on a subsequent successful play (retry works)', async () => {
    vi.mocked(ttsSpeak).mockResolvedValueOnce({ source: 'none', error: 'x' });
    const user = userEvent.setup();
    render(<SoundPairDrillCard initialCategory="th-t" />);

    await user.click(getPlayButton());
    await screen.findByTestId('pair-tts-error');

    // Next press succeeds → message clears.
    await user.click(getPlayButton());
    await waitFor(() => expect(screen.queryByTestId('pair-tts-error')).toBeNull());
  });
});
