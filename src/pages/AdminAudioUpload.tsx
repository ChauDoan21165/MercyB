import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Loader2, CheckCircle, Trash2, Play } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserAccess";
import { getRoomsWithData } from "@/lib/roomData";

interface UploadedAudio {
  name: string;
  created_at: string;
  updated_at: string;
  metadata: any;
}

const AdminAudioUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: accessLoading } = useUserAccess();
  
  const [selectedRoom, setSelectedRoom] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ [roomId: string]: UploadedAudio[] }>({});
  const [loading, setLoading] = useState(true);

  const rooms = getRoomsWithData();

  useEffect(() => {
    if (!accessLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, accessLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadUploadedFiles();
    }
  }, [isAdmin]);

  const loadUploadedFiles = async () => {
    setLoading(true);
    try {
      const filesMap: { [roomId: string]: UploadedAudio[] } = {};
      
      // Load files for each room
      for (const room of rooms) {
        const { data, error } = await supabase.storage
          .from('room-audio-uploads')
          .list(room.id, {
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (!error && data) {
          filesMap[room.id] = data;
        }
      }

      setUploadedFiles(filesMap);
    } catch (error: any) {
      toast({
        title: "Error Loading Files",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('audio')) {
        toast({
          title: "Invalid File",
          description: "Please upload an audio file (MP3, WAV, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an audio file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setAudioFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoom) {
      toast({
        title: "Room Required",
        description: "Please select a room",
        variant: "destructive",
      });
      return;
    }
    
    if (!audioFile) {
      toast({
        title: "Audio File Required",
        description: "Please select an audio file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload to storage bucket
      const fileName = `${selectedRoom}/${audioFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('room-audio-uploads')
        .upload(fileName, audioFile, {
          upsert: true // Replace if exists
        });

      if (uploadError) {
        throw uploadError;
      }

      toast({
        title: "✅ Upload Successful",
        description: `Audio uploaded for ${rooms.find(r => r.id === selectedRoom)?.nameEn}`,
      });

      // Reset form
      setSelectedRoom("");
      setAudioFile(null);
      
      // Reload files
      await loadUploadedFiles();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload audio file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (roomId: string, fileName: string) => {
    if (!confirm(`Delete ${fileName}?`)) return;

    try {
      const { error } = await supabase.storage
        .from('room-audio-uploads')
        .remove([`${roomId}/${fileName}`]);

      if (error) throw error;

      toast({
        title: "File Deleted",
        description: "Audio file removed successfully",
      });

      await loadUploadedFiles();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePlayAudio = (roomId: string, fileName: string) => {
    const { data } = supabase.storage
      .from('room-audio-uploads')
      .getPublicUrl(`${roomId}/${fileName}`);
    
    const audio = new Audio(data.publicUrl);
    audio.play();
  };

  if (accessLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <h1 className="text-3xl font-bold mb-2">Room Audio Management</h1>
        <p className="text-muted-foreground mb-6">
          Upload MP3 files for rooms. Uploaded audio takes priority over TTS.
        </p>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Upload New Audio</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="room">Select Room</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a room..." />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.nameEn} ({room.nameVi})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="audio">Audio File (MP3, WAV, etc.)</Label>
              <Input
                id="audio"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {audioFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading || !selectedRoom || !audioFile}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Audio
                </>
              )}
            </Button>
          </form>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Uploaded Audio Files</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => {
              const files = uploadedFiles[room.id] || [];
              if (files.length === 0) return null;

              return (
                <Card key={room.id} className="p-4">
                  <h3 className="font-bold text-lg mb-3">
                    {room.nameEn} ({room.nameVi})
                  </h3>
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div 
                        key={file.name} 
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded: {new Date(file.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePlayAudio(room.id, file.name)}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(room.id, file.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
            
            {Object.values(uploadedFiles).every(files => files.length === 0) && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No audio files uploaded yet</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAudioUpload;