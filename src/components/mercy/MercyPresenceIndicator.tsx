/**
 * Mercy Presence Indicator
 * 
 * Tiny glowing dot showing Mercy is active.
 * Used when avatar is hidden but host is still listening.
 */

import { cn } from '@/lib/utils';

interface MercyPresenceIndicatorProps {
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function MercyPresenceIndicator({
  active = true,
  size = 'md',
  className,
  onClick
}: MercyPresenceIndicatorProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const glowSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  if (!active) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full",
        onClick && "cursor-pointer hover:scale-110 transition-transform",
        !onClick && "cursor-default",
        className
      )}
      aria-label="Mercy is present"
    >
      {/* Outer glow */}
      <div 
        className={cn(
          "absolute rounded-full bg-primary/20 animate-pulse",
          glowSizes[size]
        )}
      />
      
      {/* Middle glow */}
      <div 
        className={cn(
          "absolute rounded-full bg-primary/40",
          sizeClasses[size],
          "scale-150"
        )}
        style={{
          animation: 'mercy-breathe 3s ease-in-out infinite'
        }}
      />
      
      {/* Core dot */}
      <div 
        className={cn(
          "relative rounded-full bg-primary shadow-lg",
          sizeClasses[size],
          "shadow-primary/50"
        )}
      />
    </button>
  );
}

/**
 * Compact Mercy indicator for navbar/header use
 */
export function MercyNavIndicator({
  active = true,
  onClick
}: {
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <MercyPresenceIndicator
      active={active}
      size="sm"
      onClick={onClick}
      className="ml-2"
    />
  );
}
