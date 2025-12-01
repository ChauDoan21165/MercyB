/**
 * L8 — Room Health Summary Component
 * Displays high-level health metrics for selected tier
 */

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RoomHealthSummaryProps {
  totalRooms: number;
  healthyRooms: number;
  issuesFound: number;
  healthScore: number;
}

export const RoomHealthSummary = ({
  totalRooms,
  healthyRooms,
  issuesFound,
  healthScore
}: RoomHealthSummaryProps) => {
  const getHealthBadge = () => {
    if (healthScore >= 90) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Excellent
        </Badge>
      );
    } else if (healthScore >= 70) {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          <AlertCircle className="h-3 w-3 mr-1" />
          Good
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Needs Attention
        </Badge>
      );
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Health Summary</h3>
        {getHealthBadge()}
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Health Score</span>
            <span className="font-semibold">{healthScore}%</span>
          </div>
          <Progress value={healthScore} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalRooms}</div>
            <div className="text-xs text-muted-foreground">Total Rooms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{healthyRooms}</div>
            <div className="text-xs text-muted-foreground">Healthy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{issuesFound}</div>
            <div className="text-xs text-muted-foreground">Issues</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
