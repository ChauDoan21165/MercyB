/**
 * Canonical Locked Room Style System - Mercy Blade Edition
 * 
 * Provides consistent locked-state styling that respects Mercy Blade's aesthetic.
 * Locked rooms use a subtle frosted/dimmed overlay that preserves the brand identity.
 */

import { cn } from "@/lib/utils";

/**
 * Get standardized class names for locked room containers
 * 
 * Key principles:
 * - Frosted overlay effect that preserves Mercy Blade gradients
 * - Dimmed but still readable
 * - No yellow, no dashed borders, no color pollution
 * - Works in both Color and B&W modes
 */
export function getLockedRoomClassNames(isColor: boolean = true) {
  return {
    // Container: frosted overlay with opacity reduction
    container: cn(
      "relative cursor-not-allowed",
      isColor 
        ? "opacity-60" 
        : "opacity-65 grayscale"
    ),
    
    // Overlay: subtle white frosted glass effect (only in color mode)
    overlay: isColor 
      ? "absolute inset-0 bg-white/40 backdrop-blur-[1px] pointer-events-none" 
      : "",
    
    // Title: inherits opacity from container, still readable
    title: "leading-tight line-clamp-2",
    
    // Subtitle: inherits opacity from container, still readable
    subtitle: "leading-tight line-clamp-2",
  };
}

/**
 * Get inline styles for locked rooms (minimal - most styling via classes)
 */
export function getLockedRoomStyles() {
  return {};
}
