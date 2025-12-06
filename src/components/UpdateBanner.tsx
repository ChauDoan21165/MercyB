import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UpdateBannerProps {
  visible: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export function UpdateBanner({ visible, onUpdate, onDismiss }: UpdateBannerProps) {
  if (!visible) return null;

  return (
    <div 
      className={cn(
        'fixed top-0 left-0 right-0 z-[100]',
        'bg-gradient-to-r from-primary/95 to-primary/90 backdrop-blur-sm',
        'text-primary-foreground shadow-lg',
        'animate-in slide-in-from-top duration-300'
      )}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
          <p className="text-sm font-medium truncate">
            <span className="hidden sm:inline">A new version of Mercy Blade is available. </span>
            <span className="sm:hidden">Update available. </span>
            <span className="opacity-80">Tap to reload.</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={onUpdate}
            className="text-xs px-3 h-8"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Update Now
          </Button>
          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
