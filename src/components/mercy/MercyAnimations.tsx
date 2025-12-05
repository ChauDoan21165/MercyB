/**
 * Mercy Micro-Animations
 * 
 * CSS-based animations for Mercy's presence indicators.
 * Lightweight, non-distracting, 60-80% opacity.
 */

import { cn } from '@/lib/utils';

type AnimationVariant = 'halo' | 'shimmer' | 'spark' | 'ripple' | 'glow';

interface MercyAnimationProps {
  variant: AnimationVariant;
  className?: string;
  size?: number;
}

export function MercyAnimation({ variant, className, size = 40 }: MercyAnimationProps) {
  switch (variant) {
    case 'halo':
      return <HaloPulse className={className} size={size} />;
    case 'shimmer':
      return <WingsShimmer className={className} size={size} />;
    case 'spark':
      return <GuidingSpark className={className} size={size} />;
    case 'ripple':
      return <RippleWelcome className={className} size={size} />;
    case 'glow':
      return <ColorShiftGlow className={className} size={size} />;
    default:
      return null;
  }
}

/**
 * Halo Pulse - breathing rhythm around an element
 */
function HaloPulse({ className, size }: { className?: string; size: number }) {
  return (
    <div 
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute inset-0 rounded-full bg-primary/20 animate-halo-pulse"
        style={{ animationDuration: '3s' }}
      />
      <div 
        className="absolute inset-2 rounded-full bg-primary/10 animate-halo-pulse"
        style={{ animationDuration: '3s', animationDelay: '0.5s' }}
      />
    </div>
  );
}

/**
 * Wings Shimmer - soft angelic shimmer effect
 */
function WingsShimmer({ className, size }: { className?: string; size: number }) {
  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-shimmer"
        style={{ 
          transform: 'skewX(-20deg)',
          animationDuration: '2s'
        }}
      />
    </div>
  );
}

/**
 * Guiding Spark - small floating light that moves gently
 */
function GuidingSpark({ className, size }: { className?: string; size: number }) {
  return (
    <div 
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute w-2 h-2 rounded-full bg-primary/60 animate-float-spark"
        style={{ 
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 8px hsl(var(--primary) / 0.5)'
        }}
      />
    </div>
  );
}

/**
 * Ripple Welcome - gentle circle waves on entry
 */
function RippleWelcome({ className, size }: { className?: string; size: number }) {
  return (
    <div 
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute rounded-full border border-primary/30 animate-ripple"
        style={{ width: size * 0.5, height: size * 0.5 }}
      />
      <div 
        className="absolute rounded-full border border-primary/20 animate-ripple"
        style={{ 
          width: size * 0.5, 
          height: size * 0.5,
          animationDelay: '0.3s'
        }}
      />
      <div 
        className="absolute rounded-full border border-primary/10 animate-ripple"
        style={{ 
          width: size * 0.5, 
          height: size * 0.5,
          animationDelay: '0.6s'
        }}
      />
    </div>
  );
}

/**
 * Color Shift Glow - subtle color transition glow
 */
function ColorShiftGlow({ className, size }: { className?: string; size: number }) {
  return (
    <div 
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute inset-0 rounded-full animate-color-shift-glow opacity-60"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}

// Export individual animations
export { HaloPulse, WingsShimmer, GuidingSpark, RippleWelcome, ColorShiftGlow };
