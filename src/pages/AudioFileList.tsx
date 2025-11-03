import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileJson, Music } from "lucide-react";
import { toast } from "sonner";

interface FileItem {
  name: string;
  type: "json" | "mp3";
}

interface JsonWithoutAudio {
  name: string;
  entryCount: number;
}

const AudioFileList = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [jsonWithoutAudio, setJsonWithoutAudio] = useState<JsonWithoutAudio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // List of JSON files (duplicates cleaned)
        const jsonFiles = [
          "Abdominal_Pain.json",
          "Addiction_Support_vip1.json",
          "Anxiety_Relief_Free.json",
          "God_With_Us.json",
          "God_With_Us_VIP1.json",
          "God_With_Us_VIP3.json",
          "Keep_Soul_Calm_VIP3.json",
          "Mental_Sharpness_VIP3.json",
          "Overcome_Storm_VIP3.json",
          "Women_Health.json",
          "confidence_vip1.json",
          "confidence_vip2.json",
          "confidence_vip3.json",
          "nutrition_vip1.json",
          "nutrition_vip2.json",
          "nutrition_vip3.json",
        ];

        const allFiles: FileItem[] = [];
        const allAudioFiles = new Set<string>();
        const jsonNoAudio: JsonWithoutAudio[] = [];

        // Add JSON files
        jsonFiles.forEach(file => {
          allFiles.push({ name: file, type: "json" });
        });

        // Extract MP3 references from JSON files
        for (const file of jsonFiles) {
          try {
            const response = await fetch(`/data/${file}`);
            if (response.ok) {
              const data = await response.json();
              let hasAudio = false;
              let entryCount = 0;
              
              if (data.entries) {
                entryCount = data.entries.length;
                data.entries.forEach((entry: any) => {
                  if (entry.audio?.en) {
                    allAudioFiles.add(entry.audio.en);
                    hasAudio = true;
                  }
                });
              }
              
              if (!hasAudio && entryCount > 0) {
                jsonNoAudio.push({ name: file, entryCount });
              }
            }
          } catch (err) {
            console.error(`Error loading ${file}:`, err);
          }
        }
        
        setJsonWithoutAudio(jsonNoAudio);

        // Add MP3 files
        Array.from(allAudioFiles).forEach(mp3 => {
          allFiles.push({ name: mp3, type: "mp3" });
        });

        // Sort alphabetically
        const sortedFiles = allFiles.sort((a, b) => 
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        
        setFiles(sortedFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
        toast.error("Failed to load files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDeleteInstruction = (file: FileItem) => {
    const folder = file.type === "json" ? "supabase/functions/ai-chat/data/" : "public/";
    toast.info(`To delete: ${file.name}\n1. Go to your file manager\n2. Navigate to ${folder}\n3. Delete the file`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Loading audio files...</h1>
      </div>
    );
  }

  const jsonFiles = files.filter(f => f.type === "json");
  const mp3Files = files.filter(f => f.type === "mp3");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All JSON & Audio Files (Alphabetically)</h1>
      
      {jsonWithoutAudio.length > 0 && (
        <Card className="p-4 mb-6 border-yellow-500 bg-yellow-50">
          <h2 className="font-semibold text-lg mb-3 text-yellow-800">⚠️ JSON Files Without Audio ({jsonWithoutAudio.length})</h2>
          <div className="space-y-2">
            {jsonWithoutAudio.map((item, index) => (
              <div key={index} className="text-sm">
                <code className="text-yellow-900">{item.name}</code>
                <span className="text-yellow-700 ml-2">({item.entryCount} entries)</span>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileJson className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">JSON Files</h2>
          </div>
          <p className="text-2xl font-bold">{jsonFiles.length}</p>
          <p className="text-xs text-muted-foreground">in supabase/functions/ai-chat/data/</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Music className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">MP3 Files</h2>
          </div>
          <p className="text-2xl font-bold">{mp3Files.length}</p>
          <p className="text-xs text-muted-foreground">referenced in JSON (should be in public/)</p>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Look for duplicates (similar names with slight variations) and delete manually from their respective folders.
      </p>

      <div className="grid gap-2">
        {files.map((file, index) => (
          <Card key={index} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {file.type === "json" ? (
                <FileJson className="h-4 w-4 text-blue-500" />
              ) : (
                <Music className="h-4 w-4 text-green-500" />
              )}
              <code className="text-sm">{file.name}</code>
              <span className="text-xs text-muted-foreground">
                ({file.type === "json" ? "data/" : "public/"})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteInstruction(file)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Instructions
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AudioFileList;
