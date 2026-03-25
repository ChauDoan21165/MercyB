import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import Home from "@/pages/Home";
import AccountPage from "@/pages/AccountPage";
import Billing from "@/pages/Billing";
import BillingSuccess from "@/pages/BillingSuccess";
import Privacy from "@/pages/Privacy";
import Pricing from "@/screens/Pricing";

function AppHeroLayout() {
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/signin" element={<LoginPage />} />

      <Route element={<AppHeroLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/billing/success" element={<BillingSuccess />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/upgrade" element={<Navigate to="/pricing" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}