// src/routes/AppRouter.tsx

import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminRoute } from "@/components/AdminRoute";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminFloatingButton } from "@/components/AdminFloatingButton";

// Public
import Homepage from "@/_legacy_next_pages/Homepage";
import NotFound from "@/_legacy_next_pages/NotFound";
const ChatHub = lazy(() => import("@/_legacy_next_pages/ChatHub"));

// Admin – dashboards
const AdminDashboard = lazy(() => import("@/_legacy_next_pages/AdminDashboard"));
const AdminPayments = lazy(() => import("@/_legacy_next_pages/AdminPayments"));
const AdminPaymentVerification = lazy(() => import("@/_legacy_next_pages/AdminPaymentVerification"));
const AdminBankTransfers = lazy(() => import("@/_legacy_next_pages/AdminBankTransfers"));
const AdminUsers = lazy(() => import("@/_legacy_next_pages/AdminUsers"));
const AdminManageAdmins = lazy(() => import("@/_legacy_next_pages/AdminManageAdmins"));
const RoomHealthDashboard = lazy(() => import("@/_legacy_next_pages/admin/RoomHealthDashboard"));
const UnifiedRoomHealthCheck = lazy(() => import("@/_legacy_next_pages/admin/UnifiedRoomHealthCheck"));
const AdminRooms = lazy(() => import("@/_legacy_next_pages/AdminRooms"));
const AdminVIPRooms = lazy(() => import("@/_legacy_next_pages/AdminVIPRooms"));
const AdminDesignAudit = lazy(() => import("@/_legacy_next_pages/AdminDesignAudit"));
const AdminSpecification = lazy(() => import("@/_legacy_next_pages/AdminSpecification"));
const AdminSystemMetrics = lazy(() => import("@/_legacy_next_pages/AdminSystemMetrics"));
const SystemHealth = lazy(() => import("@/_legacy_next_pages/admin/SystemHealth"));
const AuditLog = lazy(() => import("@/_legacy_next_pages/admin/AuditLog"));
const AIUsage = lazy(() => import("@/_legacy_next_pages/admin/AIUsage"));
const AdminGiftCodes = lazy(() => import("@/_legacy_next_pages/AdminGiftCodes"));

export default function AppRouter() {
  return (
    <>
      <AdminFloatingButton />
      <Suspense fallback={<LoadingSkeleton variant="page" />}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Homepage />} />
          <Route path="/room/:roomId" element={<ChatHub />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route path="/admin/payments" element={<AdminShell Page={AdminPayments} />} />
          <Route path="/admin/payment-verification" element={<AdminShell Page={AdminPaymentVerification} />} />
          <Route path="/admin/bank-transfers" element={<AdminShell Page={AdminBankTransfers} />} />
          <Route path="/admin/users" element={<AdminShell Page={AdminUsers} />} />
          <Route path="/admin/manage-admins" element={<AdminShell Page={AdminManageAdmins} />} />

          <Route path="/admin/room-health-dashboard" element={<AdminShell Page={RoomHealthDashboard} />} />
          <Route path="/admin/room-health" element={<AdminShell Page={UnifiedRoomHealthCheck} />} />

          <Route path="/admin/rooms" element={<AdminShell Page={AdminRooms} />} />
          <Route path="/admin/vip-rooms" element={<AdminShell Page={AdminVIPRooms} />} />
          <Route path="/admin/design-audit" element={<AdminShell Page={AdminDesignAudit} />} />
          <Route path="/admin/specification" element={<AdminShell Page={AdminSpecification} />} />

          <Route path="/admin/system-metrics" element={<AdminShell Page={AdminSystemMetrics} />} />
          <Route path="/admin/system-health" element={<AdminShell Page={SystemHealth} />} />

          <Route path="/admin/audit-log" element={<AdminShell Page={AuditLog} />} />
          <Route path="/admin/ai-usage" element={<AdminShell Page={AIUsage} />} />
          <Route path="/admin/gift-codes" element={<AdminShell Page={AdminGiftCodes} />} />

          {/* FALLBACK */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

/* helper */
function AdminShell({ Page }: { Page: React.ComponentType }) {
  return (
    <AdminRoute>
      <AdminLayout>
        <Page />
      </AdminLayout>
    </AdminRoute>
  );
}
