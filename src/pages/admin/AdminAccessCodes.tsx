import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { Plus, RefreshCw, Copy, Trash2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AccessCode {
  id: string;
  code: string;
  tier_id: string;
  days: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
}

interface SubscriptionTier {
  id: string;
  name: string;
}

export default function AdminAccessCodes() {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [newCode, setNewCode] = useState({
    tierId: "",
    days: 30,
    maxUses: 1,
    notes: "",
  });

  useEffect(() => {
    fetchCodes();
    fetchTiers();
  }, []);

  async function fetchCodes() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("access_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCodes(data ?? []);
    } catch (error) {
      console.error("Error fetching codes:", error);
      toast.error("Failed to fetch access codes");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTiers() {
    try {
      const { data, error } = await supabase
        .from("subscription_tiers")
        .select("id, name")
        .order("display_order");

      if (error) throw error;
      setTiers(data ?? []);
    } catch (error) {
      console.error("Error fetching tiers:", error);
    }
  }

  function generateCodeString(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) result += "-";
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async function createCode() {
    if (!newCode.tierId) {
      toast.error("Please select a tier");
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const code = generateCodeString();

      const { error } = await supabase.from("access_codes").insert({
        code,
        tier_id: newCode.tierId,
        days: newCode.days,
        max_uses: newCode.maxUses,
        notes: newCode.notes || null,
        created_by: user.id,
      });

      if (error) throw error;

      toast.success("Access code created successfully");
      navigator.clipboard.writeText(code);
      toast.info("Code copied to clipboard");

      setCreateDialogOpen(false);
      setNewCode({ tierId: "", days: 30, maxUses: 1, notes: "" });
      fetchCodes();
    } catch (error) {
      console.error("Error creating code:", error);
      toast.error("Failed to create access code");
    } finally {
      setCreating(false);
    }
  }

  async function toggleCodeStatus(codeId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from("access_codes")
        .update({ is_active: !currentStatus })
        .eq("id", codeId);

      if (error) throw error;

      toast.success(`Code ${currentStatus ? "deactivated" : "activated"}`);
      fetchCodes();
    } catch (error) {
      console.error("Error toggling code status:", error);
      toast.error("Failed to update code status");
    }
  }

  async function deleteCode(codeId: string) {
    if (!confirm("Are you sure you want to delete this code?")) return;

    try {
      const { error } = await supabase.from("access_codes").delete().eq("id", codeId);

      if (error) throw error;

      toast.success("Code deleted successfully");
      fetchCodes();
    } catch (error) {
      console.error("Error deleting code:", error);
      toast.error("Failed to delete code");
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  }

  const filteredCodes = codes.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTierName = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    return tier?.name ?? tierId.slice(0, 8);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Access Codes</h1>
            <p className="text-muted-foreground">Generate and manage subscription access codes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchCodes}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Access Code</DialogTitle>
                  <DialogDescription>
                    Generate a new access code for subscription activation
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Subscription Tier</Label>
                    <Select
                      value={newCode.tierId}
                      onValueChange={(value) => setNewCode({ ...newCode, tierId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tier" />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (days)</Label>
                      <Input
                        type="number"
                        min={1}
                        value={newCode.days}
                        onChange={(e) =>
                          setNewCode({ ...newCode, days: parseInt(e.target.value) || 30 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Uses</Label>
                      <Input
                        type="number"
                        min={1}
                        value={newCode.maxUses}
                        onChange={(e) =>
                          setNewCode({ ...newCode, maxUses: parseInt(e.target.value) || 1 })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (optional)</Label>
                    <Textarea
                      placeholder="Internal notes about this code..."
                      value={newCode.notes}
                      onChange={(e) => setNewCode({ ...newCode, notes: e.target.value })}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createCode} disabled={creating}>
                    {creating ? "Creating..." : "Create Code"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Access Codes</CardTitle>
                <CardDescription>{filteredCodes.length} codes found</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No access codes found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCodes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="rounded bg-muted px-2 py-1 text-sm font-mono">
                              {code.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyCode(code.code)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getTierName(code.tier_id)}</Badge>
                        </TableCell>
                        <TableCell>{code.days} days</TableCell>
                        <TableCell>
                          {code.used_count} / {code.max_uses}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={code.is_active ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => toggleCodeStatus(code.id, code.is_active)}
                          >
                            {code.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(code.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteCode(code.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
