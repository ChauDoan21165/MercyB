import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

// Mock pointsService — factory only, no top-level vars
vi.mock('@/services/pointsService', () => ({
  isSupabaseSyncDisabled: vi.fn(() => false),
  disableSupabaseSync: vi.fn(),
}));

// Mock AuthProvider
vi.mock('@/providers/AuthProvider', () => ({
  useAuth: vi.fn(() => ({ user: { id: 'user-123' } })),
}));

// Shared mutable mock state for Supabase chain
const supabaseMockState = {
  maybeSingleResult: { data: { total_points: 150 }, error: null } as {
    data: { total_points: number } | null;
    error: null | Error;
  },
  rpcResult: { error: null } as { error: null | Error },
};

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(() => Promise.resolve(supabaseMockState.maybeSingleResult)),
    })),
    rpc: vi.fn(() => Promise.resolve(supabaseMockState.rpcResult)),
  },
}));

import { usePoints } from '@/hooks/usePoints';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabaseClient';

describe('usePoints', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-123' } } as ReturnType<typeof useAuth>);
    supabaseMockState.maybeSingleResult = { data: { total_points: 150 }, error: null };
    supabaseMockState.rpcResult = { error: null };
  });

  it('initialises with totalPoints=0', () => {
    const { result } = renderHook(() => usePoints());
    expect(result.current.totalPoints).toBe(0);
  });

  it('fetches points and sets totalPoints from Supabase', async () => {
    const { result } = renderHook(() => usePoints());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.totalPoints).toBe(150);
  });

  it('defaults totalPoints to 0 when Supabase returns no data', async () => {
    supabaseMockState.maybeSingleResult = { data: null, error: null };
    const { result } = renderHook(() => usePoints());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.totalPoints).toBe(0);
  });

  it('sets isLoading=false when user is null (no fetch)', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: null } as ReturnType<typeof useAuth>);
    const { result } = renderHook(() => usePoints());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.totalPoints).toBe(0);
  });

  it('exposes refreshPoints and awardPoints functions', async () => {
    const { result } = renderHook(() => usePoints());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(typeof result.current.refreshPoints).toBe('function');
    expect(typeof result.current.awardPoints).toBe('function');
  });

  it('awardPoints calls supabase.rpc with correct arguments', async () => {
    const { result } = renderHook(() => usePoints());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.awardPoints(10, 'room_complete', 'Completed room');
    });
    expect(vi.mocked(supabase.rpc)).toHaveBeenCalledWith('award_points', expect.objectContaining({
      _user_id: 'user-123',
      _points: 10,
      _transaction_type: 'room_complete',
    }));
  });

  it('refreshPoints re-fetches from Supabase', async () => {
    const { result } = renderHook(() => usePoints());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const fromSpy = vi.mocked(supabase.from);
    const callsBefore = fromSpy.mock.calls.length;
    await act(async () => {
      await result.current.refreshPoints();
    });
    expect(fromSpy.mock.calls.length).toBeGreaterThan(callsBefore);
  });
});
