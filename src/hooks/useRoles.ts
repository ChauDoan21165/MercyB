// Custom Role Loader - Load user roles from database

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserRoles {
  isAdmin: boolean;
  isModerator: boolean;
  isContentEditor: boolean;
  loading: boolean;
}

export function useRoles() {
  const [roles, setRoles] = useState<UserRoles>({
    isAdmin: false,
    isModerator: false,
    isContentEditor: false,
    loading: true,
  });

  useEffect(() => {
    loadRoles();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadRoles();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadRoles() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setRoles({
          isAdmin: false,
          isModerator: false,
          isContentEditor: false,
          loading: false,
        });
        return;
      }

      // Load roles from database
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to load roles:', error);
        setRoles({
          isAdmin: false,
          isModerator: false,
          isContentEditor: false,
          loading: false,
        });
        return;
      }

      const rolesList = userRoles?.map(r => r.role) || [];

      setRoles({
        isAdmin: rolesList.includes('admin'),
        isModerator: rolesList.includes('moderator'),
        isContentEditor: rolesList.includes('content_editor'),
        loading: false,
      });
    } catch (error) {
      console.error('Error loading roles:', error);
      setRoles({
        isAdmin: false,
        isModerator: false,
        isContentEditor: false,
        loading: false,
      });
    }
  }

  return roles;
}
