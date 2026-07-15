import type { EntitlementSnapshot, EntitlementSource } from "./entitlement.ts";

export type ProfileProjection = {
  premium_status: "active" | "inactive";
  premium_expires_at: string | null;
  premium_source: "stripe" | "apple" | "google" | null;
  tier: "level0" | "level9";
};

export type ProfileProjectionRow = {
  premium_status?: unknown;
  premium_expires_at?: unknown;
  premium_source?: unknown;
  tier?: unknown;
} | null;

function providerSource(
  source: EntitlementSource
): ProfileProjection["premium_source"] {
  return source === "stripe" || source === "apple" || source === "google"
    ? source
    : null;
}

function isoOrNull(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function buildProfileProjection(
  entitlement: EntitlementSnapshot
): ProfileProjection {
  if (!entitlement.is_premium) {
    return {
      premium_status: "inactive",
      premium_expires_at: null,
      premium_source: null,
      tier: "level0",
    };
  }

  return {
    premium_status: "active",
    premium_expires_at: entitlement.expires_at,
    premium_source: providerSource(entitlement.source),
    tier: "level9",
  };
}

export function profileProjectionNeedsSync(
  profile: ProfileProjectionRow,
  projection: ProfileProjection
): boolean {
  if (!profile) return false;
  return (
    profile.premium_status !== projection.premium_status ||
    isoOrNull(profile.premium_expires_at) !== projection.premium_expires_at ||
    (profile.premium_source ?? null) !== projection.premium_source ||
    profile.tier !== projection.tier
  );
}
