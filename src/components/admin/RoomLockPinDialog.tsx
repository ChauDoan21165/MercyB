import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Unlock } from "lucide-react";

interface RoomLockPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomTitle: string;
  isCurrentlyLocked: boolean;
  onConfirm: (pin: string) => void;
}

export function RoomLockPinDialog({
  open,
  onOpenChange,
  roomTitle,
  isCurrentlyLocked,
  onConfirm
}: RoomLockPinDialogProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handlePinChange = (value: string) => {
    // Only allow digits and max 4 characters
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    setPin(cleaned);
    setError("");
  };

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    onConfirm(pin);
    setPin("");
    setError("");
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && pin.length === 4) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCurrentlyLocked ? (
              <>
                <Unlock className="h-5 w-5 text-green-600" />
                Unlock Room
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 text-yellow-600" />
                Lock Room
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCurrentlyLocked
              ? "Enter your 4-digit PIN to unlock and allow editing"
              : "Enter a 4-digit PIN to lock this room"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Room: {roomTitle}</p>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                4-Digit PIN
              </label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••"
                className="text-center text-2xl tracking-widest"
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPin("");
                setError("");
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={pin.length !== 4}
              className="flex-1"
            >
              {isCurrentlyLocked ? "Unlock" : "Lock"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
