/**
 * Mercy Host Provider
 * 
 * Context wrapper for the entire app.
 * Provides Mercy engine state and actions globally.
 * Phase 6: Added heartbeat cleanup and proper lifecycle.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  createMercyEngine, 
  initialEngineState,
  type MercyEngineState,
  type MercyEngine
} from '@/lib/mercy-host/engine';
import type { MercyEventType } from '@/lib/mercy-host/eventMap';
import { mercyHeartbeat } from '@/lib/mercy-host/heartbeat';

const MercyHostContext = createContext<MercyEngine | null>(null);

interface MercyHostProviderProps {
  children: React.ReactNode;
  defaultLanguage?: 'en' | 'vi';
}

export function MercyHostProvider({ 
  children,
  defaultLanguage = 'en'
}: MercyHostProviderProps) {
  const [state, setState] = useState<MercyEngineState>({
    ...initialEngineState,
    language: defaultLanguage
  });
  
  // Track if heartbeat is started to avoid duplicates
  const heartbeatStartedRef = useRef(false);
  
  // Create stable getter
  const getState = useCallback(() => state, [state]);
  
  // Create stable setter
  const setStateFn = useCallback((updater: (prev: MercyEngineState) => MercyEngineState) => {
    setState(updater);
  }, []);
  
  // Create engine actions
  const actions = useMemo(
    () => createMercyEngine(setStateFn, getState),
    [setStateFn, getState]
  );

  // Combine state and actions early for heartbeat
  const engine: MercyEngine = useMemo(() => ({
    ...state,
    ...actions
  }), [state, actions]);

  // Start heartbeat only once, stop on unmount
  useEffect(() => {
    // Only start if not already started and host is enabled
    if (!heartbeatStartedRef.current && state.isEnabled && !state.silenceMode) {
      mercyHeartbeat.start(
        getState,
        () => {
          // Auto-repair: reset to safe state
          setState(s => ({
            ...s,
            currentAnimation: 'halo',
            presenceState: 'active',
            isBubbleVisible: false,
            isRitualBannerVisible: false
          }));
        }
      );
      heartbeatStartedRef.current = true;
    }
    
    return () => {
      if (heartbeatStartedRef.current) {
        mercyHeartbeat.stop();
        heartbeatStartedRef.current = false;
      }
    };
  }, [state.isEnabled, state.silenceMode, getState]);

  // Stop heartbeat when silence mode is on or host is disabled
  useEffect(() => {
    if (state.silenceMode || !state.isEnabled) {
      if (heartbeatStartedRef.current) {
        mercyHeartbeat.stop();
        heartbeatStartedRef.current = false;
      }
    } else if (!heartbeatStartedRef.current && state.isEnabled) {
      mercyHeartbeat.start(
        getState,
        () => {
          setState(s => ({
            ...s,
            currentAnimation: 'halo',
            presenceState: 'active',
            isBubbleVisible: false,
            isRitualBannerVisible: false
          }));
        }
      );
      heartbeatStartedRef.current = true;
    }
  }, [state.silenceMode, state.isEnabled, getState]);
  
  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            const name = profile.full_name || profile.username || user.email?.split('@')[0];
            actions.setUserName(name || null);
          }
        }
      } catch (error) {
        console.warn('[MercyHostProvider] Failed to fetch user profile:', error);
      }
    };
    
    fetchUserProfile();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        actions.setUserName(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [actions]);
  
  // Initialize engine
  useEffect(() => {
    actions.init({ language: defaultLanguage });
  }, [actions, defaultLanguage]);
  
  return (
    <MercyHostContext.Provider value={engine}>
      {children}
    </MercyHostContext.Provider>
  );
}

/**
 * Hook to access Mercy Host context
 */
export function useMercyHostContext(): MercyEngine {
  const context = useContext(MercyHostContext);
  if (!context) {
    throw new Error('useMercyHostContext must be used within MercyHostProvider');
  }
  return context;
}

/**
 * Hook for room-specific Mercy Host behavior
 */
export function useMercyHostRoom(roomId: string, roomTitle: string, tier?: string) {
  const mercy = useMercyHostContext();
  
  // Initialize for room
  useEffect(() => {
    if (roomId && roomTitle) {
      mercy.init({ roomId, roomTitle, tier });
      mercy.onEnterRoom(roomId, roomTitle);
    }
    
    return () => {
      // Could track room exit here
    };
  }, [roomId, roomTitle, tier]);
  
  return mercy;
}

/**
 * Hook for triggering Mercy events
 */
export function useMercyEvent() {
  const mercy = useMercyHostContext();
  
  return useCallback((event: MercyEventType, payload?: Record<string, unknown>) => {
    mercy.onEvent(event, payload);
  }, [mercy]);
}

/**
 * Hook for triggering room complete
 */
export function useMercyRoomComplete() {
  const mercy = useMercyHostContext();
  
  return useCallback((roomId: string, roomTags?: string[], roomDomain?: string) => {
    mercy.onRoomComplete(roomId, roomTags, roomDomain);
  }, [mercy]);
}
