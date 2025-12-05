/**
 * Abstract Mercy Avatar
 * 
 * Waveforms, geometric light shapes, no human form but presence felt
 */

interface MercyAvatarAbstractProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function MercyAvatarAbstract({ 
  size = 56, 
  className = '',
  animate = true 
}: MercyAvatarAbstractProps) {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
      >
        <defs>
          {/* Gradient for waves */}
          <linearGradient id="abstract-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
          
          {/* Center glow */}
          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Background glow */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="url(#center-glow)"
          className={animate ? 'animate-pulse-slow' : ''}
        />
        
        {/* Outer wave ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="url(#abstract-gradient)" 
          strokeWidth="1"
          className={animate ? 'animate-wave-expand' : ''}
        />
        
        {/* Middle wave ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="35" 
          fill="none" 
          stroke="url(#abstract-gradient)" 
          strokeWidth="1.5"
          className={animate ? 'animate-wave-expand-delayed' : ''}
        />
        
        {/* Inner wave ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="25" 
          fill="none" 
          stroke="url(#abstract-gradient)" 
          strokeWidth="2"
          className={animate ? 'animate-wave-expand' : ''}
        />
        
        {/* Geometric shapes - triangular presence */}
        <polygon 
          points="50,30 35,55 65,55" 
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="1.5"
          opacity="0.7"
        />
        
        {/* Central point - the "eye" of presence */}
        <circle 
          cx="50" 
          cy="45" 
          r="4" 
          fill="hsl(var(--primary))"
          className={animate ? 'animate-mercy-breathe' : ''}
        />
        
        {/* Sound wave lines */}
        <path
          d="M25 50 Q30 45 35 50 Q40 55 45 50"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          opacity="0.5"
          className={animate ? 'animate-wave-flow' : ''}
        />
        <path
          d="M55 50 Q60 45 65 50 Q70 55 75 50"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          opacity="0.5"
          className={animate ? 'animate-wave-flow-reverse' : ''}
        />
        
        {/* Vertical presence line */}
        <line 
          x1="50" 
          y1="60" 
          x2="50" 
          y2="75" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2" 
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
