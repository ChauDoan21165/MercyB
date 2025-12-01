/**
 * Optimized Query Hook
 * SWR/caching pattern for room data and Supabase queries
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

/**
 * Optimized room data fetching with caching
 * Deduplicates identical fetches and caches results
 */
export function useOptimizedRoomQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    cacheTime: 30 * 60 * 1000, // 30 minutes - cache persists
    refetchOnWindowFocus: false, // Don't refetch on tab focus
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    ...options,
  });
}

/**
 * Optimized list query (room grids, admin tables)
 */
export function useOptimizedListQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T[]>,
  options?: Omit<UseQueryOptions<T[]>, 'queryKey' | 'queryFn'>
) {
  return useOptimizedRoomQuery(queryKey, queryFn, {
    staleTime: 10 * 60 * 1000, // 10 minutes for lists
    ...options,
  });
}

/**
 * Prefetch utility for route preloading
 */
export async function prefetchRoom(queryClient: any, roomId: string, fetchFn: () => Promise<any>) {
  return queryClient.prefetchQuery({
    queryKey: ['room', roomId],
    queryFn: fetchFn,
    staleTime: 5 * 60 * 1000,
  });
}
