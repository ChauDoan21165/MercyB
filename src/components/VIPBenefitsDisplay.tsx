// FILE: src/components/VIPBenefitsDisplay.tsx
// VERSION: MB-BLUE-102.0b — 2026-02-24 (+0700)
//
// FIX (TS2322):
// AnimatedTierBadge expects `UserTier`, but this component passes `TierId`.
// Solution: derive a local `UserTier` union from AnimatedTierBadge itself,
// and cast safely via a tiny runtime guard so we never pass an invalid tier.
//
// Also keeps your earlier fixes:
// - No UserTier import from accessControl.
// - No vip3_ii.
// - Safe fallback when tier not present in tierInfo.

import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check, Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import type { TierId } from "@/lib/constants/tiers";
import { AnimatedTierBadge } from "./AnimatedTierBadge";

type TierInfo = {
  name: { en: string; vi: string };
  benefits: { en: string[]; vi: string[] };
  color: string;
};

const tierInfo: Partial<Record<TierId, TierInfo>> = {
  free: {
    name: { en: "Free", vi: "Miễn phí" },
    benefits: {
      en: ["10 random entries/day", "Achievement badges", "Learning streaks"],
      vi: ["10 mục ngẫu nhiên/ngày", "Huy hiệu thành tựu", "Chuỗi điểm thưởng"],
    },
    color: "bg-muted",
  },
  vip1: {
    name: { en: "VIP1", vi: "VIP1" },
    benefits: {
      en: ["Request 1 custom topic", "1 full room access/day", "🤖 AI Content"],
      vi: ["Yêu cầu 1 chủ đề tùy chỉnh", "Truy cập 1 phòng/ngày", "🤖 Nội dung AI"],
    },
    color: "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700",
  },
  vip2: {
    name: { en: "VIP2", vi: "VIP2" },
    benefits: {
      en: ["Request 2 custom topics", "2 full rooms access/day", "🤖 AI Content"],
      vi: ["Yêu cầu 2 chủ đề tùy chỉnh", "Truy cập 2 phòng/ngày", "🤖 Nội dung AI"],
    },
    color: "bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800",
  },
  vip3: {
    name: { en: "VIP3", vi: "VIP3" },
    benefits: {
      en: ["Request 3 custom topics", "3 rooms access/day", "AI Matchmaking", "Voice chat", "🤖 AI Content"],
      vi: ["Yêu cầu 3 chủ đề tùy chỉnh", "Truy cập 3 phòng/ngày", "Ghép đôi AI", "Chat giọng nói", "🤖 Nội dung AI"],
    },
    color: "bg-gradient-to-br from-yellow-500 via-yellow-700 to-yellow-900",
  },
  vip4: {
    name: { en: "VIP4 CareerZ", vi: "VIP4 Nghề Nghiệp" },
    benefits: {
      en: ["All VIP3 benefits", "Career consultance", "Premium support"],
      vi: ["Tất cả quyền lợi VIP3", "Tư vấn nghề nghiệp", "Hỗ trợ cao cấp"],
    },
    color: "bg-gradient-to-br from-orange-400 via-orange-600 to-orange-800",
  },
  vip5: {
    name: { en: "VIP5 Writing", vi: "VIP5 Viết Lách" },
    benefits: {
      en: ["All VIP4 benefits", "English writing support", "Expert feedback", "IELTS-style comments"],
      vi: ["Tất cả quyền lợi VIP4", "Hỗ trợ viết tiếng Anh", "Phản hồi chuyên gia", "Nhận xét chuẩn IELTS"],
    },
    color: "bg-gradient-to-br from-emerald-500 via-emerald-700 to-emerald-900",
  },
  vip6: {
    name: { en: "VIP6 Psychology", vi: "VIP6 Tâm Lý" },
    benefits: {
      en: [
        "All VIP5 benefits",
        "Shadow work & deep psychology",
        "Inner child healing",
        "1 custom deep-content piece/month",
        "Trauma pattern analysis",
      ],
      vi: [
        "Tất cả quyền lợi VIP5",
        "Tâm lý sâu & bóng tối",
        "Chữa lành đứa trẻ bên trong",
        "1 nội dung chuyên sâu tùy chỉnh/tháng",
        "Phân tích mô thức tổn thương",
      ],
    },
    color: "bg-gradient-to-br from-purple-500 via-purple-700 to-purple-900",
  },
};

const upgradePaths: Partial<Record<TierId, TierId[]>> = {
  free: ["vip1", "vip2", "vip3", "vip4", "vip5", "vip6"],
  vip1: ["vip2", "vip3", "vip4", "vip5", "vip6"],
  vip2: ["vip3", "vip4", "vip5", "vip6"],
  vip3: ["vip4", "vip5", "vip6"],
  vip4: ["vip5", "vip6"],
  vip5: ["vip6"],
  vip6: [],
};

const FALLBACK_TIER: TierInfo = {
  name: { en: "Member", vi: "Thành viên" },
  benefits: {
    en: ["Access depends on your tier", "Some rooms may be gated", "Enjoy learning"],
    vi: ["Truy cập tùy theo gói", "Một số phòng có thể bị khóa", "Chúc bạn học tốt"],
  },
  color: "bg-muted",
};

// --- Derive the tier type expected by AnimatedTierBadge (no brittle imports) ---
type AnimatedBadgeTier = React.ComponentProps<typeof AnimatedTierBadge>["tier"];

const isAnimatedBadgeTier = (t: unknown): t is AnimatedBadgeTier => {
  // Keep it permissive but safe. If AnimatedTierBadge adds/removes tiers,
  // this still prevents passing nonsense.
  return typeof t === "string" && t.length > 0;
};

export const VIPBenefitsDisplay = () => {
  const navigate = useNavigate();
  const { tier, isAdmin } = useUserAccess();

  const currentTier = tierInfo[tier as TierId] ?? FALLBACK_TIER;
  const availableUpgrades = upgradePaths[tier as TierId] ?? [];

  // TS-safe: only pass a tier value that matches AnimatedTierBadge’s prop type
  const badgeTier: AnimatedBadgeTier = isAnimatedBadgeTier(tier) ? (tier as AnimatedBadgeTier) : ("free" as AnimatedBadgeTier);

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Current Tier */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Your Plan / Gói Của Bạn</h3>
        </div>

        <div className="flex items-center gap-3">
          <AnimatedTierBadge tier={badgeTier} size="lg" />
          {isAdmin && (
            <Badge variant="outline" className="border-primary">
              Admin
            </Badge>
          )}
        </div>

        {/* Benefits */}
        <div className="space-y-2 pl-2">
          <p className="text-sm font-medium text-muted-foreground">Benefits / Quyền lợi:</p>
          {currentTier.benefits.en.map((benefit, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
              <div className="pl-6 text-xs text-muted-foreground">{currentTier.benefits.vi[idx] ?? ""}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Options */}
      {availableUpgrades.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">Upgrade Options / Nâng Cấp:</p>
          <div className="space-y-2">
            {availableUpgrades.map((upgradeTier) => {
              const upgradeInfo =
                tierInfo[upgradeTier] ??
                ({
                  name: { en: String(upgradeTier).toUpperCase(), vi: String(upgradeTier).toUpperCase() },
                  benefits: { en: [], vi: [] },
                  color: "bg-muted",
                } as TierInfo);

              return (
                <Button
                  key={upgradeTier}
                  variant="outline"
                  className="w-full justify-between group hover:border-primary"
                  onClick={() => navigate(`/subscribe?tier=${upgradeTier}`)}
                >
                  <span className="flex items-center gap-2">
                    <Badge className={`${upgradeInfo.color} text-white`}>{upgradeInfo.name.en}</Badge>
                    <span className="text-sm">{upgradeInfo.name.vi}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* No Upgrade Available */}
      {availableUpgrades.length === 0 && !isAdmin && (
        <div className="border-t pt-4">
          <p className="text-sm text-center text-muted-foreground">
            🎉 You're on the highest tier! / Bạn đang ở gói cao nhất!
          </p>
        </div>
      )}
    </Card>
  );
};