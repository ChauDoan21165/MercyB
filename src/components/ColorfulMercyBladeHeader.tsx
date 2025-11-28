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
  { id: 'universe', label: 'Universe', tier: null, height: 40 },
  { id: 'vip9', label: 'VIP9 Crown', tier: 'vip9', height: 50 },
  { id: 'vip8', label: 'VIP8 Eyes', tier: 'vip8', height: 50 },
  { id: 'vip7', label: 'VIP7 Mouth', tier: 'vip7', height: 50 },
  { id: 'vip6', label: 'VIP6 Neck', tier: 'vip6', height: 40 },
  { id: 'vip5', label: 'VIP5 Chest', tier: 'vip5', height: 60 },
  { id: 'vip4', label: 'VIP4 Belly', tier: 'vip4', height: 50 },
  { id: 'vip3', label: 'VIP3 Hips', tier: 'vip3', height: 50 },
  { id: 'vip2', label: 'VIP2 Knees', tier: 'vip2', height: 50 },
  { id: 'vip1', label: 'VIP1 Shins', tier: 'vip1', height: 50 },
  { id: 'free', label: 'Free Feet', tier: 'free', height: 50 },
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
              <DropdownMenuContent align="end" className="w-[95vw] max-w-[1200px] bg-background border-2 z-50 p-0 overflow-hidden">
                {/* Header with B&W Toggle */}
                <div className="flex items-center justify-between p-4 border-b">
                  <DropdownMenuLabel className="text-lg font-bold m-0">
                    Mercy Blade Human Body Pathway
                  </DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bw-mode" className="text-sm">B&W Mode</Label>
                    <Switch 
                      id="bw-mode"
                      checked={isBlackWhiteMode}
                      onCheckedChange={setIsBlackWhiteMode}
                    />
                  </div>
                </div>

                {/* Main Body Pathway Layout */}
                <div className="relative flex gap-0 h-[600px] overflow-hidden">
                  {/* Human Silhouette in Background */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[200px] -ml-[100px] pointer-events-none z-0">
                    <svg 
                      viewBox="0 0 200 600" 
                      className="w-full h-full opacity-20"
                      preserveAspectRatio="xMidYMin meet"
                    >
                      {/* Rainbow gradient spine */}
                      <defs>
                        <linearGradient id="spineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#E91E63" />
                          <stop offset="14%" stopColor="#9C27B0" />
                          <stop offset="28%" stopColor="#3F51B5" />
                          <stop offset="42%" stopColor="#2196F3" />
                          <stop offset="57%" stopColor="#00BCD4" />
                          <stop offset="71%" stopColor="#4CAF50" />
                          <stop offset="85%" stopColor="#FFC107" />
                          <stop offset="100%" stopColor="#FF9800" />
                        </linearGradient>
                      </defs>
                      
                      {/* Soft body outline */}
                      <ellipse cx="100" cy="30" rx="25" ry="30" fill="currentColor" opacity="0.1" />
                      <ellipse cx="100" cy="80" rx="20" ry="25" fill="currentColor" opacity="0.1" />
                      <ellipse cx="100" cy="140" rx="22" ry="30" fill="currentColor" opacity="0.1" />
                      <ellipse cx="100" cy="230" rx="35" ry="60" fill="currentColor" opacity="0.1" />
                      <ellipse cx="100" cy="350" rx="32" ry="55" fill="currentColor" opacity="0.1" />
                      <ellipse cx="85" cy="480" rx="15" ry="70" fill="currentColor" opacity="0.1" />
                      <ellipse cx="115" cy="480" rx="15" ry="70" fill="currentColor" opacity="0.1" />
                      
                      {/* Rainbow spine line */}
                      {!isBlackWhiteMode && (
                        <line 
                          x1="100" y1="20" 
                          x2="100" y2="580" 
                          stroke="url(#spineGradient)" 
                          strokeWidth="3" 
                          opacity="0.6"
                        />
                      )}
                      {isBlackWhiteMode && (
                        <line 
                          x1="100" y1="20" 
                          x2="100" y2="580" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          opacity="0.2"
                        />
                      )}
                    </svg>
                  </div>

                  {/* Left Column: English Learning Pathway */}
                  <div className="flex-1 overflow-y-auto border-r relative z-10">
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-4 py-2 border-b z-20">
                      <h3 className={`text-sm font-bold ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`}>
                        English Learning Pathway
                      </h3>
                    </div>
                    <div className="p-2 space-y-1">
                      {/* Zone: Free */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'free' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-blue-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('free')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/english-pathway')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                        >
                          <GraduationCap className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>English Foundation</div>
                            <div className="text-xs text-muted-foreground">Free tier • A0-A1</div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Zone: VIP1 */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip1' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-blue-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip1')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/english-pathway')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                        >
                          <GraduationCap className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>A1 Beginner</div>
                            <div className="text-xs text-muted-foreground">VIP1 bonus</div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Zone: VIP2 */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip2' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-blue-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip2')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/english-pathway')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                        >
                          <GraduationCap className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>A2 + B1 Intermediate</div>
                            <div className="text-xs text-muted-foreground">VIP2 bonus</div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Zone: VIP3 */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip3' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-blue-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip3')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/english-pathway')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                        >
                          <GraduationCap className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>B2 + C1 + C2 Advanced</div>
                            <div className="text-xs text-muted-foreground">VIP3 bonus</div>
                          </div>
                        </DropdownMenuItem>
                        
                        <div className="mt-2 border-t pt-2">
                          <DropdownMenuItem 
                            onClick={() => navigate('/kids-level1')}
                            className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                          >
                            <Baby className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                            <div>
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Kids Level 1</div>
                              <div className="text-xs text-muted-foreground">Ages 4-7</div>
                            </div>
                          </DropdownMenuItem>

                          <DropdownMenuItem 
                            onClick={() => navigate('/kids-level2')}
                            className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                          >
                            <School className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                            <div>
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Kids Level 2</div>
                              <div className="text-xs text-muted-foreground">Ages 7-10</div>
                            </div>
                          </DropdownMenuItem>

                          <DropdownMenuItem 
                            onClick={() => navigate('/kids-level3')}
                            className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                          >
                            <GraduationCap className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                            <div>
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Kids Level 3</div>
                              <div className="text-xs text-muted-foreground">Ages 10-13</div>
                            </div>
                          </DropdownMenuItem>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Core Tiers */}
                  <div className="flex-1 overflow-y-auto border-r relative z-10">
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-4 py-2 border-b z-20">
                      <h3 className={`text-sm font-bold ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>
                        Core Tier Levels
                      </h3>
                    </div>
                    <div className="p-2 space-y-1">
                      {/* Zone: Universe */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'universe' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-purple-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('universe')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <div className="px-3 py-2">
                          <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Universe</div>
                          <div className="text-xs text-muted-foreground">Coming soon</div>
                        </div>
                      </div>

                      {/* Zone: VIP9 Crown */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip9' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-slate-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip9')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/rooms-vip9')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-slate-50 hover:border-slate-600'}`}
                        >
                          <TrendingUp className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-slate-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP9 Strategic Mastery <span className="text-[10px] text-muted-foreground">$150</span></div>
                            <div className="text-xs text-muted-foreground">Crown • Executive Strategy</div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Zone: VIP8 Eyes */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip8' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-indigo-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip8')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <div className="px-3 py-2">
                          <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP8</div>
                          <div className="text-xs text-muted-foreground">Eyes • Coming soon</div>
                        </div>
                      </div>

                      {/* Zone: VIP7 Mouth */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip7' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-pink-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip7')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <div className="px-3 py-2">
                          <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP7</div>
                          <div className="text-xs text-muted-foreground">Mouth • Coming soon</div>
                        </div>
                      </div>

                      {/* Zone: VIP6 Neck */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip6' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-purple-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip6')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/vip6')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-purple-50 hover:border-purple-600'}`}
                        >
                          <Brain className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-purple-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP6 Psychology <span className="text-[10px] text-muted-foreground">$90</span></div>
                            <div className="text-xs text-muted-foreground">Neck • Deep psychology</div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Zone: VIP5 Chest */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip5' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-emerald-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip5')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/rooms-vip5')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-emerald-50 hover:border-emerald-600'}`}
                        >
                          <Feather className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-emerald-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP5 Writing <span className="text-[10px] text-muted-foreground">$70</span></div>
                            <div className="text-xs text-muted-foreground">Chest • Writing support</div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Zone: VIP4 Belly */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip4' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-orange-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip4')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/rooms-vip4')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-orange-50 hover:border-orange-600'}`}
                        >
                          <Rocket className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-orange-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP4 CareerZ <span className="text-[10px] text-muted-foreground">$50</span></div>
                            <div className="text-xs text-muted-foreground">Belly • Career coaching</div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Zone: VIP3 Hips */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip3' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-purple-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip3')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/rooms-vip3')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-purple-50 hover:border-purple-600'}`}
                        >
                          <Sparkles className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-purple-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP3 <span className="text-[10px] text-muted-foreground">$15</span></div>
                            <div className="text-xs text-muted-foreground">Hips • Unlimited rooms</div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Zone: VIP2 Knees */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip2' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-blue-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip2')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/rooms-vip2')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                        >
                          <Gem className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP2 <span className="text-[10px] text-muted-foreground">$6</span></div>
                            <div className="text-xs text-muted-foreground">Knees • 25 rooms/month</div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Zone: VIP1 Shins */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'vip1' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-yellow-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('vip1')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/rooms-vip1')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-yellow-50 hover:border-yellow-600'}`}
                        >
                          <Star className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-yellow-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP1 <span className="text-[10px] text-muted-foreground">$3</span></div>
                            <div className="text-xs text-muted-foreground">Shins • 10 rooms/month</div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Zone: Free Feet */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'free' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-green-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('free')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/rooms')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-green-50 hover:border-green-600'}`}
                        >
                          <Crown className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-green-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Free <span className="text-[10px] text-muted-foreground">$0</span></div>
                            <div className="text-xs text-muted-foreground">Feet • Basic rooms</div>
                          </div>
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Life Skills & Survival */}
                  <div className="flex-1 overflow-y-auto relative z-10">
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-4 py-2 border-b z-20">
                      <h3 className={`text-sm font-bold ${isBlackWhiteMode ? 'text-black' : 'text-red-600'}`}>
                        Life Skills & Survival
                      </h3>
                    </div>
                    <div className="p-2 space-y-1">
                      {/* Zone: Free */}
                      <div 
                        className={`transition-all duration-200 ${hoveredZone === 'free' ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-red-50/50 shadow-lg') : ''}`}
                        onMouseEnter={() => setHoveredZone('free')}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <DropdownMenuItem 
                          onClick={() => navigate('/rooms')}
                          className={`cursor-pointer transition-all border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-red-50 hover:border-red-600'}`}
                        >
                          <Shield className={`mr-2 h-4 w-4 ${isBlackWhiteMode ? 'text-black' : 'text-red-600'}`} />
                          <div>
                            <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Survival & Resilience</div>
                            <div className="text-xs text-muted-foreground">Free bonus • 15 rooms</div>
                          </div>
                        </DropdownMenuItem>
                      </div>
                    </div>
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
