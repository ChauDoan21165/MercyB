import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ALL_ROOMS } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect } from "react";
import { toast } from "sonner";

const RoomGridVIP2 = () => {
  const navigate = useNavigate();
  const { canAccessVIP2, loading } = useUserAccess();

  useEffect(() => {
    if (!loading && !canAccessVIP2) {
      navigate('/');
    }
  }, [canAccessVIP2, loading, navigate]);

  if (loading || !canAccessVIP2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip2))' }}>
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
            <div className="flex items-center justify-center gap-2">
              <Gem className="h-8 w-8 text-accent" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                VIP2 Learning Rooms
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Phòng Học VIP2
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
          {ALL_ROOMS.filter(room => room.tier === "vip2").map((room) => (
            <Card
              key={room.id}
              className={`relative p-3 transition-all duration-300 cursor-pointer group ${
                room.hasData 
                  ? "hover:scale-110 hover:shadow-hover hover:z-10 border-accent/30" 
                  : "opacity-60 cursor-not-allowed"
              }`}
              onClick={() => room.hasData && navigate(`/chat/${room.id}`)}
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
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              )}
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <VIPNavigation currentPage="vip2" />
      </div>
    </div>
  );
};

export default RoomGridVIP2;
