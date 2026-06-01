import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update value before delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );
    rerender({ value: 'second' });
    // Before timer fires
    expect(result.current).toBe('first');
  });

  it('updates value after delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );
    rerender({ value: 'second' });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('second');
  });

  it('debounces multiple rapid changes — only last value is committed', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );
    rerender({ value: 'b' });
    rerender({ value: 'c' });
    rerender({ value: 'd' });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('d');
  });

  it('uses default delay of 300ms when delay not provided', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value),
      { initialProps: { value: 'x' } }
    );
    rerender({ value: 'y' });
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('x');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('y');
  });

  it('works with number values', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useDebounce(value, 200),
      { initialProps: { value: 0 } }
    );
    rerender({ value: 42 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe(42);
  });

  it('clears timeout on unmount without calling setState', () => {
    const { rerender, unmount } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'start' } }
    );
    rerender({ value: 'end' });
    unmount();
    // Advancing timers should not throw after unmount
    act(() => {
      vi.advanceTimersByTime(300);
    });
  });
});
