// src/lib/mercy-host/avatarStyles.ts — v2025-12-21-87.9-AVATAR-STYLES-HARDEN
/**
 * Mercy Avatar Styles
 *
 * Three avatar themes: Angelic, Minimalist, Abstract
 * Hardened: safe for SSR, safe storage access, helper validators.
 */

export type MercyAvatarStyle = "angelic" | "minimalist" | "abstract";

export interface AvatarStyleConfig {
  id: MercyAvatarStyle;
  name: { en: string; vi: string };
  description: { en: string; vi: string };
}

export const AVATAR_STYLES: AvatarStyleConfig[] = [
  {
    id: "angelic",
    name: { en: "Angelic", vi: "Thiên thần" },
    description: {
      en: "Soft wings, warm glow, serene expression",
      vi: "Đôi cánh mềm, ánh sáng ấm áp, biểu cảm thanh thản",
    },
  },
  {
    id: "minimalist",
    name: { en: "Minimalist", vi: "Tối giản" },
    description: {
      en: "Outline only, monochrome, quiet modern aesthetic",
      vi: "Chỉ đường nét, đơn sắc, thẩm mỹ hiện đại yên tĩnh",
    },
  },
  {
    id: "abstract",
    name: { en: "Abstract", vi: "Trừu tượng" },
    description: {
      en: "Waveforms, geometric light, presence felt",
      vi: "Dạng sóng, ánh sáng hình học, cảm nhận sự hiện diện",
    },
  },
];

export const DEFAULT_AVATAR_STYLE: MercyAvatarStyle = "minimalist";
const STORAGE_KEY = "mercy-avatar-style";

// Small in-memory cache to avoid repeated storage reads
let cached: MercyAvatarStyle | null = null;

/**
 * Type guard / validator
 */
export function isMercyAvatarStyle(value: unknown): value is MercyAvatarStyle {
  return value === "angelic" || value === "minimalist" || value === "abstract";
}

/**
 * Normalize unknown string to a safe style
 */
export function normalizeAvatarStyle(value: unknown): MercyAvatarStyle {
  return isMercyAvatarStyle(value) ? value : DEFAULT_AVATAR_STYLE;
}

/**
 * Get saved avatar style preference (safe for SSR)
 */
export function getSavedAvatarStyle(): MercyAvatarStyle {
  if (cached) return cached;

  // SSR / non-browser guard
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    cached = DEFAULT_AVATAR_STYLE;
    return cached;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    cached = normalizeAvatarStyle(saved);
    return cached;
  } catch {
    cached = DEFAULT_AVATAR_STYLE;
    return cached;
  }
}

/**
 * Save avatar style preference (safe for SSR)
 */
export function saveAvatarStyle(style: MercyAvatarStyle): void {
  cached = style;

  // SSR / non-browser guard
  if (typeof window === "undefined" || typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, style);
  } catch {
    // ignore storage errors
  }
}

/**
 * Clear cached value (useful for tests or hard reset flows)
 */
export function resetSavedAvatarStyleCache(): void {
  cached = null;
}
