import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Edit, Save, Eye } from "lucide-react";

const AdminSpecification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAdmin = roles?.some(r => r.role === "admin");

      if (!isAdmin) {
        toast({
          title: "Access denied",
          description: "Admin access required",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      await loadSpecification();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadSpecification = async () => {
    try {
      // Fetch the specification document from public folder
      const response = await fetch('/docs/MERCY_BLADE_ROOM_SPECIFICATION.md');
      if (!response.ok) {
        throw new Error('Failed to fetch specification');
      }
      const text = await response.text();
      setContent(text);
    } catch (error) {
      console.error("Error loading specification:", error);
      toast({
        title: "Error",
        description: "Failed to load specification document",
        variant: "destructive",
      });
    }
  };

  const downloadSpecification = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MERCY_BLADE_ROOM_SPECIFICATION.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded! 📥",
      description: "Specification document downloaded successfully",
    });
  };

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    setContent(editedContent);
    setIsEditing(false);
    
    // Also download the updated version automatically
    const blob = new Blob([editedContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MERCY_BLADE_ROOM_SPECIFICATION.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Saved! 💾",
      description: "Specification updated and downloaded. Replace the file in docs/ folder manually.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent("");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Loading...</p>
    </div>;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>Room Specification</h1>
            <p style={{ color: '#666666' }}>Documentation for room structure</p>
          </div>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={downloadSpecification}
                  className="gap-2"
                  style={{ 
                    background: 'var(--gradient-rainbow)',
                    color: 'white'
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="gap-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="gap-2"
                  style={{ 
                    background: 'var(--gradient-rainbow)',
                    color: 'white'
                  }}
                >
                  <Save className="h-4 w-4" />
                  Save & Download
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-primary/20">
          <CardContent className="p-8">
            {!isEditing ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-muted p-6 rounded-lg overflow-auto max-h-[calc(100vh-300px)]">
                  {content}
                </pre>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Edit className="h-4 w-4" />
                  <span>Editing mode - Make your changes below</span>
                </div>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="font-mono text-sm min-h-[calc(100vh-400px)] bg-muted"
                  placeholder="Edit specification content..."
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-6 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-foreground">📚 How to Use This Documentation</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• This is the <strong>single source of truth</strong> for all room, level, and feature designs</li>
            <li>• Before creating any new rooms or levels, <strong>copy the exact patterns</strong> from this document</li>
            <li>• Always use <strong>semantic tokens</strong> from index.css (no direct colors)</li>
            <li>• Use <strong>shared components</strong> like KidsRoomCard for consistency</li>
            <li>• Follow the <strong>bilingual text pattern</strong> (English first, then Vietnamese)</li>
            <li>• All Kids Levels MUST use the same grid layout (2-3-4-5-6 columns)</li>
            <li>• Click <strong>Edit</strong> to modify this document, then <strong>Save & Download</strong></li>
            <li>• After saving, manually replace the file in <code>docs/</code> and <code>public/docs/</code> folders</li>
          </ul>
      </div>
    </AdminLayout>
  );
};
};

export default AdminSpecification;
