// src/features/review/ReviewApp.tsx — the feature's own nested router.
//
// AppRouter mounts this ONCE under a flag-gated "/review/*" route. All review
// routing lives here, so the shared shell only ever knows about a single entry
// point. The composition root (runtime.ts) injects the real engine deps into
// the D5/D6 containers; routing only maps URLs to containers + nav callbacks.

import React from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";

import { isReviewFlowId } from "./flows";
import { getReviewDeps } from "./runtime";
import { OverviewContainer } from "./ui/overview";
import { SessionContainer } from "./ui/session";

function OverviewRoute() {
  const nav = useNavigate();
  return (
    <OverviewContainer
      deps={getReviewDeps()}
      onStartFlow={(flow) => nav(`/review/${flow}`)}
    />
  );
}

function SessionRoute() {
  const nav = useNavigate();
  const { flow } = useParams<{ flow: string }>();
  if (!flow || !isReviewFlowId(flow)) {
    return <Navigate to="/review" replace />;
  }
  return (
    <SessionContainer
      deps={getReviewDeps()}
      flow={flow}
      onDone={() => nav("/review")}
    />
  );
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
