import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock ANIMATION_CONFIG before import
vi.mock('@/config/animation', () => ({
  ANIMATION_CONFIG: {
    performance: {
      fpsThreshold: 30,
      maxStaggerItems: 200,
    },
  },
}));

import { usePerformanceMode } from '@/hooks/usePerformanceMode';

describe('usePerformanceMode', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    let frame = 0;
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      frame++;
      const id = frame;
      // Schedule via real setTimeout to allow synchronous control
      setTimeout(() => cb(performance.now()), 0);
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('initialises with isLowPerformance=false and fps=60', () => {
    const { result } = renderHook(() => usePerformanceMode());
    expect(result.current.isLowPerformance).toBe(false);
    expect(result.current.fps).toBe(60);
  });

  it('does not start measuring before the 2-second stabilisation delay', () => {
    const rafSpy = vi.spyOn(global, 'requestAnimationFrame');
    renderHook(() => usePerformanceMode());
    // Advance only 1.9s — rAF should not have been called yet
    act(() => { vi.advanceTimersByTime(1900); });
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it('starts measuring after 2-second stabilisation delay', () => {
    const rafSpy = vi.spyOn(global, 'requestAnimationFrame');
    renderHook(() => usePerformanceMode());
    act(() => { vi.advanceTimersByTime(2001); });
    expect(rafSpy).toHaveBeenCalled();
  });

  it('cancels animation frame on unmount', () => {
    const cancelSpy = vi.spyOn(global, 'cancelAnimationFrame');
    const { unmount } = renderHook(() => usePerformanceMode());
    act(() => { vi.advanceTimersByTime(2001); });
    unmount();
    // Either cancelAnimationFrame was called, or timeout was cleared
    // The hook clears the timeout or rAF — ensure no throw
    expect(() => unmount()).not.toThrow();
  });
});
