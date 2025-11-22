import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { CheckCircle2, Lock, Baby, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";

interface KidsRoom {
  id: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  icon: string | null;
  display_order: number;
}

const KidsLevel1 = () => {
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
        .eq('level_id', 'level1')
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

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return Baby;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Baby;
  };

  if (loading || roomsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 via-green-50 via-cyan-50 via-blue-50 to-purple-50 dark:from-red-950 dark:via-yellow-950 dark:via-green-950 dark:via-cyan-950 dark:via-blue-950 dark:to-purple-950">
      <ColorfulMercyBladeHeader
        subtitle="Kids Level 1 - Ages 4-7"
        showBackButton={true}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header with Gradient */}
        <div className="mb-12 space-y-6 text-center">
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-purple-500 text-white px-8 py-4 rounded-3xl shadow-lg animate-fade-in">
            <Baby className="h-10 w-10 animate-bounce" />
            <div className="text-left">
              <h1 className="text-4xl font-bold tracking-tight">
                Kids Level 1
              </h1>
              <p className="text-sm opacity-90">
                Cấp 1 - Độ tuổi 4-7
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
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Room Grid with Beautiful Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
          {rooms.map((room, index) => {
            const IconComponent = getIconComponent(room.icon);
            
            return (
              <Card
                key={room.id}
                className="relative p-4 transition-all duration-500 cursor-pointer group hover:scale-110 hover:shadow-2xl hover:z-10 border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm overflow-hidden"
                onClick={() => navigate(`/kids-chat/${room.id}`)}
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 via-yellow-400/0 via-green-400/0 via-cyan-400/0 via-blue-400/0 to-purple-400/0 group-hover:from-red-400/10 group-hover:via-yellow-400/10 group-hover:via-green-400/10 group-hover:via-cyan-400/10 group-hover:via-blue-400/10 group-hover:to-purple-400/10 transition-all duration-500" />
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full p-1 shadow-lg animate-pulse">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="relative space-y-3">
                  {/* Icon with Animated Circle */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                      <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Room Names */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold leading-tight line-clamp-2 text-center text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {room.title_en}
                    </p>
                    <p className="text-[10px] leading-tight line-clamp-2 text-center text-gray-600 dark:text-gray-400">
                      {room.title_vi}
                    </p>
                  </div>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Decorative Elements */}
        <div className="fixed bottom-8 right-8 opacity-20 pointer-events-none">
          <Baby className="w-32 h-32 text-purple-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default KidsLevel1;
