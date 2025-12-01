/**
 * LockedBadge Component - Mercy Blade Edition
 * 
 * Subtle lock indicator that respects Mercy Blade's minimalist aesthetic
 * Works in both color and black & white modes
 */

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LockedBadgeProps {
  isColor?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Minimal lock badge with Mercy Blade styling
 * Uses muted colors that blend with the theme
 */
export function LockedBadge({ 
  isColor = true, 
  size = "sm",
  className 
}: LockedBadgeProps) {
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  
  return (
    <div 
      className={cn(
        "rounded-full p-1",
        isColor 
          ? "bg-gray-400/80" 
          : "bg-gray-500",
        className
      )}
      aria-label="Locked - requires higher tier"
    >
      <Lock className={cn(iconSize, "text-white")} aria-hidden="true" />
    </div>
  );
}
