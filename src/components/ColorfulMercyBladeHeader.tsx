import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { AnimatedTierBadge } from './AnimatedTierBadge';
import { useUserAccess } from '@/hooks/useUserAccess';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4 px-6">
      <div className="max-w-7xl mx-auto relative flex items-center justify-between">
        {/* Left side - Back Button */}
        <div className="flex-none w-24">
          {showBackButton && (
            <Button
              onClick={() => navigate('/')}
              size="sm"
              className="gap-2 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>

        {/* Center - Title */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
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
          </h1>
          {subtitle && (
            <p className="text-center text-sm text-gray-600 mt-2">{subtitle}</p>
          )}
        </div>

        {/* Right side - Sign Up / User Info / Reset */}
        <div className="flex-none w-24 flex justify-end gap-2">
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
            <div className="flex items-center gap-2">
              <AnimatedTierBadge tier={tier} size="sm" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
