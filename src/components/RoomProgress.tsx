import { Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomProgressProps {
  totalRooms: number;
  streak: number;
}

export const RoomProgress = ({ totalRooms, streak }: RoomProgressProps) => {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        <span className="font-medium">
          You have explored {totalRooms} {totalRooms === 1 ? 'topic' : 'topics'}
        </span>
      </div>
      
      {streak > 0 && (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="font-medium">
            {streak} day streak! 🔥
          </span>
        </div>
      )}
    </div>
  );
};
