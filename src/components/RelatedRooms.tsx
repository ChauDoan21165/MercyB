import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getRoomInfo } from "@/lib/roomData";

interface RelatedRoomsProps {
  roomNames: string[];
}

export const RelatedRooms = ({ roomNames }: RelatedRoomsProps) => {
  const navigate = useNavigate();

  if (roomNames.length === 0) return null;

  // Extract room IDs from the format "Name (Vietnamese Name)"
  const getRoomIdFromName = (fullName: string) => {
    const englishName = fullName.split('(')[0].trim();
    // Convert to kebab case for room ID
    return englishName.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and');
  };

  return (
    <div className="mt-4 p-4 bg-secondary/20 rounded-lg border border-secondary/30 animate-fade-in">
      <div className="flex items-start gap-2 mb-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="font-medium text-sm mb-1">Others also explored:</p>
          <p className="text-xs text-muted-foreground mb-1">Những người khác cũng đã khám phá:</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {roomNames.map((roomName, index) => {
          const roomId = getRoomIdFromName(roomName);
          const info = getRoomInfo(roomId);
          
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="hover-scale"
              onClick={() => navigate(`/chat/${roomId}`)}
            >
              {info?.nameEn || roomName.split('(')[0].trim()}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};
