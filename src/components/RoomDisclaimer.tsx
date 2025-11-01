import { getRoomInfo } from "@/lib/roomData";
import { roomDataMap } from "@/lib/roomDataImports";
import { AlertCircle } from "lucide-react";

interface RoomDisclaimerProps {
  roomId: string;
}

export const RoomDisclaimer = ({ roomId }: RoomDisclaimerProps) => {
  const roomData = roomDataMap[roomId];
  if (!roomData) return null;

  const safetyEn = (roomData as any).safety_disclaimer;
  const safetyVi = (roomData as any).safety_disclaimer_vi;
  const crisisEn = (roomData as any).crisis_footer?.en;
  const crisisVi = (roomData as any).crisis_footer?.vi;

  if (!safetyEn && !safetyVi && !crisisEn && !crisisVi) return null;

  return (
    <div className="p-3 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-1.5 text-xs leading-relaxed text-yellow-900 dark:text-yellow-100">
          {safetyEn && <p className="font-medium">{safetyEn}</p>}
          {safetyVi && <p className="font-medium">{safetyVi}</p>}
          {crisisEn && <p className="font-semibold text-red-600 dark:text-red-400">{crisisEn}</p>}
          {crisisVi && <p className="font-semibold text-red-600 dark:text-red-400">{crisisVi}</p>}
        </div>
      </div>
    </div>
  );
};
