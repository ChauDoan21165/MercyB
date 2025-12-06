import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VersionBlockOverlayProps {
  visible: boolean;
  onReload: () => void;
  latestVersion?: string;
}

export function VersionBlockOverlay({ visible, onReload, latestVersion }: VersionBlockOverlayProps) {
  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="version-block-title"
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <RefreshCw className="h-10 w-10 text-primary animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h2 id="version-block-title" className="text-xl font-semibold text-foreground">
            A new version of Mercy Blade is available
          </h2>
          <p className="text-muted-foreground">
            Please tap Reload to continue.
          </p>
          {latestVersion && (
            <p className="text-xs text-muted-foreground/70">
              New version: {latestVersion}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-base text-foreground">
            Đã có phiên bản mới của Mercy Blade.
          </p>
          <p className="text-muted-foreground">
            Vui lòng bấm Tải lại để tiếp tục.
          </p>
        </div>

        <Button 
          size="lg" 
          onClick={onReload}
          className="w-full max-w-xs mx-auto text-lg py-6"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Reload / Tải lại
        </Button>
      </div>
    </div>
  );
}
