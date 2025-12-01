/**
 * Canonical Locked Room Style System
 * 
 * Provides consistent locked-state styling across all room grids and lists.
 * Locked rooms are clearly readable but visually distinct from accessible rooms.
 */

import { cn } from "@/lib/utils";

/**
 * Get standardized class names for locked room containers
 * 
 * Key principles:
 * - Readable: Full contrast text, no heavy opacity
 * - Distinct: Subtle visual difference (border, background)
 * - Accessible: WCAG AA compliant contrast
 */
export function getLockedRoomClassNames(isColor: boolean = true) {
  return {
    // Container: dashed border, subtle background tint
    container: cn(
      "relative border-2 border-dashed",
      isColor 
        ? "border-yellow-400/80 bg-yellow-50/70" 
        : "border-gray-400 bg-gray-50/70"
    ),
    
    // Title: normal contrast, readable
    title: cn(
      "leading-tight line-clamp-2",
      isColor 
        ? "text-foreground" 
        : "font-black text-black"
    ),
    
    // Subtitle: normal contrast, readable
    subtitle: cn(
      "leading-tight line-clamp-2",
      isColor 
        ? "text-muted-foreground" 
        : "font-black text-black"
    ),
  };
}

/**
 * Get inline styles for locked rooms (used when theme classes aren't sufficient)
 */
export function getLockedRoomStyles(isColor: boolean = true) {
  return isColor 
    ? {} 
    : {
        fontWeight: 900,
        color: "#000000",
      };
}
