import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import {
  getUserDetail,
  addBonusDays,
  changeUserTier,
  generateCodeForUser,
  addUserNote,
} from "@/utils/adminUserUtils";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Plus, Gift, RefreshCw, Copy } from "lucide-react";

interface SubscriptionTier {
  id: string;
  name: string;
  name_vi: string;
}

const AdminUserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { isAdmin, loading: accessLoading } = useUserAccess();
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [bonusDays, setBonusDays] = useState("7");
  const [bonusReason, setBonusReason] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [tierDays, setTierDays] = useState("30");
  const [codeMaxUses, setCodeMaxUses] = useState("1");
  const [codeNotes, setCodeNotes] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (!accessLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, accessLoading, navigate]);

  useEffect(() => {
    if (isAdmin && userId) {
      fetchUserDetail();
      fetchTiers();
    }
  }, [isAdmin, userId]);

  const fetchUserDetail = async () => {
    if (!userId) return;
    setLoading(true);
    const result = await getUserDetail(userId);
    if (result.success) {
      setUserDetail(result.data);
    } else {
      toast({
        title: "Error fetching user details",
        description: result.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

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

  const handleAddBonusDays = async () => {
    if (!userId || !bonusDays || !bonusReason) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setActionLoading(true);
    const result = await addBonusDays(userId, parseInt(bonusDays), bonusReason);
    if (result.success) {
      toast({ title: "Bonus days added successfully!" });
      setBonusDays("7");
      setBonusReason("");
      fetchUserDetail();
    } else {
      toast({
        title: "Error adding bonus days",
        description: result.error,
        variant: "destructive",
      });
    }
    setActionLoading(false);
  };

  const handleChangeTier = async () => {
    if (!userId || !selectedTier || !tierDays) {
      toast({ title: "Please select a tier and specify days", variant: "destructive" });
      return;
    }

    setActionLoading(true);
    const result = await changeUserTier(userId, selectedTier, parseInt(tierDays));
    if (result.success) {
      toast({ title: "Tier changed successfully!" });
      setSelectedTier("");
      setTierDays("30");
      fetchUserDetail();
    } else {
      toast({
        title: "Error changing tier",
        description: result.error,
        variant: "destructive",
      });
    }
    setActionLoading(false);
  };

  const handleGenerateCode = async () => {
    if (!userId || !selectedTier) {
      toast({ title: "Please select a tier", variant: "destructive" });
      return;
    }

    setActionLoading(true);
    const result = await generateCodeForUser(
      userId,
      selectedTier,
      parseInt(tierDays),
      parseInt(codeMaxUses),
      codeNotes
    );
    if (result.success) {
      setGeneratedCode(result.code || "");
      toast({ title: "Code generated successfully!" });
      setCodeNotes("");
    } else {
      toast({
        title: "Error generating code",
        description: result.error,
        variant: "destructive",
      });
    }
    setActionLoading(false);
  };

  const handleAddNote = async () => {
    if (!userId || !newNote.trim()) {
      toast({ title: "Please enter a note", variant: "destructive" });
      return;
    }

    setActionLoading(true);
    const result = await addUserNote(userId, newNote);
    if (result.success) {
      toast({ title: "Note added successfully!" });
      setNewNote("");
      fetchUserDetail();
    } else {
      toast({
        title: "Error adding note",
        description: result.error,
        variant: "destructive",
      });
    }
    setActionLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  if (accessLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin || !userDetail) {
    return null;
  }

  const { profile, subscription, transactions, notes, topRooms } = userDetail;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/users")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{profile.full_name || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Username</Label>
                <p className="font-medium">{profile.username || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{profile.email || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{profile.phone || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Created</Label>
                <p className="font-medium">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {subscription ? (
                <>
                  <div>
                    <Label className="text-muted-foreground">Current Tier</Label>
                    <Badge className="ml-2">{subscription.subscription_tiers?.name}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge variant={subscription.status === "active" ? "default" : "secondary"} className="ml-2">
                      {subscription.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Expires</Label>
                    <p className="font-medium">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No active subscription</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="actions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="actions">Admin Actions</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="rooms">Top Rooms</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Bonus Days</CardTitle>
                <CardDescription>Extend the user's subscription period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Days to Add</Label>
                  <Input
                    type="number"
                    value={bonusDays}
                    onChange={(e) => setBonusDays(e.target.value)}
                    placeholder="7"
                  />
                </div>
                <div>
                  <Label>Reason</Label>
                  <Input
                    value={bonusReason}
                    onChange={(e) => setBonusReason(e.target.value)}
                    placeholder="e.g., Customer loyalty reward"
                  />
                </div>
                <Button onClick={handleAddBonusDays} disabled={actionLoading}>
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Gift className="w-4 h-4 mr-2" />
                  )}
                  Add Bonus Days
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Tier</CardTitle>
                <CardDescription>Update the user's subscription tier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Tier</Label>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map((tier) => (
                        <SelectItem key={tier.id} value={tier.id}>
                          {tier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duration (Days)</Label>
                  <Input
                    type="number"
                    value={tierDays}
                    onChange={(e) => setTierDays(e.target.value)}
                    placeholder="30"
                  />
                </div>
                <Button onClick={handleChangeTier} disabled={actionLoading}>
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Change Tier
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generate Access Code</CardTitle>
                <CardDescription>Create a code specifically for this user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tier</Label>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map((tier) => (
                        <SelectItem key={tier.id} value={tier.id}>
                          {tier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Days</Label>
                  <Input
                    type="number"
                    value={tierDays}
                    onChange={(e) => setTierDays(e.target.value)}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label>Max Uses</Label>
                  <Input
                    type="number"
                    value={codeMaxUses}
                    onChange={(e) => setCodeMaxUses(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={codeNotes}
                    onChange={(e) => setCodeNotes(e.target.value)}
                    placeholder="Optional notes"
                  />
                </div>
                <Button onClick={handleGenerateCode} disabled={actionLoading}>
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Generate Code
                </Button>

                {generatedCode && (
                  <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Generated Code:</p>
                          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{generatedCode}</p>
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

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions?.length === 0 ? (
                    <p className="text-muted-foreground">No transactions yet</p>
                  ) : (
                    transactions?.map((tx: any) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{tx.transaction_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString()} • {tx.payment_method}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${Number(tx.amount).toFixed(2)}</p>
                          <Badge>{tx.status}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topRooms?.length === 0 ? (
                    <p className="text-muted-foreground">No room activity yet</p>
                  ) : (
                    topRooms?.map((room: any, idx: number) => (
                      <div key={room.roomId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Room #{idx + 1}: {room.roomId}</p>
                          <p className="text-sm text-muted-foreground">
                            {room.messages} messages • {Math.round(room.timeSpent / 60)} minutes
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Add New Note</Label>
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note here..."
                  />
                  <Button onClick={handleAddNote} disabled={actionLoading}>
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add Note
                  </Button>
                </div>

                <div className="space-y-2 mt-6">
                  {notes?.length === 0 ? (
                    <p className="text-muted-foreground">No notes yet</p>
                  ) : (
                    notes?.map((note: any) => (
                      <div key={note.id} className="p-4 border rounded-lg">
                        <p className="whitespace-pre-wrap">{note.note}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          By {note.profiles?.full_name || note.profiles?.username || "Admin"} •{" "}
                          {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetail;
