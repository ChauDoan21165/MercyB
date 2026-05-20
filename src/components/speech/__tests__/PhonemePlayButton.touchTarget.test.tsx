// src/components/speech/__tests__/PhonemePlayButton.touchTarget.test.tsx
//
// Regression guard for #634. The per-phoneme play button is the most
// repeated tap target in pronunciation practice, so it must keep a
// ≥44px hit area (Apple HIG / WCAG 2.5.5) while staying visually 28px.
// The fix is an absolutely-positioned 44×44 (h-11 w-11) overlay span
// that is a CHILD of the <button> so the click still bubbles. If that
// span loses its h-11/w-11 sizing, stops being a button descendant, or
// the visual circle changes, the tap zone silently regresses — this
// test fails loudly instead.

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/hooks/useMercyVoice', () => ({
  useMercyVoice: () => ({ speak: vi.fn(), cancel: vi.fn() }),
}));

import PhonemePlayButton from '../PhonemePlayButton';

describe('PhonemePlayButton — ≥44px touch target (#634)', () => {
  it('renders a 44×44 (h-11 w-11) hit-area overlay inside the button', () => {
    render(<PhonemePlayButton text="think" />);
    const button = screen.getByRole('button', { name: /think/ });
    const overlay = button.querySelector('span.h-11.w-11');
    expect(overlay).not.toBeNull();
    // Centered overlay so the visual circle stays put.
    expect(overlay?.className).toContain('-translate-x-1/2');
    expect(overlay?.className).toContain('-translate-y-1/2');
  });

  it('keeps the visual circle at 28px (h-7 w-7) — design unchanged', () => {
    render(<PhonemePlayButton text="think" />);
    const button = screen.getByRole('button', { name: /think/ });
    expect(button.className).toContain('h-7');
    expect(button.className).toContain('w-7');
    // Positioning context for the absolute overlay.
    expect(button.className).toContain('relative');
  });
});
