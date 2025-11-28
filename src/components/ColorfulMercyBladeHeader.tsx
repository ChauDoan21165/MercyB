import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, UserPlus, Crown, Star, Gem, Sparkles, Rocket, Feather, Brain, Baby, GraduationCap, School, Gift, TrendingUp, Shield, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { AnimatedTierBadge } from './AnimatedTierBadge';
import { useUserAccess } from '@/hooks/useUserAccess';
import { ThemeToggle } from '@/components/ThemeToggle';
import tierMapImage from '@/assets/tier-map-skeleton.png';
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
              <DropdownMenuContent align="end" className="w-[95vw] max-w-[900px] bg-background border-2 z-50 p-0">
                {/* Header */}
                <div className="p-4 border-b">
                  <DropdownMenuLabel className="text-base font-bold m-0">
                    Mercy Blade Tier Map
                  </DropdownMenuLabel>
                  <p className="text-xs text-muted-foreground mt-1">Tree map showing tier hierarchy from feet to head</p>
                </div>

                {/* Tier Map Image */}
                <div className="p-4 overflow-auto max-h-[80vh] bg-[#F3E9D2]">
                  <img 
                    src={tierMapImage} 
                    alt="Mercy Blade Tier Map - Tree structure showing tier hierarchy from Free to VIP9 and Universe, with English Pathway on left and Life Skills on right" 
                    className="w-full h-auto rounded"
                  />
                </div>

                {/* Quick Navigation Links */}
                <div className="p-4 border-t bg-muted/30">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <DropdownMenuItem onClick={() => navigate('/rooms/free')} className="cursor-pointer p-2 rounded border hover:bg-background">
                      <div className="font-bold text-xs">Free</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip1')} className="cursor-pointer p-2 rounded border hover:bg-background">
                      <div className="font-bold text-xs">VIP1</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip2')} className="cursor-pointer p-2 rounded border hover:bg-background">
                      <div className="font-bold text-xs">VIP2</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip3')} className="cursor-pointer p-2 rounded border hover:bg-background">
                      <div className="font-bold text-xs">VIP3</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip4')} className="cursor-pointer p-2 rounded border hover:bg-background">
                      <div className="font-bold text-xs">VIP4</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip5')} className="cursor-pointer p-2 rounded border hover:bg-background">
                      <div className="font-bold text-xs">VIP5</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip6')} className="cursor-pointer p-2 rounded border hover:bg-background">
                      <div className="font-bold text-xs">VIP6</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip9')} className="cursor-pointer p-2 rounded border hover:bg-background">
                      <div className="font-bold text-xs">VIP9</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/kids/level1')} className="cursor-pointer p-2 rounded border hover:bg-background">
                      <div className="font-bold text-xs">Kids</div>
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
