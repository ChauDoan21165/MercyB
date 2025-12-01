import { Copy, FileJson, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AdminEntryToolsProps {
  entry: any;
  audioFilename?: string;
  className?: string;
}

/**
 * Admin Entry Tools - Per-entry copy tools
 * 
 * Allows admin to copy:
 * - Entry JSON
 * - Audio filename
 * 
 * Only visible when isAdmin is true
 */
export function AdminEntryTools({ entry, audioFilename, className }: AdminEntryToolsProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `Copied ${label}`,
      description: `${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`,
    });
  };

  const handleCopyEntryJson = () => {
    copyToClipboard(JSON.stringify(entry, null, 2), 'Entry JSON');
  };

  const handleCopyAudio = () => {
    if (audioFilename) {
      copyToClipboard(audioFilename, 'Audio filename');
    }
  };

  return (
    <div className={cn('flex gap-1', className)}>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopyEntryJson}
        className="h-7 px-2 gap-1 text-xs"
        title="Copy entry JSON"
      >
        <FileJson className="h-3 w-3" />
        <span>JSON</span>
      </Button>
      
      {audioFilename && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopyAudio}
          className="h-7 px-2 gap-1 text-xs"
          title="Copy audio filename"
        >
          <Music className="h-3 w-3" />
          <span>Audio</span>
        </Button>
      )}
    </div>
  );
}
