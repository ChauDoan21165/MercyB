// src/_legacy_next_pages/Auth.tsx — MB-BLUE-94.14.14 — 2025-12-25 (+0700)
/**
 * MercyBlade Blue — Auth
 * File: src/_legacy_next_pages/Auth.tsx
 * Version: MB-BLUE-94.14.14 — 2025-12-25 (+0700)
 *
 * CHANGE (94.14.14):
 * - No Supabase client changes (already canonical).
 * - FIX: Remove unsupported prop "showBackButton" passed to ColorfulMercyBladeHeader
 *   (header props do not define it in current baseline).
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

// ✅ CANONICAL SUPABASE CLIENT (single owner)
import { supabase } from "@/lib/supabaseClient";

import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import {
  trackLoginAttempt,
  checkUserBlocked,
  checkRateLimit,
  logSecurityEvent,
} from "@/utils/securityUtils";

import { Eye, EyeOff } from "lucide-react";

type LocationState = {
  from?: string;
};

const CANONICAL_RESET_PATH = "/reset-password";

function sanitizeEmail(input: string): string {
  return (input || "").trim().toLowerCase();
}

function parseSupabaseProjectRefFromUrl(url: string): string {
  try {
    const host = new URL(url).host; // <ref>.supabase.co
    return host.split(".")[0] || "(unknown)";
  } catch {
    return "(invalid-url)";
  }
}

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const stateFrom = (location.state as LocationState | null)?.from;
  const redirectTo = stateFrom || searchParams.get("redirect") || "/";

  const { registerSession } = useSessionManagement();
  const [loading, setLoading] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);

  // DEV-only toggles
  const IS_DEV = import.meta.env.DEV;

  useEffect(() => {
    // Load saved email
    const savedEmail = localStorage.getItem("mercyblade_email");
    if (savedEmail) setSignInEmail(savedEmail);

    // DEV: one-time visibility of what we *think* the project is
    if (IS_DEV) {
      const url = (import.meta.env.VITE_SUPABASE_URL || "").trim();
      const ref = url ? parseSupabaseProjectRefFromUrl(url) : "(missing)";
      console.log("[MB][AUTH] env url ref (from VITE_SUPABASE_URL):", ref);
    }
  }, [IS_DEV]);

  // Check for existing session and auto-redirect
  useEffect(() => {
    // ✅ if we just logged out, DO NOT auto-redirect even if session is briefly cached.
    const loggedOutFlag = searchParams.get("logged_out") === "1";
    if (loggedOutFlag) return;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // ✅ extra safety: never redirect back into /auth
          if (redirectTo.startsWith("/auth")) {
            navigate("/", { replace: true });
            return;
          }
          navigate(redirectTo, { replace: true });
        }
      } catch {
        // ignore
      }
    };

    checkSession();
  }, [navigate, redirectTo, searchParams]);

  // If the user lands on /auth with recovery/error in the URL hash, route to reset
  useEffect(() => {
    const rawHash = window.location.hash;
    const hash = rawHash.replace(/^#/, "");
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const hasError = params.get("error") || params.get("error_code");
    const isRecovery =
      params.get("type") === "recovery" &&
      params.get("access_token") &&
      params.get("refresh_token");

    if (hasError) {
      try {
        const url = new URL(window.location.href);
        url.hash = "";
        window.history.replaceState({}, "", url.toString());
      } catch {}
      navigate(`${CANONICAL_RESET_PATH}?expired=1`, { replace: true });
    } else if (isRecovery) {
      try {
        const url = new URL(window.location.href);
        url.hash = "";
        window.history.replaceState({}, "", url.toString());
      } catch {}
      navigate(`${CANONICAL_RESET_PATH}${rawHash}`, { replace: true });
    }
  }, [navigate]);

  async function rawLoginTest() {
    const email = sanitizeEmail(signInEmail);
    const password = signInPassword;

    console.log("[MB][RAW_LOGIN] start", { email });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("[MB][RAW_LOGIN] result", {
      ok: !error,
      error,
      hasSession: !!data?.session,
      userId: data?.user?.id,
    });

    const sessionNow = await supabase.auth.getSession();
    console.log("[MB][RAW_LOGIN] getSession()", {
      hasSession: !!sessionNow.data?.session,
      userId: sessionNow.data?.session?.user?.id,
      error: sessionNow.error,
    });

    if (error) {
      toast({
        title: "RAW LOGIN FAILED (dev)",
        description: (error as any)?.message || "Unknown error",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "RAW LOGIN OK (dev)",
      description: "Password grant returned a session.",
    });
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const email = sanitizeEmail(signInEmail);
    const password = signInPassword; // do NOT trim; passwords may contain spaces

    try {
      // ✅ FAIL-OPEN: these checks must NEVER block login due to RLS/missing tables/network.
      let isBlocked = false;
      try {
        isBlocked = await checkUserBlocked(email);
      } catch (err) {
        console.warn("[auth] checkUserBlocked failed (fail-open)", err);
        isBlocked = false;
      }

      if (isBlocked) {
        try {
          await trackLoginAttempt(email, false, "account_blocked");
        } catch {}
        try {
          await logSecurityEvent("blocked_user_login_attempt", "high", { email });
        } catch {}

        toast({
          title: "Account Blocked / Tài Khoản Bị Khóa",
          description:
            "Your account has been blocked. Contact support. / Tài khoản của bạn đã bị khóa.",
          variant: "destructive",
        });
        return;
      }

      let isRateLimited = false;
      try {
        isRateLimited = await checkRateLimit(email);
      } catch (err) {
        console.warn("[auth] checkRateLimit failed (fail-open)", err);
        isRateLimited = false;
      }

      if (isRateLimited) {
        try {
          await trackLoginAttempt(email, false, "rate_limit_exceeded");
        } catch {}
        try {
          await logSecurityEvent("rate_limit_exceeded", "high", { email });
        } catch {}

        toast({
          title: "Too Many Attempts / Quá Nhiều Lần Thử",
          description:
            "Please wait 15 minutes before trying again. / Vui lòng đợi 15 phút.",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("mercyblade_email", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        try {
          await trackLoginAttempt(email, false, (error as any)?.code || error.message);
        } catch {}

        const code = (error as any)?.code;
        if (code === "invalid_credentials") {
          throw new Error(
            "Invalid email or password. If you used Magic Link before, you may not have a password yet—use 'Forgot Password' to set one."
          );
        }

        throw error;
      }

      if (!data?.session) {
        console.error("[auth] signInWithPassword returned no session", data);
        throw new Error(
          "Login did not return a session. Check Supabase env vars and Auth settings."
        );
      }

      try {
        await trackLoginAttempt(email, true);
      } catch {}
      try {
        await logSecurityEvent("successful_login", "info", {
          email,
          userId: data.user?.id,
        });
      } catch {}

      if (data.user) {
        try {
          await registerSession(data.user.id, data.session.access_token);
        } catch (err) {
          console.warn("[auth] registerSession failed (fail-open)", err);
        }
      }

      toast({
        title: "Welcome back! / Chào mừng trở lại!",
        description: "Successfully signed in / Đăng nhập thành công",
      });

      const hasSeenOnboarding = localStorage.getItem("mb_has_seen_onboarding");

      if (hasSeenOnboarding === "true") {
        navigate(redirectTo, { replace: true });
        return;
      }

      localStorage.setItem("mb_redirect_after_onboarding", redirectTo);

      localStorage.setItem("mb_has_seen_onboarding", "true");
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      toast({
        title: "Error / Lỗi",
        description:
          error?.message || "Invalid credentials / Thông tin đăng nhập không hợp lệ",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = sanitizeEmail(signUpEmail);

    if (signUpPassword !== signUpConfirmPassword) {
      toast({
        title: "Error / Lỗi",
        description: "Passwords do not match / Mật khẩu không khớp",
        variant: "destructive",
      });
      return;
    }

    if (signUpPassword.length < 6) {
      toast({
        title: "Error / Lỗi",
        description:
          "Password must be at least 6 characters / Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: signUpPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Account Created! / Tạo Tài Khoản Thành Công!",
          description: "Welcome to Mercy Blade. / Chào mừng đến với Mercy Blade.",
        });

        const hasSeenOnboarding = localStorage.getItem("mb_has_seen_onboarding");
        if (hasSeenOnboarding === "true") {
          setAuthTab("signin");
          setSignInEmail(email);

          setSignUpEmail("");
          setSignUpPassword("");
          setSignUpConfirmPassword("");
        } else {
          localStorage.setItem("mb_redirect_after_onboarding", "/");
          localStorage.setItem("mb_has_seen_onboarding", "true");
          navigate("/", { replace: true });
        }
      }
    } catch (error: any) {
      let errorMessage = error?.message || "Unknown error";

      if (String(errorMessage).includes("already registered")) {
        errorMessage =
          "Email already registered. Please sign in. / Email đã được đăng ký. Vui lòng đăng nhập.";
      }

      toast({
        title: "Error / Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const email = sanitizeEmail(resetEmail);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${CANONICAL_RESET_PATH}`,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Password reset email sent. Please check your inbox.",
      });

      setShowReset(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showReset) {
    return (
      <div className="min-h-screen">
        <ColorfulMercyBladeHeader subtitle="Reset Your Password" />
        <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur border-2 border-blue-200 shadow-xl">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Reset Password
              </h1>
              <p className="text-gray-700 mt-2">
                Enter your email to receive reset instructions
              </p>
              <p className="text-gray-600 text-sm">
                Nhập email để nhận hướng dẫn đặt lại mật khẩu
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-gray-900">
                  Email
                </Label>
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
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? "Sending... / Đang gửi..." : "Send Reset Link / Gửi Liên Kết"}
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
      <ColorfulMercyBladeHeader subtitle="Sign In to Your Account" />
      <div className="bg-gradient-to-b from-teal-50 via-blue-50 to-purple-50 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur border-2 border-teal-200 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Welcome
            </h1>
            <p className="text-gray-700 mt-2">Sign in or create an account</p>
            <p className="text-gray-600 text-sm">Đăng nhập hoặc tạo tài khoản</p>
          </div>

          <Tabs
            value={authTab}
            onValueChange={(v) => setAuthTab(v as "signin" | "signup")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In / Đăng nhập</TabsTrigger>
              <TabsTrigger value="signup">Sign Up / Đăng ký</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-gray-900">
                    Email
                  </Label>
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
                  <Label htmlFor="signin-password" className="text-gray-900">
                    Password / Mật khẩu
                  </Label>
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
                      aria-label={showSignInPassword ? "Hide password" : "Show password"}
                    >
                      {showSignInPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? "Signing in... / Đang đăng nhập..." : "Sign In / Đăng nhập"}
                </Button>

                {IS_DEV && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={rawLoginTest}
                    disabled={loading}
                  >
                    RAW LOGIN TEST (dev)
                  </Button>
                )}
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
                  <Label htmlFor="signup-email" className="text-gray-900">
                    Email
                  </Label>
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
                  <Label htmlFor="signup-password" className="text-gray-900">
                    Password / Mật khẩu
                  </Label>
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
                      aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                    >
                      {showSignUpPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    At least 6 characters / Ít nhất 6 ký tự
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-gray-900">
                    Confirm Password / Xác nhận mật khẩu
                  </Label>
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
                      aria-label={showSignUpConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showSignUpConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={loading}
                >
                  {loading
                    ? "Creating account... / Đang tạo tài khoản..."
                    : "Create Account / Tạo Tài Khoản"}
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
