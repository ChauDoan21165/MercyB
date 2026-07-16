import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";

export const KIDS_PARENT_GATE_PATH = "/kids/parent-gate";
export const KIDS_TIER_IDS = new Set(["kids_1", "kids_2", "kids_3"]);

export function isKidsRoomId(roomId: string): boolean {
  return (
    roomId.includes("_kids_l1") ||
    roomId.includes("_kids_l2") ||
    roomId.includes("_kids_l3")
  );
}

export function isKidsTierId(tierId: string | undefined): boolean {
  return Boolean(tierId && KIDS_TIER_IDS.has(tierId));
}

function gateTargetFor(location: ReturnType<typeof useLocation>): string {
  const returnTo = `${location.pathname}${location.search}${location.hash}`;
  return `${KIDS_PARENT_GATE_PATH}?returnTo=${encodeURIComponent(returnTo)}`;
}

/**
 * Kids content is allowed only after the account holder has signed in and
 * self-attested adult status. This narrows the old kids-room public bypass
 * without adding a new parent/child relationship model.
 */
export function RequireKidsParentGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const profile = useProfileQuery(user?.id ?? null);

  if (authLoading) return null;
  if (!user) return <Navigate to={gateTargetFor(location)} replace />;
  if (profile.isLoading || profile.isFetching) return null;

  if (profile.data?.is_adult_confirmed === true) {
    return <>{children}</>;
  }

  return <Navigate to={gateTargetFor(location)} replace />;
}

export function RequireKidsTierParentGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tierId } = useParams<{ tierId: string }>();
  if (!isKidsTierId(tierId)) return <>{children}</>;
  return <RequireKidsParentGate>{children}</RequireKidsParentGate>;
}
