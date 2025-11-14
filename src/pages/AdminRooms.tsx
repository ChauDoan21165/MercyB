import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, ArrowLeft, Users, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useUserAccess } from "@/hooks/useUserAccess";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

interface Room {
  id: string;
  title_en: string;
  title_vi: string;
  tier: string;
  schema_id: string;
  entries: any;
  keywords: string[];
  room_essay_en?: string;
  room_essay_vi?: string;
}

export default function AdminRooms() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin, loading: accessLoading } = useUserAccess();

  // Fetch all rooms
  const { data: rooms, isLoading } = useQuery({
    queryKey: ["admin-rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("title_en");
      
      if (error) throw error;
      return data as Room[];
    },
  });

  // Delete room mutation
  const deleteMutation = useMutation({
    mutationFn: async (roomId: string) => {
      const { error } = await supabase
        .from("rooms")
        .delete()
        .eq("id", roomId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rooms"] });
      toast({
        title: "Success",
        description: "Room deleted successfully",
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

  const filteredRooms = rooms?.filter(room =>
    room.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.title_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "bg-green-500";
      case "vip1": return "bg-blue-500";
      case "vip2": return "bg-purple-500";
      case "vip3": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  if (accessLoading) {
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
      <div className="max-w-7xl mx-auto">
        <AdminBreadcrumb items={[{ label: "Room Management" }]} />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Room Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage all room content and entries
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/admin/users")}
              variant="outline"
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              User Roles
            </Button>
            <Button
              onClick={() => navigate("/admin/rooms/import")}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Import JSON
            </Button>
            <Button
              onClick={() => navigate("/admin/rooms/health")}
              variant="outline"
              className="gap-2"
            >
              <Activity className="h-4 w-4" />
              Health Check
            </Button>
            <Button
              onClick={() => navigate("/admin/rooms/new")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Room
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search rooms by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading rooms...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms?.map((room) => (
              <Card key={room.id} className="p-6 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Badge className={`${getTierColor(room.tier)} mb-2`}>
                      {room.tier.toUpperCase()}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-1">{room.title_en}</h3>
                    <p className="text-sm text-muted-foreground">{room.title_vi}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ID: {room.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{Array.isArray(room.entries) ? room.entries.length : 0} entries</span>
                  <span>{room.keywords?.length || 0} keywords</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Delete room "${room.title_en}"?`)) {
                        deleteMutation.mutate(room.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredRooms?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "No rooms found matching your search" : "No rooms yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
