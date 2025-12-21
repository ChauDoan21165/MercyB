import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePath, usePathDay, useUserPathProgress, useCompleteDay, useStartPath } from '@/hooks/usePaths';
import { useCompanionLines } from '@/hooks/useCompanionLines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AudioPlayer } from '@/components/AudioPlayer';
import { CompanionBubble } from '@/components/companion/CompanionBubble';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Lightbulb, Flame } from 'lucide-react';
import { toast } from 'sonner';

export default function PathDayCard() {
  const { slug, day: dayParam } = useParams<{ slug: string; day: string }>();
  const dayIndex = parseInt(dayParam || '1', 10);
  const navigate = useNavigate();
  
  const { data: path, isLoading: pathLoading } = usePath(slug);
  const { data: dayData, isLoading: dayLoading } = usePathDay(path?.id, dayIndex);
  const { data: progress } = useUserPathProgress(path?.id);
  const completeDay = useCompleteDay();
  const startPath = useStartPath();
  const { getRandomLine } = useCompanionLines();

  const [reflection, setReflection] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  // Companion bubble states
  const [showGreeting, setShowGreeting] = useState(false);
  const [showReflectionHint, setShowReflectionHint] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [greetingLine, setGreetingLine] = useState<{ en: string; vi: string } | null>(null);
  const [reflectionLine, setReflectionLine] = useState<{ en: string; vi: string } | null>(null);
  const [completionLine, setCompletionLine] = useState<{ en: string; vi: string } | null>(null);
  
  const greetingShownRef = useRef(false);
  const reflectionSectionRef = useRef<HTMLDivElement>(null);

  const isLoading = pathLoading || dayLoading;
  const isCompleted = progress?.completed_days.includes(dayIndex) || false;
  const isLastDay = path ? dayIndex >= path.total_days : false;

  // Show greeting on mount (once per page load)
  useEffect(() => {
    if (!greetingShownRef.current && dayData) {
      greetingShownRef.current = true;
      const line = getRandomLine('greeting');
      if (line) {
        setGreetingLine(line);
        setShowGreeting(true);
      }
    }
  }, [dayData, getRandomLine]);

  // Show reflection hint when scrolling to reflection section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !showReflectionHint && !reflectionLine) {
            const line = getRandomLine('reflection');
            if (line) {
              setReflectionLine(line);
              setShowReflectionHint(true);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (reflectionSectionRef.current) {
      observer.observe(reflectionSectionRef.current);
    }

    return () => observer.disconnect();
  }, [getRandomLine, showReflectionHint, reflectionLine]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[720px] mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-48 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!path || !dayData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Day not found</h1>
          <Button onClick={() => navigate(`/paths/${slug}`)}>Back to Path</Button>
        </div>
      </div>
    );
  }

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      // If user hasn't started, start first
      if (!progress) {
        await startPath.mutateAsync(path.id);
      }
      
      await completeDay.mutateAsync({
        pathId: path.id,
        dayIndex,
        totalDays: path.total_days,
      });

      // Show completion bubble
      const line = getRandomLine('completion');
      if (line) {
        setCompletionLine(line);
        setShowCompletion(true);
      }

      toast.success('Day completed! 🎉');

      // Navigate after a short delay to show bubble
      setTimeout(() => {
        if (isLastDay) {
          navigate(`/paths/${slug}/completed`);
        } else {
          navigate(`/paths/${slug}/day/${dayIndex + 1}`);
        }
      }, 2000);
    } catch (error) {
      toast.error('Failed to complete day. Please try again.');
      setIsCompleting(false);
    }
  };

  const normalizeAudioPath = (audio: string | null) => {
    if (!audio) return '';
    if (audio.startsWith('/')) return audio;
    if (audio.startsWith('http')) return audio;
    return `/audio/paths/${audio}`;
  };

  // Use new expanded audio columns if available, fallback to legacy
  const contentAudioEn = dayData.audio_content_en || dayData.audio_intro_en;
  const contentAudioVi = dayData.audio_content_vi || dayData.audio_intro_vi;
  const reflectionAudioEn = dayData.audio_reflection_en;
  const reflectionAudioVi = dayData.audio_reflection_vi;
  const dareAudioEn = dayData.audio_dare_en;
  const dareAudioVi = dayData.audio_dare_vi;

  return (
    <div className="min-h-screen bg-background pb-24 relative">
      {/* Greeting Bubble */}
      {greetingLine && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
          <CompanionBubble
            textEn={greetingLine.en}
            textVi={greetingLine.vi}
            show={showGreeting}
            onHide={() => setShowGreeting(false)}
            duration={3000}
          />
        </div>
      )}

      {/* Completion Bubble */}
      {completionLine && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <CompanionBubble
            textEn={completionLine.en}
            textVi={completionLine.vi}
            show={showCompletion}
            onHide={() => setShowCompletion(false)}
            duration={2000}
          />
        </div>
      )}

      <div className="max-w-[720px] mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/paths/${slug}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Day {dayIndex} of {path.total_days}
          </div>
        </div>

        {/* Day Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{dayData.title_en}</h1>
          <p className="text-lg text-muted-foreground">{dayData.title_vi}</p>
          {isCompleted && (
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        {/* Content Card - English */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Today&apos;s Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {dayData.content_en}
            </p>
            {contentAudioEn && (
              <AudioPlayer 
                src={normalizeAudioPath(contentAudioEn)} 
                title="Listen (EN)"
              />
            )}
          </CardContent>
        </Card>

        {/* Content Card - Vietnamese */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Bài Tập Hôm Nay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {dayData.content_vi}
            </p>
            {contentAudioVi && (
              <AudioPlayer 
                src={normalizeAudioPath(contentAudioVi)} 
                title="Nghe (VI)"
              />
            )}
          </CardContent>
        </Card>

        {/* Reflection */}
        <div ref={reflectionSectionRef} className="relative">
          {/* Reflection Hint Bubble */}
          {reflectionLine && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2">
              <CompanionBubble
                textEn={reflectionLine.en}
                textVi={reflectionLine.vi}
                show={showReflectionHint}
                onHide={() => setShowReflectionHint(false)}
                duration={4000}
              />
            </div>
          )}

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Reflection / Suy Ngẫm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-foreground">{dayData.reflection_en}</p>
                  {reflectionAudioEn && (
                    <AudioPlayer 
                      src={normalizeAudioPath(reflectionAudioEn)} 
                      title="Listen"
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{dayData.reflection_vi}</p>
                  {reflectionAudioVi && (
                    <AudioPlayer 
                      src={normalizeAudioPath(reflectionAudioVi)} 
                      title="Nghe"
                    />
                  )}
                </div>
              </div>
              <Textarea
                placeholder="Write your thoughts here... / Viết suy nghĩ của bạn ở đây..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Today's Dare */}
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Today&apos;s Dare / Thử Thách Hôm Nay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-foreground font-medium">{dayData.dare_en}</p>
              {dareAudioEn && (
                <AudioPlayer 
                  src={normalizeAudioPath(dareAudioEn)} 
                  title="Listen"
                />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{dayData.dare_vi}</p>
              {dareAudioVi && (
                <AudioPlayer 
                  src={normalizeAudioPath(dareAudioVi)} 
                  title="Nghe"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Complete Button */}
        <div className="sticky bottom-4 pt-4">
          {!isCompleted ? (
            <Button 
              className="w-full h-12 text-lg"
              onClick={handleComplete}
              disabled={isCompleting}
            >
              {isCompleting ? (
                'Completing...'
              ) : isLastDay ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Complete Path
                </>
              ) : (
                <>
                  Complete Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-3">
              {dayIndex > 1 && (
                <Button 
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => navigate(`/paths/${slug}/day/${dayIndex - 1}`)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              {!isLastDay && (
                <Button 
                  className="flex-1 h-12"
                  onClick={() => navigate(`/paths/${slug}/day/${dayIndex + 1}`)}
                >
                  Next Day
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              {isLastDay && (
                <Button 
                  className="flex-1 h-12"
                  onClick={() => navigate(`/paths/${slug}/completed`)}
                >
                  View Completion
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
