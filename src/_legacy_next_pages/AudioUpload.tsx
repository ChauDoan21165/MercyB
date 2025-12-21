import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Play, Trash2, ArrowLeft, Music } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";

interface UploadedAudio {
  name: string;
  created_at: string;
  updated_at: string;
  metadata: any;
}

export default function AudioUpload() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadUploadedFiles();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to upload audio files");
      navigate("/auth");
      return;
    }
    setUser(user);
  };

  const loadUploadedFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("room-audio-uploads")
        .list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      setUploadedFiles(data || []);
    } catch (error: any) {
      console.error("Error loading files:", error);
      toast.error("Failed to load uploaded files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select a valid audio file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setAudioFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      toast.error("Please select an audio file");
      return;
    }

    if (!user) {
      toast.error("Please sign in to upload files");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create a unique filename with user ID prefix
      const fileExt = audioFile.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("room-audio-uploads")
        .upload(fileName, audioFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      toast.success("Audio file uploaded successfully!");
      setAudioFile(null);
      setUploadProgress(100);
      
      // Reset file input
      const fileInput = document.getElementById("audio-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Reload the list
      await loadUploadedFiles();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload audio file");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }

    try {
      const { error } = await supabase.storage
        .from("room-audio-uploads")
        .remove([fileName]);

      if (error) throw error;

      toast.success("File deleted successfully");
      await loadUploadedFiles();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  const handlePlayAudio = (fileName: string) => {
    if (playingAudio === fileName) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(fileName);
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from("room-audio-uploads")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Music className="h-8 w-8 text-primary" />
                Audio Upload
              </h1>
              <p className="text-muted-foreground">
                Upload missing audio files for rooms
              </p>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <Card className="p-6">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio-file">Select Audio File</Label>
              <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <p className="text-sm text-muted-foreground">
                Maximum file size: 10MB. Supported formats: MP3, WAV, OGG, M4A
              </p>
            </div>

            {audioFile && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Selected file:</p>
                <p className="text-sm text-muted-foreground">{audioFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  Size: {(audioFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!audioFile || uploading}
              className="w-full gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Audio"}
            </Button>
          </form>
        </Card>

        {/* Uploaded Files List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading files...</p>
            </div>
          ) : uploadedFiles.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <Card key={file.name} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded: {new Date(file.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlayAudio(file.name)}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        {playingAudio === file.name ? "Playing" : "Play"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(file.name)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {playingAudio === file.name && (
                    <div className="mt-4">
                      <AudioPlayer
                        audioPath={getPublicUrl(file.name)}
                        isPlaying={true}
                        onPlayPause={() => setPlayingAudio(null)}
                        onEnded={() => setPlayingAudio(null)}
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
