import { useEffect, useState } from "react";
import { getRoom } from "@/lib/roomFetcher";
import { AlertCircle } from "lucide-react";
import { HighlightedContent } from "./HighlightedContent";

interface RoomDisclaimerProps {
  roomId: string;
}

interface DisclaimerData {
  safetyEn?: string;
  safetyVi?: string;
  crisisEn?: string;
  crisisVi?: string;
}

export const RoomDisclaimer = ({ roomId }: RoomDisclaimerProps) => {
  const [data, setData] = useState<DisclaimerData | null>(null);

  useEffect(() => {
    if (!roomId) return;
    
    getRoom(roomId).then((room) => {
      if (!room) {
        setData(null);
        return;
      }
      
      // Extract disclaimer data from room
      const rawRoom = room as any;
      setData({
        safetyEn: rawRoom.safety_disclaimer || rawRoom.content?.safety_en,
        safetyVi: rawRoom.safety_disclaimer_vi || rawRoom.content?.safety_vi,
        crisisEn: rawRoom.crisis_footer?.en,
        crisisVi: rawRoom.crisis_footer?.vi,
      });
    }).catch(() => setData(null));
  }, [roomId]);

  if (!data) return null;
  
  const { safetyEn, safetyVi, crisisEn, crisisVi } = data;
  if (!safetyEn && !safetyVi && !crisisEn && !crisisVi) return null;

  return (
    <div className="p-3 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-1.5 text-xs leading-relaxed text-yellow-900 dark:text-yellow-100">
          {safetyEn && (
            <div className="font-medium">
              <HighlightedContent content={safetyEn} />
            </div>
          )}
          {safetyVi && (
            <div className="font-medium">
              <HighlightedContent content={safetyVi} />
            </div>
          )}
          {crisisEn && (
            <div className="font-semibold text-red-600 dark:text-red-400">
              <HighlightedContent content={crisisEn} />
            </div>
          )}
          {crisisVi && (
            <div className="font-semibold text-red-600 dark:text-red-400">
              <HighlightedContent content={crisisVi} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
