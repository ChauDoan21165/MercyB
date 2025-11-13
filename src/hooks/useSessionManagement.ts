import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type DeviceType = 'desktop' | 'mobile';

const detectDeviceType = (): DeviceType => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  return isMobile ? 'mobile' : 'desktop';
};

const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
};

export const useSessionManagement = () => {
  const registerSession = useCallback(async (userId: string, sessionId: string) => {
    try {
      const deviceType = detectDeviceType();
      const deviceInfo = getDeviceInfo();

      // Try to insert/update session (UPSERT)
      const { error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: userId,
          session_id: sessionId,
          device_type: deviceType,
          device_info: deviceInfo,
          last_activity: new Date().toISOString(),
        }, {
          onConflict: 'user_id,device_type'
        });

      if (error) throw error;

      console.log(`Session registered for ${deviceType}`);
    } catch (error) {
      console.error('Failed to register session:', error);
    }
  }, []);

  const updateSessionActivity = useCallback(async (userId: string) => {
    try {
      const deviceType = detectDeviceType();
      
      const { error } = await supabase
        .from('user_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('device_type', deviceType);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }, []);

  const checkSessionValidity = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const deviceType = detectDeviceType();
      
      // Check if there's an active session for this device type
      const { data, error } = await supabase
        .from('user_sessions')
        .select('session_id')
        .eq('user_id', userId)
        .eq('device_type', deviceType)
        .single();

      if (error) {
        console.error('Session validity check error:', error);
        return false;
      }

      // If current session doesn't match stored session, user was logged out
      if (data && data.session_id !== session.access_token) {
        toast({
          title: 'Session Expired',
          description: 'You have been logged in from another device.',
          variant: 'destructive',
        });
        await supabase.auth.signOut();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to check session validity:', error);
      return false;
    }
  }, []);

  const cleanupSession = useCallback(async (userId: string) => {
    try {
      const deviceType = detectDeviceType();
      
      await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', userId)
        .eq('device_type', deviceType);

      console.log(`Session cleaned up for ${deviceType}`);
    } catch (error) {
      console.error('Failed to cleanup session:', error);
    }
  }, []);

  // Periodic session validity check
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkCurrentSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const isValid = await checkSessionValidity(session.user.id);
        if (!isValid) {
          // Session is invalid, user will be logged out
          return;
        }
        // Update activity timestamp
        await updateSessionActivity(session.user.id);
      }
    };

    // Check every 2 minutes
    intervalId = setInterval(checkCurrentSession, 2 * 60 * 1000);

    // Initial check
    checkCurrentSession();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkSessionValidity, updateSessionActivity]);

  return {
    registerSession,
    updateSessionActivity,
    checkSessionValidity,
    cleanupSession,
  };
};
