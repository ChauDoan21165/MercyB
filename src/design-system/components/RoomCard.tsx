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

interface RoomCardProps {
  title: string;
  subtitle?: string;
  tier?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
  children?: React.ReactNode;
}

export function RoomCard({
  title,
  subtitle,
  tier,
  onClick,
  className,
  variant = 'default',
  children,
}: RoomCardProps) {
  const tierColor = tier ? getVipTierColor(tier) : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden bg-card text-card-foreground",
        "border border-border transition-all duration-150",
        radiusClasses.lg,
        shadowClasses.sm,
        onClick && "cursor-pointer hover:shadow-md",
        variant === 'default' && spaceClasses.p.base,
        variant === 'compact' && spaceClasses.p.md,
        variant === 'featured' && spaceClasses.p.lg,
        className
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Tier color accent */}
      {tierColor && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: tierColor.primary }}
        />
      )}

      {/* Content */}
      <div className={cn("flex flex-col", spaceClasses.gap.sm)}>
        <h3 className="text-lg font-semibold leading-snug">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
        {children}
      </div>

      {/* Hover effect */}
      {onClick && (
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.div>
  );
}
