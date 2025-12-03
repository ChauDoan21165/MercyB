import { cn } from '@/lib/utils';

interface MercyAvatarProps {
  size?: number;
  isTalking?: boolean;
  className?: string;
}

/**
 * MercyAvatar - A soft, gender-neutral, friendly avatar for Mercy companion
 * Uses inline SVG with Mercy Blade color palette
 */
export function MercyAvatar({ size = 40, isTalking = false, className }: MercyAvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0',
        'transition-transform duration-300 ease-out',
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
        {/* Background gradient - soft lavender to peach */}
        <defs>
          <linearGradient id="mercy-bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(270, 50%, 85%)" />
            <stop offset="50%" stopColor="hsl(250, 45%, 88%)" />
            <stop offset="100%" stopColor="hsl(25, 60%, 90%)" />
          </linearGradient>
          <linearGradient id="mercy-face-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(30, 50%, 92%)" />
            <stop offset="100%" stopColor="hsl(25, 45%, 88%)" />
          </linearGradient>
        </defs>
        
        {/* Outer circle with gradient */}
        <circle cx="50" cy="50" r="48" fill="url(#mercy-bg-gradient)" />
        
        {/* Face circle - warm skin tone */}
        <circle cx="50" cy="50" r="38" fill="url(#mercy-face-gradient)" />
        
        {/* Left eye - relaxed, kind */}
        <ellipse cx="38" cy="45" rx="5" ry="6" fill="hsl(240, 20%, 25%)" />
        <circle cx="36" cy="43" r="1.5" fill="white" opacity="0.8" />
        
        {/* Right eye - relaxed, kind */}
        <ellipse cx="62" cy="45" rx="5" ry="6" fill="hsl(240, 20%, 25%)" />
        <circle cx="60" cy="43" r="1.5" fill="white" opacity="0.8" />
        
        {/* Soft eyebrows */}
        <path
          d="M30 38 Q38 34, 44 38"
          stroke="hsl(25, 30%, 50%)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M56 38 Q62 34, 70 38"
          stroke="hsl(25, 30%, 50%)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Gentle smile */}
        <path
          d="M38 62 Q50 72, 62 62"
          stroke="hsl(350, 40%, 55%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Soft blush marks */}
        <ellipse cx="30" cy="55" rx="6" ry="3" fill="hsl(350, 60%, 80%)" opacity="0.5" />
        <ellipse cx="70" cy="55" rx="6" ry="3" fill="hsl(350, 60%, 80%)" opacity="0.5" />
      </svg>
    </div>
  );
}

export default MercyAvatar;
