import { GlobalAppBar } from "@/components/GlobalAppBar";
import { RoomLoadShell } from "@/components/RoomLoadShell";
import { Gem, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useRegistryVipRooms } from '@/hooks/useRegistryVipRooms';
import { RoomGridSkeleton } from '@/components/RoomCardSkeleton';
import { VirtualizedRoomGrid } from '@/components/VirtualizedRoomGrid';
import { useToast } from "@/hooks/use-toast";
import { TIERS } from '@/lib/constants';
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";
import { VIPLockedAccess } from "@/components/VIPLockedAccess";

const RoomGridVIP2 = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: accessLoading, canAccessTier } = useUserAccess();
  const hasAccess = canAccessTier('vip2');
  const { toast } = useToast();
  const { data: rooms, isLoading: loading, error, refetch: refresh } = useRegistryVipRooms('vip2');
  
  // Prefetch first 5 rooms for instant navigation
  usePrefetchRooms(rooms || [], 5);

  const handleRefreshRooms = async () => {
    toast({
      title: "Refreshing rooms...",
      description: "Reloading VIP2 rooms",
    });
    refresh();
    toast({
      title: "Refreshed!",
      description: "VIP2 rooms updated",
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
    return <VIPLockedAccess tier="vip2" tierLabel="VIP2" backgroundColor="hsl(var(--page-vip2))" />;
  }

  return (
    <div className="min-h-screen">
      <GlobalAppBar breadcrumbs={[{ label: 'VIP2 Rooms' }]} />
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip2))' }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Page Title */}
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            VIP2 Learning Rooms / Phòng Học VIP2
          </h1>
          
          {/* Controls - Aligned right */}
          <div className="flex items-center justify-end gap-2 mb-4">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshRooms}
                disabled={loading}
                className="flex items-center gap-2 bg-white/80"
                aria-label="Refresh VIP2 rooms"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                Refresh Rooms
              </Button>
            )}
          </div>
          
          {/* Subtitle - Centered, max-w-3xl */}
          <div className="text-center space-y-2 mb-6 max-w-3xl mx-auto">
            <p className="text-base text-gray-700">
              You are in VIP 2 area / Bạn đang ở khu vực VIP 2
            </p>
            <p className="text-sm text-gray-600">
              {loading ? 'Loading...' : `Showing ${(rooms ?? []).length} rooms`}
            </p>
          </div>

          <VIPNavigation currentPage="vip2" />

          <RoomLoadShell 
            isLoading={loading} 
            error={error ? "Failed to load VIP2 rooms" : null}
            onRetry={handleRefreshRooms}
          >
            {!hasAccess ? (
              <div className="text-center py-8 text-sm text-muted-foreground max-w-3xl mx-auto">
                <p>You don't have access to VIP2 yet.</p>
                <p className="text-xs mt-1">Bạn chưa có quyền truy cập khu vực VIP2.</p>
              </div>
            ) : rooms && rooms.length > 0 ? (
              <div className="mt-6">
                <VirtualizedRoomGrid
                  rooms={rooms.map((room) => ({
                    id: room.id,
                    nameEn: room.title_en,
                    nameVi: room.title_vi,
                    tier: room.tier || 'vip2',
                    hasData: room.hasData,
                  }))}
                  onRoomClick={(room) => {
                    console.log('[RoomClick] Opening room:', room.id);
                    navigate(`/room/${room.id}`);
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground max-w-3xl mx-auto">
                <p>No rooms available yet.</p>
              </div>
            )}
          </RoomLoadShell>
        </div>
      </div>
    </div>
  );
};

export default RoomGridVIP2;
