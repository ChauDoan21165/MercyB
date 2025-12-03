import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MercyAvatar } from './MercyAvatar';
import { getCompanionEnabled, setCompanionEnabled } from '@/hooks/useCompanionSession';

interface MercyToggleProps {
  className?: string;
}

/**
 * MercyToggle - Small floating button to re-enable Mercy when hidden
 * Shows only when companion is disabled
 */
export function MercyToggle({ className }: MercyToggleProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsEnabled(getCompanionEnabled());
    
    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companion_enabled') {
        setIsEnabled(e.newValue !== 'false');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Don't show toggle if Mercy is already enabled
  if (isEnabled) return null;

  const handleClick = () => {
    setCompanionEnabled(true);
    setIsEnabled(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed z-30',
        'bottom-24 right-4 md:bottom-8 md:right-8',
        'flex items-center gap-2',
        'rounded-full',
        'bg-card/90 backdrop-blur-sm',
        'border border-border/50',
        'shadow-md hover:shadow-lg',
        'transition-all duration-200',
        'px-2 py-1.5',
        isHovered ? 'pr-3' : '',
        className
      )}
      aria-label="Show Mercy helper"
    >
      <MercyAvatar size={28} />
      <span
        className={cn(
          'text-xs font-medium text-muted-foreground',
          'transition-all duration-200 overflow-hidden whitespace-nowrap',
          isHovered ? 'max-w-20 opacity-100' : 'max-w-0 opacity-0'
        )}
      >
        Show Mercy
      </span>
    </button>
  );
}

export default MercyToggle;
