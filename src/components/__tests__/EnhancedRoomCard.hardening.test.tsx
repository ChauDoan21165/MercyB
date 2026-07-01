/**
 * Hardening tests for EnhancedRoomCard.
 *
 * EnhancedRoomCard is the sole export — a presentational wrapper that renders
 * its children inside a shadcn Card, wires an onClick handler (with light
 * haptic feedback), and respects a `disabled` flag. These tests cover the
 * render contract, the click/haptic behavior, the disabled short-circuit,
 * className composition, and a handful of edge cases.
 *
 * External dependencies are mocked:
 *  - `@/utils/haptics` so we can assert `light()` is (or isn't) called without
 *    relying on `navigator.vibrate` existing in jsdom.
 *  - `framer-motion` is stubbed to a plain <div> so gesture props don't leak
 *    onto the DOM and the test stays deterministic.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// --- Mocks -----------------------------------------------------------------

// Mock haptics so we can spy on the feedback call. The real implementation
// guards on `navigator.vibrate` which jsdom doesn't provide, so mocking also
// keeps behavior deterministic across environments.
vi.mock('@/utils/haptics', () => ({
  haptics: {
    light: vi.fn(),
    medium: vi.fn(),
    heavy: vi.fn(),
  },
}));

// Stub framer-motion's `motion.div` to a plain div. We strip the gesture-only
// props (whileHover/whileTap/onTapStart/onTap/onTapCancel) so React doesn't
// warn about unknown DOM attributes and the markup stays clean.
vi.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: ({
        children,
        whileHover: _wh,
        whileTap: _wt,
        onTapStart: _ots,
        onTap: _ot,
        onTapCancel: _otc,
        ...rest
      }: unknown) => React.createElement('div', { 'data-testid': 'motion-div', ...rest }, children),
    },
  };
});

import { EnhancedRoomCard } from '@/components/EnhancedRoomCard';
import { haptics } from '@/utils/haptics';

const mockedLight = vi.mocked(haptics.light);

// Helper: the Card renders as the inner <div>; grab it by its text content's
// nearest clickable ancestor. We expose children with a stable testid instead.
function getCard() {
  // The Card is the element carrying the cursor-pointer / disabled classes.
  // It's the only element with role-less clickable styling; select by class.
  return document.querySelector('.cursor-pointer, .cursor-not-allowed') as HTMLElement;
}

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe('EnhancedRoomCard — rendering', () => {
  it('renders its children', () => {
    render(
      <EnhancedRoomCard>
        <span>Room Title</span>
      </EnhancedRoomCard>
    );
    expect(screen.getByText('Room Title')).toBeInTheDocument();
  });

  it('renders complex / nested children', () => {
    render(
      <EnhancedRoomCard>
        <div>
          <h3>Heading</h3>
          <p>Body copy</p>
          <button>Inner button</button>
        </div>
      </EnhancedRoomCard>
    );
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Body copy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Inner button' })).toBeInTheDocument();
  });

  it('renders without an onClick handler (optional prop)', () => {
    expect(() =>
      render(
        <EnhancedRoomCard>
          <span>No handler</span>
        </EnhancedRoomCard>
      )
    ).not.toThrow();
    expect(screen.getByText('No handler')).toBeInTheDocument();
  });

  it('renders an empty/null child without crashing', () => {
    expect(() => render(<EnhancedRoomCard>{null}</EnhancedRoomCard>)).not.toThrow();
  });

  it('applies the base cursor-pointer class when enabled', () => {
    render(
      <EnhancedRoomCard>
        <span>x</span>
      </EnhancedRoomCard>
    );
    const card = getCard();
    expect(card).toBeTruthy();
    expect(card.className).toContain('cursor-pointer');
  });
});

describe('EnhancedRoomCard — click + haptics', () => {
  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(
      <EnhancedRoomCard onClick={onClick}>
        <span>Click me</span>
      </EnhancedRoomCard>
    );
    fireEvent.click(getCard());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('triggers light haptic feedback on click', () => {
    const onClick = vi.fn();
    render(
      <EnhancedRoomCard onClick={onClick}>
        <span>Tap</span>
      </EnhancedRoomCard>
    );
    fireEvent.click(getCard());
    expect(mockedLight).toHaveBeenCalledTimes(1);
  });

  it('fires haptics even when no onClick is provided', () => {
    render(
      <EnhancedRoomCard>
        <span>Tap</span>
      </EnhancedRoomCard>
    );
    expect(() => fireEvent.click(getCard())).not.toThrow();
    expect(mockedLight).toHaveBeenCalledTimes(1);
  });

  it('calls onClick once per click across multiple clicks', () => {
    const onClick = vi.fn();
    render(
      <EnhancedRoomCard onClick={onClick}>
        <span>Tap</span>
      </EnhancedRoomCard>
    );
    const card = getCard();
    fireEvent.click(card);
    fireEvent.click(card);
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(3);
    expect(mockedLight).toHaveBeenCalledTimes(3);
  });
});

describe('EnhancedRoomCard — disabled behavior', () => {
  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <EnhancedRoomCard onClick={onClick} disabled>
        <span>Disabled</span>
      </EnhancedRoomCard>
    );
    fireEvent.click(getCard());
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire haptics when disabled', () => {
    const onClick = vi.fn();
    render(
      <EnhancedRoomCard onClick={onClick} disabled>
        <span>Disabled</span>
      </EnhancedRoomCard>
    );
    fireEvent.click(getCard());
    expect(mockedLight).not.toHaveBeenCalled();
  });

  it('applies disabled styling classes', () => {
    render(
      <EnhancedRoomCard disabled>
        <span>Disabled</span>
      </EnhancedRoomCard>
    );
    const card = getCard();
    expect(card.className).toContain('opacity-50');
    expect(card.className).toContain('cursor-not-allowed');
  });

  it('defaults to enabled when disabled prop is omitted', () => {
    const onClick = vi.fn();
    render(
      <EnhancedRoomCard onClick={onClick}>
        <span>Enabled</span>
      </EnhancedRoomCard>
    );
    fireEvent.click(getCard());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('treats disabled={false} as enabled', () => {
    const onClick = vi.fn();
    render(
      <EnhancedRoomCard onClick={onClick} disabled={false}>
        <span>Enabled</span>
      </EnhancedRoomCard>
    );
    fireEvent.click(getCard());
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(mockedLight).toHaveBeenCalledTimes(1);
  });
});

describe('EnhancedRoomCard — className composition', () => {
  it('merges a custom className onto the card', () => {
    render(
      <EnhancedRoomCard className="custom-class">
        <span>x</span>
      </EnhancedRoomCard>
    );
    const card = getCard();
    expect(card.className).toContain('custom-class');
  });

  it('retains base classes alongside a custom className', () => {
    render(
      <EnhancedRoomCard className="custom-class">
        <span>x</span>
      </EnhancedRoomCard>
    );
    const card = getCard();
    expect(card.className).toContain('custom-class');
    expect(card.className).toContain('cursor-pointer');
  });

  it('works with an empty-string className (the default)', () => {
    expect(() =>
      render(
        <EnhancedRoomCard className="">
          <span>x</span>
        </EnhancedRoomCard>
      )
    ).not.toThrow();
    expect(getCard()).toBeTruthy();
  });

  it('includes focus-visible ring classes for keyboard accessibility', () => {
    render(
      <EnhancedRoomCard>
        <span>x</span>
      </EnhancedRoomCard>
    );
    expect(getCard().className).toContain('focus-visible:ring-2');
  });
});

describe('EnhancedRoomCard — independence between instances', () => {
  it('renders multiple independent cards with separate handlers', () => {
    const onClickA = vi.fn();
    const onClickB = vi.fn();
    render(
      <div>
        <EnhancedRoomCard onClick={onClickA}>
          <span>card-a</span>
        </EnhancedRoomCard>
        <EnhancedRoomCard onClick={onClickB}>
          <span>card-b</span>
        </EnhancedRoomCard>
      </div>
    );
    const cards = document.querySelectorAll('.cursor-pointer');
    expect(cards.length).toBe(2);

    fireEvent.click(cards[0]);
    expect(onClickA).toHaveBeenCalledTimes(1);
    expect(onClickB).not.toHaveBeenCalled();

    fireEvent.click(cards[1]);
    expect(onClickB).toHaveBeenCalledTimes(1);
    expect(onClickA).toHaveBeenCalledTimes(1);
  });

  it('one disabled card does not block a sibling enabled card', () => {
    const enabledClick = vi.fn();
    render(
      <div>
        <EnhancedRoomCard disabled>
          <span>disabled-card</span>
        </EnhancedRoomCard>
        <EnhancedRoomCard onClick={enabledClick}>
          <span>enabled-card</span>
        </EnhancedRoomCard>
      </div>
    );
    const enabled = document.querySelector('.cursor-pointer') as HTMLElement;
    fireEvent.click(enabled);
    expect(enabledClick).toHaveBeenCalledTimes(1);
  });
});
