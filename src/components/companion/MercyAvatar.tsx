import { cn } from '@/lib/utils';

interface MercyAvatarProps {
  size?: number;
  isTalking?: boolean;
  className?: string;
}

/**
 * MercyAvatar - A soft, gender-neutral, friendly avatar for Mercy companion
 * Uses inline SVG with Mercy Blade color palette
 * Now bigger and clearer as a visible host/teacher
 */
export function MercyAvatar({ size = 56, isTalking = false, className }: MercyAvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0',
        'transition-transform duration-500 ease-out',
        'shadow-lg ring-2 ring-white/30',
        isTalking && 'animate-mercy-breathe',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="rounded-full"
        aria-label="Mercy avatar"
      >
        {/* Background gradient - soft lavender to peach with more vibrancy */}
        <defs>
          <linearGradient id="mercy-bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(280, 60%, 80%)" />
            <stop offset="50%" stopColor="hsl(260, 55%, 85%)" />
            <stop offset="100%" stopColor="hsl(30, 70%, 88%)" />
          </linearGradient>
          <linearGradient id="mercy-face-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(35, 55%, 93%)" />
            <stop offset="100%" stopColor="hsl(28, 50%, 89%)" />
          </linearGradient>
          <filter id="mercy-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer circle with gradient */}
        <circle cx="50" cy="50" r="49" fill="url(#mercy-bg-gradient)" />
        
        {/* Subtle outer ring for depth */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="hsl(270, 40%, 75%)" strokeWidth="1" opacity="0.5" />
        
        {/* Face circle - warm skin tone */}
        <circle cx="50" cy="50" r="40" fill="url(#mercy-face-gradient)" filter="url(#mercy-glow)" />
        
        {/* Left eye - relaxed, kind, slightly larger */}
        <ellipse cx="36" cy="44" rx="6" ry="7" fill="hsl(240, 25%, 22%)" />
        <circle cx="34" cy="42" r="2" fill="white" opacity="0.85" />
        
        {/* Right eye - relaxed, kind */}
        <ellipse cx="64" cy="44" rx="6" ry="7" fill="hsl(240, 25%, 22%)" />
        <circle cx="62" cy="42" r="2" fill="white" opacity="0.85" />
        
        {/* Soft eyebrows - more expressive */}
        <path
          d="M26 36 Q36 31, 44 36"
          stroke="hsl(25, 35%, 45%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M56 36 Q64 31, 74 36"
          stroke="hsl(25, 35%, 45%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Gentle smile - wider and warmer */}
        <path
          d="M35 64 Q50 76, 65 64"
          stroke="hsl(350, 45%, 50%)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Soft blush marks - more visible */}
        <ellipse cx="26" cy="56" rx="8" ry="4" fill="hsl(350, 65%, 78%)" opacity="0.6" />
        <ellipse cx="74" cy="56" rx="8" ry="4" fill="hsl(350, 65%, 78%)" opacity="0.6" />
        
        {/* Subtle nose hint */}
        <path
          d="M50 48 L50 56"
          stroke="hsl(25, 30%, 75%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

export default MercyAvatar;
