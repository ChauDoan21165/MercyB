import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MercyGuidePanel from '../MercyGuidePanel';

describe("MercyGuidePanel floating launcher", () => {
  it("renders a neutral route launcher without product or support selectors", () => {
    render(<MercyGuidePanel isOpen />);

    expect(screen.getByRole('heading', { name: 'Teacher Mercy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Vào Mercy Kids' })).toHaveAttribute(
      'href',
      '/kids/vi-english',
    );
    expect(screen.getByRole('link', { name: 'Mở AI Tutor' })).toHaveAttribute(
      'href',
      '/ai-tutor',
    );

    expect(screen.queryByRole('button', { name: /Kids mode/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Teacher mode/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Gentle|Guided|Immersion/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Journey' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Grammar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Speak' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Logic' })).not.toBeInTheDocument();
  });

  describe("in kids mode (teacherMode='kids')", () => {
    it("renders the Kids exit but hides the AI Tutor adult-surface exit", () => {
      render(<MercyGuidePanel isOpen teacherMode="kids" />);

      // Kids exit stays, copy shifts to in-context wording.
      expect(
        screen.getByRole('link', { name: 'Tiếp tục với Mercy Kids' }),
      ).toHaveAttribute('href', '/kids/vi-english');

      // AI Tutor exit MUST NOT render on a kids-safe surface.
      expect(
        screen.queryByRole('link', { name: 'Mở AI Tutor' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Mercy Kids and AI Tutor are separate/),
      ).not.toBeInTheDocument();

      // Headline + eyebrow shift to kids-context copy.
      expect(
        screen.getByRole('heading', { name: 'Bạn đang ở Mercy Kids' }),
      ).toBeInTheDocument();
    });
  });
});
