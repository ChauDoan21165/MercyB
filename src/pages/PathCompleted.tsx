import { useParams, useNavigate } from 'react-router-dom';
import { usePath, usePaths, useResetPath } from '@/hooks/usePaths';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Sparkles, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

// Suggested next paths
const NEXT_PATHS = [
  { slug: 'heart-repair', title_en: 'Heart Repair', title_vi: 'Chữa Lành Trái Tim' },
  { slug: 'self-worth', title_en: 'Self-Worth', title_vi: 'Giá Trị Bản Thân' },
  { slug: 'quiet-strength', title_en: 'Quiet Strength', title_vi: 'Sức Mạnh Tĩnh Lặng' },
];

export default function PathCompleted() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: path, isLoading } = usePath(slug);
  const { data: allPaths } = usePaths();
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
      toast.success('Path reset. Start fresh whenever you're ready.');
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

  // Filter available next paths from database
  const availableNextPaths = allPaths?.filter(p => 
    p.slug !== slug && NEXT_PATHS.some(np => np.slug === p.slug)
  ) || [];

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

        {/* Congratulations */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-muted-foreground">
            Chúc mừng bạn!
          </p>
        </div>

        {/* Message */}
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4 text-center">
            <p className="text-lg leading-relaxed">
              You've completed <span className="font-semibold text-primary">{path.title_en}</span>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Bạn đã hoàn thành <span className="font-semibold text-primary">{path.title_vi}</span>.
            </p>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Every small step counts. You showed up for yourself, day after day. 
                That takes courage. Be proud.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Mỗi bước nhỏ đều có ý nghĩa. Bạn đã xuất hiện vì chính mình, ngày này qua ngày khác.
                Điều đó cần can đảm. Hãy tự hào.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Paths */}
        {availableNextPaths.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Continue Your Journey
            </h2>
            <div className="space-y-3">
              {availableNextPaths.map(nextPath => (
                <Card 
                  key={nextPath.slug}
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => navigate(`/paths/${nextPath.slug}`)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{nextPath.title_en}</p>
                      <p className="text-sm text-muted-foreground">{nextPath.title_vi}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Suggested paths not in DB yet */}
        {availableNextPaths.length === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Coming Soon
            </h2>
            <div className="space-y-3">
              {NEXT_PATHS.map(nextPath => (
                <Card key={nextPath.slug} className="opacity-60">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{nextPath.title_en}</p>
                      <p className="text-sm text-muted-foreground">{nextPath.title_vi}</p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Coming soon</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button 
            className="w-full h-12"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Button>
          <Button 
            variant="outline"
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
