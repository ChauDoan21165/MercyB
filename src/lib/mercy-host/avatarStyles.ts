/**
 * Mercy Avatar Styles
 * 
 * Three avatar themes: Angelic, Minimalist, Abstract
 */

export type MercyAvatarStyle = 'angelic' | 'minimalist' | 'abstract';

export interface AvatarStyleConfig {
  id: MercyAvatarStyle;
  name: { en: string; vi: string };
  description: { en: string; vi: string };
}

export const AVATAR_STYLES: AvatarStyleConfig[] = [
  {
    id: 'angelic',
    name: { en: 'Angelic', vi: 'Thiên thần' },
    description: { 
      en: 'Soft wings, warm glow, serene expression', 
      vi: 'Đôi cánh mềm, ánh sáng ấm áp, biểu cảm thanh thản' 
    }
  },
  {
    id: 'minimalist',
    name: { en: 'Minimalist', vi: 'Tối giản' },
    description: { 
      en: 'Outline only, monochrome, quiet modern aesthetic', 
      vi: 'Chỉ đường nét, đơn sắc, thẩm mỹ hiện đại yên tĩnh' 
    }
  },
  {
    id: 'abstract',
    name: { en: 'Abstract', vi: 'Trừu tượng' },
    description: { 
      en: 'Waveforms, geometric light, presence felt', 
      vi: 'Dạng sóng, ánh sáng hình học, cảm nhận sự hiện diện' 
    }
  }
];

const STORAGE_KEY = 'mercy-avatar-style';

/**
 * Get saved avatar style preference
 */
export function getSavedAvatarStyle(): MercyAvatarStyle {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'angelic' || saved === 'minimalist' || saved === 'abstract') {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return 'minimalist'; // default
}

/**
 * Save avatar style preference
 */
export function saveAvatarStyle(style: MercyAvatarStyle): void {
  try {
    localStorage.setItem(STORAGE_KEY, style);
  } catch {
    // ignore storage errors
  }
}
