import { useState, useEffect, useCallback, useMemo } from 'react';

export type WarmthCategory =
  | 'firstImpression'
  | 'roomEntry'
  | 'audioStart'
  | 'afterAudio'
  | 'reflectionIntro'
  | 'reflectionThanks'
  | 'returnAfterGap';

export type WarmthLine = { en: string; vi: string };

type WarmthLinesData = Record<WarmthCategory, { en: string[]; vi: string[] }>;

const STORAGE_KEYS = {
  FIRST_IMPRESSION: 'mb_first_impression_shown',
  ROOMS_VISITED: 'mb_rooms_visited',
  LAST_ACTIVE: 'mb_last_active_at',
  COMPANION_ENABLED: 'mb_companion_enabled',
};

let warmthLinesCache: WarmthLinesData | null = null;

export function useWarmthEngine(roomId?: string) {
  const [warmthLines, setWarmthLines] = useState<WarmthLinesData | null>(warmthLinesCache);
  const [isLoading, setIsLoading] = useState(!warmthLinesCache);

  useEffect(() => {
    if (warmthLinesCache) {
      setWarmthLines(warmthLinesCache);
      setIsLoading(false);
      return;
    }

    const loadWarmthLines = async () => {
      try {
        const response = await fetch('/data/warmth_lines_en_vi.json');
        if (!response.ok) throw new Error('Failed to load warmth lines');
        const data = await response.json();
        warmthLinesCache = data;
        setWarmthLines(data);
      } catch (error) {
        console.error('[WarmthEngine] Failed to load warmth lines:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWarmthLines();
  }, []);

  const getRandomLine = useCallback((category: WarmthCategory): WarmthLine | null => {
    if (!warmthLines || !warmthLines[category]) return null;

    const enLines = warmthLines[category].en;
    const viLines = warmthLines[category].vi;

    if (!enLines.length || !viLines.length) return null;

    const randomIndex = Math.floor(Math.random() * Math.min(enLines.length, viLines.length));
    return {
      en: enLines[randomIndex],
      vi: viLines[randomIndex],
    };
  }, [warmthLines]);

  const shouldShowFirstImpression = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    const shown = localStorage.getItem(STORAGE_KEYS.FIRST_IMPRESSION);
    return shown !== 'true';
  }, []);

  const markFirstImpressionShown = useCallback((): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FIRST_IMPRESSION, 'true');
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString());
  }, []);

  const getVisitedRooms = useCallback((): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROOMS_VISITED);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  }, []);

  const shouldShowRoomEntry = useCallback((): boolean => {
    if (!roomId) return false;
    const visited = getVisitedRooms();
    return !visited.has(roomId);
  }, [roomId, getVisitedRooms]);

  const markRoomVisited = useCallback((id: string): void => {
    if (typeof window === 'undefined') return;
    const visited = getVisitedRooms();
    visited.add(id);
    localStorage.setItem(STORAGE_KEYS.ROOMS_VISITED, JSON.stringify([...visited]));
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString());
  }, [getVisitedRooms]);

  const getLastActiveAt = useCallback((): number | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
    return stored ? parseInt(stored, 10) : null;
  }, []);

  const getGapDuration = useCallback((): 'none' | 'short' | 'long' => {
    const lastActive = getLastActiveAt();
    if (!lastActive) return 'none';

    const now = Date.now();
    const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60);

    if (hoursSinceActive > 168) return 'long'; // > 7 days
    if (hoursSinceActive > 24) return 'short'; // > 24 hours
    return 'none';
  }, [getLastActiveAt]);

  const isCompanionEnabled = useCallback((): boolean => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(STORAGE_KEYS.COMPANION_ENABLED);
    return stored !== 'false';
  }, []);

  const setCompanionEnabled = useCallback((enabled: boolean): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.COMPANION_ENABLED, enabled.toString());
  }, []);

  return useMemo(() => ({
    isLoading,
    getRandomLine,
    shouldShowFirstImpression,
    shouldShowRoomEntry,
    markFirstImpressionShown,
    markRoomVisited,
    getLastActiveAt,
    getGapDuration,
    isCompanionEnabled,
    setCompanionEnabled,
  }), [
    isLoading,
    getRandomLine,
    shouldShowFirstImpression,
    shouldShowRoomEntry,
    markFirstImpressionShown,
    markRoomVisited,
    getLastActiveAt,
    getGapDuration,
    isCompanionEnabled,
    setCompanionEnabled,
  ]);
}
