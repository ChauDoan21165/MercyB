import { useAdminCheck } from '@/hooks/useAdminCheck';
import { toast } from '@/hooks/use-toast';

interface RoomAdminToolsProps {
  roomData: any;
  roomId: string;
}

/**
 * Admin tools for room titles
 * Blue dot: Copy full room JSON
 * Red dot: Copy room ID
 */
export const RoomAdminTools = ({ roomData, roomId }: RoomAdminToolsProps) => {
  const { isAdmin } = useAdminCheck();

  if (!isAdmin) return null;

  const handleCopyRoomJson = async () => {
    try {
      const jsonStr = JSON.stringify(roomData, null, 2);
      await navigator.clipboard.writeText(jsonStr);
      toast({
        title: "Room JSON copied",
        description: "Full room data copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        variant: "destructive",
      });
    }
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast({
        title: "Room ID copied",
        description: roomId,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="inline-flex items-center gap-1 ml-2">
      {/* Blue dot: Copy room JSON */}
      <button
        onClick={handleCopyRoomJson}
        className="w-3 h-3 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer transition-colors"
        title="Copy room JSON"
        aria-label="Copy room JSON"
      />
      
      {/* Red dot: Copy room ID */}
      <button
        onClick={handleCopyRoomId}
        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors"
        title="Copy room ID"
        aria-label="Copy room ID"
      />
    </div>
  );
};
