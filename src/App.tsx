import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { LowDataModeProvider } from "@/contexts/LowDataModeContext";
import AppRouter from "./AppRouter";

// Create once (important)
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LowDataModeProvider>
          <BrowserRouter>
            <AppRouter />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </LowDataModeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
