import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Loader2 } from "lucide-react";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";

const RedeemGiftCode = () => {
  const [code, setCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auth guard - redirect to login if not authenticated
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[redeem] getSession error:", error);
        }
        if (!session) {
          navigate("/auth?redirect=/redeem", { replace: true });
          return;
        }
      } finally {
        setCheckingAuth(false);
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth?redirect=/redeem", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Show nothing while checking auth (will redirect if not logged in)
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const handleRedeem = async () => {
    const cleanedCode = code.trim().toUpperCase();
    
    if (!cleanedCode) {
      toast({
        title: "Error",
        description: "Please enter a gift code",
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);

    try {
      // Ensure access token is fresh
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error("[redeem-gift-code] refreshSession error:", refreshError);
      }

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const activeSession = refreshed?.session ?? currentSession;
      
      if (!activeSession) {
        toast({
          title: "Login Required",
          description: "Please log in to redeem your gift code.",
          variant: "destructive",
        });
        navigate("/auth?redirect=/redeem", { replace: true });
        return;
      }

      console.log('[redeem-gift-code] Session valid, user:', activeSession.user.id);
      
      const { data } = await supabase.functions.invoke("redeem-gift-code", {
        headers: {
          Authorization: `Bearer ${activeSession.access_token}`,
        },
        body: { code: cleanedCode },
      });

      // SDK no longer throws because edge function always returns 200
      if (!data?.ok) {
        toast({
          title: "Redeem Failed",
          description: data?.error || "Unknown error.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "🎁 Success!",
        description: data.message,
      });

      // Note: Email is now sent by the edge function itself

      // Clear the input
      setCode("");

      // Refresh the session to update user access
      await supabase.auth.refreshSession();

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Force reload to refresh all access states
      }, 2000);

    } catch (error: any) {
      console.error('Error redeeming gift code:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to redeem gift code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRedeeming) {
      handleRedeem();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <ColorfulMercyBladeHeader subtitle="Redeem Your Gift" />
      
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Redeem Gift Code</CardTitle>
            <CardDescription>
              Enter your gift code to unlock VIP2 or VIP3 access for 1 year
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="gift-code" className="text-sm font-medium">
                Gift Code
              </label>
              <Input
                id="gift-code"
                placeholder="VIP2-XXXX-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={isRedeeming}
                className="font-mono text-center text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Format: VIP2-XXXX-XXXX-XXXX or VIP3-XXXX-XXXX-XXXX
              </p>
            </div>

            <Button
              onClick={handleRedeem}
              disabled={isRedeeming || !code.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redeeming...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem Gift Code
                </>
              )}
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <h4 className="font-semibold mb-2">How it works:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Enter your gift code above</li>
                <li>• Click "Redeem Gift Code"</li>
                <li>• Get instant access to VIP2 or VIP3 for 1 year</li>
                <li>• Each code can only be used once</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RedeemGiftCode;
