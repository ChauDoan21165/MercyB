import { useEffect } from 'react';
import { useKidsRoomContext } from '@/contexts/KidsRoomContext';

export const useKidsRoom = (roomId: string) => {
  const { roomData, loading, error, loadRoom, refreshRoom } = useKidsRoomContext();

  useEffect(() => {
    if (roomId) {
      loadRoom(roomId);
    }
  }, [roomId]);

  return {
    roomData,
    loading,
    error,
    refreshRoom
  };
};
