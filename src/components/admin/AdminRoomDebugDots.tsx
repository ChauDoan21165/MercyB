import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AdminRoomDebugDotsProps {
  roomId: string;
  roomData?: any;
  audioFilename?: string;
  className?: string;
}

/**
 * Admin Debug Dots - Blue/Red/Purple dots for copying room data
 * 
 * Blue dot: Copy room JSON
 * Red dot: Copy room ID
 * Purple dot: Copy audio filename
 * 
 * Only visible when isAdmin is true
 */
export function AdminRoomDebugDots({ 
  roomId, 
  roomData, 
  audioFilename,
  className 
}: AdminRoomDebugDotsProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `Copied ${label}`,
      description: `${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`,
    });
  };

  const handleCopyJson = () => {
    if (roomData) {
      copyToClipboard(JSON.stringify(roomData, null, 2), 'Room JSON');
    }
  };

  const handleCopyId = () => {
    copyToClipboard(roomId, 'Room ID');
  };

  const handleCopyAudio = () => {
    if (audioFilename) {
      copyToClipboard(audioFilename, 'Audio filename');
    }
  };

  return (
    <div className={cn('flex gap-1', className)}>
      {/* Blue Dot - Copy JSON */}
      {roomData && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopyJson}
          className="h-6 w-6 p-0 rounded-full bg-blue-500 hover:bg-blue-600"
          title="Copy room JSON"
        >
          <Copy className="h-3 w-3 text-white" />
        </Button>
      )}
      
      {/* Red Dot - Copy ID */}
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopyId}
        className="h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600"
        title="Copy room ID"
      >
        <Copy className="h-3 w-3 text-white" />
      </Button>
      
      {/* Purple Dot - Copy Audio */}
      {audioFilename && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopyAudio}
          className="h-6 w-6 p-0 rounded-full bg-purple-500 hover:bg-purple-600"
          title="Copy audio filename"
        >
          <Copy className="h-3 w-3 text-white" />
        </Button>
      )}
    </div>
  );
}
