import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MercyGuidePanel from '../MercyGuidePanel';

describe("MercyGuidePanel floating launcher", () => {
  it("renders a neutral route launcher without product or support selectors", () => {
    render(<MercyGuidePanel isOpen />);

    expect(screen.getByRole('heading', { name: 'Mercy Guide' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Open the right learning space' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Vào Mercy Kids' })).toHaveAttribute(
      'href',
      '/kids/vi-english',
    );
    expect(screen.getByRole('link', { name: 'Mở AI Tutor' })).toHaveAttribute(
      'href',
      '/ai-tutor',
    );

    expect(screen.queryByRole('heading', { name: 'Mercy Kids' })).not.toBeInTheDocument();
    expect(
      screen.queryByText(/choose picture|tap speak|kid speaks|picture card/i),
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
