import { Button } from "@/components/ui/button";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { RoomHeader } from "@/components/RoomHeader";
import { RoomLoadShell } from "@/components/RoomLoadShell";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { VIPNavigation } from "@/components/VIPNavigation";
import { BookOpen, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVipRooms } from '@/hooks/useVipRooms';
import { VirtualizedRoomGrid } from '@/components/VirtualizedRoomGrid';
import { RoomGridSkeleton } from '@/components/RoomCardSkeleton';
import { getHeadingColor } from '@/lib/roomColors';
import { TIERS } from '@/lib/constants';
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";

const RoomGridVIP5 = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: accessLoading, canAccessTier } = useUserAccess();
  const hasAccess = canAccessTier('vip5');
  const { toast } = useToast();
  const { data: rooms, isLoading: loading, error, refetch: refresh } = useVipRooms('vip5');
  
  // Prefetch first 5 rooms for instant navigation
  usePrefetchRooms(rooms || [], 5);

  const handleRefreshRooms = async () => {
    toast({
      title: "Refreshing rooms...",
      description: "Reloading VIP5 rooms",
    });
    refresh();
    toast({
      title: "Refreshed!",
      description: "VIP5 rooms updated",
    });
  };

  if (accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--page-vip5))' }}>
        <p className="text-muted-foreground">Loading... / Đang Tải...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip5))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoomHeader title="VIP5 - English Writing Master Support" tier="VIP5" />
        
        <div className="mt-8 text-center">
          <p className="text-base text-muted-foreground max-w-3xl mx-auto mb-2">
            VIP5 offers complete English writing support. Students write, and AI gives expert feedback: strengths, mistakes, clarity fixes, rewriting steps, and IELTS-style comments.
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto mb-8">
            VIP5 mang đến hỗ trợ viết tiếng Anh toàn diện. Học viên viết, AI phân tích và phản hồi rõ ràng: điểm mạnh, lỗi sai, cách cải thiện, bước viết lại và nhận xét theo chuẩn IELTS.
          </p>
        </div>

        <VIPNavigation currentPage="vip5" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: getHeadingColor('vip5', 'writing') }}>
            VIP5 Writing Rooms ({loading ? '...' : (rooms || []).length})
          </h2>
          {isAdmin && (
            <Button 
              onClick={handleRefreshRooms}
              disabled={loading}
              variant="outline"
              size="sm"
              className="gap-2"
              aria-label="Refresh VIP5 rooms"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              Refresh Rooms
            </Button>
          )}
        </div>

        <RoomLoadShell 
          isLoading={loading} 
          error={error ? "Failed to load VIP5 rooms" : null}
          onRetry={handleRefreshRooms}
        >
          {!hasAccess ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <p>You don't have access to VIP5 yet.</p>
              <p className="text-xs mt-1">Bạn chưa có quyền truy cập khu vực VIP5.</p>
            </div>
          ) : rooms && rooms.length > 0 ? (
            <VirtualizedRoomGrid
              rooms={(rooms || []).map((room) => ({
                id: room.id,
                nameEn: room.title_en,
                nameVi: room.title_vi,
                tier: room.tier || 'vip5',
                hasData: true,
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
  );
};

export default RoomGridVIP5;
