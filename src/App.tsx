// src/App.tsx — v2025-12-14-FIX-ROUTES
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "@/pages/Home";
import RoomGrid from "@/pages/RoomGrid";
import ChatHub from "@/pages/ChatHub";

export default function App() {
  useEffect(() => {
    console.log("App.tsx version: v2025-12-14-FIX-ROUTES");
    (window as any).__MB_APP_VERSION__ = "v2025-12-14-FIX-ROUTES";
  }, []);

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Free rooms grid */}
      <Route path="/free" element={<RoomGrid />} />

      {/* Chat room */}
      <Route path="/room/:roomId" element={<ChatHub />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
