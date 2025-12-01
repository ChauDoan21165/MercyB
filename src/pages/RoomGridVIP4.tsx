import { Button } from "@/components/ui/button";
import { RoomHeader } from "@/components/RoomHeader";
import { RoomLoadShell } from "@/components/RoomLoadShell";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { VIPNavigation } from "@/components/VIPNavigation";
import { Briefcase, Crown, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVipRooms } from '@/hooks/useVipRooms';
import { VirtualizedRoomGrid } from '@/components/VirtualizedRoomGrid';
import { RoomGridSkeleton } from '@/components/RoomCardSkeleton';
import { TIERS } from '@/lib/constants';
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";

const VIP4_CAREER_ROOMS = [
  { id: "courage-to-begin", name: "Courage to Begin" },
  { id: "discover-self", name: "Discover Self" },
  { id: "explore-world", name: "Explore World" },
  { id: "build-skills", name: "Build Skills" },
  { id: "bridge-to-reality", name: "Bridge to Reality" },
  { id: "resilience-and-adaptation", name: "Resilience and Adaptation" },
  { id: "career-community", name: "Career Community" },
  { id: "launch-career", name: "Launch Career" },
  { id: "find-fit", name: "Find Fit" },
  { id: "grow-wealth", name: "Grow Wealth" },
  { id: "master-climb", name: "Master Climb" },
  { id: "lead-impact", name: "Lead Impact" }
];

const RoomGridVIP4 = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: accessLoading, canAccessTier } = useUserAccess();
  const hasAccess = canAccessTier('vip4');
  const { toast } = useToast();
  const { data: rooms, isLoading: loading, error, refetch: refresh } = useVipRooms('vip4');
  
  // Prefetch first 5 rooms for instant navigation
  usePrefetchRooms(rooms || [], 5);

  const handleRefreshRooms = async () => {
    toast({
      title: "Refreshing rooms...",
      description: "Reloading VIP4 rooms",
    });
    refresh();
    toast({
      title: "Refreshed!",
      description: "VIP4 rooms updated",
    });
  };

  if (accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--page-vip4))' }}>
        <p className="text-muted-foreground">Loading... / Đang Tải...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--page-vip4))' }}>
        <p className="text-muted-foreground">You don't have access to VIP4 yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip4))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <RoomHeader title="VIP4 Career Consultance" tier="VIP4" />
          
          <div className="mb-12 text-center space-y-4">
            <div className="flex items-center justify-end mb-4">
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshRooms}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white/80"
                  aria-label="Refresh VIP4 rooms"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Refresh Rooms
                </Button>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <Briefcase className="h-12 w-12" style={{ color: 'hsl(var(--vip4-primary))' }} aria-hidden="true" />
              <h1 className="text-4xl md:text-5xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                CareerZ - VIP4
              </h1>
              <Crown className="h-12 w-12" style={{ color: 'hsl(var(--vip4-gold))' }} aria-hidden="true" />
            </div>

            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Career Consultance • Tư Vấn Nghề Nghiệp
            </p>
            
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              🎓 Your complete career guidance journey from self-discovery to leadership impact
              <br />
              Hành trình định hướng nghề nghiệp hoàn chỉnh từ khám phá bản thân đến tác động lãnh đạo
            </p>
            
            <p className="text-sm text-gray-600">
              {loading ? 'Loading...' : `Showing ${rooms.length} rooms`}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                🌟 12 Career Rooms • 12 Phòng Nghề Nghiệp
              </Badge>
              <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700">
                💼 Professional Guidance • Hướng Dẫn Chuyên Nghiệp
              </Badge>
              <Badge variant="secondary" className="text-xs bg-rose-100 text-rose-700">
                🚀 Career Growth • Phát Triển Sự Nghiệp
              </Badge>
            </div>
          </div>

          <RoomLoadShell 
            isLoading={loading} 
            error={error ? "Failed to load VIP4 rooms" : null}
            onRetry={handleRefreshRooms}
          >
            {rooms && rooms.length > 0 ? (
              <VirtualizedRoomGrid
                rooms={rooms.map((room) => ({
                  id: room.id,
                  nameEn: room.title_en,
                  nameVi: room.title_vi,
                  tier: room.tier || 'vip4',
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

          <VIPNavigation currentPage="vip4" />
        </div>
      </div>
    </div>
  );
};

export default RoomGridVIP4;
