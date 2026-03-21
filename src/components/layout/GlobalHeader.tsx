// src/components/layout/GlobalHeader.tsx
/**
 * GlobalHeader — LEGACY / OPTIONAL HEADER
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
 * - Single app-wide header with Mercy Blade logo
 * - Home + Back flush-left
 * - Mercy Blade visually centered
 *
 * PATCH (2026-03-20):
 * - Mark this file clearly as legacy/optional so header ownership is less confusing.
 * - Keep existing behavior unchanged to avoid breaking any hidden usage.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeButton } from "@/components/HomeButton";
import { BackButton } from "@/components/BackButton";
import { useAuth } from "@/providers/AuthProvider";

export default function GlobalHeader() {
  const nav = useNavigate();
  const { user, isLoading, signOut } = useAuth();

  const userUuid = user?.id ?? "";
  const userEmail = user?.email ?? "";
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
      <div className="w-full px-2 sm:px-4">
        <div className="relative flex h-12 items-center">
          <div className="flex items-center gap-2">
            <HomeButton />
            <BackButton />
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="select-none font-extrabold tracking-tight text-sm sm:text-base"
              aria-label="Mercy Blade"
              title="Mercy Blade"
            >
              Mercy Blade
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
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
                    <span className="hidden max-w-[220px] truncate text-xs font-semibold text-emerald-700 sm:inline">
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
                  className="hidden max-w-[220px] items-center rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-black/60 sm:inline-flex"
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