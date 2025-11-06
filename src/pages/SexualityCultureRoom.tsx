import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Crown, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useRoomProgress } from "@/hooks/useRoomProgress";
import { useEffect } from "react";

const SUB_ROOMS = [
  {
    id: "sexuality-curiosity-vip3-sub1",
    nameEn: "Foundations of Sexuality",
    nameVi: "Nền Tảng Về Tình Dục",
    color: "#EC4899"
  },
  {
    id: "sexuality-curiosity-vip3-sub2",
    nameEn: "Cultural Perspectives",
    nameVi: "Góc Nhìn Văn Hóa",
    color: "#8B5CF6"
  },
  {
    id: "sexuality-curiosity-vip3-sub3",
    nameEn: "Modern Relationships",
    nameVi: "Mối Quan Hệ Hiện Đại",
    color: "#F59E0B"
  },
  {
    id: "sexuality-curiosity-vip3-sub4",
    nameEn: "Communication & Consent",
    nameVi: "Giao Tiếp & Đồng Thuận",
    color: "#10B981"
  },
  {
    id: "sexuality-curiosity-vip3-sub5",
    nameEn: "Personal Identity",
    nameVi: "Bản Sắc Cá Nhân",
    color: "#06B6D4"
  },
  {
    id: "sexuality-curiosity-vip3-sub6",
    nameEn: "Well-being & Health",
    nameVi: "Sức Khỏe & Hạnh Phúc",
    color: "#EF4444"
  },
];

const SexualityCultureRoom = () => {
  const navigate = useNavigate();
  const { canAccessVIP3, loading } = useUserAccess();
  const progress = useRoomProgress();

  useEffect(() => {
    if (!loading && !canAccessVIP3) {
      navigate('/');
    }
  }, [canAccessVIP3, loading, navigate]);

  if (loading || !canAccessVIP3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Calculate progress
  const visitedSubRooms = SUB_ROOMS.filter(room => 
    progress.visits.some(visit => visit.roomId === room.id)
  );
  const completionCount = visitedSubRooms.length;
  const completionPercentage = (completionCount / SUB_ROOMS.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip3))' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-6">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/rooms-vip3")}
              className="flex items-center gap-2"
            >
              ← Back to VIP3 / Quay Lại VIP3
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-8 w-8" style={{ color: '#D946A6' }} />
              <h1 className="text-4xl font-bold" style={{ color: '#D946A6' }}>
                Sexuality, Culture & Curiosity
              </h1>
            </div>
            <p className="text-lg" style={{ color: '#D946A699' }}>
              Tình Dục, Văn Hóa & Tò Mò
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="max-w-2xl mx-auto space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-semibold text-lg">Your Progress</span>
              </div>
              <Badge 
                variant="secondary" 
                className="text-sm font-bold px-3 py-1"
                style={{ 
                  background: `linear-gradient(135deg, #D946A6, #8B5CF6)`,
                  color: 'white'
                }}
              >
                {completionCount} / {SUB_ROOMS.length} Completed
              </Badge>
            </div>
            
            <Progress value={completionPercentage} className="h-3" />
            
            <p className="text-sm text-muted-foreground text-center">
              {completionCount === 0 && "Start your journey through these curated topics"}
              {completionCount > 0 && completionCount < SUB_ROOMS.length && `${SUB_ROOMS.length - completionCount} rooms remaining`}
              {completionCount === SUB_ROOMS.length && "🎉 Congratulations! You've explored all rooms"}
            </p>
          </div>
        </div>

        {/* Sub-rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SUB_ROOMS.map((room) => {
            const isVisited = visitedSubRooms.some(v => v.id === room.id);
            
            return (
              <Card
                key={room.id}
                className="relative p-6 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:z-10"
                style={{
                  border: `2px solid ${room.color}`,
                  background: `linear-gradient(135deg, ${room.color}15, ${room.color}08)`,
                  boxShadow: `0 0 20px ${room.color}40`
                }}
                onClick={() => navigate(`/chat/${room.id}`)}
              >
                {/* Completion Badge */}
                {isVisited && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-green-500 rounded-full p-1.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Room Names */}
                  <div className="space-y-2">
                    <p 
                      className="text-lg font-bold leading-tight"
                      style={{ color: room.color }}
                    >
                      {room.nameEn}
                    </p>
                    <p 
                      className="text-sm leading-tight"
                      style={{ color: `${room.color}cc` }}
                    >
                      {room.nameVi}
                    </p>
                  </div>
                </div>

                {/* Hover Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${room.color}25, ${room.color}15)` 
                  }}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SexualityCultureRoom;
