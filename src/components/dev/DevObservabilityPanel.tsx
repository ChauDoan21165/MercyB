import { useState, useEffect } from 'react';
import { Eye, EyeOff, Activity } from 'lucide-react';
import { useUserAccess } from '@/hooks/useUserAccess';
import { logger } from '@/lib/logger';

/**
 * Dev Observability Panel
 * Floating panel showing real-time app state for debugging
 * Only visible in development mode
 */
export function DevObservabilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastLoadDuration, setLastLoadDuration] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const { tier, isAdmin } = useUserAccess();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const validationMode = import.meta.env.VITE_MB_VALIDATION_MODE || 'strict';
  const theme = localStorage.getItem('mercy-blade-theme') || 'system';

  // Listen for room load events (via custom events)
  useEffect(() => {
    const handleRoomLoad = (e: CustomEvent) => {
      setLastLoadDuration(e.detail.duration);
      logger.debug('DevPanel: Room load tracked', { duration: e.detail.duration });
    };

    const handleError = (e: CustomEvent) => {
      setLastError(e.detail.kind || 'unknown');
      logger.debug('DevPanel: Error tracked', { kind: e.detail.kind });
    };

    window.addEventListener('room:load:complete' as any, handleRoomLoad);
    window.addEventListener('app:error' as any, handleError);

    return () => {
      window.removeEventListener('room:load:complete' as any, handleRoomLoad);
      window.removeEventListener('app:error' as any, handleError);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-yellow-500 text-black p-3 rounded-full shadow-lg hover:bg-yellow-400 transition-colors"
          aria-label="Open dev observability panel"
        >
          <Eye className="w-5 h-5" />
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="bg-black text-white p-4 rounded-lg shadow-2xl min-w-[320px] max-w-[400px] border-2 border-yellow-500">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-yellow-500">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-yellow-500" />
              <h3 className="font-bold text-sm">Dev Observability</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-yellow-500 hover:text-yellow-400"
              aria-label="Close dev panel"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>

          {/* Metrics */}
          <div className="space-y-2 text-xs font-mono">
            {/* Tier Info */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Tier:</span>
              <span className="text-yellow-500 font-bold">
                {tier || 'Free'}
                {isAdmin && ' (Admin)'}
              </span>
            </div>

            {/* Validation Mode */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Validation:</span>
              <span className={`font-bold ${
                validationMode === 'strict' ? 'text-red-500' :
                validationMode === 'preview' ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {validationMode.toUpperCase()}
              </span>
            </div>

            {/* Theme */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Theme:</span>
              <span className="text-blue-400">{theme}</span>
            </div>

            {/* Room Load Duration */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Last Load:</span>
              <span className={`font-bold ${
                !lastLoadDuration ? 'text-gray-600' :
                lastLoadDuration < 200 ? 'text-green-500' :
                lastLoadDuration < 1000 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {lastLoadDuration ? `${lastLoadDuration}ms` : 'N/A'}
              </span>
            </div>

            {/* Last Error */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Last Error:</span>
              <span className="text-red-500 font-bold truncate max-w-[150px]">
                {lastError || 'None'}
              </span>
            </div>

            {/* Environment */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <span className="text-gray-400">Mode:</span>
              <span className="text-purple-400">
                {import.meta.env.DEV ? 'DEVELOPMENT' : 'PRODUCTION'}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-3 pt-3 border-t border-gray-700 flex gap-2">
            <button
              onClick={() => {
                localStorage.clear();
                logger.info('DevPanel: LocalStorage cleared');
                window.location.reload();
              }}
              className="flex-1 bg-red-900 hover:bg-red-800 text-white px-2 py-1 rounded text-xs"
            >
              Clear Storage
            </button>
            <button
              onClick={() => {
                console.clear();
                logger.info('DevPanel: Console cleared');
              }}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
            >
              Clear Console
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-3 pt-3 border-t border-gray-700 text-[10px] text-gray-500">
            <p>🔍 Real-time app metrics for debugging</p>
            <p className="mt-1">💡 Visible in development only</p>
          </div>
        </div>
      )}
    </div>
  );
}
