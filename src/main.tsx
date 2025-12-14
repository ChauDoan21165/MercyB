// src/main.tsx — v2025-12-14-FIX-PROVIDERS
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// ✅ CORRECT IMPORT
import { MercyHostProvider } from "@/components/mercy/MercyHostProvider";

console.log("main.tsx version: v2025-12-14-FIX-PROVIDERS");
(window as any).__MB_MAIN_VERSION__ = "v2025-12-14-FIX-PROVIDERS";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MercyHostProvider>
        <App />
      </MercyHostProvider>
    </BrowserRouter>
  </React.StrictMode>
);
