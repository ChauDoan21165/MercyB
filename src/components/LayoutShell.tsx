import { ReactNode } from 'react';
import { ColorfulMercyBladeHeader } from '@/components/headers/ColorfulMercyBladeHeader';

interface LayoutShellProps {
  children: ReactNode;
  showHeader?: boolean;
  maxWidth?: 'full' | 'container' | 'narrow';
}

/**
 * Shared layout shell for main experiences
 * Ensures consistent spacing, max-width, and header placement
 * 
 * Usage:
 *   <LayoutShell showHeader maxWidth="container">
 *     <YourContent />
 *   </LayoutShell>
 */
export function LayoutShell({ 
  children, 
  showHeader = true,
  maxWidth = 'container' 
}: LayoutShellProps) {
  const maxWidthClass = {
    full: 'max-w-full',
    container: 'max-w-7xl',
    narrow: 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <div className="border-b border-border/40">
          <div className={`${maxWidthClass} mx-auto px-4 py-6`}>
            <ColorfulMercyBladeHeader />
          </div>
        </div>
      )}
      
      <main className={`${maxWidthClass} mx-auto px-4 py-6`}>
        {children}
      </main>
    </div>
  );
}
