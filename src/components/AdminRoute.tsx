import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const AdminRoute = ({ children }: Props) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setAllowed(false);
          setChecking(false);
          return;
        }

        // Use has_role() from DB
        const { data, error } = await supabase.rpc('has_role', {
          _role: 'admin',
          _user_id: user.id,
        });

        if (error) {
          console.error('has_role error', error);
          toast.error('Unable to verify admin access');
          setAllowed(false);
        } else {
          setAllowed(!!data);
        }
      } catch (e) {
        console.error('AdminRoute error', e);
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    };

    check();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking admin access…
      </div>
    );
  }

  if (!allowed) {
    toast.error('Admin access required');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
