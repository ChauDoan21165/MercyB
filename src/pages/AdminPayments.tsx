import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Copy, CheckCircle2, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";

interface SubscriptionTier {
  id: string;
  name: string;
  name_vi: string;
  price_monthly: number;
  price_yearly: number;
}

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  transaction_type: string;
  period_days: number;
  status: string;
  created_at: string;
  profiles?: { username: string; email: string };
  subscription_tiers?: { name: string };
}

interface AccessCode {
  id: string;
  code: string;
  days: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  subscription_tiers?: { name: string };
  notes: string | null;
}

const AdminPayments = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: accessLoading } = useUserAccess();
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Code Generation State
  const [selectedTier, setSelectedTier] = useState("");
  const [days, setDays] = useState("30");
  const [maxUses, setMaxUses] = useState("1");
  const [notes, setNotes] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  
  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Access Codes State
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);

  useEffect(() => {
    if (!accessLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, accessLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchTiers();
      fetchTransactions();
      fetchAccessCodes();
    }
  }, [isAdmin]);

  const fetchTiers = async () => {
    const { data, error } = await supabase
      .from("subscription_tiers")
      .select("*")
      .order("display_order");
    
    if (error) {
      toast({ title: "Error fetching tiers", variant: "destructive" });
      return;
    }
    setTiers(data || []);
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("payment_transactions")
      .select(`
        *,
        profiles:user_id (username, email),
        subscription_tiers (name)
      `)
      .order("created_at", { ascending: false })
      .limit(100);
    
    if (error) {
      console.error("Error fetching transactions:", error);
      return;
    }
    setTransactions(data || []);
  };

  const fetchAccessCodes = async () => {
    const { data, error } = await supabase
      .from("access_codes")
      .select(`
        *,
        subscription_tiers (name)
      `)
      .order("created_at", { ascending: false })
      .limit(50);
    
    if (error) {
      console.error("Error fetching access codes:", error);
      return;
    }
    setAccessCodes(data || []);
  };

  const generateCode = (tierName: string, days: number) => {
    const tierShort = tierName.replace("VIP", "").replace(" ", "").toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MB-${tierShort}-${days}-${random}`;
  };

  const handleGenerateCode = async () => {
    if (!selectedTier || !days) {
      toast({ title: "Please select tier and days", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const tier = tiers.find(t => t.id === selectedTier);
      if (!tier) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const code = generateCode(tier.name, parseInt(days));
      
      const { error } = await supabase
        .from("access_codes")
        .insert({
          code,
          tier_id: selectedTier,
          days: parseInt(days),
          max_uses: parseInt(maxUses),
          created_by: user.id,
          notes: notes || null
        });

      if (error) throw error;

      setGeneratedCode(code);
      toast({ title: "Access code generated successfully!" });
      fetchAccessCodes();
      
      // Reset form
      setSelectedTier("");
      setDays("30");
      setMaxUses("1");
      setNotes("");
    } catch (error: any) {
      toast({ 
        title: "Error generating code", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const filteredTransactions = transactions.filter(t => 
    searchTerm === "" || 
    t.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ColorfulMercyBladeHeader />
        
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-6">Payment Management</h1>
          
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Generate Codes</TabsTrigger>
              <TabsTrigger value="codes">Access Codes</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Access Code</CardTitle>
                  <CardDescription>
                    Create access codes in MB-TIER-DAYS-RAND format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tier">Subscription Tier</Label>
                    <Select value={selectedTier} onValueChange={setSelectedTier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiers.map(tier => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.name} - ${tier.price_monthly}/mo
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="days">Days</Label>
                    <Input
                      id="days"
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxUses">Max Uses</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Internal notes about this code"
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateCode} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 w-4 h-4" />
                        Generate Code
                      </>
                    )}
                  </Button>

                  {generatedCode && (
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Generated Code:</p>
                            <p className="text-2xl font-bold text-green-700">{generatedCode}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generatedCode)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="codes">
              <Card>
                <CardHeader>
                  <CardTitle>Access Codes</CardTitle>
                  <CardDescription>
                    Recently generated access codes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accessCodes.map((code) => (
                      <div
                        key={code.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <code className="font-mono font-bold text-lg">{code.code}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(code.code)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{code.subscription_tiers?.name}</Badge>
                            <span>{code.days} days</span>
                            <span>•</span>
                            <span>{code.used_count}/{code.max_uses} used</span>
                            {code.notes && (
                              <>
                                <span>•</span>
                                <span>{code.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {code.is_active ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Recent payment transactions
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-4">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by email or username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">
                            {tx.profiles?.username || tx.profiles?.email || "Unknown User"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{tx.subscription_tiers?.name}</Badge>
                            <Badge>{tx.payment_method}</Badge>
                            <span>{tx.period_days} days</span>
                            <span>•</span>
                            <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${tx.amount}</p>
                          <Badge
                            variant={tx.status === "completed" ? "default" : "secondary"}
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
