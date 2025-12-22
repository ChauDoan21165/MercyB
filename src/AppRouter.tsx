import { Routes, Route, Navigate } from "react-router-dom";

// 🔒 Pages live here now (LOCKED)
import RoomGrid from "@/_legacy_next_pages/RoomGrid";
import ChatHub from "@/_legacy_next_pages/ChatHub";

export default function AppRouter() {
  return (
    <Routes>
      {/* Home / Free rooms */}
      <Route path="/" element={<RoomGrid />} />

      {/* Explicit free path (VERY IMPORTANT) */}
      <Route path="/free" element={<RoomGrid />} />

      {/* Room */}
      <Route path="/room/:roomId" element={<ChatHub />} />

      {/* Catch-all MUST be last */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
