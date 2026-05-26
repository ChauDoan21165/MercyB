import { supabase } from "@/lib/supabaseClient";

// If you don't use path aliases (@), change to relative import:
// import { supabase } from "../lib/supabaseClient";

export async function fetchAdultJson(key: string) {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  if (!session) {
    throw new Error("Not logged in");
  }

  const base = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
  if (!base) {
    throw new Error("Missing VITE_SUPABASE_FUNCTIONS_URL env var");
  }

  const res = await fetch(`${base}/adult-content-url?key=${encodeURIComponent(key)}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    // payload.error could be: adult_not_confirmed, not_entitled, etc.
    throw new Error(payload?.error ?? "Failed to get signed URL");
  }

  const jsonRes = await fetch(payload.signedUrl);
  if (!jsonRes.ok) throw new Error("Failed to fetch content");

  return await jsonRes.json();
}