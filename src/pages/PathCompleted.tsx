import { useParams, useNavigate } from 'react-router-dom';
import { usePath, useResetPath } from '@/hooks/usePaths';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Sparkles, ArrowRight, RotateCcw, Home, List } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

// Recommended next paths (placeholders)
const NEXT_PATHS = [
  { slug: 'heart-repair', title_en: 'Heart Repair', title_vi: 'Chữa Lành Trái Tim', days: 7 },
  { slug: 'self-worth', title_en: 'Self-Worth', title_vi: 'Giá Trị Bản Thân', days: 14 },
  { slug: 'quiet-strength', title_en: 'Quiet Strength', title_vi: 'Sức Mạnh Tĩnh Lặng', days: 21 },
];

export default function PathCompleted() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: path, isLoading } = usePath(slug);
  const resetPath = useResetPath();

  // Confetti on mount
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleReset = async () => {
    if (!path) return;
    
    try {
      await resetPath.mutateAsync(path.id);
      toast.success("Path reset. Start fresh whenever you're ready.");
      navigate(`/paths/${slug}`);
    } catch (error) {
      toast.error('Failed to reset path.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse h-32 w-64 bg-muted rounded-lg" />
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="max-w-[720px] mx-auto px-4 py-12 space-y-8">
        {/* Trophy */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
              <Trophy className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">
            You finished the 7-Day Calm Mind Path.
          </h1>
          <p className="text-xl text-muted-foreground">
            Bạn đã hoàn thành lộ trình 7 Ngày Tâm Trí Bình Yên.
          </p>
        </div>

        {/* Gratitude Message */}
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4 text-center">
            <p className="text-foreground leading-relaxed">
              Every small step counts. You showed up for yourself, day after day. 
              That takes courage. Be proud of what you've built inside — a quieter place 
              you can always return to.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Mỗi bước nhỏ đều có ý nghĩa. Bạn đã xuất hiện vì chính mình, ngày này qua ngày khác.
              Điều đó cần can đảm. Hãy tự hào về điều bạn đã xây bên trong — một nơi yên tĩnh hơn
              mà bạn luôn có thể quay về.
            </p>
          </CardContent>
        </Card>

        {/* Recommended Next Paths */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Continue Your Journey
          </h2>
          <div className="space-y-3">
            {NEXT_PATHS.map(nextPath => (
              <Card 
                key={nextPath.slug}
                className="cursor-pointer hover:shadow-md transition-all opacity-80 hover:opacity-100"
                onClick={() => navigate(`/paths/${nextPath.slug}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{nextPath.title_en}</p>
                    <p className="text-sm text-muted-foreground">{nextPath.title_vi}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      {nextPath.days} days
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button 
            className="w-full h-12"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Button 
            variant="outline"
            className="w-full h-12"
            onClick={() => navigate('/paths')}
          >
            <List className="h-4 w-4 mr-2" />
            View all paths
          </Button>
          <Button 
            variant="ghost"
            className="w-full"
            onClick={handleReset}
            disabled={resetPath.isPending}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {resetPath.isPending ? 'Resetting...' : 'Start This Path Again'}
          </Button>
        </div>
      </div>
    </div>
  );
}
