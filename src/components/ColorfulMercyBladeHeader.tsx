import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, UserPlus, Crown, Star, Gem, Sparkles, Rocket, Feather, Brain, Baby, GraduationCap, School, Gift, TrendingUp, Shield, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { AnimatedTierBadge } from './AnimatedTierBadge';
import { useUserAccess } from '@/hooks/useUserAccess';
import { ThemeToggle } from '@/components/ThemeToggle';
// Removed tierMapImage import - using clean text-based tier map instead
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
  showResetButton?: boolean;
  onReset?: () => void;
  mode?: "color" | "bw";
}

// TIER SYSTEM PAGE - EXACT LAYOUT (DO NOT MODIFY)
// Three equal columns: English Pathway | Human Body Tier Map | Life Skills & Survival

export const ColorfulMercyBladeHeader = ({
  subtitle,
  showResetButton = false,
  onReset,
  mode = "color",
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

  const headerBg = mode === "bw" 
    ? "bg-white/95" 
    : "bg-background/95";

  return (
    <header className={`sticky top-0 z-40 ${headerBg} backdrop-blur-sm border-b border-border py-4`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Center - Title */}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "color" ? (
                <>
                  <span className="inline-block animate-fade-in" style={{ color: '#E91E63' }}>M</span>
                  <span className="inline-block animate-fade-in" style={{ color: '#9C27B0', animationDelay: '0.1s' }}>e</span>
                  <span className="inline-block animate-fade-in" style={{ color: '#3F51B5', animationDelay: '0.2s' }}>r</span>
                  <span className="inline-block animate-fade-in" style={{ color: '#2196F3', animationDelay: '0.3s' }}>c</span>
                  <span className="inline-block animate-fade-in" style={{ color: '#00BCD4', animationDelay: '0.4s' }}>y</span>
                  <span className="inline-block mx-2"></span>
                  <span className="inline-block animate-fade-in" style={{ color: '#009688', animationDelay: '0.5s' }}>B</span>
                  <span className="inline-block animate-fade-in" style={{ color: '#4CAF50', animationDelay: '0.6s' }}>l</span>
                  <span className="inline-block animate-fade-in" style={{ color: '#8BC34A', animationDelay: '0.7s' }}>a</span>
                  <span className="inline-block animate-fade-in" style={{ color: '#FFC107', animationDelay: '0.8s' }}>d</span>
                  <span className="inline-block animate-fade-in" style={{ color: '#FF9800', animationDelay: '0.9s' }}>e</span>
                </>
              ) : (
                <span className="text-black font-black">Mercy Blade</span>
              )}
            </h1>
            {subtitle && (
              <p className="text-center text-base text-gray-600 mt-3 max-w-3xl mx-auto">{subtitle}</p>
            )}
          </div>

          {/* Right side - Controls aligned right, same row */}
          <div className="flex items-center gap-2 ml-4">
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
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/tier-map')}
                variant="outline" 
                size="sm" 
                className="gap-2 border-2 hover:bg-primary hover:text-primary-foreground"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Tier Map</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
