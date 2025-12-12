import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MercyHostProvider } from "@/components/mercy/MercyHostProvider";
// Initialize session manager for auto-renewal
import "./lib/session-manager";
// Initialize performance monitoring
import { performanceMonitor } from "./lib/performance/monitor";

// Start monitoring in development
if (import.meta.env.DEV) {
  performanceMonitor.startFpsMonitoring();
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <MercyHostProvider>
        <App />
      </MercyHostProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element #root not found");
}
