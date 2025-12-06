import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Loader2, Copy, Check, ArrowLeft } from "lucide-react";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface GiftCode {
  id: string;
  code: string;
  tier: string;
  is_active: boolean;
  used_by: string | null;
  used_at: string | null;
  code_expires_at: string | null;
  created_at: string;
  notes: string | null;
}

type GiftTier = 'VIP1' | 'VIP2' | 'VIP3' | 'VIP4' | 'VIP5' | 'VIP6' | 'VIP7' | 'VIP8' | 'VIP9';

const TIER_COLORS: Record<GiftTier, string> = {
  VIP1: 'bg-slate-100 text-slate-700',
  VIP2: 'bg-blue-100 text-blue-700',
  VIP3: 'bg-purple-100 text-purple-700',
  VIP4: 'bg-indigo-100 text-indigo-700',
  VIP5: 'bg-pink-100 text-pink-700',
  VIP6: 'bg-rose-100 text-rose-700',
  VIP7: 'bg-amber-100 text-amber-700',
  VIP8: 'bg-emerald-100 text-emerald-700',
  VIP9: 'bg-gradient-to-r from-yellow-200 to-amber-200 text-amber-800',
};

const AdminGiftCodes = () => {
  const navigate = useNavigate();
  const [tier, setTier] = useState<GiftTier>('VIP1');
  const [count, setCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [allCodes, setAllCodes] = useState<GiftCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchGiftCodes();
  }, []);

  const fetchGiftCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllCodes(data || []);
    } catch (error: any) {
      console.error('Error fetching gift codes:', error);
      toast({
        title: "Error",
        description: "Failed to load gift codes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (count < 1 || count > 100) {
      toast({
        title: "Invalid Count",
        description: "Please enter a count between 1 and 100",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedCodes([]);

    try {
      const { data, error } = await supabase.functions.invoke('generate-gift-code', {
        body: { tier, count, notes: notes || null },
      });

      // Handle invoke errors (non-2xx responses)
      if (error) {
        // Try to extract error message from the response context
        let errorMessage = "Failed to generate gift codes";
        try {
          // FunctionsHttpError has context.json() available
          const errorContext = await (error as any).context?.json?.();
          if (errorContext?.error) {
            errorMessage = errorContext.error;
          }
        } catch {
          // If context parsing fails, use the error message
          if (error.message) {
            errorMessage = error.message;
          }
        }
        
        toast({
          title: "Generation Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Handle application-level errors in successful response
      if (!data?.success) {
        toast({
          title: "Generation Failed",
          description: data?.error || "Unknown error occurred",
          variant: "destructive",
        });
        return;
      }

      setGeneratedCodes(data.codes || []);
      toast({
        title: "Success!",
        description: `Generated ${data.generated} gift code(s)`,
      });

      // Refresh the codes list
      fetchGiftCodes();

      // Reset form
      setNotes("");
    } catch (error: any) {
      console.error('Error generating gift codes:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Copied!",
        description: "Gift code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <ColorfulMercyBladeHeader subtitle="Manage Gift Codes" />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button 
          onClick={() => navigate('/admin')} 
          variant="outline" 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Button>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Generate Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Generate Gift Codes
              </CardTitle>
            <CardDescription>
                Create new VIP gift codes (VIP1–VIP9) for 1-year access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tier">Tier</Label>
                <Select value={tier} onValueChange={(value) => setTier(value as GiftTier)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIP1">VIP1</SelectItem>
                    <SelectItem value="VIP2">VIP2</SelectItem>
                    <SelectItem value="VIP3">VIP3</SelectItem>
                    <SelectItem value="VIP4">VIP4</SelectItem>
                    <SelectItem value="VIP5">VIP5</SelectItem>
                    <SelectItem value="VIP6">VIP6</SelectItem>
                    <SelectItem value="VIP7">VIP7</SelectItem>
                    <SelectItem value="VIP8">VIP8</SelectItem>
                    <SelectItem value="VIP9">VIP9</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">Number of Codes (1-100)</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., For students, family members, promotional campaign..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Generate Codes
                  </>
                )}
              </Button>

              {generatedCodes.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-green-900">Newly Generated Codes:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {generatedCodes.map((code) => (
                      <div key={code} className="flex items-center gap-2 bg-white p-2 rounded border">
                        <code className="flex-1 text-sm font-mono">{code}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(code)}
                        >
                          {copiedCode === code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Codes */}
          <Card>
            <CardHeader>
              <CardTitle>All Gift Codes</CardTitle>
              <CardDescription>
                View and manage all generated gift codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : allCodes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No gift codes generated yet
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {allCodes.map((giftCode) => (
                    <div
                      key={giftCode.id}
                      className={`p-3 rounded-lg border ${
                        giftCode.used_by
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-white border-green-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <code className="font-mono text-sm font-semibold">{giftCode.code}</code>
                        {!giftCode.used_by && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(giftCode.code)}
                          >
                            {copiedCode === giftCode.code ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded ${
                            TIER_COLORS[giftCode.tier as GiftTier] || 'bg-gray-100 text-gray-700'
                          }`}>
                            {giftCode.tier}
                          </span>
                          <span className={`px-2 py-0.5 rounded ${
                            giftCode.used_by ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {giftCode.used_by ? 'Used' : 'Available'}
                          </span>
                        </div>
                        {giftCode.used_at && (
                          <div>Used: {new Date(giftCode.used_at).toLocaleDateString()}</div>
                        )}
                        {giftCode.notes && (
                          <div className="text-xs italic">Note: {giftCode.notes}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminGiftCodes;
