/**
 * MercyBlade Blue — App Header
 * Path: src/components/layout/AppHeader.tsx
 * Version: MB-BLUE-94.15.2 — 2026-01-11 (+0700)
 *
 * CHANGE (94.15.2):
 * - Use SINGLE SOURCE OF TRUTH: useAuth()
 * - When signed out: show "Sign in / Đăng nhập"
 * - When signed in: show "Signed in" badge + "Sign out / Đăng xuất"
 * - Keep Tier Map / Bản đồ app button always visible
 */

import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoading, signOut } = useAuth();

  const redirectParam = useMemo(
    () => encodeURIComponent(location.pathname + location.search),
    [location.pathname, location.search]
  );

  const handleSignIn = () => {
    // Keep your existing auth route convention:
    // (If your app uses /signin instead, swap to `/signin?redirect=...`)
    navigate(`/auth?redirect=${redirectParam}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      // Hard reset routing state
      navigate("/signin", { replace: true });
    }
  };

  const badgeText = user?.email ? `Signed in: ${user.email}` : user ? "Signed in" : "";

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl px-4 pt-4">
        <div className="rounded-2xl bg-white/80 backdrop-blur border border-black/10 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4">
            {/* Left: Logo */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="select-none"
              aria-label="Mercy Blade Home"
              title="Mercy Blade"
            >
              <div className="text-2xl font-extrabold tracking-tight">
                <span style={{ color: "#E91E63" }}>M</span>
                <span style={{ color: "#9C27B0" }}>e</span>
                <span style={{ color: "#3F51B5" }}>r</span>
                <span style={{ color: "#2196F3" }}>c</span>
                <span style={{ color: "#00BCD4" }}>y</span>
                <span className="mx-2" />
                <span style={{ color: "#009688" }}>B</span>
                <span style={{ color: "#4CAF50" }}>l</span>
                <span style={{ color: "#8BC34A" }}>a</span>
                <span style={{ color: "#FFC107" }}>d</span>
                <span style={{ color: "#FF9800" }}>e</span>
              </div>
            </button>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Signed-in badge (only when signed in, and not loading) */}
              {!isLoading && user && (
                <div
                  className="hidden sm:flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70"
                  title={badgeText}
                >
                  {badgeText}
                </div>
              )}

              {/* Tier Map always visible */}
              <button
                type="button"
                onClick={() => navigate("/tier-map")}
                className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold hover:bg-black/5"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-black/70" />
                  <span>Tier Map / Bản đồ app</span>
                </span>
              </button>

              {/* Auth button */}
              {!isLoading && user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold hover:bg-black/5"
                  title={badgeText || "Sign out"}
                >
                  Sign out / Đăng xuất
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold hover:bg-black/5"
                  disabled={isLoading}
                  title={isLoading ? "Loading session..." : "Sign in"}
                >
                  Sign in / Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
