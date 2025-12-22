import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAdminAccess } from "@/hooks/admin/useAdminAccess";

type Props = { children: ReactNode };

export const AdminRoute = ({ children }: Props) => {
  const isDev = import.meta.env.DEV;
  const { loading, permissions, error } = useAdminAccess();

  // DEV bypass stays, but only in DEV
  if (isDev) return <>{children}</>;

  useEffect(() => {
    if (!loading && (error || !permissions.canViewAdmin)) {
      toast.error("Admin access required");
    }
  }, [loading, error, permissions.canViewAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg font-medium text-black">Checking admin access…</p>
      </div>
    );
  }

  if (!permissions.canViewAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
