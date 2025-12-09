import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Loader2, Copy, Check, Calendar, Filter } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface GiftCode {
  id: string;
  code: string;
  tier: string;
  is_active: boolean;
  used_by: string | null;
  used_by_email: string | null;
  used_at: string | null;
  code_expires_at: string | null;
  created_at: string;
  notes: string | null;
}

type GiftTier = 'VIP1' | 'VIP2' | 'VIP3' | 'VIP4' | 'VIP5' | 'VIP6' | 'VIP7' | 'VIP8' | 'VIP9';
type GiftDuration = '1_month' | '3_months' | '6_months' | '12_months';
type UsageFilter = 'all' | 'used' | 'unused';

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
  const [usageFilter, setUsageFilter] = useState<UsageFilter>('all');
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

      if (error) {
        let errorMessage = "Failed to generate gift codes";
        try {
          const errorContext = await (error as any).context?.json?.();
          if (errorContext?.error) {
            errorMessage = errorContext.error;
          }
        } catch {
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

      if (!data?.success) {
        toast({
          title: "Generation Failed",
          description: data?.error || "Unknown error occurred",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      const generatedCount = data.codes?.length || data.generated || 0;
      
      if (generatedCount === 0) {
        toast({
          title: "Generation Failed",
          description: data.failed > 0 
            ? `All ${data.failed} code(s) failed to generate. Please try again.`
            : "No codes were generated. Please try again.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      setGeneratedCodes(data.codes || []);
      toast({
        title: "Success!",
        description: generatedCount === 1 
          ? "Generated 1 gift code" 
          : `Generated ${generatedCount} gift codes`,
      });

      await fetchGiftCodes();
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

  // Filter codes based on usage
  const filteredCodes = allCodes.filter(code => {
    if (usageFilter === 'used') return !!code.used_by;
    if (usageFilter === 'unused') return !code.used_by;
    return true;
  });

  // Calculate summary stats
  const totalCodes = allCodes.length;
  const availableCodes = allCodes.filter(c => !c.used_by && c.is_active).length;
  const usedCodes = allCodes.filter(c => c.used_by).length;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Gift Codes</h1>
          <p className="text-gray-600">Generate and manage VIP gift codes</p>
        </div>
        
        {/* Generate Codes Card */}
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
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Label htmlFor="tier" style={{ color: '#000000' }}>Tier</Label>
                <Select value={tier} onValueChange={(value) => setTier(value as GiftTier)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5', 'VIP6', 'VIP7', 'VIP8', 'VIP9'] as GiftTier[]).map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
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

              <div className="space-y-2">
                <Label htmlFor="count" style={{ color: '#000000' }}>Count (1-100)</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" style={{ color: '#000000' }}>Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="e.g., For students, family..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Check className="w-4 h-4" />
                  Generated {generatedCodes.length} code(s)
                </div>
              )}
            </div>

            {generatedCodes.length > 0 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Newly Generated:</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedCodes.map((code) => (
                    <div key={code} className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-sm">
                      <code className="font-mono">{code}</code>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard(code)}>
                        {copiedCode === code ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Codes Table */}
        <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle style={{ color: '#000000' }}>All Gift Codes</CardTitle>
                <CardDescription style={{ color: '#666666' }}>
                  Total: {totalCodes} | Available: {availableCodes} | Used: {usedCodes}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={usageFilter} onValueChange={(v) => setUsageFilter(v as UsageFilter)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unused">Unused</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredCodes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No gift codes found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Used By</TableHead>
                      <TableHead>Used At</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCodes.map((giftCode) => (
                      <TableRow key={giftCode.id}>
                        <TableCell>
                          <code className="font-mono text-sm font-semibold">{giftCode.code}</code>
                        </TableCell>
                        <TableCell>
                          <Badge className={TIER_COLORS[giftCode.tier as GiftTier] || 'bg-gray-100 text-gray-700'}>
                            {giftCode.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(giftCode.created_at)}
                        </TableCell>
                        <TableCell>
                          {giftCode.used_by ? (
                            <Badge variant="secondary">Used</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700">Available</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {giftCode.used_by_email || giftCode.used_by || '-'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(giftCode.used_at)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {giftCode.code_expires_at ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(giftCode.code_expires_at).toLocaleDateString()}
                            </span>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-32 truncate">
                          {giftCode.notes || '-'}
                        </TableCell>
                        <TableCell>
                          {!giftCode.used_by && (
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard(giftCode.code)}>
                              {copiedCode === giftCode.code ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminGiftCodes;