/**
 * Enhanced Room Card with Premium Animations
 * Replaces PremiumRoomCard with better hover effects
 */

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { spacing } from '@/styles/spacing';
import { haptics } from '@/utils/haptics';
import { cn } from '@/lib/utils';

interface EnhancedRoomCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function EnhancedRoomCard({ 
  children, 
  onClick, 
  className = '',
  disabled = false 
}: EnhancedRoomCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    haptics.light();
    onClick?.();
  };

  return (
    <motion.div
      whileHover={disabled ? {} : { 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } 
      }}
      whileTap={disabled ? {} : { 
        scale: 0.98,
        transition: { duration: 0.1 } 
      }}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
    >
      <Card
        onClick={handleClick}
        className={cn(
          spacing.card.padding,
          'cursor-pointer',
          'border border-border/50',
          'shadow-sm',
          'transition-all duration-150',
          'hover:border-border hover:shadow-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {children}
      </Card>
    </motion.div>
  );
}
