/**
 * MercyBlade Blue — useFavoriteRooms (SAFE JSON)
 * Path: src/hooks/useFavoriteRooms.tsx
 * Version: MB-BLUE-94.14.20 — 2025-12-25 (+0700)
 *
 * GOAL:
 * - Never crash due to corrupted localStorage
 * - JSON.parse MUST be guarded
 * - Fail-safe fallback to empty array
 */

import { useEffect, useState } from "react";

const STORAGE_KEY = "mb_favorite_rooms";

export function useFavoriteRooms() {
  const [favoriteRooms, setFavoriteRooms] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      // nothing saved yet
      setFavoriteRooms([]);
      return;
    }

    try {
      const parsed = JSON.parse(saved);

      // Extra safety: must be array
      if (Array.isArray(parsed)) {
        setFavoriteRooms(parsed);
      } else {
        console.warn("[useFavoriteRooms] invalid data shape, resetting");
        setFavoriteRooms([]);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn("[useFavoriteRooms] JSON parse failed, clearing storage", err);
      setFavoriteRooms([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const toggleFavorite = (roomId: string) => {
    setFavoriteRooms((prev) => {
      const next = prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // fail silently — never block UI
      }

      return next;
    });
  };

  const isFavorite = (roomId: string) => favoriteRooms.includes(roomId);

  return {
    favoriteRooms,
    toggleFavorite,
    isFavorite,
  };
}
