import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";

const TestEmail = () => {
  const [email, setEmail] = useState("cd12536@gmail.com");
  const [tier, setTier] = useState("VIP3");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("send-redeem-email", {
        body: { email, tier },
      });

      if (error) {
        setResult(`SDK Error: ${error.message}`);
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      if (data?.ok) {
        setResult(`✅ Email sent! ID: ${data.emailId}`);
        toast({ title: "Success", description: "Email sent successfully!" });
      } else {
        setResult(`❌ Failed: ${data?.error || "Unknown error"}`);
        toast({ title: "Failed", description: data?.error, variant: "destructive" });
      }
    } catch (err: any) {
      setResult(`Exception: ${err.message}`);
      toast({ title: "Exception", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Test Redeem Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Tier</label>
            <Input
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              placeholder="VIP3"
            />
          </div>
          <Button onClick={handleTest} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Send Test Email
          </Button>
          {result && (
            <pre className="bg-muted p-3 rounded text-xs whitespace-pre-wrap">
              {result}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestEmail;
