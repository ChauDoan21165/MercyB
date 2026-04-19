/**
 * File: AppShell.tsx
 * Path: src/components/layout/AppShell.tsx
 */

import React from "react";
import { HomeButton } from "@/components/HomeButton";
import { BackButton } from "@/components/BackButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MercyGuide } from "@/components/MercyGuide";
import { UpdatePrompt } from "@/components/UpdatePrompt";

interface AppShellProps {
  children: React.ReactNode;
  bottomBar?: React.ReactNode;
  hideHeader?: boolean;
  mainClassName?: string;
  showMercyGuide?: boolean;
}

export function AppShell({
  children,
  bottomBar,
  hideHeader = true,
  mainClassName = "",
  showMercyGuide = false,
}: AppShellProps) {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const shouldShowMercyGuide = showMercyGuide || isHome;

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <style>{`
        :root{
          --mb-page-max: 980px;
        }

        [data-mb-frame]{
          width: 100%;
          max-width: var(--mb-page-max);
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
        }

        [data-mb-frame] [data-mb-scope="room"]{
          width: 100% !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          box-sizing: border-box !important;
        }

        [data-mb-frame] [data-mb-scope="room"] [data-room-box]{
          width: 100% !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          box-sizing: border-box !important;
        }
      `}</style>

      {!hideHeader && (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/88 backdrop-blur-md">
          <div className="mx-auto grid h-14 max-w-[980px] grid-cols-[auto,minmax(0,1fr),auto] items-center px-3 sm:px-4">
            <div className="flex items-center gap-2">
              <HomeButton />
              <BackButton />
            </div>

            <div className="flex min-w-0 justify-center px-1">
              <Link to="/" aria-label="Mercy Blade home"
                className="inline-flex min-w-0 items-end justify-center gap-[2px] leading-none transition-opacity hover:opacity-85">
                <span
                  className="shrink-0 bg-gradient-to-r from-[hsl(var(--rainbow-red))] via-[hsl(var(--rainbow-yellow))] via-[hsl(var(--rainbow-green))] to-[hsl(var(--rainbow-purple))] bg-clip-text text-[34px] font-black tracking-[-0.08em] text-transparent sm:text-[38px]"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
                >
                  M
                </span>
                <span className="truncate pb-[4px] text-[18px] font-semibold tracking-[-0.04em] text-foreground/85 sm:text-[20px]">
                  ercyBlade
                </span>
              </Link>
            </div>

            <div className="flex items-center justify-end gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <Link to="/tiers" title="Tier Map" aria-label="Tier Map">
                  <Map className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 ${mainClassName}`}>
        <div data-mb-frame className="px-4 py-4">
          {children}
        </div>
      </main>

      {bottomBar}

      {shouldShowMercyGuide ? <MercyGuide /> : null}

      <UpdatePrompt />
    </div>
  );
}

export function AppShellContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-mb-frame className={`px-4 py-4 ${className}`}>
      {children}
    </div>
  );
}