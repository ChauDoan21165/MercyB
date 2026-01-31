// FILE: AppShell.tsx
// PATH: src/components/layout/AppShell.tsx
//
// FIX (2026-01-31):
// - SINGLE source of truth for page frame width (Home standard): PAGE_MAX=980 + px-4
// - Rooms must NOT introduce their own competing max-width frames.
// - Header logo must be truly centered inside the SAME 980 frame (independent of left/right widths).

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
 * AppShell - Canonical layout frame for the app (rooms included)
 *
 * LOCKED RULES:
 * - The ONLY width frame is: max-w-[980px] + px-4 (Home standard).
 * - Do not add other "maxWidth: 1100" or "max-w-[720px]" wrappers in room pages.
 * - Header and content must share the SAME frame width so everything lines up.
 */
export function AppShell({
  children,
  bottomBar,
  hideHeader = false,
  mainClassName = "",
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideHeader && (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
          {/* ✅ Single frame (Home standard) */}
          <div className="mx-auto max-w-[980px] px-4">
            {/* ✅ Relative row so logo can be TRUE centered */}
            <div className="relative flex h-12 items-center">
              {/* Left: navigation (normal flow) */}
              <div className="flex items-center gap-2">
                <HomeButton />
                <BackButton />
              </div>

              {/* ✅ Center: true center, independent of left/right widths */}
              <div className="absolute left-1/2 -translate-x-1/2">
                <Link
                  to="/"
                  className="select-none font-semibold text-lg tracking-tight bg-gradient-to-r from-[hsl(var(--rainbow-magenta))] via-[hsl(var(--rainbow-purple))] to-[hsl(var(--rainbow-cyan))] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                  aria-label="Mercy Blade"
                  title="Mercy Blade"
                >
                  Mercy Blade
                </Link>
              </div>

              {/* Right: controls (push to end) */}
              <div className="ml-auto flex items-center gap-2 justify-end">
                <ThemeToggle />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                  <Link to="/tier-map" title="Tier Map">
                    <Map className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ✅ Main content: THE SAME Home frame (no competing wrappers) */}
      <main className={`flex-1 w-full ${mainClassName}`}>
        <div className="mx-auto w-full max-w-[980px] px-4 py-4">{children}</div>
      </main>

      {/* Bottom bar (can be fixed/full-width; do not force into 980 here) */}
      {bottomBar}

      {/* Mercy Guide assistant */}
      <MercyGuide />
    </div>
  );
}

/**
 * AppShellContent - Helper for pages that already sit inside AppShell but still want the Home frame.
 * (Safe to use; it matches the same 980 frame.)
 */
export function AppShellContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[980px] px-4 py-4 ${className}`}>{children}</div>;
}

/* Teacher GPT – new thing to learn:
   If two UI sections should line up, they must share ONE max-width frame.
   Multiple competing wrappers (720 / 980 / 1100) will always look “misaligned.” */
