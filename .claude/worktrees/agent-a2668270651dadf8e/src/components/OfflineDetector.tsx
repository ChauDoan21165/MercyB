import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

export const OfflineDetector = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      
      // Hide "reconnected" message after 3 seconds
      setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show anything if online and not showing reconnected message
  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-6 transition-all duration-300',
        showReconnected ? 'opacity-100' : 'opacity-100'
      )}
    >
      <Alert
        variant={isOnline ? 'default' : 'destructive'}
        className={cn(
          'shadow-lg border-2',
          isOnline ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
        )}
      >
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-600" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-600" />
          )}
          <AlertDescription className={cn(
            'font-medium',
            isOnline ? 'text-green-900' : 'text-red-900'
          )}>
            {isOnline ? (
              <>
                <span className="block">Back online! / Đã kết nối lại!</span>
                <span className="text-sm text-green-700">You can continue using the app</span>
              </>
            ) : (
              <>
                <span className="block">No internet connection / Không có kết nối mạng</span>
                <span className="text-sm text-red-700">
                  Some features may not work until you reconnect
                </span>
              </>
            )}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
};
