import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1">
          <header className="h-14 border-b-2 border-black flex items-center justify-between px-4 sticky top-0 bg-white z-10">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
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
          <main className="p-6 bg-white">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
