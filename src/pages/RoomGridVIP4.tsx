import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { ALL_ROOMS, Room } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { Briefcase, Crown, Lock } from "lucide-react";

const VIP4_CAREER_ROOMS = [
  { id: "discover-self", color: "#4CAF50", name: "Discover Self" },
  { id: "explore-world", color: "#2196F3", name: "Explore World" },
  { id: "build-skills", color: "#1E88E5", name: "Build Skills" },
  { id: "launch-career", color: "#FF5722", name: "Launch Career" },
  { id: "find-fit", color: "#9C27B0", name: "Find Fit" },
  { id: "grow-wealth", color: "#FF9800", name: "Grow Wealth" },
  { id: "master-climb", color: "#009688", name: "Master Climb" },
  { id: "lead-impact", color: "#673AB7", name: "Lead Impact" }
];

const RoomGridVIP4 = () => {
  const navigate = useNavigate();
  const { canAccessVIP4, isAdmin, loading } = useUserAccess();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    // Wait for access check to complete before redirecting
    if (loading) return;
    
    // Redirect if no VIP4 access
    if (!canAccessVIP4 && !isAdmin) {
      navigate("/");
      return;
    }

    // Filter for VIP4 rooms
    const vip4Rooms = ALL_ROOMS.filter(room => room.tier === 'vip4');
    
    // Sort by career room order
    const sortedRooms = vip4Rooms.sort((a, b) => {
      const aIndex = VIP4_CAREER_ROOMS.findIndex(r => a.id.toLowerCase().includes(r.id));
      const bIndex = VIP4_CAREER_ROOMS.findIndex(r => b.id.toLowerCase().includes(r.id));
      return aIndex - bIndex;
    });
    
    setRooms(sortedRooms);
  }, [canAccessVIP4, isAdmin, loading, navigate]);

  useEffect(() => {
    // Listen for room data updates
    const handleRoomDataUpdate = () => {
      const vip4Rooms = ALL_ROOMS.filter(room => room.tier === 'vip4');
      const sortedRooms = vip4Rooms.sort((a, b) => {
        const aIndex = VIP4_CAREER_ROOMS.findIndex(r => a.id.toLowerCase().includes(r.id));
        const bIndex = VIP4_CAREER_ROOMS.findIndex(r => b.id.toLowerCase().includes(r.id));
        return aIndex - bIndex;
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

  const getRoomColor = (roomId: string): string => {
    const careerRoom = VIP4_CAREER_ROOMS.find(r => roomId.toLowerCase().includes(r.id));
    return careerRoom?.color || "#FF6B6B";
  };

  const getRoomStatus = (room: Room) => {
    return rooms.some(r => r.id === room.id) ? "available" : "locked";
  };

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip4))' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              ← Home / Trang Chủ
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Briefcase className="h-12 w-12 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'hsl(var(--vip4-gold))' }}>
              CareerZ - VIP4
            </h1>
            <Crown className="h-12 w-12" style={{ color: 'hsl(var(--vip4-gold))' }} />
          </div>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Career Consultance • Tư Vấn Nghề Nghiệp
          </p>
          
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            🎓 Your complete career guidance journey from self-discovery to leadership impact
            <br />
            Hành trình định hướng nghề nghiệp hoàn chỉnh từ khám phá bản thân đến tác động lãnh đạo
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">
              🌟 8 Career Rooms • 8 Phòng Nghề Nghiệp
            </Badge>
            <Badge variant="secondary" className="text-xs">
              💼 Professional Guidance • Hướng Dẫn Chuyên Nghiệp
            </Badge>
            <Badge variant="secondary" className="text-xs">
              🚀 Career Growth • Phát Triển Sự Nghiệp
            </Badge>
          </div>
        </div>

        {/* Career Journey Path */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'hsl(var(--vip4-gold))' }}>
            Your Career Journey • Hành Trình Nghề Nghiệp
          </h2>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {VIP4_CAREER_ROOMS.map((room, idx) => (
              <div key={room.id} className="flex items-center gap-2">
                <Badge 
                  style={{ backgroundColor: room.color, color: '#fff' }}
                  className="px-3 py-1"
                >
                  {idx + 1}. {room.name}
                </Badge>
                {idx < VIP4_CAREER_ROOMS.length - 1 && (
                  <span className="text-orange-400">→</span>
                )}
              </div>
            ))}
          </div>
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
            rooms.map((room) => {
              const status = getRoomStatus(room);
              const roomColor = getRoomColor(room.id);
              const isLocked = status === "locked";

              return (
                <Card
                  key={room.id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isLocked
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:scale-105 hover:shadow-xl cursor-pointer"
                  }`}
                  style={{
                    borderLeft: `4px solid ${roomColor}`,
                    background: isLocked
                      ? 'rgba(0,0,0,0.05)'
                      : `linear-gradient(135deg, ${roomColor}15 0%, ${roomColor}05 100%)`
                  }}
                  onClick={() => !isLocked && navigate(`/chat/${room.id}`)}
                >
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    {isLocked ? (
                      <Badge variant="secondary" className="bg-gray-500/80 text-white gap-1">
                        <Lock className="h-3 w-3" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-500/80 text-white gap-1">
                        <Crown className="h-3 w-3" />
                        Available
                      </Badge>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                        style={{ backgroundColor: roomColor }}
                      >
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 truncate">
                          {room.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {room.nameVi}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {room.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: roomColor, color: roomColor }}
                      >
                        VIP4 CareerZ
                      </Badge>
                      {!isLocked && (
                        <span className="text-xs text-muted-foreground">
                          Click to explore
                        </span>
                      )}
                    </div>
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
  );
};

export default RoomGridVIP4;
