import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { CheckCircle2, Lock, Crown, Sparkles, RefreshCw, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ALL_ROOMS } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const RoomGridVIP3II = () => {
  const navigate = useNavigate();
  const { canAccessVIP3II, isAdmin, loading } = useUserAccess();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !canAccessVIP3II) {
      navigate('/');
    }
  }, [canAccessVIP3II, loading, navigate]);

  const [roomsVersion, setRoomsVersion] = useState(0);
  useEffect(() => {
    const handle = () => setRoomsVersion(v => v + 1);
    window.addEventListener('rooms-loaded', handle as any);
    return () => window.removeEventListener('rooms-loaded', handle as any);
  }, []);

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

  if (loading || !canAccessVIP3II) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Filter only VIP3 II rooms (rooms with 'vip3_ii' in their ID)
  const vip3IIRooms = ALL_ROOMS.filter(r => r.id.includes('vip3_ii'));

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="VIP3 II - English Specialization Mastery"
        showBackButton={true}
      />
      
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(220, 70%, 95%), hsl(250, 70%, 95%))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-gray-700 font-medium">
                You are in VIP 3 II area / Bạn đang ở khu vực VIP 3 II
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
                <Crown className="h-8 w-8 text-purple-600" />
                <BookOpen className="h-8 w-8 text-blue-600" />
                <Sparkles className="h-8 w-8 text-indigo-600" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  VIP3 II – English Specialization Mastery
                </h1>
              </div>
              <p className="text-lg text-gray-700">
                Căn Hộ VIP3 II – Làm Chủ Chuyên Ngành Tiếng Anh
              </p>
              <p className="text-sm text-gray-600">
                {vip3IIRooms.length} specialized English grammar & academic rooms
              </p>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {vip3IIRooms.map((room) => (
              <Card
                key={room.id}
                className={`relative p-3 transition-all duration-300 cursor-pointer group ${
                  room.hasData 
                    ? 'hover:scale-110 hover:shadow-xl hover:z-10 border-purple-300 bg-gradient-to-br from-white to-purple-50' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (!room.hasData) return;
                  navigate(`/chat/${room.id}`);
                }}
              >
                {/* Crown Badge */}
                {room.hasData && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <div 
                      className="rounded-full p-1.5 bg-gradient-to-br from-purple-500 to-blue-600"
                      style={{
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.8)',
                      }}
                    >
                      <BookOpen className="w-4 h-4 text-white" />
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
                      className="text-xs font-semibold leading-tight line-clamp-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                    >
                      {room.nameEn}
                    </p>
                    <p
                      className="text-[10px] leading-tight line-clamp-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent opacity-70"
                    >
                      {room.nameVi}
                    </p>
                  </div>
                </div>

                {/* Hover Effect */}
                {room.hasData && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-gradient-to-br from-purple-200/30 to-blue-200/30"
                  />
                )}
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {vip3IIRooms.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <p className="text-gray-600">No VIP3 II rooms available yet</p>
              <p className="text-sm text-gray-500">Chưa có phòng VIP3 II</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <VIPNavigation currentPage="vip3_ii" />
      </div>
    </div>
  );
};

export default RoomGridVIP3II;
