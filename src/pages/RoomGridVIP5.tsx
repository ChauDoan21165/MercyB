import { Button } from "@/components/ui/button";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { ALL_ROOMS, Room } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { Lock, RefreshCw, BookOpen, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRoomColor, getContrastTextColor, getHeadingColor } from '@/lib/roomColors';
import { useColorMode } from '@/hooks/useColorMode';

const RoomGridVIP5 = () => {
  const navigate = useNavigate();
  const { canAccessVIP5, isAdmin, isAuthenticated, loading } = useUserAccess();
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { useColorTheme, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (loading) return;
    
    if (!canAccessVIP5 && !isAdmin) {
      navigate("/");
      return;
    }

    const vip5Rooms = ALL_ROOMS.filter(room => room.tier === 'vip5');
    const sortedRooms = vip5Rooms.sort((a, b) => {
      const aName = a.name || a.id;
      const bName = b.name || b.id;
      return aName.localeCompare(bName);
    });
    
    setRooms(sortedRooms);
  }, [canAccessVIP5, isAdmin, loading, navigate]);

  useEffect(() => {
    const handleRoomDataUpdate = () => {
      const vip5Rooms = ALL_ROOMS.filter(room => room.tier === 'vip5');
      const sortedRooms = vip5Rooms.sort((a, b) => {
        const aName = a.name || a.id;
        const bName = b.name || b.id;
        return aName.localeCompare(bName);
      });
      setRooms(sortedRooms);
    };

    window.addEventListener('roomDataUpdated', handleRoomDataUpdate);
    return () => window.removeEventListener('roomDataUpdated', handleRoomDataUpdate);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--page-vip5))' }}>
        <p className="text-muted-foreground">Loading... / Đang Tải...</p>
      </div>
    );
  }

  if (!canAccessVIP5 && !isAdmin) {
    return null;
  }

  const getRoomColorValue = (roomId: string): string => {
    return getRoomColor(roomId, 'writing');
  };

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

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip5))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ColorfulMercyBladeHeader />
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold" style={{ color: getHeadingColor('vip5', 'writing') }}>
              VIP5 - English Writing Master Support
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto mb-2">
            VIP5 offers complete English writing support. Students write, and AI gives expert feedback: strengths, mistakes, clarity fixes, rewriting steps, and IELTS-style comments.
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto mb-8">
            VIP5 mang đến hỗ trợ viết tiếng Anh toàn diện. Học viên viết, AI phân tích và phản hồi rõ ràng: điểm mạnh, lỗi sai, cách cải thiện, bước viết lại và nhận xét theo chuẩn IELTS.
          </p>
        </div>

        <VIPNavigation currentPage="vip5" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: getHeadingColor('vip5', 'writing') }}>
            VIP5 Writing Rooms ({rooms.length})
          </h2>
          <Button 
            onClick={handleRefreshRooms}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Rooms
          </Button>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                No VIP5 Rooms Available Yet
              </h3>
              <p className="text-muted-foreground">
                VIP5 writing rooms are being created. Check back soon!
              </p>
            </div>
          ) : (
            rooms.map((room) => (
              <Card
                key={room.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 overflow-hidden"
                onClick={() => navigate(`/chat/${room.id}`)}
                style={useColorTheme ? { 
                  borderColor: getRoomColorValue(room.id),
                  backgroundColor: `${getRoomColorValue(room.id)}10`
                } : {
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white'
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 
                      className="text-lg font-semibold group-hover:underline flex-1"
                      style={{ color: getRoomColorValue(room.id) }}
                    >
                      {room.name || room.id}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className="ml-2 shrink-0"
                      style={{
                        backgroundColor: getRoomColorValue(room.id),
                        color: getContrastTextColor(getRoomColorValue(room.id))
                      }}
                    >
                      VIP5
                    </Badge>
                  </div>
                  
                  {room.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {room.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>English Writing Support</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomGridVIP5;
