/**
 * Hardening tests for PremiumRoomCard.
 *
 * PremiumRoomCard is a thin presentational wrapper around the shadcn-style
 * <Card> that:
 *   - renders arbitrary children
 *   - fires haptics.light() then the optional onClick on click
 *   - merges spacing / animation utility classes with a caller className
 *
 * These tests exercise normal rendering, click behavior, edge cases
 * (no onClick, empty/complex children), and the haptics integration
 * (including the no-op path when vibration is unsupported).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// Mock the haptics utility so we can assert it is invoked without touching
// the real navigator.vibrate API.
vi.mock('@/utils/haptics', () => ({
  haptics: {
    light: vi.fn(),
    medium: vi.fn(),
    heavy: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { PremiumRoomCard } from '@/components/PremiumRoomCard';
import { haptics } from '@/utils/haptics';

const mockedHaptics = vi.mocked(haptics);

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PremiumRoomCard — rendering', () => {
  it('renders its children', () => {
    render(
      <PremiumRoomCard>
        <span>Room content</span>
      </PremiumRoomCard>
    );
    expect(screen.getByText('Room content')).toBeTruthy();
  });

  it('renders complex nested children', () => {
    render(
      <PremiumRoomCard>
        <div>
          <h2>Title</h2>
          <p data-testid="body">Body text</p>
        </div>
      </PremiumRoomCard>
    );
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByTestId('body').textContent).toBe('Body text');
  });

  it('renders a single text node child', () => {
    render(<PremiumRoomCard>Just text</PremiumRoomCard>);
    expect(screen.getByText('Just text')).toBeTruthy();
  });

  it('renders without throwing when children is an empty string', () => {
    const { container } = render(<PremiumRoomCard>{''}</PremiumRoomCard>);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders without throwing when children is null', () => {
    const { container } = render(<PremiumRoomCard>{null}</PremiumRoomCard>);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders multiple children', () => {
    render(
      <PremiumRoomCard>
        <span>One</span>
        <span>Two</span>
      </PremiumRoomCard>
    );
    expect(screen.getByText('One')).toBeTruthy();
    expect(screen.getByText('Two')).toBeTruthy();
  });
});

describe('PremiumRoomCard — class names', () => {
  function getCard(container: HTMLElement): HTMLElement {
    // The Card renders as the single root <div>.
    return container.firstElementChild as HTMLElement;
  }

  it('applies the base interactive utility classes', () => {
    const { container } = render(<PremiumRoomCard>x</PremiumRoomCard>);
    const card = getCard(container);
    expect(card.className).toContain('cursor-pointer');
    // spacing.card.padding === 'p-4'
    expect(card.className).toContain('p-4');
    // active press affordance
    expect(card.className).toContain('active:scale-95');
    // focus ring from animations.focusRing
    expect(card.className).toContain('focus-visible:ring-2');
  });

  it('merges a caller-supplied className', () => {
    const { container } = render(
      <PremiumRoomCard className="custom-room-class">x</PremiumRoomCard>
    );
    const card = getCard(container);
    expect(card.className).toContain('custom-room-class');
    // base classes still present alongside the custom one
    expect(card.className).toContain('cursor-pointer');
  });

  it('defaults className to empty string without injecting "undefined"', () => {
    const { container } = render(<PremiumRoomCard>x</PremiumRoomCard>);
    const card = getCard(container);
    expect(card.className).not.toContain('undefined');
  });

  it('does not break when className is an empty string', () => {
    const { container } = render(
      <PremiumRoomCard className="">x</PremiumRoomCard>
    );
    const card = getCard(container);
    expect(card.className).toContain('cursor-pointer');
    expect(card.className).not.toContain('undefined');
  });
});

describe('PremiumRoomCard — click behavior', () => {
  it('fires haptics.light() and onClick on click', () => {
    const onClick = vi.fn();
    render(<PremiumRoomCard onClick={onClick}>Click me</PremiumRoomCard>);
    fireEvent.click(screen.getByText('Click me'));
    expect(mockedHaptics.light).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires haptics.light() before onClick', () => {
    const order: string[] = [];
    mockedHaptics.light.mockImplementation(() => order.push('haptic'));
    const onClick = vi.fn(() => order.push('click'));
    render(<PremiumRoomCard onClick={onClick}>Ordered</PremiumRoomCard>);
    fireEvent.click(screen.getByText('Ordered'));
    expect(order).toEqual(['haptic', 'click']);
  });

  it('still fires haptics when onClick is not provided (no throw)', () => {
    const { container } = render(<PremiumRoomCard>No handler</PremiumRoomCard>);
    const card = container.firstElementChild as HTMLElement;
    expect(() => fireEvent.click(card)).not.toThrow();
    expect(mockedHaptics.light).toHaveBeenCalledTimes(1);
  });

  it('invokes onClick once per click across multiple clicks', () => {
    const onClick = vi.fn();
    render(<PremiumRoomCard onClick={onClick}>Multi</PremiumRoomCard>);
    const target = screen.getByText('Multi');
    fireEvent.click(target);
    fireEvent.click(target);
    fireEvent.click(target);
    expect(onClick).toHaveBeenCalledTimes(3);
    expect(mockedHaptics.light).toHaveBeenCalledTimes(3);
  });

  it('does not call onClick on render (only on click)', () => {
    const onClick = vi.fn();
    render(<PremiumRoomCard onClick={onClick}>Idle</PremiumRoomCard>);
    expect(onClick).not.toHaveBeenCalled();
    expect(mockedHaptics.light).not.toHaveBeenCalled();
  });

  it('propagates clicks originating from nested children', () => {
    const onClick = vi.fn();
    render(
      <PremiumRoomCard onClick={onClick}>
        <button type="button">Inner</button>
      </PremiumRoomCard>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Inner' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(mockedHaptics.light).toHaveBeenCalledTimes(1);
  });
});

describe('PremiumRoomCard — haptics integration edge cases', () => {
  it('tolerates haptics.light() throwing-free when vibration unsupported (no-op mock)', () => {
    // Real haptics.light() is a no-op when navigator.vibrate is absent; the
    // mock models the call surface, so clicking must remain safe regardless.
    const onClick = vi.fn();
    render(<PremiumRoomCard onClick={onClick}>Safe</PremiumRoomCard>);
    expect(() => fireEvent.click(screen.getByText('Safe'))).not.toThrow();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('only triggers light haptics, never medium/heavy', () => {
    render(<PremiumRoomCard onClick={() => {}}>H</PremiumRoomCard>);
    fireEvent.click(screen.getByText('H'));
    expect(mockedHaptics.light).toHaveBeenCalledTimes(1);
    expect(mockedHaptics.medium).not.toHaveBeenCalled();
    expect(mockedHaptics.heavy).not.toHaveBeenCalled();
  });
});
