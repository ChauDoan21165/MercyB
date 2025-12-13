import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomGrid from "@/pages/RoomGrid";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<RoomGrid />} />

        {/* FALLBACK */}
        <Route path="*" element={<RoomGrid />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
