// src/main.tsx — v2025-12-15-FIX-PROVIDERS-2
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// ✅ React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Low Data Mode
import { LowDataModeProvider } from "@/contexts/LowDataModeContext";

// ✅ Mercy Host
import { MercyHostProvider } from "@/components/mercy/MercyHostProvider";

// ✅ MB Theme (this fixes your current crash)
import { MbThemeProvider } from "@/hooks/useMbTheme";

console.log("main.tsx version: v2025-12-15-FIX-PROVIDERS-2");
(window as any).__MB_MAIN_VERSION__ = "v2025-12-15-FIX-PROVIDERS-2";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MbThemeProvider>
        <LowDataModeProvider>
          <MercyHostProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MercyHostProvider>
        </LowDataModeProvider>
      </MbThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
