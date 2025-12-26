/**
 * MercyBlade Blue — AdminFloatingButton (DIAGNOSTIC + SAFE)
 * Path: src/components/AdminFloatingButton.tsx
 * Version: MB-BLUE-94.14.14 — 2025-12-25 (+0700)
 *
 * GOAL:
 * - Component lives ONLY in /components (never inside hooks).
 * - Must compile cleanly.
 * - Version indicator dot ALWAYS visible (bottom-right).
 * - Admin controls visible ONLY for admin users (or DEV for local testing).
 * - If user clicks and “nothing happens”, show WHY (diagnostic panel).
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Settings, LogOut, X, Info } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserAccess";

type AdminFloatingButtonProps = {
  /** When true, hide admin controls (but keep the version dot visible). */
  hideControls?: boolean;
};

export const AdminFloatingButton = ({ hideControls = false }: AdminFloatingButtonProps) => {
  const navigate = useNavigate();
  const access = useUserAccess();

  const [open, setOpen] = useState(false);
  const [showDiag, setShowDiag] = useState(false);

  const isDev = import.meta.env.DEV;

  // Admin controls show only for admins; BUT allow dev access for local testing.
  const canShowControls = useMemo(() => {
    if (access.isLoading) return false;
    return access.isAdmin || isDev;
  }, [access.isAdmin, access.isLoading, isDev]);

  // ALWAYS VISIBLE DOT (bottom-right)
  return (
    <div className="fixed bottom-20 md:bottom-24 right-4 z-50 flex items-center gap-2">
      {/* Version Indicator Dot (ALWAYS VISIBLE) */}
      <button
        type="button"
        onClick={() => setShowDiag((v) => !v)}
        className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500 shadow-lg ring-2 ring-white/70 cursor-pointer"
        title="MercyBlade Version / Diagnostics"
        aria-label="Version indicator"
      />

      {/* Diagnostic mini panel (always available) */}
      {showDiag ? (
        <div className="rounded-lg border bg-background/95 backdrop-blur px-3 py-2 shadow-lg text-xs min-w-[220px]">
          <div className="flex items-center gap-2 font-medium">
            <Info className="h-3.5 w-3.5" />
            <span>AdminFloatingButton</span>
          </div>

          <div className="mt-2 space-y-1 text-muted-foreground">
            <div>
              <span className="text-foreground">isLoading:</span>{" "}
              {String(access.isLoading)}
            </div>
            <div>
              <span className="text-foreground">isAdmin:</span>{" "}
              {String(access.isAdmin)}
            </div>
            <div>
              <span className="text-foreground">adminLevel:</span>{" "}
              {String(access.adminLevel)}
            </div>
            <div>
              <span className="text-foreground">tier:</span> {String(access.tier)}
            </div>
            <div>
              <span className="text-foreground">isDev:</span> {String(isDev)}
            </div>
          </div>

          <div className="mt-2 text-[11px] text-muted-foreground">
            If “nothing moves”, it usually means <b>isAdmin=false</b> or <b>isLoading=true</b>.
          </div>
        </div>
      ) : null}

      {/* If cannot show controls, stop here (dot + diag still available) */}
      {!canShowControls ? null : (
        <>
          {/* Toggle */}
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full shadow-md"
            onClick={() => {
              if (hideControls) return;
              setOpen((v) => !v);
              // Tiny dev proof:
              if (import.meta.env.DEV) console.log("[AdminFloatingButton] toggle", { open: !open });
            }}
            title={open ? "Close Admin" : "Open Admin"}
            disabled={hideControls}
          >
            {open ? <X className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
          </Button>

          {/* Panel */}
          {open && !hideControls ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="gap-2 shadow-md"
                onClick={() => navigate("/admin")}
                title="Admin"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="gap-2 shadow-md"
                onClick={() => navigate("/reset")}
                title="Reset"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="gap-2 shadow-md"
                onClick={() => navigate("/logout")}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default AdminFloatingButton;
