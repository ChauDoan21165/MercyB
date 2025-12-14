// src/main.tsx — v2025-12-14-BASELINE
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

console.log("main.tsx version: v2025-12-14-BASELINE");
(window as any).__MB_MAIN_VERSION__ = "v2025-12-14-BASELINE";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
