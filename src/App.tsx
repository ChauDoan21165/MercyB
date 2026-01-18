import { Routes, Route } from "react-router-dom";
import AppHeroLayout from "@/components/layout/AppHeroLayout";
import LoginPage from "@/pages/LoginPage";
import Home from "@/pages/Home";
// import your other pages...

export default function App() {
  return (
    <Routes>
      {/* ✅ NO HERO on sign-in */}
      <Route path="/signin" element={<LoginPage />} />

      {/* ✅ HERO on everything else */}
      <Route element={<AppHeroLayout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/room/:roomId" element={<RoomPage />} /> */}
        {/* <Route path="/tiers" element={<TiersPage />} /> */}
        {/* ...all other routes... */}
      </Route>
    </Routes>
  );
}
