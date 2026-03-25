// FILE: AppShell.tsx
// PATH: src/components/layout/AppShell.tsx
//
// COMPACT HEADER FIX
//
// Goals:
// - keep one shared frame: max-w-[980px] + px-4
// - make header visually quieter
// - keep Mercy Blade truly centered
// - keep left navigation stable
// - reduce right-side clutter to one compact account entry
// - preserve layout and routing behavior
// - keep bottomBar behavior intact
// - keep MercyGuide mounted globally
//
// Notes:
// - This file assumes HomeButton / BackButton / ThemeToggle already work.
// - Account menu is intentionally compact: one button only.
// - If you already render auth/account controls elsewhere on the page,
//   this prevents the header from fighting that content.

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, User2 } from "lucide-react";
import { MercyGuide } from "@/components/MercyGuide";
import { useAuth } from "@/providers/AuthProvider";

interface AppShellProps {
  children: React.ReactNode;
  bottomBar?: React.ReactNode;
  hideHeader?: boolean;
  mainClassName?: string;
}

function HeaderNavButton({
  onClick,
  href,
  label,
  icon,
}: {
  onClick?: () => void;
  href?: string;
  label: string;
  icon: React.ReactNode;
}) {
  const className =
    "inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white/78 px-4 text-[15px] font-extrabold text-black/75 shadow-sm transition hover:bg-white hover:border-black/15";

  if (href) {
    return (
      <Link to={href} className={className} aria-label={label} title={label}>
        {icon}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label={label}
      title={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function AccountButton({
  signedIn,
  onClick,
}: {
  signedIn: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white/78 px-4 text-[15px] font-extrabold text-black/75 shadow-sm transition hover:bg-white hover:border-black/15"
      aria-label={signedIn ? "Open account" : "Sign in"}
      title={signedIn ? "Open account" : "Sign in"}
    >
      <User2 className="h-4 w-4" />
      <span>{signedIn ? "Account" : "Sign in"}</span>
    </button>
  );
}

/**
 * AppShell - canonical layout frame for the app
 *
 * Locked layout rule:
 * - Use one shared width frame only: max-w-[980px] + px-4
 * - Header and page content must use the same frame
 */
export function AppShell({
  children,
  bottomBar,
  hideHeader = false,
  mainClassName = "",
}: AppShellProps) {
  const nav = useNavigate();
  const { user } = useAuth();
  const isSignedIn = !!user?.id;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideHeader && (
        <header className="sticky top-0 z-40 w-full border-b border-black/8 bg-background/88 backdrop-blur-md">
          <div className="mx-auto max-w-[980px] px-4">
            <div className="relative flex h-16 items-center">
              {/* Left */}
              <div className="flex min-w-0 items-center gap-3">
                <HeaderNavButton
                  href="/"
                  label="Home"
                  icon={<Home className="h-4 w-4" />}
                />
                <HeaderNavButton
                  onClick={() => nav(-1)}
                  label="Back"
                  icon={<ArrowLeft className="h-4 w-4" />}
                />
              </div>

              {/* Center */}
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
                <Link
                  to="/"
                  aria-label="Mercy Blade"
                  title="Mercy Blade"
                  className="pointer-events-auto select-none bg-gradient-to-r from-[hsl(var(--rainbow-magenta))] via-[hsl(var(--rainbow-purple))] to-[hsl(var(--rainbow-cyan))] bg-clip-text text-[18px] font-black tracking-tight text-transparent transition-opacity hover:opacity-80 sm:text-[20px]"
                >
                  Mercy Blade
                </Link>
              </div>

              {/* Right */}
              <div className="ml-auto flex min-w-0 items-center justify-end">
                <AccountButton
                  signedIn={isSignedIn}
                  onClick={() => nav(isSignedIn ? "/account" : "/signin")}
                />
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 w-full ${mainClassName}`}>
        <div className="mx-auto w-full max-w-[980px] px-4 py-4">
          {children}
        </div>
      </main>

      {bottomBar}

      <MercyGuide />
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
    <div className={`mx-auto w-full max-w-[980px] px-4 py-4 ${className}`}>
      {children}
    </div>
  );
}