import { Button } from "@/components/ui/button";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { RoomHeader } from "@/components/RoomHeader";
import { RoomLoadShell } from "@/components/RoomLoadShell";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { VIPNavigation } from "@/components/VIPNavigation";
import { Brain, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRegistryVipRooms } from '@/hooks/useRegistryVipRooms';
import { VirtualizedRoomGrid } from '@/components/VirtualizedRoomGrid';
import { RoomGridSkeleton } from '@/components/RoomCardSkeleton';
import { TIERS } from '@/lib/constants';
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";

const RoomGridVIP6 = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: accessLoading, canAccessTier } = useUserAccess();
  const hasAccess = canAccessTier('vip6');
  const { toast } = useToast();
  const { data: rooms, isLoading: loading, error, refetch: refresh } = useRegistryVipRooms('vip6');
  
  // Prefetch first 5 rooms for instant navigation
  usePrefetchRooms(rooms || [], 5);

  const handleRefreshRooms = async () => {
    toast({
      title: "Refreshing rooms...",
      description: "Reloading VIP6 rooms",
    });
    refresh();
    toast({
      title: "Refreshed!",
      description: "VIP6 rooms updated",
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
        <p className="text-muted-foreground">You don't have access to VIP6 yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader />
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip6))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <RoomHeader title="VIP6 — Shadow & Deep Psychology" tier="VIP6" />
          
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-end mb-4">
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshRooms}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white/80"
                  aria-label="Refresh VIP6 rooms"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Refresh Rooms
                </Button>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg text-gray-700 font-medium">
                You are in VIP 6 area / Bạn đang ở khu vực VIP 6
              </p>
              <p className="text-base text-gray-700 max-w-3xl mx-auto">
                VIP6 opens a dedicated universe for shadow work, inner child healing, trauma patterns, subconscious identity, and emotional integration. This tier helps users understand the hidden forces shaping their reactions, choices, relationships, and life direction.
              </p>
              <p className="text-base text-gray-700 max-w-3xl mx-auto">
                VIP6 mở ra một vũ trụ riêng dành cho bóng tối nội tâm, chữa lành đứa trẻ bên trong, mô thức tổn thương, bản sắc tiềm thức và sự tích hợp cảm xúc. Cấp độ này giúp người dùng hiểu những lực vô hình đang định hình phản ứng, lựa chọn, các mối quan hệ và hướng đi cuộc sống.
              </p>
              <p className="text-sm text-gray-600">
                {loading ? 'Loading...' : `Showing ${rooms.length} rooms`}
              </p>
            </div>
          </div>

          <VIPNavigation currentPage="vip6" />

          <RoomLoadShell 
            isLoading={loading} 
            error={error ? "Failed to load VIP6 rooms" : null}
            onRetry={handleRefreshRooms}
          >
            {rooms && rooms.length > 0 ? (
              <VirtualizedRoomGrid
                rooms={rooms.map((room) => ({
                  id: room.id,
                  nameEn: room.title_en,
                  nameVi: room.title_vi,
                  tier: room.tier || 'vip6',
                  hasData: room.hasData, // Use hasData from registry
                }))}
                onRoomClick={(room) => {
                  console.log('[RoomClick] Opening room:', room.id);
                  navigate(`/room/${room.id}`);
                }}
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

export default RoomGridVIP6;
