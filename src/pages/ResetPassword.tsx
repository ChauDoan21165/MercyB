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

// A simple, robust reset flow that:
// 1) Establishes a session from URL (code param or hash tokens)
// 2) Detects expired/invalid links and offers a resend form
// 3) Lets the user set a new password when session is valid

const ResetPassword = () => {
  const navigate = useNavigate();

  // UI state
  const [status, setStatus] = useState<'checking' | 'ready' | 'expired' | 'error'>('checking');
  const [loading, setLoading] = useState(false);

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Resend form when link is expired/invalid
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  // Helper: clean URL
  const cleanUrl = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('error');
      url.searchParams.delete('error_code');
      url.searchParams.delete('error_description');
      url.hash = '';
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

  useEffect(() => {
    const init = async () => {
      try {
        const current = new URL(window.location.href);

        // If Supabase indicates expired/invalid directly in query params, show resend immediately
        const errorCode = current.searchParams.get('error_code');
        if (errorCode === 'otp_expired' || current.searchParams.get('error')) {
          setStatus('expired');
          return;
        }

        // 1) PKCE code flow (query param)
        const code = current.searchParams.get('code');
        if (code) {
          try {
            await supabase.auth.exchangeCodeForSession(window.location.href);
            cleanUrl();
            setStatus('ready');
            return;
          } catch (e) {
            setStatus('expired');
            return;
          }
        }

        // 2) Hash tokens flow
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const type = hashParams.get('type');
        const at = hashParams.get('access_token');
        const rt = hashParams.get('refresh_token');
        if (type === 'recovery' && at && rt) {
          try {
            await supabase.auth.setSession({ access_token: at, refresh_token: rt });
            cleanUrl();
            setStatus('ready');
            return;
          } catch (e) {
            setStatus('expired');
            return;
          }
        }

        // 3) If already authenticated (e.g., user clicked link while logged in)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('ready');
          return;
        }

        // Otherwise, we cannot proceed without a valid session
        setStatus('expired');
      } catch (e) {
        setStatus('error');
      }
    };

    init();
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

      // Save email to help sign-in, sign out to refresh tokens, then redirect
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

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResending(true);
    try {
      const emailSchema = z.string().trim().email({ message: 'Enter a valid email' }).max(255);
      const parsed = emailSchema.safeParse(resendEmail);
      if (!parsed.success) {
        toast({ title: 'Error', description: parsed.error.issues[0]?.message || 'Invalid email', variant: 'destructive' });
        setResending(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resendEmail, {
        redirectTo: `${window.location.origin}/reset`,
      });
      if (error) throw error;

      toast({ title: 'Email sent', description: 'Check your inbox for the new reset link.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Could not send reset email', variant: 'destructive' });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Set New Password</h1>
          <p className="text-muted-foreground mt-2">Enter and confirm your new password</p>
        </div>

        {status === 'checking' && (
          <div className="text-center text-muted-foreground">Preparing reset...</div>
        )}

        {status === 'ready' && (
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
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
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
                  aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
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

        {(status === 'expired' || status === 'error') && (
          <div className="space-y-4">
            <div className="text-center text-destructive font-medium">
              {status === 'expired' ? 'Your reset link is invalid or expired.' : 'Something went wrong while processing your link.'}
            </div>
            <form onSubmit={handleResend} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="resend-email">Resend reset link</Label>
                <Input
                  id="resend-email"
                  type="email"
                  placeholder="your@email.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={resending}>
                {resending ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/auth')}>
              Back to Sign In
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
