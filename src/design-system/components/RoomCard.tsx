/**
 * Standardized RoomCard Component
 * Used across all VIP tiers and Kids chat
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { colors, getVipTierColor } from "../colors";
import { radiusClasses, componentRadius } from "../radius";
import { shadowClasses, componentShadows } from "../shadows";
import { spaceClasses, componentSpacing } from "../spacing";
import { getLockedRoomClassNames } from "@/components/room/LockedRoomStyles";
import { LockedBadge } from "@/components/room/LockedBadge";

interface RoomCardProps {
  title: string;
  subtitle?: string;
  tier?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
  children?: React.ReactNode;
  isLocked?: boolean;
  isColor?: boolean;
}

export function RoomCard({
  title,
  subtitle,
  tier,
  onClick,
  className,
  variant = 'default',
  children,
  isLocked = false,
  isColor = true,
}: RoomCardProps) {
  const tierColor = tier ? getVipTierColor(tier) : null;
  const lockedStyles = getLockedRoomClassNames(isColor);

  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1.0 : 1.02 }}
      whileTap={{ scale: isLocked ? 1.0 : 0.98 }}
      onClick={isLocked ? undefined : onClick}
      className={cn(
        "group relative overflow-hidden bg-card text-card-foreground",
        "transition-all duration-150",
        isLocked ? lockedStyles.container : "border border-border",
        radiusClasses.lg,
        shadowClasses.sm,
        onClick && !isLocked && "cursor-pointer hover:shadow-md",
        isLocked && "cursor-not-allowed",
        variant === 'default' && spaceClasses.p.base,
        variant === 'compact' && spaceClasses.p.md,
        variant === 'featured' && spaceClasses.p.lg,
        className
      )}
      role={onClick && !isLocked ? "button" : undefined}
      tabIndex={onClick && !isLocked ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && !isLocked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      data-locked={isLocked ? "true" : undefined}
    >
      {/* Locked Badge */}
      {isLocked && (
        <div className="absolute top-2 right-2 z-10">
          <LockedBadge isColor={isColor} size="md" showText />
        </div>
      )}

      {/* Tier color accent */}
      {tierColor && !isLocked && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: tierColor.primary }}
        />
      )}

      {/* Content */}
      <div className={cn("flex flex-col", spaceClasses.gap.sm)}>
        <h3 className={cn(
          "text-lg font-semibold leading-snug",
          isLocked && lockedStyles.title
        )}>
          {title}
        </h3>
        {subtitle && (
          <p className={cn(
            "text-sm",
            isLocked ? lockedStyles.subtitle : "text-muted-foreground"
          )}>
            {subtitle}
          </p>
        )}
        {children}
      </div>

      {/* Hover effect */}
      {onClick && !isLocked && (
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.div>
  );
}
