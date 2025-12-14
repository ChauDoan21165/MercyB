// src/main.tsx — v2025-12-14-05
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const MAIN_VERSION = "v2025-12-14-05";
console.log("main.tsx loaded:", MAIN_VERSION);
(window as any).__MB_MAIN_VERSION__ = MAIN_VERSION;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

console.log("React render() called OK");
