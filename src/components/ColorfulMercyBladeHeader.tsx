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

// Zone definitions for the human body pathway
const BODY_ZONES = [
  { id: 'universe', label: 'Universe', tier: null, height: 60, yStart: 0 },
  { id: 'vip9', label: 'VIP9', bodyPart: 'Crown', tier: 'vip9', height: 55, yStart: 60 },
  { id: 'vip8', label: 'VIP8', bodyPart: 'Eyes', tier: 'vip8', height: 55, yStart: 115 },
  { id: 'vip7', label: 'VIP7', bodyPart: 'Mouth', tier: 'vip7', height: 50, yStart: 170 },
  { id: 'vip6', label: 'VIP6', bodyPart: 'Neck', tier: 'vip6', height: 45, yStart: 220 },
  { id: 'vip5', label: 'VIP5', bodyPart: 'Chest', tier: 'vip5', height: 65, yStart: 265 },
  { id: 'vip4', label: 'VIP4', bodyPart: 'Belly', tier: 'vip4', height: 55, yStart: 330 },
  { id: 'vip3', label: 'VIP3', bodyPart: 'Hips', tier: 'vip3', height: 55, yStart: 385 },
  { id: 'vip2', label: 'VIP2', bodyPart: 'Knees', tier: 'vip2', height: 55, yStart: 440 },
  { id: 'vip1', label: 'VIP1', bodyPart: 'Shins', tier: 'vip1', height: 55, yStart: 495 },
  { id: 'free', label: 'Free', bodyPart: 'Feet', tier: 'free', height: 50, yStart: 550 },
];

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

                {/* THREE EQUAL COLUMNS - NO AUTO-SORTING */}
                <div className="grid grid-cols-3 divide-x h-[500px] overflow-y-auto">
                  
                  {/* LEFT COLUMN - English Pathway (FIXED ORDER) */}
                  <div className="p-4 space-y-3">
                    <h3 className={`text-sm font-bold mb-4 ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>
                      English Learning Pathway
                    </h3>
                    
                    <DropdownMenuItem onClick={() => navigate('/rooms/free')} className="cursor-pointer block p-3 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>English Foundation</div>
                      <div className="text-xs text-muted-foreground">Free</div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip1')} className="cursor-pointer block p-3 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>A1 Beginner</div>
                      <div className="text-xs text-muted-foreground">VIP1 bonus</div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip2')} className="cursor-pointer block p-3 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>A2 + B1 Intermediate</div>
                      <div className="text-xs text-muted-foreground">VIP2 bonus</div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/rooms/vip3')} className="cursor-pointer block p-3 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>B2 + C1 + C2 Advanced</div>
                      <div className="text-xs text-muted-foreground">VIP3 bonus</div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/kids/level1')} className="cursor-pointer block p-3 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Kids Level 1</div>
                      <div className="text-xs text-muted-foreground">ages 4–7</div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/kids/level2')} className="cursor-pointer block p-3 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Kids Level 2</div>
                      <div className="text-xs text-muted-foreground">ages 7–10</div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/kids/level3')} className="cursor-pointer block p-3 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Kids Level 3</div>
                      <div className="text-xs text-muted-foreground">ages 10–13</div>
                    </DropdownMenuItem>
                  </div>

                  {/* MIDDLE COLUMN - Human Body Tier Map */}
                  <div className="relative p-4">
                    <h3 className={`text-sm font-bold mb-4 text-center ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>
                      Human Body Tier Map
                    </h3>
                    
                    {/* Simple Human Silhouette Background */}
                    <svg viewBox="0 0 100 400" className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
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
                      
                      {/* Spine */}
                      <line 
                        x1="50" y1="50" x2="50" y2="320" 
                        stroke={isBlackWhiteMode ? 'currentColor' : 'url(#spineRainbow)'} 
                        strokeWidth="2" 
                      />
                      
                      {/* Body outline */}
                      <path
                        d="M 30 50 L 30 150 Q 30 200 35 250 L 35 320 M 70 50 L 70 150 Q 70 200 65 250 L 65 320"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                      
                      {/* Arms */}
                      <line x1="30" y1="80" x2="15" y2="120" stroke="currentColor" strokeWidth="1" />
                      <line x1="70" y1="80" x2="85" y2="120" stroke="currentColor" strokeWidth="1" />
                      
                      {/* Legs */}
                      <line x1="35" y1="320" x2="30" y2="380" stroke="currentColor" strokeWidth="1" />
                      <line x1="65" y1="320" x2="70" y2="380" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    
                    {/* Tier Items */}
                    <div className="relative space-y-2">
                      <div className="p-2 rounded border text-center cursor-default opacity-50">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Universe</div>
                        <div className="text-[10px] text-muted-foreground">Above Head • coming soon</div>
                      </div>
                      
                      <DropdownMenuItem onClick={() => navigate('/rooms/vip9')} className="cursor-pointer p-2 rounded border hover:bg-muted/50 text-center">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP9</div>
                        <div className="text-[10px] text-muted-foreground">Crown</div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/rooms/vip8')} className="cursor-pointer p-2 rounded border hover:bg-muted/50 text-center">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP8</div>
                        <div className="text-[10px] text-muted-foreground">Eyes</div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/rooms/vip7')} className="cursor-pointer p-2 rounded border hover:bg-muted/50 text-center">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP7</div>
                        <div className="text-[10px] text-muted-foreground">Mouth</div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/rooms/vip6')} className="cursor-pointer p-2 rounded border hover:bg-muted/50 text-center">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP6 Psychology</div>
                        <div className="text-[10px] text-muted-foreground">Neck</div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/rooms/vip5')} className="cursor-pointer p-2 rounded border hover:bg-muted/50 text-center">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP5 Writing</div>
                        <div className="text-[10px] text-muted-foreground">Chest</div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/rooms/vip4')} className="cursor-pointer p-2 rounded border hover:bg-muted/50 text-center">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP4 CareerZ</div>
                        <div className="text-[10px] text-muted-foreground">Belly</div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/rooms/vip3')} className="cursor-pointer p-2 rounded border hover:bg-muted/50 text-center">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP3</div>
                        <div className="text-[10px] text-muted-foreground">Hips</div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/rooms/vip2')} className="cursor-pointer p-2 rounded border hover:bg-muted/50 text-center">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP2</div>
                        <div className="text-[10px] text-muted-foreground">Knees</div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/rooms/vip1')} className="cursor-pointer p-2 rounded border hover:bg-muted/50 text-center">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>VIP1</div>
                        <div className="text-[10px] text-muted-foreground">Shins</div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/rooms/free')} className="cursor-pointer p-2 rounded border hover:bg-muted/50 text-center">
                        <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Free</div>
                        <div className="text-[10px] text-muted-foreground">Feet</div>
                      </DropdownMenuItem>
                    </div>
                  </div>

                  {/* RIGHT COLUMN - Life Skills & Survival */}
                  <div className="p-4 space-y-3">
                    <h3 className={`text-sm font-bold mb-4 ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>
                      Life Skills & Survival
                    </h3>
                    
                    <DropdownMenuItem onClick={() => navigate('/rooms/free')} className="cursor-pointer block p-3 rounded border hover:bg-muted/50">
                      <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>Survival & Resilience</div>
                      <div className="text-xs text-muted-foreground">Free bonus</div>
                    </DropdownMenuItem>
                    
                    <div className="block p-3 rounded border opacity-50 cursor-default">
                      <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-foreground'}`}>(Future life-skill rooms)</div>
                      <div className="text-xs text-muted-foreground">coming soon</div>
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
