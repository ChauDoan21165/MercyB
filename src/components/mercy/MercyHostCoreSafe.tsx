/**
 * SSR-Safe Mercy Host Core
 *
 * Fixed:
 * - Removed client-only render gate that delayed first paint on hard refresh
 * - Replaced useIsClient() visibility blocking with direct SSR-safe window/document guards
 */

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MercyAvatar } from './MercyAvatar';
import { MercyAnimation } from './MercyAnimations';
import { useMercyHostContext } from './MercyHostProvider';
import { X, Volume2, VolumeX, Sword, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MercyHostCoreProps {
  className?: string;
  position?: 'top-right' | 'bottom-right' | 'bottom-left';
}

/**
 * SSR-Safe placeholder skeleton
 * Kept for optional future use, but no longer used to block first paint.
 */
function MercyHostSkeleton({ position = 'top-right' }: { position?: string }) {
  const positionClasses: Record<string, string> = {
    'top-right': 'top-20 right-4',
    'bottom-right': 'bottom-24 right-4',
    'bottom-left': 'bottom-24 left-4',
  };

  return (
    <div
      className={cn(
        'fixed z-50 opacity-50',
        positionClasses[position] || positionClasses['top-right'],
      )}
    >
      <div className="w-14 h-14 rounded-full bg-muted animate-pulse" />
    </div>
  );
}

export function MercyHostCore({
  className,
  position = 'top-right',
}: MercyHostCoreProps) {
  const mercy = useMercyHostContext();
  const [lastViewportSize, setLastViewportSize] = useState({ width: 0, height: 0 });
  const [hasShownLimitMessage, setHasShownLimitMessage] = useState(false);

  // Auto-dismiss bubble on viewport resize > 15%
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      if (lastViewportSize.width > 0) {
        const widthChange =
          Math.abs(newWidth - lastViewportSize.width) / lastViewportSize.width;
        const heightChange =
          Math.abs(newHeight - lastViewportSize.height) / lastViewportSize.height;

        if (widthChange > 0.15 || heightChange > 0.15) {
          mercy.dismiss();
        }
      }

      setLastViewportSize({ width: newWidth, height: newHeight });
    };

    const handleOrientationChange = () => {
      mercy.dismiss();
    };

    // Initial size
    setLastViewportSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [lastViewportSize, mercy]);

  // Keyboard shortcut: Shift+M toggles host visibility
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'M') {
        e.preventDefault();
        mercy.setEnabled(!mercy.isEnabled);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mercy]);

  if (typeof document === 'undefined') return null;

  // Don't render if disabled
  if (!mercy.isEnabled) return null;

  // Position classes
  const positionClasses: Record<string, string> = {
    'top-right': 'top-20 right-4',
    'bottom-right': 'bottom-24 right-4',
    'bottom-left': 'bottom-24 left-4',
  };

  // Presence opacity
  const presenceOpacity: Record<string, string> = {
    hidden: 'opacity-0 pointer-events-none',
    idle: 'opacity-60',
    active: 'opacity-100',
  };

  const displayText = mercy.currentVoiceLine
    ? mercy.language === 'vi'
      ? mercy.currentVoiceLine.vi
      : mercy.currentVoiceLine.en
    : null;

  // Check silence mode from state (not hostPreferences)
  const isSilenceMode = mercy.silenceMode ?? false;

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300',
        positionClasses[position],
        presenceOpacity[mercy.presenceState],
        className,
      )}
    >
      <div className="relative">
        {mercy.currentAnimation && !isSilenceMode && (
          <div className="absolute -inset-2 pointer-events-none">
            <MercyAnimation
              variant={
                mercy.currentAnimation as 'halo' | 'shimmer' | 'spark' | 'ripple' | 'glow'
              }
              size={72}
            />
          </div>
        )}

        <button
          onClick={mercy.show}
          className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Mercy Host"
        >
          <MercyAvatar
            size={56}
            style={mercy.avatarStyle}
            animate={mercy.presenceState === 'active' && !isSilenceMode}
          />

          {isSilenceMode && (
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/50">
              <VolumeX className="h-3 w-3 text-background" />
            </div>
          )}
        </button>
      </div>

      {mercy.isBubbleVisible && displayText && !isSilenceMode && (
        <VoiceLineBubble
          text={displayText}
          language={mercy.language}
          onDismiss={mercy.dismiss}
        />
      )}

      {mercy.isMartialHintVisible && mercy.lastMartialTip && !isSilenceMode && (
        <MartialHintBubble
          text={mercy.language === 'vi' ? mercy.lastMartialTip.vi : mercy.lastMartialTip.en}
          onDismiss={mercy.dismissMartialHint}
        />
      )}

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
        'absolute right-0 top-full mt-2 w-64',
        'animate-fade-in',
        'max-w-[calc(100vw-2rem)]',
      )}
    >
      <div className="relative rounded-xl border border-amber-600/50 bg-amber-900/90 p-3 shadow-lg backdrop-blur-sm dark:bg-amber-950/95">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute -right-2 -top-2 h-5 w-5 rounded-full border border-amber-600 bg-amber-800 shadow-sm hover:bg-amber-700"
        >
          <X className="h-3 w-3 text-amber-100" />
        </Button>

        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-600/30">
            <Sword className="h-2.5 w-2.5 text-amber-300" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wide text-amber-300">
            Martial Coach
          </span>
        </div>

        <p className="text-sm leading-relaxed text-amber-50">{text}</p>

        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-amber-600/50 bg-amber-900/90 dark:bg-amber-950/95" />
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
  const message =
    language === 'vi'
      ? 'Giờ mình sẽ hơi yên lặng để chăm mọi người công bằng hơn. Mình vẫn ở đây với bạn.'
      : "I'll go quiet for now to take care of everyone fairly. I'm still here with you.";

  return (
    <div
      className={cn(
        'absolute right-0 top-full mt-2 w-64',
        'animate-fade-in',
        'max-w-[calc(100vw-2rem)]',
      )}
    >
      <div className="relative rounded-xl border border-slate-600/50 bg-slate-800/95 p-3 shadow-lg backdrop-blur-sm dark:bg-slate-900/95">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute -right-2 -top-2 h-5 w-5 rounded-full border border-slate-600 bg-slate-700 shadow-sm hover:bg-slate-600"
        >
          <X className="h-3 w-3 text-slate-100" />
        </Button>

        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-600/30">
            <Moon className="h-2.5 w-2.5 text-slate-300" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-300">
            {language === 'vi' ? 'Nghỉ ngơi' : 'Resting'}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-slate-50">{message}</p>

        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-slate-600/50 bg-slate-800/95 dark:bg-slate-900/95" />
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
        'absolute right-0 top-full mt-2 w-64',
        'animate-fade-in',
        'max-w-[calc(100vw-2rem)]',
      )}
    >
      <div className="relative rounded-xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute -right-2 -top-2 h-5 w-5 rounded-full border border-border bg-background shadow-sm"
        >
          <X className="h-3 w-3" />
        </Button>

        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
            <Volume2 className="h-2.5 w-2.5 text-primary" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Mercy
          </span>
        </div>

        <p className="text-sm leading-relaxed text-foreground">{text}</p>

        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-border bg-background" />
      </div>
    </div>
  );
}

/**
 * Compact Mercy Host Button (for reopening)
 */
export function MercyHostButton({ onClick }: { onClick: () => void }) {
  if (typeof document === 'undefined') return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed top-20 right-4 z-40',
        'h-10 w-10 rounded-full',
        'border border-border bg-background/95 shadow-lg backdrop-blur-sm',
        'flex items-center justify-center',
        'hover:bg-accent transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      )}
      aria-label="Show Mercy Host"
    >
      <MercyAvatar size={24} animate={false} />
    </button>
  );
}