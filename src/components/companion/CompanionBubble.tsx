import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, VolumeX } from 'lucide-react';
import { MercyAvatar } from './MercyAvatar';

interface CompanionBubbleProps {
  text: string;
  visible: boolean;
  onClose?: () => void;
  textVi?: string;
  duration?: number;
  isTalking?: boolean;
  title?: string;
  className?: string;
  onMuteRoom?: () => void;
  showMuteOption?: boolean;
}

export function CompanionBubble({ 
  text, 
  visible, 
  onClose, 
  textVi, 
  isTalking = false, 
  title = 'Mercy', 
  className, 
  onMuteRoom, 
  showMuteOption = false 
}: CompanionBubbleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (visible) { 
      setShouldRender(true); 
      requestAnimationFrame(() => setIsAnimating(true)); 
    } else { 
      setIsAnimating(false); 
      const t = setTimeout(() => setShouldRender(false), 300); 
      return () => clearTimeout(t); 
    }
  }, [visible]);

  const handleClose = useCallback(() => { 
    setIsAnimating(false); 
    setTimeout(() => onClose?.(), 300); 
  }, [onClose]);

  if (!shouldRender || !text) return null;

  return (
    <div 
      className={cn(
        // Positioning: bottom-right inside 720px content, above bottom bar on mobile
        'fixed z-40',
        'bottom-28 right-4', // Mobile: above music bar
        'md:bottom-8 md:right-[max(1rem,calc(50vw-360px+1rem))]', // Desktop: inside 720px
        // Size: bigger and clearer
        'w-[min(340px,calc(100vw-2rem))] max-w-sm',
        // Animation
        'transition-all duration-300 ease-out',
        isAnimating 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-95',
        className
      )} 
      role="status" 
      aria-live="polite"
    >
      <div className="flex items-start gap-3 rounded-2xl bg-card/98 backdrop-blur-md shadow-xl px-4 py-4 border border-border/60">
        {/* Bigger avatar */}
        <MercyAvatar size={56} isTalking={isTalking} className="mt-0.5" />
        
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="font-semibold text-base text-foreground">{title}</p>
          
          {/* Main text - larger */}
          <p className="text-sm md:text-base text-muted-foreground mt-1 leading-relaxed">{text}</p>
          
          {/* Vietnamese text if provided */}
          {textVi && (
            <p className="text-xs md:text-sm text-muted-foreground/70 mt-1.5 italic">{textVi}</p>
          )}
          
          {/* Mute option */}
          {showMuteOption && onMuteRoom && (
            <button 
              type="button" 
              onClick={() => { onMuteRoom(); handleClose(); }} 
              className="mt-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <VolumeX className="h-3.5 w-3.5" />
              Hide Mercy in this room
            </button>
          )}
        </div>
        
        {/* Close button */}
        {onClose && (
          <button 
            type="button" 
            onClick={handleClose} 
            className="flex-shrink-0 ml-1 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" 
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default CompanionBubble;
