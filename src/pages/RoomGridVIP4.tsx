import { Button } from "@/components/ui/button";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { ALL_ROOMS, Room } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { Briefcase, Crown, Lock, RefreshCw, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRoomColor, getContrastTextColor, getHeadingColor } from '@/lib/roomColors';
import { useColorMode } from '@/hooks/useColorMode';
import { highlightShortTitle } from '@/lib/wordColorHighlighter';

const VIP4_CAREER_ROOMS = [
  { id: "courage-to-begin", name: "Courage to Begin" },
  { id: "discover-self", name: "Discover Self" },
  { id: "explore-world", name: "Explore World" },
  { id: "build-skills", name: "Build Skills" },
  { id: "bridge-to-reality", name: "Bridge to Reality" },
  { id: "resilience-and-adaptation", name: "Resilience and Adaptation" },
  { id: "career-community", name: "Career Community" },
  { id: "launch-career", name: "Launch Career" },
  { id: "find-fit", name: "Find Fit" },
  { id: "grow-wealth", name: "Grow Wealth" },
  { id: "master-climb", name: "Master Climb" },
  { id: "lead-impact", name: "Lead Impact" }
];

const RoomGridVIP4 = () => {
  const navigate = useNavigate();
  const { canAccessVIP4, isAdmin, isAuthenticated, loading } = useUserAccess();
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { useColorTheme, toggleColorMode } = useColorMode();

  // Allow browsing for all users - they'll see restrictions in individual rooms
  // No redirect for unauthenticated users

  useEffect(() => {
    // Wait for access check to complete before redirecting
    if (loading) return;
    
    // Redirect if no VIP4 access
    if (!canAccessVIP4 && !isAdmin) {
      navigate("/");
      return;
    }

    // Filter for VIP4 rooms and sort alphabetically
    const vip4Rooms = ALL_ROOMS.filter(room => room.tier === 'vip4');
    const sortedRooms = vip4Rooms.sort((a, b) => {
      const aName = a.name || a.id;
      const bName = b.name || b.id;
      return aName.localeCompare(bName);
    });
    
    setRooms(sortedRooms);
  }, [canAccessVIP4, isAdmin, loading, navigate]);

  useEffect(() => {
    // Listen for room data updates
    const handleRoomDataUpdate = () => {
      const vip4Rooms = ALL_ROOMS.filter(room => room.tier === 'vip4');
      const sortedRooms = vip4Rooms.sort((a, b) => {
        const aName = a.name || a.id;
        const bName = b.name || b.id;
        return aName.localeCompare(bName);
      });
      setRooms(sortedRooms);
    };

    window.addEventListener('roomDataUpdated', handleRoomDataUpdate);
    return () => window.removeEventListener('roomDataUpdated', handleRoomDataUpdate);
  }, []);

  // Show loading state while checking access
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--page-vip4))' }}>
        <p className="text-muted-foreground">Loading... / Đang Tải...</p>
      </div>
    );
  }

  if (!canAccessVIP4 && !isAdmin) {
    return null;
  }

  const getRoomColorValue = (roomId: string): string => {
    return getRoomColor(roomId, 'career');
  };

  const getRoomStatus = (room: Room) => {
    return rooms.some(r => r.id === room.id) ? "available" : "locked";
  };

  const handleRefreshRooms = () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing rooms...",
      description: "Reloading room registry from files",
    });
    
    // Dispatch the event first
    window.dispatchEvent(new Event('roomDataUpdated'));
    
    // Then reload the page to pick up any new registry changes
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="VIP4 Career Consultance"
        showBackButton={true}
      />
      
      <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip4))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center space-y-4">
            <div className="flex items-center justify-end mb-4">
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

            <div className="flex items-center justify-center gap-3">
              <Briefcase className="h-12 w-12" style={{ color: 'hsl(var(--vip4-primary))' }} />
              <h1 className="text-4xl md:text-5xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                CareerZ - VIP4
              </h1>
              <Crown className="h-12 w-12" style={{ color: 'hsl(var(--vip4-gold))' }} />
            </div>

            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Career Consultance • Tư Vấn Nghề Nghiệp
            </p>
            
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              🎓 Your complete career guidance journey from self-discovery to leadership impact
              <br />
              Hành trình định hướng nghề nghiệp hoàn chỉnh từ khám phá bản thân đến tác động lãnh đạo
            </p>
            
            <p className="text-sm text-gray-600">
              Showing {ALL_ROOMS.filter(room => room.tier === "vip4").length} rooms
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                🌟 12 Career Rooms • 12 Phòng Nghề Nghiệp
              </Badge>
              <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700">
                💼 Professional Guidance • Hướng Dẫn Chuyên Nghiệp
              </Badge>
              <Badge variant="secondary" className="text-xs bg-rose-100 text-rose-700">
                🚀 Career Growth • Phát Triển Sự Nghiệp
              </Badge>
            </div>
          </div>

          {/* Career Journey Path */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Career Journey • Hành Trình Nghề Nghiệp
            </h2>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              {VIP4_CAREER_ROOMS.map((room, idx) => {
              const roomColor = getRoomColorValue(room.id);
              const headingColor = getHeadingColor(roomColor);
              return (
                <div key={room.id} className="flex items-center gap-2">
                  <Badge 
                    style={{ 
                      backgroundColor: roomColor, 
                      color: headingColor,
                      borderColor: headingColor
                    }}
                    className="px-3 py-1 border"
                  >
                    {idx + 1}. {room.name}
                  </Badge>
                  {idx < VIP4_CAREER_ROOMS.length - 1 && (
                    <span className="text-orange-400">→</span>
                  )}
                </div>
              );
            })}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-12">
          {rooms.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                Loading Career Rooms... / Đang Tải Phòng Nghề Nghiệp...
              </p>
            </div>
          ) : (
            rooms.map((room, index) => {
              const status = getRoomStatus(room);
              const roomColor = getRoomColorValue(room.id);
              const textColor = getContrastTextColor(roomColor);
              const headingColor = getHeadingColor(roomColor);
              const isLocked = status === "locked";

              return (
                <Card
                  key={room.id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isLocked
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:scale-105 hover:shadow-xl cursor-pointer"
                  }`}
                  style={
                    useColorTheme
                      ? {
                          borderLeft: `4px solid ${roomColor}`,
                          background: isLocked ? 'rgba(0,0,0,0.05)' : roomColor
                        }
                      : {
                          background: 'white',
                          border: '1px solid #e5e7eb'
                        }
                  }
                  onClick={() => !isLocked && navigate(`/chat/${room.id}`)}
                >
                  {/* Status Badge */}
                  {isLocked && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="secondary" className="bg-gray-500/80 text-white gap-1">
                        <Lock className="h-3 w-3" />
                        Locked
                      </Badge>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="space-y-2">
                      <h3 
                        className="font-bold text-lg leading-tight text-foreground"
                      >
                        {useColorTheme ? highlightShortTitle(room.nameEn, index, false) : room.nameEn}
                      </h3>
                      <p 
                        className="text-sm leading-tight text-muted-foreground"
                      >
                        {useColorTheme ? highlightShortTitle(room.nameVi, index, true) : room.nameVi}
                      </p>
                    </div>

                    <p className="text-sm line-clamp-2" style={{ color: useColorTheme ? textColor : '#6b7280' }}>
                      {room.description}
                    </p>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* VIP Navigation */}
        <VIPNavigation currentPage="vip4" />
        </div>
      </div>
    </div>
  );
};

export default RoomGridVIP4;
