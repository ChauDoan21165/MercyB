import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { GraduationCap, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KidsRoomCard } from "@/components/kids/KidsRoomCard";

interface KidsRoom {
  id: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  icon: string | null;
  display_order: number;
}

const KidsLevel3 = () => {
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
        .eq('level_id', 'level3')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-950 dark:via-cyan-950 dark:to-blue-900">
      <ColorfulMercyBladeHeader
        subtitle="Kids Level 3 - Ages 10-13"
        showBackButton={true}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header with Gradient */}
        <div className="mb-12 space-y-6 text-center">
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white px-8 py-4 rounded-3xl shadow-lg animate-fade-in">
            <GraduationCap className="h-10 w-10 animate-bounce" />
            <div className="text-left">
              <h1 className="text-4xl font-bold tracking-tight">
                Kids Level 3
              </h1>
              <p className="text-sm opacity-90">
                Cấp 3 - Độ tuổi 10-13
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="inline-block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-md">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                🎯 {rooms.length} exciting rooms to explore! / {rooms.length} phòng thú vị để khám phá!
              </p>
            </div>
            
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105"
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
          <GraduationCap className="w-32 h-32 text-blue-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default KidsLevel3;
