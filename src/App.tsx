// src/App.tsx — v2025-12-14-BASELINE
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "@/pages/Home";

export default function App() {
  useEffect(() => {
    console.log("App.tsx version: v2025-12-14-BASELINE");
    (window as any).__MB_APP_VERSION__ = "v2025-12-14-BASELINE";
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
