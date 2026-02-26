// src/App.tsx
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import Home from "@/pages/Home";
import AccountPage from "@/pages/AccountPage";
import UpgradePage from "@/pages/UpgradePage";

/**
 * TEMP FIX (build unblocker):
 * The previous import `@/components/layout/AppHeroLayout` is missing, causing TS2307.
 * This local layout keeps the routing structure identical (layout route + Outlet)
 * so you can later move it back into `src/components/layout/AppHeroLayout.tsx`.
 */
function AppHeroLayout() {
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      {/* ✅ NO HERO on sign-in */}
      <Route path="/signin" element={<LoginPage />} />

      {/* ✅ HERO on everything else */}
      <Route element={<AppHeroLayout />}>
        <Route path="/" element={<Home />} />

        {/* ✅ Billing / Account */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/upgrade" element={<UpgradePage />} />

        {/* <Route path="/room/:roomId" element={<RoomPage />} /> */}
        {/* <Route path="/tiers" element={<TiersPage />} /> */}
        {/* ...all other routes... */}
      </Route>
    </Routes>
  );
}