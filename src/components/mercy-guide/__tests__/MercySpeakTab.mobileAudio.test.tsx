import React from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => ({ enabled: false, loading: false }),
}));

vi.mock('@/hooks/useMercyVoice', () => ({
  useMercyVoice: () => ({
    speak: vi.fn().mockResolvedValue({ cloud: true, spoken: true, error: null }),
  }),
}));

vi.mock('@/lib/pronunciation/useStreamingPronunciation', () => ({
  useStreamingPronunciation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    isActive: false,
    partial: '',
    error: '',
  }),
}));

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: null } })),
    },
  },
}));

vi.mock('@/components/share/ShareScoreButton', () => ({
  default: () => null,
}));

vi.mock('@/components/pronunciation/WaveformComparison', () => ({
  default: () => null,
}));

vi.mock('@/components/pronunciation/RetakeComparison', () => ({
  default: () => null,
}));

vi.mock('@/components/pronunciation/StreamingFeedback', () => ({
  default: () => null,
}));

vi.mock('@/components/speech/PhonemePlayButton', () => ({
  default: () => null,
}));

import { MercySpeakTab } from '../MercySpeakTab';

beforeEach(() => {
  window.history.replaceState(null, '', '/?mobileAudioRetest=1');
  window.localStorage.clear();
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: {
      getUserMedia: vi.fn(async () => ({
        getTracks: () => [{ stop: vi.fn(), enabled: true }],
      })),
    },
  });
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: {
      cancel: vi.fn(),
      getVoices: vi.fn(() => []),
      speak: vi.fn(),
    },
  });
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: vi.fn(async () => undefined),
    },
  });
  class MockMediaRecorder {
    static isTypeSupported(type: string) {
      return type === 'audio/mp4';
    }
  }
  Object.defineProperty(window, 'MediaRecorder', {
    configurable: true,
    value: MockMediaRecorder,
  });
  Object.defineProperty(globalThis, 'MediaRecorder', {
    configurable: true,
    value: MockMediaRecorder,
  });
});

describe('MercySpeakTab mobile audio retest panel', () => {
  it('exposes the dev-only iPhone capture and playback checklist', () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    expect(screen.getByTestId('mobile-audio-retest-panel')).toBeInTheDocument();
    expect(screen.getByText(/Mobile audio retest/i)).toBeInTheDocument();
    expect(screen.getByText('Request mic')).toBeInTheDocument();
    expect(screen.getByText('Start record')).toBeInTheDocument();
    expect(screen.getByText('Teacher Mercy')).toBeInTheDocument();
    expect(screen.getByText('Copy diagnostics')).toBeInTheDocument();
    expect(screen.getByText(/Cloud TTS before audible output: not required/i)).toBeInTheDocument();
    expect(screen.getByText(/audio\/mp4/i)).toBeInTheDocument();
  });

  it('copies anonymized mobile audio diagnostics from the retest panel', async () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    fireEvent.click(screen.getByText('Teacher Mercy'));
    fireEvent.click(screen.getByText('Copy diagnostics'));

    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });

    const copied = JSON.parse(vi.mocked(window.navigator.clipboard.writeText).mock.calls[0][0]);
    expect(copied.schemaVersion).toBe('mb-diagnostics-v1');
    expect(copied.events[0]).toMatchObject({
      playbackPath: 'browser_tts',
    });
    expect(typeof copied.events[0].playbackSucceeded).toBe('boolean');
    expect(JSON.stringify(copied)).not.toMatch(/rawAudio|audioBlob|Hello from Teacher Mercy|learner text|userId|learnerId|deviceId|token|secret|transcript/i);
  });

  it('hides copy diagnostics unless mobileAudioRetest is enabled', () => {
    window.history.replaceState(null, '', '/');

    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    expect(screen.queryByTestId('mobile-audio-retest-panel')).not.toBeInTheDocument();
    expect(screen.queryByText('Copy diagnostics')).not.toBeInTheDocument();
  });

  it('keeps normal learner UI free of diagnostics copy', () => {
    window.history.replaceState(null, '', '/');

    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    expect(screen.queryByText(/Mobile audio retest/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Anonymized, last 5 events only/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Runtime status/i)).not.toBeInTheDocument();
  });

  it('shows a short success state after clipboard copy succeeds', async () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    fireEvent.click(screen.getByText('Copy diagnostics'));

    expect(await screen.findByText(/Copied anonymized diagnostics/i)).toBeInTheDocument();
    expect(screen.queryByText(/schemaVersion/i)).not.toBeInTheDocument();
  });

  it('shows a safe failure message when clipboard copy fails', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn(async () => {
          throw new Error('denied');
        }),
      },
    });

    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);
    fireEvent.click(screen.getByText('Copy diagnostics'));

    expect(await screen.findByText(/Diagnostics copy failed\. Please try again\./i)).toBeInTheDocument();
    expect(screen.queryByText(/Copied anonymized diagnostics/i)).not.toBeInTheDocument();
  });

  it('does not render raw JSON when clipboard copy fails', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn(async () => {
          throw new Error('denied');
        }),
      },
    });

    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);
    fireEvent.click(screen.getByText('Teacher Mercy'));
    fireEvent.click(screen.getByText('Copy diagnostics'));

    expect(await screen.findByText(/Diagnostics copy failed\. Please try again\./i)).toBeInTheDocument();
    expect(screen.queryByText(/"schemaVersion"/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/mb-diagnostics-v1/i)).not.toBeInTheDocument();
  });

  it('copies valid JSON with the deterministic top-level keys', async () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    fireEvent.click(screen.getByText('Copy diagnostics'));

    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
    const copied = JSON.parse(vi.mocked(window.navigator.clipboard.writeText).mock.calls[0][0]);
    expect(Object.keys(copied)).toEqual([
      'schemaVersion',
      'createdAt',
      'truncated',
      'readiness',
      'certification',
      'runtimeSupport',
      'events',
      'summary',
    ]);
  });

  it('copied payload contains at most 5 events', async () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    for (let index = 0; index < 6; index += 1) {
      fireEvent.click(screen.getByText('Teacher Mercy'));
    }
    fireEvent.click(screen.getByText('Copy diagnostics'));

    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
    const copied = JSON.parse(vi.mocked(window.navigator.clipboard.writeText).mock.calls[0][0]);
    expect(copied.events.length).toBeLessThanOrEqual(5);
    expect(copied.events.map((event: { order: number }) => event.order)).toEqual([-4, -3, -2, -1, 0]);
  });

  it('keeps the manual retest workflow inside the gated panel', () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    expect(screen.getByText(/Open the dev URL with \?mobileAudioRetest=1/i)).toBeInTheDocument();
    expect(screen.getByText(/Tap Request mic/i)).toBeInTheDocument();
    expect(screen.getByText(/Tap Start retest recording/i)).toBeInTheDocument();
    expect(screen.getByText(/Tap Play recording/i)).toBeInTheDocument();
    expect(screen.getByText(/Tap Teacher Mercy/i)).toBeInTheDocument();
  });

  it('does not expose learner text in copied payload after Teacher Mercy playback', async () => {
    render(<MercySpeakTab initialPracticeLine="Sensitive learner sentence." />);

    fireEvent.click(screen.getByText('Teacher Mercy'));
    fireEvent.click(screen.getByText('Copy diagnostics'));

    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
    const copiedText = vi.mocked(window.navigator.clipboard.writeText).mock.calls[0][0];
    expect(copiedText).not.toContain('Sensitive learner sentence');
    expect(copiedText).not.toMatch(/transcript|rawAudio|deviceId|userId|token|secret/i);
  });

  it('copy button is visible only in the retest panel', () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    expect(screen.getByTestId('mobile-audio-retest-panel')).toContainElement(screen.getByText('Copy diagnostics'));
  });

  it('success state remains safe after a second copy click', async () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    fireEvent.click(screen.getByText('Copy diagnostics'));
    fireEvent.click(screen.getByText('Copy diagnostics'));

    expect(await screen.findByText(/Copied anonymized diagnostics/i)).toBeInTheDocument();
    expect(screen.queryByText(/Diagnostics copy failed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/"events"/i)).not.toBeInTheDocument();
  });

  it('clipboard unavailable shows a safe failure message', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });

    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);
    fireEvent.click(screen.getByText('Copy diagnostics'));

    expect(await screen.findByText(/Diagnostics copy failed\. Please try again\./i)).toBeInTheDocument();
  });

  it('copied payload parses as JSON', async () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    fireEvent.click(screen.getByText('Copy diagnostics'));

    await waitFor(() => expect(window.navigator.clipboard.writeText).toHaveBeenCalledTimes(1));
    expect(() => JSON.parse(vi.mocked(window.navigator.clipboard.writeText).mock.calls[0][0])).not.toThrow();
  });

  it('copied payload length is at most 8192 bytes', async () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    for (let index = 0; index < 8; index += 1) {
      fireEvent.click(screen.getByText('Teacher Mercy'));
    }
    fireEvent.click(screen.getByText('Copy diagnostics'));

    await waitFor(() => expect(window.navigator.clipboard.writeText).toHaveBeenCalledTimes(1));
    expect(new TextEncoder().encode(vi.mocked(window.navigator.clipboard.writeText).mock.calls[0][0]).length).toBeLessThanOrEqual(8192);
  });

  it('diagnostics buffer can update internally while the retest panel is hidden', () => {
    window.history.replaceState(null, '', '/');

    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    expect(() => window.localStorage.setItem('mb.mobileAudioDiagnostics.v1', '[]')).not.toThrow();
    expect(screen.queryByText('Copy diagnostics')).not.toBeInTheDocument();
  });

  it('does not render diagnostics JSON outside the retest panel', () => {
    window.history.replaceState(null, '', '/');
    window.localStorage.setItem('mb.mobileAudioDiagnostics.v1', JSON.stringify([{ schemaVersion: 'mb-diagnostics-v1' }]));

    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    expect(screen.queryByText(/schemaVersion/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/mb-diagnostics-v1/i)).not.toBeInTheDocument();
  });

  it('does not show internal retest failure codes outside the retest panel', () => {
    window.history.replaceState(null, '', '/');

    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    expect(screen.queryByText(/PLAYBACK_BLOCKED/)).not.toBeInTheDocument();
    expect(screen.queryByText(/NO_CAPTURE/)).not.toBeInTheDocument();
  });

  it('copied payload excludes unsafe denylist terms beyond schemaVersion', async () => {
    render(<MercySpeakTab initialPracticeLine="Hello from Teacher Mercy." />);

    fireEvent.click(screen.getByText('Teacher Mercy'));
    fireEvent.click(screen.getByText('Copy diagnostics'));

    await waitFor(() => expect(window.navigator.clipboard.writeText).toHaveBeenCalledTimes(1));
    const copiedText = vi.mocked(window.navigator.clipboard.writeText).mock.calls[0][0];
    expect(copiedText.replace(/"schemaVersion":"[^"]+"/, '"schemaVersion":"<schema>"')).not.toMatch(/audio|blob|transcript|utterance|learner|student|userId|learnerId|deviceId|sessionId|token|secret|authorization|cookie|localStorage|navigator|userAgent/i);
  });
});
