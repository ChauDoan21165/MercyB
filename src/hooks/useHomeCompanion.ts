import { useState, useEffect, useCallback, useRef } from 'react';
import { getCompanionEnabled } from './useCompanionSession';
import { preloadCompanionLines, getRandomCompanionLineAsync } from '@/lib/companionLines';

/**
 * Simple companion hook for home/landing page
 * Shows a greeting bubble for first-time or returning visitors
 */
export function useHomeCompanion() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Preload lines early
    preloadCompanionLines();
  }, []);

  useEffect(() => {
    // Prevent double trigger
    if (hasTriggeredRef.current) return;
    
    // Check if companion is enabled
    if (!getCompanionEnabled()) return;

    // Check if we already showed greeting this session
    const sessionKey = 'mercy_home_greeted';
    if (sessionStorage.getItem(sessionKey)) return;
    
    hasTriggeredRef.current = true;

    // Show greeting after short delay
    const loadAndShow = async () => {
      try {
        const line = await getRandomCompanionLineAsync('greeting');
        if (line) {
          setText(line);
          setVisible(true);
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (err) {
        // Use fallback
        setText("Welcome! I'm Mercy, your gentle companion.");
        setVisible(true);
        sessionStorage.setItem(sessionKey, 'true');
      }
    };

    const timer = setTimeout(loadAndShow, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide after 6 seconds
  useEffect(() => {
    if (!visible || !text) return;
    const timer = setTimeout(() => {
      setVisible(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [visible, text]);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  // Only return visible true if we have text
  return { visible: visible && !!text, text, hide };
}
