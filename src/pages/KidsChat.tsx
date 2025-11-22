import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { useToast } from "@/hooks/use-toast";
import { AudioPlayer } from "@/components/AudioPlayer";

interface KidsRoom {
  id: string;
  title_en: string;
  title_vi: string;
  level_id: string;
}

interface KidsEntry {
  id: string;
  content_en: string;
  content_vi: string;
  audio_url: string | null;
  display_order: number;
}

const KidsChat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<KidsRoom | null>(null);
  const [entries, setEntries] = useState<KidsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<KidsEntry | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      
      // Fetch room info
      const { data: roomData, error: roomError } = await supabase
        .from('kids_rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;
      setRoom(roomData);

      // Fetch entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('kids_entries')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_active', true)
        .order('display_order');

      if (entriesError) throw entriesError;
      setEntries(entriesData || []);
      
      if (entriesData && entriesData.length > 0) {
        setSelectedEntry(entriesData[0]);
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
      toast({
        title: "Error",
        description: "Failed to load room data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  const handleBack = () => {
    if (room?.level_id) {
      navigate(`/kids-${room.level_id}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Room not found / Không tìm thấy phòng</p>
        <Button onClick={() => navigate('/')}>Go Home / Về trang chủ</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ColorfulMercyBladeHeader subtitle={`${room.title_en} / ${room.title_vi}`} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with back button */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back / Quay lại
          </Button>
          
          <Button
            variant="outline"
            onClick={fetchRoomData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Room title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{room.title_en}</h1>
          <p className="text-xl text-muted-foreground">{room.title_vi}</p>
        </div>

        {/* Entries grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {entries.map((entry, index) => (
            <Card
              key={entry.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedEntry?.id === entry.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedEntry(entry);
                setIsPlaying(false);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">
                    {entry.content_en.substring(0, 50)}...
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected entry content */}
        {selectedEntry && (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">English:</h3>
                <p className="text-lg leading-relaxed">{selectedEntry.content_en}</p>
              </div>

              {selectedEntry.audio_url && (
                <div className="border-t pt-4">
                  <AudioPlayer
                    audioPath={selectedEntry.audio_url}
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              )}
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Tiếng Việt:</h3>
                <p className="text-lg leading-relaxed">{selectedEntry.content_vi}</p>
              </div>
            </div>
          </Card>
        )}

        {entries.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-lg text-muted-foreground">
              No content available yet / Chưa có nội dung
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KidsChat;
