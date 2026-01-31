// FILE: RoomLayout.tsx
// PATH: src/components/room/RoomLayout.tsx
//
// FIX (2026-01-31):
// - Rooms must use the SAME content frame as Home: PAGE_MAX=980 + px-4.
// - This makes the room “boxes” match the header frame, so visual centering looks correct.
// - Keep soft background + bottom padding for audio bar.

import { ReactNode } from "react";

interface RoomLayoutProps {
  children: ReactNode;
  bgColor?: string;
}

/**
 * Canonical Room Layout Wrapper
 * Provides consistent structure for all room pages:
 * - Soft room background
 * - Centered content column (matches Home frame)
 * - Proper bottom padding for audio player
 */
export const RoomLayout = ({ children, bgColor }: RoomLayoutProps) => (
  <main className="min-h-screen" style={{ background: bgColor || "hsl(var(--background))" }}>
    {/* ✅ Match Home: PAGE_MAX=980 + 16px padding */}
    <div className="mx-auto max-w-[980px] px-4 py-6 pb-24">
      {children}
    </div>
  </main>
);

/* Teacher GPT – new thing to learn:
   If the header is centered in a frame, the content must use the SAME frame,
   otherwise the logo will look “off” even if it is mathematically centered. */
