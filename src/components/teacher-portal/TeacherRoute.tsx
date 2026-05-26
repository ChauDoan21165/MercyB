// src/components/teacher-portal/TeacherRoute.tsx
//
// Route guard for /teacher/* — requires admin level >= 5
// (teacher_reviewer or higher). Mirrors the AdminRoute pattern in
// src/components/admin/AdminRoute.tsx but with a level-5 floor.
//
// Auth is sourced via useAdminAccess (the same singleton hook AdminRoute
// uses). RLS is the actual enforcement; this guard exists for UX so a
// non-teacher doesn't see an empty page with mysterious permission
// errors.

import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAdminAccess } from "@/hooks/admin/useAdminAccess";

export default function TeacherRoute(): React.ReactElement {
  const access = useAdminAccess();

  const email = access.email;
  const userId = access.userId;
  const loading = access.loading;
  const adminLevel = Number(access.permissions?.level ?? 0);
  const isTeacher = adminLevel >= 5;

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Đang kiểm tra quyền…</div>
      </div>
    );
  }

  if (!isTeacher) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>
          Cổng giáo viên — yêu cầu quyền cấp 5 trở lên
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: "rgba(0,0,0,0.6)" }}>
          Teacher portal — admin level 5 or higher required.
        </div>
        <div style={{ marginTop: 16, fontSize: 14 }}>
          Đang đăng nhập với: <b>{String(email || userId || "ẩn danh")}</b>
        </div>
        <div style={{ marginTop: 8, fontSize: 14 }}>
          Cấp quyền hiện tại: <b>{adminLevel}</b>
        </div>
        {access.error ? (
          <div style={{ marginTop: 12, color: "#b91c1c", fontSize: 14 }}>
            {access.error}
          </div>
        ) : null}
        <div style={{ marginTop: 20 }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              textDecoration: "none",
              color: "inherit",
              fontWeight: 800,
            }}
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
