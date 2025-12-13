import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LowDataModeProvider } from "@/contexts/LowDataModeContext";
import RoomGrid from "@/pages/RoomGrid";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LowDataModeProvider>
        <Routes>
          <Route path="/" element={<RoomGrid />} />
        </Routes>
      </LowDataModeProvider>
    </QueryClientProvider>
  );
}
