import { useState } from 'react';
import { RefreshCw, Info, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVersionCheck } from '@/hooks/useVersionCheck';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export function VersionBadge() {
  const { currentVersion, checking, checkForUpdates, updateAvailable, applyUpdate } = useVersionCheck();
  const [open, setOpen] = useState(false);

  // Fallback version if not loaded yet
  const displayVersion = currentVersion?.semver || '0.9.16';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'fixed bottom-2 left-2 z-40',
            'px-2 py-1 rounded-md text-[10px] font-mono',
            'bg-muted/80 text-muted-foreground',
            'hover:bg-muted hover:text-foreground',
            'backdrop-blur-sm border border-border/50',
            'transition-all duration-200',
            'cursor-pointer select-none',
            updateAvailable && 'bg-primary/20 text-primary border-primary/40 animate-pulse'
          )}
          style={{
            // Keep above music player safe area
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
          }}
          aria-label="Version info"
        >
          v{displayVersion}
          {updateAvailable && <span className="ml-1">•</span>}
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        side="top" 
        align="start" 
        className="w-64 p-3"
        sideOffset={8}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Mercy Blade</span>
          </div>
          
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-mono">{displayVersion}</span>
            </div>
            {currentVersion?.version && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build:</span>
                <span className="font-mono">{currentVersion.version}</span>
              </div>
            )}
            {currentVersion?.hash && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commit:</span>
                <span className="font-mono">{currentVersion.hash}</span>
              </div>
            )}
          </div>

          {updateAvailable ? (
            <Button 
              size="sm" 
              className="w-full text-xs h-8"
              onClick={() => {
                setOpen(false);
                applyUpdate();
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1.5" />
              Update Available — Reload
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              className="w-full text-xs h-8"
              onClick={checkForUpdates}
              disabled={checking}
            >
              {checking ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Check className="h-3 w-3 mr-1.5" />
                  Check for Updates
                </>
              )}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
