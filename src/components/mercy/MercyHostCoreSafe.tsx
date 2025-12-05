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
import { X, Volume2, VolumeX } from 'lucide-react';
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

  // Check silence mode from preferences
  const isSilenceMode = mercy.hostPreferences?.silenceMode ?? false;

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
