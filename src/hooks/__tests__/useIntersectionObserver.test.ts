import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Minimal IntersectionObserver mock
type IOCallback = (entries: IntersectionObserverEntry[]) => void;

let lastCallback: IOCallback | null = null;
let observedElement: Element | null = null;

const mockDisconnect = vi.fn();
const mockObserve = vi.fn((el: Element) => {
  observedElement = el;
});

class MockIntersectionObserver {
  constructor(cb: IOCallback) {
    lastCallback = cb;
  }
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = vi.fn();
}

beforeEach(() => {
  lastCallback = null;
  observedElement = null;
  mockDisconnect.mockClear();
  mockObserve.mockClear();

  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: MockIntersectionObserver,
  });
});

function fakeEntry(intersecting: boolean): IntersectionObserverEntry {
  return {
    isIntersecting: intersecting,
    intersectionRatio: intersecting ? 1 : 0,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    target: document.createElement('div'),
    time: 0,
  };
}

describe('useIntersectionObserver', () => {
  it('starts as not visible', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement('div'));
      return useIntersectionObserver(ref);
    });
    expect(result.current).toBe(false);
  });

  it('becomes visible when entry.isIntersecting is true', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement('div'));
      return useIntersectionObserver(ref, { freezeOnceVisible: false });
    });
    act(() => {
      lastCallback?.([fakeEntry(true)]);
    });
    expect(result.current).toBe(true);
  });

  it('freezes once visible when freezeOnceVisible=true (default)', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement('div'));
      return useIntersectionObserver(ref, { freezeOnceVisible: true });
    });
    act(() => {
      lastCallback?.([fakeEntry(true)]);
    });
    expect(result.current).toBe(true);
    // Disconnect should have been called after freeze
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('toggles back to false when not intersecting with freezeOnceVisible=false', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement('div'));
      return useIntersectionObserver(ref, { freezeOnceVisible: false });
    });
    act(() => {
      lastCallback?.([fakeEntry(true)]);
    });
    expect(result.current).toBe(true);
    act(() => {
      lastCallback?.([fakeEntry(false)]);
    });
    expect(result.current).toBe(false);
  });

  it('calls observe on the element provided via ref', () => {
    const el = document.createElement('div');
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(el);
      return useIntersectionObserver(ref);
    });
    expect(mockObserve).toHaveBeenCalledWith(el);
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement('div'));
      return useIntersectionObserver(ref);
    });
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
