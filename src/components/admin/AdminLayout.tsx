import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { AdminCommandPalette } from "./AdminCommandPalette";

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Admin Dashboard Layout - SIMPLE BLACK TEXT ON WHITE
 * No CSS variables, no theme switching - just readable black on white.
 */
export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-white text-black">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header - light gray background */}
          <header className="h-14 flex items-center justify-between px-4 sticky top-0 z-10" style={{
            backgroundColor: '#F5F5F5',
            borderBottom: '1px solid #E0E0E0'
          }}>
            <div className="flex items-center gap-4">
              <SidebarTrigger style={{ color: '#000000' }} />
              <AdminBreadcrumbs />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="gap-2"
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  color: '#000000', 
                  border: '1px solid #000000' 
                }}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  color: '#000000', 
                  border: '1px solid #000000' 
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Button>
            </div>
          </header>

          {/* Main content - white background */}
          <main className="flex-1 p-6 overflow-auto" style={{
            backgroundColor: '#FFFFFF',
            color: '#000000'
          }}>
            {children}
          </main>
        </div>

        {/* Global command palette (Ctrl+K) */}
        <AdminCommandPalette />
      </div>
    </SidebarProvider>
  );
};