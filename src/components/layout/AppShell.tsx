import React from "react";
import { HomeButton } from "@/components/HomeButton";
import { BackButton } from "@/components/BackButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MercyGuide } from "@/components/MercyGuide";

interface AppShellProps {
  children: React.ReactNode;
  /** Custom bottom bar content */
  bottomBar?: React.ReactNode;
  /** If true, hides the global header (for pages with custom headers) */
  hideHeader?: boolean;
  /** Custom class for main content area */
  mainClassName?: string;
}

/**
 * AppShell - Centered layout container for room pages
 * 
 * - Single "Mercy Blade" logo in header (no duplicates)
 * - max-width: 720px centered content
 * - 2-row bottom bar: Row 1 controls, Row 2 audio
 */
export function AppShell({ 
  children, 
  bottomBar,
  hideHeader = false,
  mainClassName = ""
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideHeader && (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-[720px] h-12 px-4 grid grid-cols-[auto,1fr,auto] items-center">
            {/* Left: navigation */}
            <div className="flex items-center gap-2">
              <HomeButton />
              <BackButton />
            </div>

            {/* Center: Mercy Blade logo - perfectly centered in column 2 */}
            <div className="flex justify-center">
              <Link
                to="/"
                className="font-semibold text-lg tracking-tight bg-gradient-to-r from-[hsl(var(--rainbow-magenta))] via-[hsl(var(--rainbow-purple))] to-[hsl(var(--rainbow-cyan))] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Mercy Blade
              </Link>
            </div>

            {/* Right: controls */}
            <div className="flex items-center gap-2 justify-end">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                asChild
              >
                <Link to="/tier-map" title="Tier Map">
                  <Map className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main content - centered 720px container */}
      <main className={`flex-1 ${mainClassName}`}>
        <div className="mx-auto max-w-[720px] px-4 py-4">
          {children}
        </div>
      </main>

      {/* Bottom bar - same 720px width, 2-row layout */}
      {bottomBar}
      
      {/* Mercy Guide assistant */}
      <MercyGuide />
    </div>
  );
}

/**
 * AppShellContent - For pages using global header but wanting centered content
 */
export function AppShellContent({ 
  children,
  className = ""
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[720px] px-4 py-4 ${className}`}>
      {children}
    </div>
  );
}
