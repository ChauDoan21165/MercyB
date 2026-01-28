cat > src/components/guide/host/useHostProfile.ts <<'EOF'
// src/components/guide/host/useHostProfile.ts
// SAFE STUB — required by MercyAIHost import.
// Keep minimal shape so the app boots. Replace later with real profile logic if needed.

import { useEffect, useState } from "react";

export type HostProfile = {
  displayName?: string;
  email?: string;
  userId?: string;
  isAdmin?: boolean;
  adminLevel?: number;
};

export function useHostProfile(args?: {
  user?: any;
  supabase?: any;
}) {
  const user = args?.user ?? null;

  const [profile, setProfile] = useState<HostProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Minimal local derivation only (no DB query here to avoid side effects).
    setLoading(false);
    setError(null);

    if (!user) {
      setProfile(null);
      return;
    }

    const email = String(user.email || "");
    const displayName = String(user.user_metadata?.full_name || user.user_metadata?.name || email || "User");
    setProfile({
      displayName,
      email: email || undefined,
      userId: String(user.id || ""),
      isAdmin: false,
      adminLevel: 0,
    });
  }, [user]);

  return { profile, loading, error };
}
EOF
