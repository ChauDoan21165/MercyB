// src/components/layout/GlobalHeader.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeButton } from "@/components/HomeButton";
import { BackButton } from "@/components/BackButton";
import { useAuth } from "@/providers/AuthProvider";

/**
 * GlobalHeader - Single app-wide header with Mercy Blade logo
 *
 * RULES (LOCKED):
 * - Single source of truth for global header
 * - Home + Back always flush-left (viewport edge)
 * - Mercy Blade MUST be visually centered
 *
 * FIX (2026-01-31):
 * - Grid-based centering was overridden by surrounding layout
 * - Switched to absolute-center pattern inside full-width header
 * - This guarantees true centering regardless of left/right width
 *
 * PATCH (2026-01-31):
 * - Move Home’s header actions here (Option A):
 *   Sign out / Copy UUID / UUID pill / Tier Map
 * - Remove Home custom header strip afterwards (Home.tsx)
 */
export default function GlobalHeader() {
  const nav = useNavigate();
  const { user, isLoading, signOut } = useAuth();

  const userUuid = user?.id ?? "";
  const [uuidCopied, setUuidCopied] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      nav("/signin", { replace: true });
    }
  };

  const copyUuid = async () => {
    if (!userUuid) return;
    try {
      await navigator.clipboard.writeText(userUuid);
      setUuidCopied(true);
      window.setTimeout(() => setUuidCopied(false), 1200);
    } catch {
      const ok = window.prompt("Copy your UUID:", userUuid);
      if (ok !== null) {
        setUuidCopied(true);
        window.setTimeout(() => setUuidCopied(false), 1200);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      {/* ✅ Full-width bar so left buttons can touch the viewport edge */}
      <div className="w-full px-2 sm:px-4">
        {/* ✅ Relative container for absolute centering */}
        <div className="relative flex h-12 items-center">
          {/* Left: Home + Back (push to edge) */}
          <div className="flex items-center gap-2">
            <HomeButton />
            <BackButton />
          </div>

          {/* ✅ TRUE CENTER: independent of left/right width */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="select-none font-extrabold tracking-tight text-sm sm:text-base"
              aria-label="Mercy Blade"
              title="Mercy Blade"
            >
              Mercy Blade
            </div>
          </div>

          {/* Right: unified actions (moved from Home BOX-1) */}
          <div className="ml-auto flex items-center gap-2">
            {/* Tier Map always visible */}
            <button
              type="button"
              onClick={() => nav("/tiers")}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
              aria-label="Tier Map"
            >
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-black/70" />
                <span>Tier Map / Bản đồ app</span>
              </span>
            </button>

            {!isLoading && user ? (
              <>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
                  aria-label="Sign out"
                >
                  Sign out / Đăng xuất
                </button>

                <button
                  type="button"
                  onClick={copyUuid}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
                  aria-label="Copy UUID"
                  disabled={!userUuid}
                  title={userUuid || undefined}
                >
                  {uuidCopied ? "Copied ✓" : "Copy UUID"}
                </button>

                <span
                  className="hidden sm:inline-flex max-w-[220px] items-center rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-black/60"
                  title={userUuid || undefined}
                  aria-label="User UUID"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userUuid || "—"}
                </span>
              </>
            ) : (
              <button
                type="button"
                onClick={() => nav("/signin")}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
                aria-label="Sign in"
                disabled={isLoading}
                title={isLoading ? "Loading..." : undefined}
              >
                Sign in / Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
