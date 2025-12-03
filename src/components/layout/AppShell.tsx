import React from "react";
import { HomeButton } from "@/components/HomeButton";
import { BackButton } from "@/components/BackButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppShellProps {
  children: React.ReactNode;
  /** If true, uses AppShell's own header instead of the global one */
  useLocalHeader?: boolean;
  /** Custom class for main content area */
  mainClassName?: string;
}

/**
 * AppShell - Centered layout container for room pages
 * 
 * - max-width: 720px centered content
 * - Header with centered logo
 * - Minimal vertical spacing
 */
export function AppShell({ 
  children, 
  useLocalHeader = false,
  mainClassName = ""
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {useLocalHeader && (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="relative mx-auto max-w-[720px] px-4 py-3 flex items-center justify-between">
            {/* Left: navigation */}
            <div className="flex items-center gap-2 z-10">
              <HomeButton />
              <BackButton />
            </div>
            
            {/* Center: Mercy Blade logo - truly centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link 
                to="/" 
                className="font-semibold text-lg tracking-tight bg-gradient-to-r from-[hsl(var(--rainbow-magenta))] via-[hsl(var(--rainbow-purple))] to-[hsl(var(--rainbow-cyan))] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Mercy Blade
              </Link>
            </div>
            
            {/* Right: controls */}
            <div className="flex items-center gap-2 z-10">
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
