// src/pages/parent/ParentDashboard.tsx
//
// L6 — Parent / Family layer. Route shell for /parent/:learnerId.
//
// PARENT-ONLY this build (Q6=C). The `:learnerId` param is a structural
// forward-compat seam: v1 reads the device-local L3 aggregate for the
// signed-in account (parent and learner share the device/account in the
// buyer-parent persona), but the param shape keeps the door open for the
// named future phases — multi-kid aggregation and the Persona-C teacher /
// class-roster view — without a URL migration. Do NOT add a class/teacher
// branch here; that surface gets its own route + RLS design when scheduled.
//
// Access is paywall-implied (Q1=B) bundled in Premium (Q7=A); the gate
// lives inside <ParentView> via useUserAccess. This shell is intentionally
// thin: VI-primary title, a one-line source note, and the component.

import { useParams } from "react-router-dom";

import ParentView from "@/components/parent-view/ParentView";

export default function ParentDashboard() {
  // Captured for forward-compat (multi-kid / class view). v1 reads local
  // self-data, so the id is not yet used to scope a fetch.
  const { learnerId } = useParams<{ learnerId: string }>();

  return (
    <main
      id="main-content"
      tabIndex={-1}
      data-learner-id={learnerId ?? ""}
      className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12"
    >
      <header className="mb-6">
        {/* VI primary (non-negotiable #1), EN secondary. */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Tiến bộ của con
        </h1>
        <p className="mt-1 text-base text-slate-500">Your child's progress</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Tóm tắt những mẫu câu con đang luyện tuần này — trung thực, không
          xếp hạng, không gây áp lực.
        </p>
      </header>
      <ParentView />
    </main>
  );
}
