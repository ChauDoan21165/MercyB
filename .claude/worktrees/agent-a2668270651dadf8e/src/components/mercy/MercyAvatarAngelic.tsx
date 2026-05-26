/**
 * Angelic Mercy Avatar
 * 
 * Soft wings, warm glow behind head, gentle eyes, serene expression
 */

interface MercyAvatarAngelicProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function MercyAvatarAngelic({ 
  size = 56, 
  className = '',
  animate = true 
}: MercyAvatarAngelicProps) {
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
        <defs>
          {/* Warm glow gradient */}
          <radialGradient id="angelic-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(45 100% 90%)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="hsl(45 100% 80%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(45 100% 70%)" stopOpacity="0" />
          </radialGradient>
          
          {/* Wing gradient */}
          <linearGradient id="wing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(45 50% 95%)" stopOpacity="0.7" />
          </linearGradient>
          
          {/* Face gradient */}
          <radialGradient id="angelic-face" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="hsl(30 40% 95%)" />
            <stop offset="100%" stopColor="hsl(30 30% 88%)" />
          </radialGradient>
        </defs>
        
        {/* Outer glow */}
        <circle cx="50" cy="50" r="48" fill="url(#angelic-glow)" />
        
        {/* Left wing */}
        <path
          d="M15 50 Q5 35 15 20 Q25 30 30 45 Q20 48 15 50"
          fill="url(#wing-gradient)"
          className={animate ? 'animate-wing-flutter-left' : ''}
          style={{ transformOrigin: '30px 45px' }}
        />
        
        {/* Right wing */}
        <path
          d="M85 50 Q95 35 85 20 Q75 30 70 45 Q80 48 85 50"
          fill="url(#wing-gradient)"
          className={animate ? 'animate-wing-flutter-right' : ''}
          style={{ transformOrigin: '70px 45px' }}
        />
        
        {/* Head/face circle */}
        <circle cx="50" cy="50" r="28" fill="url(#angelic-face)" />
        
        {/* Halo */}
        <ellipse 
          cx="50" 
          cy="22" 
          rx="18" 
          ry="4" 
          fill="none" 
          stroke="hsl(45 100% 75%)" 
          strokeWidth="2"
          className={animate ? 'animate-halo-pulse' : ''}
        />
        
        {/* Eyes - gentle, closed-ish */}
        <ellipse cx="40" cy="48" rx="4" ry="3" fill="hsl(30 30% 30%)" />
        <ellipse cx="60" cy="48" rx="4" ry="3" fill="hsl(30 30% 30%)" />
        
        {/* Eye highlights */}
        <circle cx="41" cy="47" r="1.5" fill="hsl(0 0% 100%)" />
        <circle cx="61" cy="47" r="1.5" fill="hsl(0 0% 100%)" />
        
        {/* Gentle smile */}
        <path
          d="M42 58 Q50 64 58 58"
          fill="none"
          stroke="hsl(350 40% 55%)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Rosy cheeks */}
        <circle cx="35" cy="55" r="4" fill="hsl(350 60% 85%)" opacity="0.6" />
        <circle cx="65" cy="55" r="4" fill="hsl(350 60% 85%)" opacity="0.6" />
      </svg>
    </div>
  );
}
