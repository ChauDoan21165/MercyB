import { Button } from "@/components/ui/button";
import { GlobalAppBar } from "@/components/GlobalAppBar";
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
import { VIPLockedAccess } from "@/components/VIPLockedAccess";

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
    return <VIPLockedAccess tier="vip6" tierLabel="VIP6 Psychology" backgroundColor="hsl(var(--page-vip6))" />;
  }

  return (
    <div className="min-h-screen">
      <GlobalAppBar breadcrumbs={[{ label: 'VIP6 Psychology' }]} />
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip6))' }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            VIP6 — Shadow & Deep Psychology
          </h1>
          
          {/* Controls - Aligned right */}
          <div className="flex items-center justify-end gap-2 mb-6">
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
          
          {/* Subtitle - Centered, max-w-3xl, proper spacing */}
          <div className="text-center space-y-3 mb-6 max-w-3xl mx-auto">
            <p className="text-base text-gray-700 font-medium">
              You are in VIP 6 area / Bạn đang ở khu vực VIP 6
            </p>
            <p className="text-[15px] leading-relaxed text-gray-700">
              VIP6 opens a dedicated universe for shadow work, inner child healing, trauma patterns, subconscious identity, and emotional integration. This tier helps users understand the hidden forces shaping their reactions, choices, relationships, and life direction.
            </p>
            <p className="text-[15px] leading-relaxed text-gray-700">
              VIP6 mở ra một vũ trụ riêng dành cho bóng tối nội tâm, chữa lành đứa trẻ bên trong, mô thức tổn thương, bản sắc tiềm thức và sự tích hợp cảm xúc. Cấp độ này giúp người dùng hiểu những lực vô hình đang định hình phản ứng, lựa chọn, các mối quan hệ và hướng đi cuộc sống.
            </p>
            <p className="text-sm text-gray-600">
              {loading ? 'Loading...' : `Showing ${rooms.length} rooms`}
            </p>
          </div>

          <VIPNavigation currentPage="vip6" />

          <RoomLoadShell 
            isLoading={loading} 
            error={error ? "Failed to load VIP6 rooms" : null}
            onRetry={handleRefreshRooms}
          >
            {rooms && rooms.length > 0 ? (
              <div className="mt-6">
                <VirtualizedRoomGrid
                  rooms={rooms.map((room) => ({
                    id: room.id,
                    nameEn: room.title_en,
                    nameVi: room.title_vi,
                    tier: room.tier || 'vip6',
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

export default RoomGridVIP6;
