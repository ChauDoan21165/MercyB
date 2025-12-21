import { useParams, useNavigate } from 'react-router-dom';
import { usePath, usePathDays, useUserPathProgress, useStartPath } from '@/hooks/usePaths';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Play, RotateCcw, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function PathOverview() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: path, isLoading: pathLoading } = usePath(slug);
  const { data: days, isLoading: daysLoading } = usePathDays(path?.id);
  const { data: progress } = useUserPathProgress(path?.id);
  const startPath = useStartPath();

  const isLoading = pathLoading || daysLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[720px] mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-24 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Path not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const hasStarted = !!progress;
  const completedCount = progress?.completed_days.length || 0;
  const isCompleted = completedCount >= path.total_days;
  const percentComplete = (completedCount / path.total_days) * 100;

  const handleStart = async () => {
    try {
      await startPath.mutateAsync(path.id);
      navigate(`/paths/${slug}/day/1`);
    } catch (error) {
      toast.error('Failed to start path. Please try again.');
    }
  };

  const handleContinue = () => {
    if (progress) {
      navigate(`/paths/${slug}/day/${progress.current_day}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[720px] mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Mercy Path</span>
          </div>
        </div>

        {/* Cover Image */}
        {path.cover_image && (
          <div className="aspect-video rounded-xl overflow-hidden bg-muted">
            <img 
              src={path.cover_image} 
              alt={path.title_en}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title & Description */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{path.title_en}</h1>
            <p className="text-xl text-muted-foreground">{path.title_vi}</p>
          </div>

          <div className="space-y-2">
            <p className="text-foreground/90 leading-relaxed">{path.description_en}</p>
            <p className="text-muted-foreground leading-relaxed">{path.description_vi}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-primary/10 rounded-full text-primary font-medium">
              {path.total_days} days
            </span>
          </div>
        </div>

        {/* Progress */}
        {hasStarted && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedCount} / {path.total_days} days
                </span>
              </div>
              <Progress value={percentComplete} className="h-2" />
            </CardContent>
          </Card>
        )}

        {/* Days List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Daily Cards</h2>
          <div className="space-y-2">
            {days?.map((day) => {
              const isComplete = progress?.completed_days.includes(day.day_index);
              const isCurrent = progress?.current_day === day.day_index;
              const isLocked = hasStarted && !isComplete && !isCurrent && day.day_index > (progress?.current_day || 1);

              return (
                <Card 
                  key={day.id}
                  className={`transition-all cursor-pointer hover:shadow-md ${
                    isComplete ? 'bg-primary/5 border-primary/20' : 
                    isCurrent ? 'ring-2 ring-primary' : 
                    isLocked ? 'opacity-50' : ''
                  }`}
                  onClick={() => {
                    if (!isLocked) {
                      navigate(`/paths/${slug}/day/${day.day_index}`);
                    }
                  }}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isComplete ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="font-semibold">{day.day_index}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{day.title_en}</p>
                      <p className="text-sm text-muted-foreground truncate">{day.title_vi}</p>
                    </div>
                    {isCurrent && !isComplete && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="sticky bottom-4 pt-4">
          {isCompleted ? (
            <Button 
              className="w-full h-12 text-lg"
              onClick={() => navigate(`/paths/${slug}/completed`)}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              View Completion
            </Button>
          ) : hasStarted ? (
            <Button 
              className="w-full h-12 text-lg"
              onClick={handleContinue}
            >
              <Play className="h-5 w-5 mr-2" />
              Continue Day {progress?.current_day}
            </Button>
          ) : (
            <Button 
              className="w-full h-12 text-lg"
              onClick={handleStart}
              disabled={startPath.isPending}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {startPath.isPending ? 'Starting...' : 'Start This Path'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
