import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "@/pages/Home";
import RoomGrid from "@/pages/RoomGrid";

import { LowDataModeProvider } from "@/contexts/LowDataModeContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LowDataModeProvider>
        <BrowserRouter>
          <Routes>
            {/* HOME */}
            <Route path="/" element={<Home />} />

            {/* ROOMS */}
            <Route path="/rooms" element={<RoomGrid />} />
          </Routes>
        </BrowserRouter>
      </LowDataModeProvider>
    </QueryClientProvider>
  );
}

export default App;
