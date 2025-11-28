import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, UserPlus, Crown, Star, Gem, Sparkles, Rocket, Feather, Brain, Baby, GraduationCap, School, Gift, TrendingUp, Shield, Eye } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [isBlackWhiteMode, setIsBlackWhiteMode] = useState(false);

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
              <DropdownMenuContent align="end" className="w-[95vw] max-w-[1400px] bg-background border-2 z-50 p-0">
                {/* Header with B&W Toggle */}
                <div className="flex items-center justify-between p-4 border-b">
                  <DropdownMenuLabel className="text-base font-bold m-0">
                    Mercy Blade Tier System
                  </DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bw-mode" className="text-xs">B&W</Label>
                    <Switch 
                      id="bw-mode"
                      checked={isBlackWhiteMode}
                      onCheckedChange={setIsBlackWhiteMode}
                    />
                  </div>
                </div>

                {/* 100×100 COORDINATE GRID - EXACT POSITIONING */}
                <div className="relative w-full h-[600px] border-t">
                  
                  {/* Human Body Silhouette - Centered at X=50, Y=10→96 */}
                  <svg 
                    className="absolute pointer-events-none opacity-10" 
                    style={{ 
                      left: '35%', 
                      top: '10%',
                      width: '30%',
                      height: '86%'
                    }}
                    viewBox="0 0 100 600"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="spineRainbow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff0000" />
                        <stop offset="20%" stopColor="#ff7f00" />
                        <stop offset="40%" stopColor="#ffff00" />
                        <stop offset="60%" stopColor="#00ff00" />
                        <stop offset="80%" stopColor="#0000ff" />
                        <stop offset="100%" stopColor="#9400d3" />
                      </linearGradient>
                    </defs>
                    
                    {/* Head */}
                    <ellipse cx="50" cy="30" rx="15" ry="20" fill="none" stroke="currentColor" strokeWidth="1" />
                    
                    {/* Spine - centered vertical line */}
                    <line 
                      x1="50" y1="50" x2="50" y2="550" 
                      stroke={isBlackWhiteMode ? 'currentColor' : 'url(#spineRainbow)'} 
                      strokeWidth="2" 
                    />
                    
                    {/* Body outline */}
                    <path
                      d="M 30 50 L 30 250 Q 30 350 35 450 L 35 550 M 70 50 L 70 250 Q 70 350 65 450 L 65 550"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    
                    {/* Arms */}
                    <line x1="30" y1="100" x2="15" y2="180" stroke="currentColor" strokeWidth="1" />
                    <line x1="70" y1="100" x2="85" y2="180" stroke="currentColor" strokeWidth="1" />
                    
                    {/* Legs */}
                    <line x1="35" y1="550" x2="30" y2="600" stroke="currentColor" strokeWidth="1" />
                    <line x1="65" y1="550" x2="70" y2="600" stroke="currentColor" strokeWidth="1" />
                  </svg>

                  {/* ENGLISH PATHWAY - LEFT COLUMN (X 3→25) */}
                  <div className="absolute" style={{ left: '3%', top: '10%', width: '22%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/free')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>English Foundation</div>
                      <div className="text-[10px] text-muted-foreground">Free</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '3%', top: '20%', width: '22%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip1')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>A1 Beginner</div>
                      <div className="text-[10px] text-muted-foreground">VIP1 bonus</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '3%', top: '30%', width: '22%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip2')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>A2 + B1</div>
                      <div className="text-[10px] text-muted-foreground">VIP2 bonus</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '3%', top: '40%', width: '22%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip3')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>B2 + C1 + C2</div>
                      <div className="text-[10px] text-muted-foreground">VIP3 bonus</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '3%', top: '60%', width: '22%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/kids/level1')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Kids L1</div>
                      <div className="text-[10px] text-muted-foreground">ages 4–7</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '3%', top: '68%', width: '22%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/kids/level2')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Kids L2</div>
                      <div className="text-[10px] text-muted-foreground">ages 7–10</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '3%', top: '78%', width: '22%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/kids/level3')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Kids L3</div>
                      <div className="text-[10px] text-muted-foreground">ages 10–13</div>
                    </DropdownMenuItem>
                  </div>

                  {/* HUMAN BODY TIER MAP - MIDDLE COLUMN (X 40→60) */}
                  <div className="absolute" style={{ left: '40%', top: '2%', width: '20%', height: '6%' }}>
                    <div className="h-full p-2 rounded border text-center cursor-default opacity-50">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Universe</div>
                      <div className="text-[10px] text-muted-foreground">Above Head</div>
                    </div>
                  </div>
                  
                  <div className="absolute" style={{ left: '40%', top: '10%', width: '20%', height: '5%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip9')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50 text-center">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP9</div>
                      <div className="text-[10px] text-muted-foreground">Crown</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '40%', top: '17%', width: '20%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip8')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50 text-center">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP8</div>
                      <div className="text-[10px] text-muted-foreground">Eyes</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '40%', top: '24%', width: '20%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip7')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50 text-center">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP7</div>
                      <div className="text-[10px] text-muted-foreground">Mouth</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '40%', top: '31%', width: '20%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip6')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50 text-center">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP6 Psychology</div>
                      <div className="text-[10px] text-muted-foreground">Neck</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '40%', top: '39%', width: '20%', height: '8%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip5')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50 text-center">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP5 Writing</div>
                      <div className="text-[10px] text-muted-foreground">Chest</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '40%', top: '50%', width: '20%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip4')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50 text-center">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP4 CareerZ</div>
                      <div className="text-[10px] text-muted-foreground">Belly</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '40%', top: '60%', width: '20%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip3')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50 text-center">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP3</div>
                      <div className="text-[10px] text-muted-foreground">Hips</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '40%', top: '71%', width: '20%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip2')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50 text-center">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP2</div>
                      <div className="text-[10px] text-muted-foreground">Knees</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '40%', top: '81%', width: '20%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip1')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50 text-center">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP1</div>
                      <div className="text-[10px] text-muted-foreground">Shins</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '40%', top: '90%', width: '20%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/free')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50 text-center">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Free</div>
                      <div className="text-[10px] text-muted-foreground">Feet</div>
                    </DropdownMenuItem>
                  </div>

                  {/* LIFE SKILLS & SURVIVAL - RIGHT COLUMN (X 75→97) */}
                  <div className="absolute" style={{ left: '75%', top: '20%', width: '22%', height: '6%' }}>
                    <DropdownMenuItem onClick={() => navigate('/rooms/free')} className="cursor-pointer h-full p-2 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Survival & Resilience</div>
                      <div className="text-[10px] text-muted-foreground">Free bonus</div>
                    </DropdownMenuItem>
                  </div>
                  
                  <div className="absolute" style={{ left: '75%', top: '32%', width: '22%', height: '6%' }}>
                    <div className="h-full p-2 rounded border opacity-50 cursor-default">
                      <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Future life-skills</div>
                      <div className="text-[10px] text-muted-foreground">coming soon</div>
                    </div>
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
