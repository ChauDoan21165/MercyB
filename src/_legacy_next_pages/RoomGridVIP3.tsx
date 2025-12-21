import { Card } from "@/components/ui/card";
import { GlobalAppBar } from "@/components/GlobalAppBar";
import { RoomLoadShell } from "@/components/RoomLoadShell";
import { RefreshCw, Building2, ChevronRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useRegistryVipRooms } from '@/hooks/useRegistryVipRooms';
import { useToast } from "@/hooks/use-toast";
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";
import { VIPLockedAccess } from "@/components/VIPLockedAccess";
import { TierRoomColumns } from "@/components/TierRoomColumns";
import { VIP3II_DESCRIPTION } from "@/lib/constants/tierMapConfig";

// Special VIP3 rooms with custom styling
const VIP3_SPECIAL_ROOMS: Record<string, string> = {
  'finance-glory-vip3': '#FFD700',
  'sexuality-and-curiosity-and-culture-vip3': '#FF1493',
  'strategy-in-life-1-vip3': '#9B59B6',
  'strategy-in-life-2-vip3': '#3498DB',
  'strategy-in-life-3-vip3': '#E74C3C',
};

const RoomGridVIP3 = () => {
  const navigate = useNavigate();
  const { isAdmin, isHighAdmin, isLoading: accessLoading, canAccessTier } = useUserAccess();
  const hasAccess = canAccessTier('vip3') || isHighAdmin; // Admin bypass
  const { toast } = useToast();
  const { data: allRooms, isLoading: loading, error, refetch: refresh } = useRegistryVipRooms('vip3');
  const rooms = allRooms || [];
  const { mode, isColor } = useMercyBladeTheme();
  
  // Prefetch first 5 rooms for instant navigation
  usePrefetchRooms(rooms || [], 5);

  const handleRefreshRooms = async () => {
    toast({
      title: "Refreshing rooms...",
      description: "Reloading VIP3 rooms",
    });
    refresh();
    toast({
      title: "Refreshed!",
      description: "VIP3 rooms updated",
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
    return <VIPLockedAccess tier="vip3" tierLabel="VIP3" backgroundColor="hsl(var(--page-vip3))" />;
  }

  // VIP3 shows ALL VIP3 rooms:
  // - Left: English (B2/C1/C2)
  // - Core/Middle: AI, Philosophy, Health, Stress, God, Sleep
  // - Right: Life skills
  // Only exclude VIP3II specialization rooms (those go to /vip/vip3ii)
  const vip3Rooms = rooms.filter(r => {
    const id = r.id.toLowerCase();
    return !id.includes('vip3ii') && !id.includes('vip3_ii') && !id.includes('vip3-ii');
  });

  return (
    <div className="min-h-screen">
      <GlobalAppBar breadcrumbs={[{ label: 'VIP3 Rooms' }]} />
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip3))' }}>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            VIP3 Premium Rooms / Phòng VIP3 Chuyên Biệt
          </h1>
          
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-end mb-4">
              {hasAccess && isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshRooms}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white/80"
                  aria-label="Refresh VIP3 rooms"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Refresh Rooms
                </Button>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg text-gray-700">
                You are in VIP 3 area / Bạn đang ở khu vực VIP 3
              </p>
              <p className="text-sm text-gray-600">
                {loading ? 'Loading...' : `${vip3Rooms.length} exclusive rooms`}
              </p>
            </div>
          </div>

          {!hasAccess && !loading && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <p>You don't have access to VIP3 yet.</p>
              <p className="text-xs mt-1">Bạn chưa có quyền truy cập khu vực VIP3.</p>
            </div>
          )}

          {/* VIP3 II Navigation Card - CORE Specialization Block */}
          {hasAccess && (
            <div className="mb-8">
              <Card 
                className="p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-2"
                style={{ 
                  borderColor: 'hsl(340, 70%, 50%)',
                  background: 'linear-gradient(135deg, hsl(340, 70%, 98%), hsl(320, 70%, 98%))'
                }}
                onClick={() => navigate('/vip/vip3ii')}
                role="button"
                aria-label="Navigate to VIP3 II Core Specialization"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-rose-500 to-pink-600">
                      <Heart className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        VIP3 II – {VIP3II_DESCRIPTION.en}
                      </h3>
                      <p className="text-gray-600">
                        Sexuality • Finance • Schizophrenia • Emotional Well-being
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {VIP3II_DESCRIPTION.vi}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-8 w-8 text-gray-400" aria-hidden="true" />
                </div>
              </Card>
            </div>
          )}


          <RoomLoadShell 
            isLoading={loading} 
            error={error ? "Failed to load VIP3 rooms" : null}
            onRetry={handleRefreshRooms}
          >
            {!hasAccess ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <p>You don't have access to VIP3 yet.</p>
                <p className="text-xs mt-1">Bạn chưa có quyền truy cập khu vực VIP3.</p>
              </div>
            ) : vip3Rooms.length > 0 ? (
              <TierRoomColumns 
                rooms={vip3Rooms} 
                tier="vip3" 
                excludeVip3II={true}
              />
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <p>No rooms available yet.</p>
              </div>
            )}
          </RoomLoadShell>
        </div>

        <VIPNavigation currentPage="vip3" />
      </div>
    </div>
  );
};

export default RoomGridVIP3;
