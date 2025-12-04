import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, VolumeX } from 'lucide-react';
import { MercyAvatar } from './MercyAvatar';
import { Button } from '@/components/ui/button';

export interface CompanionAction {
  id: string;
  label: string;
  labelVi?: string;
  onClick: () => void;
}

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
  actions?: CompanionAction[];
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
  showMuteOption = false,
  actions = [],
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

  const hasActions = actions.length > 0;

  return (
    <div 
      className={cn(
        // Positioning: bottom-right inside 720px content, above bottom bar on mobile
        'fixed z-40',
        'bottom-28 right-4', // Mobile: above music bar
        'md:bottom-8 md:right-[max(1rem,calc(50vw-360px+1rem))]', // Desktop: inside 720px
        // Size: bigger and clearer
        'w-[min(360px,calc(100vw-2rem))] max-w-sm',
        // Animation
        'transition-all duration-300 ease-out',
        isAnimating 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-95',
        className
      )} 
      role="dialog" 
      aria-live="polite"
      aria-label="Mercy companion"
    >
      <div className="flex flex-col rounded-2xl bg-card/98 backdrop-blur-md shadow-xl border border-border/60 overflow-hidden">
        {/* Header with avatar and text */}
        <div className="flex items-start gap-3 px-4 py-4">
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

        {/* Action buttons */}
        {hasActions && (
          <div className="px-4 pb-4 pt-1">
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant="secondary"
                  size="sm"
                  onClick={action.onClick}
                  className="text-xs px-3 py-1.5 h-auto"
                >
                  <span>{action.label}</span>
                  {action.labelVi && (
                    <span className="text-muted-foreground ml-1">/ {action.labelVi}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Mute option - only show when no actions and option enabled */}
        {!hasActions && showMuteOption && onMuteRoom && (
          <div className="px-4 pb-3">
            <button 
              type="button" 
              onClick={() => { onMuteRoom(); handleClose(); }} 
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <VolumeX className="h-3.5 w-3.5" />
              Hide Mercy in this room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanionBubble;
