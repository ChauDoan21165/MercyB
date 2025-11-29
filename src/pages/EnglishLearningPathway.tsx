import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, BookOpen, GraduationCap, Trophy, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { getRoomColor, getContrastTextColor, getHeadingColor } from '@/lib/roomColors';
import { highlightShortTitle } from "@/lib/wordColorHighlighter";
import { useColorMode } from '@/hooks/useColorMode';
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ROOMS_TABLE } from '@/lib/constants/rooms';

const EnglishLearningPathway = () => {
  const navigate = useNavigate();
  const { 
    canAccessVIP1, 
    canAccessVIP2, 
    canAccessVIP3, 
    isAdmin, 
    isAuthenticated, 
    loading 
  } = useUserAccess();
  const { useColorTheme, toggleColorMode } = useColorMode();

  // Fetch English Foundation Ladder rooms from database
  const { data: englishRooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['english-ladder-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(ROOMS_TABLE)
        .select('id, title_en, title_vi, tier, domain')
        .eq('domain', 'English Foundation Ladder')
        .order('id');
      
      if (error) throw error;
      
      return (data || []).map(room => ({
        id: room.id,
        name: room.title_en,
        nameVi: room.title_vi,
        tier: room.tier?.toLowerCase() || 'free',
        domain: room.domain,
        hasData: true
      }));
    }
  });

  if (loading || roomsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Group by progression level
  const foundation = englishRooms.filter(r => r.tier === "free");
  const a1 = englishRooms.filter(r => r.tier === "vip1");
  const a2b1 = englishRooms.filter(r => r.tier === "vip2");
  const b2c1c2 = englishRooms.filter(r => r.tier === "vip3");

  const levels = [
    {
      name: "English Foundation",
      nameVi: "Nền Tảng Tiếng Anh",
      tier: "Free",
      tierVi: "Miễn phí",
      icon: BookOpen,
      color: "hsl(var(--page-free))",
      badgeColor: "bg-gray-500",
      rooms: foundation,
      canAccess: true,
      description: "A0-A1 | Absolute beginners",
      descriptionVi: "A0-A1 | Người mới bắt đầu"
    },
    {
      name: "A1 Beginner English",
      nameVi: "Tiếng Anh A1 Cơ Bản",
      tier: "VIP1",
      tierVi: "VIP1",
      icon: GraduationCap,
      color: "hsl(var(--page-vip1))",
      badgeColor: "bg-blue-500",
      rooms: a1,
      canAccess: isAdmin || canAccessVIP1,
      description: "A1 | First confident steps",
      descriptionVi: "A1 | Bước đi tự tin đầu tiên"
    },
    {
      name: "A2 & B1 Pre-Intermediate / Intermediate",
      nameVi: "Tiếng Anh A2 & B1",
      tier: "VIP2",
      tierVi: "VIP2",
      icon: Trophy,
      color: "hsl(var(--page-vip2))",
      badgeColor: "bg-purple-500",
      rooms: a2b1,
      canAccess: isAdmin || canAccessVIP2,
      description: "A2-B1 | Real communication",
      descriptionVi: "A2-B1 | Giao tiếp thực tế"
    },
    {
      name: "B2, C1 & C2 Upper-Intermediate / Advanced",
      nameVi: "Tiếng Anh B2, C1 & C2",
      tier: "VIP3",
      tierVi: "VIP3",
      icon: Sparkles,
      color: "hsl(var(--page-vip3))",
      badgeColor: "bg-green-500",
      rooms: b2c1c2,
      canAccess: isAdmin || canAccessVIP3,
      description: "B2-C2 | Advanced fluency",
      descriptionVi: "B2-C2 | Thành thạo cao cấp"
    }
  ];

  const renderRoomCard = (room: any, canAccessLevel: boolean) => {
    const roomColor = getRoomColor(room.id);
    const canAccess = canAccessLevel;

    return (
      <Card
        key={room.id}
        className={`relative p-3 transition-all duration-300 cursor-pointer group ${
          room.hasData && canAccess
            ? "hover:scale-110 hover:shadow-hover hover:z-10" 
            : "opacity-60 cursor-not-allowed"
        }`}
        style={{ background: 'white', border: '1px solid #e5e7eb' }}
        onClick={() => {
          if (room.hasData && canAccess) {
            navigate(`/chat/${room.id}`);
          }
        }}
      >
        {/* Status Badge */}
        <div className="absolute top-1 right-1 z-10">
          {room.hasData && canAccess ? (
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
            <div 
              className="text-xs leading-tight" 
              style={{ 
                color: useColorTheme ? undefined : '#000000',
                fontWeight: useColorTheme ? undefined : 700
              }}
            >
              {useColorTheme 
                ? highlightShortTitle(room.name || room.id)
                : (room.name || room.id)}
            </div>
            {room.nameVi && (
              <div 
                className="text-[10px] leading-tight"
                style={{ 
                  color: useColorTheme ? undefined : '#000000',
                  fontWeight: useColorTheme ? undefined : 600
                }}
              >
                {useColorTheme 
                  ? highlightShortTitle(room.nameVi)
                  : room.nameVi}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="English Learning Pathway"
        showBackButton={true}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-green-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <BookOpen className="h-10 w-10 text-blue-600" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  English Learning Pathway
                </h1>
              </div>
              <p className="text-xl text-gray-700 font-medium">
                Lộ Trình Học Tiếng Anh
              </p>
              <p className="text-sm text-gray-600 max-w-3xl mx-auto">
                A complete learning journey from absolute beginner to confident, high-level communicator. 
                Progress through seven stages: Foundation → A1 → A2 → B1 → B2 → C1 → C2
              </p>
              <p className="text-sm text-gray-600 max-w-3xl mx-auto">
                Hành trình học hoàn chỉnh từ người mới bắt đầu đến người giao tiếp tự tin ở trình độ cao. 
                Tiến bộ qua bảy giai đoạn: Nền tảng → A1 → A2 → B1 → B2 → C1 → C2
              </p>
            </div>

            {/* Color Mode Toggle */}
            <div className="flex justify-end">
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
          </div>

          {/* Progression Levels */}
          <div className="space-y-12">
            {levels.map((level, idx) => (
              <div key={idx} className="space-y-4">
                {/* Level Header */}
                <div 
                  className="p-6 rounded-lg shadow-md"
                  style={{ backgroundColor: level.color }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <level.icon className="h-8 w-8 text-gray-800" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-gray-900">{level.name}</h2>
                          <Badge className={`${level.badgeColor} text-white`}>
                            {level.tier}
                          </Badge>
                        </div>
                        <p className="text-lg text-gray-700">{level.nameVi}</p>
                        <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                        <p className="text-sm text-gray-600">{level.descriptionVi}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-800">
                        {level.rooms.length} rooms
                      </p>
                      {!level.canAccess && (
                        <p className="text-sm text-gray-600">
                          Requires {level.tier}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Room Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {level.rooms
                    .sort((a, b) => {
                      const aName = a.name || a.id;
                      const bName = b.name || b.id;
                      return aName.localeCompare(bName);
                    })
                    .map((room) => renderRoomCard(room, level.canAccess))}
                </div>

                {level.rooms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No rooms available yet
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnglishLearningPathway;
