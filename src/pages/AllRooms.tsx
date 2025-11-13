import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ALL_ROOMS } from "@/lib/roomData";
import { useUserAccess, UserTier } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { AnimatedTierBadge } from "@/components/AnimatedTierBadge";

const AllRooms = () => {
  const navigate = useNavigate();
  const { tier } = useUserAccess();
  const [roomsVersion, setRoomsVersion] = useState(0);

  useEffect(() => {
    const handle = () => setRoomsVersion(v => v + 1);
    window.addEventListener('rooms-loaded', handle as any);
    return () => window.removeEventListener('rooms-loaded', handle as any);
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "border-primary/30 bg-primary/5";
      case "vip1": return "border-secondary/30 bg-secondary/5";
      case "vip2": return "border-accent/30 bg-accent/5";
      case "vip3": return "border-accent/50 bg-gradient-to-br from-accent/10 to-primary/10";
      default: return "";
    }
  };

  const getTierBadge = (roomTier: string) => {
    // Convert room tier string to UserTier type
    const tierMap: Record<string, UserTier> = {
      'free': 'free',
      'vip1': 'vip1',
      'vip2': 'vip2',
      'vip3': 'vip3',
      'vip4': 'vip4'
    };
    
    const mappedTier = tierMap[roomTier] || 'free';
    return <AnimatedTierBadge tier={mappedTier} size="sm" showIcon={false} />;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-allrooms))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
            >
              ← Back / Quay Lại
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              All Learning Rooms
            </h1>
            <p className="text-lg text-muted-foreground">
              Tất Cả Các Phòng Học
            </p>
            <p className="text-sm text-muted-foreground">
              Total Rooms: {ALL_ROOMS.length} | Available: {ALL_ROOMS.filter(r => r.hasData).length}
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <AnimatedTierBadge tier="free" size="md" />
            <AnimatedTierBadge tier="vip1" size="md" />
            <AnimatedTierBadge tier="vip2" size="md" />
            <AnimatedTierBadge tier="vip3" size="md" />
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {[...ALL_ROOMS].sort((a, b) => {
            const aName = a.name || a.id;
            const bName = b.name || b.id;
            return aName.localeCompare(bName);
          }).map((room) => {
            const isVIPRoom = room.tier !== 'free';
            const isFreeUser = tier === 'free';
            const tooltipText = isVIPRoom && isFreeUser ? "VIP only" : (room.hasData ? "Click to enter" : "Coming soon");
            
            return (
              <Tooltip key={room.id}>
                <TooltipTrigger asChild>
                  <Card
                    className={`relative p-3 transition-all duration-300 cursor-pointer group ${getTierColor(room.tier)} ${
                      room.hasData 
                        ? "hover:scale-110 hover:shadow-hover hover:z-10" 
                        : "opacity-60 cursor-not-allowed"
                    }`}
                    onClick={() => room.hasData && navigate(`/chat/${room.id}`)}
                  >
                    {/* Tier Badge */}
                    <div className="absolute -top-2 -left-2 z-10">
                      {getTierBadge(room.tier)}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute -top-2 -right-2 z-10">
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

                    <div className="space-y-2 mt-2">
                      {/* Room Names - Hide VIP room titles for free users */}
                      <div className="space-y-1">
                        {isFreeUser && isVIPRoom ? (
                          <>
                            <p className="text-xs font-semibold text-muted-foreground leading-tight line-clamp-2">
                              🔒 VIP Content
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                              Nội dung VIP
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                              {room.nameEn}
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                              {room.nameVi}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Hover Effect */}
                    {room.hasData && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    )}
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

      </div>
    </div>
    </TooltipProvider>
  );
};

export default AllRooms;
