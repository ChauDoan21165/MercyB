import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

// Mock AuthProvider
vi.mock('@/providers/AuthProvider', () => ({
  useAuth: vi.fn(() => ({ user: { id: 'user-abc' }, isLoading: false })),
}));

// Mock authService
vi.mock('@/lib/authService', () => ({
  fetchCurrentEntitlement: vi.fn().mockResolvedValue(null),
}));

// Shared mutable Supabase mock state
const supabaseMockState = {
  promoResult: { data: null },
  quotaResult: { data: null },
  upsertError: null as null | Error,
};

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn(() => Promise.resolve(supabaseMockState.quotaResult)),
        maybeSingle: vi.fn(() => {
          if (table === 'user_promo_redemptions') return Promise.resolve(supabaseMockState.promoResult);
          return Promise.resolve(supabaseMockState.quotaResult);
        }),
        upsert: vi.fn(() => Promise.resolve({ error: supabaseMockState.upsertError })),
        update: vi.fn().mockReturnThis(),
      };
      return chain;
    }),
  },
}));

import { useCredits } from '@/hooks/useCredits';
import { useAuth } from '@/providers/AuthProvider';
import { fetchCurrentEntitlement } from '@/lib/authService';

describe('useCredits', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-abc' },
      isLoading: false,
    } as ReturnType<typeof useAuth>);
    vi.mocked(fetchCurrentEntitlement).mockResolvedValue(null);
    supabaseMockState.promoResult = { data: null };
    supabaseMockState.quotaResult = { data: null };
    supabaseMockState.upsertError = null;
  });

  it('starts with loading=true', () => {
    const { result } = renderHook(() => useCredits());
    expect(result.current.loading).toBe(true);
  });

  it('resolves to default credit info when no promo and no quota', async () => {
    const { result } = renderHook(() => useCredits());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.creditInfo.questionsUsed).toBe(0);
    expect(result.current.creditInfo.questionsLimit).toBe(10);
    expect(result.current.creditInfo.hasPromoCode).toBe(false);
    expect(result.current.creditInfo.isUnlimited).toBe(false);
  });

  it('sets isUnlimited=true for premium user', async () => {
    vi.mocked(fetchCurrentEntitlement).mockResolvedValue({
      is_premium: true,
      status: 'active',
    } as Awaited<ReturnType<typeof fetchCurrentEntitlement>>);
    const { result } = renderHook(() => useCredits());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.creditInfo.isUnlimited).toBe(true);
  });

  it('sets loading=false with defaults when user is null', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
    } as ReturnType<typeof useAuth>);
    const { result } = renderHook(() => useCredits());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.creditInfo.questionsLimit).toBe(10);
  });

  it('stays loading while auth is loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
    } as ReturnType<typeof useAuth>);
    const { result } = renderHook(() => useCredits());
    expect(result.current.loading).toBe(true);
  });

  it('exposes hasCreditsRemaining, incrementUsage, refreshCredits functions', async () => {
    const { result } = renderHook(() => useCredits());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.hasCreditsRemaining).toBe('function');
    expect(typeof result.current.incrementUsage).toBe('function');
    expect(typeof result.current.refreshCredits).toBe('function');
  });

  it('hasCreditsRemaining returns true when questionsUsed < questionsLimit', async () => {
    supabaseMockState.quotaResult = { data: { questions_used: 3 } };
    const { result } = renderHook(() => useCredits());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasCreditsRemaining()).toBe(true);
  });

  it('hasCreditsRemaining returns true when unlimited', async () => {
    vi.mocked(fetchCurrentEntitlement).mockResolvedValue({
      is_premium: true,
      status: 'active',
    } as Awaited<ReturnType<typeof fetchCurrentEntitlement>>);
    const { result } = renderHook(() => useCredits());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasCreditsRemaining()).toBe(true);
  });

  it('increments questionsUsed after incrementUsage', async () => {
    supabaseMockState.quotaResult = { data: { questions_used: 3 } };
    const { result } = renderHook(() => useCredits());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const usedBefore = result.current.creditInfo.questionsUsed;
    await act(async () => {
      await result.current.incrementUsage();
    });
    expect(result.current.creditInfo.questionsUsed).toBe(usedBefore + 1);
  });
});
