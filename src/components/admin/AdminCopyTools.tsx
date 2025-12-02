/**
 * Admin Copy Tools - Admin-only copy buttons for debugging
 * 
 * Blue dot: Copy room JSON
 * Red dot: Copy room ID
 * Red dot (audio): Copy audio filename
 * Orange dot: Copy essay EN
 * Green dot: Copy essay VI
 */

import { useAdminCheck } from '@/hooks/useAdminCheck';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CopyDotProps {
  value: string;
  label: string;
  color: 'blue' | 'red' | 'orange' | 'green' | 'purple';
  className?: string;
}

const colorClasses = {
  blue: 'bg-blue-500 hover:bg-blue-600',
  red: 'bg-red-500 hover:bg-red-600',
  orange: 'bg-orange-500 hover:bg-orange-600',
  green: 'bg-green-500 hover:bg-green-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
};

/**
 * Generic copy dot - only visible to admins
 */
export const AdminCopyDot = ({ value, label, color, className }: CopyDotProps) => {
  const { isAdmin } = useAdminCheck();

  if (!isAdmin || !value) return null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: `${label} copied`,
        description: value.length > 50 ? `${value.substring(0, 50)}...` : value,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex w-[10px] h-[10px] rounded-full ml-1 align-middle cursor-pointer flex-shrink-0 transition-colors",
        colorClasses[color],
        className
      )}
      title={`Copy ${label}: ${value.length > 30 ? value.substring(0, 30) + '...' : value}`}
      aria-label={`Copy ${label}`}
    />
  );
};

/**
 * Copy Room ID - Red dot
 */
export const CopyRoomIdDot = ({ roomId }: { roomId: string }) => (
  <AdminCopyDot value={roomId} label="Room ID" color="red" />
);

/**
 * Copy Room JSON path - Blue dot
 */
export const CopyRoomJsonDot = ({ roomId }: { roomId: string }) => (
  <AdminCopyDot 
    value={`public/data/${roomId}.json`} 
    label="JSON path" 
    color="blue" 
  />
);

/**
 * Copy Audio Filename - Red dot (smaller)
 */
export const CopyAudioDot = ({ filename }: { filename: string }) => (
  <AdminCopyDot value={filename} label="Audio" color="red" />
);

/**
 * Copy English Essay - Orange dot
 */
export const CopyEssayEnDot = ({ text }: { text: string }) => (
  <AdminCopyDot value={text} label="Essay EN" color="orange" />
);

/**
 * Copy Vietnamese Essay - Green dot
 */
export const CopyEssayViDot = ({ text }: { text: string }) => (
  <AdminCopyDot value={text} label="Essay VI" color="green" />
);

/**
 * Combined admin tools panel for room pages
 */
interface AdminRoomToolsProps {
  roomId: string;
  audioFilename?: string;
  essayEn?: string;
  essayVi?: string;
}

export const AdminRoomTools = ({ roomId, audioFilename, essayEn, essayVi }: AdminRoomToolsProps) => {
  const { isAdmin } = useAdminCheck();

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
      <CopyRoomIdDot roomId={roomId} />
      <CopyRoomJsonDot roomId={roomId} />
      {audioFilename && <CopyAudioDot filename={audioFilename} />}
      {essayEn && <CopyEssayEnDot text={essayEn} />}
      {essayVi && <CopyEssayViDot text={essayVi} />}
    </div>
  );
};

/**
 * Debug info panel - shows room/entry details for admins
 */
interface AdminDebugPanelProps {
  data: Record<string, any>;
  title?: string;
}

export const AdminDebugPanel = ({ data, title = 'Debug Info' }: AdminDebugPanelProps) => {
  const { isAdmin } = useAdminCheck();

  if (!isAdmin || import.meta.env.PROD) return null;

  return (
    <details className="mt-4 p-2 bg-muted/50 rounded text-xs font-mono">
      <summary className="cursor-pointer text-muted-foreground">{title}</summary>
      <pre className="mt-2 overflow-auto max-h-40 text-[10px]">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
};
