import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock logger to avoid Supabase pulls
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { useNetworkStatus } from '@/hooks/useNetworkStatus';

describe('useNetworkStatus', () => {
  beforeEach(() => {
    // Default: online
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      writable: true,
      value: true,
    });
  });

  it('returns isOnline=true when navigator.onLine is true', () => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, writable: true, value: true });
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(true);
  });

  it('returns isOnline=false when navigator.onLine is false', () => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, writable: true, value: false });
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(false);
  });

  it('updates isOnline to false when offline event fires', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(true);
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.isOnline).toBe(false);
  });

  it('updates isOnline to true when online event fires after going offline', () => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, writable: true, value: false });
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(false);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.isOnline).toBe(true);
  });

  it('returns isSlowConnection=false by default (no navigator.connection)', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isSlowConnection).toBe(false);
  });

  it('removes event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useNetworkStatus());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });
});
