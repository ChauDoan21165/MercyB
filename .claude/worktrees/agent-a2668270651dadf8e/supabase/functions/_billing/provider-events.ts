import type { PostgrestSingleResponse, SupabaseClient } from "jsr:@supabase/supabase-js@2";
import type {
  RegisterProviderEventInput,
  RegisterProviderEventResult,
} from "./types.ts";

function normalizeHeaders(headers: Record<string, string> | undefined) {
  if (!headers) return {};
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );
}

export async function registerProviderEvent(
  supabase: SupabaseClient,
  input: RegisterProviderEventInput,
): Promise<RegisterProviderEventResult> {
  const response = await supabase.rpc("register_billing_provider_event", {
    p_provider: input.provider,
    p_environment: input.environment,
    p_event_key: input.eventKey,
    p_provider_event_id: input.providerEventId ?? null,
    p_event_type: input.eventType ?? null,
    p_event_created_at: input.eventCreatedAt ?? null,
    p_payload: input.payload ?? {},
    p_headers: normalizeHeaders(input.headers),
    p_metadata: input.metadata ?? {},
  }) as PostgrestSingleResponse<
    Array<{
      id: string;
      is_new: boolean;
      delivery_count: number;
      process_status: string;
    }>
  >;

  if (response.error) {
    throw new Error(`register_billing_provider_event failed: ${response.error.message}`);
  }

  const row = response.data?.[0];
  if (!row) {
    throw new Error("register_billing_provider_event returned no rows");
  }

  return {
    id: row.id,
    isNew: row.is_new,
    deliveryCount: row.delivery_count,
    processStatus: row.process_status,
  };
}
