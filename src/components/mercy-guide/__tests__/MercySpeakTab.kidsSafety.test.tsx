/**
 * MercySpeakTab — Kids safety pin.
 *
 * Asserts that when MercySpeakTab is mounted with `isKidsMode={true}`
 * (the kids product context), both cloud-recording feature flags are
 * forced to OFF at the consumption boundary — regardless of what the
 * per-user feature-flag service returns.
 *
 *   azure_phoneme_scoring          → scoreCloud() upload path
 *   pronunciation_streaming_enabled → useStreamingPronunciation() WebSocket
 *
 * CLAUDE.md non-negotiable #2 (Kids mode is sacred. No raw audio leaves
 * the device.) — these pins prevent /kids/vi-english from ever sending
 * a child's recording to Azure even if Chau flips the flag on for a
 * user account who happens to land in the kids tab tree.
 *
 * Adult mounts (no `isKidsMode` prop) keep the raw flag behaviour
 * intact — both paths remain feature-flag-gated as before.
 */
import React from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';

const useFeatureFlagMock = vi.fn();
vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: string, fallback: boolean) =>
    useFeatureFlagMock(flag, fallback),
}));

const useStreamingPronunciationMock = vi.fn();
vi.mock('@/lib/pronunciation/useStreamingPronunciation', () => ({
  useStreamingPronunciation: (args: { enabled: boolean }) => {
    useStreamingPronunciationMock(args);
    return {
      start: vi.fn(),
      stop: vi.fn(),
      isActive: false,
      partial: '',
      error: '',
    };
  },
}));

vi.mock('@/hooks/useMercyVoice', () => ({
  useMercyVoice: () => ({ speak: vi.fn().mockResolvedValue({ cloud: true, spoken: true, error: null }) }),
}));

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: { getSession: vi.fn(async () => ({ data: { session: null } })) },
  },
}));

vi.mock('@/lib/pronunciation/cloudScorer', () => ({
  scoreCloud: vi.fn(),
}));

import MercySpeakTab from '../MercySpeakTab';

describe('MercySpeakTab — Kids safety pin', () => {
  beforeEach(() => {
    useFeatureFlagMock.mockReset();
    useStreamingPronunciationMock.mockReset();
    // Default: both feature flags return ENABLED. Pin must override.
    useFeatureFlagMock.mockReturnValue({ enabled: true, loading: false });
  });

  it('forces both cloud paths OFF when isKidsMode={true} even if both flags are ENABLED', () => {
    render(<MercySpeakTab isKidsMode />);

    // Both flags were requested with the right names.
    const flagsRequested = useFeatureFlagMock.mock.calls.map((c) => c[0]);
    expect(flagsRequested).toContain('azure_phoneme_scoring');
    expect(flagsRequested).toContain('pronunciation_streaming_enabled');

    // The streaming hook saw `enabled: false` (the pinned value), NOT the
    // raw `true` the feature-flag mock returned.
    const streamingArgs = useStreamingPronunciationMock.mock.calls[0]?.[0];
    expect(streamingArgs?.enabled).toBe(false);
  });

  it('honours the raw flag value when isKidsMode is absent (adult mount unchanged)', () => {
    render(<MercySpeakTab />);

    // With the raw flag mocked ENABLED and no kids-mode pin, the
    // streaming hook should see `enabled: true`.
    const streamingArgs = useStreamingPronunciationMock.mock.calls[0]?.[0];
    expect(streamingArgs?.enabled).toBe(true);
  });

  it('also forces streaming OFF when the raw flag is disabled and isKidsMode is true', () => {
    useFeatureFlagMock.mockReturnValue({ enabled: false, loading: false });
    render(<MercySpeakTab isKidsMode />);

    const streamingArgs = useStreamingPronunciationMock.mock.calls[0]?.[0];
    expect(streamingArgs?.enabled).toBe(false);
  });
});
