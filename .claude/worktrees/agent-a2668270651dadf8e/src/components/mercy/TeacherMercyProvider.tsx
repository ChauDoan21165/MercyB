/**
 * Mercy Host Provider
 * 
 * Context wrapper for the entire app.
 * Provides Mercy engine state and actions globally.
 * Phase 6: Added heartbeat cleanup and proper lifecycle.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useProfileQuery } from '@/lib/queries/useProfileQuery';
import {
  createMercyEngine,
  initialEngineState,
  type MercyEngineState,
  type MercyEngine
} from '@/lib/teacher-mercy/engine';
import type { MercyEventType } from '@/lib/teacher-mercy/eventMap';
import { mercyHeartbeat } from '@/lib/teacher-mercy/heartbeat';

const TeacherMercyContext = createContext<MercyEngine | null>(null);

interface TeacherMercyProviderProps {
  children: React.ReactNode;
  defaultLanguage?: 'en' | 'vi';
}

export function TeacherMercyProvider({ 
  children,
  defaultLanguage = 'en'
}: TeacherMercyProviderProps) {
  const [state, setState] = useState<MercyEngineState>({
    ...initialEngineState,
    language: defaultLanguage
  });
  
  // Track if heartbeat is started to avoid duplicates
  const heartbeatStartedRef = useRef(false);
  
  // Use ref to always have access to latest state without causing re-renders
  const stateRef = useRef(state);
  stateRef.current = state;
  
  // Create stable getter that reads from ref
  const getState = useCallback(() => stateRef.current, []);
  
  // Create stable setter
  const setStateFn = useCallback((updater: (prev: MercyEngineState) => MercyEngineState) => {
    setState(updater);
  }, []);
  
  // Create engine actions ONCE (stable reference)
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
  
  // Fetch user profile when the auth user changes
  const { user } = useAuth();
  const { data: profile } = useProfileQuery(user?.id ?? null);
  useEffect(() => {
    if (!user) {
      actions.setUserName(null);
      return;
    }
    if (!profile) return;
    const row = profile as { full_name?: string | null; username?: string | null };
    const name = row.full_name || row.username || user.email?.split('@')[0];
    actions.setUserName(name || null);
  }, [user, actions, profile]);
  
  // Initialize engine
  useEffect(() => {
    actions.init({ language: defaultLanguage });
  }, [actions, defaultLanguage]);
  
  return (
    <TeacherMercyContext.Provider value={engine}>
      {children}
    </TeacherMercyContext.Provider>
  );
}

/**
 * Hook to access Mercy Host context
 */
export function useTeacherMercyContext(): MercyEngine {
  const context = useContext(TeacherMercyContext);
  if (!context) {
    throw new Error('useTeacherMercyContext must be used within TeacherMercyProvider');
  }
  return context;
}

/**
 * Hook for room-specific Mercy Host behavior
 */
export function useTeacherMercyRoom(roomId: string, roomTitle: string, tier?: string) {
  const mercy = useTeacherMercyContext();
  
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
  const mercy = useTeacherMercyContext();
  
  return useCallback((event: MercyEventType, payload?: Record<string, unknown>) => {
    mercy.onEvent(event, payload);
  }, [mercy]);
}

/**
 * Hook for triggering room complete
 */
export function useMercyRoomComplete() {
  const mercy = useTeacherMercyContext();
  
  return useCallback((roomId: string, roomTags?: string[], roomDomain?: string) => {
    mercy.onRoomComplete(roomId, roomTags, roomDomain);
  }, [mercy]);
}
