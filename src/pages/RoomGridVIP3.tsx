import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { CheckCircle2, Lock, Crown, Sparkles, RefreshCw, Building2, ChevronRight, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useVipRooms } from '@/hooks/useVipRooms';
import { useToast } from "@/hooks/use-toast";
import { getRoomColor, getContrastTextColor, getHeadingColor } from '@/lib/roomColors';
import { highlightTextByRules, highlightShortTitle } from "@/lib/wordColorHighlighter";
import { useColorMode } from '@/hooks/useColorMode';
import { TIERS, ROOM_GRID_CLASS } from '@/lib/constants';
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";

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
  const { canAccessVIP3, isAdmin, loading: accessLoading } = useUserAccess();
  const { toast } = useToast();
  const { rooms, loading, error, refresh } = useVipRooms('vip3');
  const { useColorTheme, toggleColorMode } = useColorMode();
  
  // Prefetch first 5 rooms for instant navigation
  usePrefetchRooms(rooms || [], 5);

  const handleRefreshRooms = async () => {
    toast({
      title: "Refreshing rooms...",
      description: "Reloading VIP3 rooms",
    });
    refresh();
    toast({
      title: "Refreshed!",
      description: "VIP3 rooms updated",
    });
  };

  if (accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Filter out English Foundation Ladder rooms
  const vip3Rooms = rooms.filter(r => r.domain !== 'English Foundation Ladder');

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="VIP3 Premium Rooms"
        showBackButton={true}
      />
      
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip3))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                  disabled={loading}
                  className="flex items-center gap-2 bg-white/80"
                  aria-label="Refresh VIP3 rooms"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Refresh Rooms
                </Button>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Crown className="h-8 w-8" style={{ color: 'hsl(var(--vip3-primary))' }} aria-hidden="true" />
                <Building2 className="h-8 w-8" style={{ color: 'hsl(var(--vip3-primary))' }} aria-hidden="true" />
                <Sparkles className="h-8 w-8" style={{ color: 'hsl(var(--vip3-gold))' }} aria-hidden="true" />
                <h1 className="text-4xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                  VIP3 Premium Rooms
                </h1>
              </div>
              <p className="text-lg text-gray-700">
                Phòng VIP3 Chuyên Biệt
              </p>
              <p className="text-sm text-gray-600">
                {loading ? 'Loading...' : `${vip3Rooms.length} exclusive rooms`}
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
                onClick={() => navigate('/vip/vip3ii')}
                role="button"
                aria-label="Navigate to VIP3 II English Specialization"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                      <Building2 className="h-8 w-8 text-white" aria-hidden="true" />
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
                  <ChevronRight className="h-8 w-8 text-gray-400" aria-hidden="true" />
                </div>
              </Card>
            </div>
          )}

          {/* Color Mode Toggle */}
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleColorMode}
              className="gap-2"
              aria-label={useColorTheme ? 'Switch to black and white mode' : 'Switch to Mercy Blade colors'}
            >
              <Palette className="w-4 h-4" aria-hidden="true" />
              {useColorTheme ? 'Black & White' : 'Mercy Blade Colors'}
            </Button>
          </div>

          {loading && <div className="text-center py-8"><p className="text-muted-foreground">Loading VIP3 rooms...</p></div>}

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">Error loading rooms: {error.message}</p>
            </div>
          )}

          {/* Room Grid */}
          {!loading && vip3Rooms.length > 0 && (
            <div className={ROOM_GRID_CLASS}>
              {vip3Rooms.map((room, index) => {
                const isSpecialRoom = VIP3_SPECIAL_ROOMS[room.id];
                const isSexualityCultureRoom = room.id === 'sexuality-and-curiosity-and-culture-vip3';
                const isFinanceRoom = room.id === 'finance-glory-vip3';
                const hasData = room.entries && (Array.isArray(room.entries) ? room.entries.length > 0 : true);

                return (
                  <Card
                    key={room.id}
                    className={`relative p-3 transition-all duration-300 cursor-pointer group animate-fade-in ${
                      hasData 
                        ? 'hover:scale-110 hover:shadow-hover hover:z-10' 
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    style={
                      isSpecialRoom
                        ? {
                            border: `2px solid ${isSpecialRoom}`,
                            background: `linear-gradient(135deg, ${isSpecialRoom}15, ${isSpecialRoom}08)`,
                            boxShadow: `0 0 20px ${isSpecialRoom}50`,
                            animationDelay: `${index * 0.05}s`
                          }
                        : {
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            animationDelay: `${index * 0.05}s`
                          }
                    }
                    onClick={() => {
                      if (!hasData) return;
                      if (isSexualityCultureRoom) {
                        navigate('/sexuality-culture');
                      } else if (isFinanceRoom) {
                        navigate('/finance-calm');
                      } else {
                        navigate(`/room/${room.id}`);
                      }
                    }}
                    role="button"
                    tabIndex={hasData ? 0 : -1}
                    onKeyDown={(e) => {
                      if (hasData && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        if (isSexualityCultureRoom) {
                          navigate('/sexuality-culture');
                        } else if (isFinanceRoom) {
                          navigate('/finance-calm');
                        } else {
                          navigate(`/room/${room.id}`);
                        }
                      }
                    }}
                    aria-label={`${room.title_en} - ${room.title_vi}`}
                  >
                    {/* Crown Badge for Special Rooms */}
                    {isSpecialRoom && (
                      <div className="absolute bottom-2 right-2 z-10">
                        <div 
                          className="rounded-full p-1.5"
                          style={{
                            background: `linear-gradient(135deg, ${isSpecialRoom}, ${isSpecialRoom}dd)`,
                            boxShadow: `0 0 15px ${isSpecialRoom}cc, 0 4px 12px ${isSpecialRoom}80`,
                          }}
                        >
                          <Crown className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-1 right-1 z-10">
                      {hasData ? (
                        <div className="bg-green-500 rounded-full p-1">
                          <CheckCircle2 className="w-3 h-3 text-white" aria-hidden="true" />
                        </div>
                      ) : (
                        <div className="bg-gray-400 rounded-full p-1">
                          <Lock className="w-3 h-3 text-white" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <p
                          className={`text-xs leading-tight line-clamp-2 ${
                            useColorTheme ? 'text-foreground' : 'font-black text-black'
                          }`}
                          style={useColorTheme ? {} : { fontWeight: 900, color: '#000000' }}
                        >
                          {useColorTheme ? highlightShortTitle(room.title_en, index, false) : room.title_en}
                        </p>
                        <p
                          className={`text-[10px] leading-tight line-clamp-2 ${
                            useColorTheme ? 'text-muted-foreground' : 'font-black text-black'
                          }`}
                          style={useColorTheme ? {} : { fontWeight: 900, color: '#000000' }}
                        >
                          {useColorTheme ? highlightShortTitle(room.title_vi, index, true) : room.title_vi}
                        </p>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    {hasData && (
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-gray-50"
                        aria-hidden="true"
                      />
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <VIPNavigation currentPage="vip3" />
      </div>
    </div>
  );
};

export default RoomGridVIP3;
