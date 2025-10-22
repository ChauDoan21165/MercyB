import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const tierRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    loadTiers();
    loadPayPalScript();
  }, []);

  const loadTiers = async () => {
    const tierParam = searchParams.get('tier');
    const { data } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (data) {
      let filteredData = data.filter(t => t.name !== 'Free');
      
      // Filter to only the selected tier if tier param exists
      if (tierParam) {
        filteredData = filteredData.filter(t => t.name.toLowerCase() === tierParam.toLowerCase());
      }
      
      setTiers(filteredData);
    }
  };

  const loadPayPalScript = async () => {
    try {
      // Avoid duplicate loads
      if (window.paypal) {
        console.log('PayPal SDK already loaded');
        return;
      }

      if (document.getElementById('paypal-sdk')) {
        console.log('PayPal SDK script already exists, waiting for load...');
        return;
      }

      console.log('Loading PayPal SDK...');
      const { data, error } = await supabase.functions.invoke('paypal-payment', {
        body: { action: 'get-client-id' },
      });
      
      if (error) {
        console.error('Error getting PayPal client ID:', error);
        throw error;
      }
      
      const clientId = data?.clientId;
      if (!clientId) {
        throw new Error('Missing PayPal client ID');
      }

      console.log('PayPal client ID received, loading script...');
      
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons&intent=capture&commit=true&enable-funding=paypal&disable-funding=card,venmo,credit,sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort`;
      script.async = true;
      
      // Wait for script to load
      await new Promise((resolve, reject) => {
        script.onload = () => {
          console.log('PayPal SDK loaded successfully');
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load PayPal SDK script');
          reject(new Error('Failed to load PayPal SDK'));
        };
        document.body.appendChild(script);
      });
    } catch (e) {
      console.error('Failed to load PayPal SDK:', e);
      toast.error('Failed to load PayPal SDK / Không thể tải PayPal');
    }
  };

  const handlePayment = async (tierId: string) => {
    setLoading(true);
    setSelectedTier(tierId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to purchase a subscription / Vui lòng đăng nhập để mua gói');
        setLoading(false);
        navigate('/auth');
        return;
      }

      if (!window.paypal) {
        toast.error('PayPal SDK not loaded. Refreshing... / Đang tải PayPal...');
        setLoading(false);
        await loadPayPalScript();
        return;
      }

      // Render PayPal button
      const container = document.getElementById(`paypal-button-${tierId}`);
      if (!container) {
        console.error('PayPal container not found');
        toast.error('Payment container not found. Please try again.');
        setLoading(false);
        return;
      }

      container.innerHTML = '';

      await window.paypal.Buttons({
        fundingSource: window.paypal.FUNDING.PAYPAL,
        createOrder: async () => {
          try {
            console.log('Creating PayPal order for tier:', tierId);
            const { data: { session } } = await supabase.auth.getSession();
            
            const { data, error } = await supabase.functions.invoke('paypal-payment', {
              body: { action: 'create-order', tierId },
              headers: {
                Authorization: `Bearer ${session?.access_token}`
              }
            });

            if (error) {
              console.error('Create order error:', error);
              throw error;
            }
            
            console.log('Order created:', data.orderId);
            return data.orderId;
          } catch (error) {
            console.error('Failed to create order:', error);
            toast.error('Failed to create payment order / Không thể tạo đơn hàng');
            throw error;
          }
        },
        onApprove: async (data: any) => {
          try {
            console.log('Payment approved, capturing order:', data.orderID);
            const { data: { session } } = await supabase.auth.getSession();
            
            const { data: captureData, error } = await supabase.functions.invoke('paypal-payment', {
              body: { action: 'capture-order', orderId: data.orderID, tierId },
              headers: {
                Authorization: `Bearer ${session?.access_token}`
              }
            });

            if (error) {
              console.error('Capture error:', error);
              toast.error('Payment failed: ' + error.message);
              return;
            }

            console.log('Capture result:', captureData);

            if (captureData.success) {
              toast.success('Payment successful! Your subscription is now active. / Thanh toán thành công!');
              navigate('/');
            } else {
              toast.error('Payment was not completed / Thanh toán không hoàn tất');
            }
          } catch (error) {
            console.error('Payment approval error:', error);
            toast.error('Payment processing failed / Xử lý thanh toán thất bại');
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          toast.error('Payment error occurred / Lỗi thanh toán');
          setLoading(false);
        },
        onCancel: () => {
          console.log('Payment cancelled by user');
          toast.info('Payment cancelled / Đã hủy thanh toán');
          setLoading(false);
        }
      }).render(`#paypal-button-${tierId}`);

      console.log('PayPal button rendered successfully');
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
            ← Back to Home / Quay lại Trang chủ
          </Button>
        </div>

        <h1 className="text-4xl font-bold mb-4">
          {searchParams.get('tier') 
            ? `Payment for ${searchParams.get('tier')?.toUpperCase()} / Thanh toán cho ${searchParams.get('tier')?.toUpperCase()}`
            : 'Choose Your VIP Package / Chọn Gói VIP Của Bạn'
          }
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/20">
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <h3 className="text-xl font-bold mb-1">Fast PayPal / PayPal Nhanh Chóng</h3>
                  <p className="text-sm text-muted-foreground">Pay via app, activate instantly / Thanh toán qua app, kích hoạt ngay lập tức</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/20">
              <div className="flex items-start gap-3">
                <span className="text-3xl">💰</span>
                <div>
                  <h3 className="text-xl font-bold mb-1">Manual Transfer / Chuyển Khoản Thủ Công</h3>
                  <p className="text-sm text-muted-foreground">You can pay yourself via PayPal, give app the transaction screenshot / Bạn có thể tự trả bằng PayPal, cho app màn hình giao dịch</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
          {tiers.map((tier) => (
            <Card 
              key={tier.id} 
              ref={(el) => tierRefs.current[tier.id] = el}
              className="relative border-2 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm w-full"
              style={{
                borderColor: `hsl(var(--${tier.name.includes('VIP1') ? 'secondary' : tier.name.includes('VIP2') ? 'accent' : tier.name.includes('VIP3') ? 'primary' : 'border'}))`,
              }}
            >
              <CardHeader>
                <CardTitle className="text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {tier.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold flex items-baseline gap-2">
                  <span>${tier.price_monthly}</span>
                  <span className="text-base font-normal text-muted-foreground">/month / tháng</span>
                </div>

                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{tier.room_access_per_day} rooms per day / {tier.room_access_per_day} phòng mỗi ngày</span>
                  </li>
                  {tier.custom_topics_allowed > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{tier.custom_topics_allowed} custom topics / {tier.custom_topics_allowed} chủ đề tùy chỉnh</span>
                    </li>
                  )}
                  {tier.priority_support && (
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Priority support / Hỗ trợ ưu tiên</span>
                    </li>
                  )}
                </ul>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={() => handlePayment(tier.id)}
                    disabled={loading}
                    className="w-full h-12 text-base bg-primary hover:bg-primary/90"
                  >
                    ⚡ Pay with PayPal
                  </Button>
                  <div className="w-full border-2 border-dashed border-muted rounded-md p-3">
                    <div 
                      id={`paypal-button-${tier.id}`} 
                      className="min-h-[50px] w-full"
                    />
                  </div>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">OR / HOẶC</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-12 text-base"
                    onClick={() => navigate(`/manual-payment?tier=${tier.id}&name=${encodeURIComponent(tier.name)}&price=${tier.price_monthly}`)}
                  >
                    💰 Manual Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">💳 Secure Payment / Thanh toán An toàn</h3>
            <p className="text-sm text-muted-foreground">
              All payments are securely processed via PayPal. Your subscription will be activated immediately after successful payment. / Tất cả thanh toán được xử lý an toàn qua PayPal. Gói đăng ký sẽ được kích hoạt ngay sau khi thanh toán thành công.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;
