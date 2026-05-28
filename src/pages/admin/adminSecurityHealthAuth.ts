type SupabaseSessionReader = {
  auth: {
    getSession: () => Promise<{
      data?: {
        session?: {
          access_token?: string | null;
        } | null;
      } | null;
      error?: {
        message?: string;
      } | null;
    }>;
  };
};

export type AdminSecurityHealthAuthResult =
  | {
      ok: true;
      headers: Record<string, string>;
    }
  | {
      ok: false;
      reason: "missing_session" | "session_error";
      detail: string;
    };

export async function getAdminSecurityHealthAuthHeaders(
  supabaseClient: SupabaseSessionReader,
  anonKey: string,
): Promise<AdminSecurityHealthAuthResult> {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    return {
      ok: false,
      reason: "session_error",
      detail: error.message || "Unable to read the current Supabase session.",
    };
  }

  const token = data?.session?.access_token?.trim();
  if (!token) {
    return {
      ok: false,
      reason: "missing_session",
      detail: "No active Supabase session is available for the admin security feed.",
    };
  }

  return {
    ok: true,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  };
}
