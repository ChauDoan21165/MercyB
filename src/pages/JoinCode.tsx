import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function JoinCode() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'checking' | 'valid' | 'invalid' | 'redeemed'>('checking');
  const [tierName, setTierName] = useState<string>("");
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    if (!code) {
      setStatus('invalid');
      return;
    }
    checkCode();
  }, [code]);

  const checkCode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to auth with return URL
        navigate(`/auth?redirect=/join/${code}`);
        return;
      }

      // Check if code exists and is valid
      const { data: accessCode, error } = await supabase
        .from('access_codes')
        .select(`
          *,
          subscription_tiers (name, name_vi)
        `)
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !accessCode) {
        setStatus('invalid');
        return;
      }

      // Check if already redeemed by this user
      const { data: redemption } = await supabase
        .from('access_code_redemptions')
        .select('id')
        .eq('code_id', accessCode.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (redemption) {
        setStatus('redeemed');
        return;
      }

      // Check if code has reached max uses
      if (accessCode.used_count >= accessCode.max_uses) {
        setStatus('invalid');
        toast({
          title: "Code Expired",
          description: "This invitation code has reached its maximum usage limit.",
          variant: "destructive"
        });
        return;
      }

      // Valid code
      setTierName(accessCode.subscription_tiers.name);
      setDays(accessCode.days);
      setStatus('valid');
    } catch (error) {
      console.error('Error checking code:', error);
      setStatus('invalid');
    }
  };

  const redeemCode = async () => {
    if (!code) return;
    
    setStatus('checking');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate(`/auth?redirect=/join/${code}`);
        return;
      }

      // Get access code
      const { data: accessCode, error: codeError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (codeError || !accessCode) {
        throw new Error('Invalid code');
      }

      // Create subscription
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + accessCode.days);

      const { error: subError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          tier_id: accessCode.tier_id,
          status: 'active',
          current_period_start: startDate.toISOString(),
          current_period_end: endDate.toISOString()
        });

      if (subError) throw subError;

      // Record redemption
      const { error: redemptionError } = await supabase
        .from('access_code_redemptions')
        .insert({
          user_id: user.id,
          code_id: accessCode.id
        });

      if (redemptionError) throw redemptionError;

      // Update code usage count
      await supabase
        .from('access_codes')
        .update({ used_count: accessCode.used_count + 1 })
        .eq('id', accessCode.id);

      toast({
        title: "Welcome! 🎉",
        description: `You now have ${accessCode.days} days of ${tierName} access!`
      });

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error redeeming code:', error);
      toast({
        title: "Redemption Failed",
        description: "Could not activate your code. Please try again.",
        variant: "destructive"
      });
      setStatus('invalid');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'hsl(var(--background))' }}>
      <Card className="max-w-md w-full p-8">
        {status === 'checking' && (
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <h2 className="text-2xl font-bold">Checking invitation...</h2>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        )}

        {status === 'valid' && (
          <div className="text-center space-y-6">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Valid Invitation!</h2>
              <p className="text-lg mb-1">You're invited to join <span className="font-semibold text-primary">{tierName}</span></p>
              <p className="text-muted-foreground">Access for {days} days</p>
            </div>
            <Button onClick={redeemCode} size="lg" className="w-full">
              Activate Now
            </Button>
          </div>
        )}

        {status === 'invalid' && (
          <div className="text-center space-y-6">
            <XCircle className="w-16 h-16 mx-auto text-destructive" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Invalid Code</h2>
              <p className="text-muted-foreground">This invitation link is not valid or has expired.</p>
            </div>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Go Home
            </Button>
          </div>
        )}

        {status === 'redeemed' && (
          <div className="text-center space-y-6">
            <CheckCircle className="w-16 h-16 mx-auto text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Already Activated</h2>
              <p className="text-muted-foreground">You've already redeemed this invitation code.</p>
            </div>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
