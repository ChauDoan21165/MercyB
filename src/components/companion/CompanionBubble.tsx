import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { MercyAvatar } from './MercyAvatar';

interface CompanionBubbleProps {
  text: string;
  visible: boolean;
  onClose?: () => void;
  /** For bilingual display (optional) */
  textVi?: string;
  /** Auto-hide duration in ms (default 3000) */
  duration?: number;
  /** Whether Mercy is currently "speaking" (audio playing) */
  isTalking?: boolean;
  /** Optional title for the bubble */
  title?: string;
  className?: string;
}

/**
 * CompanionBubble - Friendly floating bubble with Mercy avatar
 * Positioned at bottom-right, dismissible, with gentle animations
 */
export function CompanionBubble({
  text,
  visible,
  onClose,
  textVi,
  duration = 3000,
  isTalking = false,
  title = 'Mercy',
  className,
}: CompanionBubbleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
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
        // Fixed position at bottom-right, above music bar on mobile
        'fixed z-40 pointer-events-auto',
        // Responsive positioning
        'bottom-24 right-4 md:bottom-8 md:right-8',
        // Max width respecting content area
        'max-w-sm w-[min(320px,calc(100vw-2rem))]',
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
      <div
        className={cn(
          'flex items-start gap-3',
          'rounded-2xl',
          'bg-card/95 backdrop-blur-sm',
          'shadow-lg',
          'px-3 py-3',
          'border border-border/50'
        )}
      >
        {/* Avatar */}
        <MercyAvatar size={36} isTalking={isTalking} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            {text}
          </p>
          {textVi && (
            <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
              {textVi}
            </p>
          )}
        </div>

        {/* Close button */}
        {onClose && (
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'flex-shrink-0 ml-1',
              'w-6 h-6 rounded-full',
              'flex items-center justify-center',
              'text-muted-foreground hover:text-foreground',
              'hover:bg-muted/50',
              'transition-colors'
            )}
            aria-label="Hide Mercy helper"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default CompanionBubble;
