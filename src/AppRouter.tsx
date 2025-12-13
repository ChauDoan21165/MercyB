import { Routes, Route } from "react-router-dom";
import RoomGrid from "@/pages/RoomGrid";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoomGrid />} />
    </Routes>
  );
}
