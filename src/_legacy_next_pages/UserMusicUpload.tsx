import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Music, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserMusicUpload {
  id: string;
  title: string;
  artist: string | null;
  file_url: string;
  upload_status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
}

export default function UserMusicUpload() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [myUploads, setMyUploads] = useState<UserMusicUpload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadMyUploads();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to upload music");
      navigate("/auth");
      return;
    }
    setUser(user);
  };

  const loadMyUploads = async () => {
    try {
      const { data, error } = await supabase
        .from("user_music_uploads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyUploads(data || []);
    } catch (error: any) {
      console.error("Error loading uploads:", error);
      toast.error("Failed to load your uploads");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast.error("Please select a valid audio file");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be less than 20MB");
      return;
    }

    setAudioFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile || !title) {
      toast.error("Please select a file and enter a title");
      return;
    }

    if (!user) {
      toast.error("Please sign in to upload files");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = audioFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("user-music")
        .upload(fileName, audioFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("user-music")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("user_music_uploads")
        .insert({
          user_id: user.id,
          title,
          artist: artist || null,
          file_url: urlData.publicUrl,
          file_size_bytes: audioFile.size,
          upload_status: 'pending'
        });

      if (dbError) throw dbError;

      toast.success("Music uploaded! Waiting for admin approval.");
      setAudioFile(null);
      setTitle("");
      setArtist("");
      setUploadProgress(100);
      
      const fileInput = document.getElementById("audio-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      await loadMyUploads();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload music");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="gap-1 bg-green-500"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Music className="h-8 w-8" />
            Upload Your Music
          </h1>
          <p className="text-muted-foreground">
            Upload your favorite music. Admin will review before it appears in the player.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Track Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Favorite Song"
                disabled={uploading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artist (Optional)</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist Name"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audio-file">Audio File *</Label>
              <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <p className="text-sm text-muted-foreground">
                Maximum: 20MB. Formats: MP3, WAV, OGG, M4A
              </p>
            </div>

            {audioFile && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">{audioFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-center">Uploading...</p>
              </div>
            )}

            <Button type="submit" disabled={!audioFile || !title || uploading} className="w-full gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Music"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">My Uploads</h2>
          
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : myUploads.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No uploads yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myUploads.map((upload) => (
                <Card key={upload.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-bold">{upload.title}</p>
                      {upload.artist && <p className="text-sm text-muted-foreground">{upload.artist}</p>}
                      <p className="text-xs text-muted-foreground">
                        {new Date(upload.created_at).toLocaleDateString()}
                      </p>
                      {upload.admin_notes && upload.upload_status === 'rejected' && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-700 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {upload.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                    {getStatusBadge(upload.upload_status)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
