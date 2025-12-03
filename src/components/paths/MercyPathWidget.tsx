import { useNavigate } from 'react-router-dom';
import { usePathsWithProgress } from '@/hooks/usePaths';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export function MercyPathWidget() {
  const navigate = useNavigate();
  const { data: paths, isLoading } = usePathsWithProgress();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="animate-pulse h-24 bg-primary/10 rounded" />
        </CardContent>
      </Card>
    );
  }

  // Find active path (has progress but not completed)
  const activePath = paths?.find(p => {
    if (!p.progress) return false;
    return p.progress.completed_days.length < p.total_days;
  });

  // Find first available path for new users
  const firstPath = paths?.[0];

  if (activePath && activePath.progress) {
    const progress = activePath.progress;
    const percentComplete = (progress.completed_days.length / activePath.total_days) * 100;

    return (
      <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Your Mercy Path</span>
              </div>
              
              <h3 className="text-lg font-semibold">
                {activePath.title_en}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activePath.title_vi}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Day {progress.current_day} of {activePath.total_days}
                  </span>
                  <span className="font-medium text-primary">
                    {Math.round(percentComplete)}%
                  </span>
                </div>
                <Progress value={percentComplete} className="h-2" />
              </div>
            </div>

            <Button
              onClick={() => navigate(`/paths/${activePath.slug}/day/${progress.current_day}`)}
              className="shrink-0"
            >
              <Play className="h-4 w-4 mr-2" />
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No active path - show start card
  if (firstPath) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Start Your Journey</span>
              </div>
              
              <h3 className="text-lg font-semibold">
                {firstPath.title_en}
              </h3>
              <p className="text-sm text-muted-foreground">
                {firstPath.title_vi}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {firstPath.description_en}
              </p>
            </div>

            <Button
              onClick={() => navigate(`/paths/${firstPath.slug}`)}
              variant="default"
              className="shrink-0"
            >
              Start
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
