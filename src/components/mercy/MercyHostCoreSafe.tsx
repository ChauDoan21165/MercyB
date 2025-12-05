/**
 * SSR-Safe Mercy Host Core
 * 
 * Wraps MercyHostCore with client-side only rendering.
 */

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { MercyAvatar } from './MercyAvatar';
import { MercyAnimation } from './MercyAnimations';
import { useMercyHostContext } from './MercyHostProvider';
import { X, Volume2, VolumeX, Sword, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Hook to detect client-side rendering
 */
function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

interface MercyHostCoreProps {
  className?: string;
  position?: 'top-right' | 'bottom-right' | 'bottom-left';
}

/**
 * SSR-Safe placeholder skeleton
 */
function MercyHostSkeleton({ position = 'top-right' }: { position?: string }) {
  const positionClasses: Record<string, string> = {
    'top-right': 'top-20 right-4',
    'bottom-right': 'bottom-24 right-4',
    'bottom-left': 'bottom-24 left-4'
  };

  return (
    <div 
      className={cn(
        'fixed z-50 opacity-50',
        positionClasses[position] || positionClasses['top-right']
      )}
    >
      <div className="w-14 h-14 rounded-full bg-muted animate-pulse" />
    </div>
  );
}

export function MercyHostCore({ 
  className,
  position = 'top-right'
}: MercyHostCoreProps) {
  const isClient = useIsClient();
  const mercy = useMercyHostContext();
  const [lastViewportSize, setLastViewportSize] = useState({ width: 0, height: 0 });
  const [hasShownLimitMessage, setHasShownLimitMessage] = useState(false);

  // Auto-dismiss bubble on viewport resize > 15%
  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      if (lastViewportSize.width > 0) {
        const widthChange = Math.abs(newWidth - lastViewportSize.width) / lastViewportSize.width;
        const heightChange = Math.abs(newHeight - lastViewportSize.height) / lastViewportSize.height;

        if (widthChange > 0.15 || heightChange > 0.15) {
          mercy.dismiss();
        }
      }

      setLastViewportSize({ width: newWidth, height: newHeight });
    };

    // Initial size
    setLastViewportSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // Dismiss on rotation
      mercy.dismiss();
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isClient, lastViewportSize, mercy]);

  // Keyboard shortcut: Shift+M toggles host visibility
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'M') {
        e.preventDefault();
        mercy.setEnabled(!mercy.isEnabled);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient, mercy]);

  // Show skeleton during SSR
  if (!isClient) {
    return <MercyHostSkeleton position={position} />;
  }

  // Don't render if disabled
  if (!mercy.isEnabled) return null;

  // Position classes
  const positionClasses: Record<string, string> = {
    'top-right': 'top-20 right-4',
    'bottom-right': 'bottom-24 right-4',
    'bottom-left': 'bottom-24 left-4'
  };

  // Presence opacity
  const presenceOpacity: Record<string, string> = {
    hidden: 'opacity-0 pointer-events-none',
    idle: 'opacity-60',
    active: 'opacity-100'
  };

  const displayText = mercy.currentVoiceLine 
    ? (mercy.language === 'vi' ? mercy.currentVoiceLine.vi : mercy.currentVoiceLine.en)
    : null;

  // Check silence mode from state (not hostPreferences)
  const isSilenceMode = mercy.silenceMode ?? false;

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
        {mercy.currentAnimation && !isSilenceMode && (
          <div className="absolute -inset-2 pointer-events-none">
            <MercyAnimation 
              variant={mercy.currentAnimation as 'halo' | 'shimmer' | 'spark' | 'ripple' | 'glow'} 
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
            animate={mercy.presenceState === 'active' && !isSilenceMode}
          />
          
          {/* Silence mode indicator */}
          {isSilenceMode && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-muted-foreground/50 flex items-center justify-center">
              <VolumeX className="w-3 h-3 text-background" />
            </div>
          )}
        </button>
      </div>
      
      {/* Voice Line Bubble - hidden in silence mode */}
      {mercy.isBubbleVisible && displayText && !isSilenceMode && (
        <VoiceLineBubble
          text={displayText}
          language={mercy.language}
          onDismiss={mercy.dismiss}
        />
      )}

      {/* Martial Hint Bubble - Phase 8 */}
      {mercy.isMartialHintVisible && mercy.lastMartialTip && !isSilenceMode && (
        <MartialHintBubble
          text={mercy.language === 'vi' ? mercy.lastMartialTip.vi : mercy.lastMartialTip.en}
          onDismiss={mercy.dismissMartialHint}
        />
      )}

      {/* Talk Limit Message - Phase 9 */}
      {mercy.isTalkLimited && !hasShownLimitMessage && !isSilenceMode && (
        <TalkLimitBubble
          language={mercy.language}
          onDismiss={() => setHasShownLimitMessage(true)}
        />
      )}
    </div>
  );
}

/**
 * Martial Hint Bubble Component - Phase 8
 */
interface MartialHintBubbleProps {
  text: string;
  onDismiss: () => void;
}

function MartialHintBubble({ text, onDismiss }: MartialHintBubbleProps) {
  if (!text) return null;
  
  return (
    <div 
      className={cn(
        "absolute right-0 top-full mt-2 w-64",
        "animate-fade-in",
        "max-w-[calc(100vw-2rem)]"
      )}
    >
      <div className="relative bg-amber-900/90 dark:bg-amber-950/95 backdrop-blur-sm border border-amber-600/50 rounded-xl p-3 shadow-lg">
        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-amber-800 border border-amber-600 shadow-sm hover:bg-amber-700"
        >
          <X className="h-3 w-3 text-amber-100" />
        </Button>
        
        {/* Sword indicator */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 rounded-full bg-amber-600/30 flex items-center justify-center">
            <Sword className="w-2.5 h-2.5 text-amber-300" />
          </div>
          <span className="text-[10px] font-medium text-amber-300 uppercase tracking-wide">
            Martial Coach
          </span>
        </div>
        
        {/* Text */}
        <p className="text-sm text-amber-50 leading-relaxed">
          {text}
        </p>
        
        {/* Tail */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-amber-900/90 dark:bg-amber-950/95 border-l border-t border-amber-600/50 rotate-45" />
      </div>
    </div>
  );
}

/**
 * Talk Limit Bubble Component - Phase 9
 */
interface TalkLimitBubbleProps {
  language: 'en' | 'vi';
  onDismiss: () => void;
}

function TalkLimitBubble({ language, onDismiss }: TalkLimitBubbleProps) {
  const message = language === 'vi' 
    ? "Giờ mình sẽ hơi yên lặng để chăm mọi người công bằng hơn. Mình vẫn ở đây với bạn."
    : "I'll go quiet for now to take care of everyone fairly. I'm still here with you.";
  
  return (
    <div 
      className={cn(
        "absolute right-0 top-full mt-2 w-64",
        "animate-fade-in",
        "max-w-[calc(100vw-2rem)]"
      )}
    >
      <div className="relative bg-slate-800/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-600/50 rounded-xl p-3 shadow-lg">
        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-slate-700 border border-slate-600 shadow-sm hover:bg-slate-600"
        >
          <X className="h-3 w-3 text-slate-100" />
        </Button>
        
        {/* Moon indicator */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 rounded-full bg-slate-600/30 flex items-center justify-center">
            <Moon className="w-2.5 h-2.5 text-slate-300" />
          </div>
          <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wide">
            {language === 'vi' ? 'Nghỉ ngơi' : 'Resting'}
          </span>
        </div>
        
        {/* Text */}
        <p className="text-sm text-slate-50 leading-relaxed">
          {message}
        </p>
        
        {/* Tail */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-slate-800/95 dark:bg-slate-900/95 border-l border-t border-slate-600/50 rotate-45" />
      </div>
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
        "animate-fade-in",
        // Mobile safe zone
        "max-w-[calc(100vw-2rem)]"
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
 * Compact Mercy Host Button (for reopening)
 */
export function MercyHostButton({ onClick }: { onClick: () => void }) {
  const isClient = useIsClient();
  
  if (!isClient) return null;

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
