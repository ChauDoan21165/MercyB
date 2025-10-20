import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getRoomInfo } from "@/lib/roomData";

interface WelcomeBackProps {
  lastRoomId: string | null;
  currentRoomId: string;
}

export const WelcomeBack = ({ lastRoomId, currentRoomId }: WelcomeBackProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (!lastRoomId || lastRoomId === currentRoomId || dismissed) return null;

  const lastRoom = getRoomInfo(lastRoomId);
  if (!lastRoom) return null;

  return (
    <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20 animate-fade-in relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0"
        onClick={() => setDismissed(true)}
      >
        <X className="w-4 h-4" />
      </Button>
      
      <div className="flex items-start gap-2 pr-8">
        <span className="text-2xl">👋</span>
        <div>
          <p className="font-medium text-sm">
            Welcome back! Last time you were in <span className="text-primary">{lastRoom.nameEn}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Chào mừng trở lại! Lần trước bạn đã ở <span className="text-primary">{lastRoom.nameVi}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
