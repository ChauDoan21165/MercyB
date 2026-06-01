import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock the offline detector so we control the subscription behaviour
const mockIsOnline = vi.fn(() => true);
let storedCallback: ((online: boolean) => void) | null = null;

vi.mock('@/lib/offline/offlineDetector', () => ({
  isOnline: () => mockIsOnline(),
  subscribeOnlineStatus: vi.fn((cb: (online: boolean) => void) => {
    // Immediately call with current value, then store for manual control
    cb(mockIsOnline());
    storedCallback = cb;
    return () => {
      storedCallback = null;
    };
  }),
}));

import { useOnlineStatus } from '@/hooks/useOnlineStatus';

describe('useOnlineStatus', () => {
  beforeEach(() => {
    mockIsOnline.mockReturnValue(true);
    storedCallback = null;
  });

  it('returns isOnline=true when device is online', () => {
    mockIsOnline.mockReturnValue(true);
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(true);
  });

  it('returns isOnline=false when device is offline', () => {
    mockIsOnline.mockReturnValue(false);
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(false);
  });

  it('updates to false when subscription notifies offline', () => {
    mockIsOnline.mockReturnValue(true);
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(true);
    act(() => {
      storedCallback?.(false);
    });
    expect(result.current.isOnline).toBe(false);
  });

  it('updates to true when subscription notifies online after offline', () => {
    mockIsOnline.mockReturnValue(false);
    const { result } = renderHook(() => useOnlineStatus());
    act(() => {
      storedCallback?.(true);
    });
    expect(result.current.isOnline).toBe(true);
  });

  it('cleans up subscription on unmount', async () => {
    const { unmount } = renderHook(() => useOnlineStatus());
    unmount();
    // storedCallback cleared by the unsubscribe fn returned from mock
    expect(storedCallback).toBeNull();
  });
});
