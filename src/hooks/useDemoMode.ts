import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ROOMS_TABLE } from '@/lib/constants/rooms';

export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setIsDemoMode(!session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsDemoMode(!session);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsDemoMode(true);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    isDemoMode,
    isAuthenticated,
    loading
  };
};

// Get demo-accessible rooms
export const getDemoRooms = async () => {
  const { data, error } = await supabase
    .from(ROOMS_TABLE)
    .select('*')
    .eq('is_demo', true)
    .order('created_at', { ascending: true })
    .limit(2);

  if (error) {
    console.error('Error fetching demo rooms:', error);
    return [];
  }

  return data || [];
};
