import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePath, usePathDay, useUserPathProgress, useCompleteDay } from '@/hooks/usePaths';
import { useCompanionIntegration } from '@/hooks/useCompanionIntegration';
import { useReflectionObserver } from '@/hooks/useReflectionObserver';
import { CompanionBubble } from '@/components/companion/CompanionBubble';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * PathDayPage - Displays a single day of a path with content, reflection, dare
 * Each section has bilingual text and audio bars
 * Integrated with Companion Friend Mode
 */
export default function PathDayPage() {
  const { slug, day } = useParams<{ slug: string; day: string }>();
  const navigate = useNavigate();
  const dayIndex = parseInt(day || '1', 10);

  const { data: path, isLoading: pathLoading } = usePath(slug);
  const { data: pathDay, isLoading: dayLoading } = usePathDay(path?.id, dayIndex);
  const { data: progress } = useUserPathProgress(path?.id);
  const completeDay = useCompleteDay();

  const roomId = `path-${slug}-day-${dayIndex}`;
  
  // Companion integration
  const companion = useCompanionIntegration({
    roomId,
    isPathDay: true,
    dayIndex,
  });

  // Reflection observer
  const { ref: reflectionRef } = useReflectionObserver({
    onVisible: companion.onReflectionVisible,
  });

  const isCompleted = progress?.completed_days?.includes(dayIndex) || false;
  const isLastDay = path && dayIndex >= path.total_days;

  const handleComplete = async () => {
    if (!path) return;

    try {
      await completeDay.mutateAsync({
        pathId: path.id,
        dayIndex,
        totalDays: path.total_days,
      });

      // Trigger companion day complete
      companion.onDayComplete();

      toast.success('Day completed!');

      // Navigate after delay
      setTimeout(() => {
        if (isLastDay) {
          navigate(`/paths/${slug}`);
        } else {
          navigate(`/paths/${slug}/day/${dayIndex + 1}`);
        }
      }, 2000);
    } catch (error) {
      toast.error('Failed to complete day. Please try again.');
    }
  };

  if (pathLoading || dayLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!path || !pathDay) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Day not found</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Companion Bubble */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 max-w-[720px] w-full px-4">
        <div className="flex justify-center">
          <CompanionBubble
            text={companion.bubbleData.text}
            visible={companion.bubbleData.visible}
            onClose={companion.hideBubble}
          />
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-[720px] mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/paths/${slug}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Day {dayIndex} of {path.total_days}</p>
            <h1 className="font-semibold">{pathDay.title_en}</h1>
            <p className="text-sm text-muted-foreground">{pathDay.title_vi}</p>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[720px] mx-auto px-4 py-6 space-y-6">
        {/* Content Section */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Today's Thought</h2>
            
            {/* English */}
            <div className="space-y-2">
              <p className="text-foreground leading-relaxed">{pathDay.content_en}</p>
              {pathDay.audio_content_en && (
                <AudioBar 
                  src={pathDay.audio_content_en} 
                  label="EN" 
                  onPlay={companion.onAudioPlay}
                  onEnded={companion.onAudioEnded}
                />
              )}
            </div>

            {/* Vietnamese */}
            <div className="space-y-2 pt-4 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">{pathDay.content_vi}</p>
              {pathDay.audio_content_vi && (
                <AudioBar 
                  src={pathDay.audio_content_vi} 
                  label="VI" 
                  onPlay={companion.onAudioPlay}
                  onEnded={companion.onAudioEnded}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reflection Section */}
        <Card ref={reflectionRef as any}>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Reflection</h2>
            
            {/* English */}
            <div className="space-y-2">
              <p className="text-foreground leading-relaxed italic">{pathDay.reflection_en}</p>
              {pathDay.audio_reflection_en && (
                <AudioBar src={pathDay.audio_reflection_en} label="EN" />
              )}
            </div>

            {/* Vietnamese */}
            <div className="space-y-2 pt-4 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed italic">{pathDay.reflection_vi}</p>
              {pathDay.audio_reflection_vi && (
                <AudioBar src={pathDay.audio_reflection_vi} label="VI" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dare Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-primary">Today's Dare</h2>
            
            {/* English */}
            <div className="space-y-2">
              <p className="text-foreground leading-relaxed font-medium">{pathDay.dare_en}</p>
              {pathDay.audio_dare_en && (
                <AudioBar src={pathDay.audio_dare_en} label="EN" />
              )}
            </div>

            {/* Vietnamese */}
            <div className="space-y-2 pt-4 border-t border-primary/10">
              <p className="text-muted-foreground leading-relaxed font-medium">{pathDay.dare_vi}</p>
              {pathDay.audio_dare_vi && (
                <AudioBar src={pathDay.audio_dare_vi} label="VI" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complete Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4">
        <div className="max-w-[720px] mx-auto">
          {isCompleted ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Completed
              </span>
              {!isLastDay && (
                <Button onClick={() => navigate(`/paths/${slug}/day/${dayIndex + 1}`)}>
                  Next Day
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleComplete}
              disabled={completeDay.isPending}
            >
              {completeDay.isPending ? 'Completing...' : isLastDay ? 'Complete Path' : 'Complete Today'}
              {!isLastDay && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Simple audio bar component for playing path audio
 */
function AudioBar({ 
  src, 
  label,
  onPlay,
  onEnded,
}: { 
  src: string; 
  label: string;
  onPlay?: () => void;
  onEnded?: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, onEnded]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
      
      // Trigger onPlay only on first play
      if (!hasPlayedRef.current) {
        hasPlayedRef.current = true;
        onPlay?.();
      }
    }
  };

  return (
    <button
      onClick={togglePlay}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors text-sm"
    >
      <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-primary' : 'text-muted-foreground'}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </button>
  );
}
