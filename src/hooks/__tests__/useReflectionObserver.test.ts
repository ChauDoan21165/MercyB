import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReflectionObserver } from '@/hooks/useReflectionObserver';

// Minimal IntersectionObserver mock
type IOCallback = (entries: IntersectionObserverEntry[]) => void;

let lastObserverCallback: IOCallback | null = null;
let observedEl: Element | null = null;

const mockObserve = vi.fn((el: Element) => { observedEl = el; });
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIO {
  constructor(cb: IOCallback) {
    lastObserverCallback = cb;
  }
  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
}

beforeEach(() => {
  lastObserverCallback = null;
  observedEl = null;
  mockObserve.mockClear();
  mockUnobserve.mockClear();
  mockDisconnect.mockClear();
  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: MockIO,
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

describe('useReflectionObserver', () => {
  it('returns a setRef callback and a reset function', () => {
    const onVisible = vi.fn();
    const { result } = renderHook(() => useReflectionObserver({ onVisible }));
    expect(typeof result.current.ref).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('observes element when ref is set', () => {
    const onVisible = vi.fn();
    const { result } = renderHook(() => useReflectionObserver({ onVisible }));
    const el = document.createElement('div');
    act(() => {
      result.current.ref(el);
    });
    expect(mockObserve).toHaveBeenCalledWith(el);
  });

  it('calls onVisible when element becomes visible', () => {
    const onVisible = vi.fn();
    const { result } = renderHook(() => useReflectionObserver({ onVisible }));
    const el = document.createElement('div');
    act(() => {
      result.current.ref(el);
    });
    act(() => {
      lastObserverCallback?.([fakeEntry(true)]);
    });
    expect(onVisible).toHaveBeenCalledTimes(1);
  });

  it('only calls onVisible once (trigger once guard)', () => {
    const onVisible = vi.fn();
    const { result } = renderHook(() => useReflectionObserver({ onVisible }));
    const el = document.createElement('div');
    act(() => { result.current.ref(el); });
    act(() => { lastObserverCallback?.([fakeEntry(true)]); });
    act(() => { lastObserverCallback?.([fakeEntry(false)]); });
    // Re-enter: call again
    act(() => { lastObserverCallback?.([fakeEntry(true)]); });
    expect(onVisible).toHaveBeenCalledTimes(1);
  });

  it('does not call onVisible when entry is not intersecting', () => {
    const onVisible = vi.fn();
    const { result } = renderHook(() => useReflectionObserver({ onVisible }));
    const el = document.createElement('div');
    act(() => { result.current.ref(el); });
    act(() => { lastObserverCallback?.([fakeEntry(false)]); });
    expect(onVisible).not.toHaveBeenCalled();
  });

  it('reset allows onVisible to be called again', () => {
    const onVisible = vi.fn();
    const { result } = renderHook(() => useReflectionObserver({ onVisible }));
    const el = document.createElement('div');
    act(() => { result.current.ref(el); });
    act(() => { lastObserverCallback?.([fakeEntry(true)]); });
    expect(onVisible).toHaveBeenCalledTimes(1);
    act(() => { result.current.reset(); });
    act(() => { lastObserverCallback?.([fakeEntry(true)]); });
    expect(onVisible).toHaveBeenCalledTimes(2);
  });

  it('disconnects observer on unmount', () => {
    const onVisible = vi.fn();
    const { result, unmount } = renderHook(() => useReflectionObserver({ onVisible }));
    const el = document.createElement('div');
    act(() => { result.current.ref(el); });
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
