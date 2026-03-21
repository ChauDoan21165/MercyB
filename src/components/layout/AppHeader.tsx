// src/components/layout/AppHeader.tsx
/**
 * AppHeader — LEGACY / OPTIONAL HEADER
 *
 * STATUS:
 * - This component is kept for compatibility and cleanup safety.
 * - The active main app header currently lives in:
 *   src/router/AppRouter.tsx  ->  AppHeroShell()
 *
 * INTENT:
 * - Do NOT delete yet unless you also verify nothing mounts this component.
 * - Safe to keep in the codebase while the live route flow uses AppHeroShell.
 *
 * ORIGINAL ROLE:
 * - Compact app header with icon-only Home / Back controls
 * - Centered Mercy Blade brand
 * - Signed-in indicator on the right
 *
 * PATCH (2026-03-20):
 * - Mark this file clearly as legacy/optional so header ownership is less confusing.
 * - Keep existing behavior unchanged to avoid breaking any hidden usage.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function AppHeader() {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useAuth();

  const userEmail = user?.email ?? "";

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      navigate("/signin", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="w-full px-4">
        <div className="relative h-12">
          <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-muted"
              aria-label="Home"
              title="Home"
            >
              <Home className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-muted"
              aria-label="Back"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="pointer-events-none mx-auto flex h-12 max-w-[980px] items-center justify-center">
            <div
              className="select-none font-extrabold tracking-tight text-sm sm:text-base"
              aria-label="Mercy Blade"
              title="Mercy Blade"
            >
              Mercy Blade
            </div>
          </div>

          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
            {!isLoading && user ? (
              <>
                <div
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2"
                  aria-label="Signed in status"
                  title={userEmail || "Signed in"}
                >
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-extrabold text-emerald-800">
                    Signed in
                  </span>
                  {userEmail ? (
                    <span className="hidden max-w-[180px] truncate text-xs font-semibold text-emerald-700 md:inline">
                      {userEmail}
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
                  aria-label="Sign out"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
                aria-label="Sign in"
                disabled={isLoading}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}