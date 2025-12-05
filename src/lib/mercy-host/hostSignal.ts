/**
 * Mercy Host Signal Bus
 * 
 * Event bus for host override commands.
 * Admin UI can trigger commands like SEND_GREETING, PLAY_VOICE, FORCE_ANIMATION.
 */

export type HostSignalType = 
  | 'SEND_GREETING'
  | 'PLAY_VOICE'
  | 'FORCE_ANIMATION'
  | 'DISMISS_HOST'
  | 'SHOW_HOST'
  | 'CHANGE_AVATAR'
  | 'CHANGE_LANGUAGE'
  | 'TOGGLE_ENABLED'
  | 'TRIGGER_ONBOARDING'
  | 'RESET_MEMORY';

export interface HostSignalPayload {
  type: HostSignalType;
  data?: {
    voiceTrigger?: string;
    animation?: string;
    avatarStyle?: string;
    language?: 'en' | 'vi';
    greetingText?: { en: string; vi: string };
    roomId?: string;
    roomTitle?: string;
    tier?: string;
  };
  source?: 'admin' | 'system' | 'user';
  timestamp?: number;
}

type SignalListener = (payload: HostSignalPayload) => void;

class HostSignalBus {
  private listeners: Set<SignalListener> = new Set();
  private history: HostSignalPayload[] = [];
  private maxHistory = 50;

  /**
   * Subscribe to host signals
   */
  subscribe(listener: SignalListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Emit a signal to all listeners
   */
  emit(payload: HostSignalPayload): void {
    const enrichedPayload: HostSignalPayload = {
      ...payload,
      timestamp: Date.now()
    };

    // Store in history
    this.history.push(enrichedPayload);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(enrichedPayload);
      } catch (error) {
        console.error('[HostSignal] Listener error:', error);
      }
    });

    // Also dispatch as custom event for external integration
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mercy_host_signal', {
        detail: enrichedPayload
      }));
    }
  }

  /**
   * Get signal history
   */
  getHistory(): HostSignalPayload[] {
    return [...this.history];
  }

  /**
   * Clear signal history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Send specific signal types (convenience methods)
   */
  sendGreeting(data?: HostSignalPayload['data']): void {
    this.emit({ type: 'SEND_GREETING', data, source: 'system' });
  }

  playVoice(voiceTrigger: string): void {
    this.emit({ 
      type: 'PLAY_VOICE', 
      data: { voiceTrigger }, 
      source: 'system' 
    });
  }

  forceAnimation(animation: string): void {
    this.emit({ 
      type: 'FORCE_ANIMATION', 
      data: { animation }, 
      source: 'system' 
    });
  }

  dismissHost(): void {
    this.emit({ type: 'DISMISS_HOST', source: 'user' });
  }

  showHost(): void {
    this.emit({ type: 'SHOW_HOST', source: 'user' });
  }

  changeAvatar(avatarStyle: string): void {
    this.emit({ 
      type: 'CHANGE_AVATAR', 
      data: { avatarStyle }, 
      source: 'user' 
    });
  }

  changeLanguage(language: 'en' | 'vi'): void {
    this.emit({ 
      type: 'CHANGE_LANGUAGE', 
      data: { language }, 
      source: 'user' 
    });
  }

  toggleEnabled(): void {
    this.emit({ type: 'TOGGLE_ENABLED', source: 'user' });
  }

  triggerOnboarding(): void {
    this.emit({ type: 'TRIGGER_ONBOARDING', source: 'admin' });
  }

  resetMemory(): void {
    this.emit({ type: 'RESET_MEMORY', source: 'admin' });
  }
}

// Singleton instance
export const hostSignal = new HostSignalBus();

/**
 * Hook for listening to host signals in React components
 */
export function useHostSignal(listener: SignalListener): void {
  if (typeof window !== 'undefined') {
    // This would be called in a useEffect in actual use
    // For now, just subscribe
    hostSignal.subscribe(listener);
  }
}
