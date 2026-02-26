// src/components/layout/AppHeader.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export default function AppHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="w-full px-4">
        <div className="relative h-12">
          {/* LEFT: Home + Back */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted transition"
              aria-label="Home"
              title="Home"
            >
              <Home className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted transition"
              aria-label="Back"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>

          {/* CENTER: Brand */}
          <div className="mx-auto max-w-[980px] h-12 flex items-center justify-center pointer-events-none">
            <div
              className="select-none font-extrabold tracking-tight text-sm sm:text-base"
              aria-label="Mercy Blade"
              title="Mercy Blade"
            >
              Mercy Blade
            </div>
          </div>

          {/* RIGHT: Reserved */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* future actions */}
          </div>
        </div>
      </div>
    </header>
  );
}