/**
 * Mercy Avatar Component
 * 
 * Renders the appropriate avatar based on user's saved style preference.
 */

import { MercyAvatarAngelic } from './MercyAvatarAngelic';
import { MercyAvatarMinimalist } from './MercyAvatarMinimalist';
import { MercyAvatarAbstract } from './MercyAvatarAbstract';
import { getSavedAvatarStyle, type MercyAvatarStyle } from '@/lib/mercy-host/avatarStyles';

interface MercyAvatarProps {
  size?: number;
  className?: string;
  animate?: boolean;
  style?: MercyAvatarStyle; // override saved preference
}

export function MercyAvatar({ 
  size = 56, 
  className = '',
  animate = true,
  style
}: MercyAvatarProps) {
  const avatarStyle = style || getSavedAvatarStyle();
  
  switch (avatarStyle) {
    case 'angelic':
      return <MercyAvatarAngelic size={size} className={className} animate={animate} />;
    case 'abstract':
      return <MercyAvatarAbstract size={size} className={className} animate={animate} />;
    case 'minimalist':
    default:
      return <MercyAvatarMinimalist size={size} className={className} animate={animate} />;
  }
}

// Re-export individual avatars for direct use
export { MercyAvatarAngelic } from './MercyAvatarAngelic';
export { MercyAvatarMinimalist } from './MercyAvatarMinimalist';
export { MercyAvatarAbstract } from './MercyAvatarAbstract';
