import { CompanionProfile } from '@/services/companion';
import {
  BUBBLE_BOTTOM_SAFE_DESKTOP,
  BUBBLE_BOTTOM_SAFE_MOBILE,
  DEFAULT_PANEL_HEIGHT_RATIO,
  GUIDE_TAB_BOTTOM_BUFFER_DESKTOP,
  GUIDE_TAB_BOTTOM_BUFFER_MOBILE,
  MIN_PANEL_MARGIN,
  MOBILE_PANEL_BOTTOM_SAFE,
  MOBILE_PANEL_TOP_SAFE,
  PANEL_SIZE_STORAGE_KEY,
  PANEL_SIZE_STORAGE_KEY_DESKTOP,
  PANEL_SIZE_STORAGE_KEY_MOBILE,
} from './mercyGuide.constants';

export type RoomContextSummary = {
  hasRoomContext: boolean;
  roomName: string;
  tierLabel: string | null;
  topicLabel: string | null;
  shortSummary: string | null;
  usageHintEn: string;
  usageHintVi: string;
  whereAreWeEn: string | null;
  whereAreWeVi: string | null;
};

export type MercyGuideRoomInput = {
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
};

export function isMobileViewport() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

export function getPanelWidthPolicy() {
  if (typeof window === 'undefined') {
    return {
      defaultWidth: 560,
      maxWidth: 960,
    };
  }

  const vw = window.innerWidth;

  if (vw < 768) {
    return {
      defaultWidth: Math.min(400, vw - 24),
      maxWidth: Math.min(440, vw - 16),
    };
  }

  if (vw < 1200) {
    return {
      defaultWidth: 560,
      maxWidth: Math.min(820, vw - 32),
    };
  }

  return {
    defaultWidth: 640,
    maxWidth: Math.min(1040, vw - 48),
  };
}

export function getPanelHeightPolicy() {
  if (typeof window === 'undefined') {
    return {
      maxHeight: 900,
    };
  }

  if (window.innerWidth < 768) {
    return {
      maxHeight: Math.min(
        820,
        window.innerHeight - MOBILE_PANEL_TOP_SAFE - MOBILE_PANEL_BOTTOM_SAFE
      ),
    };
  }

  return {
    maxHeight: Math.min(960, window.innerHeight - MIN_PANEL_MARGIN * 2),
  };
}

export function getDefaultPanelHeight() {
  if (typeof window === 'undefined') return 640;
  return Math.round(window.innerHeight * DEFAULT_PANEL_HEIGHT_RATIO);
}

export function getPanelStorageKey() {
  if (typeof window === 'undefined') return PANEL_SIZE_STORAGE_KEY;
  return isMobileViewport()
    ? PANEL_SIZE_STORAGE_KEY_MOBILE
    : PANEL_SIZE_STORAGE_KEY_DESKTOP;
}

export function getBubbleBottomSafe() {
  return isMobileViewport()
    ? BUBBLE_BOTTOM_SAFE_MOBILE
    : BUBBLE_BOTTOM_SAFE_DESKTOP;
}

export function getGuideTabBottomBuffer() {
  return isMobileViewport()
    ? GUIDE_TAB_BOTTOM_BUFFER_MOBILE
    : GUIDE_TAB_BOTTOM_BUFFER_DESKTOP;
}

export function cleanText(value?: string | null) {
  if (!value) return '';
  return value.replace(/\s+/g, ' ').trim();
}

export function stripHtml(value?: string | null) {
  if (!value) return '';
  return cleanText(value.replace(/<[^>]*>/g, ' '));
}

export function sentenceCase(value?: string | null) {
  const text = cleanText(value);
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncateWords(value?: string | null, maxWords = 20) {
  const text = cleanText(value);
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(' ')}…`;
}

export function humanizeSlug(value?: string | null) {
  const text = cleanText(value);
  if (!text) return '';
  return sentenceCase(text.replace(/[-_/]+/g, ' '));
}

export function deriveTopicLabel(tags?: string[], contentEn?: string) {
  const usableTags = (tags ?? [])
    .map((tag) => cleanText(tag))
    .filter(Boolean)
    .slice(0, 3);

  if (usableTags.length > 0) return usableTags.join(', ');

  const content = stripHtml(contentEn);
  if (!content) return null;

  const firstSentence =
    content
      .split(/[.!?]/)
      .map((part) => cleanText(part))
      .find(Boolean) ?? '';

  return truncateWords(firstSentence, 12) || null;
}

export function deriveRoomContextSummary({
  roomTitle,
  tier,
  pathSlug,
  tags,
  contentEn,
}: MercyGuideRoomInput): RoomContextSummary {
  const safeRoomTitle = cleanText(roomTitle);
  const safeTier = cleanText(tier);
  const safeSlug = humanizeSlug(pathSlug);
  const topicLabel = deriveTopicLabel(tags, contentEn);
  const contentSummary = truncateWords(stripHtml(contentEn), 24);
  const roomName = safeRoomTitle || safeSlug || (safeTier ? `${safeTier} room` : 'this room');
  const hasRoomContext = Boolean(safeRoomTitle || safeTier || safeSlug || topicLabel || contentSummary);

  const shortSummary =
    contentSummary ||
    (topicLabel ? `${roomName} focuses on ${topicLabel}.` : null) ||
    (safeTier ? `${roomName} is part of the ${safeTier} tier.` : null);

  const whereAreWeEn = hasRoomContext
    ? `You are in ${roomName}${topicLabel ? `, focused on ${topicLabel}` : ''}.`
    : null;

  const whereAreWeVi = hasRoomContext
    ? `Bạn đang ở ${roomName}${topicLabel ? `, tập trung vào ${topicLabel}` : ''}.`
    : null;

  return {
    hasRoomContext,
    roomName,
    tierLabel: safeTier || null,
    topicLabel,
    shortSummary,
    usageHintEn: hasRoomContext
      ? `Ask me what this room is about, where we are, or how to use ${roomName}.`
      : 'Ask me what this room is about, where we are, or how to use this space.',
    usageHintVi: hasRoomContext
      ? `Bạn có thể hỏi mình phòng này nói về gì, chúng ta đang ở đâu, hoặc cách dùng ${roomName}.`
      : 'Bạn có thể hỏi mình phòng này nói về gì, chúng ta đang ở đâu, hoặc cách dùng không gian này.',
    whereAreWeEn,
    whereAreWeVi,
  };
}

export function buildRoomAwareCheckIn(
  profile: CompanionProfile,
  roomSummary: RoomContextSummary
) {
  const preferredName = cleanText(profile.preferred_name);
  const introName = preferredName ? `${preferredName}, ` : '';

  if (!roomSummary.hasRoomContext) {
    return {
      en: preferredName
        ? `Welcome back, ${preferredName}. I’m here to guide you.`
        : 'Welcome back. I’m here to guide you.',
      vi: preferredName
        ? `Chào mừng quay lại, ${preferredName}. Mình ở đây để hướng dẫn bạn.`
        : 'Chào mừng quay lại. Mình ở đây để hướng dẫn bạn.',
    };
  }

  const roomSentence = roomSummary.whereAreWeEn ?? `You are in ${roomSummary.roomName}.`;
  const summarySentence = roomSummary.shortSummary
    ? truncateWords(roomSummary.shortSummary, 22)
    : null;

  return {
    en: `${introName}${roomSentence}${summarySentence ? ` ${summarySentence}` : ''} ${roomSummary.usageHintEn}`,
    vi: `${preferredName ? `${preferredName}, ` : ''}${roomSummary.whereAreWeVi ?? `Bạn đang ở ${roomSummary.roomName}.`} ${roomSummary.usageHintVi}`,
  };
}