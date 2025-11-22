import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AlertTone = 'alert' | 'warning' | 'chime' | 'bell';

export const useNotificationSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const checkIfSoundEnabled = async (): Promise<{ enabled: boolean; tone: AlertTone }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { enabled: false, tone: 'alert' };

      const { data } = await supabase
        .from('admin_notification_settings')
        .select('sound_enabled, alert_tone')
        .eq('admin_user_id', user.id)
        .single();

      if (!data) return { enabled: true, tone: 'alert' }; // Default to enabled
      
      return {
        enabled: data.sound_enabled,
        tone: (data.alert_tone as AlertTone) || 'alert',
      };
    } catch (error) {
      console.error('Error checking sound preferences:', error);
      return { enabled: true, tone: 'alert' }; // Default to enabled on error
    }
  };

  const playNotificationSound = useCallback(async (overrideTone?: AlertTone) => {
    try {
      const { enabled, tone } = await checkIfSoundEnabled();
      if (!enabled) return; // Don't play if disabled

      const selectedTone = overrideTone || tone;

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      switch (selectedTone) {
        case 'alert':
          // High-priority alert sound (higher frequency, more urgent)
          oscillator.frequency.setValueAtTime(880, context.currentTime); // A5
          oscillator.frequency.setValueAtTime(1046, context.currentTime + 0.1); // C6
          gainNode.gain.setValueAtTime(0.3, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.3);
          break;

        case 'warning':
          // Warning sound (lower frequency, less urgent)
          oscillator.frequency.setValueAtTime(440, context.currentTime); // A4
          gainNode.gain.setValueAtTime(0.2, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.2);
          break;

        case 'chime':
          // Soft chime (gentle, pleasant)
          oscillator.frequency.setValueAtTime(523, context.currentTime); // C5
          oscillator.frequency.setValueAtTime(659, context.currentTime + 0.15); // E5
          gainNode.gain.setValueAtTime(0.15, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.4);
          break;

        case 'bell':
          // Classic bell sound
          oscillator.frequency.setValueAtTime(784, context.currentTime); // G5
          gainNode.gain.setValueAtTime(0.25, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.5);
          break;
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, []);

  return { playNotificationSound };
};
