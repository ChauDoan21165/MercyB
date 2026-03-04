import { supabase } from "@/lib/supabaseClient";

export async function getSignedAdultContentUrl(key: string) {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) throw new Error("not_logged_in");

  const base = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
  if (!base) throw new Error("missing_functions_url");

  const res = await fetch(`${base}/adult-content-url?key=${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload?.error ?? "signed_url_failed");

  return payload.signedUrl as string;
}