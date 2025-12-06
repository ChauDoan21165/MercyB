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
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

interface GiftCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetTier?: string;
  onSuccess?: (tier: string) => void;
}

export function GiftCodeModal({ 
  open, 
  onOpenChange, 
  targetTier,
  onSuccess 
}: GiftCodeModalProps) {
  const [code, setCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRedeem = async () => {
    if (!code.trim()) {
      setError("Please enter a gift code / Vui lòng nhập mã quà tặng");
      return;
    }

    setIsRedeeming(true);
    setError(null);

    try {
      console.log('[redeem-gift-code] Attempting to redeem:', code.trim());
      
      const { data, error: invokeError } = await supabase.functions.invoke('redeem-gift-code', {
        body: { code: code.trim() },
      });

      console.log('[redeem-gift-code] Response:', { data, invokeError });

      // Handle 401/auth errors - redirect to login
      if (invokeError) {
        console.error('[redeem-gift-code] Invoke error:', invokeError);
        
        // Check for auth-related errors
        const errorMessage = invokeError.message?.toLowerCase() || '';
        if (errorMessage.includes('unauthorized') || errorMessage.includes('401') || errorMessage.includes('auth')) {
          toast({
            title: "Session Expired",
            description: "Session expired, please log in again / Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
            variant: "destructive",
          });
          
          // Close modal and redirect to auth
          onOpenChange(false);
          const redirectPath = encodeURIComponent(location.pathname);
          navigate(`/auth?redirect=${redirectPath}`);
          return;
        }
        
        setError(invokeError.message || "Failed to redeem code");
        return;
      }

      if (data?.error) {
        console.error('[redeem-gift-code] API error:', data.error);
        
        // Check for auth errors in response data
        if (data.error.toLowerCase().includes('unauthorized') || data.error.toLowerCase().includes('session')) {
          toast({
            title: "Session Expired",
            description: "Session expired, please log in again / Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
            variant: "destructive",
          });
          
          onOpenChange(false);
          const redirectPath = encodeURIComponent(location.pathname);
          navigate(`/auth?redirect=${redirectPath}`);
          return;
        }
        
        setError(data.error);
        return;
      }

      if (data?.success) {
        const duration = data.duration || '1 year';
        toast({
          title: "🎁 Access Activated! / Đã Kích Hoạt!",
          description: `${data.tier} access granted for ${duration} / Quyền truy cập ${data.tier} đã được mở trong ${duration}`,
        });

        // Clear input and close modal
        setCode("");
        onOpenChange(false);

        // Refresh session to update access
        await supabase.auth.refreshSession();

        // Callback for navigation/refresh
        if (onSuccess) {
          onSuccess(data.tier);
        } else {
          // Default: reload to refresh all access states
          window.location.reload();
        }
      }
    } catch (err: any) {
      console.error('[redeem-gift-code] Unexpected error:', err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRedeeming) {
      handleRedeem();
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
              : "Enter your gift code to unlock VIP access"
            }
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
              placeholder="VIP3-XXXX-XXXX-XXXX"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              disabled={isRedeeming}
              className="font-mono text-center text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Format: VIP1-XXXX-XXXX-XXXX through VIP9-XXXX-XXXX-XXXX
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleRedeem}
              disabled={isRedeeming || !code.trim()}
              className="flex-1"
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Redeeming...
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
              <li>VIP access is granted based on code duration</li>
              <li>Each code can only be used once</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
