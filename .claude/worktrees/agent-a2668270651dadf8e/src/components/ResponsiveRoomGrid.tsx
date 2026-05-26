/**
 * Responsive Room Grid with Mobile Optimizations
 * Improved spacing and overflow handling for mobile devices
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveRoomGridProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveRoomGrid({ children, className }: ResponsiveRoomGridProps) {
  return (
    <div
      className={cn(
        // Base grid - 2 columns mobile, 3 tablet, 6 desktop
        'grid',
        'grid-cols-2',
        'sm:grid-cols-3',
        'md:grid-cols-4',
        'lg:grid-cols-5',
        'xl:grid-cols-6',
        // Consistent spacing - reduced for mobile
        'gap-3 sm:gap-4',
        // Mobile-specific optimizations
        'px-3 sm:px-4',
        // Safe area support for notched devices
        'pb-[env(safe-area-inset-bottom)]',
        'pt-[env(safe-area-inset-top)]',
        className
      )}
    >
      {children}
    </div>
  );
}
