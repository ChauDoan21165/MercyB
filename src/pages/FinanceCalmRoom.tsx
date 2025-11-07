import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, DollarSign, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect } from "react";
import { useRoomProgress } from "@/hooks/useRoomProgress";

// Define sub-rooms for Finance VIP3
const SUB_ROOMS = [
  {
    id: 'finance-calm-money-sub1-vip3',
    nameEn: 'Money & Your Nervous System',
    nameVi: 'Tiền & Hệ Thống Thần Kinh',
    color: '#10B981' // Green
  },
  {
    id: 'finance-calm-money-sub2-vip3',
    nameEn: 'Money Basics That Actually Work',
    nameVi: 'Cơ Bản Về Tiền Thực Sự Hiệu Quả',
    color: '#3B82F6' // Blue
  },
  {
    id: 'finance-calm-money-sub3-vip3',
    nameEn: 'Growing Your Money with Less Worry',
    nameVi: 'Tăng Trưởng Tiền Với Ít Lo Lắng Hơn',
    color: '#8B5CF6' // Purple
  },
  {
    id: 'finance-calm-money-sub4-vip3',
    nameEn: 'Protecting What Matters',
    nameVi: 'Bảo Vệ Những Gì Quan Trọng',
    color: '#F59E0B' // Amber
  },
  {
    id: 'finance-calm-money-sub5-vip3',
    nameEn: 'Growing Bigger, Staying Grounded',
    nameVi: 'Phát Triển Lớn, Giữ Vững Nền Tảng',
    color: '#EF4444' // Red
  },
  {
    id: 'finance-calm-money-sub6-vip3',
    nameEn: 'Legacy & Peace of Mind',
    nameVi: 'Di Sản & Bình Yên Tâm Hồn',
    color: '#FBBF24' // Golden
  },
];

const FinanceCalmRoom = () => {
  const navigate = useNavigate();
  const { canAccessVIP3, loading } = useUserAccess();
  const { visitedRooms } = useRoomProgress();

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
  const completedRooms = SUB_ROOMS.filter(room => visitedRooms.has(room.id)).length;
  const progressPercentage = (completedRooms / SUB_ROOMS.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-vip3))' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
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
              <DollarSign className="h-8 w-8 text-[hsl(var(--vip3-gold))]" />
              <h1 className="text-4xl font-bold text-[hsl(var(--vip3-gold))]">
                Finance: Calm Money, Clear Future
              </h1>
            </div>
            <p className="text-lg text-[hsl(var(--vip3-gold))]/80">
              Tài Chính: Tiền Bình Yên, Tương Lai Rõ Ràng
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="max-w-md mx-auto bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-[hsl(var(--vip3-gold))]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[hsl(var(--vip3-gold))]">Your Progress</span>
              <span className="text-sm text-[hsl(var(--vip3-gold))]/80">{completedRooms} / {SUB_ROOMS.length} rooms</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                  background: 'linear-gradient(90deg, hsl(var(--vip3-gold)), hsl(var(--vip3-accent)))'
                }}
              />
            </div>
          </div>
        </div>

        {/* Sub-rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUB_ROOMS.map((room) => {
            const isVisited = visitedRooms.has(room.id);
            
            return (
              <Card
                key={room.id}
                className="relative p-6 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-hover hover:z-10"
                style={{
                  border: `2px solid ${room.color}`,
                  background: `linear-gradient(135deg, ${room.color}15, ${room.color}08)`,
                  boxShadow: `0 0 20px ${room.color}30`
                }}
                onClick={() => navigate(`/chat/${room.id}`)}
              >
                {/* Completion Badge */}
                {isVisited && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-green-500 rounded-full p-1.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${room.color}, ${room.color}dd)`,
                    boxShadow: `0 4px 12px ${room.color}40`
                  }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>

                {/* Room Names */}
                <div className="space-y-2">
                  <h3 
                    className="text-lg font-bold leading-tight"
                    style={{ color: room.color }}
                  >
                    {room.nameEn}
                  </h3>
                  <p 
                    className="text-sm leading-tight"
                    style={{ color: `${room.color}cc` }}
                  >
                    {room.nameVi}
                  </p>
                </div>

                {/* Hover Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${room.color}20, ${room.color}10)` }}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FinanceCalmRoom;
