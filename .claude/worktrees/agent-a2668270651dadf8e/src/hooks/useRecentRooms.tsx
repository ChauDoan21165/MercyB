import { useState, useEffect } from 'react';

export interface RecentRoom {
  id: string;
  nameEn: string;
  nameVi: string;
  tier: string;
  visitedAt: number;
}

const STORAGE_KEY = 'recentRooms';
const MAX_RECENT_ROOMS = 5;

export const useRecentRooms = () => {
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecentRooms(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent rooms', e);
      }
    }
  }, []);

  const addRecentRoom = (room: Omit<RecentRoom, 'visitedAt'>) => {
    setRecentRooms(prev => {
      // Remove existing entry if present
      const filtered = prev.filter(r => r.id !== room.id);
      
      // Add new entry at the beginning
      const updated = [
        { ...room, visitedAt: Date.now() },
        ...filtered
      ].slice(0, MAX_RECENT_ROOMS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentRooms = () => {
    setRecentRooms([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { recentRooms, addRecentRoom, clearRecentRooms };
};
