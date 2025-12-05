/**
 * Minimalist Mercy Avatar
 * 
 * Outline only, monochrome, quiet modern aesthetic
 */

interface MercyAvatarMinimalistProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function MercyAvatarMinimalist({ 
  size = 56, 
  className = '',
  animate = true 
}: MercyAvatarMinimalistProps) {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={animate ? 'animate-mercy-breathe' : ''}
      >
        {/* Outer circle - main outline */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="text-foreground/80"
        />
        
        {/* Inner face circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="28" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="text-foreground/60"
        />
        
        {/* Left eye - simple dot */}
        <circle 
          cx="40" 
          cy="48" 
          r="3" 
          fill="currentColor"
          className="text-foreground"
        />
        
        {/* Right eye - simple dot */}
        <circle 
          cx="60" 
          cy="48" 
          r="3" 
          fill="currentColor"
          className="text-foreground"
        />
        
        {/* Minimal smile - single arc */}
        <path
          d="M42 58 Q50 64 58 58"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/80"
        />
        
        {/* Subtle decorative lines - wings abstracted */}
        <path
          d="M18 45 Q12 40 18 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="text-foreground/40"
        />
        <path
          d="M82 45 Q88 40 82 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="text-foreground/40"
        />
        
        {/* Top arc - subtle halo hint */}
        <path
          d="M35 22 Q50 16 65 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="text-foreground/30"
        />
      </svg>
    </div>
  );
}
