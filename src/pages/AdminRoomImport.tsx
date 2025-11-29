import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileJson, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";

export default function AdminRoomImport() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [jsonInput, setJsonInput] = useState("");
  const [importResults, setImportResults] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [registryWarnings, setRegistryWarnings] = useState<string[]>([]);

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
            room_essay_en: room.content?.en || room.description || room.room_essay_en || '',
            room_essay_vi: room.content?.vi || room.description_vi || room.room_essay_vi || '',
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
      queryClient.invalidateQueries({ queryKey: ["rooms-cache"] });
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

  const validateRoomData = (data: any) => {
    const warnings: string[] = [];
    const rooms = Array.isArray(data) ? data : [data];
    
    rooms.forEach((room: any) => {
      const roomId = room.id || room.schema_id || room.name?.toLowerCase().replace(/\s+/g, '-');
      const schemaId = room.schema_id;
      const id = room.id;
      
      if (!roomId) {
        warnings.push(`⚠️ Room missing ID: Cannot determine room identifier`);
      } else {
        // Check for ID mismatch
        if (id && schemaId && id !== schemaId) {
          warnings.push(`⚠️ ID mismatch in "${room.title?.en || roomId}": id="${id}" but schema_id="${schemaId}". Will use: "${roomId}"`);
        }
        
        // Check if filename convention matches
        const titleSlug = room.title?.en?.toLowerCase().replace(/\s+/g, '-');
        if (titleSlug && roomId !== titleSlug && !roomId.includes(titleSlug)) {
          warnings.push(`ℹ️ Room "${room.title?.en}": ID is "${roomId}" which may not match expected filename pattern`);
        }
      }
    });
    
    return warnings;
  };

  const checkRegistryStatus = (data: any) => {
    const warnings: string[] = [];
    const rooms = Array.isArray(data) ? data : [data];
    const manifestRoomIds = Object.keys(PUBLIC_ROOM_MANIFEST);
    
    rooms.forEach((room: any) => {
      const roomId = room.id || room.schema_id || room.name?.toLowerCase().replace(/\s+/g, '-');
      if (roomId && !manifestRoomIds.includes(roomId)) {
        const title = room.title?.en || room.name || roomId;
        const tier = room.tier || room.meta?.tier || 'free';
        warnings.push(
          `📦 "${title}" (${roomId}, tier: ${tier}) is not in the frontend registry yet. ` +
          `It will be imported to the database but won't appear in the app until added to the registry.`
        );
      }
    });
    
    return warnings;
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(jsonInput);
      const warnings = validateRoomData(data);
      const registryIssues = checkRegistryStatus(data);
      
      setValidationWarnings(warnings);
      setRegistryWarnings(registryIssues);
      
      if (warnings.length > 0) {
        toast({
          title: "Validation Warnings",
          description: `Found ${warnings.length} potential issue(s). Check below before importing.`,
        });
      }
      
      if (registryIssues.length > 0) {
        toast({
          title: "Registry Check",
          description: `${registryIssues.length} room(s) not found in frontend registry`,
        });
      }
      
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

        {validationWarnings.length > 0 && (
          <Card className="p-6 mb-6 border-yellow-500">
            <h3 className="font-semibold mb-4 text-yellow-600">Validation Warnings</h3>
            <div className="space-y-2">
              {validationWarnings.map((warning, index) => (
                <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                  {warning}
                </div>
              ))}
            </div>
          </Card>
        )}

        {registryWarnings.length > 0 && (
          <Card className="p-6 mb-6 border-orange-500">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-3 text-orange-600 dark:text-orange-400">
                  Registry Status Check
                </h3>
                <div className="space-y-3">
                  {registryWarnings.map((warning, i) => (
                    <div key={i} className="text-sm text-orange-700 dark:text-orange-300">
                      {warning}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                  <div className="font-medium mb-1">To add missing rooms to the registry:</div>
                  <code className="bg-background px-2 py-1 rounded">npm run registry:generate</code>
                  <div className="text-muted-foreground mt-2 text-xs">
                    This will scan public/data and update roomManifest.ts with all JSON files
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

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
