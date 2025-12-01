/**
 * Canonical RoomTitle Component
 * Single source of truth for room title rendering across ChatHub, VIP grids, KidsChat
 */

import { cn } from "@/lib/utils";
import { typography } from "@/design-system/tokens";

interface RoomTitleProps {
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  highlightWords?: number;
  themeMode?: 'color' | 'bw';
}

const TITLE_COLORS = [
  'text-red-700 dark:text-red-400',
  'text-blue-700 dark:text-blue-400',
  'text-green-700 dark:text-green-400',
  'text-orange-700 dark:text-orange-400',
];

export function RoomTitle({ 
  title, 
  size = 'lg',
  className,
  highlightWords = 0,
  themeMode = 'color'
}: RoomTitleProps) {
  const sizeClass = {
    sm: typography['heading-sm'],
    md: typography['heading-md'],
    lg: typography['heading-lg'],
    xl: typography['heading-xl'],
  }[size];

  // Apply word highlighting only in color mode
  const renderTitle = () => {
    if (themeMode !== 'color' || highlightWords === 0) {
      return title;
    }

    const words = title.split(' ');
    const wordsToHighlight = Math.min(highlightWords, words.length);
    
    return words.map((word, i) => {
      if (i < wordsToHighlight) {
        const colorClass = TITLE_COLORS[i % TITLE_COLORS.length];
        return (
          <span key={i} className={colorClass}>
            {word}{' '}
          </span>
        );
      }
      return word + ' ';
    });
  };

  return (
    <h2 
      className={cn(
        sizeClass,
        "text-foreground transition-colors duration-200",
        className
      )}
      data-room-title
    >
      {renderTitle()}
    </h2>
  );
}
