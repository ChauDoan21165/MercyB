import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, ShieldOff, LayoutDashboard } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserAccess";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  email: string;
  username: string;
  full_name: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function AdminUserRoles() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin, loading: accessLoading } = useUserAccess();
  const [searchEmail, setSearchEmail] = useState("");

  // Fetch all profiles
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("email");
      
      if (error) throw error;
      return data as Profile[];
    },
    enabled: isAdmin,
  });

  // Fetch all user roles
  const { data: userRoles } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*");
      
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: isAdmin,
  });

  // Mutation to grant admin role
  const grantAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast({
        title: "Success",
        description: "Admin role granted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to revoke admin role
  const revokeAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast({
        title: "Success",
        description: "Admin role revoked successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isUserAdmin = (userId: string) => {
    return userRoles?.some(role => role.user_id === userId && role.role === "admin");
  };

  const filteredProfiles = profiles?.filter(profile => 
    !searchEmail || profile.email?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (accessLoading || profilesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You need admin privileges to access this page.
          </p>
          <Button onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">User Role Management</h1>
          </div>
          <Button
            onClick={() => navigate("/admin/rooms")}
            variant="outline"
            className="gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Room Management
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Grant or revoke admin roles to users from this page</p>
            <p>• Admin users have access to admin-only features like room management</p>
            <p>• Search for users by email to find specific accounts</p>
            <p>• Be careful when revoking admin access - ensure at least one admin remains</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <Input
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="space-y-4">
            {filteredProfiles?.map((profile) => {
              const hasAdminRole = isUserAdmin(profile.id);
              
              return (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{profile.username || profile.email}</p>
                      {hasAdminRole && (
                        <Badge variant="default">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                  
                  <div>
                    {hasAdminRole ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => revokeAdminMutation.mutate(profile.id)}
                        disabled={revokeAdminMutation.isPending}
                      >
                        <ShieldOff className="w-4 h-4 mr-2" />
                        Revoke Admin
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => grantAdminMutation.mutate(profile.id)}
                        disabled={grantAdminMutation.isPending}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Grant Admin
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
