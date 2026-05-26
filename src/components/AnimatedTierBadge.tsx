import { Crown, Sparkles, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type UserTier = "demo" | "level0" | "level1" | "level2" | "level3" | "vip3_ii" | "level4" | "level5" | "level6";

interface AnimatedTierBadgeProps {
  tier: UserTier;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const tierConfig: Record<UserTier, {
  label: string;
  labelVi: string;
  icon: typeof Crown;
  baseClasses: string;
  glowColor: string;
  animationClasses: string;
}> = {
  demo: {
    label: "Demo",
    labelVi: "Dùng thử",
    icon: Star,
    baseClasses: "bg-muted text-muted-foreground border-muted-foreground/20",
    glowColor: "transparent",
    animationClasses: "",
  },
  level0: {
    label: "Level 0",
    labelVi: "Miễn phí",
    icon: Star,
    baseClasses: "bg-muted text-muted-foreground border-muted-foreground/20",
    glowColor: "transparent",
    animationClasses: "",
  },
  level1: {
    label: "Level 1",
    labelVi: "Level 1",
    icon: Crown,
    baseClasses: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white border-yellow-300",
    glowColor: "rgba(234, 179, 8, 0.5)",
    animationClasses: "",
  },
  level2: {
    label: "Level 2",
    labelVi: "Level 2",
    icon: Sparkles,
    baseClasses: "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white border-blue-300",
    glowColor: "rgba(59, 130, 246, 0.5)",
    animationClasses: "",
  },
  level3: {
    label: "Level 3",
    labelVi: "Level 3",
    icon: Zap,
    baseClasses: "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white border-pink-300",
    glowColor: "rgba(168, 85, 247, 0.5)",
    animationClasses: "",
  },
  vip3_ii: {
    label: "Level 3 II",
    labelVi: "Level 3 II",
    icon: Zap,
    baseClasses: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white border-pink-400",
    glowColor: "rgba(168, 85, 247, 0.6)",
    animationClasses: "",
  },
  level4: {
    label: "Level 4",
    labelVi: "Level 4",
    icon: Crown,
    baseClasses: "bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white border-orange-300",
    glowColor: "rgba(249, 115, 22, 0.5)",
    animationClasses: "",
  },
  level5: {
    label: "Level 5",
    labelVi: "Level 5",
    icon: Crown,
    baseClasses: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white border-emerald-300",
    glowColor: "rgba(16, 185, 129, 0.5)",
    animationClasses: "",
  },
  level6: {
    label: "Level 6",
    labelVi: "Level 6",
    icon: Crown,
    baseClasses: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-indigo-300",
    glowColor: "rgba(99, 102, 241, 0.6)",
    animationClasses: "",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

const iconSizeClasses = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const AnimatedTierBadge = ({ 
  tier, 
  size = "md", 
  showIcon = true,
  className 
}: AnimatedTierBadgeProps) => {
  const config = tierConfig[tier] || tierConfig.level0;
  const Icon = config.icon;
  const isPremium = tier !== "level0" && tier !== "demo";

  return (
    <div className={cn("relative inline-flex items-center gap-1.5 rounded-full border font-semibold transition-all duration-300",
      config.baseClasses,
      sizeClasses[size],
      config.animationClasses,
      className
    )}
    style={{
      boxShadow: isPremium ? `0 0 10px ${config.glowColor}, 0 0 20px ${config.glowColor}` : "none",
    }}
    >
      {/* Shine effect for Premium badges */}
      {isPremium && (
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            backgroundSize: "200% 100%",
            animation: "shine 3s linear infinite",
          }}
        />
      )}

      {/* Icon */}
      {showIcon && (
        <Icon className={cn(iconSizeClasses[size], isPremium && "animate-sparkle")} />
      )}

      {/* Label */}
      <span className="relative z-10">{config.label}</span>

      {/* Sparkle effects for high-tier Premium users */}
      {(tier === "level3" || tier === "vip3_ii" || tier === "level4" || tier === "level5" || tier === "level6") && (
        <>
          <Sparkles className={cn(iconSizeClasses[size], "absolute -top-1 -right-1 animate-sparkle")} />
          <Sparkles className={cn(iconSizeClasses[size], "absolute -bottom-1 -left-1 animate-sparkle")} style={{ animationDelay: "0.75s" }} />
        </>
      )}
    </div>
  );
};