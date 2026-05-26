import React from "react";
import { Navigate } from "react-router-dom";
import { getPlatform } from "@/lib/platform";

// Apple Guideline 4.0 — features that reference non-IAP payment must
// not ship in the iOS native build. Wrap any such route with this.
export function WebOnlyRoute({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement {
  if (getPlatform() === "ios") {
    return <Navigate to="/" replace />;
  }
  return children;
}
