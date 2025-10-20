import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const MatchmakingButton = () => {
  const [isVIP3, setIsVIP3] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkVIP3Status();
  }, []);

  const checkVIP3Status = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('*, subscription_tiers(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (subscription && subscription.subscription_tiers?.name === 'VIP3') {
      setIsVIP3(true);
    }
  };

  if (!isVIP3) return null;

  return (
    <Button 
      onClick={() => navigate('/matchmaking')}
      className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
    >
      <Heart className="w-4 h-4" />
      <span className="flex flex-col items-start">
        <span className="text-sm font-semibold">AI Matchmaking</span>
        <span className="text-xs opacity-90">Ghép Đôi AI</span>
      </span>
    </Button>
  );
};
