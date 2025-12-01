import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';
import { useMercyBladeTheme } from '@/hooks/useMercyBladeTheme';
import { RoomLoadShell } from '@/components/RoomLoadShell';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, TrendingUp, Building2, Globe2, Crown, Palette } from 'lucide-react';
import { useUserAccess } from '@/hooks/useUserAccess';
import { useToast } from '@/hooks/use-toast';
import { useColorMode } from '@/hooks/useColorMode';
import { highlightShortTitle } from '@/lib/wordColorHighlighter';
import { useVipRooms } from '@/hooks/useVipRooms';
import { TIERS, ROOMS_TABLE, ROOM_GRID_CLASS } from '@/lib/constants';
import { VipRoom } from '@/hooks/useVipRooms';

interface DomainSection {
  id: string;
  title: { en: string; vi: string };
  rooms: VipRoom[];
}

const RoomsVIP9 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canAccessVIP9, loading: accessLoading } = useUserAccess();
  const { rooms, loading, error } = useVipRooms('vip9');
  const [domains, setDomains] = useState<DomainSection[]>([]);
  const { useColorTheme, toggleColorMode } = useColorMode();
  const { mode } = useMercyBladeTheme({ defaultMode: "color" });

  useEffect(() => {
    // Organize rooms by their domain field
    const individualRooms = rooms.filter(r => r.domain === 'Individual');
    const corporateRooms = rooms.filter(r => r.domain === 'Corporate');
    const nationalRooms = rooms.filter(r => r.domain === 'National');
    const historicalStrategistsRooms = rooms.filter(r => r.domain === 'Historical Strategists');

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
        id: 'historical_strategists',
        title: {
          en: 'Historical Strategists',
          vi: 'Các Nhà Chiến Lược Lịch Sử'
        },
        rooms: historicalStrategistsRooms
      }
    ]);
  }, [rooms]);

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
    historical_strategists: Crown
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <ColorfulMercyBladeHeader mode={mode} showBackButton={true} />
      
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
              <div className="text-3xl font-bold text-white">{rooms.length}</div>
              <div className="text-sm text-slate-400">Elite Rooms</div>
            </div>
            <div className="h-12 w-px bg-slate-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4</div>
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
                aria-label="Access VIP9 Strategic Mastery"
              >
                Access VIP9 Strategic Mastery
              </Button>
            </div>
          )}
        </div>

        <RoomLoadShell 
          isLoading={loading} 
          error={error ? "Failed to load VIP9 rooms" : null}
        >
          {/* Domain Sections */}
          {domains.map((domain) => {
          const Icon = domainIcons[domain.id as keyof typeof domainIcons];
          return (
            <div key={domain.id} className="space-y-8">
              <div className="border-l-2 border-slate-600 pl-6 py-2">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-6 w-6 text-slate-400" aria-hidden="true" />
                  <h2 className="text-3xl font-bold text-white tracking-tight">{domain.title.en}</h2>
                </div>
                <p className="text-lg text-slate-400 font-light">{domain.title.vi}</p>
                <p className="text-sm text-slate-500 mt-2">
                  {domain.rooms.length} strategic frameworks
                </p>
              </div>

              {/* Color Mode Toggle */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleColorMode}
                  className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  aria-label={useColorTheme ? 'Switch to professional mode' : 'Switch to Mercy Blade colors'}
                >
                  <Palette className="w-4 h-4" aria-hidden="true" />
                  {useColorTheme ? 'Professional' : 'Mercy Blade Colors'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domain.rooms.map((room, index) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomClick(room.id)}
                    className="group relative p-6 rounded-lg border transition-all duration-300 text-left backdrop-blur-sm"
                    style={
                      useColorTheme
                        ? {
                            borderColor: '#475569',
                            background: 'rgba(51, 65, 85, 0.5)',
                          }
                        : {
                            borderColor: '#1e293b',
                            background: '#0f172a',
                          }
                    }
                    aria-label={`${room.title_en} - ${room.title_vi}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-white group-hover:text-slate-100 transition-colors leading-snug">
                          {useColorTheme ? highlightShortTitle(room.title_en, index, false) : room.title_en}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {useColorTheme ? highlightShortTitle(room.title_vi, index, true) : room.title_vi}
                        </p>
                      </div>
                      {canAccessVIP9 ? (
                        <Unlock className="h-5 w-5 text-slate-400 group-hover:text-white flex-shrink-0 transition-colors" aria-hidden="true" />
                      ) : (
                        <Lock className="h-5 w-5 text-slate-600 flex-shrink-0" aria-hidden="true" />
                      )}
                    </div>
                    
                    {/* Subtle hover effect line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
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
              aria-label="Access VIP9 Strategic Mastery"
            >
              Access VIP9 Strategic Mastery
            </Button>
          </div>
        )}
        </RoomLoadShell>
      </div>
    </div>
  );
};

export default RoomsVIP9;
