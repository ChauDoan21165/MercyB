import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";

const AdminSpecification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <ColorfulMercyBladeHeader subtitle="Room Specification Documentation" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
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
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-primary/20">
          <CardContent className="p-8">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-muted p-6 rounded-lg overflow-auto max-h-[calc(100vh-300px)]">
                {content}
              </pre>
            </div>
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
            <li>• Download this document for offline reference or to share with team members</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSpecification;
