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

  // Ensure admin theme class is applied immediately on mount
  // This prevents the white flash in Preview where CSS vars may not be ready
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (!root.classList.contains('admin-dark') && !root.classList.contains('admin-light')) {
      root.classList.add('admin-dark');
    }
  }

  return (
    <AdminThemeProvider>
      <SidebarProvider defaultOpen={true}>
      {/* Use solid fallback colors to prevent white flash when CSS vars aren't ready */}
      <div className="min-h-screen flex w-full bg-slate-900 text-slate-100" style={{
        backgroundColor: 'hsl(var(--admin-bg, 220 15% 13%))',
        color: 'hsl(var(--admin-text, 0 0% 95%))'
      }}>
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with breadcrumbs and actions */}
          <header className="h-14 border-b flex items-center justify-between px-4 sticky top-0 z-10 bg-slate-800" style={{
            borderColor: 'hsl(var(--admin-card-border, 220 15% 30%))',
            backgroundColor: 'hsl(var(--admin-card-bg, 220 15% 20%))'
          }}>
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-100" style={{ color: 'hsl(var(--admin-text, 0 0% 95%))' }} />
              <AdminBreadcrumbs />
            </div>
            
            <div className="flex items-center gap-2">
              <AdminThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="gap-2 border-slate-600 text-slate-100 hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2 border-slate-600 text-slate-100 hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Button>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 p-6 overflow-auto bg-slate-900" style={{
            backgroundColor: 'hsl(var(--admin-bg, 220 15% 13%))'
          }}>
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
