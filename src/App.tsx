import { Routes, Route } from "react-router-dom";
import RoomGrid from "@/pages/RoomGrid";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoomGrid />} />
    </Routes>
  );
}
