import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Copy, 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  XCircle,
  Building2,
  CreditCard,
  RefreshCw
} from "lucide-react";

// Techcombank account configuration
const BANK_CONFIG = {
  bank_name: "Techcombank (TCB)",
  account_name: "CT TNHH NT HANOI ARTS FOR YOUTH",
  account_number: "5577 57",
  currency: "VND",
};

// VND prices for each tier (approximate conversion from USD yearly prices)
const TIER_PRICES_VND: Record<string, number> = {
  "VIP1 / VIP1": 250000,
  "VIP2 / VIP2": 500000,
  "VIP3 / VIP3": 1000000,
  "VIP4 / VIP4": 2000000,
  "VIP5 / VIP5": 3500000,
  "VIP6 / VIP6": 5000000,
  "VIP7 / VIP7": 7500000,
  "VIP8 / VIP8": 10000000,
  "VIP9 / VIP9": 15000000,
};

interface BankTransferOrder {
  id: string;
  tier: string;
  amount_vnd: number;
  transfer_note: string;
  status: "pending" | "approved" | "rejected" | "expired";
  screenshot_url?: string;
  created_at: string;
  rejection_reason?: string;
}

const BankTransferPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<any[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [orders, setOrders] = useState<BankTransferOrder[]>([]);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    setUser(user);
    await Promise.all([fetchTiers(), fetchOrders()]);
    setLoading(false);
  }

  async function fetchTiers() {
    const { data } = await supabase
      .from("subscription_tiers")
      .select("id, name, name_vi, price_monthly")
      .eq("is_active", true)
      .neq("name", "Free / Miễn phí")
      .order("display_order");
    
    if (data) setTiers(data);
  }

  async function fetchOrders() {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    if (!token) return;

    const { data } = await supabase.functions.invoke("bank-transfer-orders", {
      body: { action: "list-mine" },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data?.ok && data.orders) {
      setOrders(data.orders);
    }
  }

  async function createOrder() {
    if (!selectedTier) {
      toast({ title: "Please select a tier", variant: "destructive" });
      return;
    }

    setCreatingOrder(true);

    try {
      const { data: sessionData } = await supabase.auth.refreshSession();
      const token = sessionData?.session?.access_token;

      const amount_vnd = TIER_PRICES_VND[selectedTier] || 500000;

      const { data } = await supabase.functions.invoke("bank-transfer-orders", {
        body: { action: "create", tier: selectedTier, amount_vnd },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.ok) {
        toast({ title: "Error", description: data?.error || "Failed to create order", variant: "destructive" });
        return;
      }

      toast({ title: "Order created!", description: "Now transfer the money and upload your screenshot." });
      await fetchOrders();
      setSelectedTier("");
    } catch (err) {
      toast({ title: "Error", description: "Failed to create order", variant: "destructive" });
    } finally {
      setCreatingOrder(false);
    }
  }

  async function handleScreenshotUpload(orderId: string) {
    if (!screenshot) {
      toast({ title: "Please select a screenshot", variant: "destructive" });
      return;
    }

    setUploadingScreenshot(orderId);

    try {
      // Upload to Supabase Storage
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `bank-transfers/${user.id}/${orderId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, screenshot, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(fileName);

      // Attach to order
      const { data: sessionData } = await supabase.auth.refreshSession();
      const token = sessionData?.session?.access_token;

      const { data } = await supabase.functions.invoke("bank-transfer-orders", {
        body: { action: "attach-screenshot", order_id: orderId, screenshot_url: urlData.publicUrl },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.ok) {
        toast({ title: "Error", description: data?.error || "Failed to attach screenshot", variant: "destructive" });
        return;
      }

      toast({ title: "Screenshot uploaded!", description: "Admin will review your payment soon." });
      await fetchOrders();
      setScreenshot(null);
    } catch (err) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploadingScreenshot(null);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: text });
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  const pendingOrder = orders.find(o => o.status === "pending");
  const approvedOrder = orders.find(o => o.status === "approved");
  const rejectedOrder = orders.find(o => o.status === "rejected");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader subtitle="Bank Transfer Payment" showBackButton />

      <div className="bg-gradient-to-b from-blue-50 via-cyan-50 to-teal-50 min-h-screen p-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Status Banners */}
          {approvedOrder && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Your {approvedOrder.tier} access is now active!</strong>
                <Button variant="link" onClick={() => navigate("/tier-map")} className="p-0 ml-2">View Tier Map →</Button>
              </AlertDescription>
            </Alert>
          )}

          {pendingOrder && (
            <Alert className="border-yellow-500 bg-yellow-50">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <strong>Your bank transfer for {pendingOrder.tier} is pending admin review.</strong>
                <br />You'll get access after approval.
              </AlertDescription>
            </Alert>
          )}

          {rejectedOrder && !pendingOrder && (
            <Alert className="border-red-500 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>Your last order was rejected:</strong> {rejectedOrder.rejection_reason || "Payment could not be verified."}
                <br />Please create a new order if you'd like to try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Bank Account Info Card */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Building2 className="w-5 h-5" />
                Bank Transfer (Techcombank)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-white rounded-lg border p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Bank / Ngân hàng</span>
                  <span className="font-medium">{BANK_CONFIG.bank_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Account Name / Tên TK</span>
                  <span className="font-medium text-sm">{BANK_CONFIG.account_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Account Number / Số TK</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono font-bold">{BANK_CONFIG.account_number}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(BANK_CONFIG.account_number)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Currency / Tiền tệ</span>
                  <span className="font-medium">{BANK_CONFIG.currency}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-2">
                <p className="font-semibold text-blue-900">How to pay / Cách thanh toán:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Choose your VIP tier below / Chọn cấp VIP bên dưới</li>
                  <li>Get your personal transfer note / Nhận nội dung chuyển khoản</li>
                  <li>Transfer money via banking app / Chuyển tiền qua app ngân hàng</li>
                  <li>Upload screenshot, wait for approval / Tải ảnh chụp, chờ duyệt</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Create Order Section */}
          {!pendingOrder && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Create Bank Transfer Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select VIP Tier / Chọn cấp VIP</Label>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a tier..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map(tier => (
                        <SelectItem key={tier.id} value={tier.name}>
                          {tier.name} - {(TIER_PRICES_VND[tier.name] || 0).toLocaleString()} VND/year
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTier && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Amount to transfer:</p>
                    <p className="text-2xl font-bold text-green-600">
                      {(TIER_PRICES_VND[selectedTier] || 0).toLocaleString()} VND
                    </p>
                  </div>
                )}

                <Button 
                  onClick={createOrder} 
                  disabled={!selectedTier || creatingOrder}
                  className="w-full"
                >
                  {creatingOrder ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Order & Get Transfer Note
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pending Order Details */}
          {pendingOrder && (
            <Card className="border-2 border-yellow-300">
              <CardHeader className="bg-yellow-50">
                <CardTitle className="flex items-center justify-between">
                  <span>Your Pending Order</span>
                  {getStatusBadge(pendingOrder.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tier</p>
                    <p className="font-medium">{pendingOrder.tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-bold text-green-600">{pendingOrder.amount_vnd.toLocaleString()} VND</p>
                  </div>
                </div>

                <div className="bg-yellow-100 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 mb-1">Transfer Note / Nội dung chuyển khoản:</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-3 py-2 rounded font-mono font-bold text-lg flex-1">
                      {pendingOrder.transfer_note}
                    </code>
                    <Button variant="outline" onClick={() => copyToClipboard(pendingOrder.transfer_note)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-yellow-700 mt-2">
                    ⚠️ Use this EXACT note when transferring / Dùng CHÍNH XÁC nội dung này khi chuyển khoản
                  </p>
                </div>

                {/* Screenshot Upload */}
                <div className="border-t pt-4">
                  <Label>Upload Payment Screenshot / Tải ảnh chụp màn hình</Label>
                  {pendingOrder.screenshot_url ? (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700">Screenshot uploaded! Waiting for admin review.</span>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                      />
                      <Button 
                        onClick={() => handleScreenshotUpload(pendingOrder.id)}
                        disabled={!screenshot || uploadingScreenshot === pendingOrder.id}
                        className="w-full"
                      >
                        {uploadingScreenshot === pendingOrder.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        Upload Screenshot
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order History */}
          {orders.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order History</CardTitle>
                <Button variant="ghost" size="sm" onClick={fetchOrders}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{order.tier}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()} • {order.amount_vnd.toLocaleString()} VND
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default BankTransferPayment;
