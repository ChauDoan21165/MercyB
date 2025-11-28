import { useState, useEffect } from 'react';

export interface Track {
  id: string;
  name: string;
  url: string;
}

const STORAGE_KEY = 'favoriteTrackIds';

export const useFavoriteTracks = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavoriteIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorite tracks', e);
      }
    }
  }, []);

  const toggleFavorite = (trackId: string) => {
    setFavoriteIds(prev => {
      const newFavorites = prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (trackId: string) => favoriteIds.includes(trackId);

  return { favoriteIds, toggleFavorite, isFavorite };
};
