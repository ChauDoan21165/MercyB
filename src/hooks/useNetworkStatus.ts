import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

/**
 * Detects online/offline status and slow connection hints
 * Useful for showing "You seem offline" or "Trying to reconnect" messages
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      logger.info('NetworkStatus', 'Connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      logger.warn('NetworkStatus', 'Connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect slow connection hints (optional, experimental)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const checkConnection = () => {
        const effectiveType = connection?.effectiveType;
        const slow = effectiveType === 'slow-2g' || effectiveType === '2g';
        setIsSlowConnection(slow);
        
        if (slow) {
          logger.warn('NetworkStatus', 'Slow connection detected', { effectiveType });
        }
      };

      checkConnection();
      connection?.addEventListener('change', checkConnection);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection?.removeEventListener('change', checkConnection);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isSlowConnection,
  };
}
