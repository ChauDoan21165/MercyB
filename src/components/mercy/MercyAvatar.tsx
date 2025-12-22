// src/components/mercy/MercyAvatar.tsx — v2025-12-21-87.4-AVATAR-TALKING
/**
 * Mercy Avatar Component
 *
 * Renders the appropriate avatar based on user's saved style preference.
 * Backward compatible with existing `animate` usage.
 * NEW: `talking` prop overrides `animate` when provided (audio speaking mode).
 */

import { MercyAvatarAngelic } from "./MercyAvatarAngelic";
import { MercyAvatarMinimalist } from "./MercyAvatarMinimalist";
import { MercyAvatarAbstract } from "./MercyAvatarAbstract";
import { getSavedAvatarStyle, type MercyAvatarStyle } from "@/lib/mercy-host/avatarStyles";

interface MercyAvatarProps {
  size?: number;
  className?: string;

  /** Existing prop: idle animation */
  animate?: boolean;

  /**
   * NEW prop: speaking animation while audio is playing.
   * If provided, it overrides `animate`.
   */
  talking?: boolean;

  style?: MercyAvatarStyle; // override saved preference
}

export function MercyAvatar({
  size = 56,
  className = "",
  animate = true,
  talking,
  style,
}: MercyAvatarProps) {
  const avatarStyle = style || getSavedAvatarStyle();

  // If `talking` is explicitly set, it wins; otherwise fall back to `animate`.
  const shouldAnimate = typeof talking === "boolean" ? talking : animate;

  switch (avatarStyle) {
    case "angelic":
      return (
        <MercyAvatarAngelic size={size} className={className} animate={shouldAnimate} />
      );
    case "abstract":
      return (
        <MercyAvatarAbstract size={size} className={className} animate={shouldAnimate} />
      );
    case "minimalist":
    default:
      return (
        <MercyAvatarMinimalist size={size} className={className} animate={shouldAnimate} />
      );
  }
}

// Re-export individual avatars for direct use
export { MercyAvatarAngelic } from "./MercyAvatarAngelic";
export { MercyAvatarMinimalist } from "./MercyAvatarMinimalist";
export { MercyAvatarAbstract } from "./MercyAvatarAbstract";
