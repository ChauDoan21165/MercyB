import { Button } from "@/components/ui/button";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { VIPNavigation } from "@/components/VIPNavigation";
import { Brain, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVipRooms } from '@/hooks/useVipRooms';
import { VirtualizedRoomGrid } from '@/components/VirtualizedRoomGrid';
import { RoomGridSkeleton } from '@/components/RoomCardSkeleton';
import { TIERS } from '@/lib/constants';
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";

const RoomGridVIP6 = () => {
  const navigate = useNavigate();
  const { canAccessVIP6, isAdmin, loading: accessLoading } = useUserAccess();
  const { toast } = useToast();
  const { rooms, loading, error, refresh } = useVipRooms('vip6');
  
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

  if (!canAccessVIP6 && !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="VIP6 Learning Rooms"
        showBackButton={true}
      />
      
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip6))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-gray-700 font-medium">
                You are in VIP 6 area / Bạn đang ở khu vực VIP 6
              </span>
              
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
              <div className="flex items-center justify-center gap-2">
                <Brain className="h-8 w-8" style={{ color: 'hsl(var(--vip6-primary))' }} aria-hidden="true" />
                <h1 className="text-4xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                  VIP6 — Shadow & Deep Psychology
                </h1>
              </div>
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

          {loading && <RoomGridSkeleton count={24} />}

          {!loading && rooms && (
            <VirtualizedRoomGrid
              rooms={rooms}
              onRoomClick={(room) => navigate(`/room/${room.id}`)}
            />
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">Error loading rooms: {error.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomGridVIP6;
