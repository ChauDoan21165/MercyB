import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Crown, Sparkles, RefreshCw, BookOpen, ChevronLeft, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { highlightTextByRules } from "@/lib/wordColorHighlighter";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useRegistryVipRooms } from '@/hooks/useRegistryVipRooms';
import { VirtualizedRoomGrid } from '@/components/VirtualizedRoomGrid';
import { RoomGridSkeleton } from '@/components/RoomCardSkeleton';
import { TIERS, ROOM_GRID_CLASS } from '@/lib/constants';
import { usePrefetchRooms } from "@/hooks/usePrefetchRooms";
import { VIPLockedAccess } from "@/components/VIPLockedAccess";

const RoomGridVIP3II = () => {
  const navigate = useNavigate();
  const { canAccessVIP3II, isAdmin, isHighAdmin, loading: accessLoading } = useUserAccess();
  const hasAccess = canAccessVIP3II || isHighAdmin; // Admin bypass
  const { toast } = useToast();
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const { data: rooms, isLoading: loading, error, refetch: refresh } = useRegistryVipRooms('vip3ii');
  
  // Prefetch first 5 rooms for instant navigation
  usePrefetchRooms(rooms || [], 5);

  const handleRefreshRooms = async () => {
    toast({
      title: "Refreshing rooms...",
      description: "Reloading VIP3 II rooms",
    });
    refresh();
    toast({
      title: "Refreshed!",
      description: "VIP3 II rooms updated",
    });
  };

  if (accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return <VIPLockedAccess tier="vip3ii" tierLabel="VIP3 II" backgroundColor="hsl(220, 70%, 95%)" />;
  }

  // Use all rooms returned by the registry hook - no double filtering needed
  // The hook already filters by vip3ii tier
  const vip3IIRooms = rooms || [];

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="VIP3 II - Core Specialization"
        showBackButton={true}
      />
      
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(340, 70%, 95%), hsl(320, 70%, 95%))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-gray-700 font-medium">
                VIP3 II — Core Specialization / Chuyên Biệt Cốt Lõi
              </span>
              
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshRooms}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white/80"
                  aria-label="Refresh VIP3 II rooms"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Refresh Rooms
                </Button>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Crown className="h-8 w-8 text-rose-600" aria-hidden="true" />
                <BookOpen className="h-8 w-8 text-pink-600" aria-hidden="true" />
                <Sparkles className="h-8 w-8 text-red-600" aria-hidden="true" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  {highlightTextByRules("VIP3 II – Core Specialization", false)}
                </h1>
              </div>
              <p className="text-lg text-gray-700">
                {highlightTextByRules("Chuyên Biệt Cốt Lõi — Chủ Đề Nhạy Cảm & Nâng Cao", true)}
              </p>
              <p className="text-sm text-gray-600">
                {loading ? 'Loading...' : `${vip3IIRooms.length} specialized core rooms — Sexuality, Finance, Psychology, Philosophy`}
              </p>
            </div>
          </div>

          {/* Introduction Card */}
          <Card className="mb-8 bg-white/80 backdrop-blur shadow-lg border-2 border-rose-200">
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg" aria-hidden="true">
                  VIP3 II
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">VIP3 II — Core Specialization Block</h2>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {highlightTextByRules("VIP3 II contains large and sensitive topics that require dedicated space: Sexuality & Sex Education, Finance & Money Psychology, Schizophrenia Mastery, Emotional Well-being, Heavy Psychological Topics, and Large Philosophical Clusters. These are CORE topics, not English lessons. VIP3 users have full access to this specialization block.", false)}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Khối Chuyên Biệt Cốt Lõi VIP3 II</h2>
                    <p className="text-gray-800 leading-relaxed">
                      {highlightTextByRules("VIP3 II chứa các chủ đề lớn và nhạy cảm cần không gian riêng: Tình Dục & Giáo Dục Giới Tính, Tài Chính & Tâm Lý Tiền Bạc, Làm Chủ Tâm Thần Phân Liệt, Sức Khỏe Cảm Xúc, Các Chủ Đề Tâm Lý Nặng, và Các Cụm Triết Học Lớn. Đây là các chủ đề CỐT LÕI, không phải bài học tiếng Anh. Người dùng VIP3 có quyền truy cập đầy đủ vào khối chuyên biệt này.", true)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Back to VIP3 Navigation Card */}
          <div className="mb-8">
            <Card 
              className="p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-2"
              style={{ 
                borderColor: 'hsl(var(--vip3-primary))',
                background: 'linear-gradient(135deg, hsl(var(--vip3-primary) / 0.1), hsl(var(--vip3-gold) / 0.1))'
              }}
              onClick={() => navigate('/vip/vip3')}
              role="button"
              aria-label="Back to VIP3 Main Collection"
            >
              <div className="flex items-center justify-between">
                <ChevronLeft className="h-8 w-8 text-gray-400" aria-hidden="true" />
                <div className="flex items-center gap-4 flex-1 ml-4">
                  <div className="p-3 rounded-full" style={{ background: 'hsl(var(--gradient-rainbow))' }}>
                    <Building2 className="h-8 w-8 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                      Back to VIP3 Main Collection
                    </h3>
                    <p className="text-gray-600">
                      Core Premium Rooms • Diverse Topics
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Quay lại Bộ sưu tập VIP3 Chính • Chủ đề Đa dạng
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {loading && <RoomGridSkeleton count={24} />}

          {!loading && vip3IIRooms.length > 0 && (
            <div className={ROOM_GRID_CLASS}>
              {vip3IIRooms.map((room, index) => {
                const hasData = room.hasData !== false; // Use hasData from registry
                
                return (
                  <Card
                    key={room.id}
                    className={`relative p-3 transition-all duration-300 cursor-pointer group animate-fade-in ${
                      hasData 
                        ? 'hover:scale-110 hover:shadow-xl hover:z-10' 
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    style={{ 
                      background: 'white', 
                      border: '1px solid #e5e7eb',
                      animationDelay: `${index * 0.05}s`
                    }}
                    onClick={() => {
                      if (!hasData) return;
                      console.log('[RoomClick] Opening room:', room.id);
                      navigate(`/room/${room.id}`);
                    }}
                    role="button"
                    tabIndex={hasData ? 0 : -1}
                    onKeyDown={(e) => {
                      if (hasData && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        navigate(`/room/${room.id}`);
                      }
                    }}
                    aria-label={`${room.title_en} - ${room.title_vi}`}
                  >
                    {/* Crown Badge */}
                    {hasData && (
                      <div className="absolute bottom-2 right-2 z-10">
                        <div 
                          className="rounded-full p-1.5 bg-gradient-to-br from-purple-500 to-blue-600"
                          style={{
                            boxShadow: '0 0 15px rgba(139, 92, 246, 0.8)',
                          }}
                        >
                          <BookOpen className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <p className="text-xs font-bold leading-tight line-clamp-2 text-foreground">
                          {room.title_en}
                        </p>
                        <p className="text-[10px] leading-tight line-clamp-2 text-muted-foreground">
                          {room.title_vi}
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

          {/* Empty State */}
          {!loading && vip3IIRooms.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-purple-300 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-600">No VIP3 II rooms available yet</p>
              <p className="text-sm text-gray-500">Chưa có phòng VIP3 II</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">Error loading rooms: {error.message}</p>
            </div>
          )}
        </div>

        <VIPNavigation currentPage="vip3ii" />
      </div>
    </div>
  );
};

export default RoomGridVIP3II;
