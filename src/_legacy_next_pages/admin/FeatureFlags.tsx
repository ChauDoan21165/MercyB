import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save } from "lucide-react";

type FeatureFlag = {
  id: string;
  flag_key: string;
  description: string | null;
  is_enabled: boolean;
};

const FeatureFlags = () => {
  const { toast } = useToast();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchFlags = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("feature_flags")
      .select("*")
      .order("flag_key");

    if (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load feature flags",
        variant: "destructive",
      });
    } else {
      setFlags((data || []) as FeatureFlag[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleCreate = async () => {
    if (!newKey.trim()) return;

    setCreating(true);
    const { data, error } = await supabase
      .from("feature_flags")
      .insert({
        flag_key: newKey.trim(),
        description: newDescription.trim() || null,
        is_enabled: false,
      })
      .select("*")
      .single();

    setCreating(false);

    if (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setFlags((prev) => [...prev, data as FeatureFlag]);
    setNewKey("");
    setNewDescription("");
    toast({ title: "Flag created" });
  };

  const handleSave = async (flag: FeatureFlag) => {
    const { error } = await supabase
      .from("feature_flags")
      .update({
        is_enabled: flag.is_enabled,
        description: flag.description,
      })
      .eq("id", flag.id);

    if (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Flag updated" });
    }
  };

  const updateFlagLocal = (id: string, patch: Partial<FeatureFlag>) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f))
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-4xl px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Feature Flags</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Toggle experimental features safely without redeploying.
          </p>
        </div>

        {/* Create new flag */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4" /> Create New Flag
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              <Input
                placeholder="flag key (e.g. kids_new_layout)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              />
              <Textarea
                placeholder="Description (why does this flag exist?)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={creating || !newKey.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Flag
            </Button>
          </CardContent>
        </Card>

        {/* Existing flags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Existing Flags {loading ? "(loading...)" : `(${flags.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {flags.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">
                No feature flags yet.
              </p>
            )}

            {flags.map((flag) => (
              <div
                key={flag.id}
                className="border rounded-lg p-3 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{flag.flag_key}</p>
                    <p className="text-xs text-muted-foreground">
                      {flag.description || "No description"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {flag.is_enabled ? "On" : "Off"}
                    </span>
                    <Switch
                      checked={flag.is_enabled}
                      onCheckedChange={(checked) =>
                        updateFlagLocal(flag.id, { is_enabled: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => handleSave(flag)}
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default FeatureFlags;
