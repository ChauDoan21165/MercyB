/**
 * Mercy Host Core Component
 * 
 * Renders avatar + animation container with absolute positioning.
 * Includes voice line display bubble and ritual banner.
 * Phase 6: Added ritual banner for ceremonies.
 * Phase 7: Added teacher hint bubble.
 */

import { useEffect, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { MercyAvatar } from './MercyAvatar';
import { MercyAnimation } from './MercyAnimations';
import { useMercyHostContext } from './MercyHostProvider';
import { X, Volume2, Sparkles, Star, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MercyHostCoreProps {
  className?: string;
  position?: 'top-right' | 'bottom-right' | 'bottom-left';
}

export function MercyHostCore({ 
  className,
  position = 'top-right'
}: MercyHostCoreProps) {
  const mercy = useMercyHostContext();
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  
  // Track viewport for auto-dismiss on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Auto-dismiss bubble on significant viewport change (>15%)
  useEffect(() => {
    if (viewportSize.width === 0) return;
    
    const handleResize = () => {
      const widthChange = Math.abs(window.innerWidth - viewportSize.width) / viewportSize.width;
      const heightChange = Math.abs(window.innerHeight - viewportSize.height) / viewportSize.height;
      
      if (widthChange > 0.15 || heightChange > 0.15) {
        mercy.dismiss();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewportSize, mercy]);
  
  // Keyboard shortcut: Shift+M toggles host visibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'M') {
        e.preventDefault();
        mercy.setEnabled(!mercy.isEnabled);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mercy]);
  
  // Don't render if disabled
  if (!mercy.isEnabled) return null;
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-20 right-4',
    'bottom-right': 'bottom-24 right-4',
    'bottom-left': 'bottom-24 left-4'
  };
  
  // Presence opacity
  const presenceOpacity = {
    hidden: 'opacity-0 pointer-events-none',
    idle: 'opacity-60',
    active: 'opacity-100'
  };
  
  const displayText = mercy.currentVoiceLine 
    ? (mercy.language === 'vi' ? mercy.currentVoiceLine.vi : mercy.currentVoiceLine.en)
    : null;

  // Ritual banner text
  const ritualText = mercy.lastRitualText
    ? (mercy.language === 'vi' ? mercy.lastRitualText.vi : mercy.lastRitualText.en)
    : null;

  // Teacher hint text - Phase 7
  const teacherHintText = mercy.lastEnglishTip
    ? (mercy.language === 'vi' ? mercy.lastEnglishTip.vi : mercy.lastEnglishTip.en)
    : null;

  // Show teacher hint only in English domain
  const showTeacherHint = 
    mercy.isTeacherHintVisible && 
    teacherHintText && 
    mercy.currentRoomDomain === 'english' &&
    mercy.teacherLevel !== 'gentle'; // 'gentle' mode doesn't show hints proactively
  
  return (
    <div 
      className={cn(
        'fixed z-50 transition-all duration-300',
        positionClasses[position],
        presenceOpacity[mercy.presenceState],
        className
      )}
    >
      {/* Avatar Container */}
      <div className="relative">
        {/* Animation Layer */}
        {mercy.currentAnimation && (
          <div className="absolute -inset-2 pointer-events-none">
            <MercyAnimation 
              variant={mercy.currentAnimation as any} 
              size={72} 
            />
          </div>
        )}
        
        {/* Avatar */}
        <button
          onClick={mercy.show}
          className="relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
          aria-label="Mercy Host"
        >
          <MercyAvatar 
            size={56} 
            style={mercy.avatarStyle}
            animate={mercy.presenceState === 'active'}
          />
        </button>
      </div>
      
      {/* Voice Line Bubble */}
      {mercy.isBubbleVisible && displayText && !mercy.isRitualBannerVisible && !showTeacherHint && (
        <VoiceLineBubble
          text={displayText}
          language={mercy.language}
          onDismiss={mercy.dismiss}
        />
      )}

      {/* Ritual Banner - Phase 6 */}
      {mercy.isRitualBannerVisible && ritualText && (
        <RitualBanner
          text={ritualText}
          ritualId={mercy.lastRitualId}
          isCeremony={!!mercy.lastCeremonyTier}
          animation={mercy.currentAnimation}
          onDismiss={mercy.dismissRitualBanner}
        />
      )}

      {/* Teacher Hint Bubble - Phase 7 */}
      {showTeacherHint && !mercy.isRitualBannerVisible && (
        <TeacherHintBubble
          text={teacherHintText!}
          language={mercy.language}
          onDismiss={mercy.dismissTeacherHint}
        />
      )}
    </div>
  );
}

/**
 * Voice Line Bubble Component
 */
interface VoiceLineBubbleProps {
  text: string;
  language: 'en' | 'vi';
  onDismiss: () => void;
}

function VoiceLineBubble({ text, language, onDismiss }: VoiceLineBubbleProps) {
  return (
    <div 
      className={cn(
        "absolute right-0 top-full mt-2 w-64",
        "animate-fade-in"
      )}
    >
      <div className="relative bg-background/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-lg">
        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-background border border-border shadow-sm"
        >
          <X className="h-3 w-3" />
        </Button>
        
        {/* Speaker indicator */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Volume2 className="w-2.5 h-2.5 text-primary" />
          </div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Mercy
          </span>
        </div>
        
        {/* Text */}
        <p className="text-sm text-foreground leading-relaxed">
          {text}
        </p>
        
        {/* Tail */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-background border-l border-t border-border rotate-45" />
      </div>
    </div>
  );
}

/**
 * Ritual Banner Component - Phase 6
 */
interface RitualBannerProps {
  text: string;
  ritualId: string | null;
  isCeremony: boolean;
  animation: string | null;
  onDismiss: () => void;
}

function RitualBanner({ text, ritualId, isCeremony, animation, onDismiss }: RitualBannerProps) {
  const isCrisisRitual = ritualId === 'crisis_gentle';
  
  return (
    <div 
      className={cn(
        "absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)]",
        "animate-fade-in"
      )}
    >
      <div 
        className={cn(
          "relative rounded-xl p-4 shadow-xl backdrop-blur-sm border",
          isCrisisRitual 
            ? "bg-muted/90 border-border/50" 
            : isCeremony 
              ? "bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30"
              : "bg-background/95 border-border"
        )}
      >
        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-background border border-border shadow-sm"
        >
          <X className="h-3 w-3" />
        </Button>
        
        {/* Header with icon */}
        <div className="flex items-center gap-2 mb-2">
          <div className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center",
            isCeremony ? "bg-primary/30" : "bg-accent/30"
          )}>
            {isCeremony ? (
              <Star className="w-3 h-3 text-primary" />
            ) : (
              <Sparkles className="w-3 h-3 text-accent-foreground" />
            )}
          </div>
          <span className={cn(
            "text-[10px] font-semibold uppercase tracking-wider",
            isCeremony ? "text-primary" : "text-muted-foreground"
          )}>
            {isCeremony ? 'VIP Ceremony' : 'Milestone'}
          </span>
        </div>
        
        {/* Ritual text */}
        <p className={cn(
          "text-sm leading-relaxed",
          isCrisisRitual ? "text-muted-foreground" : "text-foreground"
        )}>
          {text}
        </p>
        
        {/* Subtle animation indicator */}
        {!isCrisisRitual && animation && animation !== 'halo' && (
          <div className="absolute -inset-px rounded-xl overflow-hidden pointer-events-none">
            <div className={cn(
              "absolute inset-0 opacity-30",
              animation === 'shimmer' && "animate-pulse",
              animation === 'glow' && "bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            )} />
          </div>
        )}
        
        {/* Tail */}
        <div className={cn(
          "absolute -top-2 right-6 w-4 h-4 rotate-45 border-l border-t",
          isCrisisRitual 
            ? "bg-muted/90 border-border/50"
            : isCeremony 
              ? "bg-primary/10 border-primary/30"
              : "bg-background border-border"
        )} />
      </div>
    </div>
  );
}

/**
 * Teacher Hint Bubble Component - Phase 7
 */
interface TeacherHintBubbleProps {
  text: string;
  language: 'en' | 'vi';
  onDismiss: () => void;
}

function TeacherHintBubble({ text, language, onDismiss }: TeacherHintBubbleProps) {
  return (
    <div 
      className={cn(
        "absolute right-0 top-full mt-2 w-64",
        "animate-fade-in"
      )}
    >
      <div className="relative bg-emerald-50 dark:bg-emerald-950/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 shadow-lg">
        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-background border border-border shadow-sm"
        >
          <X className="h-3 w-3" />
        </Button>
        
        {/* Teacher indicator */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <GraduationCap className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            {language === 'vi' ? 'Gợi ý học' : 'Teacher Tip'}
          </span>
        </div>
        
        {/* Text */}
        <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
          {text}
        </p>
        
        {/* Tail */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-emerald-50 dark:bg-emerald-950/50 border-l border-t border-emerald-200 dark:border-emerald-800 rotate-45" />
      </div>
    </div>
  );
}

/**
 * Compact Mercy Host Button (for reopening)
 */
export function MercyHostButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed top-20 right-4 z-40",
        "h-10 w-10 rounded-full",
        "bg-background/95 backdrop-blur-sm border border-border shadow-lg",
        "flex items-center justify-center",
        "hover:bg-accent transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
      aria-label="Show Mercy Host"
    >
      <MercyAvatar size={24} animate={false} />
    </button>
  );
}
