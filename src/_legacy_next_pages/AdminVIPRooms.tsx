import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { ALL_ROOMS, RoomInfo } from '@/lib/roomData';

const AdminVIPRooms = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roomsVersion, setRoomsVersion] = useState(0);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    const handle = () => setRoomsVersion(v => v + 1);
    window.addEventListener('rooms-loaded', handle as any);
    return () => window.removeEventListener('rooms-loaded', handle as any);
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const hasAdmin = roles?.some(r => r.role === 'admin');
      
      if (!hasAdmin) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  const getBackgroundForTier = (tier: string) => {
    return 'bg-white border-2 border-black';
  };

  const vip1Rooms = ALL_ROOMS.filter(room => room.tier === 'vip1').sort((a, b) => {
    const aName = a.name || a.id;
    const bName = b.name || b.id;
    return aName.localeCompare(bName);
  });
  const vip2Rooms = ALL_ROOMS.filter(room => room.tier === 'vip2').sort((a, b) => {
    const aName = a.name || a.id;
    const bName = b.name || b.id;
    return aName.localeCompare(bName);
  });
  const vip3Rooms = ALL_ROOMS.filter(room => room.tier === 'vip3').sort((a, b) => {
    const aName = a.name || a.id;
    const bName = b.name || b.id;
    return aName.localeCompare(bName);
  });

  const RoomCard = ({ room }: { room: RoomInfo }) => {
    return (
      <Card className="bg-white border-2 border-black hover:shadow-xl transition-all">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg mb-1 font-bold text-black">{room.nameEn}</CardTitle>
              <CardDescription className="text-gray-600">{room.nameVi}</CardDescription>
            </div>
            <Badge variant="outline" className="border-2 border-black bg-white text-black font-bold">
              {room.tier.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
          <span>Room ID: {room.id}</span>
        </div>
        
        <Button
          onClick={() => navigate(`/chat/${room.id}`)}
          className="w-full border-2 border-black bg-white text-black hover:bg-black hover:text-white font-bold"
          variant="outline"
          aria-label={`Open chat room ${room.nameEn}`}
        >
          <span className="flex items-center gap-2">
            Open Chat Room
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-black">VIP Rooms Admin Dashboard</h1>
            <p className="text-gray-600 font-bold">
              Manage and view all VIP tier rooms, topics, and chat rooms
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="border-2 border-black bg-white text-black hover:bg-black hover:text-white font-bold"
            aria-label="Back to Admin Dashboard"
          >
            ← Back to Admin
          </Button>
        </div>

        <Tabs defaultValue="vip1" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-black">
            <TabsTrigger 
              value="vip1" 
              className="text-base font-bold data-[state=active]:bg-black data-[state=active]:text-white"
            >
              VIP1 ({vip1Rooms.length} rooms)
            </TabsTrigger>
            <TabsTrigger 
              value="vip2" 
              className="text-base font-bold data-[state=active]:bg-black data-[state=active]:text-white"
            >
              VIP2 ({vip2Rooms.length} rooms)
            </TabsTrigger>
            <TabsTrigger 
              value="vip3" 
              className="text-base font-bold data-[state=active]:bg-black data-[state=active]:text-white"
            >
              VIP3 ({vip3Rooms.length} rooms)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vip1" className={`rounded-lg p-6 ${getBackgroundForTier('vip1')}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-black">VIP1 Tier Rooms</h2>
              <p className="text-gray-600 font-bold">
                Premium rooms for VIP1 subscribers - 1 custom topic, 1 full room access per day
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vip1Rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
            {vip1Rooms.length === 0 && (
              <div className="text-center py-12 text-gray-600 font-bold">
                No VIP1 rooms available
              </div>
            )}
          </TabsContent>

          <TabsContent value="vip2" className={`rounded-lg p-6 ${getBackgroundForTier('vip2')}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-black">VIP2 Tier Rooms</h2>
              <p className="text-gray-600 font-bold">
                Premium rooms for VIP2 subscribers - 2 custom topics, 2 full rooms access per day
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vip2Rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
            {vip2Rooms.length === 0 && (
              <div className="text-center py-12 text-gray-600 font-bold">
                No VIP2 rooms available
              </div>
            )}
          </TabsContent>

          <TabsContent value="vip3" className={`rounded-lg p-6 ${getBackgroundForTier('vip3')}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-black">VIP3 Tier Rooms</h2>
              <p className="text-gray-600 font-bold">
                Premium rooms for VIP3 subscribers - 3 custom topics, 3 rooms access per day, AI Matchmaking, Voice chat
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vip3Rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
            {vip3Rooms.length === 0 && (
              <div className="text-center py-12 text-gray-600 font-bold">
                No VIP3 rooms available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminVIPRooms;
