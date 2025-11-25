import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, TrendingUp, Building2, Globe2, Swords, Handshake, Lightbulb, Crown } from 'lucide-react';
import { useUserAccess } from '@/hooks/useUserAccess';
import { useToast } from '@/hooks/use-toast';

interface Room {
  id: string;
  title_en: string;
  title_vi: string;
  tier: string;
  domain?: string;
}

interface DomainSection {
  id: string;
  title: { en: string; vi: string };
  rooms: Room[];
}

const RoomsVIP9 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canAccessVIP9, loading: accessLoading } = useUserAccess();
  const [domains, setDomains] = useState<DomainSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('id, title_en, title_vi, tier, domain')
          .eq('tier', 'vip9')
          .order('title_en');

        if (error) throw error;

        // Organize rooms by their domain field
        const individualRooms = data.filter(r => r.domain === 'Individual');
        const corporateRooms = data.filter(r => r.domain === 'Corporate');
        const nationalRooms = data.filter(r => r.domain === 'National');
        const tacticalTitansRooms = data.filter(r => r.domain === 'Tactical Titans');
        const diplomaticPioneersRooms = data.filter(r => r.domain === 'Diplomatic Pioneers');
        const innovativeVisionariesRooms = data.filter(r => r.domain === 'Innovative Visionaries');
        const culturalInfluencersRooms = data.filter(r => r.domain === 'Cultural Influencers');

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
          },
          {
            id: 'tactical_titans',
            title: {
              en: 'Tactical Titans',
              vi: 'Những Chiến Lược Gia Quân Sự'
            },
            rooms: tacticalTitansRooms
          },
          {
            id: 'diplomatic_pioneers',
            title: {
              en: 'Diplomatic Pioneers',
              vi: 'Tiên Phong Ngoại Giao'
            },
            rooms: diplomaticPioneersRooms
          },
          {
            id: 'innovative_visionaries',
            title: {
              en: 'Innovative Visionaries',
              vi: 'Những Nhà Tư Tưởng Tiên Phong'
            },
            rooms: innovativeVisionariesRooms
          },
          {
            id: 'cultural_influencers',
            title: {
              en: 'Cultural Influencers',
              vi: 'Những Nhà Ảnh Hưởng Văn Hóa'
            },
            rooms: culturalInfluencersRooms
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
    if (!canAccessVIP9) {
      toast({
        title: 'VIP9 Access Required',
        description: 'Upgrade to VIP9 to access Strategic Mastery rooms',
        variant: 'destructive'
      });
      navigate('/subscribe');
      return;
    }
    navigate(`/chat/${roomId}`);
  };

  if (loading || accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading VIP9 rooms...</p>
        </div>
      </div>
    );
  }

  const domainIcons = {
    individual_strategic_mastery: TrendingUp,
    corporate_organizational_strategy: Building2,
    national_geostrategic_intelligence: Globe2,
    tactical_titans: Swords,
    diplomatic_pioneers: Handshake,
    innovative_visionaries: Lightbulb,
    cultural_influencers: Crown
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <ColorfulMercyBladeHeader showBackButton={true} />
      
      <div className="container max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
            <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">Executive Level</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            VIP9 Strategic Mastery
          </h1>
          
          <p className="text-xl text-slate-300 font-light">
            Strategic Wisdom from History's Greatest Minds
          </p>
          
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Elite strategic frameworks combining modern strategy with timeless wisdom from 
            legendary strategists: Sun Tzu, Napoleon, Machiavelli, Bismarck, Churchill, 
            Eisenhower, Cleopatra, and Genghis Khan.
          </p>
          
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{domains.reduce((acc, d) => acc + d.rooms.length, 0)}</div>
              <div className="text-sm text-slate-400">Elite Rooms</div>
            </div>
            <div className="h-12 w-px bg-slate-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">7</div>
              <div className="text-sm text-slate-400">Strategic Domains</div>
            </div>
            <div className="h-12 w-px bg-slate-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">$150</div>
              <div className="text-sm text-slate-400">Per Month</div>
            </div>
          </div>
          
          {!canAccessVIP9 && (
            <div className="pt-6">
              <Button 
                size="lg"
                onClick={() => navigate('/subscribe')}
                className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-8 py-6 text-lg shadow-xl"
              >
                Access VIP9 Strategic Mastery
              </Button>
            </div>
          )}
        </div>

        {/* Domain Sections */}
        {domains.map((domain) => {
          const Icon = domainIcons[domain.id as keyof typeof domainIcons];
          return (
            <div key={domain.id} className="space-y-8">
              <div className="border-l-2 border-slate-600 pl-6 py-2">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-6 w-6 text-slate-400" />
                  <h2 className="text-3xl font-bold text-white tracking-tight">{domain.title.en}</h2>
                </div>
                <p className="text-lg text-slate-400 font-light">{domain.title.vi}</p>
                <p className="text-sm text-slate-500 mt-2">
                  {domain.rooms.length} strategic frameworks
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domain.rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomClick(room.id)}
                    className="group relative p-6 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 text-left backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-white group-hover:text-slate-100 transition-colors leading-snug">
                          {room.title_en}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {room.title_vi}
                        </p>
                      </div>
                      {canAccessVIP9 ? (
                        <Unlock className="h-5 w-5 text-slate-400 group-hover:text-white flex-shrink-0 transition-colors" />
                      ) : (
                        <Lock className="h-5 w-5 text-slate-600 flex-shrink-0" />
                      )}
                    </div>
                    
                    {/* Subtle hover effect line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer CTA */}
        {!canAccessVIP9 && (
          <div className="text-center space-y-6 py-16 border-t border-slate-800">
            <h3 className="text-3xl font-bold text-white">
              Elevate Your Strategic Capability
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Join an elite cohort of strategic leaders. Access frameworks that shape 
              decisions at the individual, organizational, and national level.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/subscribe')}
              className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-8 py-6 text-lg shadow-xl"
            >
              Access VIP9 Strategic Mastery
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsVIP9;
