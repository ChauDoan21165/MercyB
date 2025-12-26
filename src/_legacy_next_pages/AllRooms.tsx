import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { VirtualizedRoomGrid } from "@/components/VirtualizedRoomGrid";
import { RoomGridSkeleton } from "@/components/RoomCardSkeleton";

import { useCachedRooms } from "@/hooks/useCachedRooms";

export default function AllRooms() {
  const navigate = useNavigate();
  const { data: cachedRooms, isLoading } = useCachedRooms();

  const rooms = useMemo(() => {
    return cachedRooms ?? [];
  }, [cachedRooms]);

  const handleRoomClick = (room: any) => {
    navigate(`/room/${room.id}`);
  };

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader subtitle="All Rooms" />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-4xl font-bold">
            All Learning Rooms
          </h1>
          <p className="text-muted-foreground">
            Showing {isLoading ? "…" : rooms.length} rooms
          </p>
        </div>

        {isLoading && <RoomGridSkeleton count={36} />}

        {!isLoading && rooms.length > 0 && (
          <VirtualizedRoomGrid
            rooms={rooms}
            onRoomClick={handleRoomClick}
          />
        )}
      </div>
    </div>
  );
}
