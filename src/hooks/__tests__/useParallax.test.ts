import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRef } from 'react';
import { useParallax } from '@/hooks/useParallax';

describe('useParallax', () => {
  beforeEach(() => {
    // Set a stable window.innerHeight
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 768,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 0 initially', () => {
    const el = document.createElement('div');
    const { result } = renderHook(() => {
      const ref = useRef(el);
      return useParallax(ref, 0.5);
    });
    expect(result.current).toBe(0);
  });

  it('computes a negative offset when element is in viewport', () => {
    const el = document.createElement('div');
    // getBoundingClientRect: elementTop = 200, height = 300, windowHeight = 768
    // scrolled = 768 - 200 = 568; parallaxOffset = -(568 * 0.5) = -284
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 200,
      height: 300,
      bottom: 500,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    const { result } = renderHook(() => {
      const ref = useRef(el);
      return useParallax(ref, 0.5);
    });
    // After mount, handleScroll is called immediately
    expect(result.current).toBe(-(768 - 200) * 0.5);
  });

  it('does not update when element is out of viewport (above)', () => {
    const el = document.createElement('div');
    // elementTop > windowHeight means not in viewport
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 900,
      height: 100,
      bottom: 1000,
      left: 0, right: 0, width: 0, x: 0, y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    const { result } = renderHook(() => {
      const ref = useRef(el);
      return useParallax(ref, 0.5);
    });
    expect(result.current).toBe(0);
  });

  it('updates offset on scroll events', () => {
    const el = document.createElement('div');
    const getBCRMock = vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 400,
      height: 200,
      bottom: 600,
      left: 0, right: 0, width: 0, x: 0, y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    const { result } = renderHook(() => {
      const ref = useRef(el);
      return useParallax(ref, 0.5);
    });

    const initialOffset = result.current;

    // Simulate scroll by changing getBCR return
    getBCRMock.mockReturnValue({
      top: 100,
      height: 200,
      bottom: 300,
      left: 0, right: 0, width: 0, x: 0, y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).not.toBe(initialOffset);
    expect(result.current).toBe(-(768 - 100) * 0.5);
  });

  it('removes scroll listener on unmount', () => {
    const el = document.createElement('div');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => {
      const ref = useRef(el);
      return useParallax(ref, 0.5);
    });
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
