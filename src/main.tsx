// src/main.tsx — v2025-12-15-FIX-PROVIDERS
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// ✅ React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Optional but recommended (prevents the “useLowDataMode must be used within LowDataModeProvider” crash)
import { LowDataModeProvider } from "@/contexts/LowDataModeContext";

// ✅ Optional but recommended (prevents the “useMercyHostContext must be used within MercyHostProvider” crash)
import { MercyHostProvider } from "@/components/mercy/MercyHostProvider";

console.log("main.tsx version: v2025-12-15-FIX-PROVIDERS");
(window as any).__MB_MAIN_VERSION__ = "v2025-12-15-FIX-PROVIDERS";

// Create ONE query client for the whole app
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LowDataModeProvider>
        <MercyHostProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MercyHostProvider>
      </LowDataModeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
