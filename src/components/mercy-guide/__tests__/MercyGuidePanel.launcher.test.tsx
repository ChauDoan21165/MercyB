import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
vi.mock("@/contexts/NativeLanguageContext", () => ({
  useNativeLanguage: () => ({
    nativeLang: "vi",
    setNativeLang: vi.fn(),
  }),
  NativeLanguageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import MercyGuidePanel from '../MercyGuidePanel';


describe("MercyGuidePanel floating launcher", () => {
  it("renders a Kids-only launcher — Vào Mercy Kids is the single CTA, AI Tutor exit hidden", () => {
    render(<MercyGuidePanel isOpen />);

    // The avatar header still carries the "Teacher Mercy" identity —
    // that's the floating helper's title, distinct from the section
    // content below.
    expect(screen.getByRole('heading', { name: 'Teacher Mercy' })).toBeInTheDocument();

    // Section eyebrow + headline both shifted to Kids-only framing.
    expect(screen.getByText('Mercy Kids')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Vào không gian học của bé' }),
    ).toBeInTheDocument();

    // Single CTA: Mercy Kids only.
    expect(screen.getByRole('link', { name: 'Vào Mercy Kids' })).toHaveAttribute(
      'href',
      '/kids/vi-english',
    );

    // AI Tutor exit must NOT render — the kid mercy box is Kids-only.
    expect(
      screen.queryByRole('link', { name: 'Mở AI Tutor' }),
    ).not.toBeInTheDocument();

    // The old framing copy ("Pick a learning space" / "Mercy Kids and
    // AI Tutor are separate") is gone too.
    expect(
      screen.queryByText(/Mercy Kids and AI Tutor are separate/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Pick a learning space/),
    ).not.toBeInTheDocument();

    expect(screen.queryByRole('button', { name: /Kids mode/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Teacher mode/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Gentle|Guided|Immersion/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Journey' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Grammar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Speak' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Logic' })).not.toBeInTheDocument();
  });
});
