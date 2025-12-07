import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Loader2, UserPlus, Trash2, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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

interface AdminUser {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  is_current_user: boolean;
}

const AdminManageAdmins = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-admins?action=list');

      if (error) throw error;
      setAdmins(data?.admins || []);
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      toast({
        title: "Error",
        description: "Failed to load admins",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-admins?action=add', {
        body: { email: email.trim() },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: data?.message || "Admin added successfully",
      });
      setEmail("");
      fetchAdmins();
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add admin",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    setRemovingId(userId);
    try {
      const { data, error } = await supabase.functions.invoke('manage-admins?action=remove', {
        body: { user_id: userId },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Admin removed successfully",
      });
      fetchAdmins();
    } catch (error: any) {
      console.error('Error removing admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove admin",
        variant: "destructive",
      });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" style={{ color: '#000000' }} />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>Manage Admins</h1>
            <p style={{ color: '#666666' }}>Add or remove admin access for users</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Add Admin Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add New Admin
              </CardTitle>
              <CardDescription>
                Grant admin access to a user by their email
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
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAdmin()}
                />
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
                    Add Admin
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Current Admins Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Current Admins
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {admins.length} total
                </span>
              </CardTitle>
              <CardDescription>
                Users with admin access to the system
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
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {admins.map((admin) => (
                    <div
                      key={admin.user_id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{admin.email}</p>
                        {admin.full_name && (
                          <p className="text-sm text-muted-foreground truncate">{admin.full_name}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Added {new Date(admin.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {admin.is_current_user ? (
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                          You
                        </span>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={removingId === admin.user_id}
                            >
                              {removingId === admin.user_id ? (
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
                                This will remove admin privileges from <strong>{admin.email}</strong>. 
                                They will no longer have access to the admin dashboard.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveAdmin(admin.user_id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove Admin
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </AdminLayout>
  );
};
};

export default AdminManageAdmins;
