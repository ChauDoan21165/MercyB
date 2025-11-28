import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, UserPlus, Crown, Star, Gem, Sparkles, Rocket, Feather, Brain, Baby, GraduationCap, School, Gift, TrendingUp, Shield, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { AnimatedTierBadge } from './AnimatedTierBadge';
import { useUserAccess } from '@/hooks/useUserAccess';
import { ThemeToggle } from '@/components/ThemeToggle';
import tierMapImage from '@/assets/tier-map-original.jpeg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColorfulMercyBladeHeaderProps {
  subtitle?: string;
  showBackButton?: boolean;
  showResetButton?: boolean;
  onReset?: () => void;
}

// TIER SYSTEM PAGE - EXACT LAYOUT (DO NOT MODIFY)
// Three equal columns: English Pathway | Human Body Tier Map | Life Skills & Survival

export const ColorfulMercyBladeHeader = ({
  subtitle,
  showBackButton = false,
  showResetButton = false,
  onReset,
}: ColorfulMercyBladeHeaderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { tier } = useUserAccess();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-4 px-6">
      <div className="max-w-7xl mx-auto relative flex items-center justify-between">
        {/* Left side - Back and Home Buttons */}
        <div className="flex-none flex items-center gap-2">
          {showBackButton && (
            <>
              <Button
                onClick={() => navigate('/')}
                size="sm"
                variant="outline"
                className="gap-1.5 min-w-[80px]"
              >
                <Crown className="w-4 h-4" />
                Home
              </Button>
              <Button
                onClick={() => navigate(-1)}
                size="sm"
                className="gap-1.5 bg-gray-900 hover:bg-gray-800 text-white min-w-[80px]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </>
          )}
        </div>

        {/* Center - Title */}
        <div className="flex-1 text-center px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            <span className="inline-block animate-fade-in" style={{ color: '#E91E63' }}>M</span>
            <span className="inline-block animate-fade-in" style={{ color: '#9C27B0', animationDelay: '0.1s' }}>e</span>
            <span className="inline-block animate-fade-in" style={{ color: '#3F51B5', animationDelay: '0.2s' }}>r</span>
            <span className="inline-block animate-fade-in" style={{ color: '#2196F3', animationDelay: '0.3s' }}>c</span>
            <span className="inline-block animate-fade-in" style={{ color: '#00BCD4', animationDelay: '0.4s' }}>y</span>
            <span className="inline-block mx-1 sm:mx-2"></span>
            <span className="inline-block animate-fade-in" style={{ color: '#009688', animationDelay: '0.5s' }}>B</span>
            <span className="inline-block animate-fade-in" style={{ color: '#4CAF50', animationDelay: '0.6s' }}>l</span>
            <span className="inline-block animate-fade-in" style={{ color: '#8BC34A', animationDelay: '0.7s' }}>a</span>
            <span className="inline-block animate-fade-in" style={{ color: '#FFC107', animationDelay: '0.8s' }}>d</span>
            <span className="inline-block animate-fade-in" style={{ color: '#FF9800', animationDelay: '0.9s' }}>e</span>
          </h1>
          {subtitle && (
            <p className="text-center text-sm text-gray-600 mt-2">{subtitle}</p>
          )}
        </div>

        {/* Right side - Sign Up / User Info / Reset */}
        <div className="flex-none w-24 flex justify-end items-center gap-2">
          <ThemeToggle />
          
          {showResetButton && onReset && (
            <Button
              onClick={onReset}
              size="sm"
              className="gap-2 bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
              title="Reset cached configuration"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          
          {!user ? (
            <Button
              onClick={() => navigate('/auth')}
              size="sm"
              className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Up</span>
              <span className="hidden sm:inline text-xs">/ Đăng ký</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-2">
                  Tier/Gói
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[95vw] max-w-[1000px] bg-background border-2 z-50 p-0">
                {/* Header */}
                <div className="p-4 border-b">
                  <DropdownMenuLabel className="text-base font-bold m-0">
                    Mercy Blade Tier Map
                  </DropdownMenuLabel>
                  <p className="text-xs text-muted-foreground mt-1">Click on any tier to navigate</p>
                </div>

                {/* Tier Map with Clickable Overlays */}
                <div className="relative p-4 overflow-auto max-h-[80vh]">
                  {/* Background Image - Original Drawing */}
                  <img 
                    src={tierMapImage} 
                    alt="Mercy Blade Tier Map" 
                    className="w-full h-auto"
                  />
                  
                  {/* Clickable Text Overlays - Positioned Exactly as in Drawing */}
                  
                  {/* TOP CENTER - Universe */}
                  <button
                    onClick={() => {}}
                    className="absolute cursor-default opacity-50"
                    style={{ left: '40%', top: '6%', fontSize: '11px', fontWeight: 'bold' }}
                    disabled
                  >
                    <div className="text-gray-700">Gods, Universe</div>
                    <div className="text-gray-600 text-[9px]">Chúa, Vũ trụ</div>
                  </button>

                  {/* LEFT SIDE - English Pathway */}
                  <button
                    onClick={() => navigate('/rooms/vip9')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '8%', top: '13%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">Strategy</div>
                    <div className="text-gray-700 text-[8px]">Chiến lược</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip9')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '8%', top: '16%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">Mind set</div>
                    <div className="text-gray-700 text-[8px]">Tư duy chiến lược</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip6')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '6%', top: '24%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">Psychology</div>
                    <div className="text-gray-700 text-[8px]">Tâm lý học</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip5')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '10%', top: '34%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">Writing</div>
                    <div className="text-gray-700 text-[8px]">Viết lách</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip4')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '10%', top: '42%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">CareerZ</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip3')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '5%', top: '50%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">B2 + C1 + C2</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip2')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '5%', top: '62%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">A2 + B1</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip1')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '8%', top: '68%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">A1</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/free')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '3%', top: '76%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">English Foundation</div>
                    <div className="text-gray-700 text-[8px]">Nền tảng tiếng Anh</div>
                  </button>

                  {/* CENTER SPINE - VIP Tiers */}
                  <button
                    onClick={() => navigate('/rooms/vip9')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '44%', top: '13%', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    VIP9
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip8')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '44%', top: '17%', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    VIP8
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip7')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '44%', top: '21%', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    VIP7
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip6')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '44%', top: '25%', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    VIP6
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip5')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '44%', top: '35%', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    VIP5
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip4')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '44%', top: '43%', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    VIP4
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip3')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '44%', top: '51%', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    VIP3
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip2')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '44%', top: '63%', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    VIP2
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip1')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '44%', top: '69%', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    VIP1
                  </button>

                  <button
                    onClick={() => navigate('/rooms/free')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '44%', top: '77%', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    Free
                  </button>

                  {/* RIGHT SIDE - Life Skills */}
                  <button
                    onClick={() => navigate('/rooms/vip6')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '68%', top: '24%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">Critical thinking</div>
                    <div className="text-gray-700 text-[8px]">Tư duy phản biện</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip5')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '72%', top: '33%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">Debates</div>
                    <div className="text-gray-700 text-[8px]">Tranh luận</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip4')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '68%', top: '42%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">Public speaking</div>
                    <div className="text-gray-700 text-[8px]">Nói trước công chúng</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/vip3')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '70%', top: '50%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">Martial arts</div>
                    <div className="text-gray-700 text-[8px]">Võ thuật</div>
                  </button>

                  <button
                    onClick={() => navigate('/rooms/free')}
                    className="absolute hover:bg-black/5 rounded px-2 py-1"
                    style={{ left: '68%', top: '77%', fontSize: '10px' }}
                  >
                    <div className="font-bold text-gray-900">Survival skills</div>
                    <div className="text-gray-700 text-[8px]">Kỹ năng sống tồn</div>
                  </button>

                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
