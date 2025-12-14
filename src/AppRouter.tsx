import { Routes, Route, Navigate } from "react-router-dom";
import RoomGrid from "@/pages/RoomGrid";
import ChatHub from "@/pages/ChatHub";

export default function AppRouter() {
  return (
    <Routes>
      {/* Home / Free rooms */}
      <Route path="/" element={<RoomGrid />} />

      {/* Explicit free path (VERY IMPORTANT) */}
      <Route path="/free" element={<RoomGrid />} />

      {/* Chat room */}
      <Route path="/room/:roomId" element={<ChatHub />} />

      {/* Catch-all MUST be last */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
