/**
 * MercyBlade Blue — AdminAudioUpload
 * File: src/_legacy_next_pages/AdminAudioUpload.tsx
 * Version: MB-BLUE-94.0 — 2025-12-23 (+0700)
 *
 * FIX:
 * - Remove legacy roomData usage
 * - Use roomFetcher as single source of truth
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle,
  Trash2,
  Play,
} from "lucide-react";
import { useUserAccess } from "@/hooks/useUserAccess";
import { getAllRooms, type RoomMeta } from "@/lib/roomFetcher";

interface UploadedAudio {
  name: string;
  created_at: string;
  updated_at: string;
  metadata: any;
}

export default function AdminAudioUpload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: accessLoading } = useUserAccess();

  const [rooms, setRooms] = useState<RoomMeta[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, UploadedAudio[]>
  >({});
  const [loading, setLoading] = useState(true);

  // Guard
  useEffect(() => {
    if (!accessLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, accessLoading, navigate]);

  // Load rooms
  useEffect(() => {
    if (!isAdmin) return;

    (async () => {
      try {
        const list = await getAllRooms();
        setRooms(list);
      } catch (err: any) {
        toast({
          title: "Failed to load rooms",
          description: err?.message,
          variant: "destructive",
        });
      }
    })();
  }, [isAdmin, toast]);

  // Load uploaded audio
  useEffect(() => {
    if (!isAdmin || rooms.length === 0) return;

    (async () => {
      setLoading(true);
      try {
        const filesMap: Record<string, UploadedAudio[]> = {};

        for (const room of rooms) {
          const { data, error } = await supabase.storage
            .from("room-audio")
            .list(room.id, {
              sortBy: { column: "created_at", order: "desc" },
            });

          if (!error && data) {
            filesMap[room.id] = data as UploadedAudio[];
          }
        }

        setUploadedFiles(filesMap);
      } catch (err: any) {
        toast({
          title: "Error loading files",
          description: err?.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [rooms, isAdmin, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an audio file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Max size is 10MB",
        variant: "destructive",
      });
      return;
    }

    setAudioFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoom || !audioFile) return;

    setIsUploading(true);
    try {
      const path = `${selectedRoom}/${audioFile.name}`;
      const { error } = await supabase.storage
        .from("room-audio")
        .upload(path, audioFile, { upsert: true });

      if (error) throw error;

      toast({
        title: "Upload successful",
        description: audioFile.name,
      });

      setAudioFile(null);
      setSelectedRoom("");
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err?.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const playAudio = (roomId: string, name: string) => {
    const { data } = supabase.storage
      .from("room-audio")
      .getPublicUrl(`${roomId}/${name}`);
    new Audio(data.publicUrl).play();
  };

  const deleteAudio = async (roomId: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;

    await supabase.storage
      .from("room-audio")
      .remove([`${roomId}/${name}`]);
  };

  if (accessLoading || !isAdmin) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Button variant="ghost" onClick={() => navigate("/admin")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mt-4 mb-6">Room Audio Upload</h1>

      <Card className="p-6 mb-8">
        <form onSubmit={handleUpload} className="space-y-4">
          <Label>Room</Label>
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger>
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.title_en || r.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input type="file" accept="audio/*" onChange={handleFileChange} />

          <Button disabled={isUploading}>
            {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
            Upload
          </Button>
        </form>
      </Card>
    </div>
  );
}
