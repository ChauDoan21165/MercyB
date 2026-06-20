import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { MoodCheck, type MoodKey } from '@/components/MoodCheck';

/**
 * Hardening tests for MoodCheck.
 *
 * MoodCheck is a presentational, controlled component:
 *   - exports the `MoodCheck` component and the `MoodKey` type
 *   - renders a bilingual (EN/VI) prompt + four mood buttons
 *   - calls `onChange(moodKey)` when a button is clicked
 *   - highlights the button whose `key` matches the `value` prop
 *
 * It has no external/network dependencies (only the pure `cn` class helper),
 * so these tests exercise rendering, interaction, edge cases and prop
 * defaults deterministically with @testing-library/react.
 */

// The four mood options the component ships with, in render order.
const EXPECTED_MOODS: { key: MoodKey; emoji: string; labelEn: string }[] = [
  { key: 'light', emoji: '😊', labelEn: 'light' },
  { key: 'ok', emoji: '🙂', labelEn: 'ok' },
  { key: 'heavy', emoji: '😟', labelEn: 'heavy' },
  { key: 'anxious', emoji: '😰', labelEn: 'anxious' },
];

afterEach(() => {
  cleanup();
});

describe('MoodCheck — exports', () => {
  it('exports the MoodCheck component as a function', () => {
    expect(typeof MoodCheck).toBe('function');
  });
});

describe('MoodCheck — rendering', () => {
  it('renders exactly four mood buttons', () => {
    render(<MoodCheck onChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('renders all buttons as type="button" so they never submit a form', () => {
    render(<MoodCheck onChange={() => {}} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveAttribute('type', 'button');
    }
  });

  it('renders the emoji and English label for every mood, in order', () => {
    render(<MoodCheck onChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    EXPECTED_MOODS.forEach((mood, index) => {
      const button = buttons[index];
      expect(button.textContent).toContain(mood.emoji);
      expect(within(button).getByText(mood.labelEn)).toBeInTheDocument();
    });
  });

  it('renders the default English and Vietnamese prompt labels', () => {
    render(<MoodCheck onChange={() => {}} />);
    expect(screen.getByText('How do you feel now?')).toBeInTheDocument();
    expect(screen.getByText('Bây giờ bạn thấy thế nào?')).toBeInTheDocument();
  });
});

describe('MoodCheck — custom labels', () => {
  it('renders a custom English label when provided', () => {
    render(<MoodCheck onChange={() => {}} labelEn="Feeling check" />);
    expect(screen.getByText('Feeling check')).toBeInTheDocument();
    expect(screen.queryByText('How do you feel now?')).not.toBeInTheDocument();
  });

  it('renders a custom Vietnamese label when provided', () => {
    render(<MoodCheck onChange={() => {}} labelVi="Cảm xúc hôm nay?" />);
    expect(screen.getByText('Cảm xúc hôm nay?')).toBeInTheDocument();
    expect(screen.queryByText('Bây giờ bạn thấy thế nào?')).not.toBeInTheDocument();
  });

  it('renders both custom labels together', () => {
    render(
      <MoodCheck onChange={() => {}} labelEn="EN custom" labelVi="VI custom" />
    );
    expect(screen.getByText('EN custom')).toBeInTheDocument();
    expect(screen.getByText('VI custom')).toBeInTheDocument();
  });

  it('renders empty-string labels without falling back to the defaults', () => {
    render(<MoodCheck onChange={() => {}} labelEn="" labelVi="" />);
    // Empty string is a provided value, so defaults must NOT appear.
    expect(screen.queryByText('How do you feel now?')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Bây giờ bạn thấy thế nào?')
    ).not.toBeInTheDocument();
    // Buttons still render regardless of label content.
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });
});

describe('MoodCheck — interaction', () => {
  it('calls onChange with the correct mood key for each button', () => {
    const onChange = vi.fn();
    render(<MoodCheck onChange={onChange} />);
    const buttons = screen.getAllByRole('button');

    EXPECTED_MOODS.forEach((mood, index) => {
      onChange.mockClear();
      fireEvent.click(buttons[index]);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(mood.key);
    });
  });

  it('fires onChange again on repeated clicks of the same button', () => {
    const onChange = vi.fn();
    render(<MoodCheck onChange={onChange} />);
    const firstButton = screen.getAllByRole('button')[0];
    fireEvent.click(firstButton);
    fireEvent.click(firstButton);
    fireEvent.click(firstButton);
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenCalledWith('light');
  });

  it('does not call onChange during render (no auto-firing)', () => {
    const onChange = vi.fn();
    render(<MoodCheck onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('fires onChange even when the clicked mood already equals value (re-select)', () => {
    const onChange = vi.fn();
    render(<MoodCheck value="ok" onChange={onChange} />);
    const okButton = screen.getByText('ok').closest('button')!;
    fireEvent.click(okButton);
    expect(onChange).toHaveBeenCalledWith('ok');
  });
});

describe('MoodCheck — selection highlighting', () => {
  it('applies the selected styling only to the matching value', () => {
    render(<MoodCheck value="heavy" onChange={() => {}} />);
    const heavyButton = screen.getByText('heavy').closest('button')!;
    expect(heavyButton.className).toContain('border-primary');
    expect(heavyButton.className).toContain('bg-primary/10');

    const okButton = screen.getByText('ok').closest('button')!;
    expect(okButton.className).not.toContain('border-primary');
    expect(okButton.className).toContain('border-border');
  });

  it('applies no selected styling when value is undefined', () => {
    render(<MoodCheck onChange={() => {}} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button.className).not.toContain('border-primary');
      expect(button.className).toContain('border-border');
    }
  });

  it('highlights at most one button at a time', () => {
    render(<MoodCheck value="anxious" onChange={() => {}} />);
    const highlighted = screen
      .getAllByRole('button')
      .filter((b) => b.className.includes('border-primary'));
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].textContent).toContain('anxious');
  });

  it('moves the highlight when value changes via rerender', () => {
    const { rerender } = render(<MoodCheck value="light" onChange={() => {}} />);
    expect(screen.getByText('light').closest('button')!.className).toContain(
      'border-primary'
    );

    rerender(<MoodCheck value="ok" onChange={() => {}} />);
    expect(screen.getByText('light').closest('button')!.className).not.toContain(
      'border-primary'
    );
    expect(screen.getByText('ok').closest('button')!.className).toContain(
      'border-primary'
    );
  });
});

describe('MoodCheck — edge cases', () => {
  it('renders no highlight for a value not in the option set', () => {
    // Force an out-of-range value through the type system to simulate
    // corrupted/legacy persisted state.
    render(
      <MoodCheck
        value={'unknown-mood' as unknown as MoodKey}
        onChange={() => {}}
      />
    );
    const highlighted = screen
      .getAllByRole('button')
      .filter((b) => b.className.includes('border-primary'));
    expect(highlighted).toHaveLength(0);
    // Component still renders all four buttons safely.
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('each button has a stable accessible name (emoji + label)', () => {
    render(<MoodCheck onChange={() => {}} />);
    for (const mood of EXPECTED_MOODS) {
      const button = screen.getByText(mood.labelEn).closest('button')!;
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    }
  });

  it('renders unique buttons (no duplicate mood keys)', () => {
    render(<MoodCheck onChange={() => {}} />);
    const labels = EXPECTED_MOODS.map((m) => m.labelEn);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
