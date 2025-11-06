import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ALL_ROOMS } from "@/lib/roomData";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const RoomGrid = () => {
  const navigate = useNavigate();
  const { canAccessVIP1, canAccessVIP2, canAccessVIP3 } = useUserAccess();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roomsVersion, setRoomsVersion] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
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

    // Check authentication for free rooms
    if (room.tier === 'free' && !isAuthenticated) {
      toast({
        title: "Please register first / Vui lòng đăng ký trước",
        description: "You need to sign in to access this room / Bạn cần đăng nhập để truy cập phòng này",
        variant: "destructive"
      });
      return;
    }
    
    // Check VIP access
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

  return (
    <TooltipProvider>
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-roomgrid))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              ← Back / Quay Lại
            </Button>
            <span className="ml-3 text-sm text-muted-foreground">
              You are in free of charge area / Bạn đang ở khu vực miễn phí
            </span>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Choose Your Learning Room
            </h1>
            <p className="text-lg text-muted-foreground">
              Chọn Phòng Học Của Bạn
            </p>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {ALL_ROOMS.filter(room => room.tier === "free").map((room) => (
            <Tooltip key={room.id}>
              <TooltipTrigger asChild>
                <Card
                  className={`relative p-3 transition-all duration-300 group ${
                    room.hasData 
                      ? "hover:scale-110 hover:shadow-hover hover:z-10 cursor-pointer" 
                      : "opacity-30 cursor-not-allowed grayscale"
                  } ${
                    room.id === 'sexuality-and-curiosity-free' 
                      ? 'border-2 border-[#FF6B6B] bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF6B6B]/5 shadow-[0_0_20px_rgba(255,107,107,0.3)]' 
                      : ''
                  }`}
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
                      <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                        {room.nameEn}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                        {room.nameVi}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  {room.hasData && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  )}
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{room.hasData ? "Click to enter" : "Coming soon"}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

      </div>
    </div>
    </TooltipProvider>
  );
};

export default RoomGrid;
