import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const AudioFileList = () => {
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        // Fetch all JSON files to extract audio references
        const jsonFiles = [
          "Abdominal_Pain.json",
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

        const allAudioFiles = new Set<string>();

        for (const file of jsonFiles) {
          try {
            const response = await fetch(`/data/${file}`);
            if (response.ok) {
              const data = await response.json();
              if (data.entries) {
                data.entries.forEach((entry: any) => {
                  if (entry.audio?.en) {
                    allAudioFiles.add(entry.audio.en);
                  }
                });
              }
            }
          } catch (err) {
            console.error(`Error loading ${file}:`, err);
          }
        }

        // Sort alphabetically
        const sortedFiles = Array.from(allAudioFiles).sort((a, b) => 
          a.toLowerCase().localeCompare(b.toLowerCase())
        );
        
        setAudioFiles(sortedFiles);
      } catch (error) {
        console.error("Error fetching audio files:", error);
        toast.error("Failed to load audio files");
      } finally {
        setLoading(false);
      }
    };

    fetchAudioFiles();
  }, []);

  const handleDeleteInstruction = (filename: string) => {
    toast.info(`To delete: ${filename}\n1. Go to your file manager\n2. Navigate to public/ folder\n3. Delete the file`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Loading audio files...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Audio Files (Alphabetically)</h1>
      <p className="text-muted-foreground mb-4">
        Total files referenced in JSON: {audioFiles.length}
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        These files should exist in the <code className="bg-secondary px-2 py-1 rounded">public/</code> folder.
        Look for duplicates (similar names with slight variations) and delete manually.
      </p>

      <div className="grid gap-2">
        {audioFiles.map((file, index) => (
          <Card key={index} className="p-4 flex items-center justify-between">
            <div className="flex-1">
              <code className="text-sm">{file}</code>
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
