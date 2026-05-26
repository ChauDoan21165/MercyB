import { Card } from "@/components/ui/card";
import { CheckCircle2, GraduationCap } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { getLockedRoomClassNames } from "@/components/room/LockedRoomStyles";
import { LockedBadge } from "@/components/room/LockedBadge";

interface KidsRoomCardProps {
  room: {
    id: string;
    title_en: string;
    title_vi: string;
    icon: string | null;
  };
  index: number;
  onClick: () => void;
  useColorTheme?: boolean;
  isLocked?: boolean;
}

const KIDS_COLORS = ['#B91C1C', '#1D4ED8', '#047857']; // Dark red, dark blue, dark green

export const KidsRoomCard = ({ room, index, onClick, useColorTheme = true, isLocked = false }: KidsRoomCardProps) => {
  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return GraduationCap;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || GraduationCap;
  };

  const IconComponent = getIconComponent(room.icon);
  const roomColor = KIDS_COLORS[index % KIDS_COLORS.length];
  const lockedStyles = getLockedRoomClassNames(useColorTheme);

  return (
    <Card
      className={`relative p-4 transition-all duration-500 group border-2 hover:border-transparent bg-card backdrop-blur-sm overflow-hidden ${
        isLocked 
          ? lockedStyles.container 
          : 'cursor-pointer hover:scale-110 hover:shadow-2xl hover:z-10'
      }`}
      style={{
        borderImage: isLocked ? undefined : 'var(--gradient-rainbow) 1',
        animationDelay: `${index * 0.05}s`
      }}
      onClick={isLocked ? undefined : onClick}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-label={`${isLocked ? 'Locked - ' : ''}Open ${room.title_en} room`}
      aria-disabled={isLocked}
      onKeyDown={(e) => {
        if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      data-locked={isLocked ? "true" : undefined}
    >
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
        !isLocked && 'from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/10 group-hover:via-accent/10 group-hover:to-primary/10'
      }`} aria-hidden="true" />

      {/* Frosted overlay for locked rooms */}
      {isLocked && lockedStyles.overlay && (
        <div className={lockedStyles.overlay} aria-hidden="true" />
      )}
      
      {/* Status Badge */}
      <div className="absolute top-2 right-2 z-10" aria-hidden="true">
        {isLocked ? (
          <LockedBadge isColor={useColorTheme} size="sm" />
        ) : (
          <div 
            className="rounded-full p-1 shadow-lg animate-pulse"
            style={{ background: 'var(--gradient-rainbow)' }}
          >
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      <div className="relative space-y-3 z-[1]">
        {/* Icon with Animated Circle */}
        <div className="flex justify-center">
          <div className="relative">
            {!isLocked && (
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                style={{ background: 'var(--gradient-rainbow)' }}
                aria-hidden="true"
              />
            )}
            <div className={`relative bg-muted p-3 rounded-2xl transition-transform duration-300 ${!isLocked && 'group-hover:scale-110'}`}>
              <IconComponent className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
          </div>
        </div>
        
        {/* Room Names */}
        <div className="space-y-1">
          <p 
            className={`text-xs font-bold leading-tight line-clamp-2 text-center transition-all duration-300 ${lockedStyles.title}`}
            style={useColorTheme ? {
              color: isLocked ? undefined : roomColor
            } : {
              color: '#000000'
            }}
            data-room-title={room.title_en}
          >
            {room.title_en}
          </p>
          <p 
            className={`text-[10px] font-semibold leading-tight line-clamp-2 text-center transition-all duration-300 ${lockedStyles.subtitle}`}
            style={useColorTheme ? {
              color: isLocked ? undefined : roomColor
            } : {
              color: '#000000'
            }}
          >
            {room.title_vi}
          </p>
        </div>
      </div>

      {/* Shine Effect on Hover - only when not locked */}
      {!isLocked && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>
      )}
    </Card>
  );
};
