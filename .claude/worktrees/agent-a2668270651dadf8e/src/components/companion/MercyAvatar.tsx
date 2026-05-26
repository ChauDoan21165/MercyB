import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MercyAvatarProps {
  size?: number;
  isTalking?: boolean;
  className?: string;
}

/**
 * MercyAvatar - uses the real Mercy Host portrait from /public
 * This makes localhost match the Pro app face instead of the inline SVG avatar.
 */
export function MercyAvatar({
  size = 56,
  isTalking = false,
  className,
}: MercyAvatarProps) {
  const primarySrc = '/mercy-host.jpg?v=4';
  const fallbackSrc = '/mercy-host.jpg?v=4';
  const [src, setSrc] = useState(primarySrc);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden',
        'transition-transform duration-500 ease-out',
        'shadow-lg ring-2 ring-white/30 bg-card',
        isTalking && 'animate-mercy-breathe',
        className
      )}
      style={{ width: size, height: size }}
      aria-label="Mercy avatar"
    >
      <img
        src={src}
        alt="Mercy Host"
        width={size}
        height={size}
        className="h-full w-full rounded-full object-cover object-center"
        draggable={false}
        loading="eager"
        decoding="async"
        onError={() => {
          if (src !== fallbackSrc) {
            setSrc(fallbackSrc);
          }
        }}
      />
    </div>
  );
}

export default MercyAvatar;