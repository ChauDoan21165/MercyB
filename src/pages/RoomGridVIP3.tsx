import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Crown, Sparkles, RefreshCw, Building2, BookOpen, ChevronRight, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ALL_ROOMS } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { getRoomColor, getContrastTextColor, getHeadingColor } from '@/lib/roomColors';
import { highlightTextByRules } from "@/lib/wordColorHighlighter";
import { useColorMode } from '@/hooks/useColorMode';

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
  const { canAccessVIP3, isAdmin, isAuthenticated, loading } = useUserAccess();
  const { toast: toastHook } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { useColorTheme, toggleColorMode } = useColorMode();

  // Allow browsing for all users - they'll see restrictions in individual rooms
  // No redirect for unauthenticated users

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

  if (loading) {
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
                  VIP3 Premium Rooms
                </h1>
              </div>
              <p className="text-lg text-gray-700">
                Phòng VIP3 Chuyên Biệt
              </p>
              <p className="text-sm text-gray-600">
                {(() => {
                  const vip3Rooms = ALL_ROOMS.filter(r => r.tier === 'vip3');
                  const groups = new Set(vip3Rooms.map(r => 
                    r.id.includes('vip3_ii') ? 'VIP3 II' : 'VIP3 I'
                  ));
                  return `${groups.size} specialized collections with ${vip3Rooms.length} exclusive rooms`;
                })()}
              </p>
            </div>
          </div>

          {/* VIP3 II Navigation Card */}
          {canAccessVIP3 && (
            <div className="mb-8">
              <Card 
                className="p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-2"
                style={{ 
                  borderColor: 'hsl(220, 70%, 60%)',
                  background: 'linear-gradient(135deg, hsl(220, 70%, 98%), hsl(250, 70%, 98%))'
                }}
                onClick={() => navigate('/rooms-vip3-ii')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        VIP3 II – English Specialization Mastery
                      </h3>
                      <p className="text-gray-600">
                        Advanced Grammar & Academic English • Click to explore
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Làm Chủ Chuyên Ngành Tiếng Anh • Nhấp để khám phá
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-8 w-8 text-gray-400" />
                </div>
              </Card>
            </div>
          )}

          {/* VIP3 Collections - organized by specialization */}
          {(() => {
            const vip3Rooms = ALL_ROOMS.filter(r => r.tier === 'vip3');
            
            // Group rooms by collection
            const roomsByCollection: Record<string, typeof vip3Rooms> = {};
            vip3Rooms.forEach(room => {
              const collection = room.id.includes('vip3_ii') 
                ? 'VIP3 II – English Specialization Mastery' 
                : 'VIP3 I – Core Premium Rooms';
              if (!roomsByCollection[collection]) {
                roomsByCollection[collection] = [];
              }
              roomsByCollection[collection].push(room);
            });
            
            // Sort collections to show VIP3 I first
            const sortedCollections = Object.entries(roomsByCollection).sort(([a], [b]) => {
              if (a.includes('VIP3 I')) return -1;
              if (b.includes('VIP3 I')) return 1;
              return a.localeCompare(b);
            });

            return sortedCollections.map(([collectionName, rooms]) => (
              <div key={collectionName} className="mb-12">
                {/* Collection Header */}
                <div className="mb-6 bg-white/50 backdrop-blur-sm rounded-lg p-6 border-2" style={{ borderColor: 'hsl(var(--vip3-primary))' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-8 w-8" style={{ color: 'hsl(var(--vip3-primary))' }} />
                    <h2 className="text-3xl font-bold text-gray-800">
                      {collectionName}
                    </h2>
                  </div>
                  <p className="text-gray-600 ml-11">
                    {rooms.length} specialized room{rooms.length !== 1 ? 's' : ''} • 
                    {collectionName.includes('English') ? ' Advanced Grammar & Academic English' : ' Diverse Premium Topics'}
                  </p>
                </div>

                {/* Color Mode Toggle */}
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleColorMode}
                    className="gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    {useColorTheme ? 'Black & White' : 'Mercy Blade Colors'}
                  </Button>
                </div>

                {/* Room Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {rooms.map((room) => {
              const isSpecialRoom = VIP3_SPECIAL_ROOMS[room.id];
              const isSexualityCultureRoom = room.id === 'sexuality-and-curiosity-and-culture-vip3';
              const isFinanceRoom = room.id === 'finance-glory-vip3';
              const roomColor = getRoomColor(room.id);

              return (
                <Card
                  key={room.id}
                  className={`relative p-3 transition-all duration-300 cursor-pointer group ${
                    room.hasData 
                      ? 'hover:scale-110 hover:shadow-hover hover:z-10' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  style={
                    isSpecialRoom
                      ? {
                          border: `2px solid ${isSpecialRoom}`,
                          background: `linear-gradient(135deg, ${isSpecialRoom}15, ${isSpecialRoom}08)`,
                          boxShadow: `0 0 20px ${isSpecialRoom}50`,
                        }
                      : {
                          background: 'white',
                          border: '1px solid #e5e7eb'
                        }
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
                        className="text-xs font-bold leading-tight line-clamp-2"
                        style={useColorTheme 
                          ? { color: roomColor, fontWeight: 700 }
                          : { color: 'black' }
                        }
                      >
                        {room.nameEn}
                      </p>
                      <p
                        className="text-[10px] leading-tight line-clamp-2"
                        style={useColorTheme 
                          ? { color: roomColor, fontWeight: 600 }
                          : { color: '#4b5563' }
                        }
                      >
                        {room.nameVi}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  {room.hasData && (
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-gray-50"
                    />
                  )}
                </Card>
              );
            })}
                </div>
              </div>
            ));
          })()}
        </div>

        {/* Navigation */}
        <VIPNavigation currentPage="vip3" />
      </div>
    </div>
  );
};

export default RoomGridVIP3;
