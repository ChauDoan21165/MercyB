import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Gift, Loader2 } from "lucide-react";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";

const RedeemGiftCode = () => {
  const [code, setCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a gift code",
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);

    try {
      // CRITICAL: Check if user is logged in FIRST
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('[redeem-gift-code] No active session:', sessionError);
        toast({
          title: "Login Required",
          description: "Please log in to redeem your gift code",
          variant: "destructive",
        });
        navigate('/auth?redirect=/redeem');
        return;
      }

      console.log('[redeem-gift-code] Session valid, user:', session.user.id);
      
      const { data, error } = await supabase.functions.invoke('redeem-gift-code', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { code: code.trim() },
      });

      console.log('[redeem-gift-code] Response:', { data, error });

      // Handle SDK-level errors (network issues, non-2xx responses)
      if (error) {
        console.error('[redeem-gift-code] Invoke error:', error);
        
        // Try to extract the JSON body from FunctionsHttpError
        let errorMsg = "Could not reach the server. Please try again.";
        if (error instanceof FunctionsHttpError) {
          try {
            const errorData = await error.context.json();
            errorMsg = errorData?.error || errorMsg;
          } catch {
            errorMsg = error.message || errorMsg;
          }
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }

      // Handle application-level errors from the function (shouldn't happen with proper status codes)
      if (!data?.ok) {
        toast({
          title: "Redemption Failed",
          description: data?.error || "Unknown error occurred",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "🎁 Success!",
        description: data.message,
      });

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
