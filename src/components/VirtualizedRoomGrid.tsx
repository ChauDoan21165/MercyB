// src/components/VirtualizedRoomGrid.tsx
import { useRef, useMemo } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Palette } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getRoomColor } from "@/lib/roomColors";
import { highlightShortTitle } from "@/lib/wordColorHighlighter";
import { useLowDataMode } from "@/contexts/LowDataModeContext";
import { Button } from "@/components/ui/button";
import { useMercyBladeTheme } from "@/hooks/useMercyBladeTheme";
import { ROOM_GRID_CLASS } from "@/lib/constants/rooms";
import { getLockedRoomClassNames, getLockedRoomStyles } from "@/components/room/LockedRoomStyles";
import { LockedBadge } from "@/components/room/LockedBadge";

interface RoomData {
  id: string;
  nameEn: string;
  nameVi: string;
  tier: string;
  hasData: boolean;
  color?: string;
}

interface VirtualizedRoomGridProps {
  rooms: RoomData[];
  onRoomClick: (room: RoomData) => void;
  highlightColors?: Record<string, string>;
}

// Internal constant - locked to match ROOM_GRID_CLASS canonical grid
const COLUMN_COUNT = 6;

export const VirtualizedRoomGrid = ({
  rooms,
  onRoomClick,
  highlightColors = {},
}: VirtualizedRoomGridProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { isLowDataMode } = useLowDataMode();
  const { isColor, toggleMode } = useMercyBladeTheme();

  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => {
      const aName = a.nameEn || a.id;
      const bName = b.nameEn || b.id;
      return aName.localeCompare(bName);
    });
  }, [rooms]);

  const rowCount = Math.ceil(sortedRooms.length / COLUMN_COUNT);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isLowDataMode ? 140 : 180),
    overscan: 3,
  });

  const handleCardKeyDown = (e: KeyboardEvent, room: RoomData) => {
    if (!room.hasData) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRoomClick(room);
    }
  };

  return (
    <div>
      {/* Color Mode Toggle */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMode}
          className="gap-2"
          data-theme-toggle={isColor ? "color" : "blackWhite"}
          aria-label="Toggle room color mode"
        >
          <Palette className="w-4 h-4" aria-hidden="true" />
          {isColor ? "Black & White" : "Mercy Blade Colors"}
        </Button>
      </div>

      <div
        ref={parentRef}
        className={`h-[calc(100vh-350px)] overflow-auto ${
          isLowDataMode ? "text-sm" : ""
        }`}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const startIdx = virtualRow.index * COLUMN_COUNT;
            const rowRooms = sortedRooms.slice(
              startIdx,
              startIdx + COLUMN_COUNT
            );

            return (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className={ROOM_GRID_CLASS}>
                  {rowRooms.map((room, colIndex) => {
                    const roomColor =
                      highlightColors[room.id] || getRoomColor(room.id);
                    const isHighlighted = !!highlightColors[room.id];
                    const lockedStyles = getLockedRoomClassNames(isColor);

                    // Accessible rooms: normal styling with hover effects
                    // Locked rooms: frosted overlay effect that preserves Mercy Blade aesthetic
                    const baseCardClasses = [
                      "relative",
                      "p-3",
                      "group",
                      room.hasData
                        ? "cursor-pointer"
                        : lockedStyles.container,
                      !isLowDataMode &&
                        room.hasData &&
                        "transition-all duration-300 hover:scale-110 hover:shadow-hover hover:z-10",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    const baseStyle: CSSProperties = isHighlighted
                      ? {
                          border: `2px solid ${roomColor}`,
                          boxShadow: isLowDataMode
                            ? "none"
                            : `0 0 20px ${roomColor}60`,
                          background: "white",
                        }
                      : {
                          background: "white",
                          border: "1px solid #e5e7eb",
                        };

                    return (
                      <Tooltip key={room.id}>
                        <TooltipTrigger asChild>
                          <Card
                            role={room.hasData ? "button" : "group"}
                            tabIndex={room.hasData ? 0 : -1}
                            aria-disabled={!room.hasData}
                            aria-label={
                              room.hasData
                                ? `Open room ${room.nameEn}`
                                : `${room.nameEn} coming soon`
                            }
                            className={baseCardClasses}
                            style={baseStyle}
                            onClick={() => room.hasData && onRoomClick(room)}
                            onKeyDown={(e) => handleCardKeyDown(e, room)}
                            data-locked={!room.hasData ? "true" : undefined}
                          >
                            {/* Frosted overlay for locked rooms */}
                            {!room.hasData && lockedStyles.overlay && (
                              <div className={lockedStyles.overlay} aria-hidden="true" />
                            )}

                            {/* Status Badge */}
                            <div className="absolute top-1 right-1 z-10">
                              {room.hasData ? (
                                <div className="bg-green-500 rounded-full p-1">
                                  <CheckCircle2
                                    className="w-3 h-3 text-white"
                                    aria-hidden="true"
                                  />
                                </div>
                              ) : (
                                <LockedBadge isColor={isColor} size="sm" />
                              )}
                            </div>

                            <div className="space-y-2 relative z-[1]">
                              <div className="space-y-1">
                                <p
                                  className={`${
                                    isLowDataMode ? "text-[10px]" : "text-xs"
                                  } ${lockedStyles.title} ${
                                    isColor
                                      ? "text-foreground"
                                      : "font-black text-black"
                                  }`}
                                  style={
                                    isColor
                                      ? {}
                                      : {
                                          fontWeight: 900,
                                          color: "#000000",
                                        }
                                  }
                                  data-room-title={room.nameEn}
                                >
                                  {isColor && room.hasData
                                    ? highlightShortTitle(
                                        room.nameEn,
                                        startIdx + colIndex,
                                        false
                                      )
                                    : room.nameEn}
                                </p>
                                <p
                                  className={`${
                                    isLowDataMode
                                      ? "text-[8px]"
                                      : "text-[10px]"
                                  } ${lockedStyles.subtitle} ${
                                    isColor
                                      ? "text-muted-foreground"
                                      : "font-black text-black"
                                  }`}
                                  style={
                                    isColor
                                      ? {}
                                      : {
                                          fontWeight: 900,
                                          color: "#000000",
                                        }
                                  }
                                >
                                  {isColor && room.hasData
                                    ? highlightShortTitle(
                                        room.nameVi,
                                        startIdx + colIndex,
                                        true
                                      )
                                    : room.nameVi}
                                </p>
                              </div>
                            </div>

                            {/* Hover overlay (disabled in low data mode) */}
                            {room.hasData && !isLowDataMode && (
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-gray-50" />
                            )}
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{room.hasData ? "Click to enter" : "Coming soon"}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
