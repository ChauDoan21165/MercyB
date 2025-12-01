import { RoomHeader } from "@/components/RoomHeader";
import { RoomLoadShell } from "@/components/RoomLoadShell";
import { Crown, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEmergencyVipRooms } from '@/hooks/useVipRooms';
import { RoomGridSkeleton } from '@/components/RoomCardSkeleton';
import { VirtualizedRoomGrid } from '@/components/VirtualizedRoomGrid';
import { LowDataModeToggle } from '@/components/LowDataModeToggle';
import { useToast } from "@/hooks/use-toast";
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";

const RoomGridVIP1 = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: accessLoading, canAccessTier } = useUserAccess();
  const hasAccess = canAccessTier('vip1');
  const { toast } = useToast();
  const { data: rooms, isLoading, error, refetch } = useEmergencyVipRooms('vip1');
  
  // Prefetch first 5 rooms for instant navigation
  usePrefetchRooms(rooms || [], 5);

  const handleRefreshRooms = async () => {
    toast({
      title: "Refreshing rooms...",
      description: "Reloading VIP1 rooms",
    });
    await refetch();
    toast({
      title: "Refreshed!",
      description: "VIP1 rooms updated",
    });
  };

  if (accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">You don't have access to VIP1 yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip1))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <RoomHeader title="VIP1 Learning Rooms / Phòng Học VIP1" tier="VIP1" />
          
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-end mb-4 gap-2">
              <LowDataModeToggle />
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshRooms}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-white/80"
                  aria-label="Refresh VIP1 rooms"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Refresh
                </Button>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg text-gray-700">
                You are in VIP 1 area / Bạn đang ở khu vực VIP 1
              </p>
              <p className="text-sm text-gray-600">
                {isLoading ? 'Loading...' : `Showing ${rooms?.length || 0} rooms`}
              </p>
            </div>
          </div>

          <VIPNavigation currentPage="vip1" />

          {isLoading && <RoomGridSkeleton count={24} />}

          {error && (
            <div className="mt-8 text-center text-sm text-red-600">
              <p>Failed to load VIP1 rooms</p>
              <p className="text-xs mt-1">{error.message}</p>
            </div>
          )}

          {!isLoading && (!rooms || rooms.length === 0) && !error && (
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>No VIP1 rooms available yet.</p>
              <p className="text-xs text-gray-500 mt-1">Chưa có phòng VIP1 nào.</p>
            </div>
          )}

          {!isLoading && rooms && rooms.length > 0 && (
            <VirtualizedRoomGrid
              rooms={rooms.map((room) => ({
                id: room.id,
                nameEn: room.title_en,
                nameVi: room.title_vi,
                tier: room.tier || 'vip1',
                hasData: Array.isArray(room.entries) ? room.entries.length > 0 : !!room.entries,
              }))}
              onRoomClick={(room) => navigate(`/room/${room.id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomGridVIP1;
