import { useCredits } from "@/hooks/useCredits";
import { Badge } from "./ui/badge";
import { AlertCircle, Infinity } from "lucide-react";

export const CreditsDisplay = () => {
  const { creditInfo, loading } = useCredits();

  if (loading) return null;

  const percentage = creditInfo.isUnlimited 
    ? 100 
    : (creditInfo.questionsUsed / creditInfo.questionsLimit) * 100;

  const getColor = () => {
    if (creditInfo.isUnlimited) return "text-primary";
    if (percentage >= 90) return "text-destructive";
    if (percentage >= 70) return "text-yellow-500";
    return "text-primary";
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={`${getColor()} border-current`}>
        {creditInfo.isUnlimited ? (
          <div className="flex items-center gap-1">
            <Infinity className="h-3 w-3" />
            <span>Unlimited / Không giới hạn</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {percentage >= 90 && <AlertCircle className="h-3 w-3" />}
            <span>
              {creditInfo.questionsUsed}/{creditInfo.questionsLimit} questions
            </span>
          </div>
        )}
      </Badge>
      {!creditInfo.isUnlimited && percentage >= 70 && (
        <span className="text-xs text-muted-foreground">
          {creditInfo.questionsLimit - creditInfo.questionsUsed} left
        </span>
      )}
    </div>
  );
};
