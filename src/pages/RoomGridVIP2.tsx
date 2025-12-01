import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { useMercyBladeTheme } from "@/hooks/useMercyBladeTheme";
import { MercyBladeThemeToggle } from "@/components/MercyBladeThemeToggle";
import { RoomLoadShell } from "@/components/RoomLoadShell";
import { Gem, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useVipRooms } from '@/hooks/useVipRooms';
import { RoomGridSkeleton } from '@/components/RoomCardSkeleton';
import { VirtualizedRoomGrid } from '@/components/VirtualizedRoomGrid';
import { useToast } from "@/hooks/use-toast";
import { TIERS } from '@/lib/constants';
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";

const RoomGridVIP2 = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: accessLoading, canAccessTier } = useUserAccess();
  const hasAccess = canAccessTier('vip2');
  const { toast } = useToast();
  const { rooms, loading, error, refresh } = useVipRooms('vip2');
  const { mode } = useMercyBladeTheme();
  
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

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        mode={mode}
        subtitle="VIP2 Learning Rooms"
        showBackButton={true}
      />
      
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip2))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-gray-700 font-medium">
                You are in VIP 2 area / Bạn đang ở khu vực VIP 2
              </span>
              
              <div className="flex items-center gap-2">
                <MercyBladeThemeToggle />
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
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Gem className="h-8 w-8" style={{ color: 'hsl(var(--vip2-primary))' }} aria-hidden="true" />
                <h1 className="text-4xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                  VIP2 Learning Rooms
                </h1>
              </div>
              <p className="text-lg text-gray-700">
                Phòng Học VIP2
              </p>
              <p className="text-sm text-gray-600">
                {loading ? 'Loading...' : `Showing ${(rooms ?? []).length} rooms`}
              </p>
            </div>
          </div>

          <VIPNavigation currentPage="vip2" />

          <RoomLoadShell 
            isLoading={loading} 
            error={error ? "Failed to load VIP2 rooms" : null}
            onRetry={handleRefreshRooms}
          >
            {!hasAccess ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <p>You don't have access to VIP2 yet.</p>
                <p className="text-xs mt-1">Bạn chưa có quyền truy cập khu vực VIP2.</p>
              </div>
            ) : rooms && rooms.length > 0 ? (
              <VirtualizedRoomGrid
                rooms={rooms.map((room) => ({
                  id: room.id,
                  nameEn: room.title_en,
                  nameVi: room.title_vi,
                  tier: room.tier || 'vip2',
                  hasData: Array.isArray(room.entries) ? room.entries.length > 0 : !!room.entries,
                }))}
                onRoomClick={(room) => navigate(`/room/${room.id}`)}
              />
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
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
