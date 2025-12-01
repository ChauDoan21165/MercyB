/**
 * LockedBadge Component
 * 
 * Displays a clear lock indicator on locked room cards
 * Works in both color and black & white modes
 */

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LockedBadgeProps {
  isColor?: boolean;
  size?: "sm" | "md";
  showText?: boolean;
  className?: string;
}

export function LockedBadge({ 
  isColor = true, 
  size = "sm",
  showText = false,
  className 
}: LockedBadgeProps) {
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const textSize = size === "sm" ? "text-[8px]" : "text-xs";
  
  return (
    <div 
      className={cn(
        "flex items-center gap-1 rounded-full px-2 py-1",
        isColor 
          ? "bg-yellow-500 text-white" 
          : "bg-gray-600 text-white",
        className
      )}
      aria-label="Locked - requires higher tier"
    >
      <Lock className={iconSize} aria-hidden="true" />
      {showText && (
        <span className={cn("font-semibold", textSize)}>
          Locked
        </span>
      )}
    </div>
  );
}

/**
 * Bilingual Locked Badge (English/Vietnamese)
 */
export function BilingualLockedBadge({ 
  isColor = true, 
  size = "sm",
  className 
}: LockedBadgeProps) {
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const textSize = size === "sm" ? "text-[8px]" : "text-xs";
  
  return (
    <div 
      className={cn(
        "flex items-center gap-1 rounded-full px-2 py-1",
        isColor 
          ? "bg-yellow-500 text-white" 
          : "bg-gray-600 text-white",
        className
      )}
      aria-label="Locked - requires higher tier / Đã khoá"
    >
      <Lock className={iconSize} aria-hidden="true" />
      <span className={cn("font-semibold", textSize)}>
        Locked / Đã khoá
      </span>
    </div>
  );
}
