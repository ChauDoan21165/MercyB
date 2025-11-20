import { Button } from "@/components/ui/button";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { ALL_ROOMS, Room } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { Lock, RefreshCw, BookOpen, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { getRoomColor, getContrastTextColor, getHeadingColor } from '@/lib/roomColors';

const RoomGridVIP6 = () => {
  const navigate = useNavigate();
  const { canAccessVIP6, isAdmin, isAuthenticated, loading } = useUserAccess();
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    if (!canAccessVIP6 && !isAdmin) {
      navigate("/");
      return;
    }

    const vip6Rooms = ALL_ROOMS.filter(room => room.tier === 'vip6');
    const sortedRooms = vip6Rooms.sort((a, b) => {
      const aName = a.name || a.id;
      const bName = b.name || b.id;
      return aName.localeCompare(bName);
    });
    
    setRooms(sortedRooms);
  }, [canAccessVIP6, isAdmin, loading, navigate]);

  useEffect(() => {
    const handleRoomDataUpdate = () => {
      const vip6Rooms = ALL_ROOMS.filter(room => room.tier === 'vip6');
      const sortedRooms = vip6Rooms.sort((a, b) => {
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--page-vip6))' }}>
        <p className="text-muted-foreground">Loading... / Đang Tải...</p>
      </div>
    );
  }

  if (!canAccessVIP6 && !isAdmin) {
    return null;
  }

  const getRoomColorValue = (roomId: string): string => {
    return getRoomColor(roomId, 'shadow');
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
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip6))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ColorfulMercyBladeHeader />
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8" style={{ color: 'hsl(var(--vip6-primary))' }} />
            <h1 className="text-3xl font-bold" style={{ color: getHeadingColor('vip6', 'shadow') }}>
              VIP6 — Shadow & Deep Psychology
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto mb-2">
            VIP6 opens a dedicated universe for shadow work, inner child healing, trauma patterns, subconscious identity, and emotional integration. This tier helps users understand the hidden forces shaping their reactions, choices, relationships, and life direction.
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto mb-8">
            VIP6 mở ra một vũ trụ riêng dành cho bóng tối nội tâm, chữa lành đứa trẻ bên trong, mô thức tổn thương, bản sắc tiềm thức và sự tích hợp cảm xúc. Cấp độ này giúp người dùng hiểu những lực vô hình đang định hình phản ứng, lựa chọn, các mối quan hệ và hướng đi cuộc sống.
          </p>
        </div>

        <VIPNavigation currentPage="vip6" />

        <div className="flex items-center justify-between mb-6 mt-8">
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: 'hsl(var(--vip6-primary))' }}>
              Shadow Work & Deep Psychology Rooms
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {rooms.length} room{rooms.length !== 1 ? 's' : ''} available / {rooms.length} phòng
            </p>
          </div>
          <Button 
            onClick={handleRefreshRooms} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {rooms.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No VIP6 Rooms Available Yet</h3>
            <p className="text-muted-foreground mb-4">
              Shadow work and deep psychology rooms are being prepared for you.
            </p>
            <p className="text-sm text-muted-foreground">
              Các phòng về công việc bóng tối và tâm lý học sâu đang được chuẩn bị cho bạn.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const roomColor = getRoomColorValue(room.id);
              const textColor = getContrastTextColor(roomColor);
              const isLocked = room.is_locked;

              return (
                <Card
                  key={room.id}
                  className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2"
                  style={{
                    background: `linear-gradient(135deg, ${roomColor}15 0%, ${roomColor}25 100%)`,
                    borderColor: 'hsl(var(--vip6-accent) / 0.3)',
                  }}
                  onClick={() => !isLocked && navigate(`/chat/${room.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: 'hsl(var(--vip6-primary) / 0.15)',
                          color: 'hsl(var(--vip6-primary))',
                          borderColor: 'hsl(var(--vip6-primary) / 0.3)',
                        }}
                      >
                        VIP6
                      </Badge>
                      {isLocked && (
                        <Lock className="w-5 h-5" style={{ color: 'hsl(var(--vip6-primary))' }} />
                      )}
                    </div>

                    <h3 
                      className="text-xl font-bold mb-2 transition-colors"
                      style={{ color: 'hsl(var(--vip6-primary))' }}
                    >
                      {room.name || room.id}
                    </h3>

                    {room.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {room.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      {room.keywords?.slice(0, 3).map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-white/50"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomGridVIP6;
