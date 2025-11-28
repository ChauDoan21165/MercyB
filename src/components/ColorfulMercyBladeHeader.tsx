import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, UserPlus, Crown, Star, Gem, Sparkles, Rocket, Feather, Brain, Baby, GraduationCap, School, Gift, TrendingUp, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { AnimatedTierBadge } from './AnimatedTierBadge';
import { useUserAccess } from '@/hooks/useUserAccess';
import { ThemeToggle } from '@/components/ThemeToggle';
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
              <DropdownMenuContent align="end" className="w-[900px] bg-popover z-50 animate-scale-in">
                <DropdownMenuLabel className="text-center font-bold animate-fade-in">
                  Explore Tiers / Khám Phá Gói
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Three-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
                  {/* Column 1: English Learning Pathway */}
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 text-xs font-semibold text-blue-600">
                      English Learning Pathway
                    </div>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/english-pathway')}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 border-l-2 border-transparent hover:border-blue-600"
                    >
                      <GraduationCap className="mr-2 h-4 w-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">English Foundation</span>
                        <span className="text-xs text-muted-foreground">Free tier</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/english-pathway')}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 border-l-2 border-transparent hover:border-blue-600"
                    >
                      <GraduationCap className="mr-2 h-4 w-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">A1 Beginner</span>
                        <span className="text-xs text-muted-foreground">VIP1 bonus</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/english-pathway')}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 border-l-2 border-transparent hover:border-blue-600"
                    >
                      <GraduationCap className="mr-2 h-4 w-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">A2 + B1 Intermediate</span>
                        <span className="text-xs text-muted-foreground">VIP2 bonus</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/english-pathway')}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 border-l-2 border-transparent hover:border-blue-600"
                    >
                      <GraduationCap className="mr-2 h-4 w-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">B2 + C1 + C2 Advanced</span>
                        <span className="text-xs text-muted-foreground">VIP3 bonus</span>
                      </div>
                    </DropdownMenuItem>

                    <div className="my-2 border-t"></div>

                    <DropdownMenuItem 
                      onClick={() => navigate('/kids-level1')}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 border-l-2 border-transparent hover:border-blue-600"
                    >
                      <Baby className="mr-2 h-4 w-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">Kids Level 1</span>
                        <span className="text-xs text-muted-foreground">Ages 4-7 • VIP3 bonus</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/kids-level2')}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 border-l-2 border-transparent hover:border-blue-600"
                    >
                      <School className="mr-2 h-4 w-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">Kids Level 2</span>
                        <span className="text-xs text-muted-foreground">Ages 7-10 • VIP3 bonus</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/kids-level3')}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 border-l-2 border-transparent hover:border-blue-600"
                    >
                      <GraduationCap className="mr-2 h-4 w-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">Kids Level 3</span>
                        <span className="text-xs text-muted-foreground">Ages 10-13 • VIP3 bonus</span>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  {/* Column 2: Core Tiers */}
                  <div className="space-y-1 border-l pl-4">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Core Tiers
                    </div>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/rooms')}
                      className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900 transition-all duration-200 border-l-2 border-transparent hover:border-green-600"
                    >
                      <Crown className="mr-2 h-4 w-4 text-green-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">Free <span className="text-[10px] text-muted-foreground">$0</span></span>
                        <span className="text-xs text-muted-foreground">Basic rooms</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/rooms-vip1')}
                      className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900 transition-all duration-200 border-l-2 border-transparent hover:border-yellow-600"
                    >
                      <Star className="mr-2 h-4 w-4 text-yellow-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">VIP1 <span className="text-[10px] text-muted-foreground">$3</span></span>
                        <span className="text-xs text-muted-foreground">10 rooms/month</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/rooms-vip2')}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 border-l-2 border-transparent hover:border-blue-600"
                    >
                      <Gem className="mr-2 h-4 w-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">VIP2 <span className="text-[10px] text-muted-foreground">$6</span></span>
                        <span className="text-xs text-muted-foreground">25 rooms/month</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/rooms-vip3')}
                      className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900 transition-all duration-200 border-l-2 border-transparent hover:border-purple-600"
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">VIP3 <span className="text-[10px] text-muted-foreground">$15</span></span>
                        <span className="text-xs text-muted-foreground">Unlimited rooms</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/rooms-vip4')}
                      className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900 transition-all duration-200 border-l-2 border-transparent hover:border-orange-600"
                    >
                      <Rocket className="mr-2 h-4 w-4 text-orange-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">VIP4 CareerZ <span className="text-[10px] text-muted-foreground">$50</span></span>
                        <span className="text-xs text-muted-foreground">Career coaching</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/rooms-vip5')}
                      className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-all duration-200 border-l-2 border-transparent hover:border-emerald-600"
                    >
                      <Feather className="mr-2 h-4 w-4 text-emerald-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">VIP5 Writing <span className="text-[10px] text-muted-foreground">$70</span></span>
                        <span className="text-xs text-muted-foreground">Writing support</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/vip6')}
                      className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900 transition-all duration-200 border-l-2 border-transparent hover:border-purple-600"
                    >
                      <Brain className="mr-2 h-4 w-4 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">VIP6 Psychology <span className="text-[10px] text-muted-foreground">$90</span></span>
                        <span className="text-xs text-muted-foreground">Deep psychology</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/rooms-vip9')}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200 border-l-2 border-transparent hover:border-slate-600"
                    >
                      <TrendingUp className="mr-2 h-4 w-4 text-slate-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">VIP9 Strategic Mastery <span className="text-[10px] text-muted-foreground">$150</span></span>
                        <span className="text-xs text-muted-foreground">Executive Strategy</span>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  {/* Column 3: Life Skills & Survival */}
                  <div className="space-y-1 border-l pl-4">
                    <div className="px-2 py-1.5 text-xs font-semibold text-red-600">
                      Life Skills & Survival
                    </div>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/rooms')}
                      className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900 transition-all duration-200 border-l-2 border-transparent hover:border-red-600"
                    >
                      <Shield className="mr-2 h-4 w-4 text-red-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">Survival & Resilience</span>
                        <span className="text-xs text-muted-foreground">Free bonus • 15 rooms</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => navigate('/redeem-gift')}
                  className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900 dark:hover:to-pink-900 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                >
                  <Gift className="mr-2 h-4 w-4 text-purple-600 transition-transform duration-200 group-hover:scale-110" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-purple-600">Redeem Gift Code</span>
                    <span className="text-xs text-muted-foreground">Enter your gift code</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/subscribe')}
                  className="cursor-pointer hover:bg-primary/10 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                >
                  <span className="font-semibold text-primary">Upgrade / Nâng cấp</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
