import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Loader2, UserPlus, Trash2, Users, Edit2, Crown } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminLevel } from "@/hooks/useAdminLevel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  level: number;
  created_at: string;
  is_current_user: boolean;
  can_manage: boolean;
}

const AdminManageAdmins = () => {
  const [email, setEmail] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("1");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [newLevel, setNewLevel] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const { adminInfo, permissions, isAdminMaster, getLevelLabel, loading: adminLoading } = useAdminLevel();
  const myLevel = adminInfo?.level || 0;

  useEffect(() => {
    if (!adminLoading) {
      fetchAdmins();
    }
  }, [adminLoading]);

  const getAuthToken = async (): Promise<string | null> => {
    const { data } = await supabase.auth.refreshSession();
    return data.session?.access_token || null;
  };

  const fetchAdmins = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        toast({ title: "Error", description: "Not authenticated", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.functions.invoke('admin-management', {
        body: { action: "list" },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.ok) {
        toast({ title: "Error", description: data?.error || "Failed to load admins", variant: "destructive" });
        setAdmins([]);
        return;
      }

      setAdmins(data.admins || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({ title: "Error", description: "Failed to load admins", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!email.trim()) {
      toast({ title: "Error", description: "Please enter an email address", variant: "destructive" });
      return;
    }

    setIsAdding(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        toast({ title: "Error", description: "Not authenticated", variant: "destructive" });
        return;
      }

      const { data } = await supabase.functions.invoke('admin-management', {
        body: { action: "create", email: email.trim(), level: parseInt(selectedLevel) },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.ok) {
        toast({ title: "Error", description: data?.error || "Failed to add admin", variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: data.message || `Admin added at level ${selectedLevel}` });
      setEmail("");
      setSelectedLevel("1");
      fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({ title: "Error", description: "Failed to add admin", variant: "destructive" });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    setRemovingId(adminId);
    try {
      const token = await getAuthToken();
      if (!token) {
        toast({ title: "Error", description: "Not authenticated", variant: "destructive" });
        return;
      }

      const { data } = await supabase.functions.invoke('admin-management', {
        body: { action: "delete", admin_id: adminId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.ok) {
        toast({ title: "Error", description: data?.error || "Failed to remove admin", variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: data.message || "Admin removed" });
      fetchAdmins();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({ title: "Error", description: "Failed to remove admin", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateLevel = async () => {
    if (!editingAdmin || !newLevel) return;

    setIsUpdating(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        toast({ title: "Error", description: "Not authenticated", variant: "destructive" });
        return;
      }

      const { data } = await supabase.functions.invoke('admin-management', {
        body: { action: "update_level", admin_id: editingAdmin.id, new_level: parseInt(newLevel) },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.ok) {
        toast({ title: "Error", description: data?.error || "Failed to update level", variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: data.message || "Level updated" });
      setEditingAdmin(null);
      setNewLevel("");
      fetchAdmins();
    } catch (error) {
      console.error('Error updating level:', error);
      toast({ title: "Error", description: "Failed to update level", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  // Get available levels for creating admins
  const getCreatableLevels = () => {
    const levels = [];
    const maxLevel = isAdminMaster ? 9 : myLevel - 1;
    for (let i = 1; i <= maxLevel; i++) {
      levels.push(i);
    }
    return levels;
  };

  // Get available levels for editing an admin
  const getEditableLevels = (currentLevel: number) => {
    const levels = [];
    const maxLevel = isAdminMaster ? 9 : myLevel - 1;
    for (let i = 1; i <= maxLevel; i++) {
      if (i !== currentLevel) {
        levels.push(i);
      }
    }
    return levels;
  };

  const canCreateAdmins = myLevel >= 9;

  if (adminLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" style={{ color: '#000000' }} />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>Manage Admins</h1>
            <p style={{ color: '#666666' }}>
              You are {getLevelLabel(myLevel)} • Can manage levels 1–{myLevel - 1}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Add Admin Card - Only for level 9+ */}
          {canCreateAdmins && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Add New Admin
                </CardTitle>
                <CardDescription>
                  Grant admin access to a registered user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">User Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Admin Level</Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCreatableLevels().map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          Level {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddAdmin}
                  disabled={isAdding || !email.trim()}
                  className="w-full"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Admin at Level {selectedLevel}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Current Admins Card */}
          <Card className={canCreateAdmins ? "" : "md:col-span-2"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Current Admins
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {admins.length} visible
                </span>
              </CardTitle>
              <CardDescription>
                Admins you can view and manage based on your level
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : admins.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No admins found</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{admin.email}</p>
                          {admin.level === 10 && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-secondary">
                            {getLevelLabel(admin.level)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Added {new Date(admin.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {admin.is_current_user ? (
                          <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                            You
                          </span>
                        ) : admin.can_manage ? (
                          <>
                            {/* Edit Level Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingAdmin(admin);
                                setNewLevel(admin.level.toString());
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>

                            {/* Delete Button */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  disabled={removingId === admin.id}
                                >
                                  {removingId === admin.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Admin Access?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will remove admin privileges from <strong>{admin.email}</strong> (Level {admin.level}).
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveAdmin(admin.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Remove Admin
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">No actions</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Level Dialog */}
        <Dialog open={!!editingAdmin} onOpenChange={(open) => !open && setEditingAdmin(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Admin Level</DialogTitle>
              <DialogDescription>
                Update the admin level for <strong>{editingAdmin?.email}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Level</Label>
                <p className="text-sm font-medium">{editingAdmin && getLevelLabel(editingAdmin.level)}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-level">New Level</Label>
                <Select value={newLevel} onValueChange={setNewLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new level" />
                  </SelectTrigger>
                  <SelectContent>
                    {editingAdmin && getEditableLevels(editingAdmin.level).map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        Level {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingAdmin(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateLevel} disabled={isUpdating || !newLevel || newLevel === editingAdmin?.level.toString()}>
                {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update Level
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminManageAdmins;
