import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminInfo {
  id: string;
  userId: string;
  email: string;
  level: number;
  createdAt: string;
}

export interface AdminPermissions {
  canEditSystem: boolean;
  canCreateAdmins: boolean;
  canManageLevels: number[];
}

export function useAdminLevel() {
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [permissions, setPermissions] = useState<AdminPermissions>({
    canEditSystem: false,
    canCreateAdmins: false,
    canManageLevels: [],
  });

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  async function fetchAdminInfo() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { action: 'my-role' }
      });

      if (error || !data?.ok) {
        console.error('Failed to fetch admin info:', error || data?.error);
        setLoading(false);
        return;
      }

      setAdminInfo({
        id: data.admin.id,
        userId: data.admin.user_id,
        email: data.admin.email,
        level: data.admin.level,
        createdAt: data.admin.created_at,
      });

      setPermissions(data.permissions);
    } catch (error) {
      console.error('Error fetching admin info:', error);
    } finally {
      setLoading(false);
    }
  }

  const getLevelLabel = (level: number) => {
    if (level === 10) return 'Admin Master';
    return `Level ${level}`;
  };

  const canManage = (targetLevel: number) => {
    return adminInfo ? adminInfo.level > targetLevel : false;
  };

  return {
    loading,
    adminInfo,
    permissions,
    isAdmin: !!adminInfo,
    isAdminMaster: adminInfo?.level === 10,
    canEditSystem: permissions.canEditSystem,
    canCreateAdmins: permissions.canCreateAdmins,
    getLevelLabel,
    canManage,
    refresh: fetchAdminInfo,
  };
}
