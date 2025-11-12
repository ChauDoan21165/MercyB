import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check, Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserAccess, UserTier } from "@/hooks/useUserAccess";
import { AnimatedTierBadge } from "./AnimatedTierBadge";

const tierInfo: Record<UserTier, {
  name: { en: string; vi: string };
  benefits: { en: string[]; vi: string[] };
  color: string;
}> = {
  free: {
    name: { en: "Free", vi: "Miễn phí" },
    benefits: {
      en: ["10 random entries/day", "Achievement badges", "Learning streaks"],
      vi: ["10 mục ngẫu nhiên/ngày", "Huy hiệu thành tựu", "Chuỗi điểm thưởng"]
    },
    color: "bg-muted"
  },
  vip1: {
    name: { en: "VIP1", vi: "VIP1" },
    benefits: {
      en: ["Request 1 custom topic", "1 full room access/day", "🤖 AI Content"],
      vi: ["Yêu cầu 1 chủ đề tùy chỉnh", "Truy cập 1 phòng/ngày", "🤖 Nội dung AI"]
    },
    color: "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700"
  },
  vip2: {
    name: { en: "VIP2", vi: "VIP2" },
    benefits: {
      en: ["Request 2 custom topics", "2 full rooms access/day", "🤖 AI Content"],
      vi: ["Yêu cầu 2 chủ đề tùy chỉnh", "Truy cập 2 phòng/ngày", "🤖 Nội dung AI"]
    },
    color: "bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800"
  },
  vip3: {
    name: { en: "VIP3", vi: "VIP3" },
    benefits: {
      en: ["Request 3 custom topics", "3 rooms access/day", "AI Matchmaking", "Voice chat", "🤖 AI Content"],
      vi: ["Yêu cầu 3 chủ đề tùy chỉnh", "Truy cập 3 phòng/ngày", "Ghép đôi AI", "Chat giọng nói", "🤖 Nội dung AI"]
    },
    color: "bg-gradient-to-br from-yellow-500 via-yellow-700 to-yellow-900"
  },
  vip4: {
    name: { en: "VIP4 CareerZ", vi: "VIP4 Nghề Nghiệp" },
    benefits: {
      en: ["All VIP3 benefits", "Career consultance", "Premium support"],
      vi: ["Tất cả quyền lợi VIP3", "Tư vấn nghề nghiệp", "Hỗ trợ cao cấp"]
    },
    color: "bg-gradient-to-br from-orange-400 via-orange-600 to-orange-800"
  }
};

const upgradePaths: Record<UserTier, UserTier[]> = {
  free: ["vip1", "vip2", "vip3"],
  vip1: ["vip2", "vip3"],
  vip2: ["vip3"],
  vip3: [],
  vip4: []
};

export const VIPBenefitsDisplay = () => {
  const navigate = useNavigate();
  const { tier, isAdmin } = useUserAccess();
  
  const currentTier = tierInfo[tier];
  const availableUpgrades = upgradePaths[tier];

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Current Tier */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">
            Your Plan / Gói Của Bạn
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          <AnimatedTierBadge tier={tier} size="lg" />
          {isAdmin && (
            <Badge variant="outline" className="border-primary">
              Admin
            </Badge>
          )}
        </div>

        {/* Benefits */}
        <div className="space-y-2 pl-2">
          <p className="text-sm font-medium text-muted-foreground">
            Benefits / Quyền lợi:
          </p>
          {currentTier.benefits.en.map((benefit, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
              <div className="pl-6 text-xs text-muted-foreground">
                {currentTier.benefits.vi[idx]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Options */}
      {availableUpgrades.length > 0 && (
        <>
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Upgrade Options / Nâng Cấp:
            </p>
            <div className="space-y-2">
              {availableUpgrades.map((upgradeTier) => {
                const upgradeInfo = tierInfo[upgradeTier];
                return (
                  <Button
                    key={upgradeTier}
                    variant="outline"
                    className="w-full justify-between group hover:border-primary"
                    onClick={() => navigate(`/subscribe?tier=${upgradeTier}`)}
                  >
                    <span className="flex items-center gap-2">
                      <Badge className={`${upgradeInfo.color} text-white`}>
                        {upgradeInfo.name.en}
                      </Badge>
                      <span className="text-sm">{upgradeInfo.name.vi}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                );
              })}
            </div>
          </div>
        </>
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
