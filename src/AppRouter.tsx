// src/AppRouter.tsx — v2025-12-14-01

import { Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import RoomGrid from "@/pages/RoomGrid";
import ChatHub from "@/pages/ChatHub";

export default function AppRouter() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Free rooms grid */}
      <Route path="/free" element={<RoomGrid />} />

      {/* Chat room */}
      <Route path="/room/:roomId" element={<ChatHub />} />

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
