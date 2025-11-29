import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { PricingToggle } from '@/components/PricingToggle';
import { TestModeBanner } from '@/components/payment/TestModeBanner';

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
  const [isYearly, setIsYearly] = useState(false);

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

    const billingPeriod = isYearly ? 'yearly' : 'monthly';

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
            
            const { data: orderResult, error } = await supabase.functions.invoke('paypal-payment', {
              body: { action: 'create-order', tier_id: tierId, period: billingPeriod },
              headers: {
                Authorization: `Bearer ${session?.access_token}`
              }
            });

            if (error || !orderResult?.success) {
              console.error('Create order error:', error || orderResult?.error);
              toast.error('Failed to create order: ' + (error?.message || orderResult?.error || 'Unknown error'));
              throw new Error(error?.message || orderResult?.error || 'Failed to create order');
            }
            
            const orderId = orderResult.data?.order_id;
            if (!orderId) {
              toast.error('Failed to create order: missing order ID');
              throw new Error('Missing order ID');
            }
            
            console.log('Order created:', orderId);
            return orderId;
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
              body: { action: 'capture-order', order_id: data.orderID, tier_id: tierId, period: billingPeriod },
              headers: {
                Authorization: `Bearer ${session?.access_token}`
              }
            });

            if (error || !captureData?.success) {
              console.error('Capture error:', error || captureData?.error);
              toast.error(
                'Payment failed: ' +
                  (error?.message || captureData?.error || 'Unknown error')
              );
              return;
            }

            console.log('Capture result:', captureData);
            
            const tierName = tiers.find(t => t.id === tierId)?.name || 'VIP';
            toast.success(
              `🎉 Congratulations! You are now in ${tierName}. Enjoy your experience! / Chúc mừng! Bạn đã là ${tierName}. Tận hưởng trải nghiệm!`,
              { description: `Tier: ${captureData.data?.tier_id || tierId}` }
            );
            setLoading(false);
            navigate('/');
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
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="Choose Your VIP Package"
        showBackButton={true}
      />

      {/* Colorful gradient background */}
      <div className="bg-gradient-to-b from-purple-50 via-blue-50 to-teal-50 min-h-screen py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <TestModeBanner />
          
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            {searchParams.get('tier') 
              ? `Payment for ${searchParams.get('tier')?.toUpperCase()}`
              : 'Choose Your VIP Membership'
            }
          </h1>
          <p className="text-center text-lg mb-2">Chọn Gói VIP Của Bạn</p>

          {/* Payment Methods Info */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg mb-6 text-center text-gray-700">
              You have two ways to transfer money / Bạn có hai cách chuyển tiền:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/80 backdrop-blur border-purple-200 shadow-lg">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900">Fast PayPal</h3>
                    <p className="text-sm text-gray-700">Pay via app, activate instantly</p>
                    <p className="text-sm text-gray-600">Thanh toán qua app, kích hoạt ngay lập tức</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white/80 backdrop-blur border-blue-200 shadow-lg">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💰</span>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900">Manual Transfer</h3>
                    <p className="text-sm text-gray-700">Pay yourself via PayPal, give app the transaction screenshot</p>
                    <p className="text-sm text-gray-600">Bạn có thể tự trả bằng PayPal, cho app màn hình giao dịch</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Pricing Toggle */}
          <div className="mb-8">
            <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
          </div>

          {/* Tier Selection Cards */}
          {tiers.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tiers.map((tier, index) => {
                const colors = ['#E91E63', '#3F51B5', '#00BCD4', '#4CAF50', '#10B981', '#9333EA'];
                const bgColors = ['from-pink-100 to-pink-200', 'from-blue-100 to-blue-200', 'from-cyan-100 to-cyan-200', 'from-green-100 to-green-200', 'from-emerald-100 to-emerald-200', 'from-purple-100 to-violet-200'];
                const borderColors = ['border-pink-300', 'border-blue-300', 'border-cyan-300', 'border-green-300', 'border-emerald-400', 'border-purple-400'];
                
                return (
                  <Card 
                    key={tier.id} 
                    className={`p-6 bg-gradient-to-br ${bgColors[index % 6]} backdrop-blur border-2 ${borderColors[index % 6]} shadow-xl hover:scale-105 transition-transform duration-300`}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl font-bold text-center" style={{ color: colors[index % 6] }}>
                        {tier.name}
                      </CardTitle>
                      <div className="text-center mt-4">
                        <div className="text-4xl font-bold text-gray-900">
                          ${isYearly ? tier.price_yearly : tier.price_monthly}
                          <span className="text-lg font-normal text-gray-600">
                            {isYearly ? '/year' : '/month'}
                          </span>
                        </div>
                        {isYearly && (
                          <p className="text-xs text-gray-600 mt-1">
                            Save 33% vs monthly / Tiết kiệm 33%
                          </p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{tier.rooms_per_month} rooms per month</p>
                        </div>
                        {tier.description && (
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{tier.description}</p>
                          </div>
                        )}
                        {(() => {
                          let parsedFeatures: string[] = [];
                          if (tier.features) {
                            try {
                              const raw = JSON.parse(tier.features);
                              parsedFeatures = Array.isArray(raw) ? raw : [];
                            } catch (e) {
                              console.error('Invalid features JSON for tier', tier.id, e);
                            }
                          }
                          return parsedFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{feature}</p>
                            </div>
                          ));
                        })()}
                      </div>
                      
                      {/* PayPal Button Container */}
                      <div 
                        id={`paypal-button-${tier.id}`}
                        className="min-h-[50px] bg-white/50 rounded-lg p-2"
                        ref={(el) => {
                          tierRefs.current[tier.id] = el;
                        }}
                      />
                      
                      <Button
                        onClick={() => handlePayment(tier.id)}
                        disabled={loading && selectedTier === tier.id}
                        className="w-full mt-4"
                        style={{ backgroundColor: colors[index % 4] }}
                      >
                        {loading && selectedTier === tier.id ? 'Loading...' : 'Select This Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading payment options...</p>
              <p className="text-gray-500 text-sm">Đang tải các tùy chọn thanh toán...</p>
            </div>
          )}

          {/* Manual Payment Option */}
          <div className="mt-12 max-w-2xl mx-auto">
            <Card className="p-8 bg-white/80 backdrop-blur border-2 border-orange-200 shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-center text-orange-600">
                💰 Manual Payment / Chuyển Khoản Thủ Công
              </h3>
              <p className="text-center text-gray-700 mb-6">
                Prefer to pay manually? Upload your payment proof here. / Muốn thanh toán thủ công? Tải lên chứng từ thanh toán tại đây.
              </p>
              <Button
                onClick={() => navigate('/manual-payment')}
                variant="outline"
                className="w-full text-lg py-6 border-2 border-orange-400 hover:bg-orange-50"
              >
                Go to Manual Payment / Chuyển đến Thanh toán Thủ công
              </Button>
            </Card>
          </div>

          {/* Security Info */}
          <div className="mt-8 max-w-2xl mx-auto p-6 bg-white/70 backdrop-blur rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2 text-gray-900">💳 Secure Payment / Thanh toán An toàn</h3>
            <p className="text-sm text-gray-700">
              All payments are securely processed via PayPal. Your subscription will be activated immediately after successful payment.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Tất cả thanh toán được xử lý an toàn qua PayPal. Gói đăng ký sẽ được kích hoạt ngay sau khi thanh toán thành công.
            </p>
          </div>

          {/* All Tiers Overview */}
          <div className="mt-16 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Explore All Membership Tiers
            </h2>
            <p className="text-center text-gray-600 mb-8">Khám Phá Tất Cả Các Gói Thành Viên</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
              {/* Free Tier */}
              <Card 
                className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-300 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate('/rooms')}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">🆓</div>
                  <h3 className="text-xl font-bold text-green-700">Free</h3>
                  <p className="text-2xl font-bold text-gray-900">$0<span className="text-sm">/mo</span></p>
                  <p className="text-sm text-gray-600">Access basic rooms</p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Explore Free
                  </Button>
                </div>
              </Card>

              {/* VIP1 Tier */}
              <Card 
                className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate('/subscribe?tier=vip1')}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">⭐</div>
                  <h3 className="text-xl font-bold text-orange-700">VIP1</h3>
                  <p className="text-2xl font-bold text-gray-900">$3<span className="text-sm">/mo</span></p>
                  <p className="text-sm text-gray-600">10 rooms/month</p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Get VIP1
                  </Button>
                </div>
              </Card>

              {/* VIP2 Tier */}
              <Card 
                className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate('/subscribe?tier=vip2')}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">💎</div>
                  <h3 className="text-xl font-bold text-blue-700">VIP2</h3>
                  <p className="text-2xl font-bold text-gray-900">$6<span className="text-sm">/mo</span></p>
                  <p className="text-sm text-gray-600">25 rooms/month</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Get VIP2
                  </Button>
                </div>
              </Card>

              {/* VIP3 Tier */}
              <Card 
                className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate('/subscribe?tier=vip3')}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">👑</div>
                  <h3 className="text-xl font-bold text-purple-700">VIP3</h3>
                  <p className="text-2xl font-bold text-gray-900">$15<span className="text-sm">/mo</span></p>
                  <p className="text-sm text-gray-600">Unlimited rooms</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Get VIP3
                  </Button>
                </div>
              </Card>

              {/* VIP4 CareerZ Tier */}
              <Card 
                className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate('/subscribe?tier=vip4')}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">🚀</div>
                  <h3 className="text-xl font-bold text-orange-700">VIP4 CareerZ</h3>
                  <p className="text-2xl font-bold text-gray-900">$50<span className="text-sm">/mo</span></p>
                  <p className="text-sm text-gray-600">Career coaching</p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Get VIP4
                  </Button>
                </div>
              </Card>

              {/* VIP5 Writing Tier */}
              <Card 
                className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-400 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate('/subscribe?tier=vip5')}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">✍️</div>
                  <h3 className="text-xl font-bold text-emerald-700">VIP5 Writing</h3>
                  <p className="text-2xl font-bold text-gray-900">$70<span className="text-sm">/mo</span></p>
                  <p className="text-sm text-gray-600">Writing support</p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Get VIP5
                  </Button>
                </div>
              </Card>

              {/* VIP6 Psychology Tier */}
              <Card 
                className="p-6 bg-gradient-to-br from-purple-100 to-violet-100 border-2 border-purple-400 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate('/subscribe?tier=vip6')}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">🧠</div>
                  <h3 className="text-xl font-bold text-purple-800">VIP6 Psychology</h3>
                  <p className="text-2xl font-bold text-gray-900">$90<span className="text-sm">/mo</span></p>
                  <p className="text-sm text-gray-600">Deep psychology</p>
                  <Button className="w-full bg-purple-700 hover:bg-purple-800">
                    Get VIP6
                  </Button>
                </div>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Button
                onClick={() => navigate('/tiers')}
                variant="outline"
                className="text-lg px-8 py-6 border-2"
              >
                View Detailed Tier Comparison / Xem So Sánh Chi Tiết
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;
