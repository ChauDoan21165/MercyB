// src/_legacy_next_pages/RoomGrid.tsx — MB-BLUE-94.14.25 — 2025-12-26 (+0700)
/**
 * MercyBlade Blue — RoomGrid (FREE)
 * File: src/_legacy_next_pages/RoomGrid.tsx
 * Version: MB-BLUE-94.14.25 — 2025-12-26 (+0700)
 *
 * Purpose:
 * - Render the FREE rooms grid (grouped into 3 lanes: English / Core / Life)
 * - Uses useCachedRooms() as the single room list source for this page
 * - Navigates to /room/:roomId (LOCKED)
 */

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoomGridSkeleton } from "@/components/RoomCardSkeleton";
import { VirtualizedRoomGrid } from "@/components/VirtualizedRoomGrid";
import { LowDataModeToggle } from "@/components/LowDataModeToggle";

import { useCachedRooms } from "@/hooks/useCachedRooms";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useToast } from "@/hooks/use-toast";

/** Minimal shape we rely on from the cached room list */
type RoomLite = {
  id: string;
  tier?: string;
  domain?: string;
  slug?: string;
  title_en?: string;
  title?: string;
};

const FREE_INTRO_ROOMS: Record<string, string> = {
  "finance-calm-money-clear-future-preview-free": "#FFD700",
  "sexuality-and-curiosity-free": "#FFD700",
  "career-consultant-free": "#FFD700",
};

const getLane = (room: RoomLite): "english" | "core" | "life" => {
  const d = (room.domain || "").toLowerCase();
  const slug = (room.slug || room.id || "").toLowerCase();
  const title = (room.title_en || room.title || "").toLowerCase();

  if (d === "english") return "english";
  if (d === "life") return "life";
  if (d === "core") return "core";

  if (
    slug.includes("english") ||
    slug.includes("ielts") ||
    slug.includes("toeic") ||
    slug.includes("toefl") ||
    slug.includes("grammar") ||
    title.includes("english")
  ) {
    return "english";
  }

  if (
    slug.includes("survival") ||
    slug.includes("life") ||
    slug.includes("money") ||
    slug.includes("finance") ||
    slug.includes("career") ||
    slug.includes("relationship") ||
    title.includes("safety") ||
    title.includes("survival")
  ) {
    return "life";
  }

  return "core";
};

export default function RoomGrid() {
  const navigate = useNavigate();
  const { isAdmin } = useUserAccess();
  const { toast } = useToast();

  const { data: cachedRooms, isLoading, refetch } = useCachedRooms();

  const { englishRooms, coreRooms, lifeRooms } = useMemo(() => {
    if (!cachedRooms || !Array.isArray(cachedRooms)) {
      return { englishRooms: [], coreRooms: [], lifeRooms: [] };
    }

    const freeRooms = (cachedRooms as RoomLite[]).filter(
      (room) => (room?.tier || "").toLowerCase() === "free"
    );

    const english: RoomLite[] = [];
    const core: RoomLite[] = [];
    const life: RoomLite[] = [];

    freeRooms.forEach((room) => {
      const lane = getLane(room);
      if (lane === "english") english.push(room);
      else if (lane === "life") life.push(room);
      else core.push(room);
    });

    return { englishRooms: english, coreRooms: core, lifeRooms: life };
  }, [cachedRooms]);

  const totalRoomCount = englishRooms.length + coreRooms.length + lifeRooms.length;

  const handleRoomClick = (room: RoomLite) => {
    navigate(`/room/${room.id}`);
  };

  const handleRefreshRooms = async () => {
    toast({ title: "Refreshing rooms…", description: "Reloading room data" });
    try {
      await refetch();
      toast({ title: "Done", description: "Rooms updated" });
    } catch {
      toast({
        title: "Refresh failed",
        description: "Could not reload rooms. Check console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <ColorfulMercyBladeHeader subtitle="Free Rooms" showBackButton />

        <div className="min-h-screen" style={{ background: "hsl(var(--page-roomgrid))" }}>
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-700 font-medium">
                  You are in free area / Khu vực miễn phí
                </span>

                <div className="flex gap-2">
                  <LowDataModeToggle />

                  {/* Admin-only refresh button in header (keeps UI quiet for normal users) */}
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshRooms}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  )}
                </div>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                  Choose Your Learning Room
                </h1>
                <p className="text-lg text-muted-foreground">Chọn Phòng Học Của Bạn</p>
                <p className="text-sm text-muted-foreground/80">
                  {isLoading ? "Loading…" : `Showing ${totalRoomCount} rooms`}
                </p>
              </div>
            </div>

            {isLoading && <RoomGridSkeleton count={24} />}

            {!isLoading && totalRoomCount === 0 && (
              <div className="mt-12 text-center space-y-4">
                <p className="text-muted-foreground">No free rooms available.</p>

                {/* Allow anyone to retry if list came back empty */}
                <Button variant="outline" size="sm" onClick={handleRefreshRooms} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            )}

            {/* English */}
            {!isLoading && englishRooms.length > 0 && (
              <section className="mb-10 space-y-4">
                <h2 className="text-2xl font-semibold text-center">English Pathway — Free</h2>
                <VirtualizedRoomGrid
                  rooms={englishRooms}
                  onRoomClick={handleRoomClick}
                  highlightColors={FREE_INTRO_ROOMS}
                />
              </section>
            )}

            {/* Core */}
            {!isLoading && coreRooms.length > 0 && (
              <section className="mb-10 space-y-4">
                <h2 className="text-2xl font-semibold text-center">Core Mercy Blade</h2>
                <VirtualizedRoomGrid
                  rooms={coreRooms}
                  onRoomClick={handleRoomClick}
                  highlightColors={FREE_INTRO_ROOMS}
                />
              </section>
            )}

            {/* Life Skills */}
            {!isLoading && lifeRooms.length > 0 && (
              <section className="mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-center">Life Skills &amp; Survival</h2>
                <VirtualizedRoomGrid
                  rooms={lifeRooms}
                  onRoomClick={handleRoomClick}
                  highlightColors={FREE_INTRO_ROOMS}
                  showBonusBadge
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
