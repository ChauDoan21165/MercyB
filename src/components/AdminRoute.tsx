import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useUserAccess } from "@/hooks/useUserAccess";
import { Loader2 } from "lucide-react";

type Props = { children: ReactNode };

export const AdminRoute = ({ children }: Props) => {
  const { isAdmin, isAuthenticated, loading } = useUserAccess();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
