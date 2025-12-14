// src/main.tsx — v2025-12-14-04
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

console.log("main.tsx loaded: v2025-12-14-04");
(window as any).__MB_MAIN_VERSION__ = "v2025-12-14-04";

const rootEl = document.getElementById("root");

if (!rootEl) {
  // If this happens, your HTML is wrong.
  throw new Error("Root element #root not found");
}

try {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log("React render() called OK");
} catch (err) {
  console.error("BOOT ERROR (main.tsx):", err);

  // Force something visible even if React dies
  const msg =
    err instanceof Error
      ? `${err.name}: ${err.message}\n\n${err.stack || ""}`
      : `Non-Error thrown:\n${JSON.stringify(err, null, 2)}`;

  rootEl.innerHTML = `<pre style="white-space:pre-wrap;padding:16px;font:14px/1.4 monospace;color:#b00020;">${msg}</pre>`;
}
