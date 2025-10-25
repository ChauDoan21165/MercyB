import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

import { Eye, EyeOff } from 'lucide-react';


const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    // Load saved email
    const savedEmail = localStorage.getItem('mercyblade_email');
    if (savedEmail) setEmail(savedEmail);
  }, [setEmail]);

  // If the user lands on /auth with recovery/error in the URL hash, route to /reset
  useEffect(() => {
    const rawHash = window.location.hash;
    const hash = rawHash.replace(/^#/, '');
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const hasError = params.get('error') || params.get('error_code');
    const isRecovery = params.get('type') === 'recovery' && params.get('access_token') && params.get('refresh_token');
    if (hasError) {
      try {
        const url = new URL(window.location.href);
        url.hash = '';
        window.history.replaceState({}, '', url.toString());
      } catch {}
      navigate('/reset?expired=1');
    } else if (isRecovery) {
      try {
        const url = new URL(window.location.href);
        url.hash = '';
        window.history.replaceState({}, '', url.toString());
      } catch {}
      navigate(`/reset${rawHash}`);
    }
  }, [navigate]);


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save email for next time
      localStorage.setItem('mercyblade_email', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: signInPassword,
      });

      if (error) throw error;

      toast({
        title: 'Welcome back! / Chào mừng trở lại!',
        description: 'Successfully signed in. / Đăng nhập thành công.',
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error / Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset`,
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Password reset email sent. Please check your inbox.',
      });
      
      setShowReset(false);
      setResetEmail('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };



  if (showReset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground mt-2">Enter your email to receive reset instructions</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setShowReset(false)}
            >
              Back to Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Welcome</h1>
        </div>

        <div className="w-full">
          <form onSubmit={handleSignIn} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <div className="relative w-full">
                <Input
                  id="signin-password"
                  type={showSignInPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                  tabIndex={-1}
                >
                  {showSignInPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center mt-2">
              <Button 
                variant="link" 
                type="button"
                onClick={() => setShowReset(true)}
                className="text-sm"
              >
                Forgot password?
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
