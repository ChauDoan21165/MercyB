import { getRoomInfo } from "@/lib/roomData";
import { roomDataMap } from "@/lib/roomDataImports";
import { AlertCircle } from "lucide-react";

interface RoomDisclaimerProps {
  roomId: string;
}

export const RoomDisclaimer = ({ roomId }: RoomDisclaimerProps) => {
  const roomData = roomDataMap[roomId];
  if (!roomData) return null;

  const safetyEn = roomData.safety_disclaimer;
  const safetyVi = roomData.safety_disclaimer_vi;
  const crisisEn = roomData.crisis_footer?.en;
  const crisisVi = roomData.crisis_footer?.vi;

  if (!safetyEn && !safetyVi && !crisisEn && !crisisVi) return null;

  return (
    <div className="mt-2 p-2 bg-muted/30 rounded border border-border/30">
      <div className="flex items-start gap-1.5">
        <AlertCircle className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="space-y-1 text-[10px] leading-tight text-muted-foreground">
          {safetyEn && <p>{safetyEn}</p>}
          {safetyVi && <p>{safetyVi}</p>}
          {crisisEn && <p className="font-medium">{crisisEn}</p>}
          {crisisVi && <p className="font-medium">{crisisVi}</p>}
        </div>
      </div>
    </div>
  );
};
