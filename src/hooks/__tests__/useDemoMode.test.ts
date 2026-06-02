import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

// Mock supabaseClient with full auth API
let onAuthStateChangeCb: ((event: string, session: unknown) => void) | null = null;

const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn((cb: (event: string, session: unknown) => void) => {
  onAuthStateChangeCb = cb;
  return { data: { subscription: { unsubscribe: vi.fn() } } };
});

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      onAuthStateChange: (cb: (event: string, session: unknown) => void) =>
        mockOnAuthStateChange(cb),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    }),
  },
}));

vi.mock('@/lib/constants/rooms', () => ({
  ROOMS_TABLE: 'rooms',
}));

import { useDemoMode } from '@/hooks/useDemoMode';

describe('useDemoMode', () => {
  beforeEach(() => {
    onAuthStateChangeCb = null;
    mockGetSession.mockResolvedValue({ data: { session: null } });
  });

  it('starts with loading=true', () => {
    const { result } = renderHook(() => useDemoMode());
    expect(result.current.loading).toBe(true);
  });

  it('sets isDemoMode=true and isAuthenticated=false when no session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const { result } = renderHook(() => useDemoMode());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.isDemoMode).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('sets isDemoMode=false and isAuthenticated=true when session exists', async () => {
    const fakeSession = { user: { id: 'user-1' } };
    mockGetSession.mockResolvedValue({ data: { session: fakeSession } });
    const { result } = renderHook(() => useDemoMode());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.isDemoMode).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('sets isDemoMode=true on getSession error', async () => {
    mockGetSession.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() => useDemoMode());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.isDemoMode).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('updates state when auth state changes to signed in', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const { result } = renderHook(() => useDemoMode());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    // Simulate sign-in event
    const fakeSession = { user: { id: 'user-2' } };
    await vi.waitFor(() => onAuthStateChangeCb !== null);
    act(() => {
      onAuthStateChangeCb?.('SIGNED_IN', fakeSession);
    });
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isDemoMode).toBe(false);
    });
  });
});
