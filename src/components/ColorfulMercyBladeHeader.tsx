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
              <DropdownMenuContent align="end" className="w-[95vw] max-w-[1400px] bg-background border-2 z-50 p-0 overflow-hidden">
                {/* Header with B&W Toggle */}
                <div className="flex items-center justify-between p-3 border-b bg-background">
                  <DropdownMenuLabel className="text-base font-bold m-0">
                    Mercy Blade Human Growth Map
                  </DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bw-mode" className="text-xs font-medium">B&W</Label>
                    <Switch 
                      id="bw-mode"
                      checked={isBlackWhiteMode}
                      onCheckedChange={setIsBlackWhiteMode}
                    />
                  </div>
                </div>

                {/* Main Body Pathway Layout - 3 Equal Columns with Fixed Center Silhouette */}
                <div className="relative h-[600px] grid grid-cols-[1fr_auto_1fr] overflow-hidden">
                  
                  {/* LEFT COLUMN - English Pathway (scrollable, transparent bg) */}
                  <div className="relative overflow-y-auto bg-transparent">
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-3 py-2 border-b z-20">
                      <h3 className={`text-xs font-bold ${isBlackWhiteMode ? 'text-black' : 'text-blue-700'}`}>
                        English Pathway
                      </h3>
                    </div>
                    
                    {/* Zone-aligned items */}
                    {BODY_ZONES.map((zone) => (
                      <div
                        key={`left-${zone.id}`}
                        style={{ height: `${zone.height}px` }}
                        className={`relative border-b border-border/10 transition-all duration-200 ${
                          hoveredZone === zone.id ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-blue-50/30') : ''
                        }`}
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        {/* Free = English Foundation */}
                        {zone.id === 'free' && (
                          <DropdownMenuItem 
                            onClick={() => navigate('/english-pathway')}
                            className={`h-full flex items-center cursor-pointer border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                          >
                            <GraduationCap className={`mr-2 h-4 w-4 flex-shrink-0 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>English Foundation</div>
                              <div className="text-[10px] text-muted-foreground">Free • A0-A1</div>
                            </div>
                          </DropdownMenuItem>
                        )}
                        
                        {/* VIP1 = A1 */}
                        {zone.id === 'vip1' && (
                          <DropdownMenuItem 
                            onClick={() => navigate('/english-pathway')}
                            className={`h-full flex items-center cursor-pointer border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                          >
                            <GraduationCap className={`mr-2 h-4 w-4 flex-shrink-0 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>A1 Beginner</div>
                              <div className="text-[10px] text-muted-foreground">VIP1 bonus</div>
                            </div>
                          </DropdownMenuItem>
                        )}
                        
                        {/* VIP2 = A2 + B1 */}
                        {zone.id === 'vip2' && (
                          <DropdownMenuItem 
                            onClick={() => navigate('/english-pathway')}
                            className={`h-full flex items-center cursor-pointer border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                          >
                            <GraduationCap className={`mr-2 h-4 w-4 flex-shrink-0 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>A2 + B1</div>
                              <div className="text-[10px] text-muted-foreground">VIP2 bonus</div>
                            </div>
                          </DropdownMenuItem>
                        )}
                        
                        {/* VIP3 = B2 + C1 + C2 */}
                        {zone.id === 'vip3' && (
                          <DropdownMenuItem 
                            onClick={() => navigate('/english-pathway')}
                            className={`h-full flex items-center cursor-pointer border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                          >
                            <GraduationCap className={`mr-2 h-4 w-4 flex-shrink-0 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>B2 + C1 + C2</div>
                              <div className="text-[10px] text-muted-foreground">VIP3 bonus</div>
                            </div>
                          </DropdownMenuItem>
                        )}
                        
                        {/* VIP4/VIP5 = Kids Levels (spanning multiple zones) */}
                        {zone.id === 'vip4' && (
                          <div className="h-full flex flex-col justify-around py-1">
                            <DropdownMenuItem 
                              onClick={() => navigate('/kids-level1')}
                              className={`flex-1 flex items-center cursor-pointer border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                            >
                              <Baby className={`mr-2 h-3 w-3 flex-shrink-0 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                              <div className="text-left">
                                <div className={`font-bold text-[11px] ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Kids L1</div>
                                <div className="text-[9px] text-muted-foreground">Ages 4-7</div>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigate('/kids-level2')}
                              className={`flex-1 flex items-center cursor-pointer border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                            >
                              <School className={`mr-2 h-3 w-3 flex-shrink-0 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                              <div className="text-left">
                                <div className={`font-bold text-[11px] ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Kids L2</div>
                                <div className="text-[9px] text-muted-foreground">Ages 7-10</div>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigate('/kids-level3')}
                              className={`flex-1 flex items-center cursor-pointer border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-blue-50 hover:border-blue-600'}`}
                            >
                              <GraduationCap className={`mr-2 h-3 w-3 flex-shrink-0 ${isBlackWhiteMode ? 'text-black' : 'text-blue-600'}`} />
                              <div className="text-left">
                                <div className={`font-bold text-[11px] ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Kids L3</div>
                                <div className="text-[9px] text-muted-foreground">Ages 10-13</div>
                              </div>
                            </DropdownMenuItem>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CENTER COLUMN - Fixed Human Silhouette + Tier Labels (non-scrolling) */}
                  <div className="relative w-[280px] flex-shrink-0 bg-background/50 border-x">
                    {/* Human Silhouette - Fixed, 85% height */}
                    <svg 
                      viewBox="0 0 280 600" 
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      preserveAspectRatio="xMidYMid meet"
                    >
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
                      
                      {/* Horizontal zone bands (alignment lines) */}
                      {BODY_ZONES.map((zone) => (
                        <line
                          key={`band-${zone.id}`}
                          x1="0"
                          y1={zone.yStart}
                          x2="280"
                          y2={zone.yStart}
                          stroke="currentColor"
                          strokeWidth="0.5"
                          opacity="0.1"
                        />
                      ))}
                      
                      {/* Soft human silhouette outline - white, 10% opacity, 85% height */}
                      <g transform="translate(140, 45) scale(0.85)">
                        {/* Head */}
                        <ellipse cx="0" cy="0" rx="35" ry="45" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                        
                        {/* Neck */}
                        <rect x="-15" y="40" width="30" height="30" rx="8" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                        
                        {/* Shoulders & Chest */}
                        <ellipse cx="0" cy="100" rx="55" ry="50" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                        
                        {/* Belly */}
                        <ellipse cx="0" cy="170" rx="50" ry="45" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                        
                        {/* Hips */}
                        <ellipse cx="0" cy="235" rx="52" ry="40" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                        
                        {/* Upper legs */}
                        <ellipse cx="-20" cy="310" rx="18" ry="60" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                        <ellipse cx="20" cy="310" rx="18" ry="60" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                        
                        {/* Lower legs */}
                        <ellipse cx="-20" cy="410" rx="15" ry="70" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                        <ellipse cx="20" cy="410" rx="15" ry="70" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                        
                        {/* Feet */}
                        <ellipse cx="-20" cy="500" rx="18" ry="20" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                        <ellipse cx="20" cy="500" rx="18" ry="20" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                      </g>
                      
                      {/* Rainbow spine glow */}
                      {!isBlackWhiteMode && (
                        <line 
                          x1="140" y1="30" 
                          x2="140" y2="570" 
                          stroke="url(#spineGradient)" 
                          strokeWidth="5" 
                          opacity="0.4"
                        />
                      )}
                      {isBlackWhiteMode && (
                        <line 
                          x1="140" y1="30" 
                          x2="140" y2="570" 
                          stroke="currentColor" 
                          strokeWidth="3" 
                          opacity="0.15"
                        />
                      )}
                    </svg>

                    {/* Tier labels aligned to zones */}
                    <div className="relative h-full">
                      {BODY_ZONES.map((zone) => (
                        <div
                          key={`center-${zone.id}`}
                          style={{ height: `${zone.height}px` }}
                          className={`flex items-center justify-center border-b border-border/10 transition-all duration-200 ${
                            hoveredZone === zone.id ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-primary/5') : ''
                          }`}
                          onMouseEnter={() => setHoveredZone(zone.id)}
                          onMouseLeave={() => setHoveredZone(null)}
                        >
                          {zone.id === 'universe' && (
                            <div className="text-center px-2">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Universe</div>
                              <div className="text-[9px] text-muted-foreground">Coming soon</div>
                            </div>
                          )}
                          
                          {zone.id === 'vip9' && (
                            <button
                              onClick={() => navigate('/rooms-vip9')}
                              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-100 ${isBlackWhiteMode ? 'hover:bg-gray-100' : ''}`}
                            >
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP9</div>
                              <div className="text-[10px] text-muted-foreground">Crown • $150</div>
                            </button>
                          )}
                          
                          {zone.id === 'vip8' && (
                            <div className="text-center px-2">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP8</div>
                              <div className="text-[9px] text-muted-foreground">Eyes • Soon</div>
                            </div>
                          )}
                          
                          {zone.id === 'vip7' && (
                            <div className="text-center px-2">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP7</div>
                              <div className="text-[9px] text-muted-foreground">Mouth • Soon</div>
                            </div>
                          )}
                          
                          {zone.id === 'vip6' && (
                            <button
                              onClick={() => navigate('/vip6')}
                              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-purple-50 ${isBlackWhiteMode ? 'hover:bg-gray-100' : ''}`}
                            >
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP6</div>
                              <div className="text-[10px] text-muted-foreground">Neck • $90</div>
                            </button>
                          )}
                          
                          {zone.id === 'vip5' && (
                            <button
                              onClick={() => navigate('/rooms-vip5')}
                              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-emerald-50 ${isBlackWhiteMode ? 'hover:bg-gray-100' : ''}`}
                            >
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP5</div>
                              <div className="text-[10px] text-muted-foreground">Chest • $70</div>
                            </button>
                          )}
                          
                          {zone.id === 'vip4' && (
                            <button
                              onClick={() => navigate('/rooms-vip4')}
                              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-orange-50 ${isBlackWhiteMode ? 'hover:bg-gray-100' : ''}`}
                            >
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP4</div>
                              <div className="text-[10px] text-muted-foreground">Belly • $50</div>
                            </button>
                          )}
                          
                          {zone.id === 'vip3' && (
                            <button
                              onClick={() => navigate('/rooms-vip3')}
                              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-purple-50 ${isBlackWhiteMode ? 'hover:bg-gray-100' : ''}`}
                            >
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP3</div>
                              <div className="text-[10px] text-muted-foreground">Hips • $15</div>
                            </button>
                          )}
                          
                          {zone.id === 'vip2' && (
                            <button
                              onClick={() => navigate('/rooms-vip2')}
                              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50 ${isBlackWhiteMode ? 'hover:bg-gray-100' : ''}`}
                            >
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP2</div>
                              <div className="text-[10px] text-muted-foreground">Knees • $6</div>
                            </button>
                          )}
                          
                          {zone.id === 'vip1' && (
                            <button
                              onClick={() => navigate('/rooms-vip1')}
                              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-yellow-50 ${isBlackWhiteMode ? 'hover:bg-gray-100' : ''}`}
                            >
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>VIP1</div>
                              <div className="text-[10px] text-muted-foreground">Shins • $3</div>
                            </button>
                          )}
                          
                          {zone.id === 'free' && (
                            <button
                              onClick={() => navigate('/rooms')}
                              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-green-50 ${isBlackWhiteMode ? 'hover:bg-gray-100' : ''}`}
                            >
                              <div className={`font-bold text-sm ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Free</div>
                              <div className="text-[10px] text-muted-foreground">Feet • $0</div>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT COLUMN - Life Skills & Survival (scrollable, transparent bg) */}
                  <div className="relative overflow-y-auto bg-transparent">
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-3 py-2 border-b z-20">
                      <h3 className={`text-xs font-bold ${isBlackWhiteMode ? 'text-black' : 'text-red-700'}`}>
                        Life Skills & Survival
                      </h3>
                    </div>
                    
                    {/* Zone-aligned items */}
                    {BODY_ZONES.map((zone) => (
                      <div
                        key={`right-${zone.id}`}
                        style={{ height: `${zone.height}px` }}
                        className={`relative border-b border-border/10 transition-all duration-200 ${
                          hoveredZone === zone.id ? (isBlackWhiteMode ? 'bg-gray-200' : 'bg-red-50/30') : ''
                        }`}
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        {zone.id === 'free' && (
                          <DropdownMenuItem 
                            onClick={() => navigate('/rooms')}
                            className={`h-full flex items-center cursor-pointer border-l-2 border-transparent ${isBlackWhiteMode ? 'hover:bg-gray-100 hover:border-black' : 'hover:bg-red-50 hover:border-red-600'}`}
                          >
                            <Shield className={`mr-2 h-4 w-4 flex-shrink-0 ${isBlackWhiteMode ? 'text-black' : 'text-red-600'}`} />
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Survival & Resilience</div>
                              <div className="text-[10px] text-muted-foreground">Free • 15 rooms</div>
                            </div>
                          </DropdownMenuItem>
                        )}
                        
                        {zone.id === 'universe' && (
                          <div className="h-full flex items-center px-3">
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Meaning of Life</div>
                              <div className="text-[10px] text-muted-foreground">Spiritual</div>
                            </div>
                          </div>
                        )}
                        
                        {zone.id === 'vip9' && (
                          <div className="h-full flex items-center px-3">
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Strategy</div>
                              <div className="text-[10px] text-muted-foreground">Executive mastery</div>
                            </div>
                          </div>
                        )}
                        
                        {zone.id === 'vip8' && (
                          <div className="h-full flex items-center px-3">
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Life Vision</div>
                              <div className="text-[10px] text-muted-foreground">Navigation</div>
                            </div>
                          </div>
                        )}
                        
                        {zone.id === 'vip6' && (
                          <div className="h-full flex items-center px-3">
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Emotional Healing</div>
                              <div className="text-[10px] text-muted-foreground">Inner work</div>
                            </div>
                          </div>
                        )}
                        
                        {zone.id === 'vip5' && (
                          <div className="h-full flex items-center px-3">
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Communication</div>
                              <div className="text-[10px] text-muted-foreground">Relationships</div>
                            </div>
                          </div>
                        )}
                        
                        {zone.id === 'vip4' && (
                          <div className="h-full flex items-center px-3">
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Career</div>
                              <div className="text-[10px] text-muted-foreground">Productivity</div>
                            </div>
                          </div>
                        )}
                        
                        {zone.id === 'vip3' && (
                          <div className="h-full flex items-center px-3">
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Lifestyle Mastery</div>
                              <div className="text-[10px] text-muted-foreground">Health & wellness</div>
                            </div>
                          </div>
                        )}
                        
                        {zone.id === 'vip2' && (
                          <div className="h-full flex items-center px-3">
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Adulting Essentials</div>
                              <div className="text-[10px] text-muted-foreground">Independence</div>
                            </div>
                          </div>
                        )}
                        
                        {zone.id === 'vip1' && (
                          <div className="h-full flex items-center px-3">
                            <div className="text-left">
                              <div className={`font-bold text-xs ${isBlackWhiteMode ? 'text-black' : 'text-gray-900'}`}>Basic Daily Skills</div>
                              <div className="text-[10px] text-muted-foreground">Fundamentals</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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
