import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Unlock } from 'lucide-react';
import { useUserAccess } from '@/hooks/useUserAccess';
import { useToast } from '@/hooks/use-toast';

interface Room {
  id: string;
  title_en: string;
  title_vi: string;
  tier: string;
}

interface DomainSection {
  id: string;
  title: { en: string; vi: string };
  rooms: Room[];
}

const RoomsVIP9 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAccess, tier } = useUserAccess('vip9');
  const [domains, setDomains] = useState<DomainSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('id, title_en, title_vi, tier')
          .eq('tier', 'vip9')
          .order('id');

        if (error) throw error;

        // Organize rooms into domains
        const individualRooms = data.filter(r => r.id.startsWith('strategic_'));
        const corporateRooms = data.filter(r => r.id.startsWith('corporate_'));
        const nationalRooms = data.filter(r => r.id.startsWith('national_'));

        setDomains([
          {
            id: 'individual_strategic_mastery',
            title: {
              en: 'Individual Strategic Mastery',
              vi: 'Tư Duy Chiến Lược Cá Nhân'
            },
            rooms: individualRooms
          },
          {
            id: 'corporate_organizational_strategy',
            title: {
              en: 'Corporate & Organizational Strategy',
              vi: 'Chiến Lược Tổ Chức & Doanh Nghiệp'
            },
            rooms: corporateRooms
          },
          {
            id: 'national_geostrategic_intelligence',
            title: {
              en: 'National & Geostrategic Intelligence',
              vi: 'Chiến Lược Quốc Gia & Địa Chiến Lược'
            },
            rooms: nationalRooms
          }
        ]);
      } catch (error) {
        console.error('Error fetching VIP9 rooms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load rooms',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [toast]);

  const handleRoomClick = (roomId: string) => {
    if (!hasAccess) {
      toast({
        title: 'VIP9 Access Required',
        description: 'Upgrade to VIP9 to access Strategic Mastery rooms',
        variant: 'destructive'
      });
      navigate('/subscribe');
      return;
    }
    navigate(`/room/${roomId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading VIP9 rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ColorfulMercyBladeHeader showBackButton={true} />
      
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Crown className="h-12 w-12 text-amber-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              VIP9 Strategic Mastery
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            <span className="font-medium">Bậc Thầy Chiến Lược</span> — Individual, Corporate & National Strategy
          </p>
          <p className="text-sm text-muted-foreground">
            55 elite rooms across three strategic domains • $150/month
          </p>
          
          {!hasAccess && (
            <div className="mt-6">
              <Button 
                size="lg"
                onClick={() => navigate('/subscribe')}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to VIP9
              </Button>
            </div>
          )}
        </div>

        {/* Domain Sections */}
        {domains.map((domain) => (
          <div key={domain.id} className="space-y-6">
            <div className="border-l-4 border-amber-600 pl-4">
              <h2 className="text-2xl font-bold text-foreground">{domain.title.en}</h2>
              <p className="text-lg text-muted-foreground">{domain.title.vi}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {domain.rooms.length} rooms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domain.rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room.id)}
                  className="group relative p-6 rounded-xl border-2 border-border hover:border-amber-500 bg-card hover:bg-amber-50 dark:hover:bg-amber-950 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground group-hover:text-amber-600 transition-colors">
                        {room.title_en}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {room.title_vi}
                      </p>
                    </div>
                    {hasAccess ? (
                      <Unlock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Footer CTA */}
        {!hasAccess && (
          <div className="text-center space-y-4 py-12">
            <h3 className="text-2xl font-bold text-foreground">
              Ready to Master Strategic Thinking?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access 55 elite rooms covering Individual, Corporate, and National Strategy for $150/month
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/subscribe')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to VIP9
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsVIP9;
