import { Card } from "@/components/ui/card";
import { CheckCircle2, GraduationCap } from "lucide-react";
import * as LucideIcons from "lucide-react";

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
}

const KIDS_COLORS = ['#B91C1C', '#1D4ED8', '#047857']; // Dark red, dark blue, dark green

export const KidsRoomCard = ({ room, index, onClick, useColorTheme = true }: KidsRoomCardProps) => {
  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return GraduationCap;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || GraduationCap;
  };

  const IconComponent = getIconComponent(room.icon);
  const roomColor = KIDS_COLORS[index % KIDS_COLORS.length];

  return (
    <Card
      className="relative p-4 transition-all duration-500 cursor-pointer group hover:scale-110 hover:shadow-2xl hover:z-10 border-2 hover:border-transparent bg-card backdrop-blur-sm overflow-hidden"
      style={{
        borderImage: 'var(--gradient-rainbow) 1',
        animationDelay: `${index * 0.05}s`
      }}
      onClick={onClick}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/10 group-hover:via-accent/10 group-hover:to-primary/10 transition-all duration-500" />
      
      {/* Status Badge */}
      <div className="absolute top-2 right-2 z-10">
        <div 
          className="rounded-full p-1 shadow-lg animate-pulse"
          style={{ background: 'var(--gradient-rainbow)' }}
        >
          <CheckCircle2 className="w-3 h-3 text-white" />
        </div>
      </div>

      <div className="relative space-y-3">
        {/* Icon with Animated Circle */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
              style={{ background: 'var(--gradient-rainbow)' }}
            />
            <div className="relative bg-muted p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <IconComponent className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
        
        {/* Room Names */}
        <div className="space-y-1">
          <p 
            className="text-xs font-bold leading-tight line-clamp-2 text-center transition-all duration-300"
            style={useColorTheme ? {
              color: roomColor
            } : {
              color: '#000000'
            }}
          >
            {room.title_en}
          </p>
          <p 
            className="text-[10px] font-semibold leading-tight line-clamp-2 text-center transition-all duration-300"
            style={useColorTheme ? {
              color: roomColor
            } : {
              color: '#000000'
            }}
          >
            {room.title_vi}
          </p>
        </div>
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>
    </Card>
  );
};
