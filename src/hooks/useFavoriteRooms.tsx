import { useState, useEffect } from 'react';

export interface FavoriteRoom {
  id: string;
  nameEn: string;
  nameVi: string;
  tier: string;
}

const STORAGE_KEY = 'favoriteRooms';

export const useFavoriteRooms = () => {
  const [favoriteRooms, setFavoriteRooms] = useState<FavoriteRoom[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavoriteRooms(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorite rooms', e);
      }
    }
  }, []);

  const addFavorite = (room: FavoriteRoom) => {
    setFavoriteRooms(prev => {
      const exists = prev.find(r => r.id === room.id);
      if (exists) return prev;
      const newFavorites = [...prev, room];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFavorite = (roomId: string) => {
    setFavoriteRooms(prev => {
      const newFavorites = prev.filter(r => r.id !== roomId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (roomId: string) => favoriteRooms.some(r => r.id === roomId);

  const toggleFavorite = (room: FavoriteRoom) => {
    if (isFavorite(room.id)) {
      removeFavorite(room.id);
    } else {
      addFavorite(room);
    }
  };

  return { favoriteRooms, addFavorite, removeFavorite, isFavorite, toggleFavorite };
};
