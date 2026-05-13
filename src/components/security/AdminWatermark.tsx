/**
 * Admin Mode Watermark
 * Displays subtle indicator when admin is logged in
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/providers/AuthProvider';
import { ShieldCheck } from 'lucide-react';

export const AdminWatermark = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.rpc('has_role', {
          _role: 'admin',
          _user_id: user.id,
        });
        if (!cancelled) setIsAdmin(!!data);
      } catch (error) {
        console.error('Admin check failed:', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!isAdmin) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 pointer-events-none"
      aria-label="Admin mode active"
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
        <ShieldCheck className="w-4 h-4 text-yellow-500" aria-hidden="true" />
        <span className="text-xs font-medium text-yellow-500">
          ADMIN MODE
        </span>
      </div>
    </div>
  );
};