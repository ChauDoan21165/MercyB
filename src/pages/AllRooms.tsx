import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ALL_ROOMS } from "@/lib/roomData";

const AllRooms = () => {
  const navigate = useNavigate();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "border-primary/30 bg-primary/5";
      case "vip1": return "border-secondary/30 bg-secondary/5";
      case "vip2": return "border-accent/30 bg-accent/5";
      case "vip3": return "border-accent/50 bg-gradient-to-br from-accent/10 to-primary/10";
      default: return "";
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "free": return <Badge className="bg-primary text-primary-foreground text-[8px] px-1 py-0">FREE</Badge>;
      case "vip1": return <Badge className="bg-secondary text-secondary-foreground text-[8px] px-1 py-0">VIP1</Badge>;
      case "vip2": return <Badge className="bg-accent text-accent-foreground text-[8px] px-1 py-0">VIP2</Badge>;
      case "vip3": return <Badge className="bg-gradient-to-r from-accent to-primary text-white text-[8px] px-1 py-0">VIP3</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
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
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Ready / Sẵn Sàng
            </Badge>
            <Badge className="bg-primary text-primary-foreground">FREE</Badge>
            <Badge className="bg-secondary text-secondary-foreground">VIP1</Badge>
            <Badge className="bg-accent text-accent-foreground">VIP2</Badge>
            <Badge className="bg-gradient-to-r from-accent to-primary text-white">VIP3</Badge>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {ALL_ROOMS.map((room) => (
            <Card
              key={room.id}
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
  );
};

export default AllRooms;
