import { Card } from "@/components/ui/card";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { CheckCircle2, School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";
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

const KidsLevel2 = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useUserAccess();
  const [rooms, setRooms] = useState<KidsRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return School;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || School;
  };

  if (loading || roomsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="Kids Level 2 - Ages 7-10"
        showBackButton={true}
      />
      
      <div className="min-h-screen" style={{ backgroundColor: 'hsl(221, 83%, 53%)' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <School className="h-8 w-8 text-white" />
                <h1 className="text-4xl font-bold text-white">
                  Kids Level 2
                </h1>
              </div>
              <p className="text-lg text-white/90">
                Cấp 2 - Độ tuổi 7-10
              </p>
              <p className="text-sm text-white/80">
                {rooms.length} rooms available
              </p>
            </div>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {rooms.map((room) => {
              const IconComponent = getIconComponent(room.icon);
              
              return (
                <Card
                  key={room.id}
                  className="relative p-3 transition-all duration-300 cursor-pointer group hover:scale-110 hover:shadow-hover hover:z-10 border-secondary/30 bg-white"
                  onClick={() => navigate(`/kids-chat/${room.id}`)}
                >
                  {/* Status Badge */}
                  <div className="absolute top-1 right-1 z-10">
                    <div className="bg-blue-500 rounded-full p-1">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Icon */}
                    <div className="flex justify-center">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    {/* Room Names */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold leading-tight line-clamp-2 text-center text-gray-900">
                        {room.title_en}
                      </p>
                      <p className="text-[10px] leading-tight line-clamp-2 text-center text-gray-600">
                        {room.title_vi}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsLevel2;
