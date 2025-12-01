/**
 * Admin Mode Watermark
 * Displays subtle indicator when admin is logged in
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ShieldCheck } from 'lucide-react';

export const AdminWatermark = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase.rpc('has_role', {
          _role: 'admin',
          _user_id: user.id,
        });

        setIsAdmin(!!data);
      } catch (error) {
        console.error('Admin check failed:', error);
      }
    };

    checkAdmin();
  }, []);

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