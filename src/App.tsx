// src/App.tsx — v2025-12-22-87.2-LOGIN-ROUTES
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import RoomGrid from "@/_legacy_next_pages/RoomGrid";
import ChatHub from "@/_legacy_next_pages/ChatHub";

import LoginPage from "@/pages/LoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { AdminRoute } from "@/components/admin/AdminRoute";

export default function App() {
  useEffect(() => {
    console.log("App.tsx version: v2025-12-22-87.2-LOGIN-ROUTES");
    (window as any).__MB_APP_VERSION__ = "87.2-LOGIN-ROUTES";
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/free" element={<RoomGrid />} />
      <Route path="/room/:roomId" element={<ChatHub />} />

      {/* ✅ minimal auth entry */}
      <Route path="/login" element={<LoginPage />} />

      {/* ✅ admin guarded */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
