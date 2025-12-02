import { ReactNode } from "react";

interface RoomLayoutProps {
  children: ReactNode;
  bgColor?: string;
}

/**
 * Canonical Room Layout Wrapper
 * Provides consistent structure for all room pages:
 * - Soft room background
 * - Centered content column
 * - Proper bottom padding for audio player
 */
export const RoomLayout = ({ children, bgColor }: RoomLayoutProps) => (
  <main 
    className="min-h-screen"
    style={{ background: bgColor || 'hsl(var(--background))' }}
  >
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {children}
    </div>
  </main>
);
