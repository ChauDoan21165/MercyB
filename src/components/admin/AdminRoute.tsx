/**
 * MercyBlade Blue — AdminRoute (AUTH + ADMIN ROLE)
 * File: src/components/admin/AdminRoute.tsx
 * Version: MB-BLUE-94.14.2 — 2025-12-25 (+0700)
 *
 * PURPOSE (LOCKED):
 * - Guard all /admin routes
 * - Requires:
 *   (1) logged-in user (AuthProvider)
 *   (2) isAdmin === true (useUserAccess)
 *
 * RULES:
 * - No direct Supabase auth listeners here
 * - Consume AuthProvider + useUserAccess only
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useUserAccess } from "@/hooks/useUserAccess";

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const { isAdmin, isLoading: isAccessLoading } = useUserAccess(); // <-- we’ll ensure this exists in Step A2
  const location = useLocation();

  // 1) Auth resolving
  if (isLoading) return <LoadingSkeleton variant="page" />;

  // 2) Not logged in → go login (preserve return path)
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  // 3) Logged in, but access checks still loading
  if (isAccessLoading) return <LoadingSkeleton variant="page" />;

  // 4) Logged in but NOT admin → show explicit “Not Authorized”
  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-xl p-6">
        <h1 className="text-xl font-semibold">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">
          Your account is signed in, but it does not have admin permissions.
        </p>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/logout")}>
            Logout
          </Button>
        </div>

        <pre className="mt-4 rounded-md border bg-muted/30 p-3 text-xs overflow-auto">
{`AdminRoute
user: ${user?.email || user?.id}
path: ${location.pathname}
isAdmin: ${String(isAdmin)}`}
        </pre>
      </div>
    );
  }

  // 5) Admin OK
  return children;
}
