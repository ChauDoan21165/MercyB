import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { School, RefreshCw } from "lucide-react";
import { KidsRoomCard } from "@/components/kids/KidsRoomCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface KidsRoom {
  id: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  icon: string | null;
  display_order: number;
}

const KidsLevel2 = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useUserAccess();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<KidsRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('kids_rooms')
        .select('*')
        .eq('level_id', 'level2')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive",
      });
    } finally {
      setRoomsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRooms();
    toast({
      title: "Refreshed! 🌈",
      description: "Rooms updated successfully",
    });
  };

  useEffect(() => {
    fetchRooms();
  }, []);


  if (loading || roomsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--kids-rainbow-bg)' }}>
      <ColorfulMercyBladeHeader
        subtitle="Kids Level 2 - Ages 7-10"
        showBackButton={true}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header with Gradient */}
        <div className="mb-12 space-y-6 text-center">
          <div className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-3xl shadow-lg animate-fade-in" style={{ background: 'var(--gradient-rainbow)' }}>
            <School className="h-10 w-10 animate-bounce text-white" />
            <div className="text-left text-white">
              <h1 className="text-4xl font-bold tracking-tight">
                Kids Level 2
              </h1>
              <p className="text-sm opacity-90">
                Cấp 2 - Độ tuổi 7-10
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="inline-block bg-card/80 backdrop-blur-sm px-6 py-2 rounded-full" style={{ boxShadow: 'var(--shadow-soft)' }}>
              <p className="text-sm font-medium text-foreground">
                🎯 {rooms.length} exciting rooms to explore! / {rooms.length} phòng thú vị để khám phá!
              </p>
            </div>
            
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              style={{ 
                background: 'var(--gradient-rainbow)',
                color: 'white'
              }}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Room Grid with Beautiful Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
          {rooms.map((room, index) => (
            <KidsRoomCard
              key={room.id}
              room={room}
              index={index}
              onClick={() => navigate(`/kids-chat/${room.id}`)}
            />
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="fixed bottom-8 right-8 opacity-20 pointer-events-none">
          <School className="w-32 h-32 text-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default KidsLevel2;
