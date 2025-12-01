import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LOADING_MESSAGES } from '@/lib/constants/uiText';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  lang?: 'en' | 'vi';
  className?: string;
}

/**
 * Unified Loading Spinner
 * Single source of truth for all loading states across the app
 */
export function LoadingSpinner({
  size = 'md',
  message,
  lang = 'en',
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const displayMessage = message || LOADING_MESSAGES[lang].default;

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {displayMessage && (
        <p className="text-sm text-muted-foreground">{displayMessage}</p>
      )}
    </div>
  );
}
