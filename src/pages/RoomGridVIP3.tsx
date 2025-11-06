import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ALL_ROOMS } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// VIP3 exclusive rooms with special thematic colors
const VIP3_SPECIAL_ROOMS: Record<string, string> = {
  'sexuality-and-curiosity-and-culture-vip3': '#D946A6',
  'finance-glory-vip3': '#FBBF24',
  'strategy-in-life-1-vip3': '#1E40AF',
  'strategy-in-life-2-vip3': '#7C3AED',
  'strategy-in-life-3-vip3': '#059669',
};

const RoomGridVIP3 = () => {
  const navigate = useNavigate();
  const { canAccessVIP3, loading } = useUserAccess();

  useEffect(() => {
    if (!loading && !canAccessVIP3) {
      navigate('/');
    }
  }, [canAccessVIP3, loading, navigate]);

  const [roomsVersion, setRoomsVersion] = useState(0);
  useEffect(() => {
    const handle = () => setRoomsVersion(v => v + 1);
    window.addEventListener('rooms-loaded', handle as any);
    return () => window.removeEventListener('rooms-loaded', handle as any);
  }, []);

  if (loading || !canAccessVIP3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip3))' }}>
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
              You are in VIP 3 area / Bạn đang ở khu vực VIP 3
            </span>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-8 w-8 text-accent" />
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-[hsl(var(--vip3-gold))]">
                VIP3 Premium Rooms
              </h1>
            </div>
            <p className="text-lg text-[hsl(var(--vip3-gold))]/90">
              Phòng Học VIP3 Cao Cấp
            </p>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {ALL_ROOMS.filter(room => room.tier === "vip3").map((room) => {
            const isSpecialRoom = VIP3_SPECIAL_ROOMS[room.id];
            
            return (
              <Card
                key={room.id}
                className={`relative p-3 transition-all duration-300 cursor-pointer group ${
                  room.hasData 
                    ? "hover:scale-110 hover:shadow-hover hover:z-10 border-accent/50 bg-gradient-to-br from-background to-accent/5" 
                    : "opacity-60 cursor-not-allowed"
                }`}
                style={isSpecialRoom ? {
                  border: `2px solid ${isSpecialRoom}`,
                  background: `linear-gradient(135deg, ${isSpecialRoom}15, ${isSpecialRoom}08)`,
                  boxShadow: `0 0 20px ${isSpecialRoom}50`
                } : undefined}
                onClick={() => room.hasData && navigate(`/chat/${room.id}`)}
              >
                {/* VIP3 Exclusive Badge - Top Left */}
                {isSpecialRoom && (
                  <div className="absolute top-1 left-1 z-10 animate-pulse">
                    <Badge 
                      className="px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-0.5"
                      style={{
                        background: `linear-gradient(135deg, ${isSpecialRoom}, ${isSpecialRoom}dd)`,
                        color: 'white',
                        border: 'none',
                        boxShadow: `0 0 15px ${isSpecialRoom}cc, 0 2px 8px ${isSpecialRoom}80`,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }}
                    >
                      <Crown className="w-2.5 h-2.5 animate-pulse" />
                      <span>EXCLUSIVE</span>
                    </Badge>
                  </div>
                )}

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
                    <p 
                      className="text-xs font-semibold leading-tight line-clamp-2"
                      style={isSpecialRoom ? { color: isSpecialRoom } : { color: 'hsl(var(--vip3-gold))' }}
                    >
                      {room.nameEn}
                    </p>
                    <p 
                      className="text-[10px] leading-tight line-clamp-2"
                      style={isSpecialRoom ? { color: `${isSpecialRoom}cc` } : { color: 'hsl(var(--vip3-gold)/0.8)' }}
                    >
                      {room.nameVi}
                    </p>
                  </div>
                </div>

                {/* Hover Effect */}
                {room.hasData && (
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    style={isSpecialRoom 
                      ? { background: `linear-gradient(135deg, ${isSpecialRoom}30, ${isSpecialRoom}20)` }
                      : { background: 'linear-gradient(to bottom right, hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.2))' }
                    }
                  />
                )}
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        <VIPNavigation currentPage="vip3" />
      </div>
    </div>
  );
};

export default RoomGridVIP3;
