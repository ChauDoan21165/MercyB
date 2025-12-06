import { useState } from "react";
import { Lock, Gift, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GiftCodeModal } from "@/components/GiftCodeModal";
import { useNavigate } from "react-router-dom";

interface VIPLockedAccessProps {
  tier: string;
  tierLabel?: string;
  backgroundColor?: string;
}

/**
 * Full-page locked access screen for VIP tiers.
 * Shows gift code option and upgrade path.
 */
export function VIPLockedAccess({ 
  tier, 
  tierLabel,
  backgroundColor = "hsl(var(--background))"
}: VIPLockedAccessProps) {
  const [showGiftModal, setShowGiftModal] = useState(false);
  const navigate = useNavigate();
  const displayTier = tierLabel || tier.toUpperCase();

  const handleSuccess = (grantedTier: string) => {
    // Reload to refresh access state
    window.location.reload();
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: backgroundColor }}
    >
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-xl">
            {displayTier} Access Required
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Cần quyền truy cập {displayTier}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            You don't have access to {displayTier} content yet. 
            Enter a gift code or upgrade your plan to unlock.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Bạn chưa có quyền truy cập nội dung {displayTier}. 
            Nhập mã quà tặng hoặc nâng cấp gói để mở khóa.
          </p>

          <div className="space-y-3 pt-2">
            <Button 
              onClick={() => setShowGiftModal(true)}
              className="w-full"
              size="lg"
            >
              <Gift className="h-4 w-4 mr-2" />
              Enter Gift Code / Nhập Mã Quà Tặng
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/tiers')}
              className="w-full"
              size="lg"
            >
              <Crown className="h-4 w-4 mr-2" />
              View Plans / Xem Các Gói
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full"
              size="sm"
            >
              Back to Home / Về Trang Chủ
            </Button>
          </div>
        </CardContent>
      </Card>

      <GiftCodeModal
        open={showGiftModal}
        onOpenChange={setShowGiftModal}
        targetTier={displayTier}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
