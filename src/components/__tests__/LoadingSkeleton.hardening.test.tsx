import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import {
  RoomCardSkeleton,
  RoomGridSkeleton,
  ChatMessageSkeleton,
  ChatHubSkeleton,
  AudioPlayerSkeleton,
  TableSkeleton,
} from '@/components/LoadingSkeleton';

/**
 * Hardening tests for LoadingSkeleton.tsx — a collection of pure, dependency-free
 * presentational skeleton components. There are no external dependencies (no
 * supabase, fetch, audio resolver) to mock; every export is a deterministic
 * function of its props. We assert structural invariants: count math, skeleton
 * placeholder presence, the `animate-pulse` class contract from the underlying
 * <Skeleton/>, and graceful handling of edge-case prop values.
 */

afterEach(() => cleanup());

// The shared <Skeleton/> primitive always renders a <div> carrying these classes
// (see src/components/ui/skeleton.tsx). Counting them is the most reliable way to
// count skeleton placeholders regardless of nesting.
const PULSE = 'animate-pulse';
const skeletons = (root: HTMLElement) =>
  Array.from(root.querySelectorAll(`.${PULSE}`));

describe('LoadingSkeleton — exports', () => {
  it('exports every skeleton component as a function', () => {
    expect(typeof RoomCardSkeleton).toBe('function');
    expect(typeof RoomGridSkeleton).toBe('function');
    expect(typeof ChatMessageSkeleton).toBe('function');
    expect(typeof ChatHubSkeleton).toBe('function');
    expect(typeof AudioPlayerSkeleton).toBe('function');
    expect(typeof TableSkeleton).toBe('function');
  });
});

describe('RoomCardSkeleton', () => {
  it('renders a single bordered card containing exactly 5 skeleton bars', () => {
    const { container } = render(<RoomCardSkeleton />);
    // 3 text lines + 2 button placeholders
    expect(skeletons(container)).toHaveLength(5);
  });

  it('every placeholder carries the animate-pulse + bg-muted contract classes', () => {
    const { container } = render(<RoomCardSkeleton />);
    for (const el of skeletons(container)) {
      expect(el.className).toContain('animate-pulse');
      expect(el.className).toContain('bg-muted');
    }
  });

  it('renders deterministically (same markup across two renders)', () => {
    const a = render(<RoomCardSkeleton />).container.innerHTML;
    cleanup();
    const b = render(<RoomCardSkeleton />).container.innerHTML;
    expect(a).toBe(b);
  });
});

describe('RoomGridSkeleton', () => {
  it('defaults to 12 cards (12 × 5 = 60 skeleton bars) when count is omitted', () => {
    const { container } = render(<RoomGridSkeleton />);
    expect(skeletons(container)).toHaveLength(12 * 5);
  });

  it('renders the requested number of cards', () => {
    const { container } = render(<RoomGridSkeleton count={3} />);
    expect(skeletons(container)).toHaveLength(3 * 5);
  });

  it('renders nothing card-like when count is 0', () => {
    const { container } = render(<RoomGridSkeleton count={0} />);
    expect(skeletons(container)).toHaveLength(0);
    // The grid wrapper itself still renders.
    expect(container.querySelector('.grid')).not.toBeNull();
  });

  it('handles a large count without error', () => {
    const { container } = render(<RoomGridSkeleton count={50} />);
    expect(skeletons(container)).toHaveLength(50 * 5);
  });

  it('treats an explicit undefined count as the default of 12', () => {
    const { container } = render(<RoomGridSkeleton count={undefined} />);
    expect(skeletons(container)).toHaveLength(12 * 5);
  });

  it('produces no skeletons for a negative count (Array.from length clamps to 0)', () => {
    // Array.from({ length: -1 }) yields an empty array — must not throw.
    const { container } = render(<RoomGridSkeleton count={-1} />);
    expect(skeletons(container)).toHaveLength(0);
  });
});

describe('ChatMessageSkeleton', () => {
  it('renders a name line, 3 body lines, and a timestamp = 5 skeleton bars', () => {
    const { container } = render(<ChatMessageSkeleton />);
    expect(skeletons(container)).toHaveLength(5);
  });

  it('includes the muted message bubble wrapper', () => {
    const { container } = render(<ChatMessageSkeleton />);
    expect(container.querySelector('.bg-muted.rounded-2xl')).not.toBeNull();
  });
});

describe('ChatHubSkeleton', () => {
  it('renders header (2) + 3 message skeletons (3 × 5) + input (1) = 18 bars', () => {
    const { container } = render(<ChatHubSkeleton />);
    expect(skeletons(container)).toHaveLength(2 + 3 * 5 + 1);
  });

  it('renders a full-screen background wrapper and a fixed input bar', () => {
    const { container } = render(<ChatHubSkeleton />);
    expect(container.querySelector('.min-h-screen')).not.toBeNull();
    expect(container.querySelector('.fixed.bottom-0')).not.toBeNull();
  });
});

describe('AudioPlayerSkeleton', () => {
  it('renders avatar + title + progress + two time labels = 5 skeleton bars', () => {
    const { container } = render(<AudioPlayerSkeleton />);
    expect(skeletons(container)).toHaveLength(5);
  });

  it('includes a rounded-full avatar placeholder', () => {
    const { container } = render(<AudioPlayerSkeleton />);
    expect(container.querySelector('.rounded-full')).not.toBeNull();
  });
});

describe('TableSkeleton', () => {
  it('defaults to 5 rows × 4 cols: header(4) + body(5×4) = 24 bars', () => {
    const { container } = render(<TableSkeleton />);
    expect(skeletons(container)).toHaveLength(4 + 5 * 4);
  });

  it('honors custom rows and cols', () => {
    const { container } = render(<TableSkeleton rows={2} cols={3} />);
    // header(3) + body(2×3)
    expect(skeletons(container)).toHaveLength(3 + 2 * 3);
  });

  it('renders only the header row when rows is 0', () => {
    const { container } = render(<TableSkeleton rows={0} cols={4} />);
    expect(skeletons(container)).toHaveLength(4);
  });

  it('renders no skeletons at all when cols is 0', () => {
    // header has 0 cells AND each of the rows has 0 cells.
    const { container } = render(<TableSkeleton rows={5} cols={0} />);
    expect(skeletons(container)).toHaveLength(0);
  });

  it('handles both rows and cols being 0 without throwing', () => {
    const { container } = render(<TableSkeleton rows={0} cols={0} />);
    expect(skeletons(container)).toHaveLength(0);
  });

  it('handles explicit undefined props by falling back to defaults', () => {
    const { container } = render(
      <TableSkeleton rows={undefined} cols={undefined} />,
    );
    expect(skeletons(container)).toHaveLength(4 + 5 * 4);
  });

  it('does not throw on negative row/col counts (length clamps to 0)', () => {
    const { container } = render(<TableSkeleton rows={-3} cols={-2} />);
    expect(skeletons(container)).toHaveLength(0);
  });
});
