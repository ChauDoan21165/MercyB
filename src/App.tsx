// FILE: App.tsx
// PATH: src/App.tsx
// FIX (ROUTING):
// - /tiers → Pricing page (Free / VIP1 / VIP3 / VIP9 + Pay)
// - /tier-map → Existing Tier Map (what you were seeing before)
// - Keep AppHeroLayout for all non-signin pages

import { Routes, Route } from "react-router-dom";

import AppHeroLayout from "@/components/layout/AppHeroLayout";
import LoginPage from "@/pages/LoginPage";
import Home from "@/pages/Home";

import Tiers from "@/pages/Tiers";        // ✅ Pricing page (Pay buttons)
import TierIndex from "@/pages/TierIndex"; // ✅ Tier Map (moved here)

export default function App() {
  return (
    <Routes>
      {/* ✅ NO HERO on sign-in */}
      <Route path="/signin" element={<LoginPage />} />

      {/* ✅ HERO on everything else */}
      <Route element={<AppHeroLayout />}>
        <Route path="/" element={<Home />} />

        {/* ✅ PRICING */}
        <Route path="/tiers" element={<Tiers />} />

        {/* ✅ EXISTING TIER MAP (moved) */}
        <Route path="/tier-map" element={<TierIndex />} />

        {/* <Route path="/room/:roomId" element={<RoomPage />} /> */}
        {/* ...other routes... */}
      </Route>
    </Routes>
  );
}
