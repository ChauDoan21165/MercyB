import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useSessionManagement } from '@/hooks/useSessionManagement';

import { Eye, EyeOff } from 'lucide-react';


const Auth = () => {
  const navigate = useNavigate();
  const { registerSession } = useSessionManagement();
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

  // Check for existing session and auto-redirect
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkSession();
  }, [navigate]);

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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: signInPassword,
      });

      if (error) throw error;

      // Register session to enforce device limit
      if (data.session && data.user) {
        await registerSession(data.user.id, data.session.access_token);
      }

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
      <div className="min-h-screen">
        <ColorfulMercyBladeHeader
          subtitle="Reset Your Password"
          showBackButton={true}
        />
        <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur border-2 border-blue-200 shadow-xl">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Reset Password</h1>
              <p className="text-gray-700 mt-2">Enter your email to receive reset instructions</p>
              <p className="text-gray-600 text-sm">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-gray-900">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
                {loading ? 'Sending... / Đang gửi...' : 'Send Reset Link / Gửi Liên Kết'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowReset(false)}
                className="text-gray-700"
              >
                Back to Sign In / Quay Lại Đăng Nhập
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="Sign In to Your Account"
        showBackButton={true}
      />
      <div className="bg-gradient-to-b from-teal-50 via-blue-50 to-purple-50 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur border-2 border-teal-200 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Welcome</h1>
            <p className="text-gray-700 mt-2">Sign in to continue</p>
            <p className="text-gray-600 text-sm">Đăng nhập để tiếp tục</p>
          </div>

          <div className="w-full">
            <form onSubmit={handleSignIn} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-gray-900">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-gray-900">Password / Mật Khẩu</Label>
                <div className="relative w-full">
                  <Input
                    id="signin-password"
                    type={showSignInPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    className="w-full pr-10 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 z-10"
                    tabIndex={-1}
                  >
                    {showSignInPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700" disabled={loading}>
                {loading ? 'Signing in... / Đang đăng nhập...' : 'Sign In / Đăng Nhập'}
              </Button>
              <div className="text-center mt-2">
                <Button 
                  variant="link" 
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  Forgot password? / Quên mật khẩu?
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
