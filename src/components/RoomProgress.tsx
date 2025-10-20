import { Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomProgressProps {
  totalRooms: number;
  streak: number;
}

export const RoomProgress = ({ totalRooms, streak }: RoomProgressProps) => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-accent/20 rounded-lg border border-accent/30">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">
          {totalRooms} {totalRooms === 1 ? 'topic' : 'topics'} explored
        </span>
      </div>
      
      {streak > 1 && (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <Badge variant="secondary" className="text-xs">
            {streak} day streak! 🔥
          </Badge>
        </div>
      )}
    </div>
  );
};
