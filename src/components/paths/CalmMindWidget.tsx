import { useNavigate } from 'react-router-dom';
import { usePath, useUserPathProgress, useStartPath } from '@/hooks/usePaths';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Sparkles, Moon } from 'lucide-react';
import { toast } from 'sonner';

/**
 * CalmMindWidget - Home screen widget for "Calm Mind 7 Days" path
 * Shows progress or start option
 */
export function CalmMindWidget() {
  const navigate = useNavigate();
  const { data: path, isLoading: pathLoading } = usePath('calm-mind-7');
  const { data: progress, isLoading: progressLoading } = useUserPathProgress(path?.id);
  const startPath = useStartPath();

  const isLoading = pathLoading || progressLoading;

  // Don't render if path doesn't exist
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200/50 dark:border-indigo-800/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!path) return null;

  const hasStarted = !!progress;
  const currentDay = progress?.current_day || 1;
  const completedCount = progress?.completed_days.length || 0;
  const progressPercent = (completedCount / path.total_days) * 100;
  const isCompleted = completedCount >= path.total_days;

  const handleStart = async () => {
    try {
      await startPath.mutateAsync(path.id);
      navigate(`/paths/calm-mind-7/day/1`);
    } catch (error) {
      toast.error('Failed to start path. Please try again.');
    }
  };

  const handleContinue = () => {
    navigate(`/paths/calm-mind-7/day/${currentDay}`);
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200/50 dark:border-indigo-800/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
            <Moon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title */}
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                Calm Mind 7 Days
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </h3>
              <p className="text-sm text-muted-foreground">
                7 Ngày Tâm An
              </p>
            </div>

            {hasStarted && !isCompleted ? (
              <>
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Day {currentDay} of {path.total_days}</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>

                {/* Continue Button */}
                <Button
                  size="sm"
                  onClick={handleContinue}
                  className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            ) : isCompleted ? (
              <>
                {/* Completed state */}
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✓ Path completed!
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/paths/calm-mind-7`)}
                  className="w-full"
                >
                  View Path
                </Button>
              </>
            ) : (
              <>
                {/* Description for new users */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {path.description_en}
                </p>

                {/* Start Button */}
                <Button
                  size="sm"
                  onClick={handleStart}
                  disabled={startPath.isPending}
                  className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  {startPath.isPending ? 'Starting...' : 'Start'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
