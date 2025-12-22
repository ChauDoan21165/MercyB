// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";

import HomePage from "@/pages/HomePage";

// Public / User
import JoinCode from "@/pages/JoinCode";
import ManualPayment from "@/pages/ManualPayment";
import BankTransferPayment from "@/pages/BankTransferPayment";
import PromoCode from "@/pages/PromoCode";

// Admin
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminBankTransfers from "@/pages/admin/AdminBankTransfers";
import AdminPaymentVerification from "@/pages/admin/AdminPaymentVerification";
import { AdminRoute } from "@/routes/AdminRoute";

// Room
import RoomPage from "@/pages/room/RoomPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
      <Route path="/join/:code" element={<JoinCode />} />
      <Route path="/manual-payment" element={<ManualPayment />} />
      <Route path="/bank-transfer-payment" element={<BankTransferPayment />} />
      <Route path="/promo-code" element={<PromoCode />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <AdminRoute>
            <AdminPayments />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bank-transfers"
        element={
          <AdminRoute>
            <AdminBankTransfers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/payment-verification"
        element={
          <AdminRoute>
            <AdminPaymentVerification />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
