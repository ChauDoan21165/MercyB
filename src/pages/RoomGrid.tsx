import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { CheckCircle2, Lock, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ALL_ROOMS } from "@/lib/roomData";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { DemoModeBanner } from '@/components/DemoModeBanner';
import { getDemoRooms } from '@/hooks/useDemoMode';

import { getRoomColor, getContrastTextColor, getHeadingColor } from '@/lib/roomColors';

// Free introduction rooms (still use golden to attract attention)
const FREE_INTRO_ROOMS: Record<string, string> = {
  'finance-calm-money-clear-future-preview-free': '#FFD700',
  'sexuality-and-curiosity-free': '#FFD700',
  'career-consultant-free': '#FFD700',
};

const RoomGrid = () => {
  const navigate = useNavigate();
  const { canAccessVIP1, canAccessVIP2, canAccessVIP3, isAdmin, isDemoMode } = useUserAccess();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roomsVersion, setRoomsVersion] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [demoRoomIds, setDemoRoomIds] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      // If not authenticated, fetch demo room IDs
      if (!user) {
        const rooms = await getDemoRooms();
        setDemoRoomIds(rooms.map(r => r.id));
      }
    };
    checkAuth();

    const handleRoomsLoaded = () => setRoomsVersion(v => v + 1);
    window.addEventListener('rooms-loaded', handleRoomsLoaded as any);
    return () => window.removeEventListener('rooms-loaded', handleRoomsLoaded as any);
  }, []);

  const handleRoomClick = (room: typeof ALL_ROOMS[0]) => {
    // Prevent clicking on locked rooms
    if (!room.hasData) {
      toast({
        title: "Room Locked / Phòng Bị Khóa",
        description: "This room is currently unavailable / Phòng này hiện không khả dụng",
        variant: "destructive"
      });
      return;
    }

    // Allow viewing all rooms (users will see sign-up banner in ChatHub if not authenticated)
    // Only check VIP access for higher tier rooms when user is authenticated
    if (isAuthenticated) {
      // Check VIP access for authenticated users
      if (room.tier === 'vip1' && !canAccessVIP1) {
        toast({
          title: "VIP Only / Chỉ Dành Cho VIP",
          description: "This room requires VIP1 subscription / Phòng này yêu cầu gói VIP1",
          variant: "destructive"
        });
        return;
      }
      if (room.tier === 'vip2' && !canAccessVIP2) {
        toast({
          title: "VIP Only / Chỉ Dành Cho VIP",
          description: "This room requires VIP2 subscription / Phòng này yêu cầu gói VIP2",
          variant: "destructive"
        });
        return;
      }
      if (room.tier === 'vip3' && !canAccessVIP3) {
        toast({
          title: "VIP Only / Chỉ Dành Cho VIP",
          description: "This room requires VIP3 subscription / Phòng này yêu cầu gói VIP3",
          variant: "destructive"
        });
        return;
      }
    }
    
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

  const handleRefreshRooms = () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing rooms...",
      description: "Reloading room registry from files",
    });
    
    window.dispatchEvent(new Event('roomDataUpdated'));
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
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
            {/* Demo Mode Banner */}
            {isDemoMode && (
              <div className="mb-6">
                <DemoModeBanner />
              </div>
            )}

            {/* Header */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg text-gray-700 font-medium">
                  {isDemoMode 
                    ? "Free Access - Register to Save Progress / Truy Cập Miễn Phí"
                    : "You are in free of charge area / Bạn đang ở khu vực miễn phí"
                  }
                </span>
                
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshRooms}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 bg-white/80"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh Rooms
                  </Button>
                )}
              </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
              Choose Your Learning Room
            </h1>
            <p className="text-lg text-muted-foreground">
              Chọn Phòng Học Của Bạn
            </p>
            <p className="text-sm text-muted-foreground/80">
              {isDemoMode 
                ? `Explore ${demoRoomIds.length} free rooms`
                : `Showing ${ALL_ROOMS.filter(room => room.tier === "free").length} rooms`
              }
            </p>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {ALL_ROOMS.filter(room => {
            // In demo mode, only show demo rooms
            if (isDemoMode) {
              return demoRoomIds.includes(room.id);
            }
            // Otherwise, show all free rooms
            return room.tier === "free";
          }).sort((a, b) => {
            const aName = a.name || a.id;
            const bName = b.name || b.id;
            return aName.localeCompare(bName);
          }).map((room) => {
            const roomColor = FREE_INTRO_ROOMS[room.id] || getRoomColor(room.id);
            const textColor = getContrastTextColor(roomColor);
            const headingColor = getHeadingColor(roomColor);
            const isFreeIntro = !!FREE_INTRO_ROOMS[room.id];
            
            return (
            <Tooltip key={room.id}>
              <TooltipTrigger asChild>
                <Card
                  className={`relative p-3 transition-all duration-300 group ${
                    room.hasData 
                      ? "hover:scale-110 hover:shadow-hover hover:z-10 cursor-pointer" 
                      : "opacity-30 cursor-not-allowed grayscale"
                  }`}
                  style={isFreeIntro ? {
                    border: `2px solid ${roomColor}`,
                    background: `linear-gradient(135deg, ${roomColor}20, ${roomColor}10)`,
                    boxShadow: `0 0 20px ${roomColor}60`
                  } : {
                    background: roomColor
                  }}
                  onClick={() => handleRoomClick(room)}
                >
                  {/* Status Badge */}
                  <div className="absolute top-1 right-1 z-10">
                    {room.hasData ? (
                      <div className="bg-green-500 rounded-full p-1">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="bg-gray-400 rounded-full p-1">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* Room Names */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold leading-tight line-clamp-2" style={{
                        background: 'var(--gradient-rainbow)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {room.nameEn}
                      </p>
                      <p className="text-[10px] leading-tight line-clamp-2" style={{
                        background: 'var(--gradient-rainbow)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        opacity: 0.7
                      }}>
                        {room.nameVi}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  {room.hasData && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" 
                         style={{ background: `linear-gradient(to bottom right, ${roomColor}20, ${roomColor}10)` }} />
                  )}
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{room.hasData ? "Click to enter" : "Coming soon"}</p>
              </TooltipContent>
            </Tooltip>
          )})}
        </div>

        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default RoomGrid;
