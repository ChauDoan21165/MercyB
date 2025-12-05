/**
 * Mercy Host Engine Types
 * 
 * TypeScript interfaces for the complete Mercy Host system.
 */

import type { ReactNode } from 'react';
import type { MercyAvatarStyle } from './avatarStyles';
import type { VoiceLine } from './voicePack';

export type MercyEvent = 
  | 'room_enter'
  | 'entry_complete'
  | 'entry_click'
  | 'color_toggle'
  | 'return_inactive'
  | 'scroll_reflection';

export interface MercyHostState {
  tier: string;
  tone: string;
  avatarStyle: MercyAvatarStyle;
  userName: string | null;
  language: 'en' | 'vi';
  isGreetingVisible: boolean;
  currentVoiceLine: VoiceLine | null;
  isPlaying: boolean;
}

export interface MercyHostActions {
  greet: () => void;
  dismiss: () => void;
  reopen: () => void;
  playVoice: (trigger: VoiceLine['trigger']) => void;
  stopVoice: () => void;
  respondToEvent: (event: MercyEvent) => void;
  setAvatarStyle: (style: MercyAvatarStyle) => void;
}

export interface MercyHostEngine extends MercyHostState, MercyHostActions {
  // Computed components
  avatar: ReactNode;
  animation: ReactNode;
  greetingText: { en: string; vi: string } | null;
}

export interface MercyHostConfig {
  roomId: string;
  roomTitle: string;
  roomTier?: string;
  language?: 'en' | 'vi';
  enableVoice?: boolean;
  enableAnimations?: boolean;
}
