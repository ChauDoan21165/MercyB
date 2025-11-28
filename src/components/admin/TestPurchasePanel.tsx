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
                <SelectItem value="paypal">💳 PayPal Sandbox</SelectItem>
                <SelectItem value="stripe">💳 Stripe Test Card</SelectItem>
                <SelectItem value="usdt_trc20">🪙 USDT Testnet (TRC20 - Tron)</SelectItem>
                <SelectItem value="usdt_erc20">🪙 USDT Testnet (ERC20 - Ethereum)</SelectItem>
                <SelectItem value="usdt_bep20">🪙 USDT Testnet (BEP20 - BSC)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleTestPurchase}
            disabled={processing || !selectedTier}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-bold shadow-lg"
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
          <p className="text-sm text-blue-900 font-bold mb-3">📋 Test Credentials & Details:</p>
          
          <div className="space-y-3 text-xs">
            <div className="bg-white p-3 rounded border border-blue-300">
              <p className="font-bold text-blue-900 mb-1">💳 PayPal Sandbox</p>
              <p className="text-blue-800">Email: <span className="font-mono bg-blue-100 px-2 py-1 rounded">buyer01@mercyblade-test.com</span></p>
              <p className="text-blue-700 text-[10px] mt-1">Use any PayPal sandbox account for testing</p>
            </div>

            <div className="bg-white p-3 rounded border border-blue-300">
              <p className="font-bold text-blue-900 mb-1">💳 Stripe Test Cards</p>
              <ul className="space-y-1 text-blue-800">
                <li>✅ Success: <span className="font-mono bg-green-100 px-2 py-1 rounded">4242 4242 4242 4242</span></li>
                <li>❌ Declined: <span className="font-mono bg-red-100 px-2 py-1 rounded">4000 0000 0000 0002</span></li>
                <li>⚠️ Insufficient: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">4000 0000 0000 9995</span></li>
              </ul>
              <p className="text-blue-700 text-[10px] mt-1">Use any future expiry date and any 3-digit CVV</p>
            </div>

            <div className="bg-white p-3 rounded border border-blue-300">
              <p className="font-bold text-blue-900 mb-1">🪙 USDT Testnet Wallets</p>
              <div className="space-y-1 text-blue-800">
                <p><strong>TRC20 (Tron):</strong> <span className="font-mono text-[10px] bg-blue-100 px-1 py-0.5 rounded">TTestWallet123...abc</span></p>
                <p><strong>ERC20 (Ethereum):</strong> <span className="font-mono text-[10px] bg-blue-100 px-1 py-0.5 rounded">0xTestWallet456...def</span></p>
                <p><strong>BEP20 (BSC):</strong> <span className="font-mono text-[10px] bg-blue-100 px-1 py-0.5 rounded">0xTestWallet789...ghi</span></p>
              </div>
              <p className="text-blue-700 text-[10px] mt-1">QR codes available on checkout page</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
