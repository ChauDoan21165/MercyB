import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { animations } from '@/styles/animations';
import { spacing } from '@/styles/spacing';
import { haptics } from '@/utils/haptics';

interface PremiumRoomCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Premium room card with hover effects and haptic feedback
 * Use this for all room grid items
 */
export function PremiumRoomCard({ children, onClick, className = '' }: PremiumRoomCardProps) {
  const handleClick = () => {
    haptics.light();
    onClick?.();
  };

  return (
    <Card
      onClick={handleClick}
      className={`
        cursor-pointer
        ${spacing.card.padding}
        ${animations.cardHover}
        ${animations.focusRing}
        border border-border/50
        shadow-sm
        transition-all duration-200
        hover:border-border
        hover:shadow-md
        active:scale-95
        ${className}
      `}
    >
      {children}
    </Card>
  );
}
