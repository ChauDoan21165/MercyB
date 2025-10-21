import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

declare global {
  interface Window {
    paypal?: any;
  }
}

const PaymentTest = () => {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    loadTiers();
    loadPayPalScript();
  }, []);

  const loadTiers = async () => {
    const { data } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (data) {
      setTiers(data.filter(t => t.name !== 'Free'));
    }
  };

  const loadPayPalScript = async () => {
    try {
      // Avoid duplicate loads
      if (window.paypal || document.getElementById('paypal-sdk')) return;

      const { data, error } = await supabase.functions.invoke('paypal-payment', {
        body: { action: 'get-client-id' },
      });
      if (error) throw error;
      const clientId = data?.clientId;
      if (!clientId) throw new Error('Missing PayPal client ID');

      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      script.async = true;
      document.body.appendChild(script);
    } catch (e) {
      console.error('Failed to load PayPal SDK:', e);
      toast.error('Failed to load PayPal SDK');
    }
  };

  const handlePayment = async (tierId: string) => {
    setLoading(true);
    setSelectedTier(tierId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to purchase a subscription');
        navigate('/auth');
        return;
      }

      if (!window.paypal) {
        toast.error('PayPal SDK not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      // Render PayPal button
      const container = document.getElementById(`paypal-button-${tierId}`);
      if (!container) return;

      container.innerHTML = '';

      window.paypal.Buttons({
        createOrder: async () => {
          const { data, error } = await supabase.functions.invoke('paypal-payment', {
            body: { action: 'create-order', tierId },
          });

          if (error) throw error;
          return data.orderId;
        },
        onApprove: async (data: any) => {
          const { data: captureData, error } = await supabase.functions.invoke('paypal-payment', {
            body: { action: 'capture-order', orderId: data.orderID, tierId },
          });

          if (error) {
            toast.error('Payment failed: ' + error.message);
            return;
          }

          if (captureData.success) {
            toast.success('Payment successful! Your subscription is now active.');
            navigate('/');
          } else {
            toast.error('Payment was not completed');
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          toast.error('Payment error occurred');
        },
      }).render(`#paypal-button-${tierId}`);

      setLoading(false);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Failed to initialize payment: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>

        <h1 className="text-4xl font-bold mb-4">Payment Test</h1>
        <p className="text-muted-foreground mb-8">
          Test PayPal integration with sandbox credentials
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.id} className="relative">
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.name_vi}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  ${tier.price_monthly}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-2 text-sm">
                  <li>✓ {tier.room_access_per_day} rooms per day</li>
                  {tier.custom_topics_allowed > 0 && (
                    <li>✓ {tier.custom_topics_allowed} custom topics</li>
                  )}
                  {tier.priority_support && <li>✓ Priority support</li>}
                </ul>

                <div className="space-y-2">
                  <Button
                    onClick={() => handlePayment(tier.id)}
                    disabled={loading && selectedTier === tier.id}
                    className="w-full"
                  >
                    {loading && selectedTier === tier.id ? 'Loading...' : 'Pay with PayPal'}
                  </Button>
                  <div id={`paypal-button-${tier.id}`} className="min-h-[50px]"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Test Credentials (Sandbox)</h3>
          <p className="text-sm text-muted-foreground">
            Use PayPal sandbox test accounts to test payments without real money.
            Visit <a href="https://developer.paypal.com/dashboard/" target="_blank" rel="noopener noreferrer" className="text-primary underline">PayPal Developer Dashboard</a> to create test accounts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;
