import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const SESSION_WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

export function SessionExpiryWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  useEffect(() => {
    // Check session expiry on mount
    checkSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          setExpiresAt(new Date(session.expires_at! * 1000));
          setShowWarning(false);
        }
      }

      if (event === 'SIGNED_OUT') {
        setShowWarning(false);
        setExpiresAt(null);
      }
    });

    // Check expiry every minute
    const interval = setInterval(checkSession, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setShowWarning(false);
      setExpiresAt(null);
      return;
    }

    const expiryTime = new Date(session.expires_at! * 1000);
    setExpiresAt(expiryTime);

    const timeUntilExpiry = expiryTime.getTime() - Date.now();

    // Show warning if less than threshold remaining
    if (timeUntilExpiry > 0 && timeUntilExpiry < SESSION_WARNING_THRESHOLD) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }

  async function handleRefresh() {
    try {
      const { error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Failed to refresh session:', error);
        return;
      }

      setShowWarning(false);
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  }

  if (!showWarning || !expiresAt) {
    return null;
  }

  const minutesRemaining = Math.floor((expiresAt.getTime() - Date.now()) / 60000);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between gap-4">
          <span>
            Your session is expiring in {minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''}
          </span>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="bg-background"
          >
            Refresh Session
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
