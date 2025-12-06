import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { AdminCommandPalette } from "./AdminCommandPalette";
import { AdminThemeToggle } from "./AdminThemeToggle";
import { AdminThemeProvider } from "@/lib/admin/theme";

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
    <AdminThemeProvider>
      <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-text))]">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with breadcrumbs and actions */}
          <header className="h-14 border-b border-[hsl(var(--admin-card-border))] flex items-center justify-between px-4 sticky top-0 bg-[hsl(var(--admin-card-bg))] z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-[hsl(var(--admin-text))]" />
              <AdminBreadcrumbs />
            </div>
            
            <div className="flex items-center gap-2">
              <AdminThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="gap-2 border-[hsl(var(--admin-card-border))] text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-bg))]"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2 border-[hsl(var(--admin-card-border))] text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-bg))]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Button>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 p-6 bg-[hsl(var(--admin-bg))] overflow-auto">
            {children}
          </main>
        </div>

        {/* Global command palette (Ctrl+K) */}
        <AdminCommandPalette />
      </div>
    </SidebarProvider>
    </AdminThemeProvider>
  );
};
