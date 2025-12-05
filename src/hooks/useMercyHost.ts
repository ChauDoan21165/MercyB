/**
 * useMercyHost - React Hook for Mercy Host System
 * 
 * Provides greeting text, color mode responses, and persona state
 * for room pages and other Mercy-hosted areas.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  generateRoomGreeting, 
  generateColorModeResponse,
  wasGreetingShown,
  markGreetingShown,
  type MercyGreeting 
} from '@/lib/mercy-host/mercyHost';
import { useColorMode } from '@/lib/color-mode';

export interface UseMercyHostOptions {
  roomId: string;
  roomTitle: string;
  roomTier?: string;
  language?: 'en' | 'vi';
}

export interface UseMercyHostResult {
  greeting: MercyGreeting | null;
  showGreeting: boolean;
  dismissGreeting: () => void;
  reopenGreeting: () => void;
  colorModeMessage: string | null;
  clearColorModeMessage: () => void;
  isVip: boolean;
  userName: string | null;
}

export function useMercyHost(options: UseMercyHostOptions): UseMercyHostResult {
  const { roomId, roomTitle, roomTier = 'free', language = 'en' } = options;
  
  const [userName, setUserName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<MercyGreeting | null>(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [colorModeMessage, setColorModeMessage] = useState<string | null>(null);
  
  const { mode } = useColorMode();
  
  // Fetch user profile for name
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            // Prefer full_name, fallback to username, then first part of email
            const name = profile.full_name || profile.username || user.email?.split('@')[0];
            setUserName(name || null);
          }
        }
      } catch (error) {
        console.warn('[useMercyHost] Failed to fetch user profile:', error);
      }
    };
    
    fetchUserName();
  }, []);
  
  // Generate greeting on mount (only once per room per session)
  useEffect(() => {
    if (!roomId || !roomTitle) return;
    
    // Check if already shown this session
    if (wasGreetingShown(roomId)) {
      return;
    }
    
    const greetingData = generateRoomGreeting({
      userName,
      userTier: roomTier,
      roomId,
      roomTitle,
      language
    });
    
    setGreeting(greetingData);
    setShowGreeting(true);
    markGreetingShown(roomId);
  }, [roomId, roomTitle, roomTier, userName, language]);
  
  // Track color mode changes
  useEffect(() => {
    const message = generateColorModeResponse(language);
    if (message) {
      setColorModeMessage(message);
      // Auto-clear after 3 seconds
      const timer = setTimeout(() => setColorModeMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mode, language]);
  
  const dismissGreeting = useCallback(() => {
    setShowGreeting(false);
  }, []);
  
  const reopenGreeting = useCallback(() => {
    setShowGreeting(true);
  }, []);
  
  const clearColorModeMessage = useCallback(() => {
    setColorModeMessage(null);
  }, []);
  
  return {
    greeting,
    showGreeting,
    dismissGreeting,
    reopenGreeting,
    colorModeMessage,
    clearColorModeMessage,
    isVip: greeting?.isVip ?? false,
    userName
  };
}
