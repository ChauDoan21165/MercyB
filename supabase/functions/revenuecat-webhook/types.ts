// supabase/functions/revenuecat-webhook/types.ts
//
// Type-only seam for the RevenueCat webhook, mirroring the established
// stripe-webhook/types.ts convention (#561): the `import type` of the
// esm.sh SupabaseClient is fully erased by the TS/vite transform, so a
// module that imports ONLY these types stays runtime-esm.sh-free and is
// importable under vitest. The pure projection logic lives in
// ./projection.ts and depends only on this file's types + the structural
// shape of the admin client.

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

/** Service-role client passed into the projection. Same concrete type
 *  as the previous inline `admin: SupabaseClient` annotation — relocated,
 *  not changed. */
export type RcAdminClient = SupabaseClient;

/** RevenueCat v2 webhook event shape (subset we project). Moved verbatim
 *  from index.ts; no field changes. */
export type RcEvent = {
  type?: string;
  id?: string;
  app_user_id?: string;
  original_app_user_id?: string;
  product_id?: string;
  transaction_id?: string;
  original_transaction_id?: string;
  entitlement_ids?: string[];
  expiration_at_ms?: number;
  purchased_at_ms?: number;
  environment?: "PRODUCTION" | "SANDBOX";
  price?: number;
  currency?: string;
};
