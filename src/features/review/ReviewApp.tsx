// src/features/review/ReviewApp.tsx — the feature's own nested router.
//
// AppRouter mounts this ONCE under a flag-gated "/review/*" route. All review
// routing lives here, so the shared shell only ever knows about a single entry
// point. D5 (ui/overview) and D6 (ui/session) replace the placeholders below
// with their real pages — see the TODO markers. Until then the routes render a
// harmless "đang xây dựng" placeholder so the skeleton is runnable end-to-end.

import React from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

import { isReviewFlowId } from "./flows";

function ReviewPlaceholder({ heading }: { heading: string }) {
  return (
    <main className="mx-auto max-w-md px-4 py-10 text-center">
      <h1 className="text-xl font-semibold">{heading}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Tính năng ôn tập đang được xây dựng.
      </p>
    </main>
  );
}

// TODO(D6): replace with the real overview/deck-list page.
function OverviewRoute() {
  return <ReviewPlaceholder heading="Ôn tập" />;
}

// TODO(D5): replace with the real session page.
function SessionRoute() {
  const { flow } = useParams<{ flow: string }>();
  if (!flow || !isReviewFlowId(flow)) {
    return <Navigate to="/review" replace />;
  }
  return <ReviewPlaceholder heading={`Phiên ôn tập — ${flow}`} />;
}

export default function ReviewApp() {
  return (
    <Routes>
      <Route index element={<OverviewRoute />} />
      <Route path=":flow" element={<SessionRoute />} />
      <Route path="*" element={<Navigate to="/review" replace />} />
    </Routes>
  );
}
