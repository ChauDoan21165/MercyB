import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    let unsub: { unsubscribe: () => void } | null = null;

    const init = async () => {
      // 1) Listen for PASSWORD_RECOVERY events
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          // Clean hash to avoid reprocessing and show form
          try {
            const clean = new URL(window.location.href);
            clean.hash = '';
            window.history.replaceState({}, '', clean.toString());
          } catch {}
          setInitializing(false);
        }
      });
      unsub = subscription;

      // 2) Process PKCE code sent via query param
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(window.location.href);
          // Clean code from URL
          url.searchParams.delete('code');
          window.history.replaceState({}, '', url.toString());
          setInitializing(false);
          return;
        } catch (e) {
          toast({ title: 'Error', description: 'Reset link is invalid or expired.', variant: 'destructive' });
          setInitializing(false);
          return;
        }
      }

      // 3) Fallback: handle hash tokens (access_token/refresh_token)
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const type = hashParams.get('type');
      const at = hashParams.get('access_token');
      const rt = hashParams.get('refresh_token');
      if (type === 'recovery' && at && rt) {
        try {
          await supabase.auth.setSession({ access_token: at, refresh_token: rt });
          const clean = new URL(window.location.href);
          clean.hash = '';
          window.history.replaceState({}, '', clean.toString());
          setInitializing(false);
          return;
        } catch (e) {
          toast({ title: 'Error', description: 'Reset session could not be established.', variant: 'destructive' });
        }
      }

      // 4) If none of the above, show form anyway (user may arrive with active session)
      setInitializing(false);
    };

    init();
    return () => {
      if (unsub) unsub.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const schema = z.object({
        password: z.string().trim().min(6, { message: 'Password must be at least 6 characters' }).max(128),
        confirm: z.string().trim().min(6).max(128),
      }).refine((d) => d.password === d.confirm, { path: ['confirm'], message: 'Passwords do not match' });

      const parsed = schema.safeParse({ password: newPassword, confirm: confirmNewPassword });
      if (!parsed.success) {
        toast({ title: 'Error', description: parsed.error.issues[0]?.message || 'Invalid input', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      // Store email for convenience, then sign out to force fresh login
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) localStorage.setItem('mercyblade_email', user.email);
      await supabase.auth.signOut();

      toast({ title: 'Success', description: 'Password updated. Please sign in with your new password.' });
      navigate('/auth');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to update password', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Set New Password</h1>
          <p className="text-muted-foreground mt-2">Enter and confirm your new password</p>
        </div>

        {initializing ? (
          <div className="text-center text-muted-foreground">Preparing reset...</div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password (min 6 characters)</Label>
              <div className="relative w-full">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative w-full">
                <Input
                  id="confirm-password"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                  tabIndex={-1}
                >
                  {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
