export async function checkRateLimit(
  supabase: any,
  userId: string,
  endpointName: string
): Promise<{ allowed: boolean; error?: string }> {
  try {
    // Check if rate limit is exceeded using the database function
    const { data: isLimited, error } = await supabase.rpc(
      "check_endpoint_rate_limit",
      {
        user_uuid: userId,
        endpoint_name: endpointName,
      }
    );

    if (error) {
      console.error("Rate limit check error:", error);
      // Fail open - allow request if rate limit check fails
      return { allowed: true };
    }

    if (isLimited) {
      return {
        allowed: false,
        error: "Rate limit exceeded. Please try again later.",
      };
    }

    // Log the rate limit check for tracking
    await supabase.from("security_events").insert({
      user_id: userId,
      event_type: "rate_limit_check",
      severity: "low",
      metadata: { endpoint: endpointName },
    });

    return { allowed: true };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open - allow request if rate limit check fails
    return { allowed: true };
  }
}

export async function checkFeatureFlag(
  supabase: any,
  flagKey: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("is_enabled")
      .eq("flag_key", flagKey)
      .single();

    if (error || !data) {
      // Fail open - allow if flag doesn't exist
      return true;
    }

    return data.is_enabled;
  } catch (error) {
    console.error("Feature flag check error:", error);
    // Fail open - allow if check fails
    return true;
  }
}
