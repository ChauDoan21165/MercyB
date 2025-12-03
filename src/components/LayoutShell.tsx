import { ReactNode } from 'react';
import { ColorfulMercyBladeHeader } from '@/components/headers/ColorfulMercyBladeHeader';
import { MercyToggle } from '@/components/companion/MercyToggle';
import { CompanionBubble } from '@/components/companion/CompanionBubble';
import { useHomeCompanion } from '@/hooks/useHomeCompanion';

interface LayoutShellProps {
  children: ReactNode;
  showHeader?: boolean;
  maxWidth?: 'full' | 'container' | 'narrow';
}

/**
 * Shared layout shell for main experiences
 * Ensures consistent spacing, max-width, and header placement
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

  // Home companion greeting
  const { visible, text, hide } = useHomeCompanion();

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
      
      {/* Mercy Companion Bubble */}
      <CompanionBubble 
        text={text} 
        visible={visible} 
        onClose={hide}
        title="Mercy"
      />
      
      {/* Mercy Toggle - shows when companion is disabled */}
      <MercyToggle />
    </div>
  );
}
