/**
 * Mercy Host Provider
 * 
 * Context wrapper for the entire app.
 * Provides Mercy engine state and actions globally.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  createMercyEngine, 
  initialEngineState,
  type MercyEngineState,
  type MercyEngine
} from '@/lib/mercy-host/engine';
import type { MercyEventType } from '@/lib/mercy-host/eventMap';

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
  
  // Combine state and actions
  const engine: MercyEngine = useMemo(() => ({
    ...state,
    ...actions
  }), [state, actions]);
  
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
  
  return useCallback((event: MercyEventType) => {
    mercy.onEvent(event);
  }, [mercy]);
}
