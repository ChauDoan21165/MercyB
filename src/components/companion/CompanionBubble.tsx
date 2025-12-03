import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CompanionBubbleProps {
  textEn: string;
  textVi: string;
  show: boolean;
  onHide?: () => void;
  duration?: number;
  className?: string;
}

/**
 * CompanionBubble - Small bilingual speech bubble
 * Shows EN on first line, VI on second
 * Auto-hides after duration (default 3s)
 */
export function CompanionBubble({
  textEn,
  textVi,
  show,
  onHide,
  duration = 3000,
  className,
}: CompanionBubbleProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimating(true);

      const timer = setTimeout(() => {
        setAnimating(false);
        setTimeout(() => {
          setVisible(false);
          onHide?.();
        }, 300); // fade out duration
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onHide]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'absolute z-50 pointer-events-none',
        'transition-all duration-300 ease-out',
        animating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
        className
      )}
    >
      <div className="relative">
        {/* Bubble */}
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 shadow-lg max-w-[280px]">
          <p className="text-sm text-foreground leading-relaxed">{textEn}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{textVi}</p>
        </div>
        {/* Speech bubble tail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-card/95" />
      </div>
    </div>
  );
}
