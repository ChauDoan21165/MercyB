import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, XCircle, Music, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { guardedCall } from "@/lib/guardedCall";

interface MusicUpload {
  id: string;
  user_id: string;
  title: string;
  artist: string | null;
  file_url: string;
  upload_status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  profiles: {
    username: string | null;
    email: string | null;
  } | null;
}

export default function MusicApproval() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [uploads, setUploads] = useState<MusicUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Admin access required");
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadUploads();
    }
  }, [isAdmin]);

  const loadUploads = async () => {
    try {
      const { data, error } = await supabase
        .from("user_music_uploads")
        .select(`
          *,
          profiles!user_music_uploads_user_id_fkey (
            username,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error: any) {
      console.error("Error loading uploads:", error);
      toast.error("Failed to load music uploads");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const result = await guardedCall(
      'Approve music upload',
      async () => {
        const { error } = await supabase
          .from("user_music_uploads")
          .update({
            upload_status: 'approved',
            approved_at: new Date().toISOString(),
            admin_notes: adminNotes[id] || null
          })
          .eq("id", id);

        if (error) throw error;
        return { success: true };
      },
      { showSuccessToast: true, successMessage: "Music approved!" }
    );

    if (result.success) {
      await loadUploads();
      setAdminNotes(prev => ({ ...prev, [id]: "" }));
    }
  };

  const handleReject = async (id: string) => {
    if (!adminNotes[id]?.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    const result = await guardedCall(
      'Reject music upload',
      async () => {
        const { error } = await supabase
          .from("user_music_uploads")
          .update({
            upload_status: 'rejected',
            admin_notes: adminNotes[id]
          })
          .eq("id", id);

        if (error) throw error;
        return { success: true };
      },
      { showSuccessToast: true, successMessage: "Music rejected" }
    );

    if (result.success) {
      await loadUploads();
      setAdminNotes(prev => ({ ...prev, [id]: "" }));
    }
  };

  if (adminLoading || !isAdmin) return null;

  const pendingUploads = uploads.filter(u => u.upload_status === 'pending');
  const reviewedUploads = uploads.filter(u => u.upload_status !== 'pending');

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Music className="h-8 w-8" />
            Music Approval Dashboard
          </h1>
          <p className="text-gray-600">Review and approve user-uploaded music</p>
        </div>

        {/* Pending Uploads */}
        <Card className="p-6 border-2 border-black">
          <h2 className="text-2xl font-bold mb-4">
            Pending Approval ({pendingUploads.length})
          </h2>
          
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : pendingUploads.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No pending uploads</p>
          ) : (
            <div className="space-y-4">
              {pendingUploads.map((upload) => (
                <Card key={upload.id} className="p-4 border border-black">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-lg">{upload.title}</p>
                        {upload.artist && <p className="text-sm text-gray-600">{upload.artist}</p>}
                        <p className="text-xs text-gray-500">
                          User: {upload.profiles?.username || upload.profiles?.email || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(upload.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const audio = new Audio(upload.file_url);
                          audio.play();
                          setPlayingId(upload.id);
                          audio.onended = () => setPlayingId(null);
                        }}
                        className="gap-2 border-black"
                      >
                        <Play className="h-4 w-4" />
                        {playingId === upload.id ? 'Playing' : 'Preview'}
                      </Button>
                    </div>

                    <Textarea
                      placeholder="Admin notes (required for rejection, optional for approval)"
                      value={adminNotes[upload.id] || ""}
                      onChange={(e) => setAdminNotes(prev => ({ ...prev, [upload.id]: e.target.value }))}
                      className="border-black"
                    />

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(upload.id)}
                        className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(upload.id)}
                        variant="destructive"
                        className="flex-1 gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Reviewed Uploads */}
        <Card className="p-6 border-2 border-black">
          <h2 className="text-2xl font-bold mb-4">
            Reviewed ({reviewedUploads.length})
          </h2>
          
          {reviewedUploads.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No reviewed uploads yet</p>
          ) : (
            <div className="space-y-3">
              {reviewedUploads.map((upload) => (
                <Card key={upload.id} className="p-4 border border-black">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-bold">{upload.title}</p>
                      {upload.artist && <p className="text-sm text-gray-600">{upload.artist}</p>}
                      <p className="text-xs text-gray-500">
                        User: {upload.profiles?.username || upload.profiles?.email || 'Unknown'}
                      </p>
                      {upload.admin_notes && (
                        <p className="text-xs text-gray-600 mt-1">Note: {upload.admin_notes}</p>
                      )}
                    </div>
                    <Badge variant={upload.upload_status === 'approved' ? 'default' : 'destructive'}>
                      {upload.upload_status}
                    </Badge>
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
