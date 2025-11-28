import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionTier {
  id: string;
  name: string;
  price_monthly: number;
}

export function TestPurchasePanel() {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("paypal");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);

  // Load available tiers
  useState(() => {
    loadTiers();
  });

  const loadTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('id, name, price_monthly')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setTiers(data || []);
    } catch (error) {
      console.error('Error loading tiers:', error);
    }
  };

  const handleTestPurchase = async () => {
    if (!selectedTier) {
      toast({
        title: "Select a Tier",
        description: "Please choose a tier to test",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Find selected tier details
      const tier = tiers.find(t => t.id === selectedTier);
      if (!tier) throw new Error('Tier not found');

      // Create test transaction record
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          tier_id: selectedTier,
          amount: tier.price_monthly,
          payment_method: `test_${paymentMethod}`,
          transaction_type: 'subscription',
          external_reference: `TEST_${Date.now()}`,
          status: 'completed',
          metadata: {
            test_mode: true,
            simulated_at: new Date().toISOString()
          }
        });

      if (transactionError) throw transactionError;

      // Create or update subscription
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      const { error: subError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          tier_id: selectedTier,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (subError) throw subError;

      setResult({
        success: true,
        message: `Successfully upgraded to ${tier.name}! Your account now has full access.`
      });

      toast({
        title: "✅ Test Purchase Complete",
        description: `You are now ${tier.name} (Test Mode)`,
      });

      // Auto-clear result after 5 seconds
      setTimeout(() => {
        setResult(null);
        setSelectedTier("");
      }, 5000);

    } catch (error: any) {
      console.error('Test purchase error:', error);
      setResult({
        success: false,
        message: error.message || 'Test purchase failed'
      });
      
      toast({
        title: "Test Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="p-6 border-2 border-yellow-500 bg-yellow-50/50">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-6 h-6 text-yellow-700" />
          <h3 className="text-xl font-bold text-yellow-900">Test Purchase Mode</h3>
        </div>

        <Alert className="border-yellow-600 bg-yellow-100">
          <AlertDescription className="text-yellow-900 font-semibold">
            ⚠️ TESTING ONLY – No real money will be charged
          </AlertDescription>
        </Alert>

        {result && (
          <Alert className={result.success ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50"}>
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertDescription className="text-red-900">{result.message}</AlertDescription>
            )}
            {result.success && (
              <AlertDescription className="text-green-900 font-semibold">
                {result.message}
              </AlertDescription>
            )}
          </Alert>
        )}

        <div className="space-y-3">
          <div>
            <Label className="text-gray-900 font-semibold">Select Tier</Label>
            <Select value={selectedTier} onValueChange={setSelectedTier} disabled={processing}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Choose a tier..." />
              </SelectTrigger>
              <SelectContent>
                {tiers.map((tier) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    {tier.name} - ${tier.price_monthly}/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-900 font-semibold">Payment Method (Simulated)</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={processing}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paypal">PayPal Sandbox</SelectItem>
                <SelectItem value="usdt">USDT (Simulated)</SelectItem>
                <SelectItem value="stripe">Stripe Test Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleTestPurchase}
            disabled={processing || !selectedTier}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-6 text-lg font-bold"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Test Purchase...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Complete Test Purchase
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-900 font-semibold mb-2">Test Cards & Accounts:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li><strong>PayPal Sandbox:</strong> Any PayPal sandbox account works</li>
            <li><strong>Stripe Success:</strong> 4242 4242 4242 4242</li>
            <li><strong>Stripe Declined:</strong> 4000 0000 0000 0002</li>
            <li><strong>Stripe Insufficient:</strong> 4000 0000 0000 9995</li>
            <li><strong>USDT:</strong> Simulated transaction only</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
