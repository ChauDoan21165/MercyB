// src/components/GiftCodeModal.tsx

import { useState } from "react";
import { Gift, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

interface GiftCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetTier?: string;
  onSuccess?: (tier: string) => void;
}

function isAuthError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("unauthorized") ||
    lower.includes("401") ||
    lower.includes("auth") ||
    lower.includes("session")
  );
}

export function GiftCodeModal({
  open,
  onOpenChange,
  targetTier,
  onSuccess,
}: GiftCodeModalProps) {
  const [code, setCode]             = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const { toast }   = useToast();
  const navigate    = useNavigate();
  const location    = useLocation();

  function redirectToSignIn() {
    onOpenChange(false);
    const next = encodeURIComponent(
      `${location.pathname}${location.search}${location.hash}`,
    );
    navigate(`/signin?next=${next}`);
  }

  const handleRedeem = async () => {
    if (!code.trim()) {
      setError("Please enter a gift code / Vui lòng nhập mã quà tặng");
      return;
    }

    setIsRedeeming(true);
    setError(null);

    try {
      const { data: { session }, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !session) {
        toast({
          title: "Login Required / Cần đăng nhập",
          description:
            "Please log in to redeem your gift code / Vui lòng đăng nhập để sử dụng mã quà tặng",
          variant: "destructive",
        });
        redirectToSignIn();
        return;
      }

      const { data, error: invokeError } = await supabase.functions.invoke(
        "redeem-access-code",
        { body: { code: code.trim() } },
      );

      if (invokeError) {
        if (isAuthError(invokeError.message ?? "")) {
          toast({
            title: "Session Expired",
            description:
              "Session expired, please log in again / Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
            variant: "destructive",
          });
          redirectToSignIn();
          return;
        }
        setError(invokeError.message || "Failed to redeem code.");
        return;
      }

      if (data?.error) {
        if (isAuthError(String(data.error))) {
          toast({
            title: "Session Expired",
            description:
              "Session expired, please log in again / Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
            variant: "destructive",
          });
          redirectToSignIn();
          return;
        }
        setError(String(data.error));
        return;
      }

      if (data?.ok || data?.success) {
        toast({
          title: "🎁 Gift code applied!",
          description:
            data.message || `Welcome to your new tier: ${data.tier} 💛`,
        });

        setCode("");
        onOpenChange(false);

        await supabase.auth.refreshSession();

        if (onSuccess) {
          onSuccess(data.tier);
        } else {
          window.location.reload();
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isRedeeming) {
      void handleRedeem();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Enter Gift Code / Nhập Mã Quà Tặng
          </DialogTitle>
          <DialogDescription>
            {targetTier
              ? `Enter your gift code to unlock ${targetTier} access`
              : "Enter your gift code to unlock premium access"}
            <br />
            <span className="text-muted-foreground">
              Nhập mã quà tặng để mở khóa quyền truy cập
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="gift-code">Gift Code / Mã quà tặng</Label>
            <Input
              id="gift-code"
              placeholder="Level 3-XXXX-XXXX-XXXX"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              disabled={isRedeeming}
              className="font-mono text-center text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Format: Level 1-XXXX-XXXX-XXXX through Level 9-XXXX-XXXX-XXXX
            </p>
          </div>

          {error ? (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button
              onClick={() => void handleRedeem()}
              disabled={isRedeeming || !code.trim()}
              className="flex-1"
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Redeeming…
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4 mr-2" />
                  Redeem / Kích hoạt
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isRedeeming}
            >
              Cancel
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Enter your gift code above</li>
              <li>Click "Redeem" to activate</li>
              <li>Premium access is granted based on code duration</li>
              <li>Each code can only be used once</li>
            </ul>
            <p className="mt-2">
              Có mã 12 ký tự từ người thân tặng?{" "}
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/gift/redeem");
                }}
                className="text-primary underline"
              >
                Kích hoạt tại /gift/redeem
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}