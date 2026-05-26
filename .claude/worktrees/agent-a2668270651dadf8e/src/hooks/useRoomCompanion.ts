import { useState, useEffect, useCallback, useRef } from 'react';
import { getCompanionEnabled } from './useCompanionSession';
import { getRandomCompanionLineAsync, preloadCompanionLines } from '@/lib/companionLines';

/**
 * Companion hook for room pages
 * Shows Mercy greeting when entering a room - NO auto-hide
 */
export function useRoomCompanion(roomId: string | undefined) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [wasClosed, setWasClosed] = useState(false);
  const hasTriggeredRef = useRef(false);
  const lastRoomRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    preloadCompanionLines();
  }, []);

  useEffect(() => {
    // Reset when room changes
    if (roomId !== lastRoomRef.current) {
      hasTriggeredRef.current = false;
      setWasClosed(false);
      lastRoomRef.current = roomId;
    }

    if (!roomId || hasTriggeredRef.current) return;

    // Check for debug mode
    const params = new URLSearchParams(window.location.search);
    const debugMode = params.get('debug') === 'companion';

    // Check if companion is enabled (unless debug mode)
    if (!debugMode && !getCompanionEnabled()) return;

    // Check muted rooms
    const mutedRooms = JSON.parse(localStorage.getItem('mercy_muted_rooms') || '[]');
    if (!debugMode && mutedRooms.includes(roomId)) return;

    // Check if already greeted in this room this session
    const sessionKey = `mercy_room_${roomId}_greeted`;
    if (!debugMode && sessionStorage.getItem(sessionKey)) return;

    hasTriggeredRef.current = true;

    // Show greeting after room loads
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
      } catch {
        setText("Welcome to this room. Take your time exploring.");
        setVisible(true);
        if (!debugMode) {
          sessionStorage.setItem(sessionKey, 'true');
        }
      }
    };

    const timer = setTimeout(loadAndShow, debugMode ? 300 : 800);
    return () => clearTimeout(timer);
  }, [roomId]);

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

  const muteRoom = useCallback(() => {
    if (!roomId) return;
    const mutedRooms = JSON.parse(localStorage.getItem('mercy_muted_rooms') || '[]');
    if (!mutedRooms.includes(roomId)) {
      localStorage.setItem('mercy_muted_rooms', JSON.stringify([...mutedRooms, roomId]));
    }
    hide();
  }, [roomId, hide]);

  return {
    visible: visible && !!text,
    text,
    hide,
    show,
    showDock: wasClosed && !!text && !visible,
    muteRoom
  };
}
