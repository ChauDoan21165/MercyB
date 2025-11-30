import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Search, Shield, Gift, Crown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type SupportUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
};

const UserSupportConsole = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SupportUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [selectedUser, setSelectedUser] = useState<SupportUser | null>(null);

  const searchUsers = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      setResults((data || []) as SupportUser[]);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Search error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const grantTier = async (tierId: string) => {
    if (!selectedUser) return;
    try {
      // Create or update subscription
      const { error } = await supabase
        .from("user_subscriptions")
        .upsert({
          user_id: selectedUser.id,
          tier_id: tierId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (error) throw error;
      toast({
        title: "Tier updated",
        description: `${selectedUser.email} granted tier access`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Tier update error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const addNote = async () => {
    if (!selectedUser || !note.trim()) return;

    try {
      const {
        data: { user: admin },
      } = await supabase.auth.getUser();

      if (!admin) {
        toast({
          title: "Not signed in",
          description: "You must be logged in as admin to add notes.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("user_notes").insert({
        user_id: selectedUser.id,
        admin_id: admin.id,
        note: note.trim(),
      });

      if (error) throw error;

      setNote("");
      toast({ title: "Note added" });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Note error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">User Support Console</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Search users, view tiers, and apply manual fixes for support.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search User
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-3 items-start">
            <Input
              placeholder="Email or name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="md:w-80"
            />
            <Button
              size="sm"
              onClick={searchUsers}
              disabled={loading || !query.trim()}
            >
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Results ({results.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {results.map((u) => (
                <div
                  key={u.id}
                  className={`border rounded-md p-2 flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/50 ${
                    selectedUser?.id === u.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedUser(u)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {u.full_name || "(no name)"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Joined: {new Date(u.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {selectedUser && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Actions for {selectedUser.email}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => grantTier("free")}
                >
                  Set Free
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => grantTier("vip1")}
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Grant VIP1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => grantTier("vip2")}
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Grant VIP2
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => grantTier("vip3")}
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Grant VIP3
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Internal note (support history, cases, etc.)
                </p>
                <Textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write a short note..."
                />
                <Button size="sm" onClick={addNote} disabled={!note.trim()}>
                  <Gift className="h-4 w-4 mr-1" />
                  Save Note
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserSupportConsole;
