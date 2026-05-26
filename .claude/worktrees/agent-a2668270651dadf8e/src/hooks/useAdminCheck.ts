import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/providers/AuthProvider';

export const useAdminCheck = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAdminStatus = async () => {
      if (!userId) {
        if (!cancelled) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      try {
        const { data: isAdminRpc, error } = await supabase.rpc('has_role', {
          _role: 'admin',
          _user_id: userId,
        });
        if (error) {
          console.error('Error checking admin status:', error);
        }
        if (!cancelled) setIsAdmin(!!isAdminRpc);
      } catch (error) {
        console.error('Error in admin check:', error);
        if (!cancelled) setIsAdmin(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void checkAdminStatus();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { isAdmin, loading };
};
