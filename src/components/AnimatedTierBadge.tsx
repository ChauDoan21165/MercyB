import { Crown, Sparkles, Zap, Star } from "lucide-react";
import { UserTier } from "@/hooks/useUserAccess";
import { cn } from "@/lib/utils";

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
  free: {
    label: "Free",
    labelVi: "Miễn phí",
    icon: Star,
    baseClasses: "bg-muted text-muted-foreground border-muted-foreground/20",
    glowColor: "transparent",
    animationClasses: "",
  },
  vip1: {
    label: "VIP1",
    labelVi: "VIP1",
    icon: Crown,
    baseClasses: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white border-yellow-300",
    glowColor: "rgba(234, 179, 8, 0.5)",
    animationClasses: "",
  },
  vip2: {
    label: "VIP2",
    labelVi: "VIP2",
    icon: Sparkles,
    baseClasses: "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white border-blue-300",
    glowColor: "rgba(59, 130, 246, 0.5)",
    animationClasses: "",
  },
  vip3: {
    label: "VIP3",
    labelVi: "VIP3",
    icon: Zap,
    baseClasses: "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white border-pink-300",
    glowColor: "rgba(168, 85, 247, 0.5)",
    animationClasses: "",
  },
  vip4: {
    label: "VIP4",
    labelVi: "VIP4",
    icon: Crown,
    baseClasses: "bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white border-orange-300",
    glowColor: "rgba(249, 115, 22, 0.5)",
    animationClasses: "",
  },
  vip5: {
    label: "VIP5",
    labelVi: "VIP5",
    icon: Crown,
    baseClasses: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white border-emerald-300",
    glowColor: "rgba(16, 185, 129, 0.5)",
    animationClasses: "",
  },
  vip6: {
    label: "VIP6",
    labelVi: "VIP6",
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
  const config = tierConfig[tier];
  const Icon = config.icon;
  const isVIP = tier !== "free";

  return (
    <div className={cn("relative inline-flex items-center gap-1.5 rounded-full border font-semibold transition-all duration-300",
      config.baseClasses,
      sizeClasses[size],
      config.animationClasses,
      className
    )}
    style={{
      boxShadow: isVIP ? `0 0 10px ${config.glowColor}, 0 0 20px ${config.glowColor}` : "none",
    }}
    >
      {/* Shine effect for VIP badges */}
      {isVIP && (
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
        <Icon className={cn(iconSizeClasses[size], isVIP && "animate-sparkle")} />
      )}
      
      {/* Label */}
      <span className="relative z-10">{config.label}</span>
      
      {/* Sparkle effects for high-tier VIPs */}
      {(tier === "vip3" || tier === "vip4" || tier === "vip5") && (
        <>
          <Sparkles className={cn(iconSizeClasses[size], "absolute -top-1 -right-1 animate-sparkle")} />
          <Sparkles className={cn(iconSizeClasses[size], "absolute -bottom-1 -left-1 animate-sparkle")} style={{ animationDelay: "0.75s" }} />
        </>
      )}
    </div>
  );
};
