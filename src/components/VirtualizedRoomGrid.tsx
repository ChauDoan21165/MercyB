import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock, Palette } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getRoomColor } from '@/lib/roomColors';
import { highlightShortTitle } from '@/lib/wordColorHighlighter';
import { useLowDataMode } from '@/contexts/LowDataModeContext';
import { Button } from '@/components/ui/button';
import { useColorMode } from '@/hooks/useColorMode';

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
  columnCount?: number;
}

export const VirtualizedRoomGrid = ({ 
  rooms, 
  onRoomClick, 
  highlightColors = {},
  columnCount = 6 
}: VirtualizedRoomGridProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { isLowDataMode } = useLowDataMode();
  const { useColorTheme, toggleColorMode } = useColorMode();
  
  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => {
      const aName = a.nameEn || a.id;
      const bName = b.nameEn || b.id;
      return aName.localeCompare(bName);
    });
  }, [rooms]);

  const rowCount = Math.ceil(sortedRooms.length / columnCount);
  
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => isLowDataMode ? 140 : 180,
    overscan: 3,
  });

  return (
    <div>
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
      
      <div 
        ref={parentRef} 
        className={`h-[calc(100vh-350px)] overflow-auto ${isLowDataMode ? 'text-sm' : ''}`}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIdx = virtualRow.index * columnCount;
          const rowRooms = sortedRooms.slice(startIdx, startIdx + columnCount);
          
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {rowRooms.map((room, colIndex) => {
                  const roomColor = highlightColors[room.id] || getRoomColor(room.id);
                  const isHighlighted = !!highlightColors[room.id];
                  
                  return (
                    <Tooltip key={room.id}>
                      <TooltipTrigger asChild>
                        <Card
                          className={`relative p-3 group ${
                            room.hasData 
                              ? `cursor-pointer ${!isLowDataMode ? 'transition-all duration-300 hover:scale-110 hover:shadow-hover hover:z-10' : ''}` 
                              : "opacity-30 cursor-not-allowed grayscale"
                          }`}
                          style={
                            isHighlighted ? {
                              border: `2px solid ${roomColor}`,
                              background: `linear-gradient(135deg, ${roomColor}20, ${roomColor}10)`,
                              boxShadow: isLowDataMode ? 'none' : `0 0 20px ${roomColor}60`
                            } : {
                              background: 'white',
                              border: '1px solid #e5e7eb'
                            }
                          }
                          onClick={() => room.hasData && onRoomClick(room)}
                        >
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
                            <div className="space-y-1">
                              <p 
                                className={`${isLowDataMode ? 'text-[10px]' : 'text-xs'} leading-tight line-clamp-2 ${
                                  useColorTheme ? 'text-foreground' : 'font-black text-black'
                                }`}
                                style={useColorTheme ? {} : { fontWeight: 900, color: '#000000' }}
                              >
                                {useColorTheme ? highlightShortTitle(room.nameEn, startIdx + colIndex, false) : room.nameEn}
                              </p>
                              <p 
                                className={`${isLowDataMode ? 'text-[8px]' : 'text-[10px]'} leading-tight line-clamp-2 ${
                                  useColorTheme ? 'text-muted-foreground' : 'font-black text-black'
                                }`}
                                style={useColorTheme ? {} : { fontWeight: 900, color: '#000000' }}
                              >
                                {useColorTheme ? highlightShortTitle(room.nameVi, startIdx + colIndex, true) : room.nameVi}
                              </p>
                            </div>
                          </div>

                          {/* Hover Effect - disabled in low data mode */}
                          {room.hasData && !isLowDataMode && (
                            <div 
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-gray-50"
                            />
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
