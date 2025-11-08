import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileJson } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminRoomImport() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState("");
  const [importResults, setImportResults] = useState<string[]>([]);

  const importMutation = useMutation({
    mutationFn: async (jsonData: any) => {
      const results: string[] = [];
      
      // Handle single room object or array of rooms
      const rooms = Array.isArray(jsonData) ? jsonData : [jsonData];
      
      for (const room of rooms) {
        try {
          // Extract room data from JSON format
          const roomId = room.id || room.schema_id || room.name?.toLowerCase().replace(/\s+/g, '-');
          
          if (!roomId) {
            results.push(`❌ Skipped: Missing room ID`);
            continue;
          }

          // Transform entries to database format
          const entries = Array.isArray(room.entries) 
            ? room.entries.map((entry: any) => ({
                slug: entry.slug || entry.id,
                keywords_en: entry.keywords_en || [],
                keywords_vi: entry.keywords_vi || [],
                copy: {
                  en: entry.copy?.en || entry.essay?.en || entry.content?.en || '',
                  vi: entry.copy?.vi || entry.essay?.vi || entry.content?.vi || ''
                },
                tags: entry.tags || [],
                audio: entry.audio || entry.audio_en || ''
              }))
            : [];

          const roomData = {
            id: roomId,
            title_en: room.title?.en || room.name || roomId,
            title_vi: room.title?.vi || room.name_vi || '',
            tier: room.tier || room.meta?.tier || 'free',
            schema_id: room.schema_id || roomId,
            room_essay_en: room.description || room.room_essay_en || '',
            room_essay_vi: room.description_vi || room.room_essay_vi || '',
            keywords: room.keywords_en || room.keywords || [],
            entries: entries,
            crisis_footer_en: room.crisis_footer_en || '',
            crisis_footer_vi: room.crisis_footer_vi || '',
            safety_disclaimer_en: room.safety_disclaimer_en || '',
            safety_disclaimer_vi: room.safety_disclaimer_vi || ''
          };

          // Check if room exists
          const { data: existing } = await supabase
            .from('rooms')
            .select('id')
            .eq('id', roomId)
            .maybeSingle();

          if (existing) {
            // Update existing room
            const { error } = await supabase
              .from('rooms')
              .update(roomData)
              .eq('id', roomId);
            
            if (error) throw error;
            results.push(`✅ Updated: ${roomData.title_en} (${roomId})`);
          } else {
            // Insert new room
            const { error } = await supabase
              .from('rooms')
              .insert(roomData);
            
            if (error) throw error;
            results.push(`✅ Created: ${roomData.title_en} (${roomId})`);
          }
        } catch (error: any) {
          results.push(`❌ Failed: ${error.message}`);
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      setImportResults(results);
      toast({
        title: "Import Complete",
        description: `Processed ${results.length} room(s)`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImport = () => {
    try {
      const data = JSON.parse(jsonInput);
      importMutation.mutate(data);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON format",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/rooms")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Import Room Data</h1>
            <p className="text-muted-foreground mt-1">
              Import rooms from JSON files to the database
            </p>
          </div>
        </div>

        <Alert className="mb-6">
          <FileJson className="h-4 w-4" />
          <AlertDescription>
            Paste your room JSON data below. You can import a single room object or an array of rooms.
            The import will automatically create new rooms or update existing ones.
          </AlertDescription>
        </Alert>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                JSON Data
              </label>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste your JSON here, e.g.: {"id": "room-id", "title": {"en": "Room Title", "vi": "Tiêu đề"}, ...}'
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            <Button
              onClick={handleImport}
              disabled={!jsonInput || importMutation.isPending}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importMutation.isPending ? "Importing..." : "Import to Database"}
            </Button>
          </div>
        </Card>

        {importResults.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Import Results</h3>
            <div className="space-y-2">
              {importResults.map((result, index) => (
                <div
                  key={index}
                  className={`text-sm ${
                    result.startsWith("✅") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
            <Button
              onClick={() => navigate("/admin/rooms")}
              className="mt-4"
              variant="outline"
            >
              View All Rooms
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
