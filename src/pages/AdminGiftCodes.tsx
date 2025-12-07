import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Loader2, Copy, Check, Calendar } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
type GiftDuration = '1_month' | '3_months' | '6_months' | '12_months';

const DURATION_LABELS: Record<GiftDuration, string> = {
  '1_month': '1 Month (30 days)',
  '3_months': '3 Months (90 days)',
  '6_months': '6 Months (180 days)',
  '12_months': '12 Months (365 days)',
};

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
  const [duration, setDuration] = useState<GiftDuration>('12_months');
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
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('gift_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('[AdminGiftCodes] Fetched codes:', data?.length);
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
        body: { tier, count, duration, notes: notes || null },
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
        setIsGenerating(false);
        return;
      }

      // Handle application-level errors in successful response
      if (!data?.success) {
        toast({
          title: "Generation Failed",
          description: data?.error || "Unknown error occurred",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      setGeneratedCodes(data.codes || []);
      toast({
        title: "Success!",
        description: `Generated ${data.generated} gift code(s)`,
      });

      // Refresh the codes list and wait for it to complete
      await fetchGiftCodes();

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

  // Calculate summary stats
  const totalCodes = allCodes.length;
  const availableCodes = allCodes.filter(c => !c.used_by && c.is_active).length;
  const usedCodes = allCodes.filter(c => c.used_by).length;

  // Debug: log render
  console.log('[AdminGiftCodes] Rendering component, isLoading:', isLoading, 'allCodes:', allCodes.length);
  
  return (
    <AdminLayout>
      <div className="container mx-auto max-w-6xl space-y-6" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1rem' }}>
          <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>Gift Codes</h1>
          <p style={{ color: '#666666' }}>Generate and manage VIP gift codes</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Generate Codes */}
          <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#000000' }}>
                <Gift className="w-5 h-5" />
                Generate Gift Codes
              </CardTitle>
              <CardDescription style={{ color: '#666666' }}>
                Create new VIP gift codes (VIP1–VIP9) with custom duration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tier" style={{ color: '#000000' }}>Tier</Label>
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
                  <Label htmlFor="duration" style={{ color: '#000000' }}>Duration</Label>
                  <Select value={duration} onValueChange={(value) => setDuration(value as GiftDuration)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_month">1 Month</SelectItem>
                      <SelectItem value="3_months">3 Months</SelectItem>
                      <SelectItem value="6_months">6 Months</SelectItem>
                      <SelectItem value="12_months">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count" style={{ color: '#000000' }}>Number of Codes (1-100)</Label>
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
                <Label htmlFor="notes" style={{ color: '#000000' }}>Notes (Optional)</Label>
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
          <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
            <CardHeader>
              <CardTitle style={{ color: '#000000' }}>All Gift Codes</CardTitle>
              <CardDescription style={{ color: '#666666' }}>
                View and manage all generated gift codes
              </CardDescription>
              {/* Debug summary */}
              <div className="mt-2 text-xs bg-muted/50 rounded p-2">
                <span className="font-mono">
                  Total: {totalCodes} | Available: {availableCodes} | Used: {usedCodes}
                </span>
                <span className="text-muted-foreground ml-2">(from DB)</span>
              </div>
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
                        {giftCode.code_expires_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expires: {new Date(giftCode.code_expires_at).toLocaleDateString()}
                          </div>
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
    </AdminLayout>
  );
};

export default AdminGiftCodes;
