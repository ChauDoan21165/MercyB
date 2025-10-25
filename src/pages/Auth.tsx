import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    // Load saved email
    const savedEmail = localStorage.getItem('mercyblade_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }

    // If coming back without hash but we marked recovery, keep showing the form
    try {
      const qs = new URLSearchParams(window.location.search);
      if (qs.get('recovery') === '1') {
        setIsPasswordRecovery(true);
      }
    } catch {}

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Clean sensitive hash from URL and persist recovery state in query param
        try {
          const url = new URL(window.location.href);
          url.hash = '';
          url.searchParams.set('recovery', '1');
          window.history.replaceState({}, '', url.toString());
        } catch {}
        setIsPasswordRecovery(true);
        return;
      }

      const isRecoveryUrl = window.location.hash.includes('type=recovery') || new URLSearchParams(window.location.search).get('recovery') === '1';
      if (event === 'SIGNED_IN' && session && !isRecoveryUrl) {
        navigate('/');
      }
    });

    // Complete email link PKCE code if present
    const url = new URL(window.location.href);
    const hasCode = !!url.searchParams.get('code');
    if (hasCode) {
      supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {
        toast({ title: 'Error', description: 'Email link is invalid or has expired.', variant: 'destructive' });
      });
    }

    // Fallback: process hash tokens from recovery links (#access_token, #refresh_token)
    (async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const type = hashParams.get('type');
        const at = hashParams.get('access_token');
        const rt = hashParams.get('refresh_token');
        if (type === 'recovery' && at && rt) {
          await supabase.auth.setSession({ access_token: at, refresh_token: rt });
          // Clean URL and mark recovery state
          const cleanUrl = new URL(window.location.href);
          cleanUrl.hash = '';
          cleanUrl.searchParams.set('recovery', '1');
          window.history.replaceState({}, '', cleanUrl.toString());
          setIsPasswordRecovery(true);
        }
      } catch {}
    })();

    // Initialize current session after wiring the listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      // If no session but we detect recovery flags, show the form
      if (!session && (window.location.hash.includes('type=recovery') || new URLSearchParams(window.location.search).get('recovery') === '1')) {
        setIsPasswordRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save email for next time
      localStorage.setItem('mercyblade_email', email);
      
      const { error } = await supabase.auth.signUp({
        email,
        password: signUpPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: 'Success! / Thành công!',
        description: 'Account created successfully. / Tài khoản đã được tạo thành công.',
      });
      
      // Auto login after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: signUpPassword,
      });

      if (signInError) throw signInError;
      
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
        redirectTo: `${window.location.origin}/auth?recovery=1`,
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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Password updated successfully. You can now sign in.',
      });
      
      // Ensure a clean session, then redirect to sign-in
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        localStorage.setItem('mercyblade_email', user.email);
      }
      await supabase.auth.signOut();

      setIsPasswordRecovery(false);
      setNewPassword('');
      navigate('/auth');
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

  if (isPasswordRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Set New Password</h1>
            <p className="text-muted-foreground mt-2">Enter your new password below</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password (min 6 characters)</Label>
              <div className="relative w-full">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

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

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
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
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password (min 6 characters)</Label>
                <div className="relative w-full">
                  <Input
                    id="signup-password"
                    type={showSignUpPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                    tabIndex={-1}
                  >
                    {showSignUpPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

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
