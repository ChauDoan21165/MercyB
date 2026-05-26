// FILE: src/router/AppLayout.tsx
// PURPOSE: One global shell for ALL pages except /signin.
// - Provides the Mercy hero/header band + nav pills
// - Renders page content via <Outlet />

import React, { useCallback } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const nav = useNavigate();
  const loc = useLocation();

  const onBack = useCallback(() => {
    // If user landed directly, go Home instead of dead back.
    if (window.history.length <= 1) nav("/");
    else nav(-1);
  }, [nav]);

  // Keep /signin excluded at router level, but extra safety here if ever reused.
  const hideShell = loc.pathname === "/signin";
  if (hideShell) return <Outlet />;

  const pill =
    "px-4 py-2 rounded-full border border-black/10 bg-white/70 backdrop-blur hover:bg-white/90 active:bg-white transition text-sm font-semibold";

  return (
    <div className="min-h-screen">
      {/* HERO / HEADER BAND */}
      <div className="sticky top-0 z-40 bg-white/65 backdrop-blur border-b border-black/5">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Left: nav pills */}
            <div className="flex items-center gap-2 shrink-0">
              <Link className={pill} to="/">
                Home
              </Link>
              <button type="button" className={pill} onClick={onBack}>
                Back
              </button>
            </div>

            {/* Center: brand */}
            <div className="flex-1 flex justify-center">
              <div className="text-base font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-emerald-500 to-sky-500">
                  Mercy Blade
                </span>
              </div>
            </div>

            {/* Right: spacer (keeps center truly centered) */}
            <div className="w-[140px] shrink-0" />
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <main className="mx-auto w-full max-w-[1100px] px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}