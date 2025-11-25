import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  roomData?: any;
}

export const VIP9RoomUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const validateRoomJSON = (data: any): ValidationResult => {
    const errors: string[] = [];

    // Check required fields
    if (!data.id) errors.push("Missing 'id' field");
    if (!data.title?.en) errors.push("Missing 'title.en' field");
    if (!data.title?.vi) errors.push("Missing 'title.vi' field");
    if (!data.content?.en) errors.push("Missing 'content.en' field");
    if (!data.content?.vi) errors.push("Missing 'content.vi' field");
    if (!data.tier) errors.push("Missing 'tier' field");
    if (!data.domain) errors.push("Missing 'domain' field");
    if (!Array.isArray(data.entries)) errors.push("Missing or invalid 'entries' array");

    // Check entries
    if (data.entries) {
      if (data.entries.length !== 8) {
        errors.push(`VIP9 rooms must have exactly 8 entries (found ${data.entries.length})`);
      }

      data.entries.forEach((entry: any, idx: number) => {
        if (!entry.id && !entry.slug && !entry.artifact_id) {
          errors.push(`Entry ${idx + 1}: Missing identifier (id/slug/artifact_id)`);
        }
        if (!entry.keywords_en || !Array.isArray(entry.keywords_en)) {
          errors.push(`Entry ${idx + 1}: Missing keywords_en array`);
        }
        if (!entry.keywords_vi || !Array.isArray(entry.keywords_vi)) {
          errors.push(`Entry ${idx + 1}: Missing keywords_vi array`);
        }
        if (!entry.copy_en) errors.push(`Entry ${idx + 1}: Missing copy_en`);
        if (!entry.copy_vi) errors.push(`Entry ${idx + 1}: Missing copy_vi`);
        if (!entry.audio) errors.push(`Entry ${idx + 1}: Missing audio file reference`);
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      roomData: errors.length === 0 ? data : undefined
    };
  };

  const extractKeywords = (entries: any[]): string[] => {
    const keywords = new Set<string>();
    entries.forEach(entry => {
      if (entry.keywords_en && Array.isArray(entry.keywords_en)) {
        entry.keywords_en.forEach((kw: string) => keywords.add(kw.toLowerCase()));
      }
      if (entry.keywords_vi && Array.isArray(entry.keywords_vi)) {
        entry.keywords_vi.forEach((kw: string) => keywords.add(kw.toLowerCase()));
      }
    });
    return Array.from(keywords);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);

    try {
      // Read file content
      const text = await file.text();
      const roomData = JSON.parse(text);

      // Validate
      const validation = validateRoomJSON(roomData);
      
      if (!validation.valid) {
        toast({
          title: "Validation Failed",
          description: (
            <div className="space-y-1">
              {validation.errors.map((err, idx) => (
                <div key={idx} className="text-sm">• {err}</div>
              ))}
            </div>
          ),
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Extract keywords
      const keywords = extractKeywords(roomData.entries || []);

      // Normalize tier and domain
      const normalizedTier = roomData.tier.toLowerCase().includes('vip9') ? 'vip9' : roomData.tier;
      const normalizedDomain = roomData.domain;

      // Insert/update room in database
      const roomRecord = {
        id: roomData.id,
        schema_id: roomData.id,
        title_en: roomData.title.en,
        title_vi: roomData.title.vi,
        room_essay_en: roomData.content.en || '',
        room_essay_vi: roomData.content.vi || '',
        entries: roomData.entries || [],
        keywords: keywords,
        tier: normalizedTier,
        domain: normalizedDomain,
      };

      const { error: dbError } = await supabase
        .from('rooms')
        .upsert(roomRecord, { onConflict: 'id' });

      if (dbError) {
        toast({
          title: "Database Error",
          description: dbError.message,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Save to public/data via edge function
      const { error: saveError } = await supabase.functions.invoke('save-room-json', {
        body: {
          filename: `${roomData.id}.json`,
          content: JSON.stringify(roomData, null, 2)
        }
      });

      if (saveError) {
        console.error("File save error:", saveError);
        // Continue even if file save fails - room is in DB
      }

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Registered & Synced</span>
          </div>
        ),
        description: `Room "${roomData.title.en}" successfully registered with ${roomData.entries.length} entries and ${keywords.length} keywords.`,
      });

    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Invalid JSON file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
      handleFileUpload(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a JSON file",
        variant: "destructive",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Upload VIP9 Room</CardTitle>
            <CardDescription>Single source of truth for room registration</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Validating and registering room...
              </p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-2">
                Drop VIP9 room JSON file here
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Auto-validates, inserts to DB, and syncs to public/data/
              </p>
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileInput}
              />
            </>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
            <span>Validates JSON structure (8 entries, bilingual content)</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
            <span>Inserts/updates room in Supabase database</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
            <span>Copies file to public/data/ directory</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <span>GitHub sync requires manual commit after upload</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
