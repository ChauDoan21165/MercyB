// src/components/VIPLockedAccess.tsx

import { useState } from "react";
import { Lock, Gift, Crown, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GiftCodeModal } from "@/components/GiftCodeModal";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface VIPLockedAccessProps {
  tier: string;
  tierLabel?: string;
  backgroundColor?: string;
  requireLogin?: boolean;
}

/**
 * Full-page locked access screen for VIP tiers.
 * Shows login prompt for unauthenticated users, or gift code option
 * and upgrade path for logged-in users.
 *
 * Uses useAuth() instead of a direct supabase.auth call so auth state
 * is always consistent with the single AuthProvider source of truth.
 */
export function VIPLockedAccess({
  tier,
  tierLabel,
  backgroundColor = "hsl(var(--background))",
  requireLogin = false,
}: VIPLockedAccessProps) {
  const [showGiftModal, setShowGiftModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Use the canonical auth hook — no duplicate supabase listener needed
  const { user, isLoading } = useAuth();

  const displayTier = tierLabel || tier.toUpperCase();
  const isLoggedIn  = !isLoading && !!user;
  const needsLogin  = requireLogin || !isLoggedIn;

  const handleSuccess = (_grantedTier: string) => {
    // Reload to refresh access state after gift code redemption
    window.location.reload();
  };

  const handleLogin = () => {
    const next = encodeURIComponent(
      `${location.pathname}${location.search}${location.hash}`,
    );
    navigate(`/signin?next=${next}`);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: backgroundColor }}
      >
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: backgroundColor }}
    >
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            {needsLogin ? (
              <LogIn className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            ) : (
              <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          <CardTitle className="text-xl">
            {needsLogin ? "Login Required" : `${displayTier} Access Required`}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {needsLogin
              ? "Cần đăng nhập để xem nội dung này"
              : `Cần quyền truy cập ${displayTier}`}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            {needsLogin
              ? "Please log in to access this content. If you have a gift code, you can enter it after logging in."
              : `You don't have access to ${displayTier} content yet. Enter a gift code or upgrade your plan to unlock.`}
          </p>
          <p className="text-center text-xs text-muted-foreground">
            {needsLogin
              ? "Vui lòng đăng nhập để xem nội dung này. Nếu bạn có mã quà tặng, bạn có thể nhập sau khi đăng nhập."
              : `Bạn chưa có quyền truy cập nội dung ${displayTier}. Nhập mã quà tặng hoặc nâng cấp gói để mở khóa.`}
          </p>

          <div className="space-y-3 pt-2">
            {needsLogin ? (
              <>
                <Button onClick={handleLogin} className="w-full" size="lg">
                  <LogIn className="h-4 w-4 mr-2" />
                  Log in / Đăng nhập
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/tiers")}
                  className="w-full"
                  size="lg"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  View Plans / Xem Các Gói
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setShowGiftModal(true)}
                  className="w-full"
                  size="lg"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Redeem Gift Code / Nhập Mã Quà Tặng
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/tiers")}
                  className="w-full"
                  size="lg"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Plan / Nâng Cấp Gói
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              onClick={() => navigate("/")}
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