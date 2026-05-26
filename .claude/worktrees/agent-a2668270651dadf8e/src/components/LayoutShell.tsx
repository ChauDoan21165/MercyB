// src/components/LayoutShell.tsx

import React, { ReactNode } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { MercyToggle } from "@/components/companion/MercyToggle";
import { CompanionBubble } from "@/components/companion/CompanionBubble";
import { useHomeCompanion } from "@/hooks/useHomeCompanion";

interface LayoutShellProps {
  children: ReactNode;
  showHeader?: boolean;
  maxWidth?: "full" | "container" | "narrow";
}

/**
 * Shared layout shell for main experiences
 * Ensures consistent spacing, max-width, and header placement
 */
export function LayoutShell({
  children,
  showHeader = true,
  maxWidth = "container",
}: LayoutShellProps) {
  const maxWidthClass =
    maxWidth === "full"
      ? "max-w-full"
      : maxWidth === "narrow"
      ? "max-w-[640px]"
      : "max-w-[980px]"; // default container width

  const { visible, text, hide } = useHomeCompanion();

  return (
    <div className="min-h-screen bg-background">
      {showHeader && <AppHeader />}

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

      {/* Mercy Toggle */}
      <MercyToggle />
    </div>
  );
}

export default LayoutShell;