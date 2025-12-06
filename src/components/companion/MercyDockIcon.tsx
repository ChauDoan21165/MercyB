import { cn } from '@/lib/utils';
import { MercyAvatar } from './MercyAvatar';

interface MercyDockIconProps {
  visible: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * MercyDockIcon - A small floating icon shown when Mercy bubble is closed
 * Clicking it brings back the full Mercy bubble
 */
export function MercyDockIcon({ visible, onClick, className }: MercyDockIconProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // Positioning: above music player and iOS safe area
        'fixed z-50',
        'right-4',
        'md:right-[max(1rem,calc(50vw-360px+1rem))]',
        // Appearance
        'group flex items-center gap-2 px-3 py-2 rounded-full',
        'bg-card/95 backdrop-blur-md shadow-lg border border-border/60',
        'hover:shadow-xl hover:scale-105 transition-all duration-200',
        'cursor-pointer',
        className
      )}
      style={{
        // 100px for music player + safe area for iOS browser bar
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 100px)',
      }}
      aria-label="Show Mercy"
    >
      <MercyAvatar size={36} />
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors hidden sm:inline">
        Mercy
      </span>
    </button>
  );
}

export default MercyDockIcon;
