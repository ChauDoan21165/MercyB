import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Crown, Sparkles, RefreshCw, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ALL_ROOMS } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { getRoomColor, getContrastTextColor, getHeadingColor } from '@/lib/roomColors';

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
  const { canAccessVIP3, isAdmin, loading } = useUserAccess();
  const { toast: toastHook } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefreshRooms = () => {
    setIsRefreshing(true);
    toastHook({
      title: "Refreshing rooms...",
      description: "Reloading room registry from files",
    });
    
    window.dispatchEvent(new Event('roomDataUpdated'));
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (loading || !canAccessVIP3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="VIP3 Premium Rooms"
        showBackButton={true}
      />
      
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip3))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-gray-700 font-medium">
                You are in VIP 3 area / Bạn đang ở khu vực VIP 3
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
              <div className="flex items-center justify-center gap-2">
                <Crown className="h-8 w-8" style={{ color: 'hsl(var(--vip3-primary))' }} />
                <Building2 className="h-8 w-8" style={{ color: 'hsl(var(--vip3-primary))' }} />
                <Sparkles className="h-8 w-8" style={{ color: 'hsl(var(--vip3-gold))' }} />
                <h1 className="text-4xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                  VIP3 Apartments
                </h1>
              </div>
              <p className="text-lg text-gray-700">
                Căn Hộ VIP3 Chuyên Biệt
              </p>
              <p className="text-sm text-gray-600">
                {(() => {
                  const vip3Rooms = ALL_ROOMS.filter(r => r.tier === 'vip3');
                  const apartments = new Set(vip3Rooms.map(r => 
                    r.id.includes('vip3_ii') ? 'VIP3 II' : 'VIP3 I'
                  ));
                  return `${apartments.size} apartments with ${vip3Rooms.length} exclusive rooms`;
                })()}
              </p>
            </div>
          </div>

          {/* Apartments - organized by specialization */}
          {(() => {
            const vip3Rooms = ALL_ROOMS.filter(r => r.tier === 'vip3');
            
            // Group rooms by apartment
            const roomsByApartment: Record<string, typeof vip3Rooms> = {};
            vip3Rooms.forEach(room => {
              const apartment = room.id.includes('vip3_ii') 
                ? 'VIP3 II – English Specialization Mastery' 
                : 'VIP3 I – Core Premium Rooms';
              if (!roomsByApartment[apartment]) {
                roomsByApartment[apartment] = [];
              }
              roomsByApartment[apartment].push(room);
            });
            
            // Sort apartments to show VIP3 I first
            const sortedApartments = Object.entries(roomsByApartment).sort(([a], [b]) => {
              if (a.includes('VIP3 I')) return -1;
              if (b.includes('VIP3 I')) return 1;
              return a.localeCompare(b);
            });

            return sortedApartments.map(([apartmentName, rooms]) => (
              <div key={apartmentName} className="mb-12">
                {/* Apartment Header */}
                <div className="mb-6 bg-white/50 backdrop-blur-sm rounded-lg p-6 border-2" style={{ borderColor: 'hsl(var(--vip3-primary))' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-8 w-8" style={{ color: 'hsl(var(--vip3-primary))' }} />
                    <h2 className="text-3xl font-bold text-gray-800">
                      {apartmentName}
                    </h2>
                  </div>
                  <p className="text-gray-600 ml-11">
                    {rooms.length} specialized room{rooms.length !== 1 ? 's' : ''} • 
                    {apartmentName.includes('English') ? ' Advanced Grammar & Academic English' : ' Diverse Premium Topics'}
                  </p>
                </div>

                {/* Room Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {rooms.map((room) => {
              const isSpecialRoom = VIP3_SPECIAL_ROOMS[room.id];
              const isSexualityCultureRoom = room.id === 'sexuality-and-curiosity-and-culture-vip3';
              const isFinanceRoom = room.id === 'finance-glory-vip3';

              return (
                <Card
                  key={room.id}
                  className={`relative p-3 transition-all duration-300 cursor-pointer group ${
                    room.hasData 
                      ? 'hover:scale-110 hover:shadow-hover hover:z-10 border-accent/50 bg-gradient-to-br from-background to-accent/5' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  style={
                    isSpecialRoom
                      ? {
                          border: `2px solid ${isSpecialRoom}`,
                          background: `linear-gradient(135deg, ${isSpecialRoom}15, ${isSpecialRoom}08)`,
                          boxShadow: `0 0 20px ${isSpecialRoom}50`,
                        }
                      : undefined
                  }
                  onClick={() => {
                    if (!room.hasData) return;
                    if (isSexualityCultureRoom) {
                      navigate('/sexuality-culture');
                    } else if (isFinanceRoom) {
                      navigate('/finance-calm');
                    } else {
                      navigate(`/chat/${room.id}`);
                    }
                  }}
                >
                  {/* Crown Badge - Bottom Right for Special Rooms */}
                  {isSpecialRoom && (
                    <div className="absolute bottom-2 right-2 z-10">
                      <div 
                        className="rounded-full p-1.5"
                        style={{
                          background: `linear-gradient(135deg, ${isSpecialRoom}, ${isSpecialRoom}dd)`,
                          boxShadow: `0 0 15px ${isSpecialRoom}cc, 0 4px 12px ${isSpecialRoom}80`,
                        }}
                      >
                        <Crown className="w-4 h-4 text-white" />
                      </div>
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
                        style={{
                          background: 'var(--gradient-rainbow)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {room.nameEn}
                      </p>
                      <p
                        className="text-[10px] leading-tight line-clamp-2"
                        style={{
                          background: 'var(--gradient-rainbow)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          opacity: 0.7
                        }}
                      >
                        {room.nameVi}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  {room.hasData && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      style={
                        isSpecialRoom
                          ? { background: `linear-gradient(135deg, ${isSpecialRoom}30, ${isSpecialRoom}20)` }
                          : {
                              background:
                                'linear-gradient(to bottom right, hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.2))',
                            }
                      }
                    />
                  )}
                </Card>
              );
            });
          })()}
        </div>

        {/* Navigation */}
        <VIPNavigation currentPage="vip3" />
        </div>
      </div>
    </div>
  );
};

export default RoomGridVIP3;
