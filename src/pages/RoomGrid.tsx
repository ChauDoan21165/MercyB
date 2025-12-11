import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { useCachedRooms } from "@/hooks/useCachedRooms";
import { RoomGridSkeleton } from "@/components/RoomCardSkeleton";
import { VirtualizedRoomGrid } from "@/components/VirtualizedRoomGrid";
import { LowDataModeToggle } from "@/components/LowDataModeToggle";
import { getDemoRooms } from "@/hooks/useDemoMode";

// Free introduction rooms (still use golden to attract attention)
const FREE_INTRO_ROOMS: Record<string, string> = {
  "finance-calm-money-clear-future-preview-free": "#FFD700",
  "sexuality-and-curiosity-free": "#FFD700",
  "career-consultant-free": "#FFD700",
};

// 3-lane detector: English (left), Core (middle), Life Skills (right)
const getLane = (room: any): "english" | "core" | "life" => {
  const d = (room.domain || "").trim().toLowerCase();
  const slug = (room.slug || room.id || "").trim().toLowerCase();
  const title = (room.title_en || room.title || "").trim().toLowerCase();

  // Domain overrides
  if (d === "english") return "english";
  if (d === "life") return "life";
  if (d === "core") return "core";

  // English detection
  if (
    slug.includes("english") ||
    slug.includes("ef-") ||
    slug.startsWith("eng-") ||
    slug.includes("ielts") ||
    slug.includes("toeic") ||
    slug.includes("toefl") ||
    slug.includes("grammar") ||
    title.includes("english")
  ) {
    return "english";
  }

  // Life skills / survival detection
  if (
    slug.includes("safety") ||
    slug.includes("survival") ||
    slug.includes("life-skill") ||
    slug.includes("life_skill") ||
    slug.includes("emergency") ||
    slug.includes("srs-") ||
    slug.includes("money") ||
    slug.includes("finance") ||
    slug.includes("productivity") ||
    slug.includes("career") ||
    slug.includes("relationship") ||
    slug.includes("nutrition") ||
    title.includes("survival") ||
    title.includes("safety")
  ) {
    return "life";
  }

  // Everything else = CORE Mercy Blade (health, stress, AI, God, etc.)
  return "core";
};

const RoomGrid = () => {
  const navigate = useNavigate();
  const { isAdmin, isDemoMode } = useUserAccess();
  const { toast } = useToast();
  const [demoRoomIds, setDemoRoomIds] = useState<string[]>([]);

  // Use cached rooms hook - fetch ALL rooms
  const { data: cachedRooms, isLoading, refetch } = useCachedRooms();

  // Free rooms → split into 3 lanes: English | Core | Life Skills
  const { englishRooms, coreRooms, lifeRooms } = useMemo(() => {
    if (!cachedRooms) {
      return { englishRooms: [], coreRooms: [], lifeRooms: [] };
    }

    const freeRooms = cachedRooms.filter((room: any) => room.tier === "free");

    const english: any[] = [];
    const core: any[] = [];
    const life: any[] = [];

    freeRooms.forEach((room: any) => {
      const lane = getLane(room);
      if (lane === "english") english.push(room);
      else if (lane === "life") life.push(room);
      else core.push(room);
    });

    return { englishRooms: english, coreRooms: core, lifeRooms: life };
  }, [cachedRooms]);

  const totalRoomCount =
    englishRooms.length + coreRooms.length + lifeRooms.length;

  const handleRoomClick = (room: any) => {
    // Always allow navigation - access control happens in ChatHub
    navigate(`/room/${room.id}`);
  };

  const handleRefreshRooms = async () => {
    toast({
      title: "Refreshing rooms...",
      description: "Reloading room data from cache",
    });

    await refetch();

    toast({
      title: "Refreshed!",
      description: "Room data updated successfully",
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <ColorfulMercyBladeHeader
          subtitle="Free Rooms"
          showBackButton={true}
        />

        <div
          className="min-h-screen"
          style={{ background: "hsl(var(--page-roomgrid))" }}
        >
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg text-gray-700 font-medium">
                  You are in free of charge area / Bạn đang ở khu vực miễn phí
                </span>

                <div className="flex gap-2">
                  <LowDataModeToggle />
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshRooms}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-white/80"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          isLoading ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                  )}
                </div>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                  Choose Your Learning Room
                </h1>
                <p className="text-lg text-muted-foreground">
                  Chọn Phòng Học Của Bạn
                </p>
                <p className="text-sm text-muted-foreground/80">
                  {isLoading ? "Loading..." : `Showing ${totalRoomCount} rooms`}
                </p>
              </div>
            </div>

            {/* Loading skeleton */}
            {isLoading && <RoomGridSkeleton count={24} />}

            {/* Empty state message */}
            {!isLoading && totalRoomCount === 0 && (
              <div className="mt-12 text-center space-y-4 max-w-xl mx-auto">
                <p className="text-base text-muted-foreground">
                  No free tier rooms are available right now.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshRooms}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh / Làm mới
                </Button>
              </div>
            )}

            {/* LEFT: English Pathway */}
            {!isLoading && englishRooms.length > 0 && (
              <div className="space-y-4 mb-10">
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-semibold text-foreground">
                    English Pathway — Free
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Nền Tảng & Lộ Trình Tiếng Anh
                  </p>
                </div>
                <VirtualizedRoomGrid
                  rooms={englishRooms}
                  onRoomClick={handleRoomClick}
                  highlightColors={FREE_INTRO_ROOMS}
                />
              </div>
            )}

            {/* MIDDLE: Core Mercy Blade */}
            {!isLoading && coreRooms.length > 0 && (
              <div className="space-y-4 mb-10">
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Core Mercy Blade — Life Library
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sức khỏe, cảm xúc, AI, triết học, ý nghĩa cuộc sống
                  </p>
                </div>
                <VirtualizedRoomGrid
                  rooms={coreRooms}
                  onRoomClick={handleRoomClick}
                  highlightColors={FREE_INTRO_ROOMS}
                />
              </div>
            )}

            {/* RIGHT: Life Skills / Survival */}
            {!isLoading && lifeRooms.length > 0 && (
              <div className="space-y-4 mb-4">
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Life Skills & Survival
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Kỹ năng sống, tài chính, sinh tồn hiện đại
                  </p>
                </div>
                <VirtualizedRoomGrid
                  rooms={lifeRooms}
                  onRoomClick={handleRoomClick}
                  highlightColors={FREE_INTRO_ROOMS}
                  showBonusBadge
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RoomGrid;
