import { usePoints } from "@/hooks/usePoints";
import { Star } from "lucide-react";
import { Card } from "./ui/card";

export const PointsDisplay = () => {
  const { totalPoints, isLoading } = usePoints();

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-muted-foreground animate-pulse" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 rounded-full">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Your Points / Điểm Của Bạn
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {totalPoints.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};
