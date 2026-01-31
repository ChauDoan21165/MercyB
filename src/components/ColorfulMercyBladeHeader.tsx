/**
 * MercyBlade Blue — ColorfulMercyBladeHeader
 * Path: src/components/ColorfulMercyBladeHeader.tsx
 * Version: MB-BLUE-94.14.15 — 2025-12-25 (+0700)
 *
 * CHANGE (94.14.15):
 * - Add optional back button support (showBackButton, backTo) without breaking 3-column layout.
 * - Keep auth timeline single-source via useAuth().
 * - No Supabase auth calls here.
 */

import { Button } from "@/components/ui/button";
import { RotateCcw, UserPlus, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";

interface ColorfulMercyBladeHeaderProps {
  subtitle?: string;

  // Reset
  showResetButton?: boolean;
  onReset?: () => void;

  // Mode
  mode?: "color" | "bw";

  // Back button (NEW)
  showBackButton?: boolean;
  backTo?: string; // if provided, go to this path; else navigate(-1) with safe fallback
}

// TIER SYSTEM PAGE - EXACT LAYOUT (DO NOT MODIFY)
// Three equal columns: English Pathway | Human Body Tier Map | Life Skills & Survival

export const ColorfulMercyBladeHeader = ({
  subtitle,
  showResetButton = false,
  onReset,
  mode = "color",
  showBackButton = false,
  backTo,
}: ColorfulMercyBladeHeaderProps) => {
  const navigate = useNavigate();

  // ✅ SINGLE SOURCE OF TRUTH
  const { user, isLoading } = useAuth();

  const headerBg = mode === "bw" ? "bg-white/95" : "bg-background/95";

  const handleBack = () => {
    if (backTo && typeof backTo === "string") {
      navigate(backTo);
      return;
    }

    // best-effort "go back" with fallback
    try {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    } catch {
      navigate("/");
    }
  };

  return (
    <header className={`sticky top-0 z-40 ${headerBg} backdrop-blur-sm border-b border-border py-4`}>
      {/* ✅ IMPORTANT:
          Align header content to the SAME frame as the app "box" (PAGE_MAX=980).
          This fixes Home/Back + Mercy Blade wordmark not lining up with the centered content below.
      */}
      <div className="mx-auto w-full max-w-[980px] px-4">
        <div className="grid grid-cols-3 items-center">
          {/* Left column - back button (optional) */}
          <div className="flex items-center">
            {showBackButton ? (
              <Button onClick={handleBack} variant="outline" size="sm" className="gap-2" title="Back">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            ) : null}
          </div>

          {/* Center - Title - ALWAYS EXACT CENTER */}
          <div className="flex justify-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-center">
                {mode === "color" ? (
                  <>
                    <span className="inline-block animate-fade-in" style={{ color: "#E91E63" }}>
                      M
                    </span>
                    <span className="inline-block animate-fade-in" style={{ color: "#9C27B0", animationDelay: "0.1s" }}>
                      e
                    </span>
                    <span className="inline-block animate-fade-in" style={{ color: "#3F51B5", animationDelay: "0.2s" }}>
                      r
                    </span>
                    <span className="inline-block animate-fade-in" style={{ color: "#2196F3", animationDelay: "0.3s" }}>
                      c
                    </span>
                    <span className="inline-block animate-fade-in" style={{ color: "#00BCD4", animationDelay: "0.4s" }}>
                      y
                    </span>
                    <span className="inline-block mx-2"></span>
                    <span className="inline-block animate-fade-in" style={{ color: "#009688", animationDelay: "0.5s" }}>
                      B
                    </span>
                    <span className="inline-block animate-fade-in" style={{ color: "#4CAF50", animationDelay: "0.6s" }}>
                      l
                    </span>
                    <span className="inline-block animate-fade-in" style={{ color: "#8BC34A", animationDelay: "0.7s" }}>
                      a
                    </span>
                    <span className="inline-block animate-fade-in" style={{ color: "#FFC107", animationDelay: "0.8s" }}>
                      d
                    </span>
                    <span className="inline-block animate-fade-in" style={{ color: "#FF9800", animationDelay: "0.9s" }}>
                      e
                    </span>
                  </>
                ) : (
                  <span className="text-black font-black">Mercy Blade</span>
                )}
              </h1>

              {subtitle ? (
                <p className="text-center text-base text-gray-600 mt-3 max-w-3xl mx-auto">{subtitle}</p>
              ) : null}
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-2 justify-end">
            <ThemeToggle />

            {showResetButton && onReset ? (
              <Button
                onClick={onReset}
                size="sm"
                className="gap-2 bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
                title="Reset cached configuration"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            ) : null}

            {/* Auth-dependent */}
            {!isLoading && !user ? (
              <Button
                onClick={() => navigate("/auth")}
                size="sm"
                className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/tier-map")}
                variant="outline"
                size="sm"
                className="gap-2 border-2 hover:bg-primary hover:text-primary-foreground"
                disabled={isLoading}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Tier Map</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
