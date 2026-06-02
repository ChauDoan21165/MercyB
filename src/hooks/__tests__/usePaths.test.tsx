import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock AuthProvider
vi.mock('@/providers/AuthProvider', () => ({
  useAuth: vi.fn(() => ({ user: { id: 'user-1' } })),
}));

// Mock paths service
const mockGetAllPaths = vi.fn();
const mockGetPathBySlug = vi.fn();
const mockGetPathDays = vi.fn();
const mockGetPathsWithProgress = vi.fn();
const mockGetUserProgress = vi.fn();
const mockGetAllUserProgress = vi.fn();
const mockStartPath = vi.fn();
const mockCompleteDay = vi.fn();
const mockResetPath = vi.fn();

vi.mock('@/services/paths', () => ({
  getAllPaths: (...args: unknown[]) => mockGetAllPaths(...args),
  getPathBySlug: (...args: unknown[]) => mockGetPathBySlug(...args),
  getPathDays: (...args: unknown[]) => mockGetPathDays(...args),
  getPathsWithProgress: (...args: unknown[]) => mockGetPathsWithProgress(...args),
  getUserProgress: (...args: unknown[]) => mockGetUserProgress(...args),
  getAllUserProgress: (...args: unknown[]) => mockGetAllUserProgress(...args),
  startPath: (...args: unknown[]) => mockStartPath(...args),
  completeDay: (...args: unknown[]) => mockCompleteDay(...args),
  resetPath: (...args: unknown[]) => mockResetPath(...args),
}));

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
}

import { usePaths, usePath, usePathsWithProgress } from '@/hooks/usePaths';
import { useAuth } from '@/providers/AuthProvider';

const fakePath = {
  id: 'path-1',
  slug: 'beginner',
  title: 'Beginner Path',
  description: 'Start here',
  level: 'A1',
  total_days: 30,
  created_at: '2026-01-01T00:00:00Z',
};

describe('usePaths', () => {
  beforeEach(() => {
    mockGetAllPaths.mockResolvedValue([fakePath]);
    mockGetPathBySlug.mockResolvedValue(fakePath);
    mockGetPathsWithProgress.mockResolvedValue([]);
  });

  it('returns data from getAllPaths', async () => {
    const { result } = renderHook(() => usePaths(), { wrapper: makeWrapper() });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual([fakePath]);
  });

  it('starts with isLoading=true', () => {
    mockGetAllPaths.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => usePaths(), { wrapper: makeWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('usePath is disabled when slug is undefined', async () => {
    const { result } = renderHook(() => usePath(undefined), { wrapper: makeWrapper() });
    // Should not call service with undefined slug
    expect(result.current.isPending).toBe(true);
    expect(mockGetPathBySlug).not.toHaveBeenCalled();
  });

  it('usePath fetches by slug when provided', async () => {
    const { result } = renderHook(() => usePath('beginner'), { wrapper: makeWrapper() });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(fakePath);
    expect(mockGetPathBySlug).toHaveBeenCalledWith('beginner');
  });

  it('usePathsWithProgress calls service with userId', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } } as ReturnType<typeof useAuth>);
    const { result } = renderHook(() => usePathsWithProgress(), { wrapper: makeWrapper() });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(mockGetPathsWithProgress).toHaveBeenCalledWith('user-1');
  });

  it('usePathsWithProgress passes null userId when no user', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: null } as ReturnType<typeof useAuth>);
    const { result } = renderHook(() => usePathsWithProgress(), { wrapper: makeWrapper() });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(mockGetPathsWithProgress).toHaveBeenCalledWith(null);
  });
});
