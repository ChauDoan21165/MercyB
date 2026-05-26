import { useState, useEffect, useCallback, useRef } from 'react';
import { getCompanionEnabled } from './useCompanionSession';
import { preloadCompanionLines, getRandomCompanionLineAsync } from '@/lib/companionLines';

/**
 * Enhanced companion hook for home/landing page
 * Shows a greeting bubble - NO auto-hide (user must close it)
 * With dock icon support when closed
 */
export function useHomeCompanion() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [wasClosed, setWasClosed] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    preloadCompanionLines();
  }, []);

  useEffect(() => {
    if (hasTriggeredRef.current) return;
    
    const params = new URLSearchParams(window.location.search);
    const debugMode = params.get('debug') === 'companion';
    
    if (!debugMode && !getCompanionEnabled()) return;

    const sessionKey = 'mercy_home_greeted';
    if (!debugMode && sessionStorage.getItem(sessionKey)) return;
    
    hasTriggeredRef.current = true;

    const loadAndShow = async () => {
      try {
        const line = await getRandomCompanionLineAsync('greeting');
        if (line) {
          setText(line);
          setVisible(true);
          if (!debugMode) {
            sessionStorage.setItem(sessionKey, 'true');
          }
        }
      } catch (err) {
        setText("Welcome! I'm Mercy, your gentle companion on this journey.");
        setVisible(true);
        if (!debugMode) {
          sessionStorage.setItem(sessionKey, 'true');
        }
      }
    };

    const timer = setTimeout(loadAndShow, debugMode ? 500 : 1200);
    return () => clearTimeout(timer);
  }, []);

  // NO AUTO-HIDE - Mercy stays until user closes her

  const hide = useCallback(() => {
    setVisible(false);
    setWasClosed(true);
  }, []);

  const show = useCallback(() => {
    if (text) {
      setVisible(true);
      setWasClosed(false);
    }
  }, [text]);

  return { 
    visible: visible && !!text, 
    text, 
    hide,
    show,
    showDock: wasClosed && !!text && !visible
  };
}
