import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { loadMergedRoom } from "@/lib/roomLoader";

interface Room {
  id: string;
  title_en?: string;
  title_vi?: string;
}

/**
 * Prefetch room data for likely next navigation
 * Use after tier page loads to make room transitions feel instant
 * 
 * @param rooms - Array of rooms to prefetch
 * @param maxPrefetch - Maximum number of rooms to prefetch (default: 5)
 */
export function usePrefetchRooms(rooms: Room[], maxPrefetch = 5, onHover = false) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!rooms || rooms.length === 0) return;

    // Prefetch the first N rooms that users are most likely to click
    const roomsToPrefetch = rooms.slice(0, maxPrefetch);

    const prefetchRoom = (room: Room) => {
      if (!queryClient.getQueryData(['room', room.id])) {
        queryClient.prefetchQuery({
          queryKey: ['room', room.id],
          queryFn: () => loadMergedRoom(room.id),
          staleTime: 5 * 60 * 1000, // 5 minutes
        });
      }
    };

    if (!onHover) {
      // Immediate prefetch
      roomsToPrefetch.forEach(prefetchRoom);
    } else {
      // Prefetch on hover/interaction
      roomsToPrefetch.forEach((room) => {
        const elements = document.querySelectorAll(`[data-room-id="${room.id}"]`);
        elements.forEach((el) => {
          const handleHover = () => prefetchRoom(room);
          el.addEventListener('mouseenter', handleHover, { once: true });
          el.addEventListener('touchstart', handleHover, { once: true, passive: true });
        });
      });
    }
  }, [rooms, maxPrefetch, onHover, queryClient]);
}
