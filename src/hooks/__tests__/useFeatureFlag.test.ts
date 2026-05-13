// Path: src/hooks/__tests__/useFeatureFlag.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// ── Supabase client mock ─────────────────────────────────────────────────────
// useFeatureFlag goes through `useFeatureFlagQuery` which makes two calls:
//   1. supabase.auth.getUser()             — read current user
//   2. supabase.from('feature_flags')...   — read flag row
// We mock both so tests are deterministic and offline.

const mockGetUser = vi.fn();
const mockMaybeSingle = vi.fn();

vi.mock('@/lib/supabaseClient', () => {
  return {
    supabase: {
      auth: { getUser: () => mockGetUser() },
      from: (_table: string) => ({
        select: (_cols: string) => ({
          eq: (_col: string, _val: string) => ({
            maybeSingle: () => mockMaybeSingle(),
          }),
        }),
      }),
    },
  };
});

import { useFeatureFlag } from '../useFeatureFlag';

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useFeatureFlag', () => {
  it('returns defaultValue while loading', () => {
    mockGetUser.mockReturnValue(new Promise(() => {})); // never resolves
    mockMaybeSingle.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(
      () => useFeatureFlag('my_flag', true),
      { wrapper: makeWrapper() },
    );

    expect(result.current.enabled).toBe(true);
    expect(result.current.loading).toBe(true);
  });

  it('returns false when row is missing (defaultValue = false)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const { result } = renderHook(
      () => useFeatureFlag('missing_flag', false),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.enabled).toBe(false);
  });

  it('respects the global is_enabled toggle when ON', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockMaybeSingle.mockResolvedValue({
      data: { is_enabled: true, enabled_user_ids: null },
      error: null,
    });

    const { result } = renderHook(
      () => useFeatureFlag('global_on'),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.enabled).toBe(true);
  });

  it('respects the global toggle when OFF', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockMaybeSingle.mockResolvedValue({
      data: { is_enabled: false, enabled_user_ids: [] },
      error: null,
    });

    const { result } = renderHook(
      () => useFeatureFlag('global_off'),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.enabled).toBe(false);
  });

  it('enables the flag for users in enabled_user_ids cohort even when global is OFF', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockMaybeSingle.mockResolvedValue({
      data: { is_enabled: false, enabled_user_ids: ['user-123', 'other'] },
      error: null,
    });

    const { result } = renderHook(
      () => useFeatureFlag('cohort_flag'),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.enabled).toBe(true);
  });

  it('does not enable cohort users when their id is missing from enabled_user_ids', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-not-in-cohort' } },
      error: null,
    });
    mockMaybeSingle.mockResolvedValue({
      data: { is_enabled: false, enabled_user_ids: ['someone-else'] },
      error: null,
    });

    const { result } = renderHook(
      () => useFeatureFlag('cohort_flag'),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.enabled).toBe(false);
  });

  it('returns defaultValue on supabase error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { message: 'rls denied' },
    });

    const { result } = renderHook(
      () => useFeatureFlag('errored_flag', true),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.enabled).toBe(true);
  });

  it('shares a single underlying query when two components read the same flag', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockMaybeSingle.mockResolvedValue({
      data: { is_enabled: true, enabled_user_ids: null },
      error: null,
    });

    const wrapper = makeWrapper();

    const { result: r1 } = renderHook(
      () => useFeatureFlag('shared_flag'),
      { wrapper },
    );
    const { result: r2 } = renderHook(
      () => useFeatureFlag('shared_flag'),
      { wrapper },
    );

    await waitFor(() => expect(r1.current.loading).toBe(false));
    await waitFor(() => expect(r2.current.loading).toBe(false));

    expect(r1.current.enabled).toBe(true);
    expect(r2.current.enabled).toBe(true);

    // Two consumers, but the auth.getUser() and feature_flags lookup should
    // each only fire once thanks to react-query caching.
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
  });
});
