import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { 
  trackLoginAttempt, 
  checkUserBlocked, 
  checkRateLimit, 
  logSecurityEvent 
} from '@/utils/securityUtils';

import { Eye, EyeOff } from 'lucide-react';


const Auth = () => {
  const navigate = useNavigate();
  const { registerSession } = useSessionManagement();
  const [loading, setLoading] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  
  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    // Load saved email
    const savedEmail = localStorage.getItem('mercyblade_email');
    if (savedEmail) setSignInEmail(savedEmail);
  }, []);

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
      // Check if user is blocked
      const isBlocked = await checkUserBlocked(signInEmail);
      if (isBlocked) {
        await trackLoginAttempt(signInEmail, false, 'account_blocked');
        await logSecurityEvent('blocked_user_login_attempt', 'high', { email: signInEmail });
        toast({
          title: 'Account Blocked / Tài Khoản Bị Khóa',
          description: 'Your account has been blocked. Contact support. / Tài khoản của bạn đã bị khóa.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Check rate limit
      const isRateLimited = await checkRateLimit(signInEmail);
      if (isRateLimited) {
        await trackLoginAttempt(signInEmail, false, 'rate_limit_exceeded');
        await logSecurityEvent('rate_limit_exceeded', 'high', { email: signInEmail });
        toast({
          title: 'Too Many Attempts / Quá Nhiều Lần Thử',
          description: 'Please wait 15 minutes before trying again. / Vui lòng đợi 15 phút.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Save email for next time
      localStorage.setItem('mercyblade_email', signInEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) {
        await trackLoginAttempt(signInEmail, false, error.message);
        throw error;
      }

      // Track successful login
      await trackLoginAttempt(signInEmail, true);
      await logSecurityEvent('successful_login', 'info', {
        email: signInEmail,
        userId: data.user?.id 
      });

      // Register session to enforce device limit
      if (data.session && data.user) {
        await registerSession(data.user.id, data.session.access_token);
      }

      toast({
        title: 'Welcome back! / Chào mừng trở lại!',
        description: 'Successfully signed in / Đăng nhập thành công',
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error / Lỗi',
        description: error.message || 'Invalid credentials / Thông tin đăng nhập không hợp lệ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (signUpPassword !== signUpConfirmPassword) {
      toast({
        title: 'Error / Lỗi',
        description: 'Passwords do not match / Mật khẩu không khớp',
        variant: 'destructive',
      });
      return;
    }

    // Validate password strength
    if (signUpPassword.length < 6) {
      toast({
        title: 'Error / Lỗi',
        description: 'Password must be at least 6 characters / Mật khẩu phải có ít nhất 6 ký tự',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: 'Account Created! / Tạo Tài Khoản Thành Công!',
          description: 'Welcome to Mercy Blade. You can now sign in. / Chào mừng đến với Mercy Blade. Bạn có thể đăng nhập ngay.',
        });
        
        // Auto-switch to sign in tab
        setAuthTab('signin');
        setSignInEmail(signUpEmail);
        
        // Clear signup form
        setSignUpEmail('');
        setSignUpPassword('');
        setSignUpConfirmPassword('');
      }
    } catch (error: any) {
      let errorMessage = error.message;
      
      // Handle specific error cases
      if (error.message.includes('already registered')) {
        errorMessage = 'Email already registered. Please sign in. / Email đã được đăng ký. Vui lòng đăng nhập.';
      }
      
      toast({
        title: 'Error / Lỗi',
        description: errorMessage,
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
            <p className="text-gray-700 mt-2">Sign in or create an account</p>
            <p className="text-gray-600 text-sm">Đăng nhập hoặc tạo tài khoản</p>
          </div>

          <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as 'signin' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In / Đăng nhập</TabsTrigger>
              <TabsTrigger value="signup">Sign Up / Đăng ký</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-gray-900">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-gray-900">Password / Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showSignInPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                      className="bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSignInPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700" disabled={loading}>
                  {loading ? 'Signing in... / Đang đăng nhập...' : 'Sign In / Đăng nhập'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowReset(true)}
                  className="text-gray-700"
                >
                  Forgot Password? / Quên Mật Khẩu?
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-900">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-900">Password / Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignUpPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSignUpPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">At least 6 characters / Ít nhất 6 ký tự</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-gray-900">Confirm Password / Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showSignUpConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSignUpConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" disabled={loading}>
                  {loading ? 'Creating account... / Đang tạo tài khoản...' : 'Create Account / Tạo Tài Khoản'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
