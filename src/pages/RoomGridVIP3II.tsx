import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { CheckCircle2, Lock, Crown, Sparkles, RefreshCw, BookOpen, ChevronLeft, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ALL_ROOMS } from "@/lib/roomData";
import { VIPNavigation } from "@/components/VIPNavigation";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { highlightTextByRules } from "@/lib/wordColorHighlighter";
import { AudioPlayer } from "@/components/AudioPlayer";

const RoomGridVIP3II = () => {
  const navigate = useNavigate();
  const { canAccessVIP3II, isAdmin, isAuthenticated, loading } = useUserAccess();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);

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
    toast({
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

  // Filter only VIP3 II rooms (rooms with '-vip3-ii' in their ID)
  const vip3IIRooms = ALL_ROOMS.filter(r => r.id.includes('-vip3-ii'));

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="VIP3 II - English Specialization Mastery"
        showBackButton={true}
      />
      
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(220, 70%, 95%), hsl(250, 70%, 95%))' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-gray-700 font-medium">
                You are in VIP 3 II area / Bạn đang ở khu vực VIP 3 II
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
                <Crown className="h-8 w-8 text-purple-600" />
                <BookOpen className="h-8 w-8 text-blue-600" />
                <Sparkles className="h-8 w-8 text-indigo-600" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {highlightTextByRules("VIP3 II – English Specialization Mastery", false)}
                </h1>
              </div>
              <p className="text-lg text-gray-700">
                {highlightTextByRules("VIP3 II – Làm Chủ Chuyên Ngành Tiếng Anh", true)}
              </p>
              <p className="text-sm text-gray-600">
                {vip3IIRooms.length} specialized English grammar & academic rooms
              </p>
            </div>
          </div>

          {/* Introduction Card */}
          <Card className="mb-8 bg-white/80 backdrop-blur shadow-lg border-2 border-purple-200">
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                  VIP3 II
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Introduction for VIP3 II – English Specialization Mastery</h2>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {highlightTextByRules("VIP3 II – English Specialization Mastery is the highest tier of English training in this entire ecosystem. Here, you go beyond learning English—you think in English, write with precision, and command language at a professional, academic, and creative level. This room brings together everything we have built: advanced writing science, deep grammar logic, meta-cognition, sentence engineering, and long-form mastery. From foundational structure to elite expression, from technical clarity to artistic fluency—you will train like a true language specialist. If VIP1 and VIP2 help you speak and write better, VIP3 II transforms you into someone who understands English at its core.", false)}
                    </p>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                      <AudioPlayer
                        audioPath="/audio/vip3_ii_english_specialization_mastery.mp3"
                        isPlaying={isIntroPlaying}
                        onPlayPause={() => setIsIntroPlaying(!isIntroPlaying)}
                        onEnded={() => setIsIntroPlaying(false)}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Giới Thiệu Cho VIP3 II – Làm Chủ Chuyên Ngành Tiếng Anh</h2>
                    <p className="text-gray-800 leading-relaxed">
                      {highlightTextByRules("VIP3 II – Làm Chủ Chuyên Ngành Tiếng Anh là cấp độ cao nhất trong toàn bộ hệ thống đào tạo tiếng Anh. Tại đây, bạn không chỉ học tiếng Anh—bạn tư duy bằng tiếng Anh, viết với độ chính xác cao, và làm chủ ngôn ngữ ở mức chuyên nghiệp, học thuật và sáng tạo. Phòng này kết nối tất cả những gì chúng ta đã xây dựng: khoa học viết nâng cao, tư duy ngữ pháp sâu, siêu nhận thức, kỹ thuật kiến tạo câu, và làm chủ bài viết dài. Từ nền tảng đến đỉnh cao, từ sự rõ ràng kỹ thuật đến biểu đạt tinh tế—bạn sẽ được rèn luyện như một chuyên gia ngôn ngữ thực thụ. Nếu VIP1 và VIP2 giúp bạn nói và viết tốt hơn, VIP3 II biến bạn thành người hiểu tiếng Anh tận gốc.", true)}
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
              onClick={() => navigate('/rooms-vip3')}
            >
              <div className="flex items-center justify-between">
                <ChevronLeft className="h-8 w-8 text-gray-400" />
                <div className="flex items-center gap-4 flex-1 ml-4">
                  <div className="p-3 rounded-full" style={{ background: 'hsl(var(--gradient-rainbow))' }}>
                    <Building2 className="h-8 w-8 text-white" />
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

          {/* Rooms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {vip3IIRooms.map((room) => (
              <Card
                key={room.id}
                className={`relative p-3 transition-all duration-300 cursor-pointer group ${
                  room.hasData 
                    ? 'hover:scale-110 hover:shadow-xl hover:z-10' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                style={{ background: 'white', border: '1px solid #e5e7eb' }}
                onClick={() => {
                  if (!room.hasData) return;
                  navigate(`/chat/${room.id}`);
                }}
              >
                {/* Crown Badge */}
                {room.hasData && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <div 
                      className="rounded-full p-1.5 bg-gradient-to-br from-purple-500 to-blue-600"
                      style={{
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.8)',
                      }}
                    >
                      <BookOpen className="w-4 h-4 text-white" />
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
                      style={{ color: '#4f46e5', fontWeight: 700 }}
                    >
                      {room.nameEn}
                    </p>
                    <p
                      className="text-[10px] leading-tight line-clamp-2"
                      style={{ color: '#4f46e5', fontWeight: 600 }}
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
            ))}
          </div>

          {/* Empty State */}
          {vip3IIRooms.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <p className="text-gray-600">No VIP3 II rooms available yet</p>
              <p className="text-sm text-gray-500">Chưa có phòng VIP3 II</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <VIPNavigation currentPage="vip3_ii" />
      </div>
    </div>
  );
};

export default RoomGridVIP3II;
