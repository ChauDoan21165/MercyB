const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export type MeEntitlementResponse = {
  is_premium: boolean;
  source?: string | null;
  status?: string | null;
  expires_at?: string | null;
};

export async function getMeEntitlement(
  accessToken: string
): Promise<MeEntitlementResponse> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/me-entitlement`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`me-entitlement failed: ${res.status} ${text}`);
  }

  return res.json();
}