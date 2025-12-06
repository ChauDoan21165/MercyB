/**
 * Room Hooks Layer
 * 
 * React hooks for accessing room data with caching and memoization.
 * Uses roomRegistry as the single source of truth.
 */

import { useState, useEffect, useMemo } from 'react';
import {
  getAllRooms,
  getRoomById,
  getRoomsByTier,
  getRoomsByDomain,
  getTotalRoomCount,
  getRoomCountsByTier,
  getRoomCountsByDomain,
  type RoomMeta,
} from '@/lib/rooms/roomRegistry';
import type { TierId } from '@/lib/constants/tiers';
import type { DomainCategory } from '@/lib/mercy-host/domainMap';

/**
 * Hook return type for room queries
 */
interface UseRoomsResult {
  rooms: RoomMeta[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to get all rooms
 * Loads once and caches in registry
 */
export function useAllRooms(): UseRoomsResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [rooms, setRooms] = useState<RoomMeta[]>([]);

  useEffect(() => {
    try {
      const allRooms = getAllRooms();
      setRooms(allRooms);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load rooms'));
      setLoading(false);
    }
  }, []);

  return { rooms, loading, error };
}

/**
 * Hook to get rooms for a specific tier
 */
export function useTierRooms(tierId: TierId): UseRoomsResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [rooms, setRooms] = useState<RoomMeta[]>([]);

  useEffect(() => {
    try {
      const tierRooms = getRoomsByTier(tierId);
      setRooms(tierRooms);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to load rooms for tier ${tierId}`));
      setLoading(false);
    }
  }, [tierId]);

  return { rooms, loading, error };
}

/**
 * Hook to get rooms for a specific domain
 */
export function useDomainRooms(domain: DomainCategory): UseRoomsResult {
  const { rooms: allRooms, loading, error } = useAllRooms();
  
  const rooms = useMemo(() => 
    allRooms.filter(r => r.domain === domain),
    [allRooms, domain]
  );

  return { rooms, loading, error };
}

/**
 * Hook to get a single room by ID
 */
export function useRoomById(roomId: string): {
  room: RoomMeta | undefined;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [room, setRoom] = useState<RoomMeta | undefined>(undefined);

  useEffect(() => {
    try {
      const foundRoom = getRoomById(roomId);
      setRoom(foundRoom);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to load room ${roomId}`));
      setLoading(false);
    }
  }, [roomId]);

  return { room, loading, error };
}

/**
 * Hook to get room statistics
 */
export function useRoomStats(): {
  totalCount: number;
  countsByTier: Record<TierId, number>;
  countsByDomain: Record<DomainCategory, number>;
  loading: boolean;
} {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCount: 0,
    countsByTier: {} as Record<TierId, number>,
    countsByDomain: {} as Record<DomainCategory, number>,
  });

  useEffect(() => {
    try {
      setStats({
        totalCount: getTotalRoomCount(),
        countsByTier: getRoomCountsByTier(),
        countsByDomain: getRoomCountsByDomain(),
      });
      setLoading(false);
    } catch (err) {
      console.error('Failed to load room stats:', err);
      setLoading(false);
    }
  }, []);

  return { ...stats, loading };
}

/**
 * Hook for filtered room search with debounce support
 * This is a convenience hook that combines useAllRooms with local filtering
 */
export function useFilteredRooms(filter: {
  tier?: TierId;
  domain?: DomainCategory;
  searchQuery?: string;
}): UseRoomsResult {
  const { rooms: allRooms, loading, error } = useAllRooms();
  
  const rooms = useMemo(() => {
    let filtered = allRooms;
    
    if (filter.tier) {
      filtered = filtered.filter(r => r.tier === filter.tier);
    }
    
    if (filter.domain) {
      filtered = filtered.filter(r => r.domain === filter.domain);
    }
    
    if (filter.searchQuery?.trim()) {
      const query = filter.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(r => 
        r.title_en.toLowerCase().includes(query) ||
        r.title_vi.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [allRooms, filter.tier, filter.domain, filter.searchQuery]);

  return { rooms, loading, error };
}
