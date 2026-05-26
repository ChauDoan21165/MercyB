import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * Shows network status warnings when offline or slow
 */
export function NetworkStatusIndicator() {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  if (isOnline && !isSlowConnection) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <WifiOff className="h-4 w-4" />
        ) : (
          <Wifi className="h-4 w-4" />
        )}
        <AlertDescription>
          {!isOnline ? (
            <>
              You seem offline. Some features may not work.
              <br />
              <span className="text-sm">Bạn đang offline. Một số tính năng có thể không hoạt động.</span>
            </>
          ) : (
            <>
              Slow connection detected. Loading may take longer.
              <br />
              <span className="text-sm">Kết nối chậm. Tải dữ liệu có thể lâu hơn.</span>
            </>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
}
