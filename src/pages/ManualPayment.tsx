import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
          title: "✅ Payment Verified!",
          description: "Your subscription is now active!",
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">Manual Payment Verification</h1>
          <p className="text-muted-foreground mb-6">
            {tierName} - ${price}/year
          </p>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Instructions:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Send payment to our PayPal: <strong>cd12536@gmail.com</strong></li>
                <li>Take a screenshot of the completed transaction</li>
                <li>Enter your username and upload the screenshot below</li>
                <li>Wait for verification (usually instant with OCR, may require admin review)</li>
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={isUploading || result?.status === 'auto_approved'}
              />
            </div>

            <div>
              <Label htmlFor="screenshot">Payment Screenshot</Label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading || result?.status === 'auto_approved'}
              />
              {screenshot && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {screenshot.name}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading || result?.status === 'auto_approved'}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Payment Proof
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ManualPayment;