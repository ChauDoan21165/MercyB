import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Sparkles, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ALL_ROOMS } from "@/lib/roomData";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useToast } from "@/hooks/use-toast";

const RoomGrid = () => {
  const navigate = useNavigate();
  const { canAccessVIP1, canAccessVIP2, canAccessVIP3 } = useUserAccess();
  const { toast } = useToast();

  const handleRoomClick = (room: typeof ALL_ROOMS[0]) => {
    if (!room.hasData) return;
    
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
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
            >
              ← Back / Quay Lại
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/vip-requests")}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                My Requests
              </Button>
              <Button
                onClick={() => navigate("/vip-request")}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent"
              >
                <Sparkles className="h-4 w-4" />
                Request Custom Room
              </Button>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Choose Your Learning Room
            </h1>
            <p className="text-lg text-muted-foreground">
              Chọn Phòng Học Của Bạn
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Ready / Sẵn Sàng
            </Badge>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {ALL_ROOMS.filter(room => room.tier === "free").map((room) => (
            <Tooltip key={room.id}>
              <TooltipTrigger asChild>
                <Card
                  className={`relative p-3 transition-all duration-300 cursor-pointer group ${
                    room.hasData 
                      ? "hover:scale-110 hover:shadow-hover hover:z-10" 
                      : "opacity-60 cursor-not-allowed"
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

        {/* Footer Note */}
        <div className="text-center mt-8 space-y-1">
          <p className="text-sm text-muted-foreground">
            Rooms with ✓ are ready for learning
          </p>
          <p className="text-xs text-muted-foreground">
            Các Phòng Có ✓ Đã Sẵn Sàng Để Học
          </p>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default RoomGrid;
