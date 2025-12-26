/**
 * LockedBanner
 * File: src/components/room/LockedBanner.tsx
 * Version: MB-BLUE-93.6 — 2025-12-23 (+0700)
 *
 * PURPOSE:
 * - Shown when user opens a VIP / locked room
 * - Explains that content is restricted
 * - Guides user to login or upgrade
 *
 * DESIGN PRINCIPLE:
 * - Calm, explanatory, non-punitive
 * - No dark patterns
 */

import { Link } from "react-router-dom";
import { Lock, LogIn, Crown, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TierId } from "@/lib/constants/tiers";

interface LockedBannerProps {
  roomTier?: TierId | null;
  isLoggedIn?: boolean;
}

export function LockedBanner({
  roomTier,
  isLoggedIn = false,
}: LockedBannerProps) {
  const tierLabel = roomTier?.toUpperCase() || "VIP";

  return (
    <Card className="border-2 border-amber-500/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-foreground">
              🔒 This is a {tierLabel} Room Preview
            </h3>

            <p className="text-sm text-muted-foreground">
              You're seeing a preview of this room. To unlock all entries, audio,
              and full features:
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {!isLoggedIn ? (
                <>
                  <Button asChild size="sm">
                    <Link to="/auth">
                      <LogIn className="h-4 w-4 mr-2" />
                      Log in
                    </Link>
                  </Button>

                  <Button asChild size="sm" variant="outline">
                    <Link to="/tiers">
                      <Crown className="h-4 w-4 mr-2" />
                      View plans
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="sm">
                    <Link to="/tiers">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to {tierLabel}
                    </Link>
                  </Button>

                  <Button asChild size="sm" variant="secondary">
                    <Link to="/redeem">
                      <Gift className="h-4 w-4 mr-2" />
                      Redeem gift code
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Vietnamese note */}
        <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
          <p className="text-xs text-muted-foreground">
            🇻🇳 Bạn đang xem bản xem trước của phòng này. Để mở khóa toàn bộ nội
            dung, vui lòng đăng nhập, nâng cấp gói, hoặc nhập mã quà tặng.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
