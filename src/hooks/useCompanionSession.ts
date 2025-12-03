import { useState, useCallback, useRef, useEffect } from 'react';
import { CompanionCategory, getRandomCompanionLine } from '@/lib/companionLines';
import { canCompanionSpeakGlobally, markCompanionSpoken } from '@/lib/companionGlobal';

// Friend mode configuration
const COMPANION_MAX_BUBBLES_PER_SESSION = 10;
const COMPANION_MIN_INTERVAL_MS = 25_000; // 25 seconds between bubbles

export interface CompanionSessionState {
  roomId: string;
  bubblesShown: number;
  lastCategory?: CompanionCategory;
  lastShownAt?: number;
}

interface CompanionBubbleData {
  text: string;
  visible: boolean;
}

interface UseCompanionSessionReturn {
  sessionState: CompanionSessionState;
  bubbleData: CompanionBubbleData;
  showBubble: (category: CompanionCategory, overrideCooldown?: boolean) => void;
  canSpeak: () => boolean;
  resetSession: () => void;
  hideBubble: () => void;
}

/**
 * Check if companion is enabled (localStorage setting)
 */
function isCompanionEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('companion_enabled');
  return stored !== 'false'; // Default to true
}

/**
 * Hook to manage companion session state and bubble display
 */
export function useCompanionSession(roomId: string): UseCompanionSessionReturn {
  const [sessionState, setSessionState] = useState<CompanionSessionState>({
    roomId,
    bubblesShown: 0,
  });

  const [bubbleData, setBubbleData] = useState<CompanionBubbleData>({
    text: '',
    visible: false,
  });

  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shownCategoriesRef = useRef<Set<CompanionCategory>>(new Set());

  // Reset session when roomId changes
  useEffect(() => {
    setSessionState({
      roomId,
      bubblesShown: 0,
    });
    shownCategoriesRef.current.clear();
    setBubbleData({ text: '', visible: false });
  }, [roomId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const canSpeak = useCallback((): boolean => {
    // Check if companion is enabled
    if (!isCompanionEnabled()) return false;

    // Check max bubbles per session
    if (sessionState.bubblesShown >= COMPANION_MAX_BUBBLES_PER_SESSION) return false;

    // Check global rate limit
    if (!canCompanionSpeakGlobally()) return false;

    // Check session cooldown
    if (sessionState.lastShownAt) {
      const elapsed = Date.now() - sessionState.lastShownAt;
      if (elapsed < COMPANION_MIN_INTERVAL_MS) return false;
    }

    return true;
  }, [sessionState]);

  const hideBubble = useCallback(() => {
    setBubbleData((prev) => ({ ...prev, visible: false }));
  }, []);

  const showBubble = useCallback(
    (category: CompanionCategory, overrideCooldown = false) => {
      // Check if companion is enabled
      if (!isCompanionEnabled()) return;

      // Check if already shown this category in session (for non-critical)
      if (!overrideCooldown && shownCategoriesRef.current.has(category)) return;

      // Check if we can speak (unless overriding cooldown)
      if (!overrideCooldown && !canSpeak()) return;

      // For override, still check max bubbles
      if (sessionState.bubblesShown >= COMPANION_MAX_BUBBLES_PER_SESSION) return;

      // Get random line for category
      const text = getRandomCompanionLine(category);

      // Clear any existing timer
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      // Show bubble
      setBubbleData({ text, visible: true });

      // Mark as shown
      shownCategoriesRef.current.add(category);
      markCompanionSpoken();

      // Update session state
      setSessionState((prev) => ({
        ...prev,
        bubblesShown: prev.bubblesShown + 1,
        lastCategory: category,
        lastShownAt: Date.now(),
      }));

      // Auto-hide after 3 seconds
      hideTimerRef.current = setTimeout(() => {
        setBubbleData((prev) => ({ ...prev, visible: false }));
      }, 3000);
    },
    [canSpeak, sessionState.bubblesShown]
  );

  const resetSession = useCallback(() => {
    setSessionState({
      roomId,
      bubblesShown: 0,
    });
    shownCategoriesRef.current.clear();
    setBubbleData({ text: '', visible: false });
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
  }, [roomId]);

  return {
    sessionState,
    bubbleData,
    showBubble,
    canSpeak,
    resetSession,
    hideBubble,
  };
}

/**
 * Toggle companion enabled state
 */
export function setCompanionEnabled(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('companion_enabled', String(enabled));
    // Dispatch custom event for cross-component sync
    window.dispatchEvent(new CustomEvent('companion-enabled-change', { detail: enabled }));
  }
}

/**
 * Get companion enabled state
 */
export function getCompanionEnabled(): boolean {
  return isCompanionEnabled();
}

/**
 * Hook to listen for companion enabled state changes
 */
export function useCompanionEnabledState(): boolean {
  const [enabled, setEnabled] = useState(isCompanionEnabled());
  
  useEffect(() => {
    const handleChange = (e: CustomEvent<boolean>) => {
      setEnabled(e.detail);
    };
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'companion_enabled') {
        setEnabled(e.newValue !== 'false');
      }
    };
    
    window.addEventListener('companion-enabled-change', handleChange as EventListener);
    window.addEventListener('storage', handleStorage);
    
    return () => {
      window.removeEventListener('companion-enabled-change', handleChange as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
  
  return enabled;
}
