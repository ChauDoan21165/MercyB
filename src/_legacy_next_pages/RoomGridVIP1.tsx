import { GlobalAppBar } from "@/components/GlobalAppBar";
import { RoomLoadShell } from "@/components/RoomLoadShell";
import { Crown, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useRegistryVipRooms } from '@/hooks/useRegistryVipRooms';
import { RoomGridSkeleton } from '@/components/RoomCardSkeleton';
import { VirtualizedRoomGrid } from '@/components/VirtualizedRoomGrid';
import { LowDataModeToggle } from '@/components/LowDataModeToggle';
import { useToast } from "@/hooks/use-toast";
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";
import { VIPLockedAccess } from "@/components/VIPLockedAccess";

const RoomGridVIP1 = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: accessLoading, canAccessTier } = useUserAccess();
  const hasAccess = canAccessTier('vip1');
  const { toast } = useToast();
  const { data: rooms, isLoading, error, refetch } = useRegistryVipRooms('vip1');
  
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
    return <VIPLockedAccess tier="vip1" tierLabel="VIP1" backgroundColor="hsl(var(--page-vip1))" />;
  }

  return (
    <div className="min-h-screen">
      <GlobalAppBar breadcrumbs={[{ label: 'VIP1 Rooms' }]} />
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip1))' }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Page Title */}
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            VIP1 Learning Rooms / Phòng Học VIP1
          </h1>
          
          {/* Controls - Aligned right */}
          <div className="flex items-center justify-end gap-2 mb-4">
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
          
          {/* Subtitle - Centered, max-w-3xl */}
          <div className="text-center space-y-2 mb-6 max-w-3xl mx-auto">
            <p className="text-base text-gray-700">
              You are in VIP 1 area / Bạn đang ở khu vực VIP 1
            </p>
            <p className="text-sm text-gray-600">
              {isLoading ? 'Loading...' : `Showing ${rooms?.length || 0} rooms`}
            </p>
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

          {/* Room Grid - Left-aligned inside centered container with gap-4 */}
          {!isLoading && rooms && rooms.length > 0 && (
            <div className="mt-6">
              <VirtualizedRoomGrid
                rooms={rooms.map((room) => ({
                  id: room.id,
                  nameEn: room.title_en,
                  nameVi: room.title_vi,
                  tier: room.tier || 'vip1',
                  hasData: room.hasData,
                }))}
                onRoomClick={(room) => {
                  console.log('[RoomClick] Opening room:', room.id);
                  navigate(`/room/${room.id}`);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomGridVIP1;
