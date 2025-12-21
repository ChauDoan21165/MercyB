import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TestModeBanner } from "@/components/payment/TestModeBanner";

const ManualPayment = () => {
  const [searchParams] = useSearchParams();
  const tierId = searchParams.get('tier');
  const tierName = searchParams.get('name');
  const price = searchParams.get('price');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [username, setUsername] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    confidence: number;
    extracted: any;
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter your username",
        variant: "destructive",
      });
      return;
    }
    
    if (!screenshot) {
      toast({
        title: "Screenshot Required",
        description: "Please upload a payment screenshot",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setResult(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Upload screenshot to storage
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, screenshot);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL (for OCR processing)
      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Call OCR verification function
      const { data, error } = await supabase.functions.invoke('verify-payment-screenshot', {
        body: {
          imageUrl: publicUrl,
          tierId: tierId,
          username: username.trim(),
          expectedAmount: parseFloat(price || '0')
        }
      });

      if (error) throw error;

      setResult(data);

      if (data.status === 'auto_approved') {
        toast({
          title: "🎉 Congratulations!",
          description: `You are now in ${tierName}. Enjoy your experience! / Bạn đã là ${tierName}. Tận hưởng trải nghiệm!`,
        });
        
        // Redirect to home after 2 seconds
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast({
          title: "📋 Submitted for Review",
          description: "Admin will verify your payment shortly",
        });
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit payment proof",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="Manual Payment Verification"
        showBackButton={true}
      />

      <div className="bg-gradient-to-b from-orange-50 via-yellow-50 to-amber-50 min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <TestModeBanner />
          
          <Card className="p-8 bg-white/80 backdrop-blur border-2 border-orange-200 shadow-xl">
            <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Manual Payment Verification
            </h1>
            <p className="text-center text-gray-700 mb-2">
              {tierName} - ${price}/year
            </p>
            <p className="text-center text-gray-600 mb-6 text-sm">
              Xác Minh Thanh Toán Thủ Công
            </p>

            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-gray-800">
                <strong>Instructions / Hướng dẫn:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Send payment to our PayPal: <strong>cd12536@gmail.com</strong></li>
                  <li>Take a screenshot of the completed transaction / Chụp màn hình giao dịch hoàn tất</li>
                  <li>Enter your username and upload the screenshot below / Nhập tên người dùng và tải lên ảnh chụp màn hình</li>
                  <li>Wait for verification (usually instant with OCR, may require admin review) / Chờ xác minh (thường ngay lập tức với OCR, có thể cần xem xét của quản trị viên)</li>
                </ol>
              </AlertDescription>
            </Alert>

            {result && (
              <Alert className={`mb-6 ${result.status === 'auto_approved' ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
                {result.status === 'auto_approved' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <AlertDescription>
                  <strong>{result.message}</strong>
                  {result.extracted && (
                    <div className="mt-2 text-sm space-y-1">
                      <p>Transaction ID: {result.extracted.transaction_id || 'N/A'}</p>
                      <p>Amount: ${result.extracted.amount || 'N/A'}</p>
                      <p>Confidence: {Math.round(result.confidence * 100)}%</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-gray-900">Username / Tên người dùng</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isUploading || result?.status === 'auto_approved'}
                  className="bg-white"
                />
              </div>

              <div>
                <Label htmlFor="screenshot" className="text-gray-900">Payment Screenshot / Ảnh chụp màn hình thanh toán</Label>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading || result?.status === 'auto_approved'}
                  className="bg-white"
                />
                {screenshot && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {screenshot.name}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-6 text-lg"
                disabled={isUploading || result?.status === 'auto_approved'}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying... / Đang xác minh...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Payment Proof / Gửi Chứng Từ Thanh Toán
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManualPayment;