import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { useCachedRooms } from '@/hooks/useCachedRooms';
import { RoomGridSkeleton } from '@/components/RoomCardSkeleton';
import { VirtualizedRoomGrid } from '@/components/VirtualizedRoomGrid';
import { LowDataModeToggle } from '@/components/LowDataModeToggle';
import { getDemoRooms } from '@/hooks/useDemoMode';

// Free introduction rooms (still use golden to attract attention)
const FREE_INTRO_ROOMS: Record<string, string> = {
  'finance-calm-money-clear-future-preview-free': '#FFD700',
  'sexuality-and-curiosity-free': '#FFD700',
  'career-consultant-free': '#FFD700',
};

const RoomGrid = () => {
  const navigate = useNavigate();
  const { isAdmin, isDemoMode } = useUserAccess();
  const { toast } = useToast();
  const [demoRoomIds, setDemoRoomIds] = useState<string[]>([]);
  
  // Use cached rooms hook for optimized data fetching
  const { data: cachedRooms, isLoading, refetch } = useCachedRooms('free');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // If not authenticated, fetch demo room IDs
      if (!user) {
        const rooms = await getDemoRooms();
        setDemoRoomIds(rooms.map(r => r.id));
      }
    };
    checkAuth();
  }, []);
  
  // Filter rooms based on demo mode
  const filteredRooms = useMemo(() => {
    if (!cachedRooms) return [];
    if (isDemoMode) {
      return cachedRooms.filter(room => demoRoomIds.includes(room.id));
    }
    return cachedRooms;
  }, [cachedRooms, isDemoMode, demoRoomIds]);

  const handleRoomClick = (room: any) => {
    navigate(`/chat/${room.id}`);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "bg-primary/10 text-primary border-primary/20";
      case "vip1": return "bg-secondary/10 text-secondary border-secondary/20";
      case "vip2": return "bg-accent/10 text-accent border-accent/20";
      case "vip3": return "bg-gradient-to-r from-accent to-primary text-white border-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTierLabel = (tier: string) => {
    return tier.toUpperCase();
  };

  const handleRefreshRooms = async () => {
    toast({
      title: "Refreshing rooms...",
      description: "Reloading room data from cache",
    });
    
    await refetch();
    
    toast({
      title: "Refreshed!",
      description: "Room data updated successfully",
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <ColorfulMercyBladeHeader
          subtitle="Free Rooms"
          showBackButton={true}
        />
        
        <div className="min-h-screen" style={{ background: 'hsl(var(--page-roomgrid))' }}>
          <div className="container mx-auto px-4 py-8 max-w-7xl">

            {/* Header */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg text-gray-700 font-medium">
                  You are in free of charge area / Bạn đang ở khu vực miễn phí
                </span>
                
                <div className="flex gap-2">
                  <LowDataModeToggle />
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshRooms}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-white/80"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  )}
                </div>
              </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
              Choose Your Learning Room
            </h1>
            <p className="text-lg text-muted-foreground">
              Chọn Phòng Học Của Bạn
            </p>
            <p className="text-sm text-muted-foreground/80">
              {isLoading ? 'Loading...' : `Showing ${sortedRooms.length} rooms`}
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && <RoomGridSkeleton count={24} />}

        {/* Virtualized Room Grid */}
        {!isLoading && (
          <VirtualizedRoomGrid
            rooms={filteredRooms}
            onRoomClick={handleRoomClick}
            highlightColors={FREE_INTRO_ROOMS}
          />
        )}

        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default RoomGrid;
