// FILE: src/App.tsx
// VERSION: 2025-12-13 v1 (router reset)

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import RoomGrid from "@/pages/RoomGrid";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home FIRST */}
        <Route path="/" element={<Home />} />

        {/* Rooms */}
        <Route path="/rooms" element={<RoomGrid />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
