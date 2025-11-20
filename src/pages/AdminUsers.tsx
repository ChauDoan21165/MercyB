import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { getAllUsersWithDetails } from "@/utils/adminUserUtils";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface UserWithDetails {
  id: string;
  username: string | null;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  tier: string;
  totalPaid: number;
  lastActive: string;
  created_at: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: accessLoading } = useUserAccess();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!accessLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, accessLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.email?.toLowerCase().includes(term) ||
            u.username?.toLowerCase().includes(term) ||
            u.full_name?.toLowerCase().includes(term) ||
            u.phone?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAllUsersWithDetails();
    if (result.success) {
      setUsers(result.data || []);
      setFilteredUsers(result.data || []);
    } else {
      toast({
        title: "Error fetching users",
        description: result.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTierBadgeVariant = (tier: string): "default" | "secondary" | "outline" => {
    if (tier.includes("VIP")) return "default";
    return "secondary";
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

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button onClick={fetchUsers} variant="outline">
            Refresh
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, username, name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {user.full_name || user.username || "Unnamed"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.username || "No username"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>{user.phone || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={getTierBadgeVariant(user.tier)}>
                        {user.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>${user.totalPaid.toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.lastActive)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
