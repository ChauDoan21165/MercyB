import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Gem, RefreshCw, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ALL_ROOMS } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { getRoomColor, getContrastTextColor, getHeadingColor } from '@/lib/roomColors';
import { highlightTextByRules, highlightShortTitle } from "@/lib/wordColorHighlighter";
import { useColorMode } from '@/hooks/useColorMode';

const RoomGridVIP2 = () => {
  const navigate = useNavigate();
  const { canAccessVIP2, isAdmin, isAuthenticated, loading } = useUserAccess();
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
        subtitle="VIP2 Learning Rooms"
        showBackButton={true}
      />
      
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip2))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-gray-700 font-medium">
                You are in VIP 2 area / Bạn đang ở khu vực VIP 2
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
                <Gem className="h-8 w-8" style={{ color: 'hsl(var(--vip2-primary))' }} />
                <h1 className="text-4xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                  VIP2 Learning Rooms
                </h1>
              </div>
              <p className="text-lg text-gray-700">
                Phòng Học VIP2
              </p>
              <p className="text-sm text-gray-600">
                Showing {ALL_ROOMS.filter(room => room.tier === "vip2").length} rooms
              </p>
          </div>
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
          {ALL_ROOMS.filter(room => room.tier === "vip2").sort((a, b) => {
            const aName = a.name || a.id;
            const bName = b.name || b.id;
            return aName.localeCompare(bName);
          }).map((room, index) => {
            const roomColor = getRoomColor(room.id);
            
            return (
            <Card
              key={room.id}
              className={`relative p-3 transition-all duration-300 cursor-pointer group ${
                room.hasData 
                  ? "hover:scale-110 hover:shadow-hover hover:z-10" 
                  : "opacity-60 cursor-not-allowed"
              }`}
              style={{ background: 'white', border: '1px solid #e5e7eb' }}
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
                  <p 
                    className="text-xs font-bold leading-tight line-clamp-2 text-foreground"
                  >
                    {useColorTheme ? highlightShortTitle(room.nameEn, index, false) : room.nameEn}
                  </p>
                  <p 
                    className="text-[10px] leading-tight line-clamp-2 text-muted-foreground"
                  >
                    {useColorTheme ? highlightShortTitle(room.nameVi, index, true) : room.nameVi}
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

        {/* Navigation */}
        <VIPNavigation currentPage="vip2" />
        </div>
      </div>
    </div>
  );
};

export default RoomGridVIP2;
