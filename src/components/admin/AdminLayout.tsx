import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { AdminCommandPalette } from "./AdminCommandPalette";
import { AdminThemeToggle } from "./AdminThemeToggle";

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Modern Admin Dashboard Layout V2.0
 * - Collapsible sidebar with grouped navigation
 * - Breadcrumb navigation
 * - Global command palette (Ctrl+K)
 * - Theme toggle (dark/light)
 * - Performance optimized
 */
export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  return (
    <SidebarProvider defaultOpen={true} collapsedWidth={56}>
      <div className="min-h-screen flex w-full bg-white">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with breadcrumbs and actions */}
          <header className="h-14 border-b-2 border-black flex items-center justify-between px-4 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <AdminBreadcrumbs />
            </div>
            
            <div className="flex items-center gap-2">
              <AdminThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="gap-2 border-black text-black hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2 border-black text-black hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Button>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 p-6 bg-white overflow-auto">
            {children}
          </main>
        </div>

        {/* Global command palette (Ctrl+K) */}
        <AdminCommandPalette />
      </div>
    </SidebarProvider>
  );
};
