/**
 * Analytics Event Layer
 * 
 * Provides a central abstraction for tracking events without vendor coupling.
 * Currently logs to console in dev, no-op in production.
 * Can be extended to integrate with GA, Posthog, etc. in the future.
 */

type EventPayload = Record<string, any>;

const isDev = import.meta.env.DEV;

export const trackEvent = (eventName: string, payload?: EventPayload) => {
  if (isDev) {
    console.log(`[Analytics] Event: ${eventName}`, payload);
  }
  // Future: Send to analytics service
};

export const trackScreen = (screenName: string, payload?: EventPayload) => {
  if (isDev) {
    console.log(`[Analytics] Screen: ${screenName}`, payload);
  }
  // Future: Send to analytics service
};

export const trackThemeChange = (mode: 'color' | 'bw') => {
  trackEvent('theme_toggle', { mode });
};

export const trackRoomOpened = (roomId: string, tier: string, source: string) => {
  trackEvent('room_opened', { roomId, tier, source });
};

export const trackAudioPlay = (roomId: string, entrySlug: string, audioFile: string) => {
  trackEvent('audio_play', { roomId, entrySlug, audioFile });
};

export const trackAudioError = (
  roomId: string, 
  entrySlug: string, 
  audioFile: string, 
  errorMessage: string
) => {
  trackEvent('audio_error', { roomId, entrySlug, audioFile, errorMessage });
};
