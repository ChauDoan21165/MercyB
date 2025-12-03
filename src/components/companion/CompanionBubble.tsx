import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface CompanionBubbleProps {
  text: string;
  visible: boolean;
  onClose?: () => void;
  /** For bilingual display (optional) */
  textVi?: string;
  /** Auto-hide duration in ms (default 3000) */
  duration?: number;
  className?: string;
}

/**
 * CompanionBubble - Friendly speech bubble for companion messages
 * Shows above the audio player, auto-hides after duration
 */
export function CompanionBubble({
  text,
  visible,
  onClose,
  textVi,
  duration = 3000,
  className,
}: CompanionBubbleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // Wait for fade out animation before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        'absolute z-50 pointer-events-auto',
        'transition-all duration-300 ease-out',
        isAnimating
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2',
        className
      )}
      style={{
        bottom: '100%',
        left: '50%',
        transform: `translateX(-50%) ${isAnimating ? 'translateY(-8px)' : 'translateY(0)'}`,
        marginBottom: '8px',
      }}
    >
      <div className="relative">
        {/* Bubble */}
        <div
          className={cn(
            'bg-card/95 backdrop-blur-sm',
            'border border-border/50',
            'rounded-2xl px-4 py-3',
            'shadow-lg',
            'max-w-[260px] min-w-[180px]'
          )}
        >
          {/* Close button */}
          {onClose && (
            <button
              onClick={handleClose}
              className={cn(
                'absolute -top-2 -right-2',
                'w-6 h-6 rounded-full',
                'bg-muted hover:bg-muted/80',
                'flex items-center justify-center',
                'text-muted-foreground hover:text-foreground',
                'transition-colors',
                'shadow-sm'
              )}
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {/* Text content */}
          <p className="text-sm text-foreground leading-relaxed">{text}</p>
          {textVi && (
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {textVi}
            </p>
          )}
        </div>

        {/* Speech bubble tail */}
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2',
            'w-0 h-0',
            'border-l-8 border-r-8 border-t-8',
            'border-l-transparent border-r-transparent',
            'border-t-card/95'
          )}
          style={{ bottom: '-8px' }}
        />
      </div>
    </div>
  );
}

// Re-export for backward compatibility
export default CompanionBubble;
