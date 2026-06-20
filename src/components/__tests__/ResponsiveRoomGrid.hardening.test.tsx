/**
 * Hardening tests for ResponsiveRoomGrid.
 *
 * ResponsiveRoomGrid is a tiny, presentational layout wrapper:
 *   - renders a single <div> with a fixed set of Tailwind grid classes
 *   - forwards `children` verbatim
 *   - merges an optional `className` via the project's `cn()` (clsx + tailwind-merge)
 *
 * It has no external dependencies (no supabase / fetch / network), so the tests
 * below focus on structural guarantees, class composition, className merging
 * semantics, and a range of children shapes (normal, edge, and "error-ish"
 * inputs like null/empty/zero).
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import { ResponsiveRoomGrid } from '@/components/ResponsiveRoomGrid';

/** Helper: render and return the single root grid <div>. */
function renderGrid(props: Parameters<typeof ResponsiveRoomGrid>[0]) {
  const { container } = render(<ResponsiveRoomGrid {...props} />);
  // The component renders exactly one element at the root.
  return container.firstElementChild as HTMLElement;
}

describe('ResponsiveRoomGrid — structure', () => {
  it('renders a single root <div> element', () => {
    const { container } = render(
      <ResponsiveRoomGrid>
        <span>child</span>
      </ResponsiveRoomGrid>,
    );

    expect(container.childElementCount).toBe(1);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
  });

  it('renders its children inside the grid', () => {
    const { getByText } = render(
      <ResponsiveRoomGrid>
        <div>room-card</div>
      </ResponsiveRoomGrid>,
    );

    expect(getByText('room-card')).toBeInTheDocument();
  });

  it('renders multiple children in order', () => {
    const root = renderGrid({
      children: (
        <>
          <span>one</span>
          <span>two</span>
          <span>three</span>
        </>
      ),
    });

    expect(root.children.length).toBe(3);
    expect(root.children[0].textContent).toBe('one');
    expect(root.children[1].textContent).toBe('two');
    expect(root.children[2].textContent).toBe('three');
  });

  it('places children as direct descendants of the grid root', () => {
    const root = renderGrid({ children: <article data-testid="kid" /> });
    const kid = root.querySelector('[data-testid="kid"]');
    expect(kid).not.toBeNull();
    expect(kid!.parentElement).toBe(root);
  });
});

describe('ResponsiveRoomGrid — base grid classes', () => {
  // These classes are the documented responsive contract (2/3/4/5/6 columns).
  const REQUIRED_CLASSES = [
    'grid',
    'grid-cols-2',
    'sm:grid-cols-3',
    'md:grid-cols-4',
    'lg:grid-cols-5',
    'xl:grid-cols-6',
    'gap-3',
    'sm:gap-4',
    'px-3',
    'sm:px-4',
  ];

  it.each(REQUIRED_CLASSES)('always includes the "%s" class', (cls) => {
    const root = renderGrid({ children: <span /> });
    expect(root.classList.contains(cls)).toBe(true);
  });

  it('includes safe-area padding utilities for notched devices', () => {
    const root = renderGrid({ children: <span /> });
    const className = root.getAttribute('class') ?? '';
    expect(className).toContain('pb-[env(safe-area-inset-bottom)]');
    expect(className).toContain('pt-[env(safe-area-inset-top)]');
  });

  it('declares 2 mobile columns by default (mobile-first contract)', () => {
    const root = renderGrid({ children: <span /> });
    // Unprefixed grid-cols-2 is the mobile (smallest) breakpoint.
    expect(root.classList.contains('grid-cols-2')).toBe(true);
  });
});

describe('ResponsiveRoomGrid — className merging', () => {
  it('appends a custom className alongside the base classes', () => {
    const root = renderGrid({
      children: <span />,
      className: 'my-custom-class',
    });

    expect(root.classList.contains('my-custom-class')).toBe(true);
    // Base classes are still present.
    expect(root.classList.contains('grid')).toBe(true);
    expect(root.classList.contains('grid-cols-2')).toBe(true);
  });

  it('lets a custom column override win via tailwind-merge (last conflict wins)', () => {
    const root = renderGrid({
      children: <span />,
      className: 'grid-cols-1',
    });

    // tailwind-merge removes the conflicting base grid-cols-2 in favor of the override.
    expect(root.classList.contains('grid-cols-1')).toBe(true);
    expect(root.classList.contains('grid-cols-2')).toBe(false);
  });

  it('lets a custom gap override the base gap-3 via tailwind-merge', () => {
    const root = renderGrid({
      children: <span />,
      className: 'gap-8',
    });

    expect(root.classList.contains('gap-8')).toBe(true);
    expect(root.classList.contains('gap-3')).toBe(false);
  });

  it('keeps the base classes when no className is provided', () => {
    const root = renderGrid({ children: <span /> });
    const className = root.getAttribute('class') ?? '';
    expect(className.length).toBeGreaterThan(0);
    expect(root.classList.contains('grid')).toBe(true);
  });

  it('handles an explicit undefined className without throwing', () => {
    expect(() =>
      renderGrid({ children: <span />, className: undefined }),
    ).not.toThrow();
    const root = renderGrid({ children: <span />, className: undefined });
    expect(root.classList.contains('grid')).toBe(true);
  });

  it('handles an empty-string className without adding empty tokens', () => {
    const root = renderGrid({ children: <span />, className: '' });
    // No stray empty class token; base classes intact.
    expect(root.classList.contains('grid')).toBe(true);
    expect(root.className.includes('  ')).toBe(false);
  });

  it('merges multiple custom classes in a single className string', () => {
    const root = renderGrid({
      children: <span />,
      className: 'bg-red-500 rounded-xl shadow-lg',
    });

    expect(root.classList.contains('bg-red-500')).toBe(true);
    expect(root.classList.contains('rounded-xl')).toBe(true);
    expect(root.classList.contains('shadow-lg')).toBe(true);
  });
});

describe('ResponsiveRoomGrid — children edge cases', () => {
  it('renders with null children without throwing', () => {
    expect(() => render(<ResponsiveRoomGrid>{null}</ResponsiveRoomGrid>)).not.toThrow();
    const root = renderGrid({ children: null });
    expect(root.tagName).toBe('DIV');
    expect(root.children.length).toBe(0);
  });

  it('renders with undefined children without throwing', () => {
    expect(() =>
      render(<ResponsiveRoomGrid>{undefined}</ResponsiveRoomGrid>),
    ).not.toThrow();
  });

  it('renders with a boolean (false) child as empty', () => {
    const root = renderGrid({ children: false as unknown as React.ReactNode });
    expect(root.children.length).toBe(0);
  });

  it('renders a plain string child as text content', () => {
    const root = renderGrid({ children: 'just text' });
    expect(root.textContent).toBe('just text');
  });

  it('renders the number 0 child as visible text (not swallowed)', () => {
    const root = renderGrid({ children: 0 });
    expect(root.textContent).toBe('0');
  });

  it('renders an empty array of children as an empty grid', () => {
    const root = renderGrid({ children: [] });
    expect(root.children.length).toBe(0);
  });

  it('renders a mixed array of valid and falsy children, skipping the falsy ones', () => {
    const root = renderGrid({
      children: [
        <span key="a">a</span>,
        null,
        false,
        <span key="b">b</span>,
        undefined,
      ],
    });

    // Only the two real <span> elements render.
    expect(root.children.length).toBe(2);
    expect(root.textContent).toBe('ab');
  });

  it('renders a large number of children (stress / many rooms)', () => {
    const many = Array.from({ length: 250 }, (_, i) => (
      <div key={i} data-room={i}>
        {i}
      </div>
    ));
    const root = renderGrid({ children: many });
    expect(root.children.length).toBe(250);
    expect(root.querySelector('[data-room="0"]')).not.toBeNull();
    expect(root.querySelector('[data-room="249"]')).not.toBeNull();
  });

  it('renders deeply nested children intact', () => {
    const root = renderGrid({
      children: (
        <div data-testid="outer">
          <div data-testid="inner">
            <span>deep</span>
          </div>
        </div>
      ),
    });

    expect(root.querySelector('[data-testid="outer"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="inner"]')).not.toBeNull();
    expect(root.textContent).toBe('deep');
  });
});

describe('ResponsiveRoomGrid — stability / determinism', () => {
  it('produces identical class output across repeated renders', () => {
    const a = renderGrid({ children: <span />, className: 'extra' });
    const b = renderGrid({ children: <span />, className: 'extra' });
    expect(a.getAttribute('class')).toBe(b.getAttribute('class'));
  });

  it('does not forward unknown props (only children/className are honored)', () => {
    const root = renderGrid({
      children: <span />,
      // @ts-expect-error — intentionally passing an unsupported prop
      'data-unknown': 'should-not-appear',
    });
    // The component does not spread props, so arbitrary attributes are dropped.
    expect(root.getAttribute('data-unknown')).toBeNull();
  });

  it('does not set an inline style attribute', () => {
    const root = renderGrid({ children: <span /> });
    expect(root.getAttribute('style')).toBeNull();
  });
});
